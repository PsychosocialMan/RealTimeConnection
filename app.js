let createError = require('http-errors');
let express = require('express');
let bodyParser = require('body-parser');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let authorizationRouter = require('./routes/authorization');
let registrationRouter = require('./routes/registration');
let createTableRouter = require('./routes/create_table');
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
// Использование статических скриптов
app.use(express.static(path.join(__dirname, 'public')));

// Определение соответствия роутера и REST-маршрута
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/registration', registrationRouter);
app.use('/authorization', authorizationRouter);
app.use('/create_table', createTableRouter);

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
