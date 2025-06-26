'use client';

import { useState } from 'react';

interface WizardStep {
  number: number;
  title: string;
  description: string;
}

const steps: WizardStep[] = [
  { number: 1, title: 'Job Description', description: 'Paste the job posting' },
  { number: 2, title: 'Your Resume', description: 'Add your experience' },
  { number: 3, title: 'Writing Samples', description: 'Show your style' },
  { number: 4, title: 'Review', description: 'Check your application' },
  { number: 5, title: 'Submit', description: 'Send to GitHub' },
];

interface WizardProps {
  currentStep: number;
  children: React.ReactNode;
}

export function Wizard({ currentStep, children }: WizardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="relative">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                      ${currentStep >= step.number
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                      }
                    `}
                  >
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <p className="text-xs text-gray-600">{step.title}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`
                      w-24 h-1 mx-2
                      ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        {children}
      </div>
    </div>
  );
} 