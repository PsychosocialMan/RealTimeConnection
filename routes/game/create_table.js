let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('game/create_table');
});

module.exports = router;
