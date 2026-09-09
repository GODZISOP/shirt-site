import React, { useState } from 'react';
import styles from './Checkout.module.css';
import { useCart } from '@/context/CartContext';

interface InstructionsStepProps {
  data: any;
  onNext: (data?: any) => void;
}

export default function InstructionsStep({ data, onNext }: InstructionsStepProps) {
  const [instructions, setInstructions] = useState(data?.instructions || '');
  const [dimensionsOption, setDimensionsOption] = useState<'default' | 'specify'>('default');
  const [error, setError] = useState('');
  const { cart } = useCart();
  
  const handleProceed = () => {
    if (dimensionsOption === 'specify' && !instructions.trim()) {
      setError('Please provide your specific dimensions in the instructions box below.');
      return;
    }
    onNext({ instructions });
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.flexRow}>
        <div className={styles.flexHalf}>
          <h2 className={styles.pageTitle}>Design Instructions</h2>
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          
          {cart.map((item, index) => {
             const isDecorated = (colors?: string[]) => colors && colors.length > 0;
             const defaultImg = item.productType === 'hat' ? '/hat-front.png' : '/shirt-front.png';
             
             const views = [
               { name: 'Front', img: item.frontImage || defaultImg, dec: isDecorated((item as any).frontColors) },
               { name: 'Back', img: item.backImage, dec: isDecorated((item as any).backColors) },
               { name: 'Left', img: item.leftImage, dec: isDecorated((item as any).leftColors) },
               { name: 'Right', img: item.rightImage, dec: isDecorated((item as any).rightColors) },
             ].filter(v => v.img);

             return (
             <div key={item.id || index} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px', background: '#f8fafc' }}>
               <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', textTransform: 'capitalize' }}>
                 {item.productName || `Custom ${item.productType}`} ({item.technique === 'embroidery' ? '3D Custom Embroidery' : item.technique === 'laser' ? 'Laser Engraved Patch' : 'Direct Print (DTF)'})
               </h3>
               <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', maxWidth: '250px' }}>
                    {views.map((v, i) => (
                      <div key={i} style={{ textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', flexShrink: 0, background: '#fff', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
                          <img src={v.img} alt={`Preview ${v.name}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>Color:</span> 
                      <div style={{ width: '16px', height: '16px', backgroundColor: item.shirtColor || '#fff', border: '1px solid #ddd', borderRadius: '50%' }}></div>
                      <span style={{ textTransform: 'capitalize' }}>{item.shirtColor}</span>
                    </div>
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                      {views.map((v, i) => (
                        <div key={i}>{v.name}: {v.dec ? 'Decorated' : 'Blank'}</div>
                      ))}
                    </div>
                    {item.notes && (
                      <div>
                        <span style={{ fontWeight: 600 }}>Item Notes:</span> {item.notes}
                      </div>
                    )}
                  </div>
               </div>
             </div>
          )})}

          <h3 className={styles.sectionTitle} style={{ marginTop: '2rem' }}>Design Dimensions</h3>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>How would you like us to size your design?</p>
          
          <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
            <label className={styles.radioLabel} style={{ display: 'block', marginBottom: '0.5rem' }}>
              <input 
                type="radio" 
                name="dimensions" 
                checked={dimensionsOption === 'default'} 
                onChange={() => setDimensionsOption('default')} 
              />
              <span style={{ marginLeft: '0.5rem', fontWeight: 500 }}>Standard Sizing</span>
              <p style={{ margin: '0.25rem 0 0 1.5rem', color: '#666', fontSize: '0.9rem' }}>
                We will size your design according to industry standards for each garment size.
              </p>
            </label>
            
            <label className={styles.radioLabel} style={{ display: 'block', marginTop: '1rem' }}>
              <input 
                type="radio" 
                name="dimensions" 
                checked={dimensionsOption === 'specify'} 
                onChange={() => setDimensionsOption('specify')} 
              />
              <span style={{ marginLeft: '0.5rem', fontWeight: 500 }}>Specific Dimensions</span>
              <p style={{ margin: '0.25rem 0 0 1.5rem', color: '#666', fontSize: '0.9rem' }}>
                I will provide specific width/height dimensions below.
              </p>
            </label>
          </div>

          <h3 className={styles.sectionTitle}>Order Notes (Optional)</h3>
          <div className={styles.formGroup}>
            <textarea
              className={styles.formInput}
              rows={5}
              placeholder="Any specific placement instructions, exact dimensions, or additional notes for our production team..."
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                setError('');
              }}
              style={{ width: '100%', resize: 'vertical' }}
            />
          </div>
          
          <button className={styles.primaryButton} onClick={handleProceed} style={{ marginTop: '1rem' }}>
            Next: Shipping Info
          </button>
        </div>

        <div className={styles.flexHalf}>
          <div className={styles.summarySidebar} style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0' }}>Order Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Subtotal ({data?.totalQuantity || 0} items)</span>
              <span>${data?.totalPrice || '0.00'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span>Turnaround ({data?.shippingOption})</span>
              <span>{data?.finalPrice > data?.totalPrice ? `+$${(data.finalPrice - data.totalPrice).toFixed(2)}` : 'FREE'}</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.25rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0' }}>
              <span>Total Price</span>
              <span style={{ color: '#2563eb' }}>${data?.finalPrice?.toFixed(2) || '0.00'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
