var smsMarketingEffect = {
    activityTime:"",
    nowTime: "",
    startTime: "",
    endTime: "",
    marketingId: "",
    mainStoreId: "",

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
        //数据概览
        dataOverview(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId);
        //效果分析
        effectAnalysis(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId, smsMarketingEffect.mainStoreId);
        //会员数据
        smsMarketingEffect.memberDataAjax();
        //门店数据
        smsMarketingEffect.storeDataAjax();

        //初始化效果汇总和会员明细时间插件
        moment.locale("zh-cn");//daterangepicker插件汉语版本
        var now = getDate(smsMarketingEffect.nowTime);
        var start = getDate(smsMarketingEffect.startTime);
        var end = getDate(smsMarketingEffect.endTime);
        
        var maxDate = getDateString(smsMarketingEffect.startTime,60);
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
                smsMarketingEffect.startTime = getTime(start.format("YYYYMMDD"));
                smsMarketingEffect.endTime = getDayLastTime(end.format("YYYYMMDD"));
                dataOverview(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId);
                effectAnalysis(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId, smsMarketingEffect.mainStoreId);
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
                smsMarketingEffect.startTime = getTime(start.format("YYYYMMDD"));
                smsMarketingEffect.endTime = getDayLastTime(end.format("YYYYMMDD"));
                smsMarketingEffect.memberDataAjax();
                smsMarketingEffect.storeDataAjax();
            });

        //效果汇总时间按钮
        $("#effectMergeTime .btn").click(function() {
            var mergeTime = $(this).val();
            $("#effectTime").html(mergeTime+' <b class="arrow_down"></b>');
            if (mergeTime == "近5天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(5,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近7天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(7,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近15天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(15,"days").format("YYYYMMDDHHmmss");
            }
            if(smsMarketingEffect.nowTime < smsMarketingEffect.endTime){
                smsMarketingEffect.endTime = smsMarketingEffect.nowTime;
            }
            $("#effectDateRange").data("daterangepicker").setStartDate(moment(smsMarketingEffect.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            $("#effectDateRange").data("daterangepicker").setEndDate(moment(smsMarketingEffect.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));

            $('input[name="effectDateRange"]').val(moment(smsMarketingEffect.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日") + " - " + moment(smsMarketingEffect.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            dataOverview(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId);
            effectAnalysis(smsMarketingEffect.startTime, smsMarketingEffect.endTime, smsMarketingEffect.marketingId, smsMarketingEffect.mainStoreId);
        });

        //会员明细时间按钮
        $("#memberDetailMergeTime .btn").click(function() {
            var mergeTime = $(this).val();
            $("#detailTime").html(mergeTime + ' <b class="arrow_down"></b>');
            if (mergeTime == "近5天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(5,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近7天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(7,"days").format("YYYYMMDDHHmmss");
            } else if (mergeTime == "近15天") {
                smsMarketingEffect.startTime = smsMarketingEffect.activityTime;
                smsMarketingEffect.endTime = moment(smsMarketingEffect.activityTime, "YYYYMMDDHHmmss").add(15,"days").format("YYYYMMDDHHmmss");
            }
            if(smsMarketingEffect.nowTime < smsMarketingEffect.endTime){
                smsMarketingEffect.endTime = smsMarketingEffect.nowTime;
            }
            $("#memberDetailDateRange").data("daterangepicker").setStartDate(moment(smsMarketingEffect.startTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));
            $("#memberDetailDateRange").data("daterangepicker").setEndDate(moment(smsMarketingEffect.endTime, "YYYYMMDDHHmmss").format("YYYY年MM月DD日"));

            $('input[name="memberDetailDateRange"]').val(getDate(smsMarketingEffect.startTime) + " - " + getDate(smsMarketingEffect.endTime));
            smsMarketingEffect.memberDataAjax();
            smsMarketingEffect.storeDataAjax();
        });
    },

    //效果分析趋势
    effectAnalysisDataTable: function() {
        $("#effectAnalysisTable").DataTable({
            //以下是对表格获得数据的设置
            "dom": "t",
            "destroy":true,
            "ordering": false, //禁止排序
            "data":smsMarketingEffect.effectAnalysisData,
            "columns": smsMarketingEffect.effectAnalysisDataColumns,
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
    memberDataAjax: function() {
        var memberDataDraw; //datatables服务器分页必传参数
        $('#smsMarketingEffectMemberData').DataTable({
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
                    return smsMarketingEffect.prepareMemberDataApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(smsMarketingEffect.apiDataFromServer(data, memberDataDraw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": smsMarketingEffect.memberDataColumns,
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
    storeDataAjax: function() {
        var storeDataDraw; //datatables服务器分页必传参数
        $('#smsMarketingEffectStoreData').DataTable({
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
                    return smsMarketingEffect.prepareStoreDataApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(smsMarketingEffect.apiDataFromServer(data, storeDataDraw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": smsMarketingEffect.storeDataColumns,
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

    //会员数据：准备访问API的相关参数
    prepareMemberDataApiParams: function(d) {
        smsMarketingEffect.memberDataApiParams = {
            "marketingId": smsMarketingEffect.marketingId,
            "mStId": smsMarketingEffect.mainStoreId,
            "bDateT": smsMarketingEffect.startTime,
            "eDateT": smsMarketingEffect.endTime
        };
        return $.extend(smsMarketingEffect.memberDataApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/effect/byMember/table/datas"));
    },

    //门店数据：准备访问API的相关参数
    prepareStoreDataApiParams: function(d) {
        smsMarketingEffect.storeDataApiParams = {
            "marketingId": smsMarketingEffect.marketingId,
            "mStId": smsMarketingEffect.mainStoreId,
            "bDateT": smsMarketingEffect.startTime,
            "eDateT": smsMarketingEffect.endTime
        };
        return $.extend(smsMarketingEffect.storeDataApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/effect/byStore/table/datas"));
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
            alert(updateError + JSON.stringify(data));
        }
        return result;
    },
};

/*tab 切换*/
$(".messageTabs a").each(function(index) {
    var $listNode = $(this);
    $listNode.click(function() {
        $(".messageTabs a").children().attr("class", "mm_nav_icon");
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

// 柱状图
var myChart = echarts.init(document.getElementById("tendencyChart"));
var option = {
    grid: {
        show: false,
    },

    title: {
        show: false
    },

    tooltip: {
        show: true,
        trigger: 'axis',
        formatter: '{b}<br>{a0} : {c0} ( 人 )<br>{a1} : {c1} ( 元 )',
        backgroundColor: "#ffffff",
        borderColor: "#879BA6",
        borderRadius: 4,
        itemSize: 18,
        textStyle: {
            color: "#324148"
        }
        // triggerOn: 'click'
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
            formatter: '{value}(人)'
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
                width: 2, //线宽
                type: 'solid'
            }
        }
    }]
};

//效果分析趋势
function effectAnalysis(bDateT, eDateT, marketingId, mStId) {
    var res = function(result) {
        //趋势图
        option['xAxis'][0].data.splice(0, option['xAxis'][0].data.length); //清空横坐标中的数据以免出现数据混乱
        option['series'][0].data.splice(0, option['series'][0].data.length); //清空纵坐标中的数据以免出现数据混乱
        option['series'][1].data.splice(0, option['series'][1].data.length); //清空纵坐标中的数据以免出现数据混乱

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

        myChart.setOption(option);
        //效果分析趋势
        smsMarketingEffect.effectAnalysisData = result.dataList;
        //效果分析趋势
        smsMarketingEffect.effectAnalysisDataTable();
    };

    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId,
        mStId: mStId
    };
    post("get", "/clCrm/api/crm/marketing/sms/effect/byDate/table/datas", data, res);
}

//数据概览
function dataOverview(bDateT, eDateT, marketingId) {

    var res = function(result) {
        console.log(data);
        console.log(result);
        var marketingSmsStat = result.marketingSmsStat;
        var smsRepurchaseInfoStat = result.smsRepurchaseInfoStat;

        $("#memberCount").html(marketingSmsStat.memberCount).show();
        $("#messageCount").html(marketingSmsStat.smsCount).show();
        $("#successRate").html(marketingSmsStat.smsSuccessRate).show();
        $("#messageCost").html(marketingSmsStat.smsCost).show();
        $("#successCount").html(marketingSmsStat.smsReceivedCount).show();
        $("#memberSuccessCount").html(marketingSmsStat.memberSuccessCount).show();

        $("#rMemberCount").html(smsRepurchaseInfoStat.memberCount).show();
        $("#rCost").html(smsRepurchaseInfoStat.totalMoney).show();
        $("#rNumber").html(smsRepurchaseInfoStat.totalCount).show();
        $("#rGoodsCount").html(smsRepurchaseInfoStat.goodsCount).show();
        $("#rUnitPrice").html(smsRepurchaseInfoStat.unitPrice).show();

        //短信活动详情
        $(".activity_name").text(marketingSmsStat.name);
        $(".activity_time").text(marketingSmsStat.smsSendTime);
        $(".activity_status").text(marketingSmsStat.sendStatus);
        $(".activity_content").text(marketingSmsStat.smsContent);

        //短信任务名称
        $(".taskName").text(marketingSmsStat.name);
    };

    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId
    };
    post("get", "/clCrm/api/crm/marketing/sms/stat", data, res);
}

$(function() {
    smsMarketingEffect.mainStoreId = $.cookie("mainStoreId");
    smsMarketingEffect.marketingId = getUrlParam("marketingId");
    smsMarketingEffect.activityTime = getUrlParam("startTime");
    
    smsMarketingEffect.startTime = getUrlParam("startTime");
    smsMarketingEffect.nowTime = moment().format("YYYYMMDDHHmmss");
    if (!smsMarketingEffect.startTime) {
        smsMarketingEffect.startTime = smsMarketingEffect.nowTime;
    }
    if(getDateString(smsMarketingEffect.startTime, 7) > smsMarketingEffect.nowTime){
        smsMarketingEffect.endTime = smsMarketingEffect.nowTime;
    } else {
        smsMarketingEffect.endTime = getDateString(smsMarketingEffect.startTime, 7);
    }

    smsMarketingEffect.init();
})