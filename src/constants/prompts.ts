export const GENERATE_PROMPT = (instructions: string, instruments: string[], styles: string[]) => `
Generate a new song based on the following user instructions:
"${instructions}"

Selected Musical Elements to include:
- Styles: ${styles.length > 0 ? styles.join(", ") : "None selected (use default Noor style)"}
- Instruments: ${instruments.length > 0 ? instruments.join(", ") : "None selected (use default Noor instruments)"}

Please ensure the lyrics reflect the band's persona (Noor) and their specific relationships and musical skills as defined in your system instructions.
In the lyrics, use tags that include both the singer's name, their voice type, and their relationship context where appropriate (e.g., [Miranda - Soprano], [All - Quartet], [Miranda (Soprano) & Annelies (Alto) - Married Couple]).
Return the result as a JSON object with "title", "style", and "lyrics" fields.
`;
