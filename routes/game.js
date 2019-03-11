let express = require('express');
let router = express.Router();

router.get('/create_table', (req, res) => {
    res.render('game/create_table');
});

router.post('/create_table', (req, res) => {
    res.render('game/create_table');
});

router.get('/home', (req, res) => {
    res.render('game/home');
});

router.get('/:id/table', (req, res) => {
    res.render('game/table');
});

router.post('/join_table', (req, res) => {
    res.render('game/join_table');
});

module.exports = router;