const express = require('express');
const router = express.Router();

router.get('/win', (request, response) => {
    if (request.session.wonGame) {
        response.render('win', request.session);
    } else if (request.session.isAuthenticated) {
        response.redirect('game', request.session);
    } else {
        response.redirect('/');
    }
});

module.exports = router;