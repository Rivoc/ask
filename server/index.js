let express = require('express')
let app = express()
let session = require('express-session')

app.use(require('cookie-parser')())
app.use('/uploads', express.static(__dirname + '/uploads'))//静态资源托管，让upload路径下的文件都可以被访问到
app.use(session({
  name: 'name',//这里的name值得是cookie的name，默认cookie的name是：connect.sid
  secret: "weird sheep",//用来对session id相关的cookie进行签名
  resave: false,//是否每次都重新保存会话，建议false
  saveUninitialized: false,
  cookie: { user: "default", maxAge: 60 * 1000 }//maxAge设置过期时间的一种方便选项，值为毫秒单位，表示过期时间到当前时间的毫秒值
}));
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:8081');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  res.header('Access-Control-Allow-Credentials', true)
  next();
});
app.use(express.json())//解析请求体
//引入web下的index.js
require('./router/web/index')(app)
//连接数据库
require('./utils/db')(app)
app.listen('3111', () => {
  console.log('server start 3111')
})