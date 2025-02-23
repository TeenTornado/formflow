import { create } from "zustand";
import { FormElement, FormElementType, Form } from "../types/form";

interface FormStore {
  forms: Form[];
  currentForm: Form | null;
  workspaces: { id: string; name: string }[];
  currentWorkspace: string | null;
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  addWorkspace: (name: string) => void;
  setCurrentWorkspace: (id: string) => void;
  createForm: (workspace: string) => void;
  addElement: (element: FormElement) => void;
  updateElement: (id: string, updates: Partial<FormElement>) => void;
  updateForm: (form: Form) => void;
  reorderElements: (startIndex: number, endIndex: number) => void;
  deleteElement: (id: string) => void;
  deleteForm: (id: string) => void;
  duplicateForm: (id: string) => void;
  renameForm: (id: string, newTitle: string) => void;
}

export const useFormStore = create<FormStore>((set) => ({
  forms: [],
  currentForm: null,
  workspaces: [{ id: "default", name: "My workspace" }],
  currentWorkspace: "default",
  isAuthenticated: false,

  setAuthenticated: (value) =>
    set(() => ({
      isAuthenticated: value,
    })),

  addWorkspace: (name) =>
    set((state) => ({
      workspaces: [
        ...state.workspaces,
        { id: Math.random().toString(36).substr(2, 9), name },
      ],
    })),

  setCurrentWorkspace: (id) =>
    set(() => ({
      currentWorkspace: id,
    })),

  createForm: (workspace) =>
    set((state) => {
      const newForm: Form = {
        id: Math.random().toString(36).substr(2, 9),
        title: "Untitled Form",
        description: "",
        elements: [],
        settings: {
          theme: "default",
          showProgressBar: true,
          enableKeyboardNavigation: true,
        },
        status: "draft",
        workspace,
      };

      return {
        forms: [...state.forms, newForm],
        currentForm: newForm,
      };
    }),

  updateForm: (form) =>
    set((state) => ({
      currentForm: form,
      forms: state.forms.map((f) => (f.id === form.id ? form : f)),
    })),

  addElement: (element) =>
    set((state) => {
      if (!state.currentForm) return state;

      return {
        currentForm: {
          ...state.currentForm,
          elements: [...state.currentForm.elements, element],
        },
      };
    }),

  updateElement: (id, updates) =>
    set((state) => {
      if (!state.currentForm) return state;

      return {
        currentForm: {
          ...state.currentForm,
          elements: state.currentForm.elements.map((el) =>
            el.id === id ? { ...el, ...updates } : el
          ),
        },
      };
    }),

  reorderElements: (startIndex, endIndex) =>
    set((state) => {
      if (!state.currentForm) return state;

      const elements = [...state.currentForm.elements];
      const [removed] = elements.splice(startIndex, 1);
      elements.splice(endIndex, 0, removed);

      return {
        currentForm: {
          ...state.currentForm,
          elements,
        },
      };
    }),

  deleteElement: (id) =>
    set((state) => {
      if (!state.currentForm) return state;

      return {
        currentForm: {
          ...state.currentForm,
          elements: state.currentForm.elements.filter((el) => el.id !== id),
        },
      };
    }),

  deleteForm: (id) =>
    set((state) => ({
      forms: state.forms.filter((form) => form.id !== id),
    })),

  duplicateForm: (id) =>
    set((state) => {
      const formToDuplicate = state.forms.find((form) => form.id === id);
      if (!formToDuplicate) return state;

      const newForm = {
        ...formToDuplicate,
        id: Math.random().toString(36).substr(2, 9),
        title: `${formToDuplicate.title} (Copy)`,
        status: "draft",
      };

      return {
        forms: [...state.forms, newForm],
      };
    }),

  renameForm: (id, newTitle) =>
    set((state) => ({
      forms: state.forms.map((form) =>
        form.id === id ? { ...form, title: newTitle } : form
      ),
    })),
}));
