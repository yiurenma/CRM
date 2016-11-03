var serviceListItem = {
    mainStoreId: "",

    //服务列表表单
    serviceListTable: "",
    serviceListApiParams: "",
    serviceListTableColumns: [{
        "data": "name",
        "title": "服务内容",
    }, {
        "data": "todayCount",
        "title": "今日通知数",
    }, {
        "data": "status",
        "title": "状态",
    },{
        "data": null,
        "title": "操作",
        "createdCell": function(td, cellData, rowData, row, col) {
            if(rowData.status == "关闭"){
              $(td).html("<a class='serviceSetup' href='ServiceManagement.html?id=" + rowData.id + "&name=" + escape(rowData.name)  + "&extend=" + escape(rowData.extend)  +"&open=false&destination=serviceSetup'><a class='serviceDetail' href='ServiceManagement.html?id=" + rowData.id + "&name=" +  escape(rowData.name) + "&extend=" + escape(rowData.extend) + "&open=false&destination=serviceDetail'>");    
            } else {
              $(td).html("<a class='serviceSetup' href='ServiceManagement.html?id=" + rowData.id + "&name=" + escape(rowData.name)  + "&extend=" + escape(rowData.extend)  +"&open=true&destination=serviceSetup'><a class='serviceDetail' href='ServiceManagement.html?id=" + rowData.id + "&name=" +  escape(rowData.name) + "&extend=" + escape(rowData.extend) + "&open=true&destination=serviceDetail'>");      
            }
            
        },
    }],

    init: function() {
        serviceListItem.serviceListAjax();
    },

    serviceListAjax: function() {
        //初始化服务列表表格
        $('#serviceList').DataTable({
            //以下是对表格获得数据的设置
            "dom": "tlp",
            "destroy": true,
            "lengthMenu": [10, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function() { //d代表default，即在默认分页参数
                    return serviceListItem.prepareApiParams();
                },
                "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(serviceListItem.apiDataFromServer(data));
                }
            },
            "columns": serviceListItem.serviceListTableColumns,
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
        serviceListItem.serviceListApiParams = {
            "mStId": serviceListItem.mainStoreId
        };
        return $.extend(serviceListItem.serviceListApiParams, getDataTableNoServerPageParams("get", "/clCrm/api/crm/sm/services/table/datas"));
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
        } else {
            result.recordsTotal = 0;
            result.recordsFiltered = 0;
            result.data = "";
            alert(serverError + JSON.stringify(data));
        }
        return result;
    },

};

$(function() {
    serviceListItem.mainStoreId = $.cookie("mainStoreId");
    serviceListItem.init();
});