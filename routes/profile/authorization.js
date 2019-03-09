let express = require('express');
let router = express.Router();
let dbExecute = require('../../db/query');
let app = require('../../app');
let uuid = require('uuid/v4');
let crypto = require('crypto');

let key = 'k5~0GZhXyO#ZE$9t%xPlB3H3q';

router.post('/', async (req, res) => {
    if (!req.body) return res.status(400);
    console.log(`[POST] /profile/authorization body:{${JSON.stringify(req.body)}}`);
    let hashPassword = crypto.createHmac('sha1', key).update(req.body.userPassword).digest('hex');
    query = `select * from player where login = '${req.body.userLogin}' and hash_password = '${hashPassword}'`;
    const result = await dbExecute(query);
    if (result.rows.length === 0)
        res.status(403).render('index', {message: 'Неверный логин или пароль', data: {}});
    else {
        if (!req.session.userId) {
            req.session.userId = {}
        }
        req.session.userId = {uuid: uuid(), login: result.rows[0].LOGIN};
        res.status(200).render('profile/home', {message: 'Вход выполнен', data: {login: result.rows[0].LOGIN}})
    }
});

module.exports = router;
