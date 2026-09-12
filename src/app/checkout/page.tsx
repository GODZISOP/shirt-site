'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SummaryStep from './SummaryStep';
import InstructionsStep from './InstructionsStep';
import ShippingStep from './ShippingStep';
import PaymentStep from './PaymentStep';
import { CheckoutData } from './types';
import styles from './Checkout.module.css';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const STEPS = ['Summary', 'Instructions', 'Pickup Info', 'Payment'];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<any>(null); // State for instructions, shipping, etc.
  const { cart, clearCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (currentStep === 4) return; // Do not touch data on success page
    // Only hydrate shipping/instructions state from session storage
    let parsedData: any = {};
    const storedData = sessionStorage.getItem('checkoutState');
    if (storedData) {
      try {
        parsedData = JSON.parse(storedData);
        // Do not let stale items snapshot from checkoutState overwrite live CartContext
        delete parsedData.items;
        setData(parsedData);
      } catch (err) {
        console.error('Failed to parse checkout state', err);
      }
    }
    const storedStep = sessionStorage.getItem('checkoutStep');
    let step = 0;
    if (storedStep) {
      step = parseInt(storedStep, 10) || 0;
      if (step >= 3 && (!parsedData || !parsedData.shippingDetails)) step = 2;
      if (step >= 2 && (!parsedData || typeof parsedData.instructions === 'undefined')) step = 1;
      if (step >= 1 && (!cart || cart.length === 0) && !parsedData?.frontImage && step !== 4) step = 0; // Guard for empty cart
      setCurrentStep(step);
    }

    // Do not wipe data if we just finished checkout and it was cleared from session
    if (!storedData && step !== 4) {
      setData({});
    }
  }, [cart?.length]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // If order is completed, clear all carts and session data
    if (currentStep === 4) {
      clearCart();
      sessionStorage.removeItem('checkoutState');
      sessionStorage.removeItem('checkoutStep');
      localStorage.removeItem('customDesignData');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep]);

  const handleNext = (updatedData?: any) => {
    setData((prev: any) => {
      const newData = { ...prev, ...updatedData };
      sessionStorage.setItem('checkoutState', JSON.stringify(newData));
      return newData;
    });
    
    setCurrentStep(prev => {
      const nextStep = Math.min(prev + 1, STEPS.length);
      sessionStorage.setItem('checkoutStep', nextStep.toString());
      return nextStep;
    });
  };

  const handleUpdateData = (updatedData?: any) => {
    setData((prev: any) => {
      const newData = { ...prev, ...updatedData };
      sessionStorage.setItem('checkoutState', JSON.stringify(newData));
      return newData;
    });
  };

  const handleStepClick = (index: number) => {
    setCurrentStep(index);
    sessionStorage.setItem('checkoutStep', index.toString());
  };

  const renderStep = () => {
    const customQty = data?.quantities 
      ? Object.values(data.quantities).reduce((a: any, b: any) => a + (parseInt(b as string) || 0), 0)
      : 0;

    // If the cart is empty AND there is no custom design in session storage, block checkout
    if ((!cart || cart.length === 0) && !data?.frontImage && !data?.backImage && !data?.leftImage && !data?.rightImage && !customQty && currentStep < 4) {
      return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>Your cart is empty.</h2>
          <button onClick={() => router.push('/design')} className={styles.primaryButton} style={{ marginTop: '1rem' }}>Start Designing</button>
        </div>
      );
    }

    if (currentStep === 4) {
      const orderId = data?.orderId || 'DEMIR-ORDER';
      const totalPrice = data?.finalPrice || data?.totalPrice || '0.00';
      const whatsappUrl = data?.whatsappUrl || `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '15045643000').replace(/\D/g, '')}?text=${encodeURIComponent(`Hi Demir Studio! Regarding my order ${orderId}, I would like to complete my payment.`)}`;

      return (
        <div style={{ maxWidth: '640px', margin: '3rem auto', padding: '2rem 1.5rem', background: '#ffffff', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          {/* Success Icon */}
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto' }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
            Thank You for Your Order!
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', margin: '0 0 1.75rem 0' }}>
            Your custom apparel order has been registered and sent to our production team.
          </p>

          {/* Order ID & Price Box */}
          <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', letterSpacing: '0.02em' }}>{orderId}</span>
            </div>
            <div style={{ height: '36px', width: '1px', background: '#cbd5e1' }} />
            <div>
              <span style={{ display: 'block', fontSize: '12px', color: '#64748b', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#16a34a' }}>${totalPrice}</span>
            </div>
          </div>

          {/* WhatsApp Payment Finalization CTA Box */}
          <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: '14px', padding: '1.5rem', marginBottom: '2rem', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#15803d' }}>
                Next Step: Complete Payment via WhatsApp
              </h3>
            </div>
            <p style={{ margin: '0 0 1.25rem 0', color: '#166534', fontSize: '0.88rem', lineHeight: 1.5 }}>
              A confirmation invoice has been sent to our email. Click the button below to message our studio directly on WhatsApp with your pre-filled order receipt so we can provide our Bank Transfer / Easy Payment details and immediately begin production.
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                width: '100%',
                padding: '0.95rem 1.5rem',
                background: '#25D366',
                color: '#ffffff',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '1rem',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(37, 211, 102, 0.4)',
                boxSizing: 'border-box'
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c4.54 0 8.24 3.7 8.24 8.24 0 2.2-.86 4.27-2.42 5.82a8.19 8.19 0 0 1-5.82 2.42c-1.46 0-2.88-.39-4.14-1.12l-.3-.18-3.08.81.82-3-.2-.31a8.21 8.21 0 0 1-1.26-4.44c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.64c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44s-.56-1.35-.77-1.85c-.2-.48-.41-.42-.56-.43l-.48-.01c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.13.17 1.77 2.7 4.28 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.18-.48-.3z" />
              </svg>
              <span>Open WhatsApp to Finalize Payment</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href={`/track?orderId=${encodeURIComponent(orderId)}`}
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                background: '#ffffff',
                color: '#334155',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
              }}
            >
              Track Order Status
            </a>
            <button
              onClick={() => router.push('/')}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                border: 'none',
                background: '#0f172a',
                color: '#ffffff',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              Return Home
            </button>
          </div>
        </div>
      );
    }
    
    // We pass both the cart items AND the form data to the steps
    const combinedData = { ...data, cart };

    switch (currentStep) {
      case 0:
        return <SummaryStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} onUpdate={handleUpdateData} />;
      case 1:
        return <InstructionsStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} />;
      case 2:
        return <ShippingStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} />;
      case 3:
        return <PaymentStep data={combinedData} onNext={(updatedData) => handleNext(updatedData)} onBack={() => handleStepClick(2)} />;
      default:
        return null;
    }
  };

  if (!data) {
    return <div style={{ textAlign: 'center', padding: '4rem', color: '#666' }}>Loading checkout session...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 bg-[#f9fafb]">
        <div className={styles.container}>
          {/* Breadcrumb */}
          {currentStep < 4 && (
            <div className={styles.breadcrumb}>
              {STEPS.slice(0, 4).map((step, index) => {
                const isClickable = index < currentStep;
                return (
                  <div 
                    key={step} 
                    className={`${styles.breadcrumbItem} ${index === currentStep ? styles.active : ''} ${isClickable ? styles.clickable : ''}`}
                    onClick={() => isClickable && handleStepClick(index)}
                  >
                    {step}
                  </div>
                );
              })}
              <div className={styles.breadcrumbItem}>Completion</div>
            </div>
          )}

          {/* Main Content Area */}
          {renderStep()}
        </div>
      </main>
      <Footer />
    </div>
  );
}
