import { LanguageGroup, Dialect } from '../../types/languages';

export const LANGUAGE_GROUPS: LanguageGroup[] = [
  {
    id: 'english',
    name: 'English',
    dialects: [
      { id: 'en-GB', name: 'British English', description: 'Standard British pronunciations and spelling (RP)' },
      { id: 'en-US', name: 'American English', description: 'General American accents and standardized spelling' },
      { id: 'en-IE', name: 'Irish English', description: 'Hiberno-English dialect and phrasing' },
      { id: 'en-CA', name: 'Canadian English', description: 'Combination of British and American spellings' },
      { id: 'en-AU', name: 'Australian English', description: 'Aussie vernacular and phonetic traits' },
      { id: 'en-NZ', name: 'New Zealand English', description: 'Kiwi phrasing and regional terminology' },
      { id: 'en-ZA', name: 'South African English', description: 'South African pronunciation and slang' },
      { id: 'en-SCO', name: 'Scottish English', description: 'Scottish accents and regional vocabulary' },
      { id: 'en-IN', name: 'Indian English', description: 'English with distinctive subcontinental syntax, idioms, and speech patterns' },
      { id: 'en-BB', name: 'Barbadian English (Bajan)', description: 'English dialect of Barbados with unique Bajan creole influences and phrasing' },
      { id: 'en-JM', name: 'Jamaican English & Caribbean Patois', description: 'Rhythmic Caribbean English rich in patois vocabulary, double modifiers, and roots slang' },
      { id: 'en-TT', name: 'Trinidadian English & Accent', description: 'Soca-infused southern Caribbean English with high-pitched sing-song intonations' },
      { id: 'en-NL', name: 'Dutch-English (Denglish / Dutch Accent)', description: 'English spoken with a distinct Dutch accent, word-by-word translations, and direct phrasing' },
      { id: 'en-SG', name: 'Singaporean English (Singlish)', description: 'Colloquial blend of English with Hokkien, Malay, and Tamil syntactic elements and discourse particles' },
      { id: 'en-NG', name: 'Nigerian English & Pidgin', description: 'Vibrant West African English with high tone markings, distinct idioms, and expressive pidgin idioms' },
      { id: 'en-WAL', name: 'Welsh English', description: 'Spoken in Wales with a lyrical, melodic sing-song lilt and unique regional idioms' }
    ]
  },
  {
    id: 'dutch',
    name: 'Dutch & Flemish',
    dialects: [
      { id: 'nl-NL', name: 'Netherlands Dutch (Nederlands)', description: 'Standard Northern Dutch as spoken in the Netherlands' },
      { id: 'nl-BE', name: 'Flemish (Vlaams)', description: 'Southern Dutch dialect with Flemish vocabulary and softer G' },
      { id: 'nl-SR', name: 'Surinamese Dutch (Surinaams-Nederlands)', description: 'Surinamese regional variation of Dutch' }
    ]
  },
  {
    id: 'frisian',
    name: 'Frisian',
    dialects: [
      { id: 'fy-NL', name: 'West Frisian (Westerlauwers Frysk)', description: 'Spoken in Friesland province (Fryslân), Netherlands' },
      { id: 'frs-DE', name: 'Saterland Frisian (Seeltersk)', description: 'Spoken in Saterland, Lower Saxony, Germany' },
      { id: 'frr-DE', name: 'North Frisian (Nordfriisk)', description: 'Spoken in Schleswig-Holstein, Germany' }
    ]
  },
  {
    id: 'french',
    name: 'French',
    dialects: [
      { id: 'fr-FR', name: 'Standard French (Parisian)', description: 'Standard Metropolitan French pronunciation' },
      { id: 'fr-BE', name: 'Belgian French (Belge)', description: 'French spoken in Wallonia with regional numbers and terms' },
      { id: 'fr-CH', name: 'Swiss French (Romand)', description: 'French spoken in Romandie, Switzerland' },
      { id: 'fr-CA', name: 'Quebec French (Québécois)', description: 'Canadian French dialect with distinct vowel sounds' },
      { id: 'fr-AF', name: 'African French', description: 'French dialects used in French-speaking African nations' }
    ]
  },
  {
    id: 'german',
    name: 'German',
    dialects: [
      { id: 'de-DE', name: 'Standard German (Hochdeutsch)', description: 'Standard high German spoken in Germany' },
      { id: 'de-AT', name: 'Austrian German (Österreichisches Deutsch)', description: 'Standard Austrian spelling and vocabulary variations' },
      { id: 'de-CH', name: 'Swiss High German (Schweizer Hochdeutsch)', description: 'Written Standard German without the double-s (ß)' },
      { id: 'de-BY', name: 'Bavarian German (Boarisch)', description: 'Austro-Bavarian dialact group' }
    ]
  },
  {
    id: 'italian',
    name: 'Italian',
    dialects: [
      { id: 'it-IT', name: 'Standard Italian (Italiano)', description: 'Standard literary and spoken Italian' },
      { id: 'it-TUS', name: 'Tuscan Italian (Toscano)', description: 'The historic dialect from Tuscany' },
      { id: 'it-NAP', name: 'Neapolitan (Nnapulitano)', description: 'Vibrant romance language of Southern Italy' },
      { id: 'it-SCN', name: 'Sicilian (Sicilianu)', description: 'Distinct language of the island of Sicily' },
      { id: 'it-VEN', name: 'Venetian (Veneto)', description: 'Regional language of Venice and Veneto' }
    ]
  },
  {
    id: 'spanish',
    name: 'Spanish',
    dialects: [
      { id: 'es-ES', name: 'Peninsular Spanish (Castilian)', description: 'Standard European Spanish with distinction' },
      { id: 'es-MX', name: 'Mexican Spanish (Mexicano)', description: 'Most widely spoken Spanish dialect worldwide' },
      { id: 'es-AR', name: 'Argentine Spanish (Rioplatense)', description: 'Characterized by the use of "voseo" and Italian cadences' },
      { id: 'es-CO', name: 'Colombian Spanish', description: 'Renowned for clear articulation and standard syntax' },
      { id: 'es-CAR', name: 'Caribbean Spanish', description: 'Rapid pronunciation with s-dropping from Cuba, DR, PR' }
    ]
  },
  {
    id: 'portuguese',
    name: 'Portuguese',
    dialects: [
      { id: 'pt-BR', name: 'Brazilian Portuguese', description: 'Melodic and open vowels of Brazil' },
      { id: 'pt-PT', name: 'European Portuguese', description: 'Standard Iberian Portuguese pronunciation' },
      { id: 'pt-AO', name: 'Angolan Portuguese', description: 'African dialect with distinct prosody' }
    ]
  },
  {
    id: 'celtic',
    name: 'Celtic Languages',
    dialects: [
      { id: 'ga-IE', name: 'Irish Gaelic (Gaeilge)', description: 'National Celtic language of Ireland' },
      { id: 'gd-GB', name: 'Scottish Gaelic (Gàidhlig)', description: 'Traditional language of the Scottish Highlands' },
      { id: 'cy-GB', name: 'Welsh (Cymraeg)', description: 'Brythonic Celtic language of Wales' }
    ]
  },
  {
    id: 'scandinavian',
    name: 'Scandinavian',
    dialects: [
      { id: 'sv-SE', name: 'Swedish (Svenska)', description: 'Standard Swedish language' },
      { id: 'da-DK', name: 'Danish (Dansk)', description: 'Standard Danish language' },
      { id: 'no-NO', name: 'Norwegian (Bokmål)', description: 'Most common written standard of Norway' },
      { id: 'is-IS', name: 'Icelandic (Íslenska)', description: 'Highly archaic North Germanic language' }
    ]
  },
  {
    id: 'slavic',
    name: 'Slavic Languages',
    dialects: [
      { id: 'pl-PL', name: 'Polish (Polski)', description: 'West Slavic language of Poland' },
      { id: 'cs-CZ', name: 'Czech (Čeština)', description: 'Spoken in the Czech Republic' },
      { id: 'sk-SK', name: 'Slovak (Slovenčina)', description: 'Spoken in Slovakia' },
      { id: 'uk-UA', name: 'Ukrainian (Українська)', description: 'East Slavic language of Ukraine' },
      { id: 'ru-RU', name: 'Russian (Русский)', description: 'East Slavic language of Russia' }
    ]
  },
  {
    id: 'classical',
    name: 'Classical & Ancient Greek/Latin',
    dialects: [
      { id: 'la-CL', name: 'Classical Latin (Latina Classica)', description: 'Reconstructed pronunciation of Cicero, Caesar, and Virgil' },
      { id: 'la-EC', name: 'Ecclesiastical Latin (Latina Ecclesiastica)', description: 'Liturgical Latin traditionally used in religion and music' },
      { id: 'grc-CL', name: 'Classical Greek (Ancient Greek)', description: 'Historical dialect of Athens, Attic Greek used in philosophy and literature' },
      { id: 'grc-BYZ', name: 'Medieval/Byzantine Greek', description: 'Development of Greek language during the middle ages' },
      { id: 'el-GR', name: 'Modern Greek (Ellinika)', description: 'Standard language spoken in modern Greece and Cyprus' }
    ]
  },
  {
    id: 'dead_languages',
    name: 'Ancient & Dead Languages',
    dialects: [
      { id: 'cop-EG', name: 'Coptic (Egyptian)', description: 'Late stage of the ancient Egyptian language written in Greek script' },
      { id: 'sa-IN', name: 'Sanskrit (Saṃskṛtam)', description: 'Ancient Indo-Aryan sacred language of Hinduism and classic literature' },
      { id: 'sux-MES', name: 'Sumerian (Eme-gir)', description: 'Ancient language of Sumer, the oldest known written language using cuneiform' },
      { id: 'akk-MES', name: 'Akkadian (Lišānum akkadītum)', description: 'Ancient Semitic language of Mesopotamia (Assyria and Babylonia)' },
      { id: 'goh-DE', name: 'Old High German (Althochdeutsch)', description: 'Earliest stage of the German language (750 to 1050 AD)' },
      { id: 'enm-GB', name: 'Middle English', description: 'Language of Geoffrey Chaucer (12th to 15th centuries)' }
    ]
  },
  {
    id: 'jiddish_and_semitic',
    name: 'Yiddish & Hebrew',
    dialects: [
      { id: 'yi-EU', name: 'Yiddish (Jiddish/ייִדיש)', description: 'Historical West Germanic language of Ashkenazi Jewish origin' },
      { id: 'he-IL', name: 'Modern Hebrew (Ivrit)', description: 'Official language of Israel, revived from sacred biblical text' },
      { id: 'hbo-IL', name: 'Biblical Hebrew', description: 'Archaic liturgical Hebrew used in ancient texts' }
    ]
  },
  {
    id: 'arabic_and_persian',
    name: 'Arabic & Farsi',
    dialects: [
      { id: 'ar-MS', name: 'Modern Standard Arabic (Fusha)', description: 'Literary Arabic used in official communication and media' },
      { id: 'ar-EG', name: 'Egyptian Arabic (Masri)', description: 'Most widely understood spoken dialect of the Arab world' },
      { id: 'ar-LEV', name: 'Levantine Arabic', description: 'Dialect group spoken in Lebanon, Syria, Jordan, and Palestine' },
      { id: 'ar-GLF', name: 'Gulf Arabic (Khaliji)', description: 'Dialect group spoken around the Persian Gulf regional areas' },
      { id: 'fa-IR', name: 'Persian / Farsi (فارسی)', description: 'The elegant language of Iran, Afghanistan, and Tajikistan' }
    ]
  },
  {
    id: 'asian',
    name: 'Asian Languages',
    dialects: [
      { id: 'ja-JP', name: 'Japanese (Nihongo)', description: 'Standard Japanese dialects and pitch accent' },
      { id: 'zh-CN', name: 'Mandarin Chinese (Putonghua)', description: 'Standard spoken Chinese of mainland China' },
      { id: 'zh-HK', name: 'Cantonese Chinese (Yue)', description: 'Spoken in Hong Kong, Macau, and Guangdong province' },
      { id: 'ko-KR', name: 'Korean (Hangugeo)', description: 'Standard Korean language' },
      { id: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', description: 'Tonal Austroasiatic language of Vietnam' },
      { id: 'th-TH', name: 'Thai (Phasa Thai)', description: 'Tonal Tai-Kadai language of Thailand' },
      { id: 'hi-IN', name: 'Hindi (Mānak Hindī)', description: 'Standardized register of the Hindustani language of India' }
    ]
  },
  {
    id: 'african',
    name: 'African Languages',
    dialects: [
      { id: 'sw-KE', name: 'Swahili (Kiswahili)', description: 'Bantu lingua franca of East Africa and the Great Lakes' },
      { id: 'zu-ZA', name: 'Zulu (isiZulu)', description: 'Bantu language of the Zulu people in South Africa' },
      { id: 'yo-NG', name: 'Yoruba (Èdè Yorùbá)', description: 'Pluricentric Niger-Congo language spoken in West Africa' },
      { id: 'am-ET', name: 'Amharic (Amarinya)', description: 'Semitic language spoken in Ethiopia' },
      { id: 'xh-ZA', name: 'Xhosa (isiXhosa)', description: 'Bantu language with distinctive click consonants' }
    ]
  },
  {
    id: 'native_american',
    name: 'Native American Languages',
    dialects: [
      { id: 'nv-US', name: 'Navajo (Diné bizaad)', description: 'Southern Athabaskan language spoken in the American Southwest' },
      { id: 'chr-US', name: 'Cherokee (Tsalagi)', description: 'Iroquoian language with its unique syllabary' },
      { id: 'qu-PE', name: 'Quechua (Runasimi)', description: 'Indigenous language family of the Andean Highlands' },
      { id: 'nah-MX', name: 'Nahuatl (Aztec)', description: 'Uto-Aztecan language family of central Mexico' }
    ]
  },
  {
    id: 'australian_and_maori',
    name: 'Australian & Māori Languages',
    dialects: [
      { id: 'mi-NZ', name: 'Māori (Te Reo Māori)', description: 'Polynesian language indigenous to New Zealand' },
      { id: 'pnt-AU', name: 'Pitjantjatjara / Anangu', description: 'Aboriginal language of Central Australia' },
      { id: 'wri-AU', name: 'Warlpiri', description: 'Aboriginal language of the Northern Territory' },
      { id: 'en-AUB', name: 'Aboriginal English', description: 'Dialect of English reflecting Australian Aboriginal languages' }
    ]
  },
  {
    id: 'alien_and_fantasy',
    name: 'Alien & Fantasy Languages',
    dialects: [
      { id: 'tlh-KL', name: 'Klingon (tlhIngan Hol)', description: 'Constructed warrior language of the Klingon Empire from Star Trek, known for harsh stops' },
      { id: 'qya-EL', name: 'Quenya (High Elven)', description: 'Classical ceremonial poetic language of the Elves created by J.R.R. Tolkien' },
      { id: 'sjn-EL', name: 'Sindarin (Grey Elven)', description: 'Spoken language of the Elves of Middle-earth, characterized by soft mutations' },
      { id: 'dov-DR', name: 'Dovahzul (Dragon Tongue)', description: 'The ancient vocal runes of dragons from Skyrim, with powerful, guttural shout dynamics' },
      { id: 'hvl-VAL', name: 'High Valyrian (Valyrio)', description: 'Noblest language of Essos and the Targaryens, highly rhythmic and liquid' },
      { id: 'vul-VUL', name: 'Vulcan (Vuhlkansu)', description: 'Logical, precise, and measured language of Mount Seleya from Star Trek' },
      { id: 'dra-MY', name: 'Draconian (Ancient Dragon)', description: 'A mystical language; the vocals will be composed in English but with highly guttural, roaring, and draconic phonetics' },
      { id: 'dem-MY', name: 'Demonic (Infernal Voice)', description: 'A dark language; the vocals will be composed in English but with aggressive, archaic, and sinister dark heavy-metal styling' },
      { id: 'ang-MY', name: 'Angelic (Celestial Voice)', description: 'An ethereal language; the vocals will be composed in English but with sublime, highly melodic, and luminous whispering hymn styling' }
    ]
  }
];

export const DEFAULT_DIALECT: Dialect = {
  id: 'en-GB',
  name: 'British English',
  description: 'Standard British pronunciations and spelling (RP)'
};

/**
 * Finds a dialect globally by ID, falling back to English (British) if not found.
 */
export function findDialectById(id: string): Dialect {
  for (const group of LANGUAGE_GROUPS) {
    const found = group.dialects.find(d => d.id === id);
    if (found) return found;
  }
  return DEFAULT_DIALECT;
}

/**
 * Finds which LanguageGroup a dialect belongs to.
 */
export function findGroupByDialectId(dialectId: string): LanguageGroup | undefined {
  return LANGUAGE_GROUPS.find(group => 
    group.dialects.some(d => d.id === dialectId)
  );
}
