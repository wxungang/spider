/**
 * Created by xiaogang on 2017/4/4.
 *
 */
"use strict";
var express = require('express');
var router = express.Router();

//config
const CONFIG = require('config-lite');
//service
var service = require("../service/service");
var user_service = require("../service/user");
//util
var res_format = require("../util/response_format");
//multer upload
var upload = require('./multer_upload');
//validate
var validate = require('../util/validate');

//

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

// 用户注册
router.post('/sign', function (req, res, next) {
    let _result = null;
    let _body = req.body;
    console.log(req.body);
    console.log(req.session.tempId);

    //必要参数处理
    if (!(_body.name && _body.pwd && _body.password && _body.verifycode)) {
        _result = res_format.response_without_request({});
        // res.json(_result);
        // return;
    }
    //参数 规则
    else if (_body.pwd !== _body.password) {
        _result = res_format.response_error_request({
            msg: "密码输入不一致！"
        });
    }
    else if (req.session.tempId !== _body.verifycode.repeat(2)) {
        _result = res_format.response_error_request({
            msg: "验证码不对！"
        });
    } else {
        //必要参数合法性验证
        let _invalidMsg = validate.username(_body.name) || validate.password(_body.password, "密码太简单！");
        if (_invalidMsg) {
            _result = res_format.response_error_request({
                msg: _invalidMsg
            });
        }
    }
    //返回异常处理结果
    if (_result) {
        res.json(Object.assign(_result, {cmd: 'user/sign'}));
        return;
    }

    //非必要参数 手机号
    if (validate.phone(_body.phone)) {
        _body.phone = '';
    }

    //sql
    user_service.sign(_body, function (data) {
        if (data.code === 10000) {
            //注册成功，分配session
            req.session[CONFIG.session.userId] = req.body.name;
        }
        res.json(Object.assign(data, {cmd: 'user/sign'}));
    });
});
// 用户登录
router.post('/login', function (req, res) {
    req.session[CONFIG.session.userId] = req.body.name;
    let _body = req.body;
    //必要参数处理
    if (!(_body.name && _body.password)) {
        let _result = res_format.response_without_request({
            cmd: "user/login"
        });
        res.json(_result);

        return;
    }

    //密码的 md5 处理[放到了service层控制]

    //sql
    user_service.login(_body, function (data) {
        if (data.code === 10000) {
            //登录成功，分配session
            req.session[CONFIG.session.userId] = req.body.name;
        }
        res.json(data);
    })

});
/**
 * 用户注册 验证码
 */
router.post('/verifycode', function (req, res, next) {
    service.verifycode(req, function (code) {
        //生成tempId
        req.session.tempId = code.repeat(2);

        //response
        res.json(res_format.response_format({
            cmd: "user/verifycode",
            result: {
                code: code
            }
        }));
    });
});
/**
 * 获取 用户 信息
 */
router.post('/info', function (req, res) {
    console.log(req.session);
    console.log(req.body);
    let _body = req.body;
    let _result = null;
    if (!_body.name) {
        _result = res_format.response_without_request({});
    }

    else if (!req.session.userId) {
        _result = res_format.response_user_none({
            msg: "请重新登录！"
        });
    }

    //返回异常处理结果
    if (_result) {
        res.json(Object.assign(_result, {cmd: 'user/sign'}));
        return;
    }

    //sql
    user_service.info(req.session, function (data) {
        res.json(data);
    })
});

/**
 * 设置用户logo
 */
router.post('/logo', upload.single('logo'), function (req, res) {
    console.log(req.session);
    // console.log(req.body);
    // console.log(req.file);
    if (!(req.body.userName && req.file)) {
        res.json(res_format.response_without_request({
            cmd: "user/logo"
        }));

        return;
    }

    user_service.logo(req, function (data) {
        console.log("=============== router logo callback ==========");
        res.json(Object.assign(data, {cmd: "user/logo"}));
    })

});

module.exports = router;