const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
require('./rest')(app);
require('./websocket')(server);

var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const fs = require("fs");



const teacherRouter = require('./routes/teacher.js')
const studentRouter = require('./routes/student.js')
// const examRouter = require('./routes/exam.js')
const cors = require('cors')
app.use(cors())
// 添加json解析
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));





const PORT = process.env.PORT || 3000

server.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.use(express.static('./public/index.html'))

// 引入七牛云配置
const qnconfig = require('./config/qiniuconfig')
// 处理请求
app.get('/token', (req, res, next) => {
  // console.log(qnconfig.uploadToken)
  res.status(200).send(qnconfig.uploadToken)
})


// app.use( '/teacher', teacherRouter)
app.use( '/teacher', teacherRouter)
app.use( '/student', studentRouter)
// app.use( '/exam', examRouter)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



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
