let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('game/join_table');
});

module.exports = router;
