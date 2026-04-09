'use client';

import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface AccordionFAQProps {
  faqs: FAQItem[];
}

/** Accordion FAQ — chi mo 1 item tai 1 thoi diem */
export default function AccordionFAQ({ faqs }: AccordionFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={index}>
            {/* Header / Question */}
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className={`w-full flex items-center text-left transition-colors ${
                isOpen
                  ? 'bg-green-800 text-white rounded-t-lg px-5 py-4'
                  : 'bg-gray-50 border border-gray-200 rounded-lg px-5 py-4 hover:bg-gray-100'
              }`}
            >
              {/* Icon +/− */}
              <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3 text-lg font-bold">
                {isOpen ? '−' : '+'}
              </span>
              <span
                className={`font-semibold text-sm lg:text-base ${
                  isOpen ? 'text-white' : 'text-green-800'
                }`}
              >
                {faq.question}
              </span>
            </button>

            {/* Content / Answer */}
            {isOpen && (
              <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg p-6">
                <p className="text-sm lg:text-base text-slate-700 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
