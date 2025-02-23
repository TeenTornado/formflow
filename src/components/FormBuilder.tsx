import React, { useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useFormStore } from "../store/formStore";
import ElementToolbar from "./ElementToolbar";
import SortableFormElement from "./SortableFormElement";
import FormOverview from "./FormOverview";
import FormPreview from "./FormPreview";
import { ArrowLeft, Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "./Breadcrumb";

interface FormBuilderProps {
  onBack: () => void;
}

export default function FormBuilder({ onBack }: FormBuilderProps) {
  const {
    currentForm,
    reorderElements,
    updateForm,
    workspaces,
    currentWorkspace,
  } = useFormStore();
  const [showOverview, setShowOverview] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showPublishDialog, setShowPublishDialog] = useState(false);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = currentForm?.elements.findIndex(
        (el) => el.id === active.id
      );
      const newIndex = currentForm?.elements.findIndex(
        (el) => el.id === over.id
      );

      if (oldIndex !== undefined && newIndex !== undefined) {
        reorderElements(oldIndex, newIndex);
      }
    }
  };

  const handlePublish = () => {
    if (!currentForm) return;

    const isValid = currentForm.elements.every((element) => {
      if (element.required) {
        return element.question.trim() !== "";
      }
      return true;
    });

    if (!isValid) {
      alert("Please fill in all required questions before publishing");
      return;
    }

    updateForm({ ...currentForm, status: "published" });
    setShowPublishDialog(true);
  };

  const handlePreviewSubmit = (responses: Record<string, any>) => {
    console.log("Form responses:", responses);
    setShowPreview(false);
  };

  if (!currentForm) return null;

  const workspace = workspaces.find((w) => w.id === currentWorkspace);
  const breadcrumbItems = [
    { label: "Workspaces", onClick: onBack },
    { label: workspace?.name || "", onClick: onBack },
    { label: currentForm.title },
  ];

  if (showPreview) {
    return (
      <>
        <button
          onClick={() => setShowPreview(false)}
          className="fixed top-4 right-4 z-50 px-4 py-2 bg-white text-gray-600 rounded-lg shadow-lg hover:bg-gray-50"
        >
          Exit Preview
        </button>
        <FormPreview form={currentForm} onSubmit={handlePreviewSubmit} />
      </>
    );
  }

  if (showOverview) {
    return <FormOverview onBack={() => setShowOverview(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-20">
        <div className="max-w-full mr-auto">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
            </button>
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={currentForm.title}
              onChange={(e) =>
                updateForm({ ...currentForm, title: e.target.value })
              }
              className="text-3xl font-bold bg-transparent border-none focus:outline-none hover:bg-gray-50 p-2 rounded-lg transition-colors"
              placeholder="Untitled Form"
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <Eye size={20} />
                Preview
              </button>
              <button
                onClick={handlePublish}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sticky Sidebar */}
        <div className="w-64 h-[calc(100vh-116px)] bg-gray-50 border-r border-gray-200 overflow-y-auto sticky top-[116px]">
          <div className="p-4">
            <ElementToolbar />
          </div>
        </div>

        {/* Main Form Area */}
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto">
            <DndContext
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={currentForm.elements}
                strategy={verticalListSortingStrategy}
              >
                {currentForm.elements.map((element) => (
                  <SortableFormElement key={element.id} element={element} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      {/* Publish Success Dialog */}
      <AnimatePresence>
        {showPublishDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowPublishDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">🎉 Form Published!</h2>
              <p className="text-gray-600 mb-6">
                Your form is now live and ready to share. You can view responses
                and share the form link from the overview page.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowPublishDialog(false);
                    setShowOverview(true);
                  }}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  View Overview
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
