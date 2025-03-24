const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require('./american-to-british-titles.js');
const britishOnly = require('./british-only.js');

class Translator {
  translate(text, locale) {
    if (!text || typeof text !== 'string') {
      return { error: 'No text to translate' };
    }
    if (!locale || (locale !== 'american-to-british' && locale !== 'british-to-american')) {
      return { error: 'Invalid value for locale field' };
    }

    let translation = text;
    let translated = false;
    const highlight = (word) => `<span class="highlight">${word}</span>`;

    // Dictionaries for general words and spellings.
    const dictionary = locale === 'american-to-british' ? americanOnly : britishOnly;
    const spelling = locale === 'american-to-british'
      ? americanToBritishSpelling
      : invertObject(americanToBritishSpelling);
    const titles = locale === 'american-to-british'
      ? americanToBritishTitles
      : invertObject(americanToBritishTitles);

    // Helper to escape regex special characters.
    const escapeRegExp = (string) => string.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');

    // Generic translation for dictionary & spelling.
    const applyTranslation = (dict) => {
      Object.keys(dict).forEach((word) => {
        const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, 'gi');
        if (regex.test(translation)) {
          translation = translation.replace(regex, (match) => {
            let replacement = dict[word];
            // Preserve capitalization.
            if (match[0] === match[0].toUpperCase()) {
              replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
            }
            return highlight(replacement);
          });
          translated = true;
        }
      });
    };

    // Fixed translation for titles.
    const applyTitleTranslation = (titlesDict) => {
      Object.keys(titlesDict).forEach((word) => {
        // For american-to-british, dictionary keys include a period (e.g. "Mr."),
        // so we remove it for the regex and allow an optional period.
        let wordPattern = word;
        if (locale === 'american-to-british' && word.endsWith('.')) {
          wordPattern = word.slice(0, -1);
        }
        // Create a regex that matches the word with an optional trailing period.
        const regex = new RegExp(`\\b${escapeRegExp(wordPattern)}(\\.)?`, 'gi');
        if (regex.test(translation)) {
          translation = translation.replace(regex, (match, p1) => {
            let replacement = titlesDict[word];
            // Preserve capitalization.
            if (match[0] === match[0].toUpperCase()) {
              replacement = replacement.charAt(0).toUpperCase() + replacement.slice(1);
            }
            if (replacement == match) {
              return replacement;
            } else {
              translated = true;
              return highlight(replacement);
            }
          });
        }
      });
    };

    applyTranslation(dictionary);
    applyTranslation(spelling);
    applyTitleTranslation(titles);

    // Time conversion.
    const timeRegex = locale === 'american-to-british'
      ? /\b(\d{1,2}):(\d{2})\b/g
      : /\b(\d{1,2})\.(\d{2})\b/g;
    translation = translation.replace(timeRegex, (match, p1, p2) => {
      translated = true;
      return highlight(`${p1}${locale === 'american-to-british' ? '.' : ':'}${p2}`);
    });
    
    return { text, translation: translated ? translation : 'Everything looks good to me!' };
  }
}

// Helper function to invert key-value pairs of an object.
function invertObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [value, key])
  );
}

module.exports = Translator;
