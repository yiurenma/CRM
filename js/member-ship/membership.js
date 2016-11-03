var membership = {
    rfmLevel: "", //RFM等级
    mainStoreId: "", //总店ID
    groupId: "", //分组ID
    goodsId: "", //药品ID
    goodsName: "",
    resourceType: "", //链接来源类型：创建分组来源；总览查看详情来源；会员管理直接进入；药品分析直接进入
    childResourceType:"", //链接来源子类型：创建分组来源分为单个药品创建分组和非单个药品创建分组
    initTable: true, //是否需要初始化表格,防止js自动初始化datatables。默认自动化初始datatables，除非页面特殊要求，可以改变这个值
    smsLastTime: "", //短信营销已发过滤时间
    dropDownClick: false,

    //与表格有关的参数
    memberShipTable: "", //会员管理表格
    memberShipApiParams: "",
    memberShipTableColumns: [{
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
        "title": "服务门店",
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
    }, {
        "data": "hLastStoreName",
        "title": "服务门店",
        "visible": false,
    }],
    //药品分析对应表头
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
        "data": "cGoodsCount",
        "title": "该药品消费件数",
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
        "title": "服务门店",
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

    //对会员管理页面进行初始化
    init: function() {
        //初始化中国时间
        moment.locale("zh-ch");

        //初始化各种默认时间
        membership.mouseEvent();

        $(".grade").append($.cookie("memberLevelStartTime") + " ~ " + $.cookie("memberLevelEndTime"));
        //创建分组-->会员管理：处理心跳获取创建分组状态逻辑
        if (membership.resourceType == "createGroup") {
            membership.createGroupAjax();
        } else {
            membership.dropDown();
            membership.initTable = true;
            membership.membershipAjax();
        }
    },

    mouseEvent: function() {
        //根据组ID删除分组
        $("#delete .taskConfirm").click(function() {
            var data = {};
            data.groupId = membership.groupId;
            var result = function(result) {
                if (!result || !result.error || result.error != 200) {
                    alert(deleteError + JSON.stringify(result));
                };
                $('#delete').modal('hide'); //关闭模态框
            };
            post("delete", "/clCrm/api/crm/groups/group", data, result);

            //删除了之后调用dropDown方法重新拉取二级菜单
            location.href = "MemberShip.html";
        });

        //删除分组
        $('#delete').on('shown.bs.modal', function() {
            //将下拉菜单上显示的组名传给模态框
            $(".screenNum").children('b').eq(1).text($("#dropdownMenu").text());
        });

        //短信营销 TODO 接口没有已发过滤选项
        $("#smsEdit .taskConfirm").click(function() {
            var data = {
                "mStId": membership.mainStoreId,
                "groupId": membership.groupId
            };
            var result = function(result) {
                if (!result || !result.error || result.error != 200) {
                    alert(serverError + JSON.stringify(result));
                };
                location.href = "SmsEdit.html";
            };
            post("post", "/clCrm/api/crm/users/table/datas", data, result);
        });

        //电话营销跳转到电话营销快速选择页面并带过去对应的groupId
        $(".phoneEdit").click(function() {
            location.href = "PhoneMarketingCreating.html?groupId=" + membership.groupId;
        });

        $(".impressionCount").click(function() {
            if ($(this).children("b").attr("data-type") == "createDrugGroup") {
                location.href = "MemberShipCreateGroup.html?mainStoreId=" + membership.mainStoreId + "&resourceType=" + $(this).children("b").attr("data-type") + "&goodsName=" + escape(membership.goodsName) + "&goodsId=" + membership.goodsId;
            } else {
                location.href = "MemberShipCreateGroup.html?mainStoreId=" + membership.mainStoreId;
            }
        });

        // 点击自定义按钮显示相应的自定义框
        $(".termsList .btn,.filterList .btn").each(function(index) {
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

        //短信营销弹出框点击确认进入短信编辑页面
        $(".taskConfirm").click(function() {
            var curTips = $("#smsMarketing").not(".hideBox").find("label.active").find("input").attr("data-name");
            var curDate = moment().format("YYYYMMDDHHmmss");
            // 时间段格式处理
            switch (true) {
                case curTips == "不过滤":
                    membership.smsLastTime = "";
                    break;
                case curTips == "今天":
                    membership.smsLastTime = moment().format("YYYYMMDD") + "000000" + '-' + curDate;
                    break;
                case curTips == "近7天":
                    var lastDate = moment().subtract(7, "days").format("YYYYMMDD") + "000000";
                    membership.smsLastTime = lastDate + '-' + curDate;
                    break;
                case curTips == "近30天":
                    var lastDate = moment().subtract(30, "days").format("YYYYMMDD") + "000000";
                    membership.smsLastTime = lastDate + '-' + curDate;
                    break;
                case curTips == "自定义":
                    var para = $("#smsMarketing").not(".hideBox").find(".userRange input");
                    var lastDate = moment().subtract(parseInt(para.val()), "days").format("YYYYMMDD") + "000000";
                    membership.smsLastTime = lastDate + '-' + curDate;
                    break;
                default:
                    error;
            };
            membership.smsMarketingPreparationAjax();
        });
    },

    //心跳查询创建分组状态
    createGroupAjax: function() {
        $(".create-group-status").attr("style", "display:inherit");
        var createGroupTimer = setInterval(function() {
            var success = function(result) {
                //创建成功清除心跳并显示表格内容
                if (result.status == 1) {
                    clearInterval(createGroupTimer);
                    $(".create-group-status").attr("style", "display:none");
                    membership.initTable = true;
                    membership.membershipAjax();
                    membership.dropDown();
                } else if (result.status == 3) {
                    //创建失败清除心跳并显示心跳结果
                    $(".create-group-status").attr("style", "display:inherit");
                    $(".create-group-status").text("创建失败");
                    clearInterval(createGroupTimer);
                    membership.initTable = false;
                } else if (result.status == 2) {
                    //创建中则继续进行心跳查询
                    $(".create-group-status").attr("style", "display:inherit");
                    membership.initTable = false;
                }
            };
            var data = {
                "groupId": membership.groupId
            };
            ajaxWithoutAsync("get", "/clCrm/api/crm/groups/group/status", data, success);
        }, 5000); //5秒 
    },

    membershipAjax: function() {
        if (membership.initTable) {
            //初始化表格
            var draw; //datatables服务器分页必传参数
            $('#memberShipTable').DataTable({
                //以下是对表格获得数据的设置
                "dom": "fBtlp",
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
                        return membership.prepareApiParams(d);
                    },
                    "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                        data = jQuery.parseJSON(data);
                        return JSON.stringify(membership.apiDataFromServer(data, draw));
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
                "columns": membership.resourceType == "drugAnalysis" || membership.childResourceType == "drugAnalysis" ? membership.memberShipDrugAnalysisTableColumns : membership.memberShipTableColumns,
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

            $('.input-sm').attr("placeholder", "请输入会员联系方式或姓名");
        }
    },

    //准备访问API的相关参数
    prepareApiParams: function(d) {
        if ($(".input-sm").val()) { //查询逻辑
            membership.memberShipApiParams = {
                "mStId": membership.mainStoreId,
                "content": $(".input-sm").val(), //查询内容
                "rfmLevel": membership.rfmLevel,
                "groupId": membership.groupId
            };
            return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas/search"));
        } else if(membership.dropDownClick){
            if(membership.goodsId){
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "groupId": membership.groupId,
                    "goodsId": membership.goodsId,
                };
            } else {
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "groupId": membership.groupId,
                };
            }
            return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
        } else {
            //从总览界面进入会员管理
            if (membership.resourceType == "generalView") {
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "rfmLevel": membership.rfmLevel,
                };
                return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
            //从非单品创建分组进入会员管理
            } else if (membership.resourceType == "createGroup" && membership.childResourceType != "drugAnalysis") {
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "groupId": membership.groupId,
                };
                return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
            //从单品创建分组进入会员管理
            } else if (membership.resourceType == "createGroup" && membership.childResourceType == "drugAnalysis") {
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "groupId": membership.groupId,
                    "goodsId": membership.goodsId,
                };
                return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
            //从单品分析进入会员管理
            } else if (membership.resourceType == "drugAnalysis") {
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "rfmLevel": membership.rfmLevel,
                    "goodsId": membership.goodsId
                };
                return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
            //从会员管理直接进入
            } else if(membership.resourceType == ""){
                membership.memberShipApiParams = {
                    "mStId": membership.mainStoreId,
                    "orderBy": "cLastTime",
                    "groupId": membership.groupId,
                };
                return $.extend(membership.memberShipApiParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas"));
            }


        }
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

    //二级下拉菜单
    dropDown: function() {
        var success = function(result) {
            var areaCont = "";
            var i = 0;
            var crmGroupFirstClassList = result.crmGroupFirstClassList;
            //总览->查看详情->会员管理：链接中有rfmLevel关键词，则组名第一次显示逻辑：第一组分类的第一个组;并且不会显示删除功能
            if (membership.resourceType == "generalView") {
                $("#dropdownMenu").html(getUrlParam("rfmName") + "（" + getUrlParam("totalCount") + "）" + '<span class="caret"></span>')
                $(".short .left_shot:eq(0)").attr("style", "display:none");
                membership.groupId = crmGroupFirstClassList[0].crmGroupList[0].id;
            //非单个药品创建分组：不显示单个药品的名称
            } else if (membership.resourceType == "createGroup" && membership.childResourceType == "") {
                //创建分组->会员管理：链接中有groupId关键词，则组名第一次显示逻辑：显示链接中的组名和组员数量
                $("#dropdownMenu").html(getUrlParam("groupName") + "（" + getUrlParam("groupNum") + "）" + '<span class="caret"></span>');
            //单个药品创建分组：显示单个药品的名称
            } else if (membership.resourceType == "createGroup" && membership.childResourceType == "drugAnalysis") {
                //创建分组->会员管理：链接中有groupId关键词，则组名第一次显示逻辑：显示链接中的组名和组员数量
                $("#dropdownMenu").html(getUrlParam("groupName") + "（" + getUrlParam("groupNum") + "）" + membership.goodsName +'<span class="caret"></span>');
            }else if (membership.resourceType == "drugAnalysis") {
                $(".short .left_shot:eq(0)").attr("style", "display:none");
                if (getUrlParam("rfmName") == null) {
                    $("#dropdownMenu").html(getUrlParam("goodsName") + "全部会员" + '<span class="caret"></span>');
                } else {
                    $("#dropdownMenu").html(getUrlParam("goodsName") + getUrlParam("rfmName") + "（" + getUrlParam("totalCount") + "）" + '<span class="caret"></span>');
                }
                //药品分析->会员管理         
            } else {
                //会员管理：链接中没有任何参数，则默认是第一个组的名称和组员数量
                if (crmGroupFirstClassList && crmGroupFirstClassList[0].crmGroupList) {
                    $("#dropdownMenu").html(crmGroupFirstClassList[0].crmGroupList[0].name + "（" + crmGroupFirstClassList[0].crmGroupList[0].num + "）" + '<span class="caret"></span>')
                }
                $(".short .left_shot:eq(0)").attr("style", "display:none");
                membership.groupId = crmGroupFirstClassList[0].crmGroupList[0].id;
            }

            //初始化二级和三级下拉菜单
            for (var p in crmGroupFirstClassList) {
                //如果下拉菜单的对象有子菜单并且下拉菜单的对象不是“单个药品分类”
                if (crmGroupFirstClassList[p].crmGroupList.length != 0 && crmGroupFirstClassList[p].type != 3) {
                    areaCont += '<li class="dropdown-submenu"><a tabindex="-1" href="#">' + crmGroupFirstClassList[p].name + '</a>';
                    areaCont += '<ul class="dropdown-menu">';
                    for (var q in crmGroupFirstClassList[p].crmGroupList) {
                        //如果我的分组是基于单个药品的分组
                        if(crmGroupFirstClassList[p].crmGroupList[q].goodsId){
                           areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' groupId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].goodsId +' data-goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].goodsName +' href="#"><a>' + crmGroupFirstClassList[p].crmGroupList[q].name + "（" + crmGroupFirstClassList[p].crmGroupList[q].num + "）" + '<span>'+crmGroupFirstClassList[p].crmGroupList[q].goodsName +'</span></a></li>'; 
                        } else {
                           areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' groupId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' href="#"><a>' + crmGroupFirstClassList[p].crmGroupList[q].name + "（" + crmGroupFirstClassList[p].crmGroupList[q].num + "）" + '</a></li>';  
                        }
                        
                    }
                    areaCont += '</ul>';
                    areaCont += "</li>";
                } else if (crmGroupFirstClassList[p].crmGroupList.length != 0 && crmGroupFirstClassList[p].type == 3) {
                    areaCont += '<li class="dropdown-submenu"><a tabindex="-1" href="#">' + crmGroupFirstClassList[p].name + '</a>';
                    areaCont += '<ul class="dropdown-menu">';
                    for (var q in crmGroupFirstClassList[p].crmGroupList) {
                        areaCont += '<li class="dropdown-submenu"><a tabindex="-1" href="#">' + crmGroupFirstClassList[p].crmGroupList[q].name + "（" + crmGroupFirstClassList[p].crmGroupList[q].num + "）" + '</a>';
                        areaCont += '<ul class="dropdown-menu">';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[0].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 1 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[1].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 2 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[2].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 3 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[3].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 4 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[4].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 5 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[5].name + '</a></li>';
                        areaCont += '<li onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' goodsId=' + crmGroupFirstClassList[p].crmGroupList[q].id + ' goodsName=' + crmGroupFirstClassList[p].crmGroupList[q].name + ' rfmLevel=' + 6 + ' href="#"><a>' + crmGroupFirstClassList[0].crmGroupList[6].name + '</a></li>';
                        areaCont += '</ul>';
                        areaCont += '</li>'
                    }
                    areaCont += '</ul>';
                    areaCont += "</li>";
                } else {
                    //如果下拉菜单的对象没有子菜单
                    areaCont += '<li  onclick="changeTableContent.call(this)" groupType=' + crmGroupFirstClassList[p].type + ' href="#"><a>' + crmGroupFirstClassList[p].name + '</a></li>';
                }
            }
            $(".dropdown-menu").html(areaCont);
            membership.dropDownClick = false;
        };
        var data = {
            mStId: membership.mainStoreId
        };
        post("get", "/clCrm/api/crm/groups/tree", data, success);
    },

    smsMarketingPreparationAjax: function() {
        var success = function(result) {
            location.href = "SmsEdit.html?allNum=" + result.totalCount + "&effectNum=" + result.effectCount + "&groupId=" + membership.groupId + "&smsLastTime=" + membership.smsLastTime + "&type=messageMarketingQuickSearch";
        };

        var data = {
            "mStId": membership.mainStoreId,
            "smsLastTime": membership.smsLastTime,
            "groupId": membership.groupId,
        };
        post("post", "/clCrm/api/crm/marketing/sms/preparation", data, success);
    },
};

