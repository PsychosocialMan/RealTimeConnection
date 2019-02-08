let express = require('express');
let router = express.Router();
let query = require("../db/query");

/* GET home page. */
router.get('/', async (req, res) => {
    res.render('index');
});

module.exports = router;
