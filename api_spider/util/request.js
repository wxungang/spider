const request = require('request');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

exports.test = (url, params) => {
    request({
        uri: url,
        method: "get",
        gzip: true,
        encoding: null
    }, function (_err, _res, _resBody) {
        console.log("=============== proxy ==========");
        console.log(_err);
        console.log("=============== proxy _resBody ==========");
        //console.log(iconv.decode(_resBody, 'gb2312'));
        console.log("=============== proxy _res ==========");
        // console.log(_res.body);
//返回的body 直接就是buffer 了...

        const $ = cheerio.load(iconv.decode(_resBody, 'gb2312'));
        console.log($('#dataList').html());

    });

    request({
        uri: 'http://info.sporttery.cn/football/info/fb_match_hhad.php?m=106925',
        method: "get",
        gzip: true,
        encoding: null
    }, function (_err, _res, _resBody) {
        console.log("=============== proxy 3==========");
        console.log(_err);
        console.log("=============== proxy _resBody 3 ==========");
        // console.log(iconv.decode(_resBody, 'gb2312'));
        console.log("=============== proxy _res 3 ==========");
        // console.log(_resBody);
//返回的body 直接就是buffer 了...

        const $ = cheerio.load(iconv.decode(_resBody, 'gb2312'));
        console.log($('#bj_table').html());

    });
}