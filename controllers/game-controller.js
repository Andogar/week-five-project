const express = require('express');
const router = express.Router();
const fs = require('fs');

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

router.get('/game', (request, response) => {
    if (request.session.isAuthenticated === true) {
        request.session.randomWord = words[Math.floor((Math.random() * words.length) - 1)].toUpperCase();
        request.session.wordArray = request.session.randomWord.split('');
        request.session.letters = request.session.randomWord.split('');
        request.session.totalGuesses = [];
        request.session.correctGuesses = [];
        request.session.incorrectGuesses = [];
        request.session.blankLetters = [];
        request.session.guess = '';
        request.session.guesses = 8;
        for (var i = 0; i < request.session.wordArray.length; i++) {
            request.session.blankLetters.push("_");
        }
        var newGame = request.session;
        response.render('game', newGame);
    } else {
        response.redirect('/');
    }
});

router.post('/game', (request, response) => {
    request.session.guess = request.body.guess.toUpperCase();
    request.session.error = "";
    if (!request.body.guess.match(/[a-zA-Z]/)) {
        request.session.error = "Please enter a valid character.";
        response.render('game', request.session);
    } else if (request.session.totalGuesses.indexOf(request.session.guess) != -1) {
        request.session.error = "You have already guessed that, try again.";
        response.render('game', request.session);
    } else if (request.body.guess.length > 1 || request.body.guess.length == 0) {
        request.session.error = "Only enter one character at a time.";
        response.render('game', request.session);

    } else {
        request.session.totalGuesses.push(" " + request.session.guess);
        if (request.session.wordArray.indexOf(request.session.guess) != -1) {
            request.session.correctGuesses.push(request.session.guess);
            checkCharacter(request.session.wordArray, request.session.guess);
            showLetter(request.session.blankLetters, request.session.letters, request.session.guess)

            if (request.session.wordArray.length === 0) {
                request.session.wonGame = true;
                response.redirect('/win');
            } else {
                response.render('game', request.session)
            }
        } else {
            request.session.incorrectGuesses.push(request.session.guess);
            request.session.guesses -= 1;
            if (request.session.guesses === 0) {
                response.render('lose', request.session);
            } else {
                response.render('game', request.session);
            }
        }
    }
});

function checkCharacter(array, guess) {
    for (var i = 0; i < array.length; i++) {
        if (array.indexOf(guess) != -1) {
            var index = array.indexOf(guess);
            array.splice(index, 1);
        }
    }
    return array;
}

function showLetter(array1, array2, guess) {
    for (var i = 0; i <= array1.length; i++) {
        while (array2.indexOf(guess) != -1) {
            var index = array2.indexOf(guess);
            array2.splice(index, 1, "/");
            array1.splice(index, 1, guess);
        }
    }
    return array1;
}

module.exports = router;