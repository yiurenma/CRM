var phoneMarketingTaskList = {

    startTime: "",
    endTime: "",
    mainStoreId: "", //总店ID

    //与表格有关的参数
    phoneMarketingTaskListTable: "",
    phoneMarketingTaskListApiParams: "",
    phoneMarketingTaskListTableColumns: [{
        "data": "name",
        "title": "任务名称",
    }, {
        "data": "createDate",
        "title": "创建时间",
    }, {
        "data": "memberCount",
        "title": "会员数",
    }, {
        "data": "calledAndTotal",
        "title": "执行/总数",
    }, {
        "data": "callSuccessAndTotal",
        "title": "接通/总数",
    }, {
        "data": "status",
        "title": "状态",
        "createdCell": function(td, cellData, rowData, row, col) {
            if ($.trim("进行中") == $.trim(cellData.trim())) {
                $(td).html("进行中 <a data-toggle='modal' onclick='stopPhoneTask.call(this)' data-target='#stopTask' class='stop' phoneMarketingId='" + rowData.id + "'>停止</a>");
            }
            if ($.trim("创建中") == $.trim(cellData.trim())) {
                $(td).html("创建中 <a onclick='window.location.reload()' class='refresh'>刷新</a>");
            }
        },
    }, {
        "data": "id",
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            if($.trim("创建失败") != $.trim(rowData.status.trim())){
                $(td).html("<a class='taskDetailImage' href='PhoneMarketing.html?marketingId=" + cellData + "&startTime=" + getTimeByAddSeconds(rowData.createDate) + "&name=" + escape(rowData.name) + "'></a>");     
            } else {
                $(td).html("");
            }          
        },
    }],

    //对电话营销任务列表页面进行初始化
    init: function() {

        //电话营销快速筛查
        var phoneMarketingTaskListDraw; //datatables服务器分页必传参数
        phoneMarketingTaskList.phoneMarketingTaskListTable = $('#phoneMarketingTaskListTable').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "serverSide": true, //开启datatables的服务器模式
            "lengthMenu": [5, 10, 15],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    phoneMarketingTaskListDraw = d.draw;
                    return phoneMarketingTaskList.prepareApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketingTaskList.getDataFromServer(data, phoneMarketingTaskListDraw));
                }
            },
            "columns": phoneMarketingTaskList.phoneMarketingTaskListTableColumns,
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
    //电话营销任务列表:准备访问API的相关参数
    prepareApiParams: function(d) {
        phoneMarketingTaskList.phoneMarketingTaskListApiParams = {
            "mStId": phoneMarketingTaskList.mainStoreId
        };
        return $.extend(phoneMarketingTaskList.phoneMarketingTaskListApiParams, getDataTableParams(d, "get", "/clCrm/api/crm/marketing/call/records/table/datas"));
    },

    //处理访问API之后得到的数据集
    getDataFromServer: function(data, draw) {
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

    stopPhoneTaskAjax: function() {
        var success = function(result) {
            $("#stopTask").modal("hide");
            location.href = "PhoneMarketingTaskList.html";
        };

        var data = {
            "marketingId": phoneMarketingTaskList.phoneMarketingId
        };

        post("put", "/clCrm/api/crm/marketing/call/status", data, success);
    },
};

$(".impressionCount").on("click", function() {
    location.href = "PhoneMarketingCreating.html";
});

$(".taskConfirm").on("click",function(){
    phoneMarketingTaskList.stopPhoneTaskAjax();
});

function stopPhoneTask(){
    phoneMarketingTaskList.phoneMarketingId = $(this).attr("phoneMarketingId");
}

$(function() {
    phoneMarketingTaskList.mainStoreId = $.cookie("mainStoreId");
    //电话营销任务列表界面
    phoneMarketingTaskList.init();
});