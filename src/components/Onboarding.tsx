import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [purpose, setPurpose] = useState<string>('');

  const steps = [
    {
      title: "What's the main thing you'll be using Typeform for?",
      options: ['Personal', 'School', 'Work'],
    },
    {
      title: 'How did you hear about us?',
      options: ['Social Media', 'Friend', 'Search Engine', 'Advertisement'],
    },
  ];

  const currentStep = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-gray-200">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-2xl mx-auto pt-16 px-6">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold">{currentStep.title}</h2>

          <div className="space-y-4">
            {currentStep.options.map((option, index) => (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => {
                  setPurpose(option);
                  handleNext();
                }}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  purpose === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <span className="inline-block w-8 h-8 bg-gray-100 rounded-full text-center leading-8 mr-4">
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                step === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="text-gray-500">
              {step + 1} of {steps.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {step === steps.length - 1 ? 'Get Started' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}