function changeTableContent() {
    //改变文本
    //如果是系统分组会员和单个药品会员，则删除功能无效
    if ($(this).attr("groupType") == 1 || $(this).attr("groupType") == 3) {
        $(".short .left_shot:eq(0)").attr("style", "display:none");
        //如果是系统分组，则根据groupId得到相应表格中的内容
        if ($(this).attr("groupType") == 1) {
            $("#dropdownMenu").html($(this).text() + '<span class="caret"></span>');
            $(".impressionCount").children("b").text("创建分组");
            $(".impressionCount").children("b").removeAttr("data-type");
            membership.groupId = $(this).attr("groupId");
            membership.resourceType = "createGroup";
            membership.childResourceType = "";
        }
        //如果是单个药品分组，则根据药品的ID和对应的rfm等级得到对应的表格内容
        if ($(this).attr("groupType") == 3) {
            $("#dropdownMenu").html($(this).attr("goodsName") + $(this).text() + '<span class="caret"></span>');
            $(".impressionCount").children("b").attr("data-type", "createDrugGroup").text("创建该药品分组");
            membership.goodsId = $(this).attr("goodsId");
            membership.goodsName = $(this).attr("goodsName");
            membership.rfmLevel = $(this).attr("rfmLevel");
            membership.resourceType = "drugAnalysis";           
        }
    } else {
        //如果是我的分组，则可以删除该组
        //如果是我的分组并且不是单个药品的分组	
        if ($(this).attr("groupType") == 2 && !$(this).attr("goodsId")) {
            $("#dropdownMenu").html($(this).text() + '<span class="caret"></span>');
            $(".short .left_shot:eq(0)").attr("style", "display:inherit");
            $(".impressionCount").children("b").text("创建分组");
            $(".impressionCount").children("b").removeAttr("data-type");
            membership.groupId = $(this).attr("groupId");
            membership.goodsId = "";
            membership.resourceType = "createGroup";
        }
        //如果是我的分组并且是单个药品的分组
        if ($(this).attr("groupType") == 2 && $(this).attr("goodsId")) {
            $("#dropdownMenu").html($(this).text() + '<span class="caret"></span>');
            $(".short .left_shot:eq(0)").attr("style", "display:inherit");
            $(".impressionCount").children("b").attr("data-type", "createDrugGroup").text("创建该药品分组");
            membership.groupId = $(this).attr("groupId");
            membership.goodsId = $(this).attr("goodsId");
            membership.goodsName = $(this).attr("data-goodsName");
            membership.resourceType = "drugAnalysis";
        }
    }
    membership.dropDownClick = true;
    membership.initTable = true;
    membership.membershipAjax();
};

