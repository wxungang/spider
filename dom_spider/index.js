/**
 * express 入口文件
 */
"use strict";
//相关基础依赖
const express = require("express");
//v1 v2用法不一样！
const config = require('config-lite')(__dirname);

//实例
const app = express();


const req = require('./util/request');

req.test('http://op1.win007.com/oddslist/1424928.htm');


// 监听端口，启动程序
const SERVER = app.listen(config.port, function () {

    console.log(config);
    const address = SERVER.address();
    console.log(address);
    console.log(`node listening on port ${config.port}`);
    // console.log(`${pkg.name} listening on port ${config.port}`);
});