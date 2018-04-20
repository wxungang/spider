/**
 * Created by xiaogang on 2017/4/4.
 */
"use strict";
// var logger = require('../log/logger_info');

module.exports = function (app) {
  app.get('/', function (req, res, next) {
    res.send('Hello node-express World!');
    next();
  });

  // 具体的业务请求路由配置
  // app.use('/', require('./zling'));

  // 具体的业务请求路由配置
  app.use('/jingcai', require('./jingcai'));




  // 404 page
  app.use(function (req, res) {
    // logger.logger_info.log("404");
    if (!res.headersSent) {
      res.status(404);
      res.status(404).render('../view/404');
    }
  });
};
