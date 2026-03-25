import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { TextArea } from './Inputs';

interface GenerateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (instructions: string) => void;
  initialValue?: string;
  selectedInstruments: string[];
  selectedStyles: string[];
}

export const GenerateDialog: React.FC<GenerateDialogProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialValue = '',
  selectedInstruments,
  selectedStyles
}) => {
  const [instructions, setInstructions] = useState(initialValue);

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={onClose} 
      onConfirm={() => onConfirm(instructions)} 
      title="Generate / Modify Song"
    >
      <div className="flex flex-col gap-4 min-w-[500px]">
        <div className="space-y-2">
          <p className="text-sm text-lavender-text/70 font-medium">Selected Style & Instruments:</p>
          <div className="flex flex-wrap gap-2">
            {selectedStyles.map(s => (
              <span key={s} className="px-2 py-0.5 bg-lavender-accent/20 text-lavender-accent rounded text-[10px] font-bold uppercase tracking-wider">{s}</span>
            ))}
            {selectedInstruments.map(i => (
              <span key={i} className="px-2 py-0.5 bg-lavender-surface text-lavender-text/70 rounded text-[10px] font-bold uppercase tracking-wider">{i}</span>
            ))}
            {selectedStyles.length === 0 && selectedInstruments.length === 0 && (
              <span className="text-[10px] text-lavender-text/30 italic">No specific styles or instruments selected.</span>
            )}
          </div>
        </div>
        <TextArea 
          label="Instructions" 
          placeholder="e.g. Write a song about a rainy day in Utrecht, focusing on the bond between Miranda and Annelies..." 
          rows={6}
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
      </div>
    </Dialog>
  );
};
