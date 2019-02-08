let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('create_table');
});

module.exports = router;
