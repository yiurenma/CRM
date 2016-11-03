//右侧列表
$(function() {

  var draw;
  var memberShipTable = $('#example').DataTable({
    //以下是对表格获得数据的设置
    "dom": "B<'clear'>frtlip",
    "serverSide": true, //开启datatables的服务器模式
    "scrollX": 200, //配置横坐标长度为200
    "lengthMenu": [10, 20, 30],
    "ordering": false, //禁止排序
    "ajax": {
      "url": apiEntry, //api访问链接    
      "dataType": "json",
      "type": "post",
      "data": function(d) { //d代表default，即在默认分页参数
        draw = d.draw;
        if ($(".input-sm").val()) { //查询逻辑
          var dataTableParams = {
            "mStId": "0000000",
            "content": $(".input-sm").val(), //查询内容
            "rfmLevel": "1"
          }; //在此添加自定义参数和接口分页参数
          return $.extend(dataTableParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas/search"));
        } else {
          var dataTableParams = {
            "mStId": "0000000",
            "orderBy": "cLastTime"
          }; //在此添加自定义参数和接口分页参数
          return $.extend(dataTableParams, getDataTableParams(d, "post", "/clCrm/api/crm/users/table/datas/all"));
        }
      },
      "dataFilter": function(data) { //根据数据源中的分页数据得到datatables进行分页的相关参数
        data = jQuery.parseJSON(data);

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

        return JSON.stringify(result);
      }
    },
    "buttons": [{
      "extend": "csvHtml5",
      "text": "导出CVS",
      "CharSet": "utf8", //解决用excel打开文件中文乱码问题
      "bom": true //解决用excel打开文件中文乱码问题
    }],
    "columns": [{
      "data": "telephone"
    }, {
      "data": "patientName"
    }, {
      "data": "customTagStr"
    }, {
      "data": "rfmLevel"
    }, {
      "data": "cLastDays"
    }, {
      "data": "cCount"
    }, {
      "data": "cTotalMoney"
    }, {
      "data": "cUnitPrice"
    }, {
      "data": "cLastStoreName"
    }, {
      "data": "diseaseStr"
    }, {
      "data": "hLastDays"
    }, {
      "data": "hCount"
    }, {
      "data": "hLastStoreName"
    }],
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

  $(".input-sm").attr("placeholder", "请输入会员联系方式或姓名");

  //checkbox全选
  $("#checkAll").on("click", function() {
    if ($(this).prop("checked") === true) {
      $("input[name='checkList']").prop("checked", $(this).prop("checked"));
      $('#example tbody tr').addClass('selected');
    } else {
      $("input[name='checkList']").prop("checked", false);
      $('#example tbody tr').removeClass('selected');
    }
  });

  // 显示隐藏列
  $('.toggle-vis').on('change', function(e) {
    e.preventDefault();
    var column = memberShipTable.column($(this).attr('data-column'));
    column.visible(!column.visible());
  });

  $('.showcol').click(function() {
    $('.showul').toggle();
  });
})


