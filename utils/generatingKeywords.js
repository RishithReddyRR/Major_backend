const natural = require('natural');
const tokenizer = new natural.WordTokenizer();

function generateKeywords(abstract) {
    // Tokenize the abstract into words
    const words = tokenizer.tokenize(abstract.toLowerCase());

    // Remove stopwords (common words like "the", "and", etc.)
    const stopwords = ['the', 'and', 'or', 'a', 'an', 'of', 'to', 'in', 'on','is'];
    const filteredWords = words.filter(word => !stopwords.includes(word));

    // Count word frequencies
    const wordFreq = {};
    filteredWords.forEach(word => {
        if (wordFreq[word]) {
            wordFreq[word]++;
        } else {
            wordFreq[word] = 1;
        }
    });

    // Sort words by frequency
    const sortedWords = Object.keys(wordFreq).sort((a, b) => wordFreq[b] - wordFreq[a]);

    // Return top 5 keywords
    return sortedWords.slice(0, 5);
}

module.exports = generateKeywords;