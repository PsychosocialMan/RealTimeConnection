let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('profile/home');
});

module.exports = router;
