var smsEditItem = {
    mainStoreId: "",
    memberFilterData: "",
    resourceType: "",
    employeeId: "",
    groupId: "",
    smsLastTime:"",
    timer: false, //定时发送短信，默认是不定时发送
    smsTimer: "", //定时发送短信的时间
    addTestNum: false, //将测试手机号码加入发送的列表内，默认是不加入
    lxkSymbol: "【蓝信康】",
    quitMessText: " 退订回N",
    writingText: "", //编辑框中的内容
    phoneText: "", //手机显示框中的内容
    sendText: "", //发送的内容
    msgCon: {
        chain: ["连锁名称", "蓝信康大药房", 8, "mainStoreName"],
        store: ["门店名称", "杨浦店", 4, "branchStoreName"],
        stuff: ["店员姓名", "店员", 3, "employeeRealName"],
        member: ["会员姓名", "张建华", 3, "memberRealName"]
    },

    init: function() {

        moment.locale("zh-cn");

        //从链接中得到有效人数和总人数
        $(".screenNum").eq(0).text(getUrlParam("effectNum"));
        $(".screenNum").eq(1).text(getUrlParam("allNum"));

        //初始化tooltip
        $("[data-toggle='tooltip']").tooltip();

        //各种鼠标点击时间
        smsEditItem.mouseEvent();

        $("#taskConfirm").on("click", function() {
            if (smsEditItem.resourceType == "messageMarketingAllSearch") {
                smsEditItem.sendMsgBySearch();
            }
            if (smsEditItem.resourceType == "messageMarketingQuickSearch") {
                smsEditItem.sendMsgByGroupId();
            }
        });

        //点击发送出现模态框
        $("#sendConfirm").on("show.bs.modal", function() {
            $(".confirmInfo .screenNum").eq(0).text($("#wordCounter").text());
            $(".confirmInfo .screenNum").eq(1).text($("#msgCounter").text());
        });
    },

    mouseEvent: function() {
        //点击效果统计
        $('.count_btn').on("click", function() {
            location.href = "SmsEffect.html";
        });

        $("#inputWords").on("input", function() {
            //计算输入的文本数量和短信数量
            var words_num = $("#inputWords").text().length + 10;
            $("#wordCounter").text(words_num);
            $("#msgCounter").text(Math.ceil(words_num / 70));
            //给手机屏幕文本框赋值
            var phoneTextNode = $(this).clone();
            $(this).children(".variable").each(function(index) {
                phoneTextNode.children(".variable").eq(index).html(phoneTextNode.children(".variable").eq(index).attr("data-variable-text"));
            });
            smsEditItem.phoneText = smsEditItem.lxkSymbol + phoneTextNode.text() + smsEditItem.quitMessText;
            $("#getInput").val(smsEditItem.phoneText);
            //发送给接口的短信内容模板
            var sendTextNode = $(this).clone();
            $(this).children(".variable").each(function(index) {
                sendTextNode.children(".variable").eq(index).html(sendTextNode.children(".variable").eq(index).attr("data-variable"));
            });
            smsEditItem.sendText = sendTextNode.text() + smsEditItem.quitMessText;
            console.log(smsEditItem.sendText);
        });

        $(".chain").click(function() {
            showBtn("chain");
        });

        $(".store").click(function() {
            showBtn("store");
        });

        $(".stuff").click(function() {
            showBtn("stuff");
        });

        $(".member").click(function() {
            showBtn("member");
        });

        $(".activeName").val("短信" + GetDateStr(1, 0));

        $(".bgBack").on('click', function() {
            window.location.href = document.referrer;
        });

        $("#pre_btn").on('click', function() {
            window.history.back(-1);
        });

        $(".testSend").on("click", function() {
            smsEditItem.testMsg();
        });

        //定时发送短信 TODO 这里的逻辑还有点不太清晰，需要找对应的插件对其进行覆盖
        $("#addTimer").click(function() {
            //如果以前是选中状态,则点击过后是不选中状态
            if (!$(this).prop("checked")) {
                //如果是不选中状态，隐藏时间插件
                $(".form_con").addClass("hideBox");
                smsEditItem.timer = false;
                smsEditItem.smsTimer = moment().format("YYYYMMDDHHmmss");
            }
            //如果以前是不选中状态，则点击过后是选中状态
            if ($(this).prop("checked")) {
                //如果是选中状态，显示时间插件
                $(".form_con").removeClass("hideBox");
                $("#datetimepicker").datetimepicker("show");
                smsEditItem.smsTimer = moment().format("YYYYMMDDHHmmss");
                smsEditItem.timer = true;               
            }
        });

        //加入正式发送 TODO 这里的逻辑还有点不太清晰，需要找对应的插件对其进行覆盖
        $("#addTextNum").click(function() {
            //如果以前是选中状态,则点击过后是不选中状态
            if (!$(this).prop("checked")) {
                smsEditItem.addTestNum = false;
            }
            //如果以前是不选中状态，则点击过后是选中状态
            if ($(this).prop("checked")) {
                smsEditItem.addTestNum = true;
            }
        });

        $.fn.datetimepicker.dates['zh'] = {
            days: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六", "星期日"],
            daysShort: ["日", "一", "二", "三", "四", "五", "六", "日"],
            daysMin: ["日", "一", "二", "三", "四", "五", "六", "日"],
            months: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
            monthsShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
            meridiem: ["上午", "下午"], 
            today: "今天"
        };
        $('#datetimepicker').datetimepicker({
            format: 'yyyy' + '年' + 'MM' + '月' + 'dd' + '日' + ' hh:mm:ss',
            language: 'zh',
            weekStart: 1,
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            forceParse: 0,
            showMeridian: 1
        }).on('changeDate', function(e) {
            var time = new Date(e.date.getTime() + (e.date.getTimezoneOffset() * 60000))
            smsEditItem.smsTimer = moment(time).format("YYYYMMDDHHmmss"); 
        });

        // datatimepicker时间设定
        $(".picker-switch a").append('<span class="time_icon">' + '请选择时间' + '</span>');

        $("#datetimepicker").on("click", function() {
            $("#datetimepicker").datetimepicker("show");
        });
    },

    sendMsgBySearch: function() {
        var success = function(result) {
            var id = result.id;
            location.href = "SmsEffect.html"
        };
        var data = {
            "mStId": smsEditItem.mainStoreId,
            "euId": smsEditItem.employeeId,
            "marketingName": $(".activeName").val(),
            "smsContent": smsEditItem.sendText,
            "testJoin": smsEditItem.addTestNum,
            "testTelephone": $(".sendNum").val(),
            "smsSendTime": smsEditItem.timer == true ? smsEditItem.smsTimer : ""
        };
        var filterData = jQuery.parseJSON(smsEditItem.memberFilterData);
        delete filterData.path;
        delete filterData.sign;
        delete filterData.method;
        post("post", "/clCrm/api/crm/marketing/sms", $.extend(filterData, data), success);
    },

    sendMsgByGroupId: function() {
        var success = function(result) {
            var id = result.id;
            location.href = "SmsEffect.html"
        };
        var data = {
            "mStId": smsEditItem.mainStoreId,
            "euId": smsEditItem.employeeId,
            "marketingName": $(".activeName").val(),
            "smsContent": smsEditItem.sendText,
            "groupId": smsEditItem.groupId,
            "smsLastTime": smsEditItem.smsLastTime,
            "testJoin": smsEditItem.addTestNum,
            "testTelephone": $(".sendNum").val(),
            "smsSendTime": smsEditItem.timer == true ? smsEditItem.smsTimer : ""
        };
        post("post", "/clCrm/api/crm/marketing/sms", data, success);
    },

    testMsg: function() {
        var res = function(result) {
            var id = result.error;
            if (id == 200) {
                $(".sendSucc").removeClass("hideBox");
                $(".sendFail").addClass("hideBox");
            } else {
                $(".sendSucc").addClass("hideBox");
                $(".sendFail").removeClass("hideBox");
            }
            $('#yourModal').modal('hide');
        };
        var data = {
            "mStId": smsEditItem.mainStoreId,
            "euId": smsEditItem.employeeId,
            "smsContent": smsEditItem.sendText,
            "testTelephone": $(".sendNum").val()
        };

        post("post", "/clCrm/api/crm/marketing/sms/test", data, res);
    },
};

