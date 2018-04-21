const root = new Vue({
    el: '#root',
    data: function () {
        return {
            title: 'root',
            careCompany: ['威廉希尔', '立博', '澳门', '伟德', '香港马会', '皇冠', '金宝博', '明陞', '利记'],// ['威廉希尔', '立博', '澳门', '伟德','香港马会','皇冠','金宝博','明陞','利记'],
            dateString: 20180421,
            targetMap: {
                h: 'win',
                d: 'draw',
                a: 'lose'
            },
            footballs: {},//所有的 比赛原始 数据
            baiJiaJiangData: {}, //需要核对的 百家 数据
            shengpingfuData: {},//需要核对的 胜平负数据,
            targetFootball: {},
            baijiajiangajaxFlag: false,
        }
    },
    computed: {
        /**
         * [key]
         * @returns {any[]}
         */
        cptFootballKeys: function () {
            return Object.keys(this.footballs); //Object.keys 没法触发 计算属性！
            // let _cptFootballKeys = [];
            // for (let key in this.footballs) {
            //     if (this.footballs[key].b_date.replace(/-/g, '') == this.dateString) {
            //         console.log(key);
            //         _cptFootballKeys.push(key.replace(/_/g, ''));
            //     }
            // }
            //
            // return _cptFootballKeys;
        },
        cptTargetFootball: function () {
            return Object.values(this.footballs).filter(item => item.b_date && item.b_date.replace(/-/g, '') == this.dateString);
        },
        /**
         * [{TodayFootball}]
         * @returns {any[]}
         */
        cptTodayFootball: function () {
            return Object.values(this.footballs).filter(item => item.b_date && item.b_date.replace(/-/g, '') == this.dateString);
        },
        /**
         * TodayFootballHad  胜平负数据
         * h\d\a 胜平负
         */
        cptTodayFootballHad: function () {
            // return this.cptTodayFootball.map((item, index) => {
            //     let _item = {id: item.id, company: []};
            //     //有胜平负数据则更新 到 覆盖 cptTodayFootball 数据
            //     let _shengpingfuDataItem = this.shengpingfuData[item.id];
            //     if (_shengpingfuDataItem && _shengpingfuDataItem.had && _shengpingfuDataItem.had.list) {
            //         _item.newHad = _shengpingfuDataItem.had.list.pop();
            //     }
            //     _item.hadMinTatget = this.minTatget(_item.newHad || item.had);
            //     return _item;
            // });
        },
        /**
         * baijiajiang 核对
         * 初始胜平负 :  win_s  \  draw_s  \   lose_s
         * 及时胜平负 ： win 、draw \lose
         */
        cptTodayFootballTarget: function () {
            // return this.cptTodayFootballHad.filter(item => {
            //     if (this.baiJiaJiangData[item.id]) {
            //         item.company = this.baiJiaJiangData[item.id].filter((_item, _index) => {
            //             //_item 具体公司
            //             if (_index < 4) {//部分公司数据
            //                 //目标 公司 （小）
            //                 console.log(_item[item.hadMinTatget.target]);
            //                 return _item[item.hadMinTatget.target] > item.hadMinTatget.val;
            //             }
            //             return false
            //         });
            //     }
            //     return false;
            // });
        }
    },
    watch: {
        cptTodayFootball: function (val, oval) {
            console.log('------cptTodayFootballs-----');
            console.log(oval);
            this.eachFootballMatchBaiJia();

        }
    },
    created() {
        this.getFootballMatches();
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
                        _this.footballs = data.result.data;
                        console.log(_this.footballs)
                        // _setFOOTBALLDATA(data.result);
                    }
                }
            });

            function _setFOOTBALLDATA(data) {
                let _dateString = (new Date()).Format("yyyyMMdd");
                let _FOOTBALLDATA = data.data;

                //
                FOOTBALLDATA.data = Object.values(data.data).filter(item => item.b_date.replace(/-/g, '') === _dateString);

                console.log(FOOTBALLDATA);

            }
        },
        eachFootballMatchBaiJia: function () {
            this.cptTodayFootball.forEach((item, index) => {
                if (!index) {
                    console.log(item)
                }
                if (1) {
                    this.baijiajiang(item);
                    this.shengpingfu(item);
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
                    console.log("=======jingcai/sporttery=======" + code + "=========");
                    if (100 === code) {
                        let _result = data.result && data.result.result.data;
                        if (_this.careCompany.length) {
                            //关心的数据
                            _this.baiJiaJiangData[_mid] = _result.filter(item => _this.careCompany.indexOf(item.cn) > -1);
                        } else {
                            _this.baiJiaJiangData[_mid] = _result;
                        }

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
                        _this.shengpingfuData[_mid] = _result;

                        //关心的数据 对象
                        let _latestData = _result.had.list[_result.had.list.length - 1];
                        // console.log(_result.had.list);
                        // console.log(_latestData);

                        _this.shengpingfuData[_mid]._had = _latestData;
                        _this.shengpingfuData[_mid].hadMinTatget = _this.minTatget(_latestData);
                        // console.log(_this.shengpingfuData[_mid].hadMinTatget);
                        _this.setTargetFootball(params);
                    }
                }
            })
        },
        setTargetFootball: function (params) {
            let mid = params.mid || params.id;
            console.log(mid);
            if (!this.targetFootball[mid] && this.shengpingfuData[mid] && this.baiJiaJiangData[mid]) {
                //
                let _hadMinTatget = this.shengpingfuData[mid].hadMinTatget;
                let _companys = this.baiJiaJiangData[mid].filter(item => {
                    return item[_hadMinTatget.target] < _hadMinTatget.val;
                });
                if (_companys.length) {
                    this.$set(this.targetFootball, mid, {
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


