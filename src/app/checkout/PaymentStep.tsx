import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import styles from './Checkout.module.css';
import { createOrder, DbOrder } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';

interface PaymentStepProps {
  data: any;
  onNext: (data?: any) => void;
  onBack?: () => void;
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'whatsapp' | 'cod'>('card');
  const { cart } = useCart();

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test";
  const totalPrice = parseFloat(data?.finalPrice || 0).toFixed(2);

  const initialOptions = {
    clientId: clientId,
    currency: "USD",
    intent: "capture",
  };

  const handleCreateOrder = async (method: string, extraDetails?: string) => {
    setIsProcessing(true);
    setError('');

    // Generate Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const { shippingDetails } = data;
    const customerName = `${shippingDetails?.firstName || ''} ${shippingDetails?.lastName || ''}`.trim();
    
    // Using the first item as the primary product for the simple order table
    const mainItem = cart[0];
    const totalQuantity = data?.totalQuantity || 1;

    const imagesToSave: string[] = [];
    if (mainItem?.frontImage) imagesToSave.push(mainItem.frontImage);
    if (mainItem?.backImage) imagesToSave.push(mainItem.backImage);
    if (mainItem?.leftImage) imagesToSave.push(mainItem.leftImage);
    if (mainItem?.rightImage) imagesToSave.push(mainItem.rightImage);

    const imageUrlString = imagesToSave.length > 0 ? JSON.stringify(imagesToSave) : "";

    const newOrder: DbOrder = {
      order_id: orderId,
      customer_name: customerName || "Guest",
      email: shippingDetails?.email || "no-email@example.com",
      phone: shippingDetails?.phone || "",
      product_name: `Custom ${mainItem?.productType || 'Apparel'} + ${cart.length > 1 ? (cart.length - 1) + ' more' : ''}`,
      item_type: (mainItem?.productType as any) || "tshirt",
      technique: (mainItem?.technique as any) || "print",
      quantity: totalQuantity,
      total_price: totalPrice,
      status_step: 1,
      shipping_address: shippingDetails ? `${shippingDetails.address1}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}` : "Pickup",
      image_url: imageUrlString,
      instructions: data?.instructions || "",
      cart_data: JSON.stringify(cart),
    };

    const res = await createOrder(newOrder);

    if (res.success) {
      // Send Email Notification
      try {
        await fetch('/api/send-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            customerName: newOrder.customer_name,
            email: newOrder.email,
            phone: newOrder.phone,
            address: newOrder.shipping_address,
            instructions: data?.instructions,
            cartItems: cart,
            totalAmount: totalPrice
          })
        });
      } catch (e) {
        console.error("Failed to send order email:", e);
      }

      setIsProcessing(false);
      onNext({ paymentMethod: method, orderId, extraDetails });
    } else {
      setIsProcessing(false);
      setError("Failed to create order. Please try again.");
    }
  };

  const submitManualPayment = (method: 'card' | 'whatsapp' | 'cod') => {
    if (!agreed) {
      setError('You must agree to the terms of use before placing an order.');
      return;
    }
    handleCreateOrder(method);
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.flexRow}>
        <div className={styles.flexHalf}>
          <h2 className={styles.pageTitle}>Payment Method</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
            <button 
              className={paymentMethod === 'card' ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setPaymentMethod('card')}
              style={{ flex: 1, padding: '0.75rem' }}
            >
              Credit Card
            </button>
            <button 
              className={paymentMethod === 'paypal' ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setPaymentMethod('paypal')}
              style={{ flex: 1, padding: '0.75rem', backgroundColor: paymentMethod === 'paypal' ? '#ffc439' : '', color: paymentMethod === 'paypal' ? '#000' : '' }}
            >
              PayPal
            </button>
            <button 
              className={paymentMethod === 'whatsapp' ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setPaymentMethod('whatsapp')}
              style={{ flex: 1, padding: '0.75rem', backgroundColor: paymentMethod === 'whatsapp' ? '#25D366' : '', color: paymentMethod === 'whatsapp' ? '#fff' : '' }}
            >
              WhatsApp
            </button>
            <button 
              className={paymentMethod === 'cod' ? styles.primaryButton : styles.secondaryButton}
              onClick={() => setPaymentMethod('cod')}
              style={{ flex: 1, padding: '0.75rem' }}
            >
              Cash on Delivery
            </button>
          </div>

          <div style={{ padding: '1.5rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '2rem' }}>
            {paymentMethod === 'card' && (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Credit Card Info</h3>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Card Number</label>
                  <input type="text" placeholder="**** **** **** ****" className={styles.formInput} />
                </div>
                <div className={styles.formRow}>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.formLabel}>Expiry Date</label>
                    <input type="text" placeholder="MM/YY" className={styles.formInput} />
                  </div>
                  <div className={styles.formGroup} style={{ flex: 1 }}>
                    <label className={styles.formLabel}>CVC</label>
                    <input type="text" placeholder="123" className={styles.formInput} />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Pay with PayPal</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>You will securely pay via PayPal's checkout.</p>
              </div>
            )}

            {paymentMethod === 'whatsapp' && (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Order via WhatsApp</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>We will send your order details directly to our WhatsApp number. You can complete your payment and coordination there.</p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div>
                <h3 style={{ marginTop: 0, marginBottom: '1.5rem', fontSize: '1.1rem' }}>Cash on Delivery</h3>
                <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Pay with cash when your order is delivered to your doorstep.</p>
              </div>
            )}

          </div>

          {error && <div style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#fee2e2', borderRadius: '8px' }}>{error}</div>}

          <div className={styles.formGroup} style={{ marginBottom: '2rem' }}>
            <label className={styles.radioLabel} style={{ display: 'inline-flex', color: '#334155', fontWeight: 500, cursor: 'pointer' }}>
              <input type="checkbox" checked={agreed} disabled={isProcessing} onChange={(e) => { setAgreed(e.target.checked); setError(''); }} />
              <span style={{ marginLeft: '0.5rem' }}>I have read and agree to the terms of use</span>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className={styles.secondaryButton} onClick={onBack} disabled={isProcessing}>
              Back
            </button>
            
            {paymentMethod === 'paypal' ? (
              <div style={{ flex: 1 }}>
                {!agreed ? (
                  <button className={styles.primaryButton} onClick={() => setError('You must agree to the terms of use first.')} style={{ width: '100%', opacity: 0.7 }}>
                    Agree to Terms to Pay
                  </button>
                ) : (
                  <PayPalScriptProvider options={initialOptions}>
                    <PayPalButtons
                      style={{ layout: "vertical", height: 45 }}
                      createOrder={(paypalData, actions) => {
                        return actions.order.create({
                          intent: "CAPTURE",
                          purchase_units: [{ amount: { currency_code: "USD", value: totalPrice } }],
                        });
                      }}
                      onApprove={(paypalData, actions) => {
                        return actions.order!.capture().then((details) => {
                          handleCreateOrder('paypal', details.id);
                        });
                      }}
                      onError={(err) => {
                        setError("PayPal Checkout failed. Please try again.");
                      }}
                    />
                  </PayPalScriptProvider>
                )}
              </div>
            ) : (
              <button 
                className={styles.primaryButton} 
                onClick={() => submitManualPayment(paymentMethod)}
                style={{ flex: 1 }}
                disabled={isProcessing}
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            )}
          </div>
        </div>

        <div className={styles.flexHalf}>
          <div className={styles.summarySidebar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Final Review</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Subtotal ({data?.totalQuantity || 0} items)</span>
              <span>${data?.totalPrice || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Shipping ({data?.shippingOption})</span>
              <span>{data?.finalPrice > data?.totalPrice ? `+$${(data.finalPrice - data.totalPrice).toFixed(2)}` : 'FREE'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.5rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
              <span>Total to Pay</span>
              <span style={{ color: '#2563eb' }}>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
