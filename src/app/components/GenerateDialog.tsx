import React, { useState, useEffect } from 'react';
import { Dialog } from './Dialog';
import { TextArea } from './Inputs';
import { LANGUAGE_GROUPS, findGroupByDialectId } from '../utils/languages';

interface GenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instructions: string, musicInspiration: string, selectedDialectId: string, rating: string) => void;
  initialValue?: string;
  selectedInstruments: string[];
  selectedStyles: string[];
  currentDialectId: string;
  currentRating: string;
}

export const GenerateDialog: React.FC<GenerateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialValue = '',
  selectedInstruments,
  selectedStyles,
  currentDialectId,
  currentRating
}) => {
  const [instructions, setInstructions] = useState(initialValue);
  const [musicInspiration, setMusicInspiration] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [dialogDialectId, setDialogDialectId] = useState(currentDialectId);
  const [dialogRating, setDialogRating] = useState(currentRating);

  // Sync state values when modal is opened with new props
  useEffect(() => {
    if (isOpen) {
      setDialogDialectId(currentDialectId);
      setDialogRating(currentRating);
      
      const group = findGroupByDialectId(currentDialectId);
      if (group) {
        setSelectedGroupId(group.id);
      } else {
        setSelectedGroupId(LANGUAGE_GROUPS[0]?.id || 'english');
      }
    }
  }, [isOpen, currentDialectId, currentRating]);

  // Handle language group change
  const handleGroupChange = (groupId: string) => {
    setSelectedGroupId(groupId);
    const group = LANGUAGE_GROUPS.find(g => g.id === groupId);
    if (group && group.dialects.length > 0) {
      setDialogDialectId(group.dialects[0].id);
    }
  };

  const currentGroup = LANGUAGE_GROUPS.find(g => g.id === selectedGroupId) || LANGUAGE_GROUPS[0];

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      onConfirm={() => onConfirm(instructions, musicInspiration, dialogDialectId, dialogRating)} 
      title="Generate / Modify Song"
      size="full"
    >
      <div className="flex flex-col gap-6 h-full text-lavender-text">
        {/* Top summary section */}
        <div className="p-4 bg-lavender-surface/30 border border-lavender-border/40 rounded-lg space-y-2">
          <p className="text-sm text-lavender-text/70 font-bold uppercase tracking-wider">Actively Selected Musics & Instruments:</p>
          <div className="flex flex-wrap gap-2">
            {selectedStyles.map(s => (
              <span key={s} className="px-2.5 py-1 bg-lavender-accent/20 text-lavender-accent rounded text-[11px] font-extrabold uppercase tracking-wider border border-lavender-accent/30">{s}</span>
            ))}
            {selectedInstruments.map(i => (
              <span key={i} className="px-2.5 py-1 bg-lavender-surface border border-lavender-border rounded text-[11px] font-bold uppercase tracking-wider">{i}</span>
            ))}
            {selectedStyles.length === 0 && selectedInstruments.length === 0 && (
              <span className="text-xs text-lavender-text/40 italic">No specific styles or instruments toggled on sidebars yet.</span>
            )}
          </div>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Left Column: Settings and Metadata */}
          <div className="flex flex-col gap-6 justify-between p-5 bg-lavender-surface/10 border border-lavender-border/20 rounded-lg">
            <div className="space-y-5">
              
              {/* Language Choice Wrapper (Two parts) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Language Group Select */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">Language Group</label>
                  <select 
                    value={selectedGroupId}
                    onChange={(e) => handleGroupChange(e.target.value)}
                    className="w-full bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent font-sans cursor-pointer transition-colors hover:border-lavender-accent/50"
                  >
                    {LANGUAGE_GROUPS.map((group) => (
                      <option key={group.id} value={group.id} className="bg-lavender-bg text-lavender-text font-normal">
                        {group.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Dialect Select */}
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">Accent / Dialect / Style</label>
                  <select 
                    value={dialogDialectId}
                    onChange={(e) => setDialogDialectId(e.target.value)}
                    className="w-full bg-lavender-surface border border-lavender-border rounded p-4 text-base text-lavender-text focus:outline-none focus:border-lavender-accent font-sans cursor-pointer transition-colors hover:border-lavender-accent/50"
                  >
                    {currentGroup?.dialects.map((d) => (
                      <option key={d.id} value={d.id} className="bg-lavender-bg text-lavender-text font-normal">
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Rating setting */}
              <div className="flex flex-col gap-1.5 w-full">
                <label className="text-sm font-extrabold text-lavender-accent uppercase tracking-wider">Content Rating Restriction</label>
                <select 
                  value={dialogRating}
                  onChange={(e) => setDialogRating(e.target.value)}
                  className="w-full bg-lavender-surface border border-lavender-border rounded p-4 text-lg text-lavender-text focus:outline-none focus:border-lavender-accent font-sans cursor-pointer transition-colors hover:border-lavender-accent/50"
                >
                  <option value="G" className="bg-lavender-bg">G (General Audience)</option>
                  <option value="PG" className="bg-lavender-bg">PG (Parental Guidance)</option>
                  <option value="PG-13" className="bg-lavender-bg">PG-13 (Parents Strongly Cautioned)</option>
                  <option value="R" className="bg-lavender-bg">R (Restricted)</option>
                  <option value="NC-17" className="bg-lavender-bg">NC-17 (Clearly Adults Only)</option>
                </select>
              </div>
            </div>

            {/* Inspiration text box */}
            <TextArea 
              label="Bands / Artists Inspiration (Composition/Style only)" 
              placeholder="e.g. A mixture of Madonna with Elvis Presley..." 
              rows={4}
              value={musicInspiration}
              onChange={(e) => setMusicInspiration(e.target.value)}
            />
          </div>

          {/* Right Column: Narrative Instructions */}
          <div className="flex flex-col p-5 bg-lavender-surface/10 border border-lavender-border/20 rounded-lg">
            <TextArea 
              label="Lyric Instructions & Song Prompt" 
              placeholder="e.g. Write a song about a rainy day in Utrecht, focusing on the beautiful bond between Miranda and Annelies..." 
              rows={12}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
            />
          </div>
        </div>
      </div>
    </Dialog>
  );
};
