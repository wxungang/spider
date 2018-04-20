/**
 * Created by xiaogang on 2017/4/6.
 */
"use strict";
var config = require('config-lite');
//
const validate = require('./validate');
/**
 *
 * @param value
 * @returns {boolean}
 */
exports.isFunction = function (value) {
    return typeof(value) == "function";
};
/**
 * 将静态 服务端资源的相对路径 转换为 可以直接访问的绝对 路径
 * @param relativePath
 * @returns {string}
 */
exports.absolutePath = function (relativePath) {
    console.log(relativePath);
    return config.origin + relativePath.replace(/\\/ig, "/").replace(/^\/?public/i, config.publicPath);
};

/**
 * 校验表单
 * @param params
 * @returns {*}
 */
exports.validateForm = function (params) {
    let _invalidMsg = '';
    for (let key in params) {
        _invalidMsg = validate[key](params[key]);
        if (_invalidMsg) {
            return _invalidMsg;
        }
    }
    return _invalidMsg;
};