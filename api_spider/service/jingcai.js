/**
 * Created by xiaogang on 2017/4/6.
 */
"use strict";


// var md5 = require('md5');
//mysql
// var user_pool = require("../mysql/mysql_pool_user");

const request = require('request');
//util
const res_format = require("../util/response_format");
const util = require("../util/util");
/**
 * 用户注册
 * @param params
 * @param callback
 */
exports.sporttery = function (params) {
    return new Promise((resolve, reject) => {
        request({
            uri: 'http://i.sporttery.cn/api/fb_match_info/get_europe/?f_callback=hb_odds&dc_mid=616474',
            method: "get",
            gzip: true,
            // encoding: null
        }, function (err, res, resBody) {
            if (err) {
                reject(err);
            } else {
                try {
                    let _body = (resBody || res.body).replace(/.*?\(/g, '').replace(/\).*/g, '');
                    // console.log(JSON.parse(_body));
                    resolve(JSON.parse(_body));
                } catch (e) {
                    console.log(e);
                    resolve(resBody || res.body);
                }

            }
            console.log(err);
            // console.log("=============== proxy _resBody 3 ==========");
            // console.log(iconv.decode(_resBody, 'gb2312'));
            // console.log("=============== proxy _res 3 ==========");
            // console.log(res);
            // console.log(resBody);
            //返回的body 直接就是buffer 了...

            // const $ = cheerio.load(iconv.decode(_resBody, 'gb2312'));
            // console.log($('#bj_table').html());

        });

    });

};
