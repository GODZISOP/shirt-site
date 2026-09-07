import React, { useState } from 'react';
import styles from './Checkout.module.css';

interface ShippingStepProps {
  data: any;
  onNext: (data?: any) => void;
}

export default function ShippingStep({ data, onNext }: ShippingStepProps) {
  const [formData, setFormData] = useState(data?.shippingDetails || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleProceed = () => {
    const required = ['firstName', 'lastName', 'email', 'phone', 'address1', 'city', 'state', 'zip'];

    for (const field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in all required fields. Missing: ${field}`);
        return;
      }
    }

    const emailRegex = new RegExp("^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,6}$");
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    onNext({ shippingDetails: formData });
  };

  return (
    <div style={{ width: '100%' }}>
      <div className={styles.flexRow}>
        <div className={styles.flexHalf}>
          <h2 className={styles.pageTitle}>Shipping Information</h2>
          
          {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

          <h3 className={styles.sectionTitle} style={{ marginTop: 0 }}>Contact Details</h3>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>First Name *</label>
              <input type="text" name="firstName" placeholder="John" className={styles.formInput} value={formData.firstName} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>Last Name *</label>
              <input type="text" name="lastName" placeholder="Doe" className={styles.formInput} value={formData.lastName} onChange={handleChange} />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email *</label>
            <input type="email" name="email" placeholder="john@example.com" className={styles.formInput} value={formData.email} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone Number *</label>
            <input type="tel" name="phone" placeholder="(555) 123-4567" className={styles.formInput} value={formData.phone} onChange={handleChange} />
          </div>

          <h3 className={styles.sectionTitle}>Delivery Address (UPS)</h3>
          
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Street Address *</label>
            <input type="text" name="address1" placeholder="123 Main St" className={styles.formInput} value={formData.address1} onChange={handleChange} />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Apartment, suite, etc. (optional)</label>
            <input type="text" name="address2" placeholder="Apt 4B" className={styles.formInput} value={formData.address2} onChange={handleChange} />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup} style={{ flex: 2 }}>
              <label className={styles.formLabel}>City *</label>
              <input type="text" name="city" placeholder="City" className={styles.formInput} value={formData.city} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>State *</label>
              <input type="text" name="state" placeholder="NY" className={styles.formInput} value={formData.state} onChange={handleChange} />
            </div>
            <div className={styles.formGroup} style={{ flex: 1 }}>
              <label className={styles.formLabel}>ZIP Code *</label>
              <input type="text" name="zip" placeholder="10001" className={styles.formInput} value={formData.zip} onChange={handleChange} />
            </div>
          </div>

          <button className={styles.primaryButton} onClick={handleProceed} style={{ marginTop: '2rem' }}>
            Proceed to Payment
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
              <span>{data?.finalPrice > data?.totalPrice ? "+$" + (data.finalPrice - data.totalPrice).toFixed(2) : 'FREE'}</span>
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
