$(document).ready(function() {
            $("#packUp,#carryOut").on('click', function(){
                    $(".pack").toggleClass('packCon');
                    $("#packUp").toggleClass('hideBox');
                    $("#carryOut").toggleClass('hideBox');
                })
            });
