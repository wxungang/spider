# spider


## 目录
> dom_spider 直出型页面的爬取。没有接口信息；必须直接爬取页面dom,进行dom信息提取！

## todo
- 乱码问题 const iconv = require('iconv-lite');
- 动态加载问题：
> phantomjs 借助浏览器加载网页内容

> 或者分析网页的动态接口。（部分老页面不知道怎么处理的没有接口；但数据又是异步加载的）


- 直接引入 vue.js。不要使用es6的箭头函数！