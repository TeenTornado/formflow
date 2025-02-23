export type FormElementType =
  | 'shortText'
  | 'longText'
  | 'email'
  | 'phone'
  | 'address'
  | 'website'
  | 'multipleChoice'
  | 'dropdown'
  | 'pictureChoice'
  | 'yesNo'
  | 'legal'
  | 'nps'
  | 'opinionScale'
  | 'rating'
  | 'ranking'
  | 'matrix'
  | 'video';

export interface FormElement {
  id: string;
  type: FormElementType;
  question: string;
  description?: string;
  required: boolean;
  options?: string[];
  settings?: Record<string, any>;
}

export interface Form {
  id: string;
  title: string;
  description: string;
  elements: FormElement[];
  settings: {
    theme: string;
    showProgressBar: boolean;
    enableKeyboardNavigation: boolean;
  };
  status?: 'draft' | 'published';
}