'use client';

import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { createOrder, DbOrder } from '@/lib/supabase';
import { useCart } from '@/context/CartContext';
import { MessageCircle, ShieldCheck, Mail, CheckCircle2, Sparkles } from 'lucide-react';

interface PaymentStepProps {
  data: any;
  onNext: (data?: any) => void;
  onBack?: () => void;
}

export default function PaymentStep({ data, onNext, onBack }: PaymentStepProps) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { cart } = useCart();

  const totalPrice = parseFloat(data?.finalPrice || 0).toFixed(2);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '15045643000';
  const cleanWhatsAppNumber = whatsappNumber.replace(/\D/g, '');

  const buildWhatsAppMessage = (orderId: string, customerName: string, address: string, phone: string) => {
    const itemsList = (cart || []).map((item: any, idx: number) => {
      const sizeEntries = item.quantities
        ? Object.entries(item.quantities).filter(([_, qty]) => parseInt(qty as string, 10) > 0)
        : [];
      const sizesStr = sizeEntries.map(([s, q]) => `${s.toUpperCase()}:${q}`).join(', ');
      const itemQty = item.totalQuantity || (sizeEntries.length > 0 ? sizeEntries.reduce((sum, [_, q]) => sum + (parseInt(q as string, 10) || 0), 0) : 1);
      const prodName = item.productName || item.name || `Custom ${item.productType || 'Apparel'}`;
      const tech = item.technique === 'embroidery' ? 'Embroidery' : item.technique === 'laser' ? 'Laser Patch' : 'Direct Print';
      const itemPrice = item.totalPrice || ((item.pricePerShirt || item.price || 0) * itemQty).toFixed(2);

      return `  ${idx + 1}. *${prodName}* (${tech})\n     Qty: ${itemQty} pcs ${sizesStr ? `[${sizesStr}]` : ''} - $${itemPrice}`;
    }).join('\n');

    return (
      `*DEMIR STUDIO - NEW ORDER CONFIRMATION* 👕🧢\n` +
      `-----------------------------------------\n` +
      `📦 *Order ID:* ${orderId}\n` +
      `👤 *Customer Name:* ${customerName}\n` +
      `📞 *Phone:* ${phone || 'Not provided'}\n` +
      `📍 *Shipping Address:* ${address}\n` +
      `💳 *Payment:* WhatsApp / Direct Transfer\n` +
      `\n` +
      `🛒 *Ordered Items:*\n` +
      `${itemsList || '  Custom apparel order'}\n` +
      `\n` +
      `💰 *Total Amount:* $${totalPrice}\n` +
      `${data?.instructions ? `📝 *Design Notes:* ${data.instructions}\n` : ''}` +
      `-----------------------------------------\n` +
      `Hello Demir Studio! I have just placed this order on your website. Please share the payment details (Bank Transfer / Easy Payment) so I can complete payment and confirm production. Thank you!`
    );
  };

  const handleCreateOrder = async () => {
    if (!agreed) {
      setError('Please read and agree to the terms of service before placing your order.');
      return;
    }

    setIsProcessing(true);
    setError('');

    // Generate unique Order ID
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const { shippingDetails } = data;
    const customerName = `${shippingDetails?.firstName || ''} ${shippingDetails?.lastName || ''}`.trim() || 'Guest Customer';
    const customerPhone = shippingDetails?.phone || '';
    const shippingAddress = shippingDetails 
      ? `${shippingDetails.address1}${shippingDetails.address2 ? ` ${shippingDetails.address2}` : ''}, ${shippingDetails.city}, ${shippingDetails.state} ${shippingDetails.zip}` 
      : 'Store Pickup';

    const mainItem = cart[0];
    const totalQuantity = data?.totalQuantity || cart.reduce((sum: number, it: any) => sum + (it.totalQuantity || 1), 0) || 1;

    const imagesToSave: string[] = [];
    if (mainItem?.frontImage) imagesToSave.push(mainItem.frontImage);
    if (mainItem?.backImage) imagesToSave.push(mainItem.backImage);
    if (mainItem?.leftImage) imagesToSave.push(mainItem.leftImage);
    if (mainItem?.rightImage) imagesToSave.push(mainItem.rightImage);

    const imageUrlString = imagesToSave.length > 0 ? JSON.stringify(imagesToSave) : '';

    const newOrder: DbOrder = {
      order_id: orderId,
      customer_name: customerName,
      email: shippingDetails?.email || 'no-email@example.com',
      phone: customerPhone,
      product_name: `Custom ${mainItem?.productType || 'Apparel'} + ${cart.length > 1 ? (cart.length - 1) + ' more' : ''}`,
      item_type: (mainItem?.productType as any) || 'tshirt',
      technique: (mainItem?.technique as any) || 'print',
      quantity: totalQuantity,
      total_price: totalPrice,
      status_step: 1,
      shipping_address: shippingAddress,
      image_url: imageUrlString,
      instructions: data?.instructions || '',
      cart_data: JSON.stringify(cart),
    };

    // 1. Create order in Database
    const res = await createOrder(newOrder);

    if (!res.success) {
      setIsProcessing(false);
      setError('Could not save your order. Please try again.');
      return;
    }

    // 2. Dispatch Email to Admin & Customer
    try {
      await fetch('/api/send-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          customerName,
          email: newOrder.email,
          phone: customerPhone,
          address: shippingAddress,
          instructions: data?.instructions,
          cartItems: cart,
          totalAmount: totalPrice,
          paymentMethod: 'whatsapp',
        })
      });
    } catch (e) {
      console.error('Failed to send order confirmation email:', e);
    }

    // 3. Build WhatsApp URL
    const messageText = buildWhatsAppMessage(orderId, customerName, shippingAddress, customerPhone);
    const whatsappUrl = `https://wa.me/${cleanWhatsAppNumber}?text=${encodeURIComponent(messageText)}`;

    // 4. Automatically trigger WhatsApp in a new tab
    try {
      window.open(whatsappUrl, '_blank');
    } catch (err) {
      console.warn('Popup blocked, WhatsApp button will be shown on completion page', err);
    }

    setIsProcessing(false);
    onNext({
      paymentMethod: 'whatsapp',
      orderId,
      whatsappUrl,
      finalPrice: totalPrice,
      totalQuantity,
      customerName,
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.flexRow}>
        <div className={styles.flexHalf}>
          <h2 className={styles.pageTitle}>Confirm Order & Pay via WhatsApp</h2>

          {/* WhatsApp Direct Order Box */}
          <div style={{ padding: '1.75rem', background: '#fff', border: '2px solid #22c55e', borderRadius: '14px', marginBottom: '1.75rem', boxShadow: '0 4px 20px rgba(34, 197, 94, 0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle className="w-5 h-5 text-[#25D366]" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#0f172a', fontWeight: 700 }}>
                    Direct WhatsApp Ordering
                  </h3>
                  <p style={{ margin: 0, fontSize: '12px', color: '#15803d', fontWeight: 600 }}>
                    Official Studio Support & Direct Bank Payment
                  </p>
                </div>
              </div>

              <span style={{ background: '#25D366', color: '#fff', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.03em' }}>
                FAST & SECURE
              </span>
            </div>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              Place your order now without an online card or PayPal. We immediately send an official invoice to our studio and to your email address, then open WhatsApp so you can coordinate payment (Bank Transfer / Easy Payment) and confirm details directly with our team.
            </p>

            {/* Steps Breakdown */}
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>Immediate Email Confirmation:</strong> Client admin and customer receive instant detailed order specs and mockups.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>Pre-Filled WhatsApp Message:</strong> Your Order ID, sizes, items, and total amount will be ready to send with 1 click.
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <CheckCircle2 className="w-4 h-4 text-[#25D366] shrink-0 mt-0.5" />
                <span style={{ fontSize: '0.85rem', color: '#166534', lineHeight: 1.4 }}>
                  <strong>Easy Payment:</strong> Pay via direct bank transfer or wire transfer as arranged with our team.
                </span>
              </div>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.75rem' }}>
            <div style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <Mail className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>Instant Email</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Immediate receipt</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>Safe & Verified</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Human inspection</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
              <MessageCircle className="w-4 h-4 text-[#25D366] mx-auto mb-1" />
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#1e293b' }}>Live WhatsApp</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>Fast response</div>
            </div>
          </div>

          {error && (
            <div style={{ color: '#b91c1c', marginBottom: '1rem', padding: '0.85rem 1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', fontSize: '0.9rem' }}>
              {error}
            </div>
          )}

          {/* Terms Agreement Checkbox */}
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.radioLabel} style={{ display: 'inline-flex', alignItems: 'center', color: '#334155', fontWeight: 500, cursor: 'pointer', fontSize: '0.9rem' }}>
              <input 
                type="checkbox" 
                checked={agreed} 
                disabled={isProcessing} 
                onChange={(e) => { setAgreed(e.target.checked); setError(''); }} 
                style={{ width: '16px', height: '16px', accentColor: '#25D366' }}
              />
              <span style={{ marginLeft: '0.5rem' }}>I have reviewed my design and agree to the terms of order production</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button 
              type="button"
              className={styles.secondaryButton} 
              onClick={onBack} 
              disabled={isProcessing}
              style={{ padding: '0.85rem 1.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
            >
              Back
            </button>

            <button 
              type="button"
              onClick={handleCreateOrder}
              disabled={isProcessing}
              style={{
                flex: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '1rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#25D366',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                cursor: isProcessing ? 'not-allowed' : 'pointer',
                opacity: isProcessing ? 0.7 : 1,
                boxShadow: '0 4px 16px rgba(37, 211, 102, 0.45)',
                transition: 'all 0.2s ease',
              }}
            >
              {isProcessing ? (
                <span>Submitting Order & Notifying Studio...</span>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>Place Order & Message on WhatsApp</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className={styles.flexHalf}>
          <div className={styles.summarySidebar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#0f172a' }}>Order Review</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
              <span>Subtotal ({cart.length || data?.itemCount || 1} item{(cart.length || data?.itemCount) !== 1 ? 's' : ''})</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>${data?.totalPrice || '0.00'}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#475569' }}>
              <span>Turnaround ({data?.shippingOption || 'standard'})</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>
                {data?.finalPrice > data?.totalPrice ? `+$${(data.finalPrice - data.totalPrice).toFixed(2)}` : 'FREE'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.4rem', marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '2px solid #e2e8f0' }}>
              <span>Total Due</span>
              <span style={{ color: '#2563eb' }}>${totalPrice}</span>
            </div>

            <div style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' }}>
              <div>📦 <strong>Ship to:</strong> {data?.shippingDetails?.city ? `${data.shippingDetails.city}, ${data.shippingDetails.state}` : 'Pickup/Delivery'}</div>
              <div style={{ marginTop: '4px' }}>📧 <strong>Receipt:</strong> Sent to {data?.shippingDetails?.email || 'your email'}</div>
              <div style={{ marginTop: '4px' }}>💬 <strong>Payment:</strong> WhatsApp / Direct Transfer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
