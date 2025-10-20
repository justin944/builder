
import React from 'react';
import { Helmet } from 'react-helmet';
import CardBuilder from '@/components/CardBuilder';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <>
      <Helmet>
        <title>Create Your Card - DechoCards Builder</title>
        <meta name="description" content="Design and customize your professional DechoCards with our easy-to-use card builder. Choose from templates for Kids, Musicians, Athletes, Vendors, and Businesses." />
      </Helmet>
      <div className="min-h-screen w-full">
        <CardBuilder />
        <Toaster />
      </div>
    </>
  );
}

export default App;
  