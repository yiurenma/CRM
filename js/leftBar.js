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
                $(".left_icon").removeClass('click_' + i);
            }
            // for(var j=index;j>=0;j--){
            //     $(".left_icon").removeClass('click_'+j);
            // }
            $(".left_icon").eq(index).siblings().attr("class", "left_icon");
            $(".left_icon").eq(index).addClass('click_' + index);
        })
})
    /**
     * 侧边栏高度
     */
var getHeight = $(document).innerHeight();
var conHeight = $(".container").height();
var leftHeight = getHeight > conHeight ? getHeight : conHeight;
$("#left-aside,.shadowBar").css({
    "height": leftHeight
});


