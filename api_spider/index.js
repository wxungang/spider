/**
 * express 入口文件
 */
"use strict";
//相关基础依赖
const path = require("path");
const express = require("express");
//v1 v2用法不一样！
const config = require('config-lite')(__dirname);
const helmet = require('helmet');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const cors = require('cors');

const moment = require('moment');
console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
console.log('----------')
console.log(moment(moment(), "YYYY-MM-DD"));


// 路由 在 express 实例化之前
const routes = require('./router/index');// or  require('./router');
//实例 express
const app = express();
//设置地址栏icon 图标
app.use(favicon(path.join(__dirname, './public', 'favicon/favi.ico')));
//跨域设置
app.use(cors());

// 建议使用 helmet 插件处理 header
app.disable('x-powered-by');
app.use(helmet());

// bodyParser ：ajax 请求的配置项
// app.use(bodyParser.json({
//      type: 'application/*+json',
//      strict: false
// })); // for parsing application/json
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended: false})); // for parsing application/x-www-form-urlencoded


// 设置模板目录和模板引擎pug
app.set('views', path.join(__dirname, './public/view'));
// 设置模板引擎为 ejs
app.set('view engine', 'ejs');


// 设置静态文件目录
app.use(config.publicPath, express.static(path.join(__dirname, './public')));
// 前端 静态资源区 [更多配置 查看官方api]
app.use('/', express.static(path.join(__dirname, './webapp'), {maxAge: 1000, index: ['index.html', 'app.html']}));

// 路由
routes(app);


const req = require('./util/request');

// req.test('http://op1.win007.com/oddslist/1424928.htm');


// 监听端口，启动程序
const SERVER = app.listen(config.port, function () {

    console.log(config);
    const address = SERVER.address();
    console.log(address);
    console.log(`node listening on port ${config.port}`);
    // console.log(`${pkg.name} listening on port ${config.port}`);
});