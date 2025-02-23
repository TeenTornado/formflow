import React, { useState } from "react";
import { useFormStore } from "../store/formStore";
import { ArrowLeft, Copy, Check } from "lucide-react";
import axios from "axios";

interface FormOverviewProps {
  onBack: () => void;
}

export default function FormOverview({ onBack }: FormOverviewProps) {
  const { currentForm } = useFormStore();
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  if (!currentForm) return null;

  const handlePublish = async () => {
    try {
      setIsPublishing(true);
      await axios.put(
        `http://localhost:5000/api/forms/${currentForm.id}`,
        {
          ...currentForm,
          status: "published",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.error("Error publishing form:", error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCopyLink = () => {
    const formUrl = `${window.location.origin}/forms/${currentForm.shareableLink}`;
    navigator.clipboard.writeText(formUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft size={20} />
        Back to editor
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{currentForm.title}</h1>
          {currentForm.status !== "published" && (
            <button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {isPublishing ? "Publishing..." : "Publish Form"}
            </button>
          )}
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Share your form</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={
                currentForm.shareableLink
                  ? `${window.location.origin}/forms/${currentForm.shareableLink}`
                  : "Publish the form to get a shareable link"
              }
              readOnly
              className="flex-1 p-2 border border-gray-200 rounded-lg bg-gray-50"
            />
            <button
              onClick={handleCopyLink}
              disabled={!currentForm.shareableLink}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
              {copied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Questions Overview</h2>
          <div className="space-y-4">
            {currentForm.elements.map((element, index) => (
              <div
                key={element.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Q{index + 1}</span>
                  <div>
                    <h3 className="font-medium">{element.question}</h3>
                    {element.description && (
                      <p className="text-sm text-gray-500">
                        {element.description}
                      </p>
                    )}
                    {element.required && (
                      <span className="text-sm text-red-500">Required</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
