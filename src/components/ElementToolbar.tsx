import React from 'react';
import {
  Type,
  MessageSquare,
  Mail,
  Phone,
  MapPin,
  Globe,
  List,
  ChevronDown,
  Image,
  Check,
  Scale,
  Star,
  BarChart,
  Grid,
  Video
} from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { FormElementType } from '../types/form';

const elements = [
  {
    category: 'Contact Info',
    items: [
      { type: 'email', icon: Mail, label: 'Email' },
      { type: 'phone', icon: Phone, label: 'Phone Number' },
      { type: 'address', icon: MapPin, label: 'Address' },
      { type: 'website', icon: Globe, label: 'Website' },
    ],
  },
  {
    category: 'Choice',
    items: [
      { type: 'multipleChoice', icon: List, label: 'Multiple Choice' },
      { type: 'dropdown', icon: ChevronDown, label: 'Dropdown' },
      { type: 'pictureChoice', icon: Image, label: 'Picture Choice' },
      { type: 'yesNo', icon: Check, label: 'Yes/No' },
    ],
  },
  {
    category: 'Rating & Ranking',
    items: [
      { type: 'nps', icon: Scale, label: 'Net Promoter Score®' },
      { type: 'opinionScale', icon: BarChart, label: 'Opinion Scale' },
      { type: 'rating', icon: Star, label: 'Rating' },
      { type: 'matrix', icon: Grid, label: 'Matrix' },
    ],
  },
  {
    category: 'Text & Video',
    items: [
      { type: 'shortText', icon: Type, label: 'Short Text' },
      { type: 'longText', icon: MessageSquare, label: 'Long Text' },
      { type: 'video', icon: Video, label: 'Video' },
    ],
  },
];

export default function ElementToolbar() {
  const addElement = useFormStore((state) => state.addElement);

  const handleAddElement = (type: FormElementType) => {
    addElement({
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: 'New Question',
      required: false,
    });
  };

  return (
    <div className="space-y-6">
      {elements.map((category) => (
        <div key={category.category}>
          <h3 className="text-sm font-medium text-gray-900 mb-2">{category.category}</h3>
          <div className="space-y-1">
            {category.items.map((item) => (
              <button
                key={item.type}
                onClick={() => handleAddElement(item.type as FormElementType)}
                className="w-full flex items-center gap-2 p-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}