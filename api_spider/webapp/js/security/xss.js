/**
 * Created by xiaogang on 2017/6/5.
 */
"use strict";

// 用户数据 转化为文本处理
var queryObj = personal.urlQuery2Obj();
console.log(queryObj.x);
$("h3").html(queryObj.x).text(queryObj.x);