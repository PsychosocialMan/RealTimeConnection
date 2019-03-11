let express = require('express');
let router = express.Router();
let dbExecute = require('../db/query');
let uuidv4 = require('uuid/v4');
let crypto = require('crypto');
let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('global.properties');

let key = properties.get('user.key');

router.get('/anonymous', async(req, res) => {
    if (!req.body) return res.status(400);
    if (!!req.session.userId) return res.status(208).render('profile/home', {message: 'Вы уже авторизованы'});
    console.debug(`[GET] /profile/anonymous body:{${JSON.stringify(req.body)}}`);
    let uuid = uuidv4();
    query = `INSERT INTO ACCOUNT (LOGIN, HASH_PASSWORD, EMAIL, IS_AUTHORIZED, SESSION_ID) VALUES (null, null, null, '0', '${uuid}')`;
    result = await dbExecute(query);
    req.session.userId = {uuid: uuid, login: null};
    res.render('profile/home', {message: 'Вы вошли как анонимный пользователь'});
});

router.post('/authorization', async (req, res) => {
    if (!req.body) return res.status(400);
    if (!!req.session.userId && req.session.userId.login !== null)
        return res.status(208).render('profile/home', {message: 'Вы уже авторизованы'});
    console.debug(`[POST] /profile/authorization body:{${JSON.stringify(req.body)}}`);
    let hashPassword = crypto.createHmac('sha1', key).update(req.body.userPassword).digest('hex');
    let query = `select * from account where login = '${req.body.userLogin}' and hash_password = '${hashPassword}'`;
    const result = await dbExecute(query);
    if (result.rows.length === 0)
        return res.status(403).render('index', {message: 'Неверный логин или пароль', data: {}});
    else {
        if (!req.session.userId) {
            req.session.userId = {}
        }
        req.session.userId = {uuid: uuidv4(), login: result.rows[0].LOGIN};
        query = `update account set session_id = '${req.session.userId.uuid}' where login = '${result.rows[0].LOGIN}'`;
        await dbExecute(query);
        res.status(200).render('profile/home', {message: 'Вход выполнен', data: {login: result.rows[0].LOGIN}})
    }
});

router.get('/home', (req, res) => {
    res.render('profile/home');
});

router.get('/registration', (req, res) => {
    res.render('profile/registration', {message: ''});
});

router.post('/registration', async (req, res) => {
    if (!req.body) return res.status(400);
    if (!!req.session.userId && req.session.userId.login !== null) res.status(208).render('profile/home', {message: 'Вы уже авторизованы'});
    console.debug(`[POST] /profile/registration body:{${JSON.stringify(req.body)}}`);

    let query = `select * from account where login = '${req.body.userLogin}'`;
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
    let uuid = uuidv4();
    query = `INSERT INTO ACCOUNT (LOGIN, HASH_PASSWORD, EMAIL, IS_AUTHORIZED, SESSION_ID) VALUES ('${req.body.userLogin}', '${hashPassword}', '${req.body.userEmail}', '1', '${uuid}')`;
    result = await dbExecute(query);
    if (!req.session.userId) {
        req.session.userId = {}
    }
    req.session.userId = {uuid: uuid, login: req.body.userLogin};
    res.status(200).render('profile/home', {message: 'Вход выполнен', data: {login: req.body.userLogin}})

});

router.get('/:id/stats', (req, res) => {
    res.render('profile/stats');
});

module.exports = router;
