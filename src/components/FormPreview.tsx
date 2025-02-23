import React, { useState } from 'react';
import { Form } from '../types/form';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormPreviewProps {
  form: Form;
  onSubmit: (responses: Record<string, any>) => void;
}

export default function FormPreview({ form, onSubmit }: FormPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [showThankYou, setShowThankYou] = useState(false);

  const progress = ((currentQuestionIndex + 1) / form.elements.length) * 100;
  const currentQuestion = form.elements[currentQuestionIndex];

  const handleNext = () => {
    if (currentQuestionIndex < form.elements.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onSubmit(responses);
      setShowThankYou(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleResponse = (value: any) => {
    setResponses({ ...responses, [currentQuestion.id]: value });
  };

  const renderInput = () => {
    switch (currentQuestion.type) {
      case 'shortText':
      case 'longText':
        return (
          <input
            type="text"
            value={responses[currentQuestion.id] || ''}
            onChange={(e) => handleResponse(e.target.value)}
            className="w-full p-4 text-xl border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="Type your answer here..."
          />
        );
      case 'multipleChoice':
        return (
          <div className="space-y-4">
            {currentQuestion.options?.map((option, index) => (
              <motion.button
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleResponse(option)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  responses[currentQuestion.id] === option
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );
      // Add more cases for other question types
      default:
        return null;
    }
  };

  if (showThankYou) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Thank you!</h1>
          <p className="text-gray-600">Your responses have been recorded.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-2 bg-gray-200">
        <motion.div
          className="h-full bg-purple-500"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="max-w-3xl mx-auto pt-16 px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <motion.h2
              className="text-3xl font-bold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {currentQuestion.question}
            </motion.h2>

            {currentQuestion.description && (
              <motion.p
                className="text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {currentQuestion.description}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {renderInput()}
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                currentQuestionIndex === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            <span className="text-gray-500">
              {currentQuestionIndex + 1} of {form.elements.length}
            </span>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {currentQuestionIndex === form.elements.length - 1 ? 'Submit' : 'Next'}
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}