import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { ReportView } from './components/ReportView';
import { UserInput, HealthReport } from './types';
import { generateHealthReport } from './services/geminiService';
import { Monitor } from 'lucide-react';

export default function App() {
  const [report, setReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (data: UserInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await generateHealthReport(data);
      setReport(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setReport(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-800">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <Monitor size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              DeviceSense AI
            </h1>
          </div>
          <a href="https://ai.google.dev/" target="_blank" rel="noreferrer" className="text-xs font-medium text-slate-400 hover:text-indigo-600 transition-colors">
            Powered by Gemini
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center animate-pulse">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {!report ? (
          <div className="animate-fade-in">
             <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                  Is Your PC Running Slow?
                </h2>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  Get a comprehensive health check, actionable cleanup tips, and battery analysis in seconds.
                </p>
             </div>
             <InputForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : (
          <ReportView report={report} onReset={handleReset} />
        )}
      </main>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-fade-in-up {
           animation: fadeIn 0.7s ease-out forwards;
        }
      `}</style>
    </div>
  );
}