var serviceItem = {
    mainStoreId: "",
    open: false,
    destination: "",
    serviceId: "",
    serviceName: "",
    startDate: "",
    endDate: "",
    echartsData: "",
    extend:"",
    goodsJson:"",

    //重点药品表格相关参数
    importantGoodsTable: "",
    importantGoodsApiParams: "",
    importantGoodsTableColumns: [{
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
    }, {
        "data": "drugId",
        "titile":"药店ID",
        "visible":false
    }],

    //服务列表表单
    serviceTable: "",
    serviceApiParams: "",
    serviceTableColumns: [{
        "data": "createDate",
        "title": "日期",
    }, {
        "data": "todayCount",
        "title": "通知数",
    }],

    init: function() {
        //初始化页面主题
        $(".title").text(serviceItem.serviceName);

        //根据链接请求得到对应的服务设置
        $("#smsMarketing").children("article").addClass("hideBox");
        $("#" + serviceItem.serviceId).removeClass("hideBox");

        //初始化事件
        serviceItem.mouseEvent();

        //根据服务的状态值确定开启和关闭的状态
        if (serviceItem.open) {
            $("#" + serviceItem.serviceId + " #addTimer").prop("checked","true");
        }
        //服务开启 TODO 这里的逻辑还有点不太清晰，需要找对应的插件对其进行覆盖
        if (serviceItem.serviceId) {
            $("#" + serviceItem.serviceId + " #addTimer").click(function() {
                //如果以前是选中状态,则点击过后是不选中状态
                if (!$(this).prop("checked")) {
                    serviceItem.open = false;
                }
                //如果以前是不选中状态，则点击过后是选中状态
                if ($(this).prop("checked")) {
                    serviceItem.open = true;
                }
            });
        };
        //生日关怀、复购提醒、用药关怀赋值
        if (serviceItem.serviceId == 9 || serviceItem.serviceId == 11 || serviceItem.serviceId == 10) {
            var dateArray = new Array();
            dateArray = jQuery.parseJSON(serviceItem.extend).date;
            //生日关怀、复购提醒赋值
            if (serviceItem.serviceId == 9 || serviceItem.serviceId == 11) {
                var day = jQuery.parseJSON(JSON.stringify(dateArray[0])).day;
                var time = jQuery.parseJSON(JSON.stringify(dateArray[0])).time;
                           
                $("#" + serviceItem.serviceId + " #birth").html($("#" + serviceItem.serviceId).find("[data-id='" +day+"']").html() + '<i class="arrow_down"></i>');
                $("#" + serviceItem.serviceId + " #birth").attr("data-id", day);
                $("#" + serviceItem.serviceId + " #birthServiceActionTime").html($("#" + serviceItem.serviceId).find("[data-id='" +time+"']").html() + '<i class="arrow_down"></i>');
                $("#" + serviceItem.serviceId + " #birthServiceActionTime").attr("data-id", time);
                //如果是复购提醒，则处理对应的药品逻辑
                //初始化复购提醒中选择商品弹出框
                if(serviceItem.serviceId == 11) serviceItem.importantGoodsAjax1();
            }
            //用药关怀赋值
            if (serviceItem.serviceId == 10) {
                //初始化用药关怀中选择商品弹出框
                serviceItem.importantGoodsAjax();
                //判断用户关怀时间的个数
                for (var i = 0; i < dateArray.length; i++) {
                    //如果第一个，直接赋值
                    //如果是第二个，则将隐藏的“并且”一栏让它出现，并赋值
                    if (i == 1) {
                        $("#andActionTime").removeClass("hideBox");
                    }
                    if (i > 1){
                        $("#andActionTime").append($("#andAction").clone(true).attr("id", "andAction" + i));
                    }
                    var day = jQuery.parseJSON(JSON.stringify(dateArray[i])).day;
                    var time = jQuery.parseJSON(JSON.stringify(dateArray[i])).time;
                    $("#" + serviceItem.serviceId + " #birth").eq(i).html($("#" + serviceItem.serviceId).find("[data-id='" + day + "']").html() + '<i class="arrow_down"></i>');
                    $("#" + serviceItem.serviceId + " #birth").eq(i).attr("data-id", day);
                    $("#" + serviceItem.serviceId + " #birthServiceActionTime").eq(i).html($("#" + serviceItem.serviceId).find("[data-id='" + time + "']").html() + '<i class="arrow_down"></i>');
                    $("#" + serviceItem.serviceId + " #birthServiceActionTime").eq(i).attr("data-id", time);
                }
            }
        }

        //初始化默认时间
        moment.locale("zh-cn");
        var start = moment().subtract(30, 'days').format("L"); //YYYY年MM月DD日
        var end = moment().format("L"); //YYYY年MM月DD日
        serviceItem.endDate = getDayLastTime(end); //YYYYMMDDHHMMSS
        serviceItem.startDate = getTime(start); //YYYYMMDDHHMMSS

        //初始化服务管理时间插件
        $('#serviceDateRange').daterangepicker({
                locale: {
                    format: 'YYYY年MM月DD日'
                },
                startDate: start,
                endDate: end
            },
            function(start, end, label) {
                serviceItem.endDate = getDayLastTime(end.format("YYYYMMDD"));
                serviceItem.startDate = getTime(start.format("YYYYMMDD"));
                $("#serviceMergeTime>label.active").removeClass("active");
                serviceItem.serviceDataAjax();
            });

        //服务管理时间按钮
        $("#serviceMergeTime .btn").click(function() {
            var mergeTime = $(this).text().trim();
            if (mergeTime == "周") {
                serviceItem.startDate = getTime(moment().subtract("days", 6).format("YYYYMMDD"));
                serviceItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "月") {
                serviceItem.startDate = getTime(moment().subtract("days", 30).format("YYYYMMDD"));
                serviceItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "年") {
                serviceItem.startDate = getTime(moment().subtract("days", 365).format("YYYYMMDD"));
                serviceItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            }
            $("#serviceDateRange").data("daterangepicker").setStartDate(getDate(serviceItem.startDate));
            $("#serviceDateRange").data("daterangepicker").setEndDate(getDayLastTime(serviceItem.endDate));

            $('input[name="serviceDateRange"]').val(getDate(serviceItem.startDate) + " - " + getDate(serviceItem.endDate));

            serviceItem.serviceDataAjax();
            
        });

        //服务管理效果汇总数据表
        serviceItem.serviceDataAjax();
    },

    mouseEvent:function(){
        //点击确定事件改变状态值
        $(".mm_btn").click(function(){
            serviceItem.extend = "";
            var dateArray = new Array();
            //如果是生日关怀
            if (serviceItem.serviceId == 9) {
                var datejson = {
                    "day": parseInt($("#" + serviceItem.serviceId + " #birth").attr("data-id")),
                    "time": $("#" + serviceItem.serviceId + " #birthServiceActionTime").attr("data-id")
                };

                dateArray.push(datejson);

                serviceItem.extend = {
                    "date": dateArray
                };
            }
            //如果是复购提醒和用药关怀
            if(serviceItem.serviceId == 11 || serviceItem.serviceId == 10){
                //如果是复购提醒
                if (serviceItem.serviceId == 11) {
                    var datejson = {
                        "day": parseInt($("#" + serviceItem.serviceId + " #birth").attr("data-id")),
                        "time": $("#" + serviceItem.serviceId + " #birthServiceActionTime").attr("data-id")
                    };
                    dateArray.push(datejson);
                };
                //如果是用药关怀
                if (serviceItem.serviceId == 10) {
                    var datejson = {
                        "day": parseInt($("#" + serviceItem.serviceId + " #birth").attr("data-id")),
                        "time": $("#" + serviceItem.serviceId + " #birthServiceActionTime").attr("data-id")
                    };
                    dateArray.push(datejson);
                    //计算出用药关怀的时间数量
                    var andActionNodeList = $("#" + serviceItem.serviceId + " ul[id^='andAction']");
                    for (var i = 0; i < andActionNodeList.size(); i++) {
                        if (!andActionNodeList.eq(i).parent().hasClass("hideBox") && !andActionNodeList.eq(i).hasClass("hideBox")) {
                            var careDateJson = {
                                "day": andActionNodeList.eq(i).find("#birth").attr("data-id"),
                                "time": andActionNodeList.eq(i).find("#birthServiceActionTime").attr("data-id"),
                            };
                            dateArray.push(careDateJson);
                        }
                    }
                }
                 
                var goodsArray = new Array();
                $('.btn-group .active').each(function(i) {
                    var goodsId = $(this).children("input").attr("data-goodslist");
                    if ( goodsId != undefined) {
                        goodsArray.push(goodsId);
                    };
                });
                
                if (goodsArray.length == 0) {
                    serviceItem.extend = {
                        "date": dateArray
                    }
                } else {
                    serviceItem.extend = {
                        "date": dateArray,
                        "goodsId": goodsArray
                    };
                };                   
            }
            serviceItem.saveAjax();
        });
        //生日关怀发送时间
        $("#"+serviceItem.serviceId + " .birthList .btn").click(function(){
            $(this).closest(".timeList").children("a").html($(this).text() + '<i class="arrow_down"></i>');//改变显示的文本
            $(this).closest(".timeList").children("a").attr("data-id",$(this).attr("data-id"));
        });
        //生日关怀执行时间
        $("#"+serviceItem.serviceId + " .birthServiceActionTimeList .btn").click(function(){
            $(this).closest(".timeList").children("a").html($(this).text() + '<i class="arrow_down"></i>');
            $(this).closest(".timeList").children("a").attr("data-id",$(this).attr("data-id"));
        });

        //用药说明关怀发送时间
        // $("#"+serviceItem.serviceId + " .birthList .btn").click(function(){
        //     var actionNode = $(this).parent().parent();
        //     $("#"+serviceItem.serviceId + " #birth").html($(this).text() + '<i class="arrow_down"></i>');//改变显示的文本
        //     $("#"+serviceItem.serviceId + " #birth").attr("data-id",$(this).attr("data-id"));
        // });

        //选择商品选择逻辑开始
        //选择商品:点击选择按钮
        $('#chooseGoods').on('shown.bs.modal', function() {
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
            //先判断表格是否已经被初始化，如果没有，则初始化。
            if (!($.fn.dataTable.isDataTable("#importantGoodsTable"))) {               
                serviceItem.importantGoodsAjax();
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
            serviceItem.importantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });

        //点击选择商品->选择模态框->已选择区域的删除图标：删除对应的父标签，并删除主页面选项和表格对应的值
        $("#goodsList .selectedItem").on("click", ".glyphicon-remove", function() {
            var goodsId = $(this).parent().attr("goods-id");
            //删除表格对应的选项 TODO 暂时添加一个商品ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            serviceItem.importantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });
        //选择商品选择逻辑结束

        //选择商品选择逻辑开始
        //选择商品:点击选择按钮
        $('#chooseGoods1').on('shown.bs.modal', function() {
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
            //先判断表格是否已经被初始化，如果没有，则初始化。
            if (!($.fn.dataTable.isDataTable("#importantGoodsTable1"))) {               
                serviceItem.importantGoodsAjax1();
            };
            $("#goodsList1 .btn-group").children('[data-target="#chooseGoods1"]').removeClass("active");

            //TODO 将已经选择的药品放入到对应的表格和已选择项中
        });

        //点击选择商品的删除图标：删除对应的父标签，并删除弹出框中的选项和表格对应的值
        $("#goodsList1").on("click", ".glyphicon-remove", function() {
            //删除弹出框中的选项
            var goodsId = $(this).parent().children("input").attr("data-goodslist");
            $("#goodsList1 .selectedItem1").children().each(function(index) {
                if ($(this).attr("goods-id") == goodsId) {
                    $(this).remove();
                }
            });
            //删除表格对应的选项 TODO 暂时添加一个商品ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            serviceItem.importantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });

        //点击选择商品->选择模态框->已选择区域的删除图标：删除对应的父标签，并删除主页面选项和表格对应的值
        $("#goodsList1 .selectedItem1").on("click", ".glyphicon-remove", function() {
            var goodsId = $(this).parent().attr("goods-id");
            //删除表格对应的选项 TODO 暂时添加一个商品ID到对应的class来解决这个问题，以后要查相关资料看是否能根据行的内容来删除对应的行
            serviceItem.importantGoodsTable.rows('.' + goodsId).deselect();
            //删除指定商品
            $(this).parent().remove();
        });
        //选择商品选择逻辑结束


        //添加执行时间
        var addId = 0;
        $("#add").click(function() {
            if (addId == 0 || $("#andAction").hasClass("hideBox")) {
                $("#andActionTime").removeClass("hideBox");
                $("#andAction").removeClass("hideBox");
            } else {
                $("#andActionTime").append($("#andAction").clone(true).attr("id", "andAction" + addId));
            }
            addId += 1;
        });
        //删除执行时间
        $("#delete").click(function(){
            if($(this).parent().parent().attr("id") == "andAction"){
               $(this).parent().parent().addClass("hideBox");
            } else {
               $(this).parent().parent().remove();
            }         
        });
    },

    saveAjax: function() {
        var success = function(result) {add
            if (result.error == 200) {
                location.href = "ServiceList.html"
            } else {
                alert(serverError + JSON.stringify(result));
            };
        };
        var data = {
            "mStId": serviceItem.mainStoreId,
            "serviceId": serviceItem.serviceId,
            "status": serviceItem.open == true ? 1 : 0,
            "extend": serviceItem.extend == "" ? "" : JSON.stringify(serviceItem.extend)
        };
        console.log(data);
        post("put", "/clCrm/api/crm/sm/services/service/status", data, success);
    },


    serviceDataAjax:function(){
        //初始化数据表表格
        $('#serviceManagement').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "destroy": true,
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function() { //d代表default，即在默认分页参数
                    return serviceItem.prepareApiParams();
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(serviceItem.apiDataFromServer(data));
                }
            },
            "columns": serviceItem.serviceTableColumns,
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
    },

    //准备访问API的相关参数
    prepareApiParams: function() {
        serviceItem.serviceApiParams = {
            "mStId": serviceItem.mainStoreId,
            "bDateT": serviceItem.startDate,
            "eDateT": serviceItem.endDate,
            "serviceId": serviceItem.serviceId
        };
        return $.extend(serviceItem.serviceApiParams, getDataTableNoServerPageParams("get", "/clCrm/api/crm/sm/effect/byDate/table/datas"));
    },

    //处理访问API之后得到的数据集
    apiDataFromServer: function(data) {
        var result = {};
        if (data.page) {
            result.recordsTotal = data.page.totalCount;
            result.recordsFiltered = data.page.totalCount;
            result.data = data.dataList;
        } else if (data.error == 200) {
            result.recordsTotal = data.dataList.length;
            result.recordsFiltered = data.dataList.length;
            result.data = data.dataList;
            effectAnalysis(data.dataList);
        } else {
            result.recordsTotal = 0;
            result.recordsFiltered = 0;
            result.data = "";
            alert(serverError + JSON.stringify(data));
        }
        return result;
    },

        //选择商品弹框选择：Ajax请求
    importantGoodsAjax: function() {
        //初始化指定商品表格
        serviceItem.importantGoodsTable = $('#importantGoodsTable').DataTable({
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
                    return serviceItem.prepareImportantGoodsApiParams(d);
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    serviceItem.goodsJson = JSON.stringify(serviceItem.getImportantGoodsDataFromServer(data));
                    serviceItem.buyAgainEvent();
                    return serviceItem.goodsJson;
                }
            },
            "columns": serviceItem.importantGoodsTableColumns,
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

        $('.input-sm').attr("placeholder", "请选择药品");

        //选择商品：点击商品事件
        serviceItem.importantGoodsTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = serviceItem.importantGoodsTable.rows(indexes).data().toArray();
                serviceItem.importantGoodsTable.rows(indexes).nodes().to$().addClass(rowData[0].drugId);
                $("#goodsList .selectedItem").append('<a class="chosenObject" goods-id="' + rowData[0].drugId + '">' + rowData[0].name + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + '</a>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = serviceItem.importantGoodsTable.rows(indexes).data().toArray();
                serviceItem.importantGoodsTable.rows(indexes).nodes().to$().removeClass(rowData[0].drugId);
                $("#goodsList .selectedItem").children('[goods-id="' + rowData[0].drugId + '"]').remove();
            });
    },

            //选择商品弹框选择：Ajax请求
    importantGoodsAjax1: function() {
        //初始化指定商品表格
        serviceItem.importantGoodsTable = $('#importantGoodsTable1').DataTable({
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
                    return serviceItem.prepareImportantGoodsApiParams(d);
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    serviceItem.goodsJson = JSON.stringify(serviceItem.getImportantGoodsDataFromServer(data));
                    serviceItem.buyAgainEvent();
                    return serviceItem.goodsJson;
                }
            },
            "columns": serviceItem.importantGoodsTableColumns,
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

        $('.input-sm').attr("placeholder", "请选择药品");



        //选择商品：点击商品事件
        serviceItem.importantGoodsTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = serviceItem.importantGoodsTable.rows(indexes).data().toArray();
                serviceItem.importantGoodsTable.rows(indexes).nodes().to$().addClass(rowData[0].drugId);
                $("#goodsList1 .selectedItem1").append('<a class="chosenObject" goods-id="' + rowData[0].drugId + '">' + rowData[0].name + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>' + '</a>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = serviceItem.importantGoodsTable.rows(indexes).data().toArray();
                serviceItem.importantGoodsTable.rows(indexes).nodes().to$().removeClass(rowData[0].drugId);
                $("#goodsList1 .selectedItem1").children('[goods-id="' + rowData[0].drugId + '"]').remove();
            });
    },


    //指定商品：准备访问API的相关参数 +"'
    prepareImportantGoodsApiParams: function(d) {
        serviceItem.importantGoodsApiParams = {
            "mStId": serviceItem.mainStoreId
        };
        return $.extend(serviceItem.importantGoodsApiParams, getDataTableNoServerPageParams("get", "/clCrm/api/crm/drugs/important"));
    },

    //指定商品：处理访问API之后得到的数据集
    getImportantGoodsDataFromServer: function(data) {
        var result = {};
        result.data = data.dataList;
        return result;
    },

    buyAgainEvent: function() {
        if (serviceItem.goodsJson) {
            var goodsArray = jQuery.parseJSON(serviceItem.extend).goodsId;
            var goodsDetailArray = jQuery.parseJSON(serviceItem.goodsJson).data;
            $.each(goodsArray, function(i, goodsArrayVal) {
                //找出对应药品的名称
                $.each(goodsDetailArray, function(j, goodsDetailArrayVal) {
                    if (jQuery.parseJSON(JSON.stringify(goodsDetailArrayVal)).drugId == goodsArrayVal) {
                        var goodsName = jQuery.parseJSON(JSON.stringify(goodsDetailArrayVal)).name;
                        //复购提醒：在“选择”左边加上对应的药品
                        if(serviceItem.serviceId == 11){
                           $("#goodsList1 .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-goodsList="' + goodsArray[i] + '" data-bool="true">' + goodsName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');            
                        }
                        //用药关怀：在“选择”左边加上对应的药品
                        if(serviceItem.serviceId == 10){
                           $("#goodsList .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-goodsList="' + goodsArray[i] + '" data-bool="true">' + goodsName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');            
                        }                          
                    }
                })
            });
        }
    }
}

/*tab 切换*/
$(".tabsChange").each(function(index) {
    var $listNode = $(this);
    $listNode.click(function() {
        $(".tabsChange").children('i').attr("class", "mm_nav_icon");
        $(".m_slide_block").addClass('hideBox');
        $(".m_slide_block").eq(index).removeClass('hideBox');
        $(".tabsChange").children('i').removeClass().addClass('mm_nav_icon');
        $listNode.children('i').addClass('click_' + index);
    })
});

//Echarts图
var myChart = echarts.init(document.getElementById("serviceChart"));

var option = {
    grid: {//背景设置
        show: true,
        borderColor: "#ffffff"
    },
    tooltip: {
        trigger: 'axis',
        formatter: '{b}<br>{a0} : {c0}( 人 )',
        backgroundColor: "#ffffff",
        textStyle: {
            color: "#656d78"
        }
    },
    legend: {//折线说明
        bottom: 10,
        data: ['通知']
    },
    xAxis: [{
        type: 'category',
        data: []
    }],
    yAxis: [{
        type: 'value',
        name: '通知数( 人 )',
        min: 0,
        max: 50,
        interval: 10,
        axisLabel: {
            formatter: '{value}'
        }
    }],
    series: [{
        name: '通知',
        type: 'line',
        data: [],
        barWidth: 16,
        itemStyle: {
            normal: {
                color: "#fcc700"
            }
        }
    }]
};

//效果分析趋势
function effectAnalysis(data) {
    var effect = "";

    option['xAxis'][0].data.splice(0,option['xAxis'][0].data.length);//清空横坐标中的数据以免出现数据混乱
    option['series'][0].data.splice(0,option['series'][0].data.length);//清空纵坐标中的数据以免出现数据混乱

    if (data) {
        var maxCount = 0;
        var resData = data;
        for (var key in resData) {
            var todayCount = parseFloat(resData[key].todayCount.split("人")[0]);
            if (todayCount >= maxCount) {
                maxCount = todayCount;
            }
            option['xAxis'][0].data.push(resData[key].createDate); //为X轴设值
            option['series'][0].data.push(todayCount); //为y轴设值
        }

        //设值y轴的最大值和间距
        option["yAxis"][0].max = Math.ceil(maxCount / 10) * 10;
        option["yAxis"][0].interval = option["yAxis"][0].max / 5;

        myChart.setOption(option);
    } else {
        alert(serverError + JSON.stringify(data));
    }
}
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

function chosenGoods1() {
    $("#goodsList1 .btn-group").children('label').not('[data-target="#chooseGoods1"]').remove(); //删除除选择之外所有的Label

    $("#goodsList1 .selectedItem1").children('a').each(function(index) {
        var goodsId = $(this).attr("goods-id");
        var goodsName = $(this).text();

        $("#goodsList1 .btn-group").prepend('<label class="btn btn-primary active"><input type="checkbox" autocomplete="off" checked="" data-goodsList="' + goodsId + '" data-bool="true">' + goodsName + '<span class="glyphicon glyphicon-remove" aria-hidden="true"></span></label>');
        $('#chooseGoods1').modal('hide');
    });
};

$(function() {
    serviceItem.mainStoreId = $.cookie("mainStoreId");

    serviceItem.destination = getUrlParam("destination");
    serviceItem.serviceId = getUrlParam("id");
    serviceItem.serviceName = getUrlParam("name");
    serviceItem.extend = getUrlParam("extend");
    if(getUrlParam("open") == "true"){
       serviceItem.open = true;    
    };
    //如果是服务详情，则需要跳转到tab页中的效果汇总
    if (serviceItem.destination == "serviceDetail") {
        $(".tabsChange").children('i').attr("class", "mm_nav_icon");
        $(".m_slide_block").addClass('hideBox');
        $(".m_slide_block").eq(1).removeClass('hideBox');
        $(".tabsChange").children('i').removeClass().addClass('mm_nav_icon');
        $(".tabsChange").children('i').eq(1).addClass('click_' + 1);
        $('#myTab a[href="#phoneMarketing"]').tab('show')
    }

    serviceItem.init();
});