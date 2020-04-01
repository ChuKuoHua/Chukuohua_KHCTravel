$(document).ready(function() {
    $(window).scroll(function(event){
        var scrollVal=$(this).scrollTop();
        if(scrollVal >150){
            $('.top').fadeIn();
        }else{
            $('.top').fadeOut();
        }
    });
    /* top animate*/
    $('.top a').click(function(event){
        event.preventDefault();
        $('html, body').animate({
            scrollTop:0
        }, 1000);
    });
})