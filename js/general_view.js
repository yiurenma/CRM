/**
 * 侧边栏滑动点击效果
 */

$(".left_bar_li").each(function(index) {
        // alert(this);
        var listNode = $(this);
        listNode.click(function() {
            $(".left_bar_li a").siblings().css('color', '#878F9D');
            $(".left_bar_li").siblings().removeClass('show_blue_line');
            $(".left_bar_li").eq(index).addClass('show_blue_line');
            $(".left_bar_li a").eq(index).css('color', '#1989fa');
            switch (index) {
                case index = 0:
                    // alert(0);
                    $(".left_icon").siblings().attr("class", "left_icon");
                    $(".left_icon").eq(index).addClass('click_view');
                 
                    break;
                case index = 1:
                    $(".left_icon").eq(index).addClass('click_analyse');
                    
                    break;
                case index = 2:
                    $(".left_icon").eq(index).addClass('click_management');
                    break;
                case index = 3:
                    $(".left_icon").eq(index).addClass('click_message');
                    break;
                case index = 4:
                    $(".left_icon").eq(index).addClass('click_phone');
                    break;
                case index = 5:
                    $(".left_icon").eq(index).addClass('click_serve');
                    break;
                case index = 6:
                    $(".left_icon").eq(index).addClass('click_review');
                    break;
                case index = 7:
                    $(".left_icon").eq(index).addClass('click_bill');
                    break;
                default:
                    // statements_def
                    break;
            }
        })
    })



var success = function(result){
  
   var rfmDataList = result.rfmDataList;
   //更新时间
   $(".update_time_span").text("会员等级计算时间跨度：" + rfmDataList[0].fromDate + " ~ " +  rfmDataList[0].toDate);
// 雷达图
var chartLength = document.getElementsByClassName('echart_detail').length;
for (var i = 0; i < chartLength; i++) {
    var myChart = echarts.init(document.getElementsByClassName('echart_detail')[i]);
    var colors=["#4C67A4","#7ABDF6","#6FCC8E","#A895DF","#FF97CE","#F6695B"]
    var dataBJ = [
        [rfmDataList[i].r, rfmDataList[i].f, rfmDataList[i].m , 0, 0.9, 18, 0, 0]
    ];
    var lineStyle = {
        normal: {
            width: 1,
            opacity: 0.9,
            color: colors[i]
        }
    };

    if(i===0){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(76, 103, 164, .2)', 'rgba(76, 103, 164, .4)', 'rgba(76, 103, 164, .8)', 'rgba(76, 103, 164, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };
    

        if(i===1){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(122,189,246, .2)', 'rgba(122,189,246, .4)', 'rgba(122,189,246, .8)', 'rgba(122,189,246, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };

            if(i===2){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(111,204,142, .2)', 'rgba(111,204,142, .4)', 'rgba(111,204,142, .8)', 'rgba(111,204,142, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };

 if(i===3){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(168,149,223, .2)', 'rgba(168,149,223, .4)', 'rgba(168,149,223, .8)', 'rgba(168,149,223, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };

     if(i===4){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(255,151,206, .2)', 'rgba(255,151,206, .4)', 'rgba(255,151,206, .8)', 'rgba(255,151,206, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };

if(i===5){
        var option = {
        radar: {
            indicator: [
                { name: 'R', max: 365 },
                { name: 'F', max: 250 },
                { name: 'M', max: 300 }
            ],
            // radius:['14','26','38'],
            shape: 'circle',
            splitNumber: 4,
            splitLine: {
                lineStyle: {
                   // background: '#39579a',
                    color: [
                        'rgba(246,105,91, .2)', 'rgba(246,105,91, .4)', 'rgba(246,105,91, .8)', 'rgba(246,105,91, 0)'
                    ].reverse()
                }
            },
            splitArea: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    // 坐标轴字母颜色
                    color: colors[i]
                }
            }
        },
        series: [{
            name: '总览雷达图',
            type: 'radar',
            lineStyle: lineStyle,
            data: dataBJ,
            itemStyle: {
                normal: {
                    // background: '#39579a'
                    color: colors[i]
                }
            },
            areaStyle: {
                normal: {
                    // background: '#39579a'
                    opacity:0.9
                }
            }
        }]
    };
    myChart.setOption(option);
    };
    

    $(".member_count .member_num:eq("+i+")").html(parseFloat(rfmDataList[i].totalCount).toLocaleString()+"<span> 人</span>");
    $(".member_count .m_counts:eq("+i+")").html(rfmDataList[i].totalCountRate+"%");
    $(".expenditure_list .member_num:eq("+i+")").html(parseFloat(rfmDataList[i].totalMoney).toLocaleString()+"<span> 元</span>");
    $(".expenditure_list .e_counts:eq("+i+")").html(rfmDataList[i].totalMoneyRate+"%");

    $(".budget:eq("+i+")").html("<div class='budget_hide'>"+rfmDataList[i].advise+"</div>");
    $(".title:eq("+i+")").html(rfmDataList[i].name);
    $(".description:eq("+i+")").html(rfmDataList[i].description);
   
    $(".membership:eq("+i+")").css("width",rfmDataList[i].totalCountRate+"%");
    $(".mollis_euismod:eq("+i+")").css("width",rfmDataList[i].totalMoneyRate+"%");
  }
};


$.cookie('mStId', '0351000');  
var data = {
   mStId:$.cookie('mStId')
};

post("get","/clCrm/api/crm/da/rfm/datas/all",data,success);


$(function(){

    $(".show_info").eq(0).mousemove(function(){
        // alert(11);
        $(".budget").eq(0).show();
    });
    $(".show_info").eq(0).mouseout(function(){
        $(".budget").eq(0).hide();
    });

        $(".show_info").eq(1).mousemove(function(){
        // alert(11);
        $(".budget").eq(1).show();
    });
    $(".show_info").eq(1).mouseout(function(){
        $(".budget").eq(1).hide();
    });

        $(".show_info").eq(2).mousemove(function(){
        // alert(11);
        $(".budget").eq(2).show();
    });
    $(".show_info").eq(2).mouseout(function(){
        $(".budget").eq(2).hide();
    });

        $(".show_info").eq(3).mousemove(function(){
        // alert(11);
        $(".budget").eq(3).show();
    });
    $(".show_info").eq(3).mouseout(function(){
        $(".budget").eq(3).hide();
    });

        $(".show_info").eq(4).mousemove(function(){
        // alert(11);
        $(".budget").eq(4).show();
    });
    $(".show_info").eq(4).mouseout(function(){
        $(".budget").eq(4).hide();
    });

        $(".show_info").eq(5).mousemove(function(){
        // alert(11);
        $(".budget").eq(5).show();
    });
    $(".show_info").eq(5).mouseout(function(){
        $(".budget").eq(5).hide();
    });
})