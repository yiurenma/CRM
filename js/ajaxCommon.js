var vType = "web";
var vCode = 100;
var platform = "web";
var apiEntry = "https://platform.carelinker.com/clApi/entry";//生产环境api链接
// var apiEntry = "http://api.carelinker.com/clApi/entry";//本地和测试环境api链接
var token = 000;

function post(method, path, data, success) {
    data.platform = platform;
    data.method = method;
    data.path = path;
    data.sign = $.md5(method + path + $.md5(vType));
    data.vCode = vCode;
    data.vType = vType;
    data.token = token;
    console.log(data);
    $.post(apiEntry, data, function(data) {
        console.log(data);
        success(data);
    }, "json")
};

function ajaxWithoutAsync(method, path, data, success) {
    data.platform = platform;
    data.method = method;
    data.path = path;
    data.sign = $.md5(method + path + $.md5(vType));
    data.vCode = vCode;
    data.vType = vType;
    data.token = token;
    $.ajax({
        type: "post",
        url: apiEntry,
        cache: false,
        async: false, //同步请求
        dataType: "json",
        data: data,
        success: function(result) {
            success(result);
        }
    });
};

function getDataTableParams(d, method, path) {
    var dataTableParamJson = {};
    dataTableParamJson.vType = vType;
    dataTableParamJson.vCode = vCode;
    dataTableParamJson.platform = platform;
    dataTableParamJson.method = method;
    dataTableParamJson.path = path;
    dataTableParamJson.vType = vType;
    dataTableParamJson.sign = $.md5(method + path + $.md5(vType));
    dataTableParamJson.size = d.length;
    dataTableParamJson.cPage = d.start / d.length + 1;
    return dataTableParamJson;
};

function getDataTableNoServerPageParams(method, path) {
    var dataTableParamJson = {};
    dataTableParamJson.vType = vType;
    dataTableParamJson.vCode = vCode;
    dataTableParamJson.platform = platform;
    dataTableParamJson.method = method;
    dataTableParamJson.path = path;
    dataTableParamJson.vType = vType;
    dataTableParamJson.sign = $.md5(method + path + $.md5(vType));
    return dataTableParamJson;
};

function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return null; //返回参数值
};

function GetDateStr(times, AddDayCount) {
    var dd = new Date();
    dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
    var y = dd.getFullYear();
    var m = dd.getMonth() + 1; //获取当前月份的日期
    var d = dd.getDate();
    var h = dd.getHours();
    var mi = dd.getMinutes();
    if (times == 0) {
        // 返回没有具体时间的日期
        return y + "年" + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + "日";
    } else if (times == 1) {
        return y + "年" + (m < 10 ? "0" + m : m) + "月" + (d < 10 ? "0" + d : d) + "日" + " " + (h < 10 ? "0" + h : h) + ":" + (mi < 10 ? "0" + mi : mi);
    }
};

function getTime(time) {
    var str = time.toString();
    return str.replace(/[^0-9]/ig,"") + "000000";
}

function getDateAndTime(time) {
    var str = time.toString();
    return str.replace(/[^0-9]/ig,"");
}

function getDayLastTime(time) {
    var str = time.toString();
    return str.replace(/[^0-9]/ig,"") + "235959";
}

function getTimeByAddSeconds(time) {
    var str = time.toString();
    return str.replace(/[^0-9]/ig,"") + "00";
}

function getDate(time){
    var year = time.substring(0,4);
    var month = time.substring(4,6);
    var day = time.substring(6,8);

    return year + '年' + month + '月' + day + '日';
}

function getDateString(time,addDay){
    var year = time.substring(0,4);
    var month = time.substring(4,6);
    var day = time.substring(6,8);
    var hour = time.substring(8,10);
    var mm = time.substring(10,12);
    var ss = time.substring(12,14);

    var dd = new Date(year, month, day, hour, mm, ss);
    dd.setDate(dd.getDate() + addDay);

    var y = dd.getFullYear();
    var m = dd.getMonth(); //获取当前月份的日期
    var d = dd.getDate();
    var h = dd.getHours();
    var mi = dd.getMinutes();
    return y.toString() + (m < 10 ? "0" + m : m).toString()  + (d < 10 ? "0" + d : d).toString() + (h < 10 ? "0" + h : h).toString() + (mi < 10 ? "0" + mi : mi).toString() + "00";
}

$(document).ajaxStart(function(){
    $.LoadingOverlay("show",{
         // image : "images/loading3.gif",
         // maxSize : "1000px",
         // minSize : "500px"
    });
});

$(document).ajaxStop(function(){
    $.LoadingOverlay("hide");
});

//错误信息
var commonError = " 请发送以下错误信息到邮箱customer@carelinker.com："
var deleteError = "删除失败了!" + commonError;
var updateError = "更新失败了!" + commonError;
var addError    = "增加失败了!" + commonError;
var serverError = "服务器出问题啦！" + commonError;