function showBtn(btnVal) {
    var btnName = $("." + btnVal).attr("data-val");
    //计算文本增加的值
    var words_num = 0;
    if (parseInt($("#wordCounter").text()) != 0) {
        words_num = parseInt($("#wordCounter").text()) + parseInt(smsEditItem.msgCon[btnName][2].toString());
    } else {
        words_num = parseInt(smsEditItem.lxkSymbol.length) + parseInt(smsEditItem.msgCon[btnName][2].toString());
    }
    $("#wordCounter").text(words_num);
    $("#msgCounter").text(Math.ceil(words_num / 70));
    //输入文本框的值
//     if (document.selection) {
// pos = document.selection.createRange();
// pos.text = $("." + btnVal).attr("data-html");
// }
    smsEditItem.writingText = $("#inputWords").html() + $("." + btnVal).attr("data-html");
    $("#inputWords").html(smsEditItem.writingText);
    //给手机屏幕文本框赋值
    var phoneTextNode = $("#inputWords").clone();
    $("#inputWords").children(".variable").each(function(index) {
        phoneTextNode.children(".variable").eq(index).html(phoneTextNode.children(".variable").eq(index).attr("data-variable-text"));
    });
    smsEditItem.phoneText = smsEditItem.lxkSymbol + phoneTextNode.text() + smsEditItem.quitMessText;
    $("#getInput").val(smsEditItem.phoneText);
    //发送给接口的短信内容模板
    var sendTextNode = $("#inputWords").clone();
    $("#inputWords").children(".variable").each(function(index) {
        sendTextNode.children(".variable").eq(index).html(sendTextNode.children(".variable").eq(index).attr("data-variable"));
    });
    smsEditItem.sendText = sendTextNode.text() + smsEditItem.quitMessText;
}


$(function() {
    smsEditItem.mainStoreId = $.cookie("mainStoreId");
    smsEditItem.employeeId = $.cookie("employeeId");
    smsEditItem.memberFilterData = getUrlParam("filterData");
    smsEditItem.resourceType = getUrlParam("type");
    smsEditItem.groupId = getUrlParam("groupId");
    if(getUrlParam("smsLastTime")){
       smsEditItem.smsLastTime = getUrlParam("smsLastTime");
    }

    smsEditItem.init();
})