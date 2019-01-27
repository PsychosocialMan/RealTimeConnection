let express = require('express');
let router = express.Router();
let query = require("../db/query");

/* GET home page. */
router.get('/', async (req, res, next) => {
    let example = await query.execute("select * from player");
    res.render('index', { data: example.rows });
});

module.exports = router;
