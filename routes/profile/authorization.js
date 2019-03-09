let express = require('express');
let router = express.Router();
let dbExecute = require('../../db/query');
let uuid = require('uuid/v4');
let crypto = require('crypto');
let PropertiesReader = require('properties-reader');
let properties = PropertiesReader('global.properties');

let key = properties.get('user.key');

router.post('/', async (req, res) => {
    if (!req.body) return res.status(400);
    if (req.session.userId || (!!req.session.userId && req.session.userId.login !== null))
        return res.status(208).render('index', {message: 'Вы уже вошли'});
    console.debug(`[POST] /profile/authorization body:{${JSON.stringify(req.body)}}`);
    let hashPassword = crypto.createHmac('sha1', key).update(req.body.userPassword).digest('hex');
    query = `select * from player where login = '${req.body.userLogin}' and hash_password = '${hashPassword}'`;
    const result = await dbExecute(query);
    if (result.rows.length === 0)
        return res.status(403).render('index', {message: 'Неверный логин или пароль', data: {}});
    else {
        if (!req.session.userId) {
            req.session.userId = {}
        }
        req.session.userId = {uuid: uuid(), login: result.rows[0].LOGIN};
        res.status(200).render('profile/home', {message: 'Вход выполнен', data: {login: result.rows[0].LOGIN}})
    }
});

module.exports = router;
