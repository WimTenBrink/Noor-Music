import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Download, Copy, Check } from 'lucide-react';

interface KaraokeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lyrics: string;
}

export const KaraokeDialog: React.FC<KaraokeDialogProps> = ({ isOpen, onClose, title, lyrics }) => {
  const [copied, setCopied] = useState(false);

  // Strip out all tags like [Verse], [Miranda - Soprano], etc.
  const cleanLyrics = lyrics.replace(/\[.*?\]/g, '').trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(cleanLyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'pdf') => {
    if (format === 'md') {
      const content = `# ${title || 'Untitled Song'}\n\n${cleanLyrics}`;
      const blob = new Blob([content], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title || 'song'}.md`;
      a.click();
    } else {
      window.print(); // Simple PDF export via print
    }
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Karaoke Mode"
      onConfirm={onClose}
    >
      <div className="flex flex-col gap-4 min-w-[60vw] max-h-[85vh] overflow-hidden">
        <div className="flex justify-end gap-2 p-2 border-b border-lavender-border">
          <button 
            onClick={handleCopy} 
            className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors" 
            title="Copy Lyrics"
          >
            {copied ? <Check size={18} className="text-green-400" /> : <Copy size={18} />}
          </button>
          <button 
            onClick={() => handleDownload('md')} 
            className="p-2 hover:bg-lavender-surface rounded text-lavender-text transition-colors" 
            title="Download Markdown"
          >
            <Download size={18} />
          </button>
          <button 
            onClick={() => handleDownload('pdf')} 
            className="px-3 py-1 hover:bg-lavender-surface rounded text-lavender-text font-bold text-sm transition-colors border border-lavender-border"
            title="Export to PDF"
          >
            PDF
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8 bg-lavender-bg/50 rounded-lg">
          <h1 className="text-4xl font-bold text-lavender-accent text-center border-b border-lavender-border pb-4 mb-8">
            {title || 'Untitled Song'}
          </h1>
          
          <div className="whitespace-pre-wrap text-2xl leading-relaxed text-center text-lavender-text font-medium">
            {cleanLyrics || 'No lyrics available.'}
          </div>
        </div>
      </div>
    </Dialog>
  );
};
