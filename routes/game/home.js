let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('game/home');
});

module.exports = router;
