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
                      key={style} 
                      className="flex items-center gap-2 p-1.5 rounded hover:bg-lavender-surface/30 cursor-pointer transition-colors group"
                    >
                      <input 
                        type="checkbox" 
                        checked={selected.includes(style)}
                        onChange={() => onToggle(style)}
                        className="w-3.5 h-3.5 rounded border-lavender-border text-lavender-accent focus:ring-lavender-accent bg-lavender-bg"
                      />
                      <span className={cn(
                        "text-xs transition-colors",
                        selected.includes(style) ? "text-lavender-accent font-bold" : "text-lavender-text/70"
                      )}>
                        {style}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Library Items Section */}
        {items.length > 0 && (
          <div className="pt-4 border-t border-lavender-border/30">
            <h4 className="text-[10px] font-bold text-lavender-text/40 uppercase tracking-widest mb-2 px-2">Project Content</h4>
            <div className="flex flex-col gap-1">
              {items.map(item => (
                <div 
                  key={item.id} 
                  className="group flex items-center justify-between p-2 rounded hover:bg-lavender-surface/50 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="text-lavender-accent/50">{getItemIcon(item.type)}</div>
                    <span className="text-xs truncate font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => onView(item)}
                      className="p-1 hover:bg-lavender-accent hover:text-lavender-bg rounded text-lavender-accent transition-colors"
                      title="View"
                    >
                      <Eye size={14} />
                    </button>
                    <button 
                      onClick={() => onDelete(item.id)}
                      className="p-1 hover:bg-red-500 hover:text-white rounded text-red-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
