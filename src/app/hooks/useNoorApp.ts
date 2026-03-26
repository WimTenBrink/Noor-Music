import { useState, useCallback, useEffect } from 'react';
import { Song, Job, LibraryItem } from '../../types';
import { useJobQueue } from './useJobQueue';
import { useLogs } from './useLogs';
import { downloadJson } from '../../lib/utils';
import { GENERATE_PROMPT } from '../../constants/prompts';
import { SYSTEM_INSTRUCTIONS } from '../../constants/instructions';

export function useNoorApp() {
  const [song, setSong] = useState<Song>({ title: '', style: '', lyrics: '' });
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showKaraoke, setShowKaraoke] = useState(false);
  const [rating, setRating] = useState<string>('PG');
  const [helpContent, setHelpContent] = useState<{ title: string; content: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [leftLibrary, setLeftLibrary] = useState<LibraryItem[]>([]);
  const [rightLibrary, setRightLibrary] = useState<LibraryItem[]>([]);
  const [viewItem, setViewItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    const initLeft = async () => {
      // No longer adding JSON files to left library as we have specialized sidebars
      setLeftLibrary([]);
    };
    initLeft();
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio?.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setApiKey(process.env.GEMINI_API_KEY || null);
        }
      }
    };
    checkKey();
  }, []);

  const { addJob, jobs } = useJobQueue();
  const { log } = useLogs();

  const handleToggleInstrument = (name: string) => {
    setSelectedInstruments(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleToggleStyle = (name: string) => {
    setSelectedStyles(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const quartet = "Female vocal quartet (Soprano, Alto, Mezzo-Soprano, Feminine Baritone)";
    const combined = [quartet, ...selectedStyles, ...selectedInstruments].join(', ');
    setSong(prev => ({ ...prev, style: combined }));
  }, [selectedInstruments, selectedStyles]);

  const handleGenerate = (instructions: string) => {
    const prompt = GENERATE_PROMPT(instructions, selectedInstruments, selectedStyles, rating);
    const jobId = addJob(`Generate: ${instructions.substring(0, 20)}...`, 'normal', prompt, apiKey || '');
    log('info', 'Job Added', `New generation job added: ${jobId} (Rating: ${rating})`);
    setShowGenerate(false);
  };

  const addToLibrary = (item: LibraryItem, side: 'left' | 'right') => {
    if (side === 'left') setLeftLibrary(prev => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
    else setRightLibrary(prev => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));

    // Automatic download for web content
    if (item.sourceUrl && item.sourceUrl.startsWith('http')) {
      if (item.type === 'image') {
        // Image conversion handled in ImageView, but for automatic download on add:
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${item.name.split('.')[0]}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }, 'image/png');
          }
        };
        img.src = item.sourceUrl;
      } else {
        const blob = new Blob([typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const removeFromLibrary = (id: string, side: 'left' | 'right') => {
    if (side === 'left') setLeftLibrary(prev => prev.filter(i => i.id !== id));
    else setRightLibrary(prev => prev.filter(i => i.id !== id));
  };

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (re: any) => {
      try {
        let type: LibraryItem['type'] = 'text';
        if (file.name.endsWith('.json')) type = 'json';
        else if (file.name.endsWith('.xml')) type = 'xml';
        else if (file.type.startsWith('image/')) type = 'image';

        const item: LibraryItem = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type,
          content: type === 'image' ? re.target.result : re.target.result,
        };
        addToLibrary(item, 'right');
        log('info', 'File Dropped', `File "${file.name}" added to library.`);
      } catch (err) {
        log('error', 'Drop Failed', 'Invalid file format.');
      }
    };
    if (file.type.startsWith('image/')) reader.readAsDataURL(file);
    else reader.readAsText(file);
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case 'load':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.xml,.txt,.png,.jpg,.jpeg';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (re: any) => {
            try {
              let type: LibraryItem['type'] = 'text';
              if (file.name.endsWith('.json')) type = 'json';
              else if (file.name.endsWith('.xml')) type = 'xml';
              else if (file.type.startsWith('image/')) type = 'image';

              const item: LibraryItem = {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                type,
                content: type === 'image' ? re.target.result : re.target.result,
              };
              addToLibrary(item, 'right');
              log('info', 'File Loaded', `File "${file.name}" added to library.`);
            } catch (err) {
              log('error', 'Load Failed', 'Invalid file format.');
            }
          };
          if (file.type.startsWith('image/')) reader.readAsDataURL(file);
          else reader.readAsText(file);
        };
        input.click();
        break;
      case 'save':
        if (!song.title) {
          log('warn', 'Save Warning', 'Please provide a song title before saving.');
          return;
        }
        downloadJson(song, song.title);
        log('info', 'File Saved', `Song "${song.title}" saved and downloaded.`);
        break;
      case 'clear':
        setSong({ title: '', style: '', lyrics: '' });
        setSelectedInstruments([]);
        setSelectedStyles([]);
        setLeftLibrary([]);
        setRightLibrary([]);
        log('info', 'Environment Cleared', 'All fields and selections have been reset.');
        break;
      case 'api-key':
        const win = window as any;
        if (win.aistudio?.openSelectKey) {
          await win.aistudio.openSelectKey();
          setApiKey(process.env.GEMINI_API_KEY || null);
          log('info', 'API Key Updated', 'New API key selected.');
        }
        break;
      case 'karaoke':
        if (!song.lyrics) {
          log('warn', 'Karaoke Warning', 'No lyrics available to display.');
          return;
        }
        setShowKaraoke(true);
        break;
      case 'system-instructions':
      case 'manual':
      case 'code-overview':
        const { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } = await import('../../constants/help');
        const contentMap: any = {
          'system-instructions': { title: 'System Instructions', content: SYSTEM_INSTRUCTIONS_MD },
          'manual': { title: 'User Manual', content: MANUAL_MD },
          'code-overview': { title: 'Code Overview', content: CODE_OVERVIEW_MD },
        };
        setHelpContent(contentMap[action]);
        break;
      case 'cut':
      case 'copy':
      case 'paste':
        log('info', 'Edit Action', `Action "${action}" triggered.`);
        break;
    }
  };

  const [lastAppliedJobId, setLastAppliedJobId] = useState<string | null>(null);

  // Update song when a job completes
  useEffect(() => {
    const lastDoneJob = [...jobs].reverse().find(j => j.status === 'done' && j.result && !j.error);
    if (lastDoneJob && lastDoneJob.id !== lastAppliedJobId) {
      setSong(lastDoneJob.result);
      setLastAppliedJobId(lastDoneJob.id);
      
      // Also add to right library
      const item: LibraryItem = {
        id: lastDoneJob.id,
        name: lastDoneJob.result.title || 'Untitled Song',
        type: 'song',
        content: lastDoneJob.result,
      };
      addToLibrary(item, 'right');
    }
  }, [jobs, lastAppliedJobId]);

  return {
    song,
    setSong,
    selectedInstruments,
    handleToggleInstrument,
    selectedStyles,
    handleToggleStyle,
    activeJob,
    setActiveJob,
    showLogs,
    setShowLogs,
    showGenerate,
    setShowGenerate,
    showKaraoke,
    setShowKaraoke,
    rating,
    setRating,
    helpContent,
    setHelpContent,
    handleAction,
    handleGenerate,
    jobs,
    leftLibrary,
    rightLibrary,
    addToLibrary,
    removeFromLibrary,
    viewItem,
    setViewItem,
    handleFileDrop,
  };
}
