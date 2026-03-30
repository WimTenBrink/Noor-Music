import React, { useState } from 'react';
import { NoorLogo } from './NoorLogo';
import { FileText, Edit, Settings, HelpCircle, ChevronDown, Wand2, Terminal, Mic2, ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  onAction: (action: string) => void;
  onGenerate: () => void;
  onShowLogs: () => void;
  rating: string;
  setRating: (rating: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onAction, onGenerate, onShowLogs, rating, setRating }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const menus = [
    {
      id: 'file',
      label: 'File',
      icon: <FileText size={16} />,
      items: [
        { id: 'load', label: 'Load' },
        { id: 'save', label: 'Save' },
        { id: 'clear', label: 'Clear' },
      ]
    },
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit size={16} />,
      items: [
        { id: 'cut', label: 'Cut' },
        { id: 'copy', label: 'Copy' },
        { id: 'paste', label: 'Paste' },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
      items: [
        { id: 'api-key', label: 'API Key' },
      ]
    },
    {
      id: 'singers',
      label: 'Singers',
      icon: <Mic2 size={16} />,
      items: [
        { id: 'the-band', label: 'The Band' },
        { id: 'singer-miranda', label: 'Miranda Noor' },
        { id: 'singer-annelies', label: 'Annelies Brink' },
        { id: 'singer-fannie', label: 'Fannie de Jong' },
        { id: 'singer-emma', label: 'Emma Vermeer' },
      ]
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle size={16} />,
      items: [
        { id: 'system-instructions', label: 'System Instructions' },
        { id: 'manual', label: 'Manual' },
        { id: 'code-overview', label: 'Code Overview' },
      ]
    }
  ];

  return (
    <header className="h-14 border-b border-lavender-border bg-lavender-bg flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <NoorLogo className="w-8 h-8 text-lavender-accent" />
          <h1 className="text-xl font-bold tracking-tighter text-lavender-accent">Noor Music</h1>
        </div>

        <nav className="flex items-center gap-2">
          {menus.map(menu => (
            <div key={menu.id} className="relative">
              <button 
                onClick={() => setActiveMenu(activeMenu === menu.id ? null : menu.id)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded text-sm font-bold transition-colors",
                  activeMenu === menu.id ? "bg-lavender-surface text-lavender-accent" : "hover:bg-lavender-surface/50"
                )}
              >
                {menu.icon}
                {menu.label}
                <ChevronDown size={14} className={cn("transition-transform", activeMenu === menu.id && "rotate-180")} />
              </button>

              {activeMenu === menu.id && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-lavender-surface border border-lavender-border rounded shadow-xl py-1 z-50">
                  {menu.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onAction(item.id);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-lavender-accent hover:text-lavender-bg transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={onShowLogs}
          className="p-2 hover:bg-lavender-surface rounded text-lavender-text/70"
          title="Show Logs"
        >
          <Terminal size={20} />
        </button>

        <div className="flex items-center gap-2 px-3 py-1.5 bg-lavender-surface rounded border border-lavender-border">
          <span className="text-[10px] font-bold text-lavender-text/50 uppercase tracking-widest">Rating</span>
          <select 
            value={rating} 
            onChange={(e) => setRating(e.target.value)}
            className="bg-transparent text-sm font-bold text-lavender-accent outline-none cursor-pointer"
          >
            <option value="G">G</option>
            <option value="PG">PG</option>
            <option value="PG-13">PG-13</option>
            <option value="R">R</option>
            <option value="NC-17">NC-17</option>
          </select>
        </div>

        <button 
          onClick={() => onAction('images')}
          className="flex items-center gap-2 px-4 py-2 border border-lavender-accent/50 text-lavender-accent/80 font-bold rounded-full hover:bg-lavender-accent hover:text-lavender-bg transition-all"
        >
          <ImageIcon size={18} />
          Images
        </button>
        <button 
          onClick={() => onAction('karaoke')}
          className="flex items-center gap-2 px-4 py-2 border border-lavender-accent text-lavender-accent font-bold rounded-full hover:bg-lavender-accent hover:text-lavender-bg transition-all"
        >
          <Mic2 size={18} />
          Karaoke
        </button>
        <button 
          onClick={onGenerate}
          className="flex items-center gap-2 px-6 py-2 bg-lavender-accent text-lavender-bg font-bold rounded-full hover:opacity-90 transition-all shadow-lg shadow-lavender-accent/20"
        >
          <Wand2 size={18} />
          Generate Song
        </button>
      </div>

      {activeMenu && <div className="fixed inset-0 z-40" onClick={() => setActiveMenu(null)} />}
    </header>
  );
};
