import React, { useState } from 'react';
import { Input, TextArea } from './Inputs';
import { Song } from '../../types';
import { cn } from '../../lib/utils';

interface MainPanelProps {
  song: Song;
  onChange: (song: Song) => void;
  onDropFile: (file: File) => void;
}

export const MainPanel: React.FC<MainPanelProps> = ({ song, onChange, onDropFile }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (field: keyof Song, value: string) => {
    onChange({ ...song, [field]: value });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onDropFile(file);
    }
  };

  return (
    <div 
      className={cn(
        "flex-1 overflow-auto p-8 flex flex-col gap-8 transition-colors relative",
        isDragging ? "bg-lavender-accent/10" : "bg-lavender-bg/50"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="absolute inset-0 z-10 flex items-center justify-center border-4 border-dashed border-lavender-accent pointer-events-none">
          <div className="bg-lavender-bg p-8 rounded-lg shadow-2xl text-2xl font-bold text-lavender-accent">
            Drop Song JSON Here
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-8">
        <Input 
          label="Song Title" 
          placeholder="Enter song title..." 
          value={song.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
        
        <TextArea 
          label="Style (SUNO Format)" 
          placeholder="e.g. Synthpop, Dream Pop, Sapphic, Electric Guitar, Crwth..." 
          rows={3}
          value={song.style}
          onChange={(e) => handleChange('style', e.target.value)}
        />

        <TextArea 
          label="Lyrics & Instructions" 
          placeholder="[Verse 1]\n[Miranda]\nIn the quiet of the morning..." 
          rows={15}
          value={song.lyrics}
          onChange={(e) => handleChange('lyrics', e.target.value)}
        />
      </div>
    </div>
  );
};

