let express = require('express');
let router = express.Router();

router.get('/', (req, res) => {
    res.render('profile/find_friends');
});

module.exports = router;
