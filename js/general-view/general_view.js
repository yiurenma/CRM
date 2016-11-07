var gerneralViewItem = {
    mainStoreId: "",
    memberLevelStartTime: "",
    memberLevelEndTime: "",
    RMax: "",
    FMax: "",
    MMax: "",

    init: function() {
        gerneralViewItem.mouseEvent();
        gerneralViewItem.generalViewAjax();
    },

    generalViewAjax: function() {
        var success = function(result) {
            var rfmDataList = result.rfmDataList;

            //更新时间
            gerneralViewItem.memberLevelStartTime = rfmDataList[0].fromDate;
            gerneralViewItem.memberLevelEndTime = rfmDataList[0].toDate;
            gerneralViewItem.RMax = result.rMax;
            gerneralViewItem.FMax = result.fMax;
            gerneralViewItem.MMax = result.mMax;
            $.cookie("memberLevelStartTime", gerneralViewItem.memberLevelStartTime); //存储会员等级开始时间，方便会员管理调用此参数
            $.cookie("memberLevelEndTime", moment().format("YYYY-MM-DD")); //存储会员等级结束时间，方便会员管理调用此参数
            $(".update_time_span").append(gerneralViewItem.memberLevelStartTime + " ~ " + moment().format("YYYY-MM-DD"));

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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
                                max: gerneralViewItem.RMax
                            }, {
                                name: 'F',
                                max: gerneralViewItem.FMax
                            }, {
                                name: 'M',
                                max: gerneralViewItem.MMax
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
            mStId: gerneralViewItem.mainStoreId
        };

        post("get", "/clCrm/api/crm/da/rfm/datas/all", data, success);
    },

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

        $(".show_details .detail_btn").on("click", function() {
            location.href = "MemberShip.html?rfmLevel=" + $(this).attr("rfmLevel") + "&mainStoreId=" + gerneralViewItem.mainStoreId + "&rfmName=" + escape($(this).attr("rfmName")) + "&totalCount=" + $(this).attr("totalCount");
        });
    }
};

$(function() {
    //从旧系统中得到员工号和总店ID做权限控制,cookie失效时间为1天
    gerneralViewItem.mainStoreId = $.cookie("mainStoreId");
    //处理会员等级计算时间跨度
    gerneralViewItem.init();
})