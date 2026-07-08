"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    question: "How do I design my custom t-shirts?",
    answer: "You can design your custom t-shirts using our easy-to-use online design tool. Just choose a product, add text or clipart, or upload your own artwork."
  },
  {
    question: "How much do you charge for custom t-shirts?",
    answer: "Pricing depends on the type of shirt, number of colors in your design, and quantity ordered. We offer a Low Price Guarantee and all-inclusive pricing."
  },
  {
    question: "What is the minimum order quantity for custom t-shirts?",
    answer: "We have no minimum order quantity! You can order just 1 custom shirt or thousands."
  },
  {
    question: "How long does it take to receive my t-shirts?",
    answer: "Standard delivery usually takes about 2 weeks. We also offer rush shipping options at checkout for faster delivery."
  },
  {
    question: "How do you make custom t shirts so cheap?",
    answer: "We keep our prices low by optimizing our printing process, printing in high volume, and maintaining great relationships with apparel suppliers."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="w-full bg-white pb-24 flex flex-col items-center">
      <div className="max-w-[800px] w-full px-4 lg:px-[30px] flex flex-col items-center gap-10">
        
        <div className="flex flex-col items-center gap-4">
          <div className="px-4 py-1.5 bg-blue-50 text-[var(--color-primary)] rounded-full text-[10px] font-bold tracking-widest uppercase">
            Still have questions?
          </div>
          <h2 className="text-3xl md:text-4xl text-[var(--color-dark-blue)] font-bold font-roboto-slab text-center max-w-[500px] leading-tight tracking-tight">
            Frequently asked questions
          </h2>
        </div>

        <div className="w-full flex flex-col">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-200">
              <button
                className="w-full py-6 flex items-center justify-between text-left focus:outline-none group"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-bold text-[var(--color-dark-blue)] group-hover:text-[var(--color-primary)] transition-colors pr-8">
                  {faq.question}
                </span>
                {openIndex === idx ? (
                  <Minus className="w-6 h-6 text-[var(--color-dark-blue)] flex-shrink-0" strokeWidth={1.5} />
                ) : (
                  <Plus className="w-6 h-6 text-[var(--color-dark-blue)] flex-shrink-0" strokeWidth={1.5} />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === idx ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-gray-500 text-sm leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
