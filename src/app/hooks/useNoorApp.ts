import { useState, useCallback, useEffect } from 'react';
import { Song, Job, LibraryItem, PortraitPrompts, PortraitType } from '../../types';
import { useJobQueue } from './useJobQueue';
import { useLogs } from './useLogs';
import { downloadJson } from '../../lib/utils';
import { GENERATE_PROMPT } from '../../constants/prompts';
import { SYSTEM_INSTRUCTIONS } from '../../constants/instructions';
import { SINGERS } from '../../constants/singers';
import { THE_BAND_MD } from '../../constants/the_band';
import { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } from '../../constants/help';

export function useNoorApp() {
  const [song, setSong] = useState<Song>({ 
    title: '', 
    style: '', 
    lyrics: '',
    imagePrompts: { start: '', middle: '', end: '' },
    story: '',
    storyPrompts: {
      miranda: { wan: '', sdxl: '' },
      annelies: { wan: '', sdxl: '' },
      fannie: { wan: '', sdxl: '' },
      emma: { wan: '', sdxl: '' },
      mirandaAnnelies: { wan: '', sdxl: '' },
      fannieEmma: { wan: '', sdxl: '' },
      group: { wan: '', sdxl: '' }
    }
  });
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showKaraoke, setShowKaraoke] = useState(false);
  const [showImagePrompts, setShowImagePrompts] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);
  const [activePortraitType, setActivePortraitType] = useState<PortraitType>('Face');
  const [portraitPrompts, setPortraitPrompts] = useState<Record<PortraitType, PortraitPrompts>>(() => {
    const saved = localStorage.getItem('noor-portrait-prompts');
    if (saved) return JSON.parse(saved);
    const empty = { wan: '', sdxl: '' };
    const emptyPrompts = { miranda: { ...empty }, annelies: { ...empty }, fannie: { ...empty }, emma: { ...empty } };
    return {
      Face: { ...emptyPrompts },
      Torso: { ...emptyPrompts },
      Body: { ...emptyPrompts }
    };
  });
  const [rating, setRating] = useState<string>('PG');
  const [helpContent, setHelpContent] = useState<{ title: string; content: string; filename?: string } | null>(null);
  const [selectedSinger, setSelectedSinger] = useState<{ name: string; photo: string; bioPath: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [leftLibrary, setLeftLibrary] = useState<LibraryItem[]>([]);
  const [rightLibrary, setRightLibrary] = useState<LibraryItem[]>([]);
  const [viewItem, setViewItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    const initLeft = async () => {
      // No longer adding JSON files to left library as we have specialized sidebars
      setLeftLibrary([]);
    };
    
    const initRight = async () => {
      const singers = [
        { name: 'Miranda Noor', base: 'Miranda_Noor' },
        { name: 'Annelies Brink', base: 'Annelies_Brink' },
        { name: 'Fannie de Jong', base: 'Fannie_de_Jong' },
        { name: 'Emma Vermeer', base: 'Emma_Vermeer' },
      ];
      
      const singerItems: LibraryItem[] = [];
      
      singers.forEach(s => {
        // Add Image
        singerItems.push({
          id: `singer-img-${s.base}`,
          name: `${s.name} (Portrait)`,
          type: 'image',
          content: `/singers/${s.base}.jpg`,
          sourceUrl: `/singers/${s.base}.jpg`
        });
        
        // Add Document
        singerItems.push({
          id: `singer-doc-${s.base}`,
          name: `${s.name} (Bio)`,
          type: 'markdown',
          content: `/singers/${s.base}.md`,
          sourceUrl: `/singers/${s.base}.md`
        });
      });
      
      setRightLibrary(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = singerItems.filter(item => !existingIds.has(item.id));
        if (newItems.length === 0) return prev;
        return [...prev, ...newItems].sort((a, b) => a.name.localeCompare(b.name));
      });
    };

    initLeft();
    initRight();
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
    const prompt = GENERATE_PROMPT(instructions, selectedInstruments, selectedStyles, rating, !!song.story);
    const jobId = addJob(`Generate: ${instructions.substring(0, 20)}...`, 'normal', prompt, apiKey || '');
    log('info', 'Job Added', `New generation job added: ${jobId} (Rating: ${rating})`);
    setShowGenerate(false);
  };

  const handleGenerateStoryPrompts = (story: string, noClothes: boolean) => {
    const prompt = `Based on the following story, generate image prompts for the band Noor (Miranda, Annelies, Fannie, Emma).
    
    Story: ${story}
    No Clothes: ${noClothes ? 'Yes (generate prompts without any clothing)' : 'No'}
    
    For each category, provide:
    1. A WAN prompt: A detailed description of the person(s) body, followed by a description of the environment, and finally the clothes they are wearing (unless No Clothes is Yes).
       **CRITICAL:** WAN prompts MUST be sanitized to contain no offensive or explicit words (e.g., avoid 'nude', 'no clothes', 'sensual', 'naked'). Use artistic and safe alternatives for WAN (e.g., 'natural state', 'unadorned', 'minimalist').
    2. An SDXL prompt: A weighted version of the WAN prompt (using (keyword:weight) syntax). SDXL prompts CAN be explicit and detailed.
    
    Categories:
    - miranda: Single person
    - annelies: Single person
    - fannie: Single person
    - emma: Single person
    - mirandaAnnelies: Couple (Miranda and Annelies)
    - fannieEmma: Couple (Fannie and Emma)
    - group: All four singers
    
    **Clear Identification:** For prompts with two or more characters, clearly mark each person by name and specific physical traits to prevent the AI from mixing them up.
    
    Return the result as a JSON object matching the StoryPrompts interface:
    {
      "miranda": { "wan": "...", "sdxl": "..." },
      "annelies": { "wan": "...", "sdxl": "..." },
      "fannie": { "wan": "...", "sdxl": "..." },
      "emma": { "wan": "...", "sdxl": "..." },
      "mirandaAnnelies": { "wan": "...", "sdxl": "..." },
      "fannieEmma": { "wan": "...", "sdxl": "..." },
      "group": { "wan": "...", "sdxl": "..." }
    }
    `;
    
    const jobId = addJob(`Generate Story Prompts`, 'high', prompt, apiKey || '');
    log('info', 'Story Job Added', `New story prompt generation job added: ${jobId}`);
  };

  useEffect(() => {
    localStorage.setItem('noor-portrait-prompts', JSON.stringify(portraitPrompts));
  }, [portraitPrompts]);

  const handleGeneratePortraits = (type: PortraitType) => {
    const prompt = `Generate portrait image prompts for the four singers of the band Noor (Miranda, Annelies, Fannie, Emma).
    
    Portrait Type: ${type}
    
    Constraints for all prompts:
    - The singer is standing facing the viewer in a relaxed pose.
    - A slight smile on her face.
    - Generate an interesting, natural background (e.g., forest, beach, garden, mountains).
    - WAN prompts: Detailed description of the singer's body and face, including clothing. **CRITICAL:** Do NOT mention cup size or use explicit words in WAN prompts.
    - SDXL prompts: Weighted version of the WAN prompt, but WITHOUT clothing (explicit and detailed body description).
    
    Specific Type Instructions:
    - Face: Focus ONLY on facial details (eyes, hair, skin texture, expression).
    - Torso: Describe the body from above the hip upwards. Include more body details.
    - Body: Describe the whole body from head to toe in detail.
    
    Return the result as a JSON object matching the PortraitPrompts interface:
    {
      "miranda": { "wan": "...", "sdxl": "..." },
      "annelies": { "wan": "...", "sdxl": "..." },
      "fannie": { "wan": "...", "sdxl": "..." },
      "emma": { "wan": "...", "sdxl": "..." }
    }
    `;
    
    const jobId = addJob(`Generate ${type} Portraits`, 'high', prompt, apiKey || '');
    log('info', 'Portrait Job Added', `New ${type} portrait generation job added: ${jobId}`);
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
      case 'images':
        setShowImagePrompts(true);
        break;
      case 'story':
        setShowStory(true);
        break;
      case 'system-instructions':
      case 'manual':
      case 'code-overview':
        const { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } = await import('../../constants/help');
        const contentMap: any = {
          'system-instructions': { title: 'System Instructions', content: SYSTEM_INSTRUCTIONS_MD, filename: 'system_instructions' },
          'manual': { title: 'User Manual', content: MANUAL_MD, filename: 'manual' },
          'code-overview': { title: 'Code Overview', content: CODE_OVERVIEW_MD, filename: 'code_overview' },
        };
        setHelpContent(contentMap[action]);
        break;
      case 'cut':
      case 'copy':
      case 'paste':
        log('info', 'Edit Action', `Action "${action}" triggered.`);
        break;
      case 'singer-miranda':
        setSelectedSinger(SINGERS[0]);
        break;
      case 'singer-annelies':
        setSelectedSinger(SINGERS[1]);
        break;
      case 'singer-fannie':
        setSelectedSinger(SINGERS[2]);
        break;
      case 'singer-emma':
        setSelectedSinger(SINGERS[3]);
        break;
      case 'singer-face':
        setActivePortraitType('Face');
        setShowPortrait(true);
        break;
      case 'singer-torso':
        setActivePortraitType('Torso');
        setShowPortrait(true);
        break;
      case 'singer-body':
        setActivePortraitType('Body');
        setShowPortrait(true);
        break;
      case 'the-band':
        setHelpContent({ title: 'The Band', content: THE_BAND_MD, filename: 'noor' });
        break;
    }
  };

  const [lastAppliedJobId, setLastAppliedJobId] = useState<string | null>(null);

  // Update song when a job completes
  useEffect(() => {
    const lastDoneJob = [...jobs].reverse().find(j => j.status === 'done' && j.result && !j.error);
    if (lastDoneJob && lastDoneJob.id !== lastAppliedJobId) {
      const result = lastDoneJob.result;
      
      // If it's a story generation job, we might only have storyPrompts
      if (result.miranda && result.annelies) {
        if (lastDoneJob.name.includes('Portraits')) {
          const type = lastDoneJob.name.split(' ')[1] as PortraitType;
          setPortraitPrompts(prev => ({
            ...prev,
            [type]: result
          }));
          log('info', 'Portraits Updated', `${type} portraits have been updated.`);
        } else {
          setSong(prev => ({
            ...prev,
            storyPrompts: result
          }));
        }
      } else {
        // Regular song generation (which might now include story/storyPrompts)
        setSong(prev => ({
          ...prev,
          ...result
        }));
      }
      
      setLastAppliedJobId(lastDoneJob.id);
      
      // Also add to right library if it's a song
      if (result.title && result.lyrics) {
        const item: LibraryItem = {
          id: lastDoneJob.id,
          name: result.title || 'Untitled Song',
          type: 'song',
          content: result,
        };
        addToLibrary(item, 'right');
      }
    }
  }, [jobs, lastAppliedJobId]);

  const handleUpdateImagePrompt = (key: 'start' | 'middle' | 'end', value: string) => {
    setSong(prev => ({
      ...prev,
      imagePrompts: {
        ...prev.imagePrompts!,
        [key]: value
      }
    }));
  };

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
    showImagePrompts,
    setShowImagePrompts,
    showStory,
    setShowStory,
    showPortrait,
    setShowPortrait,
    activePortraitType,
    portraitPrompts,
    handleGeneratePortraits,
    handleUpdateImagePrompt,
    handleGenerateStoryPrompts,
    rating,
    setRating,
    helpContent,
    setHelpContent,
    selectedSinger,
    setSelectedSinger,
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
