footballMatches();

const FOOTBALLDATA = {
    day: 0,//当天 1 今明两天
    data: {}
};

function footballMatches() {
    personal.ajax({
        url: location.origin + "/jingcai/footballMatches",
        type: "post",
        data: {},
        callback: function (data, code, msg) {
            console.log("=======jingcai/footballMatches=========" + code + "=============");
            console.log(data);
            if (100 === code) {
                _setFOOTBALLDATA(data.result);
            } else {

            }
        }
    });

    function _setFOOTBALLDATA(data) {
        let _FOOTBALLDATA=data.data;
            //
            if(FOOTBALLDATA.day===0){
        }
    }
}
