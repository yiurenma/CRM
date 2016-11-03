var phoneMarketing = {
    startTime: "20150801000000",
    endTime: "20161001000000",
    marketingId: "1",
    mainStoreId: "0763000",

    //表格相关数据
    //会员情况
    memberPerformanceTable: "",
    memberPerformanceApiParams: "",
    memberPerformanceColumns: [{
        "data": "patientName"
    }, {
        "data": "branchStoreName"
    }, {
        "data": "userName"
    }, {
        "data": "callCount"
    }, {
        "data": "answered"
    }],

    init: function() {
        var events = $('#events');
        //会员情况
        var memberPerformanceDraw; //datatables服务器分页必传参数
        memberPerformanceTable = $('#phoneMarketingMemberPerformance').DataTable({
            //以下是对表格获得数据的设置
            "dom": "Btlp",
            // "serverSide": true, //开启datatables的服务器模式
            "scrollX": 200, //配置横坐标长度为200
            columnDefs: [{
                orderable: false,
                className: 'select-checkbox',
                targets: 0
            }],
            select: {
                style: 'multi',
                selector: 'td:first-child'
            },
            order: [
                [1, 'asc']
            ],
            "lengthMenu": [1, 20, 30],
            "ordering": false, //禁止排序
            "ajax": {
                "url": apiEntry, //api访问链接    
                "dataType": "json",
                "type": "post",
                "data": function(d) { //d代表default，即在默认分页参数
                    memberPerformanceDraw = d.draw;
                    return phoneMarketing.prepareMemberPerformanceApiParams(d);
                },
                "dataFilter": function(data, draw) { //根据数据源中的分页数据得到datatables进行分页的相关参数
                    data = jQuery.parseJSON(data);
                    return JSON.stringify(phoneMarketing.apiDataFromServer(data, memberPerformanceDraw));
                },
                error: function(msg) { //获取数据失败之后的信息
                    alert("服务器出现问题啦！请发送以下错误信息到邮箱customer@carelinker.com：" + msg);
                }
            },
            "buttons": [{
                "extend": "csvHtml5",
                "text": "导出CVS",
                "CharSet": "utf8", //解决用excel打开文件中文乱码问题
                "bom": true //解决用excel打开文件中文乱码问题
            }],
            "columns": phoneMarketing.memberPerformanceColumns,
            "columnDefs": phoneMarketing.memberPerformanceColumnsDef,
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

        var select = "";
        memberPerformanceTable
            .on('select', function(e, dt, type, indexes) {
                var rowData = memberPerformanceTable.rows(indexes).data().toArray();
                $(".selectedItem").html(select += JSON.stringify(rowData));
                events.prepend('<div><b>' + type + ' selection</b> - ' + JSON.stringify(rowData) + '</div>');
            })
            .on('deselect', function(e, dt, type, indexes) {
                var rowData = memberPerformanceTable.rows(indexes).data().toArray();
                events.prepend('<div><b>' + type + ' <i>de</i>selection</b> - ' + JSON.stringify(rowData) + '</div>');
            });
    },
    //会员情况：准备访问API的相关参数
    prepareMemberPerformanceApiParams: function(d) {
        phoneMarketing.memberPerformanceApiParams = {
            "marketingId": phoneMarketing.marketingId
        };
        return $.extend(phoneMarketing.memberPerformanceApiParams, getDataTableNoServerPageParams("get", "/clCrm/api/crm/marketing/call/detail/members"));
    },
    //处理访问API之后得到的数据集
    apiDataFromServer: function(data, draw) {
        var result = {};
        result.draw = draw;
        if (data.page) {
            result.recordsTotal = data.page.totalCount;
            result.recordsFiltered = data.page.totalCount;
            result.data = data.dataList;
        } else {
            result.recordsTotal = data.dataList.length;
            result.recordsFiltered = data.dataList.length;
            result.data = data.dataList;
        }
        return result;
    },
}


$(function() {
    phoneMarketing.init();
})