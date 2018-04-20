/**
 * created by jingcai on 2018/4/20
 * 功能：
 */

"use strict";
var express = require('express');
var router = express.Router();

//config
const CONFIG = require('config-lite');
//service
var jingcai_service = require("../service/jingcai");
//response_format
const res_format = require("../util/response_format");


// 该路由使用的中间件 timeLog
router.use(function timeLog(req, res, next) {
    console.log('/user Time: ', Date.now());
    next();
});

// 定义网站主页的路由
router.get('/', function (req, res, next) {
    // console.log(req);
    res.send(req.query || {});
});


/**
 * url: http://i.sporttery.cn/api/fb_match_info/get_europe/?f_callback=hb_odds&dc_mid=616474
 */
router.post('/sporttery', function (req, res, next) {
    let _result = null;
    let _body = req.body;
    console.log(req.body);
    console.log(req.session);
    let _cmd = req.originalUrl || req.baseUrl + req.url;

    //返回异常处理结果
    if (_result) {
        res.json(Object.assign(_result, {cmd: _cmd}));
        return;
    }


    //service
    jingcai_service.sporttery(_body).then(
        data => res.json(res_format.response_format({result: data, cmd: _cmd})),
        err => res.json(res_format.response_without_result({result: err, cmd: _cmd}))
    )
});


module.exports = router;