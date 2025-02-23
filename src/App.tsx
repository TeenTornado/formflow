import React, { useState, useEffect } from 'react';
import { useFormStore } from './store/formStore';
import FormBuilder from './components/FormBuilder';
import FormResults from './components/FormResults';
import Workspace from './components/Workspace';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [currentPage, setCurrentPage] = useState<'login' | 'onboarding' | 'workspace' | 'form' | 'results'>('login');
  const { currentForm, isAuthenticated, setAuthenticated } = useFormStore();

  // Handle browser back button
  useEffect(() => {
    const handlePopState = () => {
      if (isAuthenticated) {
        setCurrentPage('workspace');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isAuthenticated]);

  // Update browser history when navigating
  const navigateTo = (page: 'workspace' | 'form' | 'results' | 'onboarding') => {
    if (page === 'workspace') {
      window.history.pushState(null, '', '/');
    } else if (page === 'form' && currentForm) {
      window.history.pushState(null, '', `/form/${currentForm.id}`);
    }
    setCurrentPage(page);
  };

  const handleLogin = (isNewUser: boolean) => {
    setAuthenticated(true);
    if (isNewUser) {
      setCurrentPage('onboarding');
    } else {
      setCurrentPage('workspace');
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (currentPage === 'onboarding') {
    return <Onboarding onComplete={() => navigateTo('workspace')} />;
  }

  if (currentPage === 'form') {
    return <FormBuilder onBack={() => navigateTo('workspace')} />;
  }

  if (currentPage === 'results' && currentForm) {
    return <FormResults form={currentForm} onBack={() => navigateTo('form')} />;
  }

  return <Workspace onCreateForm={() => navigateTo('form')} onViewResults={() => navigateTo('results')} />;
}

export default App;