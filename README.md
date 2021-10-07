# Kurdish-spell-checker <br>
<hr>
An NPM package to check Kurdish (Kurmanji) texts/words spelling. <br>

### Features: <br>
- Check full texts to find each word spell checking
- Check if a certain word exists or not
- Check the best match and other matches of a certain word 

<br>

### Usage: <br>

1. Install the package: <br>
```
npm i kurdish-spell-checker
```
or
```
yarn add kurdish-spell-checker
```
<br>

2. Different ways to use it: <br>
```javascript
import {exists, findBestMatch, findAllMatches,
    checkText, checkTextWithOtherMatches} from 'kurdish-spell-checker'


//Check if word exists
exists("hi")    // false
exists("spas")  // true
exists("sipas") // false

//Check the best match of a word
await findBestMatch("hi")  // { original_word: 'hi', best_match: 'hiş',  best_match_rating: 0.6666666666666666, best_match_index: 405, original_word_exists: false}

//Check the best match of a word with other matches too
//will return the best match and also other matches with >= 70% of simillarity
await findAllMatches("dema", 70)

//Check a full text without other matches
//will return an array with object for each word
await checkText("dem demak azadî")

//Check a full text with other matches each word
//will return an array with object for each word
await checkTextWithOtherMatches("dem demak azadî")
```
<br>

### Testing: <br>
You can test using <strong>mocha</strong>: <br>

```
npm test
```