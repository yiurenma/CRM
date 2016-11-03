var billingCenter = {
    mainStoreId: "",
    startDate: "",
    endDate: "",
    dateType: "",
    //账单中心表单
    billingCenterTable: "",
    billingCenterApiParams: "",
    billingCenterTableColumns: [{
        "data": "date",
        "title": "日期",
    }, {
        "data": "minuteCount",
        "title": "通话总时长",
    }, {
        "data": "smsCount",
        "title": "发送短信数量",
    }],

    init: function() {

        moment.locale("zh-cn");
        //初始化默认时间
        var start = moment().subtract(30, 'days').format("LL"); //YYYY年MM月DD日
        var end = moment().format("LL"); //YYYY年MM月DD日
        billingCenter.endDate = moment(end,"LL").format("YYYYMMDD") + "235959"; //YYYYMMDDHHMMSS
        billingCenter.startDate = moment(start,"LL").format("YYYYMMDD") + "000000"; //YYYYMMDDHHMMSS
        billingCenter.dateType = "DAY";

        billingCenter.smsAndPhoneLeftAjax();
        billingCenter.smsAndPhoneDetailAjax();

        //初始化电话营销时间插件
        $('#dateRange').daterangepicker({
                locale: {
                    "format": "YYYY年MM月DD日",
                    "applyLabel": "确认",
                    "cancelLabel": "取消",
                },
                startDate: start,
                endDate: end,
            },
            function(start, end, label) {
                billingCenter.endDate = end.format("YYYYMMDD") + "235959";
                billingCenter.startDate = start.format("YYYYMMDD") + "000000";
                billingCenter.smsAndPhoneDetailAjax();
            });

        //电话营销时间按钮
        $("#mergeTime .btn").click(function() {
            var mergeTime = $(this).text().trim();
            if (mergeTime == "日") {
                billingCenter.dateType = "DAY";
            } else if (mergeTime == "月") {
                billingCenter.dateType = "MONTH";
            }
            billingCenter.smsAndPhoneDetailAjax();
        });
    },

    //账单和电话剩余Ajax访问
    smsAndPhoneLeftAjax: function() {

        var success = function(result) {
            var balance = result.data;
            $("#smsLeft").text(balance.smsLeft);
            $("#smsUsed").text("当月已成功发送" + balance.smsUsed + "条");
            $("#phoneLeft").text(balance.callMinuteLeft);
            $("#phoneUsed").text("当月已通话" + balance.callMinuteUsed + "分钟");
        };

        var data = {
            "mStId": billingCenter.mainStoreId
        };
        post("get", "/clCommunication/api/balance", data, success);
    },

    smsAndPhoneDetailAjax: function() {
        //初始化账单中心表格
        $('#billingCenter').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "destroy": true,
            "lengthMenu": [5, 10, 15],
            "order": [[0, "desc"]],
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function() { //d代表default，即在默认分页参数
                    return billingCenter.prepareApiParams();
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(billingCenter.apiDataFromServer(data));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": billingCenter.billingCenterTableColumns,
            "oLanguage": { //国际语言转化
                "sLengthMenu": "每页显示数量 _MENU_ ",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sSearch": '',
                "sLoadingRecords": "努力加载中...",
                "sEmptyTable": "未有相关数据",
                "oPaginate": {
                    "sPrevious": "<img src='images/ic_left.png'>",
                    "sNext": "<img src='images/ic_right.png'>"
                }
            }
        });
    },

    //准备访问API的相关参数
    prepareApiParams: function() {

        billingCenter.billingCenterApiParams = {
            "mStId": billingCenter.mainStoreId,
            "bDateT": billingCenter.startDate,
            "eDateT": billingCenter.endDate,
            "dateType": billingCenter.dateType
        };
        return $.extend(billingCenter.billingCenterApiParams, getDataTableNoServerPageParams("get", "/clCommunication/api/balance/records/table/datas"));
    },

    //处理访问API之后得到的数据集
    apiDataFromServer: function(data) {
        var result = {};
        if (data.page) {
            result.recordsTotal = data.page.totalCount;
            result.recordsFiltered = data.page.totalCount;
            result.data = data.dataList;
        } else if (data.error == 200) {
            result.recordsTotal = data.dataList.length;
            result.recordsFiltered = data.dataList.length;
            result.data = data.dataList;
        } else {
            result.recordsTotal = 0;
            result.recordsFiltered = 0;
            result.data = "";
            alert(serverError + JSON.stringify(data));
        }
        return result;
    },

};

$(function() {
    billingCenter.mainStoreId = $.cookie("mainStoreId");
    billingCenter.init();
});