/*tab标签切换*/

$(".messageTabs a").each(function(index) {
    var $listNode = $(this);
    $listNode.click(function() {
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
// 柱状图
var myChart = echarts.init(document.getElementById("tendencyChart"));
var option = {
    grid: {
        show: true,
        // borderColor: "#DA70D6"
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
    var effect = "";

    var res = function(result) {
        var maxMember = 0;
        var maxMoney = 0;
        var resData = result.dataList;
        for (var key in resData) {
            effect += "<tr>" +
                "<td>" + resData[key].createDate + "</td>" +
                "<td>" + resData[key].memberCount + "</td>" +
                "<td>" + resData[key].totalMoney + "</td>" +
                "<td>" + resData[key].totalCount + "</td>" +
                "<td>" + resData[key].goodsCount + "</td>" +
                "<td>" + resData[key].unitPrice + "</td>" +
                "</tr>";

            mCount = parseFloat(resData[key].memberCount.split("人")[0]);
            tMoney = resData[key].totalMoney.split("¥")[1];

            if (mCount >= maxMember) {
                maxMember = mCount;
            }
            if (tMoney >= maxMoney) {
                maxMoney = tMoney;
            }

            option['xAxis'][0].data.push(resData[key].createDate);
            option['series'][0].data.push(mCount);
            option['series'][1].data.push(parseFloat(tMoney));
        }
        $("#effectTable").html(effect).show();

        option["yAxis"][0].max = Math.ceil(maxMember / 10) * 10;
        option["yAxis"][0].interval = option["yAxis"][0].max / 5;
        option["yAxis"][1].max = Math.ceil(maxMoney / 500) * 500;
        option["yAxis"][1].interval = option["yAxis"][1].max / 5;

        option['xAxis'][0].data.splice(-2, 2);
        option['series'][0].data.splice(-2, 2);
        option['series'][1].data.splice(-2, 2);

        // var app.title = '折柱混合';
        myChart.setOption(option);

    };

    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId,
        mStId: mStId
    };
    post("get", "/clCrm/api/crm/marketing/sms/effect/byDate", data, res);
}

$(effectAnalysis("20150801000000", "20151001000000", "1", "0728000"));

//数据概览
function dataOverview(bDateT, eDateT, marketingId) {

    var res = function(result) {
        var marketingSmsStat = result.marketingSmsStat;
        var smsRepurchaseInfoStat = result.smsRepurchaseInfoStat;

        $("#memberCount").html(marketingSmsStat.memberCount).show();
        $("#messageCount").html(marketingSmsStat.smsCount).show();
        $("#successRate").html(marketingSmsStat.smsSuccessRate).show();
        $("#messageCost").html(marketingSmsStat.smsCost).show();
        $("#successCount").html(marketingSmsStat.smsReceivedCount).show();

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

$(dataOverview("20150801000000", "20151001000000", "1"));


//会员明细
function memberDetail(bDateT, eDateT, mStId, marketingId) {
    //会员数据
    $('#memberData').DataTable({
        //以下是对表格获得数据的设置
        "dom": "B<'clear'>rtlp",
        "serverSide": true, //开启datatables的服务器模式
        "scrollX": 200, //配置横坐标长度为200
        "lengthMenu": [5, 20, 30],
        "ordering": false, //禁止排序
        "ajax": {
            "url": apiEntry, //api访问链接    
            "dataType": "json",
            "type": "post",
            "data": function(d) { //d代表default，即在默认分页参数
                draw = d.draw;
                var dataTableParams = {
                    "bDateT": bDateT,
                    "eDateT": eDateT,
                    "mStId": mStId,
                    "marketingId": marketingId
                }; //在此添加自定义参数和接口分页参数
                return $.extend(dataTableParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/effect/byMember"));

            },
            "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                data = jQuery.parseJSON(data);

                var result = {};
                result.draw = draw;
                if (data.page) {
                    result.recordsTotal = data.page.totalCount;
                    result.recordsFiltered = data.page.totalCount;
                    result.data = data.dataList;
                }
                return JSON.stringify(result);
            },
            error: function(msg) {
                alert("失败了");
            }
        },
        "buttons": [{
            "extend": "csvHtml5",
            "text": "导出CSV",
            "CharSet": "utf8", //解决用excel打开文件中文乱码问题
            "bom": true //解决用excel打开文件中文乱码问题
        }],
        "columns": [{
            "data": "userName"
        }, {
            "data": "patientName"
        }, {
            "data": "totalMoney"
        }, {
            "data": "totalCount"
        }, {
            "data": "goodsCount"
        }, {
            "data": "unitPrice"
        }, {
            "data": "storeName"
        }],
        "oLanguage": { //国际语言转化
            "sLengthMenu": "每页显示数量 _MENU_ ",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sSearch": '',
            "sEmptyTable": "未有相关数据",
            "oPaginate": {
                "sPrevious": "<img src='images/ic_left.png'>",
                "sNext": "<img src='images/ic_right.png'>"
            }
        }
    });

    //门店数据
    $('#storeData').DataTable({
        //以下是对表格获得数据的设置
        "dom": "B<'clear'>rtlp",
        "serverSide": true, //开启datatables的服务器模式
        "scrollX": 200, //配置横坐标长度为200
        "lengthMenu": [5, 20, 30],
        "ordering": false, //禁止排序
        "ajax": {
            "url": apiEntry, //api访问链接    
            "dataType": "json",
            "type": "post",
            "data": function(d) { //d代表default，即在默认分页参数
                draw = d.draw;
                var dataTableParams = {
                    "mStId": mStId,
                    "marketingId": marketingId
                }; //在此添加自定义参数和接口分页参数
                return $.extend(dataTableParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/effect/byStore"));

            },
            "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                data = jQuery.parseJSON(data);

                var result = {};
                result.draw = draw;
                if (data.page) {
                    result.recordsTotal = data.page.totalCount;
                    result.recordsFiltered = data.page.totalCount;
                    result.data = data.dataList;
                }
                return JSON.stringify(result);
            },
            error: function(msg) {
                alert("失败了");
            }
        },
        "buttons": [{
            "extend": "csvHtml5",
            "text": "导出CSV",
            "CharSet": "utf8", //解决用excel打开文件中文乱码问题
            "bom": true //解决用excel打开文件中文乱码问题
        }],
        "columns": [{
            "data": "storeName"
        }, {
            "data": "memberCount"
        }, {
            "data": "totalMoney"
        }, {
            "data": "totalCount"
        }, {
            "data": "goodsCount"
        }],
        "oLanguage": { //国际语言转化
            "sLengthMenu": "每页显示数量 _MENU_ ",
            "sZeroRecords": "对不起，查询不到任何相关数据",
            "sSearch": '',
            "sEmptyTable": "未有相关数据",
            "oPaginate": {
                "sPrevious": "<img src='images/ic_left.png'>",
                "sNext": "<img src='images/ic_right.png'>"
            }
        }
    });
}


$(memberDetail("20160801000000", "20161001000000", "0728000", "1"));



var callRecordItem = {
    startDate: "",
    endDate: "",
    mainStoreId: "0000001",

    //与表格有关的参数

    callRecordSmsMarketingTable: "",
    callRecordSmsMarketingApiParams: "",
    callRecordSmsMarketingTableColumns: [{
        "data": "cDateT",
        "title": "短信发送时间",
    }, {
        "data": "stNm",
        "title": "连锁/门店",
    }, {
        "data": "erNm",
        "title": "发送者",
    }, {
        "data": "receiver",
        "title": "会员联系方式",
    }, {
        "data": null,
        "title": "会员姓名",
    }, {
        "data": "content",
        "title": "短信内容",
    }, {
        "data": "typeStr",
        "title": "短信类型",
    }],

    init: function() {
        callRecordItem.endDate = moment().format('YYYY-MM-DD');
        callRecordItem.startDate = moment().subtract('days', 30).format('YYYY-MM-DD');

        //初始化短信营销时间插件
        $('#dateRange1').daterangepicker({
            startDate: callRecordItem.startDate,
            endDate: callRecordItem.endDate
        });
        $('input[name="daterange1"]').val(callRecordItem.startDate + " - " + callRecordItem.endDate);


        //短信营销时间按钮
        $("#mergeTime1").on("click", "button", function() {
            var mergeTime = $(this).attr("value");
            if (mergeTime == "week") {
                callRecordItem.startDate = moment().subtract("days", 6).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            } else if (mergeTime == "month") {
                callRecordItem.startDate = moment().subtract("days", 30).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            } else if (mergeTime == "year") {
                callRecordItem.startDate = moment().subtract("days", 365).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            }
            $("#dateRange1").data("daterangepicker").setStartDate(callRecordItem.startDate);
            console.log(callRecordItem.startDate);
            $("#dateRange1").data("daterangepicker").setEndDate(callRecordItem.endDate);

            $('input[name="daterange1"]').val(callRecordItem.startDate + " - " + callRecordItem.endDate);
        });

        $('#dateRange2').daterangepicker({
            startDate: callRecordItem.startDate,
            endDate: callRecordItem.endDate
        });
        $('input[name="daterange2"]').val(callRecordItem.startDate + " - " + callRecordItem.endDate);


        //短信营销时间按钮
        $("#mergeTime2").on("click", "button", function() {
            var mergeTime = $(this).attr("value");
            if (mergeTime == "week") {
                callRecordItem.startDate = moment().subtract("days", 6).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            } else if (mergeTime == "month") {
                callRecordItem.startDate = moment().subtract("days", 30).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            } else if (mergeTime == "year") {
                callRecordItem.startDate = moment().subtract("days", 365).format("YYYY-MM-DD");
                callRecordItem.endDate = moment().format("YYYY-MM-DD");
            }
            $("#dateRange2").data("daterangepicker").setStartDate(callRecordItem.startDate);
            console.log(callRecordItem.startDate);
            $("#dateRange2").data("daterangepicker").setEndDate(callRecordItem.endDate);

            $('input[name="daterange2"]').val(callRecordItem.startDate + " - " + callRecordItem.endDate);
        });


        //标签页替换
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            // 获取已激活的标签页的名称
            var activeTab = $(e.target).text();
            // 获取前一个激活的标签页的名称
            var previousTab = $(e.relatedTarget).text();
            $(".active-tab span").html(activeTab);
            $(".previous-tab span").html(previousTab);
        });

        //初始化短信营销表格
        var callRecordSmsMarketingDraw; //datatables服务器分页必传参数
        $('#smsMarketingTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [10, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    callRecordSmsMarketingDraw = d.draw;
                    return callRecordItem.prepareApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(callRecordItem.getDataFromServer(data, callRecordSmsMarketingDraw));
                },
                error: function(msg) { //获取数据失败之后的信息
                    alert("服务器出现问题啦！请发送以下错误信息到邮箱customer@carelinker.com：" + msg);
                }
            },
            "columns": callRecordItem.callRecordSmsMarketingTableColumns,
            "oLanguage": { //国际语言转化
                "sLengthMenu": "每页显示数量 _MENU_ ",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sSearch": '',
                "sEmptyTable": "未有相关数据",
                "oPaginate": {
                    "sPrevious": "<img src='images/ic_left.png'>",
                    "sNext": "<img src='images/ic_right.png'>"
                }
            }
        });
    },

    //准备访问API的相关参数
    prepareApiParams: function(d) {
        callRecordItem.callRecordSmsMarketingApiParams = {
            "stId": callRecordItem.mainStoreId,
            "bDateT": moment(callRecordItem.startDate).format("YYYYMMDDHHMMSS"),
            "eDateT": moment(callRecordItem.endDate).format("YYYYMMDDHHMMSS")
        };
        return $.extend(callRecordItem.callRecordSmsMarketingApiParams, getDataTableParams(d, "get", "/clCommunication/api/sms/records"));
    },

    //处理访问API之后得到的数据集
    getDataFromServer: function(data, draw) {
        var result = {};
        result.draw = draw;
        if (data.page) {
            result.recordsTotal = data.page.totalCount;
            result.recordsFiltered = data.page.totalCount;
            result.data = data.smsRecordList;
        } else {
            result.recordsTotal = data.smsRecordList.length;
            result.recordsFiltered = data.smsRecordList.length;
            result.data = data.smsRecordList;
        }
        return result;
    },
};

$(function() {
    callRecordItem.init();
});