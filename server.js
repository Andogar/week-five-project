const express = require('express');

const mustache = require('mustache-express');
const bodyParser = require('body-parser');
const session = require('express-session');
const authentication = require('./middlewares/authentication-middleware');

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

application.use('/public', express.static('./public'));
application.use(bodyParser.urlencoded());
application.use(authentication);


application.use(homeController);
application.use(gameController);
application.use(winController);

application.listen(3000);