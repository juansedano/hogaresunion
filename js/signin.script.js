$(document).ready(function () {
    panelAutoAdjust();
    $(window).resize(function() {
        panelAutoAdjust();
    });    
});

var autoAdjust = true;
function panelAutoAdjust() {
    var windowHeight = $(window).height();
    var marginTop = (windowHeight / 2) - 160;
    if (autoAdjust) {
        autoAdjust = false;
        $(".panel-signin").animate({
            'margin-top': marginTop+'px'
        }, 1200);
    } else {
        $('.panel-signin').css('margin-top', marginTop+'px');
    }
}

$(".sing-in-action").click(function(e){
    e.preventDefault();
    var userName = $('.singin-input-username').val();
    var userPassword = $('.singin-input-password').val();
    console.log('Data',userName,userPassword);
    if ((userName == '') || (userName == null)) {
        if ($('.singin-input-username').parent().next('label').length == 0) {
            $('.singin-input-username').addClass('input-alert');
            $('.singin-span-username').addClass('span-alert');
            $('.singin-input-username').parent().after('<label style="font-size:12px;color:red;margin:0px !important;">Ingresa tu Usuario</label>');
        }
    } else {
        if ($('.singin-input-username').parent().next('label').length != 0) {
            $('.singin-input-username').removeClass('input-alert');
            $('.singin-span-username').removeClass('span-alert');
            $('.singin-input-username').parent().next('label').remove();
        }   
    }

    if ((userPassword == '') || (userPassword == null)) {
        if ($('.singin-input-password').parent().next('label').length == 0) {
            $('.singin-input-password').addClass('input-alert');
            $('.singin-span-password').addClass('span-alert');
            $('.singin-input-password').parent().after('<label style="font-size:12px;color:red;margin:0px !important;">Ingresa tu Password</label>');
        }
    } else {
        if ($('.singin-input-password').parent().next('label').length != 0) {
            $('.singin-input-password').removeClass('input-alert');
            $('.singin-span-password').removeClass('span-alert');            
            $('.singin-input-password').parent().next('label').remove();
        }   
    }
});

$('.singin-input-username').focus(function(e){
    e.preventDefault();
    $(this).addClass('input-focus');
    $(this).prev().addClass('singin-span');
});

$(".singin-input-username").focusout(function(e){
    e.preventDefault();
    $(this).removeClass('input-focus');
    $(this).prev().removeClass('singin-span');
});

$(".singin-input-password").focus(function(e){
    e.preventDefault();
    $(this).addClass('input-focus');
    $(this).prev().addClass('singin-span');
});

$(".singin-input-password").focusout(function(e){
    e.preventDefault();
    $(this).removeClass('input-focus');
    $(this).prev().removeClass('singin-span');
});

$(".sing-in-action").hover(function(e){
    e.preventDefault();
    $(".sing-in-action").children().children().toggle();
});

