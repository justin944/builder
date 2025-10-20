
import React from 'react';
import { Helmet } from 'react-helmet';
import { Routes, Route } from 'react-router-dom';
import CardBuilder from '@/components/CardBuilder';
import { Toaster } from '@/components/ui/toaster';
import HealthCheck from '@/components/HealthCheck';
import useIframeCommunicator from '@/hooks/useIframeCommunicator';

function App() {
  const appRef = useIframeCommunicator();

  return (
    <>
      <Helmet>
        <title>Create Your Card - DechoCards Builder</title>
        <meta name="description" content="Design and customize your professional DechoCards with our easy-to-use card builder. Choose from templates for Kids, Musicians, Athletes, Vendors, and Businesses." />
      </Helmet>
      <div ref={appRef} className="min-h-screen w-full">
        <Routes>
          <Route path="/" element={<CardBuilder />} />
          <Route path="/health" element={<HealthCheck />} />
        </Routes>
        <Toaster />
      </div>
    </>
  );
}

export default App;
