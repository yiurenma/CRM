$(document).ready(function() {

    /**
     * 短信编辑使文字同步显示与计数器
     */
    $("#inputWords").keyup(function() {
            $("#getInput").val(this.value);
            var old_val = $(this).val().toString();
            console.log(typeof(1 * old_val));
            // if (old_val.length - 32 < 0) {
            $("#wordCounter").text(0);
            $("#wordCounter").text(old_val.length - 32);
            var msgNum = Math.ceil((old_val.length - 32) / 70);
            $("#msgCounter").text(msgNum);
            // }
            // $("#wordCounter").text(old_val.length-32);
            // var msgNum=Math.ceil((old_val.length-32)/70);
            // $("#msgCounter").text(msgNum);
        })
        /**
         * Tab标签切换
         */
    $(".messageTabs a").each(function(index) {
        var $listNode = $(this);
        // $getUrl=window.location.href.split("#");
        $listNode.click(function() {
            // location.reload();
            // location=location;
            // alert(index);
            $(this).siblings().removeClass('curFlag');
            $(this).addClass('curFlag');
            // alert($(".curFlag").attr("data-index"));
            if (index == 3) {
                window.location.href = "http://localhost:8080/CRM2/SmsMarketingEffect.html";
            }
            // window.location.href=$getUrl+"#tab"+index;
            $("article").siblings().addClass('hideBox');
            $("article").eq(index).removeClass('hideBox');
            $(".m_slide_block").siblings().addClass('hideBox');
            $(".m_slide_block").eq(index).removeClass('hideBox');
            if (index !== 3) {
                // alert(index);
                $listNode.siblings().removeClass('tabChecked');
                $listNode.addClass('tabChecked');
            }
        })
    })
});
