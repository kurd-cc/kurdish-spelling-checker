import {exists, findBestMatch, findAllMatches, checkText, checkTextWithOtherMatches} from './kurdish-checker.js'

import assert from 'assert'


describe('Checking word existence', function() {
    describe('#exists()', function() {
        it('should return false for the word "hi"', function(done) {
            if (exists("hi")){
                done("Error, hi is not a Kurdish word")
            }else{
                done()
            }
        });
    });
});

describe('Checking word best match without other matches', function() {
    describe('#findBestMatch()', function() {
        it('should return the word "hiş" as best_match for the word "hi"', function() {
            return findBestMatch('hi').then(result => {
                assert.equal(result.best_match, 'hiş')
            })
        });
    });
});


describe('Checking word best match with other matches', function() {
    describe('#findAllMatches()', function() {
        it('should return the word "dema" as best_match for the word "demak" and other matches with >= 70', function() {
            return findAllMatches('demak', 70).then(result => {
                if (result.best_match === 'dema' && result.other_matches.length > 0){
                    assert.ok(result);
                }else {
                    assert.error("Best match is not 'dema' or the other matches are less than 0")
                }
            }).catch(err => {
                assert.error(err)
            })
        });
    });
});

describe('Checking a full text without other matches', function() {
    describe('#checkText()', function() {
        it('the word "demak" should return false in original_word_exists when others are true in the sentence "dem demak azadî"', function() {
            return checkText('dem demak azadî').then(result => {
                if (result[0].original_word_exists && !result[1].original_word_exists && result[2].original_word_exists){
                    assert.ok(result)
                }else{
                    assert.throws(() => iThrowError("Results were not as expected"), Error, "Results were not as expected")
                }

            }).catch(err => {
                assert.throws(() => iThrowError(err), Error, err)
            })
        });
    });
});

describe('Checking a full text with other matches', function() {
    describe('#checkTextWithOtherMatches()', function() {
        it('the word "demak" should return false in original_word_exists when others are true in the sentence' +
            ' "dem demak azadî" and also the "demak" should has other matches with >= 70 percentage of rating', function() {
            return checkTextWithOtherMatches('dem demak azadî', 70).then(result => {
                if (result[0].original_word_exists && !result[1].original_word_exists && result[2].original_word_exists && result[1].other_matches.length > 0){
                    assert.ok(result)
                }else{
                    assert.throws(() => iThrowError("Results were not as expected"), Error, "Results were not as expected")
                }

            }).catch(err => {
                assert.throws(() => iThrowError(err), Error, err)
            })
        });
    });
});


function iThrowError(err) {
    throw new Error(err);
}