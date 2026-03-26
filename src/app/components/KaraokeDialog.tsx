import React from 'react';
import { Dialog } from './Dialog';

interface KaraokeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  lyrics: string;
}

export const KaraokeDialog: React.FC<KaraokeDialogProps> = ({ isOpen, onClose, title, lyrics }) => {
  // Strip out all tags like [Verse], [Miranda - Soprano], etc.
  const cleanLyrics = lyrics.replace(/\[.*?\]/g, '').trim();

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Karaoke Mode"
      onConfirm={onClose}
    >
      <div className="flex flex-col gap-8 min-w-[60vw] max-h-[70vh] overflow-auto p-8 bg-lavender-bg/50 rounded-lg">
        <h1 className="text-4xl font-bold text-lavender-accent text-center border-b border-lavender-border pb-4">
          {title || 'Untitled Song'}
        </h1>
        
        <div className="whitespace-pre-wrap text-2xl leading-relaxed text-center text-lavender-text font-medium">
          {cleanLyrics || 'No lyrics available.'}
        </div>
      </div>
    </Dialog>
  );
};
