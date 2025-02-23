import React, { useState } from 'react';
import {
  Search,
  Plus,
  Grid,
  List,
  Calendar,
  Share2,
  Settings,
  ChevronDown,
  MoreHorizontal,
  Users,
  FileSpreadsheet,
  Copy,
  Trash2,
  ExternalLink,
  BarChart2,
  LogOut,
} from 'lucide-react';
import { useFormStore } from '../store/formStore';
import { motion, AnimatePresence } from 'framer-motion';

interface WorkspaceProps {
  onCreateForm: () => void;
  onViewResults: () => void;
}

interface RenameModalProps {
  formId: string;
  currentTitle: string;
  onClose: () => void;
}

function RenameModal({ formId, currentTitle, onClose }: RenameModalProps) {
  const [newTitle, setNewTitle] = useState(currentTitle);
  const { renameForm } = useFormStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim()) {
      renameForm(formId, newTitle);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg p-6 w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Rename Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Form name"
            className="w-full p-2 border border-gray-200 rounded-lg"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Save
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Workspace({ onCreateForm, onViewResults }: WorkspaceProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewWorkspaceModal, setShowNewWorkspaceModal] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [activeFormMenu, setActiveFormMenu] = useState<string | null>(null);
  const [showRenameModal, setShowRenameModal] = useState<string | null>(null);

  const {
    forms,
    workspaces,
    currentWorkspace,
    addWorkspace,
    setCurrentWorkspace,
    createForm,
    deleteForm,
    duplicateForm,
    setAuthenticated,
  } = useFormStore();

  const handleCreateWorkspace = () => {
    if (newWorkspaceName.trim()) {
      addWorkspace(newWorkspaceName);
      setNewWorkspaceName('');
      setShowNewWorkspaceModal(false);
    }
  };

  const handleCreateForm = () => {
    if (currentWorkspace) {
      createForm(currentWorkspace);
      onCreateForm();
    }
  };

  const handleFormAction = (formId: string, action: string) => {
    switch (action) {
      case 'delete':
        deleteForm(formId);
        break;
      case 'duplicate':
        duplicateForm(formId);
        break;
      case 'rename':
        setShowRenameModal(formId);
        break;
      case 'results':
        onViewResults();
        break;
    }
    setActiveFormMenu(null);
  };

  const handleSignOut = () => {
    setAuthenticated(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        <div className="mb-8">
          <button
            onClick={handleCreateForm}
            className="w-full bg-purple-600 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            Create new form
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
            onClick={() => setShowNewWorkspaceModal(true)}
          >
            <span className="text-gray-700">Workspaces</span>
            <Plus size={18} className="text-gray-400" />
          </div>
          {workspaces.map((workspace) => (
            <div
              key={workspace.id}
              className={`flex items-center justify-between p-2 hover:bg-gray-100 rounded-lg cursor-pointer ${
                currentWorkspace === workspace.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setCurrentWorkspace(workspace.id)}
            >
              <span className="text-gray-700">{workspace.name}</span>
              <ChevronDown size={18} className="text-gray-400" />
            </div>
          ))}
        </div>

        <button
          onClick={handleSignOut}
          className="absolute bottom-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <LogOut size={20} />
          Sign out
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Banner */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="text-purple-600">✨</span>
              <span>Hey! Just to let you know you can collect 10 responses this month for free.</span>
            </div>
            <button className="text-white bg-green-600 px-4 py-1.5 rounded-lg text-sm">
              Get more responses
            </button>
          </div>
        </div>

        {/* Main Content Header */}
        <div className="max-w-7xl mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-semibold">My workspace</h1>
              <button className="text-gray-500 hover:text-gray-700">
                <Share2 size={20} />
              </button>
              <button className="text-gray-500 hover:text-gray-700">
                <Settings size={20} />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <button
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('list')}
              >
                <List size={20} className="text-gray-600" />
              </button>
              <button
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                onClick={() => setViewMode('grid')}
              >
                <Grid size={20} className="text-gray-600" />
              </button>
              <button className="flex items-center gap-2 text-gray-600">
                <Calendar size={20} />
                <span>Date created</span>
                <ChevronDown size={16} />
              </button>
            </div>
          </div>

          {/* Forms Grid */}
          <div className={`grid ${viewMode === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
            {forms.map((form) => (
              <div key={form.id} className="relative bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="text-purple-600" size={20} />
                  </div>
                  <button
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => setActiveFormMenu(activeFormMenu === form.id ? null : form.id)}
                  >
                    <MoreHorizontal size={20} />
                  </button>

                  {/* Form Actions Menu */}
                  <AnimatePresence>
                    {activeFormMenu === form.id && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 top-12 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10"
                      >
                        <button
                          onClick={() => handleFormAction(form.id, 'open')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <ExternalLink size={16} />
                          Open
                        </button>
                        <button
                          onClick={() => handleFormAction(form.id, 'copy')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Copy size={16} />
                          Copy link
                        </button>
                        <button
                          onClick={() => handleFormAction(form.id, 'results')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <BarChart2 size={16} />
                          Results
                        </button>
                        <button
                          onClick={() => handleFormAction(form.id, 'rename')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleFormAction(form.id, 'duplicate')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          Duplicate
                        </button>
                        <button
                          onClick={() => handleFormAction(form.id, 'delete')}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
                          Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <h3 className="text-lg font-medium mb-2">{form.title}</h3>
                <p className="text-gray-500 text-sm mb-4">{form.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span>{form.responses || 0} responses</span>
                  </div>
                  <span>Completion: {form.completion || '0%'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Workspace Modal */}
      <AnimatePresence>
        {showNewWorkspaceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96"
            >
              <h2 className="text-xl font-semibold mb-4">Create a new workspace</h2>
              <input
                type="text"
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                placeholder="Workspace name"
                className="w-full p-2 border border-gray-200 rounded-lg mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowNewWorkspaceModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateWorkspace}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Create workspace
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rename Modal */}
      <AnimatePresence>
        {showRenameModal && (
          <RenameModal
            formId={showRenameModal}
            currentTitle={forms.find(f => f.id === showRenameModal)?.title || ''}
            onClose={() => setShowRenameModal(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}