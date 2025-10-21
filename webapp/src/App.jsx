
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
        <title>Create Your Decho Card - DechoCards Builder</title>
        <meta name="description" content="Design and customize your professional DechoCard with our easy-to-use card builder." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Bangers&family=Luckiest+Guy&family=Kalam:wght@700&family=Roboto:wght@700&display=swap" rel="stylesheet" />
      </Helmet>
      <div ref={appRef} className="min-h-screen w-full bg-white">
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
