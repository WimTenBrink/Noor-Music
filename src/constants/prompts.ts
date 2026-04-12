export const GENERATE_PROMPT = (instructions: string, instruments: string[], styles: string[], rating: string, hasStory: boolean) => `
Generate a new song based on the following user instructions:
"${instructions}"

Content Rating: ${rating}
(Ensure the lyrics and themes strictly adhere to the ${rating} rating guidelines as defined in your system instructions.)

Selected Musical Elements to include:
- Styles: ${styles.length > 0 ? styles.join(", ") : "None selected. **CRITICAL:** You MUST choose at least two appropriate musical styles for this song before generating the lyrics."}
- Instruments: ${instruments.length > 0 ? instruments.join(", ") : "None selected. **CRITICAL:** You MUST choose at least three appropriate instruments (including at least one ancient instrument) for this song before generating the lyrics."}

Please ensure the lyrics reflect the band's persona (Noor) and their specific relationships and musical skills as defined in your system instructions.
In the lyrics, use tags that include both the singer's name, their voice type, and their relationship context where appropriate (e.g., [Miranda - Soprano], [All - Quartet], [Miranda - Soprano & Annelies - Alto - Married Couple]).
ALL instructions and tags in the lyrics MUST be in square brackets []. NEVER use parentheses () for instructions.

${!hasStory ? 'Additionally, generate a short "story" (about 200 words) based on the lyrics that can be used for image generation. Also generate "storyPrompts" for each singer (Miranda, Annelies, Fannie, Emma) as defined in your system instructions.' : ''}

Return the result as a JSON object with "title", "style", "lyrics", "imagePrompts"${!hasStory ? ', "story", and "storyPrompts"' : ''} fields.
`;
