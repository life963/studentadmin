var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');

//解决跨域采用cors
const cors = require("cors");

//将数据库连接的判断写在这里，公有
//连接数据库,后面加代码是防止警告
mongoose.connect('mongodb://127.0.0.1:27017/hz2004', { useNewUrlParser: true, useUnifiedTopology: true });

//判断数据库连接成功
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("数据库连接成功");
});

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');
var studentsRouter = require('./routes/students');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//使用cors插件
app.use(cors());

app.use('/', indexRouter);
app.use('/api/admins', adminRouter);
app.use('/api/students', studentsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;