const express = require('express');
const router = express.Router();

router.use(function (request, response, next) {
    if (request.session.isAuthenticated === undefined) {
        request.session.isAuthenticated = false;
    }
    next();
});

module.exports = router;