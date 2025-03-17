var callRecordItem = {
    startDate: "",
    endDate: "",
    mainStoreId: "",

    //与表格有关的参数
    //短信营销
    callRecordSmsMarketingTable: "",
    callRecordSmsMarketingApiParams: "",
    callRecordSmsMarketingTableColumns: [{
        "data": "id",
        "title": "编号",
    }, {
        "data": "key",
        "title": "规则",
    }, {
        "data": "remark",
        "title": "描述",
    }, {
        "data": "createdDateTime",
        "title": "创建时间",
    }, {
        "data": "lastModifiedDateTime",
        "title": "最后更新时间",
    }],
    //电话营销
    callRecordPhoneMarketingTable: "",
    callRecordPhoneMarketingApiParams: "",
    callRecordPhoneMarketingTableColumns: [{
        "data": "id",
        "title": "编号",
    }, {
        "data": "remark",
        "title": "description",
    }, {
        "data": "createdDateTime",
        "title": "create date time",
    }, {
        "data": "lastModifiedDateTime",
        "title": "update date time",
    }, {
        "data": "recordUrl",
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            $(td).html("<a class='recordUrl' href='" + cellData + "'>");
        },
    }],

    init: function() {
        //初始化默认时间
        moment.locale("zh-cn");
        var start = moment().subtract(7, 'days').format("L"); //YYYY-MM-DD
        var end = moment().format("L"); //YYYY-MM-DD
        callRecordItem.endDate = getDayLastTime(end); //YYYYMMDDHHMMSS
        callRecordItem.startDate = getTime(start); //YYYYMMDDHHMMSS

        callRecordItem.smsMarketingAjax();
        callRecordItem.phoneMarketingAjax();

        //初始化短信营销时间插件
        $('#smsDateRange').daterangepicker({
                locale: {
                    format: 'YYYY年MM月DD日'
                },
                startDate: start,
                endDate: end
            },
            function(start, end, label) {
                callRecordItem.startDate = getTime(start.format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(end.format("YYYYMMDD"));
                $("#smsDateRange>label.active").removeClass("active");
                callRecordItem.smsMarketingAjax();
            });

        //初始化电话营销时间插件
        $('#phoneDateRange').daterangepicker({
                locale: {
                    format: 'YYYY年MM月DD日'
                },
                startDate: start,
                endDate: end
            },
            function(start, end, label) {
                callRecordItem.startDate = getTime(start.format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(end.format("YYYYMMDD"));
                $("#phoneDateRange>label.active").removeClass("active");
                callRecordItem.phoneMarketingAjax();
            });

        //短信营销时间按钮
        $("#smsMergeTime .btn").click(function() {
            var mergeTime = $(this).text().trim();
            if (mergeTime == "周") {
                callRecordItem.startDate = getTime(moment().subtract("days", 6).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "月") {
                callRecordItem.startDate = getTime(moment().subtract("days", 30).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "年") {
                callRecordItem.startDate = getTime(moment().subtract("days", 365).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            }
            $("#smsDateRange").data("daterangepicker").setStartDate(getDate(callRecordItem.startDate));
            $("#smsDateRange").data("daterangepicker").setEndDate(getDayLastTime(callRecordItem.endDate));

            $('input[name="smsDateRange"]').val(getDate(callRecordItem.startDate) + " - " + getDate(callRecordItem.endDate));

            callRecordItem.smsMarketingAjax();
        });

        //电话营销时间按钮
        $("#phoneMergeTime .btn").click(function() {
            var mergeTime = $(this).text().trim();
            if (mergeTime == "周") {
                callRecordItem.startDate = getTime(moment().subtract("days", 6).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "月") {
                callRecordItem.startDate = getTime(moment().subtract("days", 30).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            } else if (mergeTime == "年") {
                callRecordItem.startDate = getTime(moment().subtract("days", 365).format("YYYYMMDD"));
                callRecordItem.endDate = getDayLastTime(moment().format("YYYYMMDD"));
            }
            $("#phoneDateRange").data("daterangepicker").setStartDate(getDate(callRecordItem.startDate));
            $("#phoneDateRange").data("daterangepicker").setEndDate(getDayLastTime(callRecordItem.endDate));

            $('input[name="phoneDateRange"]').val(getDate(callRecordItem.startDate) + " - " + getDate(callRecordItem.endDate));

            callRecordItem.phoneMarketingAjax();
        });

        //标签页替换
        $('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
            $.fn.dataTable.tables( {visible: true, api: true} ).columns.adjust();
            // 获取已激活的标签页的名称
            var activeTab = $(e.target).text();
            // 获取前一个激活的标签页的名称
            var previousTab = $(e.relatedTarget).text();
            $(".active-tab span").html(activeTab);
            $(".previous-tab span").html(previousTab);
        });
        /*tab 切换*/
        $(".tabsChange").each(function(index) {
            var $listNode = $(this);
            $listNode.click(function() {
                $(".tabsChange").children('i').attr("class", "cr_icon");
                $(".m_slide_block").addClass('hideBox');
                $(".m_slide_block").eq(index).removeClass('hideBox');
                $(".tabsChange").children('i').removeClass().addClass('cr_icon');
                $listNode.children('i').addClass('click_' + index);
            })
        });
    },

    smsMarketingAjax: function() {
        //初始化短信营销表格
        var callRecordSmsMarketingDraw; //datatables服务器分页必传参数
        var table = $('#smsMarketingTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "destroy": true,
            "scrollX": true,
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [10, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "get",
                "cache": true,
                "data": function(d) { //d代表default，即在默认分页参数
                    callRecordSmsMarketingDraw = d.draw;
                    return callRecordItem.prepareSmsMarketingApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(callRecordItem.getDataFromServer(data, callRecordSmsMarketingDraw));
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": callRecordItem.callRecordSmsMarketingTableColumns,
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

        // 初始化 X-editable
        $.fn.editable.defaults.mode = 'inline'; // 设置为 inline 编辑模式

        // 使表格单元格可编辑
        $('#smsMarketingTable').on('click', 'td', function() {
            var cell = table.cell(this);
            var originalData = cell.data();
            // 获取当前单元格的列索引
            var columnIndex = $(this).index();
            // 根据列的索引获取字段名称
            var fieldName = callRecordItem.callRecordSmsMarketingTableColumns[columnIndex].data; // 获取当前列的字段名称
            // X-editable 设置
            $(this).editable({
                type: 'text',
                title: 'Edit',
                success: function(response, newValue) {
                    cell.data(newValue).draw();
                    var rowData = table.row($(this).closest('tr')).data();
                    $.ajax({
                        url: 'http://3.89.55.140:8080/api/rule/' + rowData.id,
                        type: 'PATCH',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            [fieldName]: newValue // 使用获取的字段名称
                        }),
                        success: function(apiResponse) {
                            console.log('Update successful:', apiResponse);
                            // 刷新 DataTable 数据
                            table.ajax.reload(null, false); // false 表示保持当前页
                        },
                        error: function(xhr, status, error) {
                            console.error('Error updating:', error);
                        }
                    });
                },
                error: function(xhr, status, error) {
                    alert('编辑失败: ' + error);
                }
            }).editable('toggle'); // 切换编辑状态
        });
    },

    phoneMarketingAjax: function() {
        //初始化电话营销表格
        var callRecordPhoneMarketingDraw; //datatables服务器分页必传参数
        $('#phoneMarketingTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            "destroy": true,
            "scrollX": true,
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [10, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "get",
                "cache": true,
                "data": function(d) { //d代表default，即在默认分页参数
                    callRecordPhoneMarketingDraw = d.draw;
                    return callRecordItem.preparePhoneMarketingApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(callRecordItem.getDataFromServer(data, callRecordPhoneMarketingDraw));
                },
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CSV",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": callRecordItem.callRecordPhoneMarketingTableColumns,
            "oLanguage": { //国际语言转化
                "sLengthMenu": "每页显示数量 _MENU_ ",
                "sZeroRecords": "对不起，查询不到任何相关数据",
                "sLoadingRecords": "努力加载中...",
                "sSearch": '',
                "sEmptyTable": "未有相关数据",
                "oPaginate": {
                    "sPrevious": "<img src='images/ic_left.png'>",
                    "sNext": "<img src='images/ic_right.png'>"
                }
            }
        });
    },

    //回访记录短信营销：准备访问API的相关参数
    prepareSmsMarketingApiParams: function(d) {
        callRecordItem.callRecordSmsMarketingApiParams = {
            "mStId": callRecordItem.mainStoreId,
            "bDateT": callRecordItem.startDate,
            "eDateT": callRecordItem.endDate,
            "sort": "lastModifiedDateTime,desc",
        };
        return $.extend(callRecordItem.callRecordSmsMarketingApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/sms/callBack/records/table/datas"));
    },

    //回访记录电话营销：准备访问API的相关参数
    preparePhoneMarketingApiParams: function(d) {
        callRecordItem.callRecordPhoneMarketingApiParams = {
            "mStId": callRecordItem.mainStoreId,
            "bDateT": callRecordItem.startDate,
            "eDateT": callRecordItem.endDate
        };
        return $.extend(callRecordItem.callRecordPhoneMarketingApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/callBack/records/table/datas"));
    },

    //处理访问API之后得到的数据集
    getDataFromServer: function(data, draw) {
        var result = {};
        result.draw = draw;
        if (data.page) {
            result.recordsTotal = data.page.totalElements;
            result.recordsFiltered = data.page.totalElements;
            result.data = data._embedded.messageRules;
        // } else if (data.error == 200) {
        //     result.recordsTotal = data.dataList.length;
        //     result.recordsFiltered = data.dataList.length;
        //     result.data = data.dataList;
        } else {
            result.recordsTotal = 0;
            result.recordsFiltered = 0;
            result.data = "";
            alert(updateError + JSON.stringify(data));
        }
        return result;
    },
};

$(function() {
    callRecordItem.mainStoreId = $.cookie("mainStoreId");
    callRecordItem.init();
});
