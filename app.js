let createError = require('http-errors');
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let cookieParser = require('cookie-parser');
let expressSession = require('express-session');
let logger = require('morgan');
let sqlInjection = require('sql-injection');

let indexRouter = require('./routes/index');

let profileRouter = require('./routes/profile');
let gameRouter = require('./routes/game');

let app = express();

// Настройка View
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(sqlInjection);
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
app.use('/profile', profileRouter);
app.use('/game', gameRouter);

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
