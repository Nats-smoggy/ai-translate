import React, { useState } from 'react';
import { translateText } from './services/geminiService';
import { TranslationData } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState<TranslationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await translateText(inputText);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "发生了意外错误");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleTranslate();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white mb-4 shadow-lg shadow-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
            </svg>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            AI 翻译助手
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            一键将中文翻译为英文，并自动提取核心关键词。
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
          <div className="p-6 sm:p-8 space-y-6">
            
            {/* Input Section */}
            <div className="space-y-2">
              <label htmlFor="input" className="block text-sm font-semibold text-slate-700">
                中文原文
              </label>
              <div className="relative">
                <textarea
                  id="input"
                  rows={5}
                  className="w-full rounded-xl border-slate-200 bg-slate-50 p-4 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-blue-500 sm:text-lg resize-none transition-shadow"
                  placeholder="请输入您想要翻译的中文内容..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <div className="absolute bottom-3 right-3 text-xs text-slate-400 font-medium">
                  {inputText.length} 字
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleTranslate}
              disabled={isLoading || !inputText.trim()}
              className={`w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl text-base font-bold text-white shadow-sm transition-all duration-200
                ${isLoading || !inputText.trim() 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.01] active:scale-[0.99]'
                }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  翻译中...
                </>
              ) : (
                '开始翻译'
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl bg-red-50 p-4 border border-red-100 flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">出错了</h3>
                  <div className="mt-2 text-sm text-red-700">{error}</div>
                </div>
              </div>
            )}
          </div>

          {/* Result Section */}
          {result && (
            <div className="bg-slate-50 border-t border-slate-100 p-6 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid gap-6">
                
                {/* Translation Output */}
                <div className="space-y-2">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    英文翻译
                  </h2>
                  <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-lg text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {result.translation}
                    </p>
                  </div>
                </div>

                {/* Keywords Output */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                    </svg>
                    关键词
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {result.keywords.map((keyword, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-50 text-blue-700 border border-blue-100"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400">
          由 DeepSeek V3 • React • Tailwind CSS 驱动
        </p>
      </div>
    </div>
  );
}

export default App;