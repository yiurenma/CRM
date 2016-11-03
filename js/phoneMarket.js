/*tab 切换*/
$(".messageTabs a").each(function(index) {
        var $listNode = $(this);
        $listNode.click(function() {
            $(".effectTabs").addClass('hideBox');
            $(".effectTabs").eq(index).removeClass('hideBox');
            $(".m_slide_block").siblings().addClass('hideBox');
            $(".m_slide_block").eq(index).removeClass('hideBox');
            $listNode.siblings().removeClass('tabChecked');
            $listNode.addClass('tabChecked');
            // $(".messageTabs a").children('span').not(".count_icon").siblings().removeClass().addClass('mm_nav_icon');
            // $listNode.children().addClass('click_' + index);
        })
    })
    // echarts
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
            dataView: { show: true, readOnly: true },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
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
    var effect = "";

    var res = function(result) {
        var maxMember = 0;
        var maxMoney = 0;
        var resData = result.callRepurchaseInfoTableDataByDateList;
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
    post("get", "/clCrm/api/crm/marketing/call/effect/repurchases", data, res);
}

$(effectAnalysis("20160801000000", "20161001000000", "1", "0763000"));

//数据概览
function dataOverview(bDateT, eDateT, marketingId) {

    var res = function(result) {
        var marketingCallStat = result.marketingCallStat;
        var callRepurchaseInfoStat = result.callRepurchaseInfoStat;

        $("#memberCount").html(marketingCallStat.targetMemberCount).show();
        $("#messageCount").html(marketingCallStat.callCount).show();
        $("#successRate").html(marketingCallStat.callSuccessRate).show();
        $("#messageCost").html(marketingCallStat.callCost).show();
        $("#successCount").html(marketingCallStat.callSuccessCount).show();

        $("#rMemberCount").html(callRepurchaseInfoStat.memberCount).show();
        $("#rCost").html(callRepurchaseInfoStat.totalMoney).show();
        $("#rNumber").html(callRepurchaseInfoStat.totalCount).show();
        $("#rGoodsCount").html(callRepurchaseInfoStat.goodsCount).show();
        $("#rUnitPrice").html(callRepurchaseInfoStat.unitPrice).show();
    };

    var data = {
        bDateT: bDateT,
        eDateT: eDateT,
        marketingId: marketingId
    };
    post("get", "/clCrm/api/crm/marketing/call/stat", data, res);
}

dataOverview("20150801000000", "20161001000000", "1");
