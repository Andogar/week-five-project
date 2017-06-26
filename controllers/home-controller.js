const express = require('express');
const router = express.Router();


router.get('/', (request, response) => {
    request.session.isAuthenticated = true;
    response.render('index');
});

module.exports = router;