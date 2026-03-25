import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(String(props.value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        {label && <label className="text-xs font-bold text-lavender-accent uppercase tracking-wider">{label}</label>}
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-lavender-surface rounded text-lavender-accent"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <textarea 
        {...props}
        className="w-full bg-lavender-surface border border-lavender-border rounded p-3 text-lavender-text focus:outline-none focus:border-lavender-accent resize-none font-sans"
      />
    </div>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (props.value) {
      navigator.clipboard.writeText(String(props.value));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="flex justify-between items-center">
        {label && <label className="text-xs font-bold text-lavender-accent uppercase tracking-wider">{label}</label>}
        <button 
          onClick={handleCopy}
          className="p-1 hover:bg-lavender-surface rounded text-lavender-accent"
          title="Copy to clipboard"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </button>
      </div>
      <input 
        {...props}
        className="w-full bg-lavender-surface border border-lavender-border rounded p-3 text-lavender-text focus:outline-none focus:border-lavender-accent font-sans"
      />
    </div>
  );
};
