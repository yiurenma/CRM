/**
 * 侧边栏滑动点击效果
 */
$(".left_bar_li").each(function(index) {
    var listNode = $(this);
    listNode.click(function() {
        $(".left_bar_li a").removeClass('leftTextBlue');
        $(".left_bar_li").siblings().removeClass('show_blue_line');
        $(".left_bar_li").eq(index).addClass('show_blue_line');
        $(".left_bar_li a").eq(index).addClass('leftTextBlue');
        for (var i = 0; i <= index; i++) {
            $(".left_icon").removeClass('lb_click_' + i);
        }
        $(".left_icon").eq(index).siblings().attr("class", "left_icon");
        $(".left_icon").eq(index).addClass('lb_click_' + index);
    })
});
/**
 * 侧边栏高度
 */
var getHeight = $(document).innerHeight();
$(document).scroll(function() {
    getHeight = getHeight + $(document).scrollTop();
    $("#left-aside,.shadowBar").css({
        "height": getHeight > 10000 ? 10000 : getHeight
    });
})
$("#left-aside,.shadowBar").css({
    "height": getHeight
});

/**
 *页面跳转
 */

$(".left_bar_li").eq(0).click(function() {
    window.location.href = "GeneralView.html";
});
$(".left_bar_li").eq(1).click(function() {
    window.location.href = "DrugAnalysis.html";
});
$(".left_bar_li").eq(2).click(function() {
    window.location.href = "MemberShip.html";
});
$(".left_bar_li").eq(3).click(function() {
    window.location.href = "SmsMarketing.html";
});
$(".left_bar_li").eq(4).click(function() {
    window.location.href = "PhoneMarketingTaskList.html";
});
$(".left_bar_li").eq(5).click(function() {
    window.location.href = "ServiceList.html";
});
$(".left_bar_li").eq(6).click(function() {
    window.location.href = "CallRecord.html";
});
$(".left_bar_li").eq(7).click(function() {
    window.location.href = "BillingCenter.html";
});
// 去掉IE,FF下点击的虚线框
$("a,button").focus(function() { this.blur() });
