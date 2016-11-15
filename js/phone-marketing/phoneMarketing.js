var phoneMarketing = {
    activityTime:"",
    nowTime: "",
    startTime: "",
    endTime: "",
    marketingId: "",
    mainStoreId: "",
    taskName: "",

    //表格相关数据
    //效果分析趋势数据
    effectAnalysisData:"",
    effectAnalysisDataColumns:[{
        "data": "createDate",
        "title": "日期",
    }, {
        "data": "memberCount",
        "title": "复购会员数",
    }, {
        "data": "totalMoney",
        "title": "复购金额",
    }, {
        "data": "totalCount",
        "title": "复购总次数",
    }, {
        "data": "goodsCount",
        "title": "复购商品数",
    }, {
        "data": "unitPrice",
        "title": "客单价",
    }],

    //执行情况
    operationPerfromanceApiParams: "",
    operationPerformanceColumns: [{
        "data": "branchStoreName",
        "title": "门店",
    }, {
        "data": "memberCount",
        "title": "会员数",
    }, {
        "data": "calledAndTotal",
        "title": "拨打/总数",
    }, {
        "data": "callSuccessAndTotal",
        "title": "接通/总数",
    }],
    //会员情况
    memberPerformanceApiParams: "",
    memberPerformanceColumns: [{
        "data": "patientName",
        "title": "会员姓名",
    }, {
        "data": "branchStoreName",
        "title": "门店",
    }, {
        "data": "userName",
        "title": "会员联系方式",
    }, {
        "data": "callCount",
        "title": "拨打次数",
    }, {
        "data": "answered",
        "title": "结果",
    }],
    //会员数据
    memberDataApiParams: "",
    memberDataColumns: [{
        "data": "userName",
        "title": "会员联系方式",
    }, {
        "data": "patientName",
        "title": "会员姓名",
    }, {
        "data": "totalMoney",
        "title": "复购金额",
    }, {
        "data": "totalCount",
        "title": "复购总次数",
    }, {
        "data": "goodsCount",
        "title": "复购商品数",
    }, {
        "data": "unitPrice",
        "title": "客单价",
    }, {
        "data": "storeName",
        "title": "复购所在门店",
    }],
    //门店数据
    storeDataApiParams: "",
    storeDataColumns: [{
        "data": "storeName",
        "title": "门店",
    }, {
        "data": "memberCount",
        "title": "复购会员数",
    }, {
        "data": "totalMoney",
        "title": "复购金额",
    }, {
        "data": "totalCount",
        "title": "复购总次数",
    }, {
        "data": "goodsCount",
        "title": "复购商品数",
    }],

    init: function() {

        $(".taskName").text(phoneMarketing.taskName);
        //数据概览
        dataOverview(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId);
        //效果分析
        effectAnalysis(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId, phoneMarketing.mainStoreId);
        //执行情况
        phoneMarketing.operationPerformnceAjax();
        //会员情况
        phoneMarketing.memberPerformanceAjax();
        //会员数据
        phoneMarketing.storeDataAjax();
        //门店数据
        phoneMarketing.memberDataAjax();

        //初始化效果汇总和会员明细时间插件
        moment.locale("zh-cn");//daterangepicker插件汉语版本
        var now = getDate(phoneMarketing.nowTime);        
        var start = getDate(phoneMarketing.startTime);
        var end = getDate(phoneMarketing.endTime);

        var maxDate = getDateString(phoneMarketing.startTime,60);
        if(maxDate > now){
           maxDate = now;
        }
        $('#effectDateRange').daterangepicker({
                locale: {
                    format: 'YYYY年MM月DD日'
                },
                startDate: start,
                endDate: end,
                minDate: start,
                maxDate: maxDate,
            },
            function(start, end, label) {
                phoneMarketing.startTime = getTime(start.format("YYYYMMDD"));
                phoneMarketing.endTime = getDayLastTime(end.format("YYYYMMDD"));
                //数据概览
                dataOverview(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId);
                //效果分析
                effectAnalysis(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId, phoneMarketing.mainStoreId);
            });
        $('#memberDetailDateRange').daterangepicker({
                locale: {
                    format: 'YYYY年MM月DD日'
                },
                startDate: start,
                endDate: end,
                minDate: start,
                maxDate: maxDate,
            },
            function(start, end, label) {
                phoneMarketing.startTime = getTime(start.format("YYYYMMDD"));
                phoneMarketing.endTime = getDayLastTime(end.format("YYYYMMDD"));
                phoneMarketing.memberDataAjax();
                phoneMarketing.storeDataAjax();
            });

        //效果汇总时间按钮
        $("#effectMergeTime .btn").click(function() {
            var mergeTime = $(this).val();
            $("#effectTime").html(mergeTime+' <b class="arrow_down"></b>');
            if (mergeTime == "近5天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(5,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近7天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(7,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近15天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(15,"days").format("YYYYMMDDHHmmss");
            }
            if(phoneMarketing.nowTime < phoneMarketing.endTime){
                phoneMarketing.endTime = phoneMarketing.nowTime;
            }
            $("#effectDateRange").data("daterangepicker").setStartDate(moment(phoneMarketing.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            $("#effectDateRange").data("daterangepicker").setEndDate(moment(phoneMarketing.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));

            $('input[name="effectDateRange"]').val(moment(phoneMarketing.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日") + " - " + moment(phoneMarketing.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            dataOverview(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId);
            effectAnalysis(phoneMarketing.startTime, phoneMarketing.endTime, phoneMarketing.marketingId, phoneMarketing.mainStoreId);
        });

        //会员明细时间按钮
        $("#memberDetailMergeTime .btn").click(function() {
            var mergeTime = $(this).val();
            $("#detailTime").html(mergeTime + ' <b class="arrow_down"></b>');
            if (mergeTime == "近5天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(5,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近7天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(7,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近15天") {
                phoneMarketing.startTime = phoneMarketing.activityTime;
                phoneMarketing.endTime = moment(phoneMarketing.activityTime, "YYYYMMDDHHmmss").add(15,"days").format("YYYYMMDDHHmmss");
            }
            if(phoneMarketing.nowTime < phoneMarketing.endTime){
                phoneMarketing.endTime = phoneMarketing.nowTime;
            }
            $("#memberDetailDateRange").data("daterangepicker").setStartDate(moment(phoneMarketing.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            $("#memberDetailDateRange").data("daterangepicker").setEndDate(moment(phoneMarketing.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));

            $('input[name="memberDetailDateRange"]').val(moment(phoneMarketing.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日") + " - " + moment(phoneMarketing.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            phoneMarketing.memberDataAjax();
            phoneMarketing.storeDataAjax();
        });
    },


    //效果分析趋势
    effectAnalysisDataTable: function() {
        $("#effectAnalysisTable").DataTable({
            //以下是对表格获得数据的设置
            "dom": "t",
            "destroy":true,
            "ordering": false, //禁止排序
            "data":phoneMarketing.effectAnalysisData.length == 0 ? "" : phoneMarketing.effectAnalysisData,
            "columns": phoneMarketing.effectAnalysisDataColumns,
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
    },

    //执行情况
    operationPerformnceAjax: function(){
        var operationPerformanceDraw; //datatables服务器分页必传参数
        $('#phoneMarketingOperationPerformance').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    operationPerformanceDraw = d.draw;
                    return phoneMarketing.prepareOperationPerformanceApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketing.apiDataFromServer(data, operationPerformanceDraw));
                }
            },
            "columns": phoneMarketing.operationPerformanceColumns,
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
    },

    //会员情况
    memberPerformanceAjax: function(){
        var memberPerformanceDraw; //datatables服务器分页必传参数
        $('#phoneMarketingMemberPerformance').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    memberPerformanceDraw = d.draw;
                    return phoneMarketing.prepareMemberPerformanceApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketing.apiDataFromServer(data, memberPerformanceDraw));
                }
            },
            "columns": phoneMarketing.memberPerformanceColumns,
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
    },

    //会员数据
    memberDataAjax: function(){
        var memberDataDraw; //datatables服务器分页必传参数
        $('#phoneMarketingMemberData').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "destroy": true,
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    memberDataDraw = d.draw;
                    return phoneMarketing.prepareMemberDataApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketing.apiDataFromServer(data, memberDataDraw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": phoneMarketing.memberDataColumns,
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
    },

    //门店数据
    storeDataAjax: function(){
        var storeDataDraw; //datatables服务器分页必传参数
        $('#phoneMarketingStoreData').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "destroy": true,
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    storeDataDraw = d.draw;
                    return phoneMarketing.prepareStoreDataApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketing.apiDataFromServer(data, storeDataDraw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": phoneMarketing.storeDataColumns,
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

    },

    //执行情况：准备访问API的相关参数
    prepareOperationPerformanceApiParams: function(d) {
        phoneMarketing.operationPerfromanceApiParams = {
            "marketingId": phoneMarketing.marketingId
        };
        return $.extend(phoneMarketing.operationPerfromanceApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/stat/stores/table/datas"));
    },

    //会员情况：准备访问API的相关参数
    prepareMemberPerformanceApiParams: function(d) {
        phoneMarketing.memberPerformanceApiParams = {
            "marketingId": phoneMarketing.marketingId
        };
        return $.extend(phoneMarketing.memberPerformanceApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/stat/members/table/datas"));
    },

    //会员数据：准备访问API的相关参数
    prepareMemberDataApiParams: function(d) {
        phoneMarketing.memberDataApiParams = {
            "marketingId": phoneMarketing.marketingId,
            "mStId": phoneMarketing.mainStoreId,
            "bDateT": phoneMarketing.startTime,
            "eDateT": phoneMarketing.endTime
        };
        return $.extend(phoneMarketing.memberDataApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/effect/byMember/table/datas"));
    },

    //门店数据：准备访问API的相关参数
    prepareStoreDataApiParams: function(d) {
        phoneMarketing.storeDataApiParams = {
            "marketingId": phoneMarketing.marketingId,
            "mStId": phoneMarketing.mainStoreId,
            "bDateT": phoneMarketing.startTime,
            "eDateT": phoneMarketing.endTime
        };
        return $.extend(phoneMarketing.storeDataApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/effect/byStore/table/datas"));
    },

    //处理访问API之后得到的数据集
    apiDataFromServer: function(data, draw) {
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

/*tab 切换*/
$(".messageTabs a").each(function(index) {
    var $listNode = $(this);
    $listNode.click(function() {
        $(".messageTabs a").children().attr("class","mm_nav_icon");
        $(".effectTabs").addClass('hideBox');
        $(".effectTabs").eq(index).removeClass('hideBox');
        $(".m_slide_block").siblings().addClass('hideBox');
        $(".m_slide_block").eq(index).removeClass('hideBox');
        $listNode.siblings().removeClass('tabChecked');
        $listNode.addClass('tabChecked');
        $(".messageTabs a").children('span').not(".count_icon").siblings().removeClass().addClass('mm_nav_icon');
        $listNode.children().addClass('click_' + index);
    })
});

//点击查看进入会员明细
$('.c_checkBtn').on("click", function() {
   $(".effectTabs").addClass('hideBox');
    $(".effectTabs").eq(2).removeClass('hideBox');
    $(".m_slide_block").siblings().addClass('hideBox');
    $(".m_slide_block").eq(2).removeClass('hideBox');
    $(".messageTabs a").removeClass('tabChecked');
    $(".messageTabs a").eq(2).addClass('tabChecked');
    $(".messageTabs a").children('span').not(".count_icon").siblings().removeClass().addClass('mm_nav_icon');
    $("#detail_icon").addClass('click_2');
});

//Echarts图
var myChart = echarts.init(document.getElementById("tendencyChart"));

var option = {
    grid: {
        show: true,
        borderColor: "#ffffff"
    },
    title: {
        show: false
    },

    tooltip: {
        trigger: 'axis',
        formatter: '{b}<br>{a0} : {c0} ( 人 )<br>{a1} : {c1} ( 元 )',
        backgroundColor: "#ffffff",
        textStyle: {
            color: "#656d78"
        }
    },
    toolbox: {
        feature: {
            dataView: {
                show: false,
                readOnly: false
            },
            magicType: {
                show: false,
                type: ['line', 'bar']
            },
            restore: {
                show: false
            },
            saveAsImage: {
                show: false
            }
        }
    },
    legend: {
        bottom: 10,
        data: ['人数', '金额']
    },
    xAxis: [{
        type: 'category',
        data: []
    }],
    yAxis: [{
        type: 'value',
        name: '人数( 人 )',
        min: 0,
        max: 50,
        interval: 10,
        axisLabel: {
            formatter: '{value}'
        }
    }, {
        type: 'value',
        name: '金额( 元 )',
        min: 0,
        max: 2500,
        interval: 500,
        axisLabel: {
            formatter: '{value}'
        }
    }],
    series: [{
        name: '人数',
        type: 'bar',
        data: [],
        barWidth: 16,
        itemStyle: {
            normal: {
                color: "#fcc700"
            }
        }
    }, {
        name: '金额',
        type: 'line',
        yAxisIndex: 1,
        data: [],
        lineStyle: {
            normal: {
                color: "#15beee",
                width: 2,
                type: 'solid'
            }
        }
    }]
};

//效果分析趋势
function effectAnalysis(bDateT, eDateT, marketingId, mStId) {
    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId,
        mStId: mStId
    };

    var result = function(result) {
        option['xAxis'][0].data.splice(0, option['xAxis'][0].data.length); //清空横坐标中的数据以免出现数据混乱
        option['series'][0].data.splice(0, option['series'][0].data.length); //清空纵坐标中的数据以免出现数据混乱
        option['series'][1].data.splice(0, option['series'][1].data.length); //清空纵坐标中的数据以免出现数据混乱
        if (result || result.dataList) {
            var maxMember = 0;
            var maxMoney = 0;
            var resData = result.dataList;
            for (var key in resData) {
                if (key < resData.length - 2) {
                    mCount = parseFloat(resData[key].memberCount.split("人")[0]);
                    tMoney = parseFloat(resData[key].totalMoney.split("¥")[1]);

                    if (mCount >= maxMember) {
                        maxMember = mCount;
                    }
                    if (tMoney >= maxMoney) {
                        maxMoney = tMoney;
                    }

                    option['xAxis'][0].data.push(resData[key].createDate);
                    option['series'][0].data.push(mCount);
                    option['series'][1].data.push(tMoney);
                }
            }

            option["yAxis"][0].max = Math.ceil(maxMember / 10) * 10;
            option["yAxis"][0].interval = option["yAxis"][0].max / 5;
            option["yAxis"][1].max = Math.ceil(maxMoney / 500) * 500;
            option["yAxis"][1].interval = option["yAxis"][1].max / 5;

            // option['xAxis'][0].data.splice(-2, 2);
            // option['series'][0].data.splice(-2, 2);
            // option['series'][1].data.splice(-2, 2);

            // var app.title = '折柱混合';
            myChart.setOption(option);

            //效果分析趋势
            phoneMarketing.effectAnalysisData = result.dataList;
            //效果分析趋势
            phoneMarketing.effectAnalysisDataTable();
        } else {
            alert(serverError + JSON.stringify(result));
        }
    };
    post("get", "/clCrm/api/crm/marketing/call/effect/byDate/table/datas", data, result);

}

//数据概览
function dataOverview(bDateT, eDateT, marketingId) {

    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId
    };

    var result = function(result) {
        if (result.error == 200 && result.marketingCallStat && result.callRepurchaseInfoStat) {
            var marketingCallStat = result.marketingCallStat;
            var callRepurchaseInfoStat = result.callRepurchaseInfoStat;

            //数据概览：覆盖会员
            $("#memberCount").html(marketingCallStat.targetMemberCount).show();//目标会员数
            $("#successCount").html(marketingCallStat.callCount).show();//
            $("#successRate").html(marketingCallStat.callFinishedRate).show();
            $("#callCost").html(marketingCallStat.callCost).show();
            $("#messageCount").html(marketingCallStat.callSuccessCount).show();
            $("#messageCost").html(marketingCallStat.callSuccessRate).show();
            $("#minutesTotal").html(marketingCallStat.callMinute).show();//拨打分钟数

            //数据概览：复购会员
            $("#rMemberCount").html(callRepurchaseInfoStat.memberCount).show();
            $("#rNumber").html(callRepurchaseInfoStat.totalCount).show();
            $("#rCost").html(callRepurchaseInfoStat.totalMoney).show();
            $("#rGoodsCount").html(callRepurchaseInfoStat.goodsCount).show();
            $("#rUnitPrice").html(callRepurchaseInfoStat.unitPrice).show();

            //完成情况
            $(".screenNum").eq(0).text(marketingCallStat.targetMemberCountStr);
            $(".screenNum").eq(1).text(marketingCallStat.storeCount);
            $(".screenNum").eq(2).text(marketingCallStat.calledAndTotal);
            $(".screenNum").eq(3).text(marketingCallStat.callSuccessAndTotal);
        } else {
            alert(serverError + JSON.stringify($.extend(result + data)));
        }
    };

    post("get", "/clCrm/api/crm/marketing/call/stat", data, result);
}



$(function() {
    phoneMarketing.mainStoreId = $.cookie("mainStoreId");
    phoneMarketing.marketingId = getUrlParam("marketingId");
    phoneMarketing.taskName = getUrlParam("name");
    phoneMarketing.activityTime = getUrlParam("startTime");

    //默认时间间隔是7天的时间
    phoneMarketing.startTime = getUrlParam("startTime");
    phoneMarketing.nowTime = moment().format("YYYYMMDDHHmmss");
    if (!phoneMarketing.startTime) {
        phoneMarketing.startTime = smsMarketingEffect.nowTime;
    }
    if(getDateString(phoneMarketing.startTime, 7) > phoneMarketing.nowTime){
        phoneMarketing.endTime = phoneMarketing.nowTime;
    } else {
        phoneMarketing.endTime = getDateString(phoneMarketing.startTime, 7);
    }

    phoneMarketing.init();
})