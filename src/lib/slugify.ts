/**
 * Convert Hindi (Devanagari) & English headlines into clean, SEO-friendly English URL slugs.
 * E.g.: "बीकानेर में भारी बारिश, स्कूल बंद" -> "bikaner-me-bhari-barish-school-band"
 */

const devanagariMap: Record<string, string> = {
  // Independent Vowels
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
  'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au', 'अं': 'an', 'अः': 'ah',

  // Consonants
  'क': 'k', 'ख': 'kh', 'ग': 'g', 'घ': 'gh', 'ङ': 'ng',
  'च': 'ch', 'छ': 'chh', 'ज': 'j', 'झ': 'jh', 'ञ': 'ny',
  'ट': 't', 'ठ': 'th', 'ड': 'd', 'ढ': 'dh', 'ण': 'n',
  'त': 't', 'थ': 'th', 'द': 'd', 'ध': 'dh', 'न': 'n',
  'प': 'p', 'फ': 'ph', 'ब': 'b', 'भ': 'bh', 'म': 'm',
  'य': 'y', 'र': 'r', 'ल': 'l', 'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's', 'ह': 'h',
  'क्ष': 'ksh', 'त्र': 'tr', 'ज्ञ': 'gya', 'श्र': 'shra',

  // Vowel signs (Matras)
  'ा': 'a', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri',
  'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ँ': 'n',
  'ः': 'h', '्': '', '़': '',

  // Hindi numerals
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
};

// Common Hindi words transliteration overrides for cleaner slugs
const commonHindiWords: Record<string, string> = {
  'में': 'me',
  'से': 'se',
  'के': 'ke',
  'की': 'ki',
  'का': 'ka',
  'को': 'ko',
  'पर': 'par',
  'और': 'aur',
  'ने': 'ne',
  'है': 'hai',
  'हैं': 'hain',
  'भी': 'bhi',
  'तक': 'tak',
  'था': 'tha',
  'थी': 'thi',
  'थे': 'the',
  'हुआ': 'hua',
  'हुई': 'hui',
  'हुए': 'hue',
  'कर': 'kar',
  'रहा': 'raha',
  'रही': 'rahi',
  'रहे': 'rahe',
  'नहीं': 'nahi',
  'बड़ी': 'badi',
  'खबर': 'khabar',
  'अपडेट': 'update',
  'ताज़ा': 'taza',
  'आज': 'aaj',
  'कल': 'kal',
  'बीकानेर': 'bikaner',
  'जयपुर': 'jaipur',
  'जोधपुर': 'jodhpur',
  'उदयपुर': 'udaipur',
  'कोटा': 'kota',
  'राजस्थान': 'rajasthan',
  'भारत': 'bharat',
};

export function transliterateHindiToEnglish(text: string): string {
  if (!text) return '';

  // Process word by word for common word replacements
  const words = text.trim().split(/\s+/);
  const convertedWords = words.map((w) => {
    // Strip punctuation from word for dictionary lookup
    const cleanW = w.replace(/[।!?,.:;()'"“”‘’]/g, '');
    if (commonHindiWords[cleanW]) {
      return commonHindiWords[cleanW];
    }

    let result = '';
    const chars = Array.from(cleanW);
    for (let i = 0; i < chars.length; i++) {
      const char = chars[i];
      const nextChar = chars[i + 1];

      if (devanagariMap[char] !== undefined) {
        result += devanagariMap[char];
        // If a consonant is not followed by a virama (्) or a matra, add implicit 'a'
        const isConsonant = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशषसहक्षत्रज्ञश्र'.includes(char);
        const hasMatraNext = nextChar && 'ािीुूृेैोौ्'.includes(nextChar);
        if (isConsonant && !hasMatraNext && nextChar && !' ।!?,.:;()'.includes(nextChar)) {
          // add 'a' only if not at the very end of word (in modern Hindi schwa is dropped at end)
          if (i < chars.length - 1) {
            result += 'a';
          }
        }
      } else {
        result += char;
      }
    }
    return result;
  });

  return convertedWords.join(' ');
}

export function generateEnglishSlug(title: string): string {
  if (!title) return '';

  // 1. Transliterate Hindi to English
  const transliterated = transliterateHindiToEnglish(title);

  // 2. Normalize and convert to lowercase
  return transliterated
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // remove non-alphanumeric except space and hyphen
    .trim()
    .replace(/\s+/g, '-') // replace spaces with hyphens
    .replace(/-+/g, '-') // collapse multiple hyphens
    .substring(0, 100) // max 100 chars
    .replace(/^-+|-+$/g, ''); // trim leading/trailing hyphens
}

