import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { useCart, calculateItemDiscount } from '@/context/CartContext';
import { getColorHex, getColorName } from '@/lib/products';
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

  const getDisplayTechnique = (item: any) => {
    if (item.productName?.toLowerCase().includes('embroidery') || item.technique === 'embroidery') {
      return '3D Custom Embroidery';
    }
    if (item.productName?.toLowerCase().includes('laser') || item.technique === 'laser') {
      return 'Laser Engraved Patch';
    }
    return 'Direct Print (DTF)';
  };
  
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

  const rawSubtotal = cart.reduce((sum, item) => sum + calculateItemDiscount(item).rawTotal, 0);
  const totalDiscount = cart.reduce((sum, item) => sum + calculateItemDiscount(item).discountAmount, 0);

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
      totalQuantity,
      itemCount: cart.length,
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
              const itemDisc = calculateItemDiscount(item);
              const itemQty = itemDisc.qty;
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
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', textTransform: 'capitalize' }}>
                        {item.productName || `Custom ${item.productType}`} ({getDisplayTechnique(item)})
                      </h4>
                      {sizeString && <p style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>Sizes: {sizeString}</p>}
                      {item.shirtColor && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0.2rem 0 0.4rem 0', fontSize: '0.85rem' }}>
                          <span style={{ color: '#64748b' }}>Color:</span>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '9999px', padding: '0.15rem 0.55rem 0.15rem 0.25rem', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              backgroundColor: getColorHex(item.shirtColor, (item as any).shirtColorHex),
                              border: '1.5px solid #94a3b8',
                              borderRadius: '50%',
                              display: 'inline-block',
                              flexShrink: 0
                            }}></div>
                            <span style={{ textTransform: 'capitalize', fontWeight: 600, color: '#1e293b' }}>
                              {getColorName(item.shirtColor)}
                            </span>
                          </div>
                        </div>
                      )}
                      {item.isCustomDesign === false ? (
                        <div style={{ margin: '0 0 0.25rem 0', color: '#64748b', fontSize: '0.85rem' }}>
                          Design: As Pictured (Ready-Made)
                        </div>
                      ) : (
                        views.length > 1 && (
                          <div style={{ margin: '0 0 0.25rem 0', color: '#666', fontSize: '0.85rem' }}>
                            {views.map((v, i) => (
                              <div key={i}>{v.name}: {v.dec ? 'Decorated' : 'Blank'}</div>
                            ))}
                          </div>
                        )
                      )}

                      {/* Pricing Display with Per-Item Bulk Discount */}
                      {itemDisc.discountRate > 0 ? (
                        <div style={{ marginTop: '0.35rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '0.9rem' }}>
                              ${itemDisc.rawTotal.toFixed(2)}
                            </span>
                            <span style={{ fontWeight: 'bold', color: '#16a34a', fontSize: '1rem' }}>
                              ${itemDisc.finalTotal.toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                              (${itemDisc.effectiveUnitPrice.toFixed(2)} each)
                            </span>
                          </div>
                          <span style={{ display: 'inline-block', fontSize: '0.75rem', fontWeight: 600, color: '#15803d', background: '#dcfce7', padding: '0.15rem 0.5rem', borderRadius: '4px', marginTop: '0.25rem' }}>
                            ✓ Wholesale Volume Discount ({Math.round(itemDisc.discountRate * 100)}% off for {itemDisc.qty}+ units) — Saved ${itemDisc.discountAmount.toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div style={{ marginTop: '0.35rem' }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>
                            ${itemDisc.rawTotal.toFixed(2)} (${itemDisc.effectiveUnitPrice.toFixed(2)} each)
                          </p>
                          {itemDisc.qty < 25 && (
                            <span style={{ display: 'inline-block', fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
                              Order {25 - itemDisc.qty} more of this product for 10% wholesale discount
                            </span>
                          )}
                        </div>
                      )}
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
          <div className={styles.summarySidebar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>Cost Breakdown</h3>
            
            {/* 1. Itemized Product Subtotals */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: '#334155', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                <span>Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span>${rawSubtotal.toFixed(2)}</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingLeft: '0.5rem', borderLeft: '2px solid #e2e8f0' }}>
                {cart.map((item, i) => {
                  const d = calculateItemDiscount(item);
                  const pName = item.productName || `Custom ${item.productType}`;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#64748b' }}>
                      <span style={{ maxWidth: '68%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pName}>
                        {pName} ({d.qty}x)
                      </span>
                      <span>${d.rawTotal.toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* 2. Itemized Volume Discounts */}
            {totalDiscount > 0 ? (
              <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.4rem' }}>
                  <span>Wholesale Discounts</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  {cart.map((item, i) => {
                    const d = calculateItemDiscount(item);
                    if (d.discountAmount <= 0) return null;
                    const pName = item.productName || `Custom ${item.productType}`;
                    return (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#15803d' }}>
                        <span style={{ maxWidth: '65%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pName}>
                          • {pName} ({Math.round(d.discountRate * 100)}% off)
                        </span>
                        <span style={{ fontWeight: 600 }}>-${d.discountAmount.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.85rem', color: '#94a3b8' }}>
                <span>Wholesale Discount</span>
                <span>$0.00</span>
              </div>
            )}
            
            {/* 3. Shipping / Turnaround */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.9rem', color: '#334155' }}>
              <span>Turnaround ({shippingOption})</span>
              <span style={{ fontWeight: 600 }}>{shippingCost > 0 ? `+$${shippingCost.toFixed(2)}` : 'FREE'}</span>
            </div>
            
            {/* 4. Total Price */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <span style={{ color: '#0f172a' }}>Total Price</span>
              <span style={{ color: '#2563eb' }}>${finalPrice.toFixed(2)}</span>
            </div>
            
            {/* Informational Tip */}
            <div style={{ marginTop: '1rem', padding: '0.75rem', background: '#eff6ff', borderRadius: '8px', fontSize: '0.75rem', color: '#1e40af', lineHeight: 1.4, border: '1px solid #dbeafe' }}>
              💡 <strong>Per-Product Bulk Pricing:</strong> Volume discounts apply individually to each product based on its own quantity (25+ units: 10% off, 50+ units: 18% off, 100+ units: 25% off).
            </div>

            <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#64748b' }}>
              Taxes calculated at checkout if applicable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
