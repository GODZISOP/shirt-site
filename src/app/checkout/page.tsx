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
      return (
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <h2>Thank You for Your Order!</h2>
          <p style={{ marginTop: '1rem', color: '#666' }}>Your custom design is being processed.</p>
          <div style={{ margin: '2rem auto', padding: '1.5rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', maxWidth: '400px' }}>
            <p style={{ margin: '0 0 0.5rem 0', color: '#475569' }}>Your Order ID:</p>
            <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a' }}>{data?.orderId}</p>
          </div>
          <p style={{ color: '#475569', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
            You will receive a confirmation email shortly. You can track the status of your order at any time using your Order ID on our <a href="/track" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'underline' }}>Track Order</a> page.
          </p>
          <button className={styles.primaryButton} onClick={() => router.push('/')}>Return Home</button>
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
