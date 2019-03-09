let createError = require('http-errors');
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let logger = require('morgan');

let indexRouter = require('./routes/index');

let profileAuthorizationRouter = require('./routes/profile/authorization');
let profileRegistrationRouter = require('./routes/profile/registration');
let profileFindFriendsRouter = require('./routes/profile/find_friends');
let profileHomeRouter = require('./routes/profile/home');
let profileStatsRouter = require('./routes/profile/stats');

let gameCreateTableRouter = require('./routes/game/create_table');
let gameHomeRouter = require('./routes/game/home');
let gameJoinTableRouter = require('./routes/game/join_table');
let gameTableRouter = require('./routes/game/table');

let usersRouter = require('./routes/users');

let app = express();

// Настройка View
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
// Использование статических скриптов
app.use(express.static(path.join(__dirname, 'public')));

// Определение соответствия роутера и REST-маршрута
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/profile/registration', profileRegistrationRouter);
app.use('/profile/authorization', profileAuthorizationRouter);
app.use('/profile/find_friends', profileFindFriendsRouter);
app.use('/profile/home', profileHomeRouter);
app.use('/profile/stats', profileStatsRouter);

app.use('/game/create_table', gameCreateTableRouter);
app.use('/game/home', gameHomeRouter);
app.use('/game/join_table', gameJoinTableRouter);
//TODO - Выяснить реализацию апи данного типа контейнеров
app.use('/game/table', gameTableRouter);

// Выброс 404 ошибки в случае Exception
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
