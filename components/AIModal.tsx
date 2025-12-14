import React, { useEffect, useState } from 'react';
import { X, Copy, Check, Sparkles, Loader2 } from 'lucide-react';
import { generateBlueprintContent } from '../services/geminiService';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  prompt: string;
  title: string;
}

const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, prompt, title }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && prompt) {
      handleGenerate();
    } else {
      setContent('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, prompt]);

  const handleGenerate = async () => {
    setLoading(true);
    setContent('');
    const result = await generateBlueprintContent(prompt);
    setContent(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl flex flex-col max-h-[85vh] border border-gray-300">
        
        {/* Header - Amazon Style */}
        <div className="flex items-center justify-between p-4 bg-[#f0f2f2] border-b border-gray-200 rounded-t-lg">
          <h3 className="text-lg font-bold text-[#0F1111] flex items-center gap-2">
             <Sparkles className="w-5 h-5 text-[#c45500]" />
             {title}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 gap-4 text-gray-500">
              <Loader2 className="w-10 h-10 animate-spin text-[#FFA41C]" />
              <p>Consulting Intelligence...</p>
            </div>
          ) : (
            <div className="prose max-w-none text-[#0F1111]">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#0F1111]">
                {content}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 flex justify-end gap-3 bg-[#f0f2f2] rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 bg-white hover:bg-gray-50 rounded shadow-sm text-sm font-medium text-gray-700"
          >
            Close
          </button>
          <button 
            onClick={handleCopy}
            disabled={loading || !content}
            className={`flex items-center gap-2 px-6 py-2 rounded shadow-sm text-sm font-medium transition-all ${
              copied 
                ? 'bg-green-100 border border-green-500 text-green-700' 
                : 'bg-[#ffd814] border border-[#fcd200] hover:bg-[#f7ca00] text-black'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy Output'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIModal;