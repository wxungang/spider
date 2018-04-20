/**
 * 处理 请求返回参数的格式化
 * Created by xiaogang on 2017/4/5.
 * code:
 * 10000:成功
 * 100xx:成功但没有相关记录[这个到底要不要算成功呢??] todo
 * 101xx:入参相关
 * 102xx:查询数据库相关
 */
"use strict";

//default response
// {
//     cmd:"/uci-pre/unionpay/shop/getIndustryInfo.json"
//     msg:"invoke succes"
//     result:Object || Array
//     code:10000
//     v:"1.0"
// }
function response() {

}

/**
 * 请求成功的格式化返回
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_format = function (params) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "success",
        result: params.result || {},
        code: 10000,//统一code
        v: "1.0.0"
    };
};
/**
 * 入参和查询都没有问题，只是没有相关记录
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_without_result = function (params) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "no result",
        result: params.result || {},
        code: 10001,//统一code
        v: "1.0.0"
    };
};
/**
 * 请求的入参缺失 格式化返回
 * @param params
 * @returns {{cmd: string, msg: string, params: (Object|Array), code: number, v: string}}
 */
exports.response_without_request = function (params = {}) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "请求的入参缺失!",
        result: params.result || {},
        code: 10101,//统一code
        v: "1.0.0"
    };
};
/**
 * 请求的入参不符合要求 格式化返回
 * @param params
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_error_request = function (params) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "请求的入参格式不对!",
        result: params.result || {},
        code: 10102,//统一code
        v: "1.0.0"
    };
};

/**
 * 数据库未知错误 格式化返回
 * @param params
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_sql_error = function (params) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "数据库挂了!",
        result: params.result || {},
        code: 10201,//统一code
        v: "1.0.0"
    };
};

/**
 * 数据库插入违反唯一性约束 格式化返回
 * @param params
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_sql_unique = function (params) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "记录已存在，不容许重复!",
        result: params.result || {},
        code: 10202,//统一code
        v: "1.0.0"
    };
};
/**
 * 用户未登录
 * @param params
 * @returns {{cmd: string, msg: string, result: {}, code: number, v: string}}
 */
exports.response_user_none = function (params = {}) {
    return {
        cmd: params.cmd || "",
        msg: params.msg || "用户未登录！",
        result: params.result || {},
        code: 10301,//统一code
        v: "1.0.0"
    };
}