$(function() {
    membership.mainStoreId = $.cookie("mainStoreId");

    //总览来源
    if (getUrlParam("rfmLevel")) {
        membership.rfmLevel = getUrlParam("rfmLevel");
        membership.resourceType = "generalView";
    }
    //创建分组来源
    if (getUrlParam("groupId")) {
        //单个药品创建分组来源
        if (getUrlParam("goodsId")) {
            membership.groupId = getUrlParam("groupId");
            membership.goodsId = getUrlParam("goodsId");
            membership.goodsName = getUrlParam("goodsName");
            membership.resourceType = "createGroup";
            membership.childResourceType = "drugAnalysis";
            $(".impressionCount").children("b").attr("data-type", "createDrugGroup").text("创建该药品分组");
        //非单个药品创建分组来源
        } else {
            membership.groupId = getUrlParam("groupId");
            membership.resourceType = "createGroup";
        }
    //药品分析来源
    } else { 
        if (getUrlParam("goodsId")) {
            membership.rfmLevel = getUrlParam("rfmLevel");
            membership.goodsId = getUrlParam("goodsId");
            membership.goodsName = getUrlParam("goodsName");
            membership.resourceType = "drugAnalysis";
            $(".impressionCount").children("b").attr("data-type", "createDrugGroup").text("创建该药品分组");
        }
    }
    //初始化会员管理页面
    membership.init();
});
