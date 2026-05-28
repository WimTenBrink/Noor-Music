import { useState, useCallback, useEffect } from 'react';
import { Song, Job, LibraryItem, PortraitPrompts, PortraitType, ForbiddenTopics } from '../../types';
import { useJobQueue } from './useJobQueue';
import { useLogs } from './useLogs';
import { downloadJson } from '../../lib/utils';
import { GENERATE_PROMPT } from '../../constants/prompts';
import { SYSTEM_INSTRUCTIONS } from '../../constants/instructions';
import { SINGERS } from '../../constants/singers';
import { THE_BAND_MD } from '../../constants/the_band';
import { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } from '../../constants/help';
import { findDialectById } from '../utils/languages';

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
  const [selectedDialectId, setSelectedDialectId] = useState<string>(() => localStorage.getItem('noor-dialect-id') || 'en-GB');

  useEffect(() => {
    localStorage.setItem('noor-dialect-id', selectedDialectId);
  }, [selectedDialectId]);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string; filename?: string } | null>(null);
  const [selectedSinger, setSelectedSinger] = useState<{ name: string; photo: string; bioPath: string } | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [leftLibrary, setLeftLibrary] = useState<LibraryItem[]>([]);
  const [rightLibrary, setRightLibrary] = useState<LibraryItem[]>([]);
  const [viewItem, setViewItem] = useState<LibraryItem | null>(null);
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [forbiddenTopics, setForbiddenTopics] = useState<ForbiddenTopics>(() => {
    const saved = localStorage.getItem('noor-forbidden-topics');
    if (saved) return JSON.parse(saved);
    return {
      barefoot: false,
      naturism: false,
      farm: false,
      singers: false
    };
  });

  useEffect(() => {
    localStorage.setItem('noor-forbidden-topics', JSON.stringify(forbiddenTopics));
  }, [forbiddenTopics]);

  const handleToggleForbiddenTopic = (topic: keyof ForbiddenTopics) => {
    setForbiddenTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

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
    const quartet = "Female vocal quartet (Soprano, Alto, Mezzo-Soprano, Feminine Contralto)";
    const combined = [quartet, ...selectedStyles, ...selectedInstruments].join(', ');
    setSong(prev => ({ ...prev, style: combined }));
  }, [selectedInstruments, selectedStyles]);

  const handleGenerate = (instructions: string, musicInspiration?: string, targetDialectId?: string, targetRating?: string) => {
    const resolvedDialectId = targetDialectId !== undefined ? targetDialectId : selectedDialectId;
    const resolvedRating = targetRating !== undefined ? targetRating : rating;

    if (targetDialectId !== undefined && targetDialectId !== selectedDialectId) {
      setSelectedDialectId(targetDialectId);
    }
    if (targetRating !== undefined && targetRating !== rating) {
      setRating(targetRating);
    }

    const dialect = findDialectById(resolvedDialectId);
    let languageInfo = `${dialect.name}${dialect.description ? ` (${dialect.description})` : ''}`;
    
    // Custom fallbacks for mythical and celestial languages to write in English in that specific style
    if (dialect.id === 'dra-MY') {
      languageInfo = "Draconian. **CRITICAL STYLE RULES:** This is a fictional language. You MUST compose the lyrics entirely in English, but heavily style them with a mythical Draconian/Dragon thematic tone: use guttural, roaring, and powerful draconic phonetics, ancient runes imagery, and powerful dragon shout dynamics (e.g., [Draconic Shout vocal delivery]).";
    } else if (dialect.id === 'dem-MY') {
      languageInfo = "Demonic. **CRITICAL STYLE RULES:** This is a fictional language. You MUST compose the lyrics entirely in English, but heavily style them with an infernal/demonic thematic tone: use aggressive phrasing, intense or sinister dark gothic vocabulary, and performance tags indicating harsh register growling and dark heavy-metal styling (e.g., [Infernal growl], [Aggressive rasping delivery]).";
    } else if (dialect.id === 'ang-MY') {
      languageInfo = "Angelic. **CRITICAL STYLE RULES:** This is a fictional language. You MUST compose the lyrics entirely in English, but heavily style them with a celestial/angelic thematic tone: use ethereal, whispering, highly luminous, pure/sacred hymn poetic structures, and performance tags indicating shimmering, highly melodic head vocals and luminous whispering delivery (e.g., [Ethereal head vocal], [Luminous whispering delivery]).";
    } else if (dialect.id === 'en-NL') {
      languageInfo = "Dutch-English (Denglish / Dutch Accent). **CRITICAL STYLE RULES:** You MUST compose the lyrics in English, but heavily style them with classic Dutch-English (Denglish) characteristics: use literal word-for-word Dutch translations, Dutch-style directness, slight grammatical quirks (e.g., placing the verb at the end, missing present progressive), and playful Dutch-English vocabulary.";
    } else if (dialect.id === 'en-SG') {
      languageInfo = "Singaporean English (Singlish). **CRITICAL STYLE RULES:** You MUST compose the lyrics in English, but richly inflected with Singlish: use discourse particles like 'lah', 'leh', 'lor', 'siah', and colloquial blended sentence structures from Hokkien, Malay, and Mandarin.";
    } else if (dialect.id === 'en-IN') {
      languageInfo = "Indian English. **CRITICAL STYLE RULES:** You MUST compose the lyrics in English, styled with standard Indian English syntax, unique idioms (e.g. 'do the needful', 'prepone', 'years back'), double emphasis, rhythmic syllable-timed phrasing, and polite subcontinental framing.";
    } else if (dialect.id === 'en-JM') {
      languageInfo = "Jamaican English & Caribbean Patois. **CRITICAL STYLE RULES:** You MUST compose the lyrics in English, naturally infused with Jamaican Patois/Creole: use rhythmic pacing, doubled adjectives for emphasis, non-standard pronouns (e.g., 'dem', 'wi'), and terms from reggae/dancehall roots culture.";
    } else if (dialect.id === 'en-BB') {
      languageInfo = "Barbadian English (Bajan). **CRITICAL STYLE RULES:** You MUST compose the lyrics in Bajan-styled English: use high-vowel pronunciations, Bajan colloquial contractions, and colorful Barbadian idioms.";
    } else if (dialect.id === 'en-TT') {
      languageInfo = "Trinidadian English. **CRITICAL STYLE RULES:** You MUST compose the lyrics in Trinidadian English: use southern Caribbean sing-song meter, soca-rhythm lyric styling, and Trinidadian slang.";
    } else if (dialect.id === 'en-NG') {
      languageInfo = "Nigerian English & West African Pidgin. **CRITICAL STYLE RULES:** You MUST compose the lyrics in Nigerian-styled English or West African Pidgin: use expressive pidgin phrases (e.g., 'no shaking', 'abi', 'wahala'), high tone accents, and rich local proverbs.";
    } else if (dialect.id === 'en-WAL') {
      languageInfo = "Welsh English. **CRITICAL STYLE RULES:** You MUST compose the lyrics in Welsh English: use the beautiful, lyrical, melodic sing-song cadence of Wales, with distinct Welsh phrasing, endearments (e.g., 'bach'), and poetic regional vocabulary.";
    }

    const prompt = GENERATE_PROMPT(instructions, selectedInstruments, selectedStyles, resolvedRating, !!song.story, forbiddenTopics, languageInfo, musicInspiration);
    const jobId = addJob(`Generate: ${instructions.substring(0, 20)}...`, 'normal', prompt, apiKey || '');
    log('info', 'Job Added', `New generation job added: ${jobId} (Rating: ${resolvedRating}, Language: ${dialect.name})`);
    setShowGenerate(false);
  };

  const handleGenerateStoryPrompts = (story: string, noClothes: boolean) => {
    const prompt = `Based on the following story, generate image prompts for the band Noor (Miranda, Annelies, Fannie, Emma).
    
    Story: ${story}
    No Clothes: ${noClothes ? 'Yes (generate prompts without any clothing)' : 'No'}
    
    Constraints for all prompts (CRITICAL):
    - Age & Fresh-Faced Appearance: Represent all singers with a highly youthful, fresh-faced collegiate, student-aged young adult female appearance, looking like college-age young women (appearing late-teens or early-twenties). Never specify numerical ages in the prompt.
    - Physical Build & Slim Fitness: Depict all singers as tone, exceptionally slender, and well-trained, representing active, highly fit, grace-filled young adult women. Never depict them as mature/older, heavy, chubby, or overweight. Do NOT mention "BMI" or "weight" or "BMI around 20".
    
    For each category, provide:
    1. A WAN prompt: A detailed, artistic, and sanitized description of the person(s)' youthful, athletic, and slender body/face and the surrounding environment. **CRITICAL CONSTRAINTS:** Do NOT mention any clothing, outfits, or garments at all in WAN prompts (the generator will decide what is most proper). Do NOT mention cup sizes in WAN prompts. WAN prompts MUST be sanitized to contain no offensive, sensual, or explicit words (e.g., avoid 'nude', 'no clothes', 'sensual', 'naked'). Use safe, clean, and artistic alternatives (e.g., 'natural state', 'unadorned', 'minimalist').
    2. An SDXL prompt: A weighted version of the WAN prompt (using (keyword:weight) syntax). SDXL prompts CAN be explicit, detailed, include nudity or erotic themes, and may specify whether they are without clothing. **CRITICAL:** ALWAYS include chest size with cup size in SDXL prompts (e.g., "(flat chest:1.3)", "(AA cup:1.2)").
    
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
    
    Constraints for all prompts (CRITICAL):
    - The singer is standing facing the viewer in a relaxed pose.
    - A slight smile on her face.
    - Generate an interesting, natural background (e.g., forest, beach, garden, mountains).
    - Age & Fresh-Faced Appearance: Represent the singers with a highly youthful, fresh-faced collegiate, student-aged young adult female appearance (appearing late-teens or early-twenties). Never specify numerical ages in the prompt.
    - Physical Build & Slim Fitness: Depict all singers as tone, exceptionally slender, and well-trained, representing active, highly fit, grace-filled young adult women. Never depict them as mature/older, heavy, chubby, or overweight. Do NOT mention "BMI" or "weight" or "BMI around 20".
    - WAN prompts: Detailed, artistic, and sanitized description of the singer's body and face. **CRITICAL:** Do NOT mention any clothing, outfits, or garments at all in WAN prompts, as the generator will decide what is most proper. Focused entirely on safe, artistic, non-explicit terms. WAN prompts MUST be sanitized to contain no offensive or explicit words. Do NOT mention cup sizes in WAN prompts.
    - SDXL prompts: Weighted version of the WAN prompt, but WITHOUT clothing (explicit and detailed body description). SDXL prompts CAN include nudity or erotic themes. **CRITICAL:** ALWAYS include chest size with cup size in SDXL prompts (e.g., "(flat chest:1.3)", "(AA cup:1.2)").
    
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

        let parsedContent = re.target.result;
        if (type === 'json') {
          try {
            parsedContent = JSON.parse(re.target.result);
            if (typeof parsedContent === 'object' && parsedContent !== null && ('lyrics' in parsedContent || 'title' in parsedContent)) {
              setSong(parsedContent);
              log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" loaded into workspace.`);
            }
          } catch (e) {
            log('error', 'Parse Error', `Could not parse the JSON file "${file.name}".`);
          }
        }

        const item: LibraryItem = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type,
          content: parsedContent,
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

              let parsedContent = re.target.result;
              if (type === 'json') {
                try {
                  parsedContent = JSON.parse(re.target.result);
                  if (typeof parsedContent === 'object' && parsedContent !== null && ('lyrics' in parsedContent || 'title' in parsedContent)) {
                    setSong(parsedContent);
                    log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" loaded into workspace.`);
                  }
                } catch (e) {
                  log('error', 'Parse Error', `Could not parse the JSON file "${file.name}".`);
                }
              }

              const item: LibraryItem = {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                type,
                content: parsedContent,
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
      case 'content-settings':
        setShowContentSettings(true);
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

        // Automatically trigger download/save as requested when song completes generation
        if (lastDoneJob.name.startsWith('Generate:')) {
          downloadJson(result, result.title || 'Untitled Song');
          log('info', 'File Saved', `Freshly generated song "${result.title || 'Untitled'}" automatically saved and downloaded.`);
        }
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
    selectedDialectId,
    setSelectedDialectId,
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
    showContentSettings,
    setShowContentSettings,
    forbiddenTopics,
    handleToggleForbiddenTopic,
  };
}
