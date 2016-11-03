var drugAnalysisItem = {
    mainStoreId: "",
    memberLevelStartTime: "",
    memberLevelEndTime: "",
    goodsId: "",
    RMax: "",
    FMax: "",
    MMax: "",
    init: function() {
        drugAnalysisItem.mouseEvent();
        drugAnalysisItem.getGroup();
    },
    getGroup: function() {
        var success = function(groupData) {
            var crmGroupFirstClassList = groupData.dataList;
            var classLength = crmGroupFirstClassList.length;
            for (var i in crmGroupFirstClassList) {
                if (crmGroupFirstClassList[i]) {
                    if (crmGroupFirstClassList[i].length == 0) { //如果没有ABCD分组，则隐藏我的分组
                        $('.queueList .blockBox').addClass("hideBox");
                    } else {
                        //获得所有药品数据
                        var list = crmGroupFirstClassList[i].name;
                        //对各个药品进行拼音分类处理
                        var letter = pinyin.getCamelChars(list).substring(0, 1);
                        //将药品动态添加到div中
                        $("#" + letter).find("div[class$='myGroup']").append(
                            '<label class="btn btn-primary">' +
                            '<input type="radio" autocomplete="off" data-id="' + crmGroupFirstClassList[i].drugId + '">' + crmGroupFirstClassList[i].name + '</label>'
                        );

                    }
                }
            }
            $(".update_time_span").append(moment().format("YYYY-MM-DD"));
            //请求连锁主推数据
            for (var i in crmGroupFirstClassList) {
                //获取更新时间
                //  var time=crmGroupFirstClassList[i].createDate;
                // console.log(time);

                if (crmGroupFirstClassList[i].initial == "连锁主推") {
                    $("#myroup").append(
                        '<label class="btn btn-primary">' +
                        '<input type="radio" autocomplete="off" data-id="' + crmGroupFirstClassList[i].drugId + '">' + crmGroupFirstClassList[i].name + '</label>'
                    );
                }

            }

        };
        //请求接口中的药品数据
        var data = {
            "mStId": drugAnalysisItem.mainStoreId
        };
        post("get", "/clCrm/api/crm/drugs/important", data, success);
    },
    generalViewAjax: function() {
        var success = function(result) {
            var rfmDataList = result.rfmDataList;
            //更新时间
            drugAnalysisItem.memberLevelStartTime = rfmDataList[0].fromDate;
            drugAnalysisItem.memberLevelEndTime = rfmDataList[0].toDate;
            drugAnalysisItem.RMax = result.rMax;
            drugAnalysisItem.FMax = result.fMax;
            drugAnalysisItem.MMax = result.mMax;
            //当RFM值等于0时 不让echart表显示
            $(document).ajaxComplete(function() {
                    if (result.rMax == "0" || result.fMax == "0" || result.mMax == "0") {
                        $(".loadingText").addClass('hideBox');
                        $(".zeroResultText").removeClass('hideBox');
                        $(".drug-analy").hide();
                        $(".member_list").hide();
                    } else {
                        $(".zeroResultText").addClass('hideBox');
                        $(".loadingText").addClass('hideBox');
                        $(".memberList").removeClass('hideBox');
                        $(".drug-analy").show();
                        $(".member_list").show();
                    }
                })
                // 雷达图
            var chartLength = $('.echart_detail').length;
            for (var i = 0; i < chartLength; i++) {
                var myChart = echarts.init($('.echart_detail')[i]);
                var colors = ["#4C67A4", "#7ABDF6", "#6FCC8E", "#A895DF", "#FF97CE", "#F6695B"]
                var dataBJ = [
                    [rfmDataList[i].r, rfmDataList[i].f, rfmDataList[i].m, 0, 0.9, 18, 0, 0]
                ];
                var lineStyle = {
                    normal: {
                        width: 1,
                        opacity: 0.9,
                        color: colors[i]
                    }
                };

                if (i === 0) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };


                if (i === 1) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };

                if (i === 2) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };

                if (i === 3) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };

                if (i === 4) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };

                if (i === 5) {
                    var option = {
                        radar: {
                            indicator: [{
                                name: 'R',
                                max: drugAnalysisItem.RMax
                            }, {
                                name: 'F',
                                max: drugAnalysisItem.FMax
                            }, {
                                name: 'M',
                                max: drugAnalysisItem.MMax
                            }],
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
                                    opacity: 0.9
                                }
                            }
                        }]
                    };
                    myChart.setOption(option);
                };
                //渲染RFM图表中的数据
                $(".member_count .member_num:eq(" + i + ")").html("<span>人</span>");
                $(".expenditure_list .member_num:eq(" + i + ")").html("<span>元</span>");
                $(".member_count .member_num:eq(" + i + ")").prepend(parseFloat(rfmDataList[i].totalCount).toLocaleString());
                $(".member_count .m_counts:eq(" + i + ")").html(rfmDataList[i].totalCountRate + "%");
                $(".expenditure_list .member_num:eq(" + i + ")").prepend(parseFloat(rfmDataList[i].totalMoney).toLocaleString());
                $(".expenditure_list .e_counts:eq(" + i + ")").html(rfmDataList[i].totalMoneyRate + "%");
                $(".budget .budget_hide:eq(" + i + ")").html(rfmDataList[i].advise);
                $(".title:eq(" + i + ")").html(rfmDataList[i].name);
                $(".description:eq(" + i + ")").html(rfmDataList[i].description);
                $(".membership:eq(" + i + ")").css("width", rfmDataList[i].totalCountRate + "%");
                $(".mollis_euismod:eq(" + i + ")").css("width", rfmDataList[i].totalMoneyRate + "%");
                //把对应的rfm的类型、名称和数量加入到查看详情的参数中，方便跳转到会员管理的页面进行会员查询
                $(".show_details .detail_btn:eq(" + i + ")").attr("rfmName", rfmDataList[i].name);
                $(".show_details .detail_btn:eq(" + i + ")").attr("totalCount", rfmDataList[i].totalCount);
                $(".show_details .detail_btn:eq(" + i + ")").attr("rfmLevel", rfmDataList[i].level);
            }
        };

        var data = {
            "mStId": drugAnalysisItem.mainStoreId,
            "goodsId": drugAnalysisItem.goodsId
        };
        post("get", "/clCrm/api/crm/da/rfm/datas/sku", data, success);
    },
    //鼠标滑过显示隐藏
    mouseEvent: function() {
        $(".show_info").eq(0).mousemove(function() {
            $(".budget").eq(0).show();
        });
        $(".show_info").eq(0).mouseout(function() {
            $(".budget").eq(0).hide();
        });

        $(".show_info").eq(1).mousemove(function() {
            $(".budget").eq(1).show();
        });
        $(".show_info").eq(1).mouseout(function() {
            $(".budget").eq(1).hide();
        });

        $(".show_info").eq(2).mousemove(function() {
            $(".budget").eq(2).show();
        });
        $(".show_info").eq(2).mouseout(function() {
            $(".budget").eq(2).hide();
        });

        $(".show_info").eq(3).mousemove(function() {
            $(".budget").eq(3).show();
        });
        $(".show_info").eq(3).mouseout(function() {
            $(".budget").eq(3).hide();
        });

        $(".show_info").eq(4).mousemove(function() {
            $(".budget").eq(4).show();
        });
        $(".show_info").eq(4).mouseout(function() {
            $(".budget").eq(4).hide();
        });

        $(".show_info").eq(5).mousemove(function() {

            $(".budget").eq(5).show();
        });
        $(".show_info").eq(5).mouseout(function() {
            $(".budget").eq(5).hide();
        });
        //查看详情页面跳转
        $(".show_details .detail_btn").on("click", function() {
            location.href = "MemberShip.html?rfmLevel=" + $(this).attr("rfmLevel") + "&mainStoreId=" + drugAnalysisItem.mainStoreId + "&rfmName=" + escape($(this).attr("rfmName")) + "&totalCount=" + $(this).attr("totalCount") + "&goodsId=" + drugAnalysisItem.goodsId + "&goodsName=" + escape(drugAnalysisItem.name);
        });
        //点击查看药品全部会员页面跳转
        $(".drug-analy .Allthemembers").on("click", function() {
            location.href = "MemberShip.html?mainStoreId=" + drugAnalysisItem.mainStoreId + "&goodsId=" + drugAnalysisItem.goodsId + "&goodsName=" + escape(drugAnalysisItem.name);
        });


        //Tab标签切换
        $(".messageTabs a").each(function(index) {
            var $listNode = $(this);
            $listNode.click(function() {
                $(".tabsbtn").children().attr("class", "mm_nav_icon");
                $(this).siblings().removeClass('curFlag');
                $(this).addClass('curFlag');

                $("article").siblings().addClass('hideBox');
                $("article").eq(index).removeClass('hideBox');
                $(".m_slide_block").siblings().addClass('hideBox');
                $(".m_slide_block").eq(index).removeClass('hideBox');
                if (index !== 6) {
                    $listNode.siblings().removeClass('tabChecked');
                    $listNode.addClass('tabChecked');
                    $(".messageTabs a").children('span').not(".count_icon").siblings().removeClass().addClass('mm_nav_icon');
                    $listNode.children().addClass('click_' + index);
                }
            })
        });
        // 点击改变lable背景颜色 
        $(".btn-primary").find("label").css('color', 'red');
        //页面跳转
        $(".messageTabs li a").click(function() {
                $(this).css("color", "#1989fa").siblings().css("color", "#324148");
            })
            //点击ABCD标签让图表显示隐藏

        $(".messageTabs a").click(function() {
            $(".drug-analy").hide();
        })
        $(".messageTabs a").click(function() {
            $(".drug-analy").hide();
        })
        $(".messageTabs a").click(function() {
            $(".member_list").hide();

        });
        //隐藏显示药品数据
        $(".messageTabs a").click(function() {
            $(".zeroResultText").hide();
            $(".btn-primary").click(function() {
                $(".zeroResultText").show();
            })
        });
        $(".messageTabs a").click(function() {
            $(".btn-primary").removeClass("active");

        });

        $(".btn-group").on('click', '.btn', function() {
            drugAnalysisItem.goodsId = $(this).children().attr("data-id");
            drugAnalysisItem.name = $(this).text();
            drugAnalysisItem.generalViewAjax();
            // 替换文字
            $(".drug-analyItem").html($(this).text() + "药品分析");
        });
    }
};

$(function() {
    //暂时让cookie一直存在，在总览页面的js中存入mainStoreId的值并且如果链接中如果存在mainStoreId的值优先取这个值并保存在cookie中
    drugAnalysisItem.mainStoreId = $.cookie("mainStoreId");
    //处理会员等级计算时间跨度
    drugAnalysisItem.init();
})
