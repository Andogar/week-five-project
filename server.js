const express = require('express');

const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');

const homeController = require('./controllers/home-controller');
const gameController = require('./controllers/game-controller');
const winController = require('./controllers/win-controller');

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


application.use(homeController);
application.use(gameController);
application.use(winController);

application.listen(3000);