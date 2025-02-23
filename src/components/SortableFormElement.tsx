import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Plus, X } from 'lucide-react';
import { FormElement } from '../types/form';
import { useFormStore } from '../store/formStore';

interface SortableFormElementProps {
  element: FormElement;
}

export default function SortableFormElement({ element }: SortableFormElementProps) {
  const { deleteElement, updateElement } = useFormStore();
  const [newOption, setNewOption] = useState('');
  
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
            className="w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Type your answer here..."
            disabled
          />
        );
      case 'email':
        return (
          <input
            type="email"
            className="w-full p-2 border border-gray-200 rounded-lg"
            placeholder="your@email.com"
            disabled
          />
        );
      case 'phone':
        return (
          <input
            type="tel"
            className="w-full p-2 border border-gray-200 rounded-lg"
            placeholder="(123) 456-7890"
            disabled
          />
        );
      case 'address':
        return (
          <textarea
            className="w-full p-2 border border-gray-200 rounded-lg"
            placeholder="Enter your address"
            disabled
          />
        );
      case 'website':
        return (
          <input
            type="url"
            className="w-full p-2 border border-gray-200 rounded-lg"
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
                  />
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...(element.options || [])];
                      newOptions[index] = e.target.value;
                      updateElement(element.id, { options: newOptions });
                    }}
                    className="flex-1 p-2 border border-gray-200 rounded-lg"
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
                className="flex-1 p-2 border border-gray-200 rounded-lg"
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
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input type="radio" name={`yesno-${element.id}`} disabled />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input type="radio" name={`yesno-${element.id}`} disabled />
              <span className="ml-2">No</span>
            </label>
          </div>
        );
      case 'rating':
        return (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center"
                disabled
              >
                {num}
              </button>
            ))}
          </div>
        );
      default:
        return (
          <div className="p-2 border border-gray-200 rounded-lg text-gray-500">
            Preview not available
          </div>
        );
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-4 mb-4"
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
          <input
            type="text"
            value={element.question}
            onChange={(e) => updateElement(element.id, { question: e.target.value })}
            className="w-full text-lg font-medium mb-2 bg-transparent border-none focus:outline-none"
            placeholder="Type your question here"
          />
          
          <input
            type="text"
            value={element.description || ''}
            onChange={(e) => updateElement(element.id, { description: e.target.value })}
            className="w-full text-sm text-gray-500 mb-4 bg-transparent border-none focus:outline-none"
            placeholder="Add a description"
          />

          {renderElementInput()}
          
          <div className="mt-4 flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={element.required}
                onChange={(e) => updateElement(element.id, { required: e.target.checked })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
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