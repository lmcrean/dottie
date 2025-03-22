'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TestPage() {
  const [apiMessage, setApiMessage] = useState<string>('');
  const [dbMessage, setDbMessage] = useState<string>('');
  const [loading, setLoading] = useState<{ api: boolean; db: boolean }>({
    api: false,
    db: false,
  });

  const environment = process.env.NODE_ENV || 'development';

  const testApiConnection = async () => {
    setLoading((prev) => ({ ...prev, api: true }));
    try {
      const response = await axios.get('/api/message');
      setApiMessage(response.data.message || JSON.stringify(response.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiMessage(`Error: ${error.message}`);
      } else {
        setApiMessage('An unknown error occurred');
      }
    } finally {
      setLoading((prev) => ({ ...prev, api: false }));
    }
  };

  const testDbConnection = async () => {
    setLoading((prev) => ({ ...prev, db: true }));
    try {
      const response = await axios.get('/api/db');
      setDbMessage(response.data.message || JSON.stringify(response.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setDbMessage(`Error: ${error.message}`);
      } else {
        setDbMessage('An unknown error occurred');
      }
    } finally {
      setLoading((prev) => ({ ...prev, db: false }));
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Now testing in {environment.toUpperCase()}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">API Connection Test</h2>
          <button
            onClick={testApiConnection}
            disabled={loading.api}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.api ? 'Testing...' : 'Test API Message'}
          </button>
          
          {apiMessage && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Response:</h3>
              <p className="whitespace-pre-wrap break-words">{apiMessage}</p>
            </div>
          )}
        </div>
        
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">SQLite Connection Test</h2>
          <button
            onClick={testDbConnection}
            disabled={loading.db}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading.db ? 'Testing...' : 'Test SQLite Connection'}
          </button>
          
          {dbMessage && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <h3 className="font-medium mb-2">Response:</h3>
              <p className="whitespace-pre-wrap break-words">{dbMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 