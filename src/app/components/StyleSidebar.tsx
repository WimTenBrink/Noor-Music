import React from 'react';
import { STYLES } from '../../constants/styles';
import { LibraryItem } from '../../types';
import { Trash2, Eye, Music, Image as ImageIcon, FileCode, FileText, FileJson, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

interface StyleSidebarProps {
  selected: string[];
  onToggle: (name: string) => void;
  items: LibraryItem[];
  onView: (item: LibraryItem) => void;
  onDelete: (id: string) => void;
}

export const StyleSidebar: React.FC<StyleSidebarProps> = ({ 
  selected, 
  onToggle, 
  items, 
  onView, 
  onDelete 
}) => {
  const [expandedGroups, setExpandedGroups] = React.useState<string[]>(STYLES.map(g => g.type));

  const toggleGroup = (type: string) => {
    setExpandedGroups(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const getItemIcon = (type: LibraryItem['type']) => {
    switch (type) {
      case 'song': return <Music size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'xml': return <FileCode size={14} />;
      case 'json': return <FileJson size={14} />;
      case 'markdown': return <FileText size={14} />;
      default: return <FileText size={14} />;
    }
  };

  return (
    <aside className="w-[20vw] border-l border-lavender-border bg-lavender-bg/80 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-lavender-border bg-lavender-surface/30">
        <h3 className="text-xs font-bold text-lavender-accent uppercase tracking-widest">Styles</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-2 space-y-4">
        {/* Styles List */}
        <div className="space-y-2">
          {STYLES.map(group => (
            <div key={group.type} className="space-y-1">
              <button 
                onClick={() => toggleGroup(group.type)}
                className="w-full flex items-center justify-between p-2 rounded hover:bg-lavender-surface/50 text-xs font-bold text-lavender-accent/70 uppercase tracking-wider transition-colors"
              >
                <span>{group.type}</span>
                {expandedGroups.includes(group.type) ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              {expandedGroups.includes(group.type) && (
                <div className="ml-2 space-y-0.5">
                  {group.substyles.map(style => (
                    <label 
                      key={style.name} 
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-lavender-surface/30 cursor-pointer transition-colors group"
                      title={style.description}
                    >
                      <input 
                        type="checkbox" 
                        checked={selected.includes(style.name)}
                        onChange={() => onToggle(style.name)}
                        className="w-3.5 h-3.5 rounded border-lavender-border text-lavender-accent focus:ring-lavender-accent bg-lavender-bg"
                      />
                      <span className={cn(
                        "text-xs transition-colors",
                        selected.includes(style.name) ? "text-lavender-accent font-bold" : "text-lavender-text/70"
                      )}>
                        {style.name}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
