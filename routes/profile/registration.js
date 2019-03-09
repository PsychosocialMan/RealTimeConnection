let express = require('express');
let router = express.Router();
let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('global.properties');
let dbExecute = require('../../db/query');
let uuid = require('uuid/v4');
let crypto = require('crypto');

let key = properties.get('user.key');

router.get('/', (req, res) => {
    res.render('profile/registration', {message: ''});
});

router.post('/', async (req, res) => {
    if (!req.body) return res.status(400);
    if (req.session.userId || (!!req.session.userId && req.session.userId.login !== null)) res.status(208).redirect('/');
    console.debug(`[POST] /profile/registration body:{${JSON.stringify(req.body)}}`);

    let query = `select * from player where login = '${req.body.userLogin}'`;
    let result = await dbExecute(query);
    if (result.rows.length !== 0)
        return res.status(406).render('profile/registration', {message: "Имя пользователя занято"});
    if (req.body.userPassword !== req.body.userPasswordConfirmation)
        return res.status(400).render('profile/registration', {message: "Повторите ввод пароля"});

    if (req.body.userLogin.length < 5)
        return res.status(400).render('profile/registration', {message: "Слишком короткий логин"});

    if (req.body.userPassword.length < 5)
        return res.status(400).render('profile/registration', {message: "Слишком короткий пароль"});

    let hashPassword = crypto.createHmac('sha1', key).update(req.body.userPassword).digest('hex');
    query = `INSERT INTO PLAYER (LOGIN, HASH_PASSWORD, EMAIL, IS_AUTHORIZED) VALUES ('${req.body.userLogin}', '${hashPassword}', '${req.body.userEmail}', '1')`;
    result = await dbExecute(query);
    if (!req.session.userId) {
        req.session.userId = {}
    }
    req.session.userId = {uuid: uuid(), login: req.body.userLogin};
    res.status(200).render('profile/home', {message: 'Вход выполнен', data: {login: req.body.userLogin}})

});

module.exports = router;
