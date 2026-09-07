import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './Checkout.module.css';

interface SummaryStepProps {
  data: any;
  onNext: (updatedData: any) => void;
  onUpdate?: (updatedData: any) => void;
}

export default function SummaryStep({ data, onNext, onUpdate }: SummaryStepProps) {
  const { cart, removeFromCart, getCartTotal } = useCart();
  const [shippingOption, setShippingOption] = useState<'standard' | 'rush'>(data?.shippingOption === 'rush' ? 'rush' : 'standard');
  const [error, setError] = useState('');
  
  const hasCartItems = cart && cart.length > 0;

  const handleRemoveCartItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  if (!hasCartItems) {
    return <div className="text-center py-10">Your cart is empty.</div>;
  }

  const basePriceNum = getCartTotal();
  const totalQuantity = cart.reduce((acc, item) => {
    return acc + (item.quantities ? Object.values(item.quantities).reduce((a, b) => a + (parseInt(b as any) || 0), 0) : 0);
  }, 0);

  const shippingCost = shippingOption === "rush" ? 18.00 : 0.00;
  const finalPrice = basePriceNum + shippingCost;

  const handleProceed = () => {
    if (totalQuantity <= 0) {
      setError('You must have at least 1 item to proceed.');
      return;
    }
    
    onNext({
      totalPrice: basePriceNum.toFixed(2),
      shippingOption,
      finalPrice,
      totalQuantity
    });
  };

  return (
    <div style={{ width: '100%' }}>
      <h2 className={styles.pageTitle}>Order Summary</h2>
      
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
      
      <div className={styles.flexRow} style={{ marginTop: '2rem' }}>
        <div className={styles.flexHalf}>
          <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Review Order</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {cart.map((item, index) => {
              const itemQty = item.quantities 
                ? Object.values(item.quantities).reduce((a, b) => a + (parseInt(b as any) || 0), 0)
                : 0;
              const sizeEntries = item.quantities 
                ? Object.entries(item.quantities).filter(([_, qty]) => (qty as number) > 0) 
                : [];
              const sizeString = sizeEntries.length > 0 ? sizeEntries.map(([s, q]) => `${s}: ${q}`).join(', ') : '';

              const isDecorated = (colors?: string[]) => colors && colors.length > 0;
              const defaultImg = item.productType === 'hat' ? '/hat-front.png' : '/shirt-front.png';
              
              const views = [
                { name: 'Front', img: item.frontImage || defaultImg, dec: isDecorated((item as any).frontColors) },
                { name: 'Back', img: item.backImage, dec: isDecorated((item as any).backColors) },
                { name: 'Left', img: item.leftImage, dec: isDecorated((item as any).leftColors) },
                { name: 'Right', img: item.rightImage, dec: isDecorated((item as any).rightColors) },
              ].filter(v => v.img);

              return (
                <div key={item.id || index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '250px' }}>
                      {views.map((v, i) => (
                        <div key={i} style={{ textAlign: 'center' }}>
                          <img src={v.img} alt={`${item.productType} ${v.name}`} style={{ width: '80px', height: '80px', objectFit: 'contain', border: '1px solid #e2e8f0', borderRadius: '4px', background: '#fff' }} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>
                        Custom {item.productType} ({item.technique === 'embroidery' ? '3D Custom Embroidery' : item.technique === 'laser' ? 'Laser Engraved Patch' : 'Direct Print (DTF)'})
                      </h4>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>Sizes: {sizeString}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>
                        Color: <div style={{ width: '12px', height: '12px', backgroundColor: item.shirtColor || '#fff', border: '1px solid #ddd', borderRadius: '50%' }}></div> <span style={{ textTransform: 'capitalize' }}>{item.shirtColor}</span>
                      </div>
                      <div style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>
                        {views.map((v, i) => (
                          <div key={i}>{v.name}: {v.dec ? 'Decorated' : 'Blank'}</div>
                        ))}
                      </div>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>${((item.pricePerShirt || 0) * itemQty).toFixed(2)} (${item.pricePerShirt?.toFixed(2)} each)</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleRemoveCartItem(item.id)}
                    style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}
                    title="Remove item"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              );
            })}
          </div>

          <h3 className={styles.sectionTitle}>Turnaround Time</h3>
          
          <div className={styles.shippingOptions}>
            <label className={`${styles.shippingOption} ${shippingOption === 'standard' ? styles.shippingOptionActive : ''}`}>
              <div className={styles.radioWrapper}>
                <input type="radio" name="shipping" checked={shippingOption === 'standard'} onChange={() => setShippingOption('standard')} />
              </div>
              <div className={styles.shippingDetails}>
                <strong>UPS Standard Shipping</strong>
                <p>Est. 5-7 Business Days</p>
              </div>
              <div className={styles.shippingPrice}>FREE</div>
            </label>
            
            <label className={`${styles.shippingOption} ${shippingOption === 'rush' ? styles.shippingOptionActive : ''}`}>
              <div className={styles.radioWrapper}>
                <input type="radio" name="shipping" checked={shippingOption === 'rush'} onChange={() => setShippingOption('rush')} />
              </div>
              <div className={styles.shippingDetails}>
                <strong>UPS Rush Turnaround</strong>
                <p>Est. 24-48 Hours</p>
              </div>
              <div className={styles.shippingPrice}>+$18.00</div>
            </label>
          </div>
          
          <button className={styles.primaryButton} onClick={handleProceed} style={{ marginTop: '2rem' }}>
            Next: Instructions
          </button>
        </div>

        <div className={styles.flexHalf}>
          <div className={styles.summarySidebar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Cost Breakdown</h3>
            
            {(() => {
              const rawTotal = cart.reduce((total, item) => total + parseFloat(item.totalPrice || "0"), 0);
              const discount = rawTotal - basePriceNum;
              
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                    <span style={{ textDecoration: discount > 0 ? 'line-through' : 'none', color: discount > 0 ? '#94a3b8' : 'inherit' }}>
                      ${rawTotal.toFixed(2)}
                    </span>
                  </div>
                  
                  {discount > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                      <span>Wholesale Volume Discount</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}
                </>
              );
            })()}
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Turnaround ({shippingOption})</span>
              <span>{shippingCost > 0 ? `+$${shippingCost.toFixed(2)}` : 'FREE'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <span>Total Price</span>
              <span style={{ color: '#2563eb' }}>${finalPrice.toFixed(2)}</span>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#64748b' }}>
              Taxes calculated at checkout if applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
