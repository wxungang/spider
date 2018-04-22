/**
 * Created by xiaogang on 2017/4/6.
 */
"use strict";


// var md5 = require('md5');
//mysql
// var user_pool = require("../mysql/mysql_pool_user");

const iconv = require('iconv-lite');
const cheerio = require('cheerio');
const request = require('request');
//util
const res_format = require("../util/response_format");
const util = require("../util/util");
/**
 *  http://info.sporttery.cn/football/info/fb_match_hhad.php?m=106925
 *  竞猜通用 请求
 * @param params
 * @param callback
 */
exports.sporttery = function (params) {
    return new Promise((resolve, reject) => {
        if (!params.url) {
            reject(params);
        }
        request({
            uri: params.url,//'http://i.sporttery.cn/api/fb_match_info/get_europe/?f_callback=hb_odds&dc_mid=616474',
            method: params.method || "get",
            gzip: true,
            // encoding: null
        }, function (err, res, resBody) {
            if (err) {
                console.log(err);
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
        });

    });

};
/**
 * dom 中爬取 相关 数据
 * @param params
 * @returns {Promise}
 */
exports.sportPage = function (params) {
    return new Promise((resolve, reject) => {
        request({
            uri: params.url,
            method: "get",
            gzip: true,
            encoding: null
        }, function (err, res, resBody) {
            if (err) {
                reject(err);
            } else {
                //返回的body 直接就是buffer 了...
                const $ = cheerio.load(iconv.decode(resBody || res.body, 'gb2312'));
                console.log($('#Top').html());
                resolve($('#Top').html());
            }
            console.log(err);

        });

    });

};