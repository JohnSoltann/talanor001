'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface DebugInfo {
  session: any;
  localStorage: Record<string, string>;
  apiErrors: string[];
  environment: string;
}

const DebugPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    session: null,
    localStorage: {},
    apiErrors: [],
    environment: process.env.NODE_ENV || 'unknown',
  });
  
  const { data: session } = useSession();
  
  useEffect(() => {
    // Update debug info when session changes
    setDebugInfo(prev => ({
      ...prev,
      session
    }));
  }, [session]);
  
  useEffect(() => {
    // Collect localStorage data
    const localStorageData: Record<string, string> = {};
    for(let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        localStorageData[key] = localStorage.getItem(key) || '';
      }
    }
    
    setDebugInfo(prev => ({
      ...prev,
      localStorage: localStorageData
    }));
  }, [isOpen]);
  
  // Global error handler to capture API errors
  useEffect(() => {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        
        // Clone the response as we can only read it once
        const clonedResponse = response.clone();
        
        // Only capture API errors
        if (!response.ok && args[0] && typeof args[0] === 'string' && args[0].includes('/api/')) {
          try {
            const data = await clonedResponse.json();
            const errorMessage = `API Error (${response.status}): ${args[0]} - ${data.message || 'Unknown error'}`;
            
            setDebugInfo(prev => ({
              ...prev, 
              apiErrors: [...prev.apiErrors, errorMessage].slice(-10) // Keep last 10 errors
            }));
          } catch (e) {
            // If we can't parse the response as JSON, just log the status
            const errorMessage = `API Error (${response.status}): ${args[0]} - Could not parse response`;
            setDebugInfo(prev => ({
              ...prev, 
              apiErrors: [...prev.apiErrors, errorMessage].slice(-10)
            }));
          }
        }
        
        return response;
      } catch (error) {
        // Network errors
        const errorMessage = `Network Error: ${args[0]} - ${(error as Error).message}`;
        setDebugInfo(prev => ({
          ...prev, 
          apiErrors: [...prev.apiErrors, errorMessage].slice(-10)
        }));
        throw error;
      }
    };
    
    return () => {
      window.fetch = originalFetch;
    };
  }, []);
  
  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-md shadow-lg z-50 hover:bg-red-600 transition-colors"
      >
        دیباگ
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">پنل دیباگ</h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          {/* Environment */}
          <div>
            <h3 className="text-lg font-bold mb-2">محیط</h3>
            <div className="bg-gray-100 p-3 rounded">
              <p><strong>NODE_ENV:</strong> {debugInfo.environment}</p>
              <p><strong>Next.js:</strong> {process.env.NEXT_PUBLIC_VERCEL_ENV || 'local'}</p>
            </div>
          </div>
          
          {/* Session */}
          <div>
            <h3 className="text-lg font-bold mb-2">Session</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo.session, null, 2)}
            </pre>
          </div>
          
          {/* Local Storage */}
          <div>
            <h3 className="text-lg font-bold mb-2">Local Storage</h3>
            <pre className="bg-gray-100 p-3 rounded overflow-auto text-sm">
              {JSON.stringify(debugInfo.localStorage, null, 2)}
            </pre>
          </div>
          
          {/* API Errors */}
          <div>
            <h3 className="text-lg font-bold mb-2">خطاهای API (۱۰ مورد آخر)</h3>
            {debugInfo.apiErrors.length > 0 ? (
              <div className="bg-red-50 p-3 rounded overflow-auto text-sm">
                {debugInfo.apiErrors.map((error, index) => (
                  <p key={index} className="mb-1 text-red-600">{error}</p>
                ))}
              </div>
            ) : (
              <p className="bg-gray-100 p-3 rounded">هیچ خطایی ثبت نشده است</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel; 