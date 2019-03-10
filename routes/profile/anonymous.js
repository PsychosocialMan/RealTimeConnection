let express = require('express');
let router = express.Router();
let dbExecute = require('../../db/query');
let uuidv4 = require('uuid/v4');


router.get('/', async(req, res) => {
    if (!req.body) return res.status(400);
    if (!!req.session.userId) return res.status(208).render('profile/home', {message: 'Вы уже авторизованы'});
    console.debug(`[POST] /profile/anonymous body:{${JSON.stringify(req.body)}}`);
    let uuid = uuidv4();
    query = `INSERT INTO ACCOUNT (LOGIN, HASH_PASSWORD, EMAIL, IS_AUTHORIZED, SESSION_ID) VALUES (null, null, null, '0', '${uuid}')`;
    result = await dbExecute(query);
    req.session.userId = {uuid: uuid, login: null};
    res.render('profile/home', {message: 'Вы вошли как анонимный пользователь'});
});

module.exports = router;
