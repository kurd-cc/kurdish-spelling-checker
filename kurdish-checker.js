import { readFileSync } from 'fs'
import stringSimilarity from 'string-similarity';

// Reads all words from db/words.txt to an array
const all_words = readFileSync('db/words.txt').toString().replace(/\r\n/g,'\n').split('\n');


/**
 * Check if a certain word exists or not
 * @param word is the word that you want to check
 * @return true if this word exists, otherwise false
 * */
export function exists(word) {
    return all_words.includes(word)
}

/**
 * Find only the best match of the word
 * @param word is the word that you want to check
 * @return an object contains the word itself if it exists with rating 1.0, the index of the word in db/words.txt and true as it exists,
 * otherwise the best match, its rating and index in db/words.txt and false as the entered word does not exists
 * */
export async function findBestMatch(word) {
    if (exists(word)){
        return {original_word: word, best_match: word, best_match_rating: 1.0, best_match_index: all_words.indexOf(word), original_word_exists: true}
    }else{
        const result = stringSimilarity.findBestMatch(word, all_words)
        return {original_word: word, best_match: result.bestMatch.target, best_match_rating: result.bestMatch.rating, best_match_index: result.bestMatchIndex, original_word_exists: false}
    }
}

/**
 * Find the best match of the word and all other matched words with a rating higher or equal as requested
 * @param word is the word that you want to check
 * @param percentage 0-100 of the lower rating of the other matched words
 * @return an object contains the word itself if it exists with rating 1.0, the index of the word in db/words.txt and true as it exists and an array of other matches {target, rating},
 * otherwise the best match, its rating and index in db/words.txt and false as the entered word does not exists and an array of other matches {target, rating}
 * */
export async function findAllMatches(word, percentage) {
    const result = stringSimilarity.findBestMatch(word, all_words)

    const other_matches = result.ratings
        .filter((current_rating) => (current_rating.rating >= percentage/100) && (current_rating.target !== result.bestMatch.target))
        .sort(function(a, b) {return parseFloat(a.rating) - parseFloat(b.rating);})
        .reverse()

    if (exists(word)){
        return {original_word: word, best_match: word, best_match_rating: 1.0, best_match_index: all_words.indexOf(word), original_word_exists: true, other_matches: other_matches}
    }else{
        return {original_word: word, best_match: result.bestMatch.target, best_match_rating: result.bestMatch.rating, index: result.bestMatchIndex, original_word_exists: false, other_matches: other_matches}
    }
}

/**
 * Check a full text, word by word to get an array for each word including the other matches too
 * @param text the text that you want to check
 * @param percentage the lowest percentage of the other matched words 0-100 (doesn't apply on the best match)
 * @return a Promise that await an array of objects, one for each word
 * */
export async function checkTextWithOtherMatches(text, percentage=70){
    return Promise.all(getKurdishWords(text).map((word) => (findAllMatches(word, percentage))))
}

/**
 * Check a full text, word by word to get an array for each word including only the best match
 * @param text the text that you want to check
 * @return a Promise that await an array of objects, one for each word
 * */
export async function checkText(text){
    return Promise.all(getKurdishWords(text).map((word) => findBestMatch(word)))
}

// Text to an array of Kurdish words
function getKurdishWords(text){
    let kurdish_letters = "ABCÇDEÊFGHIÎJKLMNOPQRSŞTUÛVWXYZabcçdeêfghiîjklmnopqrsştuûvwxyz".split('')
    let replaced_text = text.replace(new RegExp(`[^${kurdish_letters.join('')}]`, 'g'), '*');

    return replaced_text.split("*").filter((word) => word.toString().trim().length > 0).map((word) => word.toLowerCase())
}
