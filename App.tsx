
import React, { useState, useCallback } from 'react';
import { KurdishDialect } from './types';
import { translateText } from './services/geminiService';

const SwapIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h18m-7.5-14L21 7.5m0 0L16.5 12M21 7.5H3" />
  </svg>
);

const LoadingSpinner: React.FC<{className?: string}> = ({ className }) => (
  <svg className={`animate-spin ${className || "-ml-1 mr-3 h-5 w-5 text-white"}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [outputText, setOutputText] = useState<string>('');
  const [sourceDialect, setSourceDialect] = useState<KurdishDialect>(KurdishDialect.Sorani);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const targetDialect = sourceDialect === KurdishDialect.Sorani ? KurdishDialect.Badini : KurdishDialect.Sorani;

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      setOutputText('');
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutputText(''); 
    try {
      const translation = await translateText(inputText, sourceDialect, targetDialect);
      setOutputText(translation);
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred during translation.');
      setOutputText('');
    } finally {
      setIsLoading(false);
    }
  }, [inputText, sourceDialect, targetDialect]);

  const handleSwapDialects = () => {
    setSourceDialect(targetDialect); 
    setInputText(outputText); 
    setOutputText(inputText); 
    setError(null);
  };
  
  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center p-4 sm:p-6 md:p-8 selection:bg-purple-500 selection:text-white">
      <header className="mb-6 md:mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
          Kurdish Dialect Translator
        </h1>
        <p className="text-slate-400 mt-2 text-base sm:text-lg">Translate between Sorani and Badini Kurdish dialects with ease.</p>
      </header>

      <main className="w-full max-w-4xl bg-slate-800 shadow-2xl rounded-xl p-5 sm:p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4 md:gap-6 items-start">
          {/* Input Section */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="inputText" className="text-lg sm:text-xl font-semibold text-purple-400">{sourceDialect} Kurdish</label>
            <textarea
              id="inputText"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text in ${sourceDialect}...`}
              rows={8}
              className="w-full p-3 sm:p-4 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-y placeholder-slate-500 text-slate-50 transition-colors duration-150 text-base sm:text-lg"
              disabled={isLoading}
            />
          </div>

          {/* Swap Button */}
          <div className="flex items-center justify-center md:pt-10"> {/* pt-10 to align with textarea top roughly */}
            <button
              onClick={handleSwapDialects}
              className="p-3 bg-slate-700 hover:bg-purple-600 text-slate-100 rounded-full transition-all duration-150 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-800"
              aria-label="Swap dialects and text"
              disabled={isLoading}
            >
              <SwapIcon className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Output Section */}
          <div className="flex flex-col space-y-2">
            <label htmlFor="outputText" className="text-lg sm:text-xl font-semibold text-pink-500">{targetDialect} Kurdish</label>
            <textarea
              id="outputText"
              value={outputText}
              readOnly
              placeholder={`Translation in ${targetDialect} will appear here...`}
              rows={8}
              className="w-full p-3 sm:p-4 bg-slate-700 border-2 border-slate-600 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-y placeholder-slate-500 text-slate-50 transition-colors duration-150 text-base sm:text-lg"
            />
          </div>
        </div>

        {/* Action Buttons & Status */}
        <div className="mt-6 md:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleTranslate}
            disabled={isLoading || !inputText.trim()}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all duration-150 ease-in-out disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-md flex items-center justify-center text-base sm:text-lg"
          >
            {isLoading ? (
              <>
                <LoadingSpinner className="mr-2 h-5 w-5 text-white" />
                Translating...
              </>
            ) : (
              'Translate'
            )}
          </button>
           <button
            onClick={handleClear}
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-slate-600 hover:bg-slate-500 text-slate-100 font-semibold rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-800 transition-colors duration-150 ease-in-out disabled:opacity-60 text-base sm:text-lg"
          >
            Clear Text
          </button>
        </div>

        {error && (
          <div className="mt-6 p-3 sm:p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg text-center">
            <p role="alert" className="text-sm sm:text-base font-medium">{error}</p>
          </div>
        )}
      </main>
      
      <footer className="mt-10 md:mt-12 text-center text-xs sm:text-sm text-slate-500">
        <p>Powered by Gemini API. Interface by AI.</p>
        <p>&copy; {new Date().getFullYear()} Kurdish Dialect Translator. For demonstration purposes only.</p>
      </footer>
    </div>
  );
};

export default App;
