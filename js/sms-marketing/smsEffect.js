var smsMarketingSmsEffect = {

    startTime: "",
    endTime: "",
    mainStoreId: "", //总店ID
    //与表格有关的参数
    smsMarketingSmsEffectTable: "",
    smsMarketingSmsEffectApiParams: "",
    smsMarketingSmsEffectTableColumns: [{
        "data": "name",
        "title": "活动名称",
    }, {
        "data": "smsSendTime",
        "title": "发送时间",
    }, {
        "data": "employeeRealName",
        "title": "创建人",
    }, {
        "data": "smsContent",
        "title": "短信内容",
    }, {
        "data": "memberCount",
        "title": "目标会员数",
    }, {
        "data": "sendStatus",
        "title": "发送状态",
    }, {
        "data": null,
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            if($.trim("发送完成") == $.trim(rowData.sendStatus)){
                $(td).html("<a class='smsReport' href='SmsMarketingEffect.html?marketingId=" + rowData.id + "&startTime="+ getTimeByAddSeconds(rowData.smsSendTime) +"'>分析报告</a>");
            }else{
                $(td).html("");
            }
        },
    }],

    //短信营销效果统计页面进行初始化
    init: function() {
        //初始化表格
        var smsMarketingSmsEffectDraw; //datatables服务器分页必传参数
        smsMarketingSmsEffect.smsMarketingSmsEffectTable = $('#smsMarketingSmsEffectTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "ftlp",
            "serverSide": true, //开启datatables的服务器模式
            "scrollX":true,
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    smsMarketingSmsEffectDraw = d.draw;
                    return smsMarketingSmsEffect.prepareApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(smsMarketingSmsEffect.getDataFromServer(data, smsMarketingSmsEffectDraw));
                }
            },
            "columns": smsMarketingSmsEffect.smsMarketingSmsEffectTableColumns,
            "oLanguage": { //国际语言转化
                "sLengthMenu": "每页显示数量 _MENU_ ",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sSearch": '',
                "sEmptyTable": "未有相关数据",
                "sLoadingRecords": "努力加载中...",
                "oPaginate": {
                    "sPrevious": "<img src='images/ic_left.png'>",
                    "sNext": "<img src='images/ic_right.png'>"
                }
            }
        });

        $(".input-sm").attr("placeholder", "请输入活动名称");
    },

    //准备访问API的相关参数
    prepareApiParams: function(d) {
        if ($(".input-sm").val()) { //查询逻辑
            smsMarketingSmsEffect.smsMarketingSmsEffectApiParams = {
                "mStId": smsMarketingSmsEffect.mainStoreId,
                "marketingName": $(".input-sm").val(), //查询内容          
            };
            return $.extend(smsMarketingSmsEffect.smsMarketingSmsEffectApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/records/search/table/datas"));
        } else {
            smsMarketingSmsEffect.smsMarketingSmsEffectApiParams = {
                "mStId": smsMarketingSmsEffect.mainStoreId,
            };
            return $.extend(smsMarketingSmsEffect.smsMarketingSmsEffectApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/records/table/datas"));
        }
    },

    //处理访问API之后得到的数据集
    getDataFromServer: function(data, draw) {
        var result = {};
        result.draw = draw;
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
    smsMarketingSmsEffect.mainStoreId = $.cookie("mainStoreId");
    //短信营销效果统计界面
    smsMarketingSmsEffect.init();
});