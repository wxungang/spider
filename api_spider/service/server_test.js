/**
 * Created by xiaogang on 2017/4/9.
 *  业务测试 代码
 */
"use strict";
//mysql
var test_pool = require("../mysql/mysql_pool_test");
//util
var res_format = require("../util/response_format");

var request = require('request');

exports.proxy = function (params, callback) {
    test_pool.query(params, function (err, data, fields) {
        console.log("=============== service query callback ==========");
        console.log(data);
        let _result = null;
        if (err) {
            //数据库错误
            _result = res_format.response_sql_error({
                cmd: "proxy/proxy",
                result: {sign: false}
            });

            callback(_result);
        } else {
            if (Array.isArray(data) && data.length) {
                //proxy 老后台查询  todo 相关逻辑放到 service 层维护[暂时是测试页面所以可以先不管]
                var url = 'http://120.132.3.52:8088/uci-pre/unionpay/shop/getIndustryInfo.json';
                request({
                    uri: url,
                    method: "POST",
                    body: params,
                    json: true
                }, function (_err, _res, _resBody) {
                    console.log("=============== proxy ==========");
                    console.log(_err);
                    console.log("=============== proxy _resBody ==========");
                    console.log(_resBody);
                    console.log("=============== proxy _res ==========");
                    console.log(_res.body);

                    _result = res_format.response_format({
                        cmd: "proxy/proxy",
                        result: {
                            data_1: data,
                            data_2: _resBody
                        }
                    });
                    //
                    callback(_result);
                });

            } else {
                _result = res_format.response_without_result({
                    cmd: "proxy/proxy",
                    msg: "没有数据！",
                    result: {}
                });

                callback(_result);
            }
        }

    });
};

exports.proxy_prod = function (params, callback) {
    let _result = null;
    request({
        uri: params.url,
        method: params.type || "POST",
        body: params.data,
        json: true
    }, function (err, res, resBody) {
        console.log("=============== proxy ==========");
        console.log(err);
        console.log("=============== proxy _resBody ==========");
        console.log(resBody);
        console.log("=============== proxy _res ==========");
        console.log(res.body);

        if (err) {
            _result = res_format.response_without_result({
                cmd: "proxy/proxy_prod",
                result: resBody
            });
        } else {
            _result = res_format.response_format({
                cmd: "proxy/proxy_prod",
                result: resBody
            });
        }
        //
        callback(_result);
    });
}