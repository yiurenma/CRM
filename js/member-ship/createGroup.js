var messageMarketingItem = {
    groupId: "",
    dateFilter: "",
    mainStoreId: "",
    groupName: "",
    memberFilterData: "",
    startDate: "",
    endDate: "",
    resourceType: "",
    goodsName: "",
    goodsId: "",
    //重点药品表格相关参数
    messageMarketingImportantGoodsTable: "",
    messageMarketingImportantGoodsApiParams: "",
    messageMarketingImportantGoodsTableColumns: [{
        "data": null,
        "createdCell": function(td, cellData, rowData, row, col) {
            $(td).html("");
        },
    }, {
        "data": "name",
        "title": "药品名",
    }, {
        "data": "productPlace",
        "title": "生产厂家",
    }, {
        "data": "spec",
        "title": "规格",
    }],

    //门店表格相关参数
    messageMarketingBranchStoreTable: "",
    messageMarketingBranchStoreApiParams: "",
    messageMarketingBranchStoreTableColumns: [{
        "data": null,
        "createdCell": function(td, cellData, rowData, row, col) {
            $(td).html("");
        },
    }, {
        "data": "branchStoreName",
        "title": "店名",
    }],

    //最近测量门店表格
    messageMarketingMeasureBranchStoreTable: "",
    messageMarketingMeasureBranchStoreApiParams: "",
    messageMarketingMeasureBranchStoreTableColumns: [{
        "data": null,
        "createdCell": function(td, cellData, rowData, row, col) {
            $(td).html("");
        },
    }, {
        "data": "branchStoreName",
        "title": "店名",
    }],

    //快速刷选表格和会员刷选表格参数
    memberTable: "",
    memberApiParams: "",
    memberTableColumns: [{
        "data": "telephone",
        "title": "会员联系方式",
    }, {
        "data": "patientName",
        "title": "会员姓名",
    }, {
        "data": "customTagStr",
        "title": "标签",
    }, {
        "data": "rfmLevel",
        "title": "会员等级",
    }, {
        "data": "cLastDays",
        "title": "未消费时间",
    }, {
        "data": "cCount",
        "title": "消费次数",
    }, {
        "data": "cTotalMoney",
        "title": "累计金额",
    }, {
        "data": "cUnitPrice",
        "title": "平均客单价",
    }, {
        "data": "cLastStoreName",
        "title": "最近消费门店",
    }, {
        "data": "htnDiseaseStr",
        "title": "高血压类",
    }, {
        "data": "dmDiseaseStr",
        "title": "糖尿病类",
    }, {
        "data": "ablDiseaseStr",
        "title": "高血脂类",
    }, {
        "data": "complDiseaseStr",
        "title": "合并症类",
    }, {
        "data": "hLastDays",
        "title": "最近测量时间",
    }, {
        "data": "hCount",
        "title": "测量次数",
    }, {
        "data": "hLastStoreName",
        "title": "最近服务门店",
    }, {
        "data": null,
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            if (rowData.profileUrl == "-") {
                //如果没有个人健康档案
                $(td).html("<a class=NoPersonalDetailImage></a>");
            } else {
                //如果有个人健康档案
                $(td).html("<a class=personalDetailImage href='" + rowData.profileUrl + "'></a>");
            }
        },
    }],
    //单个药品表格参数
    memberTable: "",
    memberApiParams: "",
    memberShipDrugAnalysisTableColumns: [{
        "data": "telephone",
        "title": "会员联系方式",
    }, {
        "data": "patientName",
        "title": "会员姓名",
    }, {
        "data": "customTagStr",
        "title": "标签",
    }, {
        "data": "rfmLevel",
        "title": "该药品会员等级",
    }, {
        "data": "cLastDays",
        "title": "该药品未消费时间",
    }, {
        "data": "cCount",
        "title": "该药品消费次数",
    }, {
        "data": "cTotalMoney",
        "title": "该药品累计金额",
    }, {
        "data": "cUnitPrice",
        "title": "该药品平均客单价",
    }, {
        "data": "cLastStoreName",
        "title": "该药品最近消费门店",
    }, {
        "data": "htnDiseaseStr",
        "title": "该药品高血压类",
    }, {
        "data": "dmDiseaseStr",
        "title": "该药品糖尿病类",
    }, {
        "data": "ablDiseaseStr",
        "title": "该药品高血脂类",
    }, {
        "data": "complDiseaseStr",
        "title": "该药品合并症类",
    }, {
        "data": "hLastDays",
        "title": "该药品最近测量时间",
    }, {
        "data": "hCount",
        "title": "该药品测量次数",
    }, {
        "data": "hLastStoreName",
        "title": "该药品最近服务门店",
    }, {
        "data": null,
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            if (rowData.profileUrl == "-") {
                //如果没有个人健康档案
                $(td).html("<a class=NoPersonalDetailImage></a>");
            } else {
                //如果有个人健康档案
                $(td).html("<a class=personalDetailImage href='" + rowData.profileUrl + "'></a>");
            }
        },
    }],
    init: function() {

        //系统分组和我的分组的信息
        messageMarketingItem.getGroup();
        // 请求标签内容
        messageMarketingItem.getTagAjax();
        if (messageMarketingItem.resourceType == "createGroup") {
            messageMarketingItem.createGroupAjax();
        }
        //初始化时间参数
        moment.locale("zh-cn");
        var start = moment().subtract(7, 'days').format("LL"); //YYYY年MM月DD日
        var end = moment().format("LL"); //YYYY年MM月DD日
        //初始化界面四个dateRangePicker插件
        messageMarketingItem.getRange(".self1", start, end);
        messageMarketingItem.getRange(".self2", start, end);

        //初始化鼠标事件
        messageMarketingItem.mouseEvent();
        // 确认创建分组
        $("#taskConfirm").click(function() {
            messageMarketingItem.createGroup();
        })
    },

    //初始化dateRangePicker参数
    getRange: function(invoking, start, end) {
        $(invoking).daterangepicker({
            locale: {
                format: 'YYYY年MM月DD日'
            },
            startDate: start,
            endDate: end
        })
    },

    // 获取快速筛选页面分组列表
    getGroup: function() {
        var success = function(groupData) {
            var crmGroupFirstClassList = groupData.crmGroupFirstClassList;
            var classLength = crmGroupFirstClassList.length;
            for (var i in crmGroupFirstClassList) {
                if (crmGroupFirstClassList[i].type == 2) {
                    for (var j in crmGroupFirstClassList[i].crmGroupList) {
                        $("#myGroup").append(
                            '<label class="btn btn-primary">' +
                            '<input type="radio" autocomplete="off" data-id="' + crmGroupFirstClassList[i].crmGroupList[j].id + '">' + crmGroupFirstClassList[i].crmGroupList[j].name + '(' + crmGroupFirstClassList[i].crmGroupList[j].num + ')' + '</label>'
                        );
                    }
                } else if (crmGroupFirstClassList[i].type == 1) {
                    for (var j in crmGroupFirstClassList[i].crmGroupList) {
                        $("#sysGroup").append(
                            '<label class="btn btn-primary">' +
                            '<input type="radio" autocomplete="off" data-id="' + crmGroupFirstClassList[i].crmGroupList[j].id + '">' + crmGroupFirstClassList[i].crmGroupList[j].name + '(' + crmGroupFirstClassList[i].crmGroupList[j].num + ')' + '</label>'
                        );
                    }
                }
            }
        };

        var data = {
            "mStId": messageMarketingItem.mainStoreId
        };

        post("get", "/clCrm/api/crm/groups/tree", data, success);
    },
    getTagAjax: function() {
        var data = {
            "mStId": messageMarketingItem.mainStoreId
        };
        var success = function(tagList) {
            console.log(tagList);
            var listLength = tagList.dataList.length;
            for (var i in tagList.dataList) {
                if (i == 0) {
                    $("#tagList").append(
                        '<label class="btn btn-primary active">' +
                        '<input type="checkbox" autocomplete="off"  data-tagid=' + tagList.dataList[0].id + '>' + tagList.dataList[0].content + '</label>'
                    )
                } else {
                    $("#tagList").append(
                        '<label class="btn btn-primary">' +
                        '<input type="checkbox" autocomplete="off"  data-tagid=' + tagList.dataList[i].id + '>' + tagList.dataList[i].content + '</label>'
                    )
                }
            }
        }
        post("get", "/clCrm/api/crm/tags/mainStore", data, success);
    },
    createGroup: function() {
        var data;
        if (messageMarketingItem.resourceType = "createDrugGroup") {
            data = {
                "mStId": messageMarketingItem.mainStoreId,
                "goodsId": messageMarketingItem.goodsId,
                "groupName": $("#groupName").val()
            }
        } else {
            data = {
                "mStId": messageMarketingItem.mainStoreId,
                "groupName": $("#groupName").val()
            }
        }
        var success = function(data) {
            messageMarketingItem.groupId = data.id;
            //对页面来源进行判断  单个药品会员页面跳转
            if (messageMarketingItem.resourceType = "createDrugGroup") {
                location.href = "MemberShip.html?groupId=" + messageMarketingItem.groupId + "&mainStoreId=" + messageMarketingItem.mainStoreId + "&groupName=" + escape($("#groupName").val()) + "&groupNum=" + $("#effectNum").text() + "&goodsId=" + messageMarketingItem.goodsId + "&goodsName=" + escape(messageMarketingItem.goodsName);
            } else {
                location.href = "MemberShip.html?groupId=" + messageMarketingItem.groupId + "&mainStoreId=" + messageMarketingItem.mainStoreId + "&groupName=" + escape($("#groupName").val()) + "&groupNum=" + $("#effectNum").text();
            }
        }
        post("post", "/clCrm/api/crm/groups/group", $.extend(data, messageMarketingItem.memberFilterData), success);
    },
    //各种鼠标事件
    mouseEvent: function() {
        // 快速选择、会员筛选button点击效果
        $(".btn-group").on('click', '.btn', function() {
            messageMarketingItem.groupId = $(this).children().attr("data-id");
            $(".quickResult,.memberList,.next_btn").addClass('hideBox');
            //改变筛查按钮状态
            $("#screen1").removeClass('gray_btn').addClass('screen_btn');
            // 会员筛选页面点击button时显示“已选择条件”栏目
            $(".memberTerms").removeClass('hideBox');
            // 快速选择和会员筛选页面点击button时改变筛选、下一步、清空按钮的状态
            $(".screen_btn,.next_btn").hover(function() {
                $(this).toggleClass('screeningHover');
            });
            $(".clear_btn").hover(function() {
                $(this).toggleClass('clearHover');
            })
            $(".next_btn,#sendMsgBtn").on({
                mousedown: function() {
                    $(this).addClass('screenClick');
                },
                mouseup: function() {
                    $(this).removeClass('screenClick');
                }
            });
            $(".clear_btn,#pre_btn").on({
                    mousedown: function() {
                        $(this).addClass('clearClick');
                    },
                    mouseup: function() {
                        $(this).removeClass('clearClick');
                    }
                })
                // 筛选按钮功能
            $("#screen1").on({
                click: function() {
                    $(".loadingText").removeClass('hideBox');
                },
                mousedown: function() {
                    $(this).addClass('screenClick');
                },
                mouseup: function() {
                    $(this).removeClass('screenClick');
                },
                hover: function() {
                    $(this).toggleClass('screeningHover');
                }

            });
            // 清空按钮，使页面恢复未选择前（刚进入时）的状态
            $(".operate_btn .clear_btn").on('click', function() {
                $(".quickSelect .btn,.memberScreen .btn").removeClass("active");
                $(".delete").parent().addClass('hideBox');
                $(".memberTab").children().addClass('hideBox');
                $(".loadingText,.quickResult,.memberList").addClass('hideBox');
                $(".message_tab,.memberScreen").removeClass('hideBox');
            })
        });

        //选择商品选择逻辑开始
        //选择商品:点击选择按钮
        $('#chooseGoods').on('shown.bs.modal', function() {
            //先判断表格是否已经被初始化，如果没有，则初始化。
            if (!($.fn.dataTable.isDataTable("#importantGoodsTable"))) {
                messageMarketingItem.importantGoodsAjax();
            };
            $("#goodsList .btn-group").children('[data-target="#chooseGoods"]').removeClass("active");
        });

        //点击选择商品的删除图标：删除对应的父标签，并删除弹出框中的选项和表格对应的值
        $("#goodsList").on("click", ".glyphicon-remove", function() {
            //删除弹出框中的选项
            var goodsId = $(this).parent().children("input").attr("data-goodslist");
            $("#goodsList .selectedItem").children().each(function(index) {
                if ($(this).attr("goods-id") == goodsId) {
                    $(this).remove();
                }
            });
            //删除表格对应的选项 TODO 暂时添加一个商品ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingImportantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });

        //点击选择商品->选择模态框->已选择区域的删除图标：删除对应的父标签，并删除主页面选项和表格对应的值
        $("#goodsList .selectedItem").on("click", ".glyphicon-remove", function() {
            var goodsId = $(this).parent().attr("goods-id");
            //删除表格对应的选项 TODO 暂时添加一个商品ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingImportantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });
        //选择商品选择逻辑结束

        //选择药店选择逻辑开始
        //选择药店:点击选择按钮
        $('#chooseBranchStoreList').on('shown.bs.modal', function() {
            //先判断表格是否已经被初始化，如果没有，则初始化。
            if (!($.fn.dataTable.isDataTable("#branchStoreTable"))) {
                messageMarketingItem.branchStoreAjax();
            };
            $("#cBranchStoreList .btn-group").children('[data-target="#chooseBranchStoreList"]').removeClass("active");
        });

        //点击选择药店的删除图标：删除对应的父标签，并删除弹出框中的选项和表格对应的值
        $("#cBranchStoreList").on("click", ".glyphicon-remove", function() {
            //删除弹出框中的选项
            var branchStoreId = $(this).parent().children("input").attr("data-branchStoreId");
            $("#cBranchStoreList .selectedItem").children().each(function(index) {
                if ($(this).attr("branchStoreId") == branchStoreId) {
                    $(this).remove();
                }
            });
            //删除表格对应的选项 TODO 暂时添加一个门店ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingBranchStoreTable.rows('.' + branchStoreId).deselect();
            //删除最近门店
            $(this).parent().remove();
        });

        //点击选择最近消费门店->选择模态框->已选择区域的删除图标：删除对应的父标签，并删除主页面选项和表格对应的值
        $("#cBranchStoreList .selectedItem").on("click", ".glyphicon-remove", function() {
            var branchStoreId = $(this).parent().attr("branchStoreId");
            //删除表格对应的选项 TODO 暂时添加一个门店ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingBranchStoreTable.rows('.' + branchStoreId).deselect();
            //删除指定门店
            $(this).parent().remove();
        });
        //选择门店选择逻辑结束

        //选择测量药店选择逻辑开始
        //选择测量药店:点击选择按钮
        $('#chooseMeasureBranchStoreList').on('shown.bs.modal', function() {
            //先判断表格是否已经被初始化，如果没有，则初始化。
            if (!($.fn.dataTable.isDataTable("#measureBranchStoreTable"))) {
                messageMarketingItem.measureBranchStoreAjax();
            };
            $("#hBranchStoreList .btn-group").children('[data-target="#chooseMeasureBranchStoreList"]').removeClass("active");
        });

        //点击选择药店的删除图标：删除对应的父标签，并删除弹出框中的选项和表格对应的值
        $("#hBranchStoreList").on("click", ".glyphicon-remove", function() {
            //删除弹出框中的选项
            var measureBranchStoreId = $(this).parent().children("input").attr("data-measureBranchStoreId");
            $("#hBranchStoreList .selectedItem").children().each(function(index) {
                if ($(this).attr("measureBranchStoreId") == measureBranchStoreId) {
                    $(this).remove();
                }
            });
            //删除表格对应的选项 TODO 暂时添加一个门店ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows('.' + measureBranchStoreId).deselect();
            //删除最近门店
            $(this).parent().remove();
        });

        //点击选择最近消费门店->选择模态框->已选择区域的删除图标：删除对应的父标签，并删除主页面选项和表格对应的值
        $("#hBranchStoreList .selectedItem").on("click", ".glyphicon-remove", function() {
            var measureBranchStoreId = $(this).parent().attr("measureBranchStoreId");
            //删除表格对应的选项 TODO 暂时添加一个门店ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows('.' + measureBranchStoreId).deselect();
            //删除指定门店
            $(this).parent().remove();
        });
        //选择门店选择逻辑结束

        // 会员筛选页面选中相应的筛查条件后显示相应条件的不同属性，同时反选筛查条件隐藏该条件对应的属性
        $(".memberScreen .btn").each(function(index) {
            var $listNode1 = $(this);
            $listNode1.click(function() {
                if ($(this).hasClass('active')) {
                    // $(".termsList .btn-group .userDefine").eq(index).removeClass("itemChecked").children().removeClass("chooseItem");
                    $(".termsList .btn-group .date").eq(index).addClass('hideBox');
                    var getItem = $(".memberScreen .active").length;
                    if (getItem == 1) {
                        $(".memberScreen .btn").eq(index).parent().removeClass("active");
                        $(".memberTerms,.memberBtns,.memberTerms .message_tab").addClass('hideBox');
                        $(".delete").eq(index).parent().addClass('hideBox').siblings().addClass('hideBox');
                        $(".delete").parent().addClass('hideBox');
                    } else {
                        $(".termsList>li").eq(index).addClass('hideBox');
                    }
                } else {
                    $(".memberTerms,.memberBtns,.memberTerms .message_tab").removeClass('hideBox');
                    $(".termsList>li").eq(index).removeClass('hideBox');
                }
            });

            // 删除按钮，点击即隐藏相应的筛选条件，若只有一个筛查条件，点击删除后页面恢复未点击状态
            $(".delete").eq(index).on('click', function() {
                var getItem = $(".memberScreen .active").length;
                $(".termsList .team_list .userDefine").eq(index).removeClass("active");
                $(".termsList .team_list .date").eq(index).addClass('hideBox');
                if (getItem == 1) {
                    $(".memberTerms,.memberBtns").addClass('hideBox');
                    $(".delete").parent().addClass('hideBox');
                    $(".memberScreen .btn").eq(index).removeClass("active");
                } else {
                    $(this).parent().addClass('hideBox');
                    $(".memberScreen .btn").eq(index).removeClass("active");
                }
            })
        });
        // 点击自定义按钮显示相应的自定义框
        $(".termsList .btn").each(function(index) {
            $(this).click(function() {
                if ($(this).hasClass('userDefine')) {
                    if ($(this).next().hasClass('hideBox')) {
                        $(this).next().removeClass('hideBox');
                    } else {
                        $(this).next().addClass('hideBox');
                    }
                } else {
                    $(this).siblings('.date').addClass('hideBox');
                }
            })
        });

        // 会员筛选页面点击筛查按钮执行的操作
        $("#screen1").on('click', function() {
            var curDate = messageMarketingItem.formateDate(GetDateStr(0, 0));
            // 每点击一次筛选就初始化一次数组，以便更新数组中当前的筛选条件
            var tipsArr = []; //存储选项对应的值
            var categoryVal = []; //存储选中的选项
            var tipsArr_1 = [];
            var categoryVal_1 = [];

            var data = {
                "mStId": messageMarketingItem.mainStoreId
            };

            // 获取筛选条件的个数
            var itemLength = $(".check_box label[class$='active']").length;
            for (var i = 0; i < itemLength; i++) {
                var itemVal = ($(".check_box label[class$='active']").children().eq(i).attr("data-name"));
                if (itemVal !== undefined) {
                    //标签处理
                    if (itemVal == "customTagList") {
                        categoryVal.push(itemVal);
                        var listLength = $("#tagList label[class$='active']").length;
                        // console.log(listLength);
                        var listVal = "";
                        if (listLength == 1) {
                            tipsArr.push($("#tagList label[class$='active']").children().attr("data-tagid") + ',');
                        } else {
                            for (var k = 0; k < listLength; k++) {
                                listVal += $("#tagList label[class$='active']").children().eq(k).attr("data-tagid") + ',';
                            }
                            tipsArr.push(listVal);
                        }
                    } else {
                        //选择商品
                        if (itemVal == "goodsList") {
                            categoryVal.push(itemVal);
                            var listLength = $("#goodsList label[class$='active']").length;
                            // console.log(listLength);
                            var listVal = "";
                            if (listLength == 1) {
                                tipsArr.push($("#goodsList label[class$='active']").children("input").attr("data-goodsList") + ',');
                            } else {
                                for (var k = 0; k < listLength; k++) {
                                    listVal += $("#goodsList label[class$='active']").children("input").eq(k).attr("data-goodsList") + ',';
                                }
                                tipsArr.push(listVal);
                            }
                        } else {
                            //选择消费门店
                            if (itemVal == "cBranchStoreList") {
                                categoryVal.push(itemVal);
                                var listLength = $("#cBranchStoreList label[class$='active']").length;
                                // console.log(listLength);
                                var listVal = "";
                                if (listLength == 1) {
                                    tipsArr.push($("#cBranchStoreList label[class$='active']").children("input").attr("data-branchStoreId") + ',');
                                } else {
                                    for (var k = 0; k < listLength; k++) {
                                        listVal += $("#cBranchStoreList label[class$='active']").children("input").eq(k).attr("data-branchStoreId") + ',';
                                    }
                                    tipsArr.push(listVal);
                                }
                            } else {
                                //选择测量门店
                                if (itemVal == "hBranchStoreList") {
                                    categoryVal.push(itemVal);
                                    var listLength = $("#hBranchStoreList label[class$='active']").length;
                                    // console.log(listLength);
                                    var listVal = "";
                                    if (listLength == 1) {
                                        tipsArr.push($("#hBranchStoreList label[class$='active']").children("input").attr("data-measureBranchStoreId") + ',');
                                    } else {
                                        for (var k = 0; k < listLength; k++) {
                                            listVal += $("#hBranchStoreList label[class$='active']").children("input").eq(k).attr("data-measureBranchStoreId") + ',';
                                        }
                                        tipsArr.push(listVal);
                                    }
                                } else {
                                    categoryVal.push(itemVal);
                                }
                            }
                        }
                    }
                }
                var dataName = $(".termsList>li").not(".hideBox").find("label.btn"); //Bug:增加.btn的过滤防止找到模态框中的label
                // console.log(dataName);
                //获取已选择条件的长度
                var termsLength = dataName.length;
                // console.log(termsLength);
                for (var j = 0; j < termsLength; j++) {
                    if ($(".termsList>li").not(".hideBox").eq(i).find("label").eq(j).hasClass('active')) {
                        var curTips = $(".termsList>li").not(".hideBox").eq(i).find("label").eq(j).children().attr("data-name");
                        // 获取自定义范围
                        var curStart = $(".termsList li").not(".hideBox").not(".paginate_button").eq(i).find(".startNum").val();
                        var curEnd = $(".termsList li").not(".hideBox").not(".paginate_button").eq(i).find(".endNum").val();
                        // 多选条件(疾病类，个人设备)处理，选中则返回true
                        if ((curTips == "hasHtn") || (curTips == "hasHtnHigh") || (curTips == "hasHtnLevel1") ||
                            (curTips == "hasHtnLevel2") || (curTips == "hasHtnLevel3") || (curTips == "hasDm") ||
                            (curTips == "hasDm1") || (curTips == "hasDm2") || (curTips == "hasDmIgr") ||
                            (curTips == "hasAbl") || (curTips == "htnComplDm") || (curTips == "htnComplCd") ||
                            (curTips == "htnComplKidney") || (curTips == "htnComplDmg") || (curTips == "htnComplAbl") ||
                            (curTips == "dmComplDmg") || (curTips == "dmComplKidney") || (curTips == "dmComplCd") ||
                            (curTips == "dmComplEye") || (curTips == "dmComplNeuropathy") || (curTips == "dmComplFoot") ||
                            (curTips == "dmComplAbl") || (curTips == "hasBpDevice") || (curTips == "hasBsDevice")) {
                            var getSickness = $(".termsList>li").not(".hideBox").eq(i).find("label").eq(j).children().attr("data-bool");
                            var sickLength = $(".termsList>li").not(".hideBox").eq(i).find("label").find(".active").length;
                            categoryVal_1.push(curTips);
                            tipsArr_1.push(getSickness);
                        } else if ((curTips == "今天") || (curTips == "近7天") || (curTips == "近1个月") || (curTips == "近3个月") || (curTips == "自定义") || (curTips == "userDefined")) {
                            var lastDate;
                            // 时间段格式处理
                            switch (true) {
                                case curTips == "今天":
                                    var rangeDate = curDate + '-' + curDate;
                                    tipsArr.push(rangeDate);
                                    break;
                                case curTips == "近7天":
                                    lastDate = messageMarketingItem.formateDate(GetDateStr(0, -7));
                                    var rangeDate = lastDate + '-' + curDate;
                                    tipsArr.push(rangeDate);
                                    break;
                                case curTips == "近1个月":
                                    lastDate = messageMarketingItem.formateDate(GetDateStr(0, -30));
                                    var rangeDate = lastDate + '-' + curDate;
                                    tipsArr.push(rangeDate);
                                    break;
                                case curTips == "近3个月":
                                    lastDate = messageMarketingItem.formateDate(GetDateStr(0, -90));
                                    var rangeDate = lastDate + '-' + curDate;
                                    tipsArr.push(rangeDate);
                                    break;
                                case curTips == "自定义":
                                    var para = $(".termsList>li").not(".hideBox").eq(i).find(".userRange input").attr("class");
                                    tipsArr.push(messageMarketingItem.formatDateRange($("." + para).val()));
                                    break;
                                case curTips == "userDefined":
                                    var rangeDate = curStart + '-' + curEnd;
                                    tipsArr.push(rangeDate);
                                    break;
                                default:
                                    error;
                            }
                        } else if (curTips !== undefined) {
                            tipsArr.push(curTips);
                        }
                    }
                }
            }
            //会员筛选返回的数据
            function passPara() {
                // 数组合并
                categoryVal = categoryVal.concat(categoryVal_1);
                tipsArr = tipsArr.concat(tipsArr_1);
                var length;
                if (sickLength == undefined) {
                    length = itemLength;
                } else {
                    length = sickLength + itemLength + 3;
                }
                // 给data赋值
                for (var i = 0; i < length; i++) {
                    if (tipsArr[i] != "") { //Bug:如果用户没有选择门店或者药品，则不需要传此参数
                        var item = categoryVal[i];
                        var term = tipsArr[i];
                        data[categoryVal[i]] = tipsArr[i];
                    }
                }
                // 判断是否过滤
                if (data.smsLastTime == "不过滤") {
                    delete data.smsLastTime;
                }
                delete data.undefined;

                console.log(data);

                messageMarketingItem.memberFilterData = data;
            }

            passPara();
            //暂时为了演示，请求两个Ajax以此来解决表头和列不一致的问题
            messageMarketingItem.chooseMemberAjax();
            messageMarketingItem.chooseMemberAjax();
        });

    },

    // 日期格式化
    formateDate: function(dateStr) {
        return dateStr.split(" - ")[0].replace(/[^0-9]/ig, "") + "000000";
    },
    formatDateRange: function(rangeStr) {
        var beginStr = rangeStr.split(" - ")[0].replace(/[^0-9]/ig, "") + "000000";
        var endStr = rangeStr.split(" - ")[1].replace(/[^0-9]/ig, "") + "235959";
        return beginStr + "-" + endStr;
    },

    //选择商品弹框选择：Ajax请求
    importantGoodsAjax: function() {
        //初始化指定商品表格
        messageMarketingItem.messageMarketingImportantGoodsTable = $('#importantGoodsTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "ftlp",
            "scrollX": 480,
            //以下是表格内容多选属性
            "columnDefs": [{
                "orderable": false,
                "className": 'select-checkbox', //选择行
                "targets": 0
            }],
            "select": {
                "style": 'multi', //多选
                "selector": 'td:first-child'
            },
            //以上是表格内容多选属性
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    return messageMarketingItem.prepareImportantGoodsApiParams(d);
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(messageMarketingItem.getImportantGoodsDataFromServer(data));
                },
                error: function(msg) { //获取数据失败之后的信息
                    alert(serverError + JSON.stringify(msg));
                }
            },
            "columns": messageMarketingItem.messageMarketingImportantGoodsTableColumns,
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

        $('.input-sm').attr("placeholder", "请选择药品");

        //选择商品：点击商品事件
        messageMarketingItem.messageMarketingImportantGoodsTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingImportantGoodsTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingImportantGoodsTable.rows(indexes).nodes().to$().addClass(rowData[0].drugId);
                $("#goodsList .selectedItem").append('<a class="chosenObject" goods-id="' + rowData[0].drugId + '">' + rowData[0].name + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + '</a>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingImportantGoodsTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingImportantGoodsTable.rows(indexes).nodes().to$().removeClass(rowData[0].drugId);
                $("#goodsList .selectedItem").children('[goods-id="' + rowData[0].drugId + '"]').remove();
            });
    },

    //指定商品：准备访问API的相关参数
    prepareImportantGoodsApiParams: function(d) {
        messageMarketingItem.messageMarketingImportantGoodsApiParams = {
            "groupId": messageMarketingItem.groupId,
            "mStId": messageMarketingItem.mainStoreId
        };
        return $.extend(messageMarketingItem.messageMarketingImportantGoodsApiParams, getDataTableNoServerPageParams("get", "/clCrm/api/crm/drugs/important"));
    },

    //指定商品：处理访问API之后得到的数据集
    getImportantGoodsDataFromServer: function(data) {
        var result = {};
        result.data = data.dataList;
        return result;
    },

    //最近消费门店弹框选择：Ajax请求
    branchStoreAjax: function() {
        //初始化最近消费门店表格
        messageMarketingItem.messageMarketingBranchStoreTable = $('#branchStoreTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "ftlp",
            "scrollX": 480,
            //以下是表格内容多选属性
            "columnDefs": [{
                "orderable": false,
                "className": 'select-checkbox', //选择行
                "targets": 0
            }],
            "select": {
                "style": 'multi', //多选
                "selector": 'td:first-child'
            },
            //以上是表格内容多选属性
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    return messageMarketingItem.prepareBranceStoreApiParams(d);
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(messageMarketingItem.getBranceStoreDataFromServer(data));
                },
                error: function(msg) { //获取数据失败之后的信息
                    alert(serverError + JSON.stringify(msg));
                }
            },
            "columns": messageMarketingItem.messageMarketingBranchStoreTableColumns,
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

        $('.input-sm').attr("placeholder", "请输入门店名称");

        //最近消费门店：点击门店事件
        messageMarketingItem.messageMarketingBranchStoreTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingBranchStoreTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingBranchStoreTable.rows(indexes).nodes().to$().addClass(rowData[0].branchStoreId);
                $("#cBranchStoreList .selectedItem").append('<a class="chosenObject" branchStoreId="' + rowData[0].branchStoreId + '">' + rowData[0].branchStoreName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + '</a>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingBranchStoreTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingBranchStoreTable.rows(indexes).nodes().to$().removeClass(rowData[0].branchStoreId);
                $("#cBranchStoreList .selectedItem").children('[branchStoreId="' + rowData[0].branchStoreId + '"]').remove();
            });
    },

    //最近消费门店：准备访问API的相关参数 +"'
    prepareBranceStoreApiParams: function(d) {
        messageMarketingItem.messageMarketingBranchStoreApiParams = {
            "mStId": messageMarketingItem.mainStoreId
        };
        return $.extend(messageMarketingItem.messageMarketingBranchStoreApiParams, getDataTableNoServerPageParams("get", "/clEnterprise/api/store/branchStoreInfos"));
    },

    //最近消费门店：处理访问API之后得到的数据集
    getBranceStoreDataFromServer: function(data) {
        var result = {};
        result.data = data.branchStoreBaseInfoList;
        return result;
    },

    //最近测量门店弹框选择：Ajax请求
    measureBranchStoreAjax: function() {
        //初始化最近消费门店表格
        messageMarketingItem.messageMarketingMeasureBranchStoreTable = $('#measureBranchStoreTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "ftlp",
            "scrollX": 480,
            //以下是表格内容多选属性
            "columnDefs": [{
                "orderable": false,
                "className": 'select-checkbox', //选择行
                "targets": 0
            }],
            "select": {
                "style": 'multi', //多选
                "selector": 'td:first-child'
            },
            //以上是表格内容多选属性
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    return messageMarketingItem.prepareMeasureBranceStoreApiParams(d);
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(messageMarketingItem.getMeasureBranceStoreDataFromServer(data));
                },
                error: function(msg) { //获取数据失败之后的信息
                    alert(serverError + JSON.stringify(msg));
                }
            },
            "columns": messageMarketingItem.messageMarketingBranchStoreTableColumns,
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

        $('.input-sm').attr("placeholder", "请选择门店");

        //最近测量门店：点击门店事件
        messageMarketingItem.messageMarketingMeasureBranchStoreTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows(indexes).nodes().to$().addClass(rowData[0].branchStoreId);
                $("#hBranchStoreList .selectedItem").append('<a class="chosenObject" branchStoreId="' + rowData[0].branchStoreId + '">' + rowData[0].branchStoreName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + '</a>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows(indexes).data().toArray();
                messageMarketingItem.messageMarketingMeasureBranchStoreTable.rows(indexes).nodes().to$().removeClass(rowData[0].branchStoreId);
                $("#hBranchStoreList .selectedItem").children('[branchStoreId="' + rowData[0].branchStoreId + '"]').remove();
            });
    },

    //最近测量门店：准备访问API的相关参数 +"'
    prepareMeasureBranceStoreApiParams: function(d) {
        messageMarketingItem.messageMarketingMeasureBranchStoreApiParams = {
            "mStId": messageMarketingItem.mainStoreId
        };
        return $.extend(messageMarketingItem.messageMarketingMeasureBranchStoreApiParams, getDataTableNoServerPageParams("get", "/clEnterprise/api/store/branchStoreInfos"));
    },

    //最近测量门店：处理访问API之后得到的数据集
    getMeasureBranceStoreDataFromServer: function(data) {
        var result = {};
        result.data = data.branchStoreBaseInfoList;
        return result;
    },

    //会员刷选Ajax请求
    chooseMemberAjax: function() {
        //初始化表格
        var draw; //datatables服务器分页必传参数
        $('#memberTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "destroy": true,
            "serverSide": true, //开启datatables的服务器模式
            "scrollX": true, //配置横坐标
            "lengthMenu": [10, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    draw = d.draw;
                    return messageMarketingItem.prepareChooseMemberApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(messageMarketingItem.getChoooseMemberApiParams(data, draw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }, {
                "extend": "colvis", //动态选择列
                "text": "选择列"
            }],
            "columns": messageMarketingItem.resourceType == "createDrugGroup" ? messageMarketingItem.memberShipDrugAnalysisTableColumns : messageMarketingItem.memberTableColumns,
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

        $(document).ajaxComplete(function() {
            if ($("#effectNum").text() == 0) {
                $(".loadingText").addClass('hideBox');
                $(".zeroResultText").removeClass('hideBox');
            } else {
                $(".zeroResultText").addClass('hideBox');
                $(".loadingText").addClass('hideBox');
                $(".memberList").removeClass('hideBox');
            }
        })
    },

    //会员刷选：准备访问API的相关参数
    prepareChooseMemberApiParams: function(d) {
        if (messageMarketingItem.resourceType == "createDrugGroup") {
            messageMarketingItem.memberApiParams = {
                "mStId": messageMarketingItem.mainStoreId,
                "goodsId": messageMarketingItem.goodsId,
                "orderBy": "cLastTime",
            };
            return $.extend(messageMarketingItem.memberApiParams, messageMarketingItem.memberFilterData, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
        } else {
            messageMarketingItem.memberApiParams = {
                "mStId": messageMarketingItem.mainStoreId,
                "orderBy": "cLastTime"
            };
            return $.extend(messageMarketingItem.memberApiParams, messageMarketingItem.memberFilterData, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
        }
    },

    //会员刷选和快速刷选：处理访问API之后得到的数据集
    getChoooseMemberApiParams: function(data, draw) {
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
        //显示筛查结果中的总会员数
        $("#effectNum").text(result.recordsTotal);
        return result;
    },
};

//选择商品：模态框中的确认按钮事件
function chosenGoods() {
    $("#goodsList .btn-group").children('label').not('[data-target="#chooseGoods"]').remove(); //删除除选择之外所有的Label

    $("#goodsList .selectedItem").children('a').each(function(index) {
        var goodsId = $(this).attr("goods-id");
        var goodsName = $(this).text();

        $("#goodsList .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-goodsList="' + goodsId + '" data-bool="true">' + goodsName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');
        $('#chooseGoods').modal('hide');
    });
};

//选择最近消费门店：模态框中的确认按钮事件
function chosenBranchStore() {
    $("#cBranchStoreList .btn-group").children('label').not('[data-target="#chooseBranchStoreList"]').remove(); //删除除选择之外所有的Label

    $("#cBranchStoreList .selectedItem").children('a').each(function(index) {
        var branchStoreId = $(this).attr("branchStoreId");
        var branchStoreName = $(this).text();

        $("#cBranchStoreList .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-branchStoreId="' + branchStoreId + '" data-bool="true">' + branchStoreName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');
        $('#chooseBranchStoreList').modal('hide');
    });
};

//选择最近测量门店：模态框中的确认按钮事件
function chosenMeasureBranchStore() {
    $("#hBranchStoreList .btn-group").children('label').not('[data-target="#chooseMeasureBranchStoreList"]').remove(); //删除除选择之外所有的Label

    $("#hBranchStoreList .selectedItem").children('a').each(function(index) {
        var branchStoreId = $(this).attr("branchStoreId");
        var branchStoreName = $(this).text();

        $("#hBranchStoreList .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-measureBranchStoreId="' + branchStoreId + '" data-bool="true">' + branchStoreName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');
        $('#chooseMeasureBranchStoreList').modal('hide');
    });
};


$(function() {
    messageMarketingItem.mainStoreId = $.cookie("mainStoreId");
    if (getUrlParam("resourceType")) {
        messageMarketingItem.resourceType = "createDrugGroup";
        $(".split").attr("data-type", "createDrugGroup").text("创建单一药品分组");
        $(".list_title").attr("data-type", "createDrugGroup").text('基于' + getUrlParam("goodsName") + '会员的筛查');
        $(".row-subkey").eq(0).html('该药品的' + '<br>' + '消费属性');
        $(".memberScreen .row-subkey").eq(0).css("margin-top", "5px");
        $(".memberScreen li").eq(0).css("margin-top", "10px");
        $("#commodity").remove();
        $(".btn-primary").eq(4).remove();
        $("#goodsList").remove();
        $("#grade").html("该药品" + "<br>" + "会员等级");
        $(".btn-primary").eq(16).html('<input type="checkbox" autocomplete="off" data-name="rfmLevel">' + '该药品会员等级');

        messageMarketingItem.goodsName = getUrlParam("goodsName");
        messageMarketingItem.goodsId = getUrlParam("goodsId");
    }
    messageMarketingItem.init();
});
