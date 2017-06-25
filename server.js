const express = require('express');
const fs = require('fs');
const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');


const application = express();

application.engine('mustache', mustache());
application.set('views', './views');
application.set('view engine', 'mustache');

application.use(session({
    secret: 'secretcookiekey',
    resave: false,
    saveUninitialized: true
}));

application.use(bodyParser.urlencoded());

application.use('/public', express.static('./public'));

application.use(function (request, response, next) {
    if (request.session.isAuthenticated === undefined) {
        request.session.isAuthenticated = false;
    }
    next();
});

const words = fs.readFileSync("/usr/share/dict/words", "utf-8").toLowerCase().split("\n");

application.get('/', (request, response) => {
    request.session.isAuthenticated = true;
    response.render('index');
});

application.get('/game', (request, response) => {
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

application.post('/game', (request, response) => {
    request.session.guess = request.body.guess.toUpperCase();
    request.session.error = "";
    if (request.body.guess.length > 1 || request.body.guess.length == 0) {
        request.session.error = "You have entered an invalid guess.";
        response.render('game', request.session);
    } else if (request.session.totalGuesses.indexOf(request.session.guess) != -1) {
        request.session.error = "You have already guessed that, try again.";
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

application.get('/win', (request, response) => {
     if (request.session.wonGame) {
         response.render('win', request.session);
     } else {
         response.redirect('/');
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

application.listen(3000);