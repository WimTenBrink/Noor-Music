import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Download, Copy, Check } from 'lucide-react';

interface MarkdownViewProps {
  content: string;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'pdf') => {
    if (format === 'md') {
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.md';
      a.click();
    } else {
      window.print(); // Simple PDF export via print
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex justify-end gap-2 p-2 border-b border-lavender-border">
        <button onClick={handleCopy} className="p-2 hover:bg-lavender-surface rounded" title="Copy">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
        <button onClick={() => handleDownload('md')} className="p-2 hover:bg-lavender-surface rounded" title="Download Markdown"><Download size={16} /></button>
        <button onClick={() => handleDownload('pdf')} className="p-2 hover:bg-lavender-surface rounded font-bold text-xs">PDF</button>
      </div>
      <div className="flex-1 overflow-auto p-6 markdown-body">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
