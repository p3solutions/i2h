const router = require('express').Router();
// this url is 'login/'
router.get('/', function (req, res, next) {
    res.send('I2H RESTful API');
});

module.exports = router;