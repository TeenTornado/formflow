import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, X } from 'lucide-react';
import { FormElement } from '../types/form';
import { useFormStore } from '../store/formStore';

interface FormElementProps {
  element: FormElement;
}

export default function FormElement({ element }: FormElementProps) {
  const { deleteElement, updateElement } = useFormStore();
  const [newOption, setNewOption] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: element.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleAddOption = () => {
    if (newOption.trim()) {
      const currentOptions = element.options || [];
      updateElement(element.id, {
        options: [...currentOptions, newOption.trim()]
      });
      setNewOption('');
    }
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = (element.options || []).filter((_, i) => i !== index);
    updateElement(element.id, { options: newOptions });
  };

  const renderElementInput = () => {
    switch (element.type) {
      case 'shortText':
      case 'longText':
        return (
          <input
            type="text"
            className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="Type your answer here..."
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="your@email.com"
            disabled
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="(123) 456-7890"
            disabled
          />
        );
      case 'address':
        return (
          <textarea
            className="w-full p-4 text-lg border-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent rounded-lg"
            placeholder="Enter your address"
            rows={4}
            disabled
          />
        );
      case 'website':
        return (
          <input
            type="url"
            className="w-full p-4 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
            placeholder="https://example.com"
            disabled
          />
        );
      case 'multipleChoice':
      case 'dropdown':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              {(element.options || ['Option 1']).map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input 
                    type={element.type === 'multipleChoice' ? 'radio' : 'checkbox'} 
                    disabled 
                    className="w-5 h-5 text-purple-600"
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(element.options || [])];
                      newOptions[index] = e.target.value;
                      updateElement(element.id, { options: newOptions });
                    }}
                    className="flex-1 p-2 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    onClick={() => handleRemoveOption(index)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={20} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                className="flex-1 p-2 text-lg border-b-2 border-gray-200 focus:border-purple-500 outline-none bg-transparent"
                placeholder="Add new option"
                onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
              />
              <button
                onClick={handleAddOption}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>
        );
      case 'yesNo':
        return (
          <div className="space-x-8">
            <label className="inline-flex items-center gap-2 text-lg">
              <input 
                type="radio" 
                name={`yesno-${element.id}`} 
                disabled 
                className="w-5 h-5 text-purple-600"
              />
              <span>Yes</span>
            </label>
            <label className="inline-flex items-center gap-2 text-lg">
              <input 
                type="radio" 
                name={`yesno-${element.id}`} 
                disabled 
                className="w-5 h-5 text-purple-600"
              />
              <span>No</span>
            </label>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center text-lg font-medium hover:border-purple-500 hover:bg-purple-50 transition-colors"
                disabled
              >
                {num}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div className="p-4 border-2 border-gray-200 rounded-lg text-gray-500 text-lg">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-6 mb-4 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start gap-4">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 cursor-move text-gray-400 hover:text-gray-600"
        >
          <GripVertical size={20} />
        </button>

        <div className="flex-1">
          <div
            className="group relative"
            onMouseEnter={() => setIsEditing(true)}
            onMouseLeave={() => setIsEditing(false)}
          >
            <input
              type="text"
              value={element.question}
              onChange={(e) => updateElement(element.id, { question: e.target.value })}
              className="w-full text-xl font-medium mb-2 bg-transparent border-none focus:outline-none hover:bg-gray-50 p-2 rounded transition-colors"
              placeholder="Type your question here"
            />
            {isEditing && (
              <div className="absolute inset-0 border-2 border-purple-500 rounded pointer-events-none"></div>
            )}
          </div>
          
          <input
            type="text"
            value={element.description || ''}
            onChange={(e) => updateElement(element.id, { description: e.target.value })}
            className="w-full text-gray-500 mb-6 bg-transparent border-none focus:outline-none hover:bg-gray-50 p-2 rounded transition-colors"
            placeholder="Add a description"
          />

          <div className="mb-6">
            {renderElementInput()}
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={element.required}
                onChange={(e) => updateElement(element.id, { required: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Required
            </label>
          </div>
        </div>

        <button
          onClick={() => deleteElement(element.id)}
          className="mt-1 text-gray-400 hover:text-red-500"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
}