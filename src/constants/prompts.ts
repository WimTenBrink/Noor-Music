import { ForbiddenTopics } from '../types';

export const GENERATE_PROMPT = (
  instructions: string, 
  instruments: string[], 
  styles: string[], 
  rating: string, 
  hasStory: boolean, 
  forbiddenTopics: ForbiddenTopics, 
  languageInfo: string,
  musicInspiration?: string
) => {
  const forbiddenText = Object.entries(forbiddenTopics)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch(key) {
        case 'barefoot': return 'DO NOT mention feet, being barefoot, or toes.';
        case 'naturism': return 'DO NOT mention naturism, nudity, naked bodies, or being unadorned.';
        case 'farm': return 'DO NOT mention the farm, rural life, cows, farm chores, or the band\'s life on a farm.';
        case 'singers': return 'DO NOT mention specific singer names in the lyrics or tags. Use generic vocal tags like [Female Lead Soprano] or [Female Vocal Duo]. Make the lyrics generic and universal, avoiding specific personal details and relationships.';
        default: return '';
      }
    })
    .filter(Boolean)
    .join('\n');

  return `
Generate a new song based on the following user instructions:
"${instructions}"

Content Rating: ${rating}
(Ensure the lyrics and themes strictly adhere to the ${rating} rating guidelines as defined in your system instructions.)

Target Language / Dialect: ${languageInfo}
(You MUST compose the song lyrics, vocabulary, phrasing, and style naturally using the specified language and dialect. For dialects of English or other European languages, ensure you use the exact spellings, idioms, slang, and phonetic characteristics appropriate for that dialect.)

${musicInspiration ? `**MUSICAL INSPIRATION & ARTIST REFERENCES (Composition and Style only):**
- Strongly base the musical style, arrangement, instrumentation cues, and overall production energy on: "${musicInspiration}".
- **CRITICAL:** Do NOT mention or reference any of these specific artists, bands, or their trademark titles inside the song's actual LYRICS. This inspiration is strictly for the musical performance tags, style tags, and composition directions.` : ''}

Selected Musical Elements to include:
- Styles: ${styles.length > 0 ? styles.join(", ") : "None selected. **CRITICAL:** You MUST choose at least two appropriate musical styles for this song before generating the lyrics."}
- Instruments: ${instruments.length > 0 ? instruments.join(", ") : "None selected. **CRITICAL:** You MUST choose at least three appropriate instruments (including at least one ancient instrument) for this song before generating the lyrics."}

${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Please ensure the lyrics reflect the band's persona (Noor) and their specific musical skills as defined in your system instructions.
- Include a specific musical key (e.g., Key: G Major, C Minor) and tempo (BPM) at every [Verse], [Chorus], [Bridge], or song part that perfectly fits the song's tune.
- Ensure the key chosen matches the female/feminine vocal range. Specifically for deeper voices (such as Emma Vermeer's Feminine Contralto lower registers), choose a bright, clear, and inherently feminine key (e.g., major keys or lighter minor keys like A Minor, C Major, G Major, F Major, E Minor) and specify high-resonance registers in the tags so that her deep chest vocals are clearly identifiable as a female contralto rather than mistaken for a male voice.
- Highlight any melodic peaks in each section with explicit performance instructions (e.g., "[Melodic Peak: High sustained F5, sparkling and clear]").
- Include detailed instructions for "Consonant Timing" (e.g., "[Consonant Timing: Crisp delivery, sharp plosive articulation, sustained resonant vowels]") inside the tags to lock the vocal phrasing perfectly with the rhythm.
In the lyrics, use tags that include both the voice type and relationship context where appropriate. ${forbiddenTopics.singers ? 'DO NOT use names like Miranda, Annelies, Fannie, or Emma.' : 'Include the singer\'s name (e.g., [Miranda - Soprano]).'}
ALL instructions and tags in the lyrics MUST be in square brackets []. NEVER use parentheses () for instructions.

${!hasStory ? 'Additionally, generate a short "story" (about 200 words) based on the lyrics that can be used for image generation. Also generate "storyPrompts" for each singer (Miranda, Annelies, Fannie, Emma) as defined in your system instructions.' : ''}

Return the result as a JSON object with "title", "style", "lyrics", "imagePrompts"${!hasStory ? ', "story", and "storyPrompts"' : ''} fields.
`;
};
