const root = new Vue({
    el: '#root',
    data: function () {
        return {
            title: 'root',
            careCompany: [],// ['威廉希尔', '立博', '澳门', '伟德','香港马会','皇冠','金宝博','明陞','利记'],//服务端配置了。减少接口数据请求！
            dateString: 20180421,//服务端控制了。减少接口数据请求！
            targetMap: {
                h: 'win',
                d: 'draw',
                a: 'lose'
            },
            eachFootballMatchBaiJiaTimer: null,
            eachFootballMatchBaiJiaIndex: 0,
            eachFootballMatchBaiJiaTime: 15,//15分钟(默认) 拉取 百家数据和胜平负数据
            getFootballMatchesTime: 1000 * 60 * 60,//60分钟 更新比赛数据
            footballs: [],//所有的 比赛原始 数据
            baiJiaJiangData: {}, //需要核对的 百家 数据
            shengpingfuData: {},//需要核对的 胜平负数据,
            targetFootball: {},
            baijiajiangajaxFlag: false,
        }
    },
    computed: {
        cptEachFootballMatchBaiJiaTime: function () {
            return 1000 * 60 * this.eachFootballMatchBaiJiaTime
        }
    },
    watch: {
        footballs: function (val, oval) {
            console.log('------cptTodayFootballs-----');
            console.log(oval);
            this.eachFootballMatchBaiJia();

        }
    },
    created() {
        this.getFootballMatches();
        //每隔 60分钟 更新 比赛信息！
        clearTimeout(setIntervalTimer);
        let setIntervalTimer = setInterval(() => {
            this.getFootballMatches();
        }, this.getFootballMatchesTime);
    },

    methods: {
        getFootballMatches: function () {
            let _this = this;
            personal.ajax({
                url: location.origin + "/jingcai/footballMatches",
                type: "post",
                data: {},
                callback: function (data, code, msg) {
                    console.log("=======jingcai/footballMatches=========" + code + "=============");
                    if (100 === code) {
                        _this.footballs = data.result;
                        console.log(_this.footballs)
                    }
                }
            });
        },
        changeEachFootballMatchBaiJiaTime: function () {
            console.log(this.cptEachFootballMatchBaiJiaTime);
            this.eachFootballMatchBaiJiaTimerFunc();
        },
        eachFootballMatchBaiJiaTimerFunc: function () {
            clearTimeout(this.eachFootballMatchBaiJiaTimer);
            //每隔 eachFootballMatchBaiJiaTime 分钟 更新数据
            this.eachFootballMatchBaiJiaTimer = setTimeout(() => {
                console.log(this.cptEachFootballMatchBaiJiaTime);
                this.eachFootballMatchBaiJia();
            }, this.cptEachFootballMatchBaiJiaTime);
        },
        eachFootballMatchBaiJia: function () {
            this.footballs.forEach((item, index) => {
                this.baijiajiang(item);
                this.shengpingfu(item);

                // this.eachFootballMatchBaiJiaIndex=index; //可以通过watch 监听
                if (index + 1 === this.footballs.length) {
                    this.eachFootballMatchBaiJiaTimerFunc();
                }
            });
        },
        baijiajiang: function (params) {
            let _mid = params.mid || params.id;
            let _this = this;
            personal.ajax({
                url: location.origin + "/jingcai/bjj",
                type: "post",
                data: {
                    mid: _mid
                },
                callback: function (data, code, msg) {
                    // console.log("=======jingcai/sporttery=======" + code + "=========");
                    if (100 === code) {
                        // let _result = data.result;
                        // if (_this.careCompany.length) {
                        //     //关心的数据
                        //     _this.baiJiaJiangData[_mid] = _result.filter(item => _this.careCompany.indexOf(item.cn) > -1);
                        // } else {
                        //     _this.baiJiaJiangData[_mid] = _result;
                        // }

                        // _this.baiJiaJiangData[_mid] = _result;
                        _this.$set(_this.baiJiaJiangData, _mid, data.result);
                        _this.setTargetFootball(params);
                    }
                }
            })
        },
        shengpingfu: function (params) {
            let _mid = params.mid || params.id;
            let _this = this;
            personal.ajax({
                url: location.origin + "/jingcai/spf",
                type: "post",
                data: {
                    mid: _mid
                },
                callback: function (data, code, msg) {
                    console.log("=======jingcai/sporttery=======" + code + "=========");
                    if (100 === code) {
                        let _result = data.result && data.result.result;
                        // _this.shengpingfuData[_mid] = _result;

                        //关心的数据 对象
                        if (_result.had) {
                            let _latestData = _result.had.list[_result.had.list.length - 1];
                            // console.log(_result.had.list);
                            // console.log(_latestData);

                            // _this.shengpingfuData[_mid]._had = _latestData;
                            // _this.shengpingfuData[_mid].hadMinTatget = _this.minTatget(_latestData);
                            // console.log(_this.shengpingfuData[_mid].hadMinTatget);

                            _this.$set(_this.shengpingfuData, _mid, {
                                _had: _latestData,
                                hadMinTarget: _this.minTatget(_latestData)
                            });
                            _this.setTargetFootball(params);
                        } else {
                            console.log(_mid + JSON.stringify(_result));
                        }
                    }
                }
            })
        },
        setTargetFootball: function (params) {
            let mid = params.mid || params.id;
            console.log(mid);

            if (!this.targetFootball[mid] && this.shengpingfuData[mid] && this.baiJiaJiangData[mid]) {
                //
                let _hadMinTarget = this.shengpingfuData[mid].hadMinTarget;
                if (!_hadMinTarget) {
                    console.log(mid + JSON.stringify(this.shengpingfuData[mid]));
                    // return; //么有标的值
                }
                let _companys = this.baiJiaJiangData[mid].filter(item => {
                    return item[_hadMinTarget.target] < _hadMinTarget.val;
                });
                if (_companys.length) {
                    this.$set(this.targetFootball, mid, {
                        had: this.baiJiaJiangData[mid],
                        company: _companys,
                        foot: params
                    })
                }
            }

        },
        minArray: function (arr) {
            return Math.min(...arr);
        },
        // h\d\a 胜平负
        minTatget: function (had) {
            return [
                {target: this.targetMap.h, _target: 'h', val: had.h},
                {target: this.targetMap.d, _target: 'd', val: had.d},
                {target: this.targetMap.a, _target: 'a', val: had.a}
            ].sort((a, b) => a.val - b.val)[0];
        }
    }

});


