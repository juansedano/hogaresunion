/*v=0.0.0 22:00 7/September/2023*/
$(document).ready(function () {

    isMobileDevice = window.mobilecheck();
    panelAutoAdjust();
    inactiveMessageContainer();
    getMessageDateLabel();
    dataInitialization();

    $(window).resize(function() {
        panelAutoAdjust();
    });

    setInterval(function() {
        if (!isContactPanelPaused) {
            if (flagCounter > 4) {
                getContacts(0,range);
                flagCounter = 0;
            } else {
                getMessages(activeMessagesContactId, activeMessagesInstance);
                flagCounter++;
            }
        }
    }, 4000);

    jQuery('.datepicker').datepicker({ 
        monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
        dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
        dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
        dateFormat: 'dd/mm/yy'
    });

});

var range = 0;
var monthShortName = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
var monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var lastMessageId = 0;
var flagCounter = 0;
var selectedContact = 0;
var isContactPanelPaused = true;
var activeMessagesLastMessageId = 0;
var activeMessagesContactId = 0;
var activeMessagesName = null;
var activeMessagesLastName = null;
var activeMessagesEmail = null;
var activeMessagesPhone = 0;
var activeMessagesInstance = 0;
var activeMessagesIsFavorite = 0;
var instanceData = [];
var adviserData = [];
var isInternalMessage = 0;
var dateT = 0;
var dateY = 0;

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};
    
function dataInitialization() {
    if (!isMobileDevice) {
        $('#showContactPanelContainer').hide();
    }
    $.ajax({
        type: "POST",
        data: {type:"dataInitialization"},
        url: "./php/messagingDataTd.php?var=dataInitialization",
        dataType: 'json',
        success: function(response) {
            $.each(response.instances, function(index, data) {
                $("#filterInstances").append("<option value='"+data.id+"'>"+data.name+"</option>");
                $("#startConversationInstance").append("<option value='"+data.id+"'>"+data.name+"</option>");
                instanceData.push({
                    "id": data.id,
                    "name": data.name,
                    "phone": data.phone,
                    "provider": data.provider
                }); 
            });
            $.each(response.advisers, function(index, data) {
                $("#startConversationAdviser").append("<option value='"+data.id+"'>"+data.name+"</option>");
                $(".sync_owner").append("<option value='"+data.ownerId+"'>"+data.name+"</option>");
                adviserData.push({
                    "id": data.id,
                    "name": data.name
                });
            });  
            /**********************************************************************************************/
            $.each(response.contactType, function(index, data) {
                $(".sync_contactType").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });  
            $.each(response.contactOrigin, function(index, data) {
                $(".sync_origin").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });     
            $.each(response.contactChannel, function(index, data) {
                $(".sync_channel").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });     
            $.each(response.conversionStatus, function(index, data) {
                $(".sync_conversationStatus").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });         
            $.each(response.state, function(index, data) {
                $(".sync_state").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });                 
             $.each(response.maritalStatus, function(index, data) {
                $(".sync_maritalStatus").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });  
            $.each(response.product, function(index, data) {
                $(".sync_product").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });           
            $.each(response.productCoaccredited, function(index, data) {
                $(".sync_productCoaccredited").append("<option value='"+data.id+"'>"+data.name+"</option>");
            }); 
            $.each(response.socialCategory, function(index, data) {
                $(".sync_socialCategory").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });                                          
            /*********************************************************************************************/
            getContacts(1,0);         
        }
    });
}

function getInstanceName(id) {
    var result = instanceData.find(instance => instance.id === id);
    if(result === undefined) { 
        return id;
    } else {
        return result.name;
    }
}

function getInstancePhone(id) {
    var result = instanceData.find(instance => instance.id === id);
    if(result === undefined) { 
        return id;
    } else {
        return result.phone;
    }
}

function getInstanceProvider(id) {
    var result = instanceData.find(instance => instance.id === id);
    if(result === undefined) { 
        return null;
    } else {
        return result.provider;
    }
}

function panelAutoAdjust() {
    var iniTop = ($('#contactsContainer').offset().top+10);
    $('#contactsContainer').css('height', (window.innerHeight)-iniTop+'px');
    if (!$('#contactFilesContainer').hasClass('collapsed')) {
        $('#contactFilesContainer').height($('#contactsContainer').height()-44);  
    }
    if (!$('#contacDataContainer').hasClass('collapsed')) {
        $('#contacDataContainer').height($('#contactsContainer').height()-44);  
    }    
    if($(document).width() >= 992) {
        var iniTop2 = ($('#messagesContainer').offset().top)+10+$("#messageActions").height();
        $('#messagesContainer').css('height', (window.innerHeight)-iniTop2+'px');
    }
    if ($('#advancedSearchResultContainer').is(':visible')) {
        var iniTop2 = ($('#advancedSearchResultContainer').offset().top+10);
        $('#advancedSearchResultContainer').css('height', (window.innerHeight)-iniTop2+'px');
    }
}

function getContacts(initializingFlag,range) {
    console.log('Reload Contacts');
    $.ajax({
        type: "POST",
        data: {type:"getContacts",initializingFlag:initializingFlag,range:range,lastMessageId:lastMessageId},
        url: "./php/messagingDataTd.php?var=getContacts",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (initializingFlag === 1) {
                    $('#contactsContainer').empty();
                    $("#searchContactInput").prop('disabled', false);
                    $.each(response, function(index, data) {
                        $('#contactsContainer').append(contactContainerData(data));
                        if ($('#filterInstances').val() != data.instance && $('#filterInstances').val() != 'all') {
                            $('#container-'+data.contactId+'-'+data.instance).hide();
                        }
                        if (index == 0) {
                            lastMessageId = data.lastMessageId;
                            selectedContact = data.contactId+'-'+data.instance;
                            $('#container-'+data.contactId+'-'+data.instance).addClass('getContactMessagesSelected');
                            $('#messageContainertitle').html(data.firstName+' '+data.lastName);
                            activeMessagesName = data.firstName;
                            activeMessagesLastName = data.lastName;
                            activeMessagesContactId = data.contactId;
                            activeMessagesPhone = data.phone;
                            activeMessagesInstance = data.instance;
                            activeMessagesIsFavorite = data.isFavorite;
                            activeMessagesEmail = data.email;
                            getMessages(data.contactId, data.instance);
                        }
                    });
                } else {
                    var len = response.length;
                    $.each(response, function(index, data) {
                        if ($('#container-'+data.contactId+'-'+data.instance).length) {
                            $('#container-'+data.contactId+'-'+data.instance).remove();
                        } 
                        $('#contactsContainer').prepend(contactContainerData(data));
                        if (selectedContact == data.contactId+'-'+data.instance) {
                            $('#container-'+data.contactId+'-'+data.instance).addClass('getContactMessagesSelected');
                            $('#contactsContainer').animate({ scrollTop: 0 }, "fast");
                        }
                        if (!normalizeData(data.firstName+' '+data.lastName).includes(normalizeData($("#searchContactInput").val())) && $("#searchContactInput").val() != '') {
                            $('#container-'+data.contactId+'-'+data.instance).hide();
                        }
                        if ($('#filterInstances').val() != data.instance && $('#filterInstances').val() != 'all') {
                            $('#container-'+data.contactId+'-'+data.instance).hide();
                        }
                        /*if ($('#advancedSearchContainer').is(':visible')) {
                            $('#container-'+data.contactId+'-'+data.instance).hide();
                        }*/
                        if (index === (len - 1)) {
                            lastMessageId = data.lastMessageId;
                        }
                    });                    
                }
            }
        }
    });
}

$(document).on("change", "#filterSize", function(e) {
    e.preventDefault();
    range = $(this).val();
    lastMessageId = 0;
    $('#contactsContainer').html('<img src="images/loader.gif" class="contacts-container-loader-style">');
    getContacts(1,range); 
});

function contactContainerData(data) {
    var string = '<div class="getContactMessages" id="container-'+data.contactId+'-'+data.instance+'" data-email="'+data.email+'" data-msgtype="'+data.msgType+'" data-favorite="'+data.isFavorite+'" data-contactid="'+data.contactId+'" data-phone="'+data.phone+'" data-contactname="'+data.firstName+'" data-contactlastname="'+data.lastName+'" data-instance="'+data.instance+'">';
    string += '<span class="span-contact-name contact-name-'+data.contactId+'-'+data.instance+'">'+data.firstName+' '+data.lastName+'</span>';
    //if (data.msgType == 8) { string += '<span style="padding: 0px 2px;margin:0px;float:right;font-size: 16px; color: #f00;"><i class="fa fa-comment-o"></i></span>'; }
    //if (data.isFavorite == 1) { string += '<span style="padding: 1px 2px;margin:0px;float:right;font-size: 16px; color: #ffb71b;"><i class="fa fa-heart-o"></i></span>'; }

    if (data.msgType == 8) {
        string +='<span style="padding: 4px 1px;margin:0px;float:right;font-size: 16px; color: #f00" data-toggle="tooltip" title="Mensaje pendiente">';
        string +='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-flag" viewBox="0 0 16 16">';
        string +='<path d="M14.778.085A.5.5 0 0 1 15 .5V8a.5.5 0 0 1-.314.464L14.5 8l.186.464-.003.001-.006.003-.023.009a12.435 12.435 0 0 1-.397.15c-.264.095-.631.223-1.047.35-.816.252-1.879.523-2.71.523-.847 0-1.548-.28-2.158-.525l-.028-.01C7.68 8.71 7.14 8.5 6.5 8.5c-.7 0-1.638.23-2.437.477A19.626 19.626 0 0 0 3 9.342V15.5a.5.5 0 0 1-1 0V.5a.5.5 0 0 1 1 0v.282c.226-.079.496-.17.79-.26C4.606.272 5.67 0 6.5 0c.84 0 1.524.277 2.121.519l.043.018C9.286.788 9.828 1 10.5 1c.7 0 1.638-.23 2.437-.477a19.587 19.587 0 0 0 1.349-.476l.019-.007.004-.002h.001M14 1.221c-.22.078-.48.167-.766.255-.81.252-1.872.523-2.734.523-.886 0-1.592-.286-2.203-.534l-.008-.003C7.662 1.21 7.139 1 6.5 1c-.669 0-1.606.229-2.415.478A21.294 21.294 0 0 0 3 1.845v6.433c.22-.078.48-.167.766-.255C4.576 7.77 5.638 7.5 6.5 7.5c.847 0 1.548.28 2.158.525l.028.01C9.32 8.29 9.86 8.5 10.5 8.5c.668 0 1.606-.229 2.415-.478A21.317 21.317 0 0 0 14 7.655V1.222z"/>';
        string += '</svg></span>';
    }  

    favoriteIconState = data.isFavorite == 0 ? 'display:none' : '';
    string +='<span class="icon-contact-favorite-'+data.contactId+'" style="padding: 4px 1px;margin:0px;float:right;font-size: 16px; color: #ffb71b;'+favoriteIconState+'" data-toggle="tooltip" title="Favorito">';
    string +='<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart" viewBox="0 0 16 16">';
    string +='<path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>';
    string += '</svg></span>';

    /*string +='<span style="padding: 3px 2px;margin:0px;float:right;font-size: 16px; color: #31b645" data-toggle="tooltip" title="Tarea pendiente">';
    string += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard2-check" viewBox="0 0 16 16">';
    string += '<path d="M9.5 0a.5.5 0 0 1 .5.5.5.5 0 0 0 .5.5.5.5 0 0 1 .5.5V2a.5.5 0 0 1-.5.5h-5A.5.5 0 0 1 5 2v-.5a.5.5 0 0 1 .5-.5.5.5 0 0 0 .5-.5.5.5 0 0 1 .5-.5h3Z"/>';
    string += '<path d="M3 2.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 0 0-1h-.5A1.5 1.5 0 0 0 2 2.5v12A1.5 1.5 0 0 0 3.5 16h9a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 12.5 1H12a.5.5 0 0 0 0 1h.5a.5.5 0 0 1 .5.5v12a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5v-12Z"/>';
    string += '<path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3Z"/>';
    string += '</svg></span>';*/

    /*string +='<span style="padding: 3px 2px;margin:0px;float:right;font-size: 16px; color: #9776c2" data-toggle="tooltip" title="Mensaje programado">';
    string += '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-calendar2-date" viewBox="0 0 16 16">';
    string += '<path d="M6.445 12.688V7.354h-.633A12.6 12.6 0 0 0 4.5 8.16v.695c.375-.257.969-.62 1.258-.777h.012v4.61h.675zm1.188-1.305c.047.64.594 1.406 1.703 1.406 1.258 0 2-1.066 2-2.871 0-1.934-.781-2.668-1.953-2.668-.926 0-1.797.672-1.797 1.809 0 1.16.824 1.77 1.676 1.77.746 0 1.23-.376 1.383-.79h.027c-.004 1.316-.461 2.164-1.305 2.164-.664 0-1.008-.45-1.05-.82h-.684zm2.953-2.317c0 .696-.559 1.18-1.184 1.18-.601 0-1.144-.383-1.144-1.2 0-.823.582-1.21 1.168-1.21.633 0 1.16.398 1.16 1.23z"/>';
    string += '<path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/>';
    string += '<path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/>';
    string += '</svg></span>';*/

    string += '<br>';
    string += '<span style="font-size:11px">';
    string += '<span id="dateTime-'+data.contactId+'-'+data.instance+'">'+data.lastMessageTime+' '+data.lastMessageDate+' / '+data.phone+'</span>';
    string += '<br>';
    string += '<div style="display: inline;text-align:left;">'+getInstanceName(data.instance)+'</div><div style="display: inline;float: right;color:#428BCA">'+data.adviserName+' '+data.adviserLastName+'</div>';
    string += '</span>';
    string += '</div>';
    return string;
}

$(document).on("click", ".getContactMessages", function(e) {
    desactivateInternalMode();
    $('.getContactMessages').removeClass('getContactMessagesSelected');
    $(this).addClass('getContactMessagesSelected');
    selectedContact = $(this).attr('id').substring(10);

    activeMessagesLastMessageId = 0;
    activeMessagesName = $(this).attr('data-contactname');
    activeMessagesLastName = $(this).attr('data-contactlastname');
    activeMessagesContactId = $(this).attr('data-contactid');
    activeMessagesInstance = $(this).attr('data-instance');
    activeMessagesPhone = $(this).attr('data-phone');
    activeMessagesEmail = $(this).attr('data-email');
    activeMessagesIsFavorite = $(this).attr('data-favorite');  

    $("#messagesContainer").html('<img src="images/loader.gif" class="messages-container-loader-style">');
    $('#messageContainertitle').html(activeMessagesName+' '+activeMessagesLastName);

    collapseAll();

    if (isMobileDevice) {
        $("#contactPanelContainer").hide();
    }

    if (isContactPanelPaused) {
        getMessages($(this).attr('data-contactid'), $(this).attr('data-instance'));
    }
}); 

$(document).on("click touchstart", "#showContactPanelContainer", function(e) {
    $("#contactPanelContainer").show();
    $('html,body').scrollTop(0);
});

function collapseAll() {
    $('.data-collapse-header').each(function(i, data) {
        if (!$(data).hasClass('collapsed')) {
            $(data).addClass('collapsed'); 
        }
    });

    $('.data-collapse-container').each(function(i, data) {
        if ($(data).hasClass('in')) {
            $(data).removeClass('in');
        }
    });

    return false;
}

function getMessages(contactId, instance) {
    console.log('Reload Messages Begin', activeMessagesLastMessageId);
    var favorite = activeMessagesIsFavorite == 1 ? '<span class="fa fa-heart-o"></span>&nbsp;&nbsp;&nbsp;Quitar de favoritos' : '<span class="fa fa-heart-o"></span>&nbsp;&nbsp;&nbsp;Añadir a favoritos';
    /*$('#sync_id').val(activeMessagesContactId);
    $('#sync_contactName').val(activeMessagesName);    
    $('#sync_contactLastName').val(activeMessagesLastName);
    $('#sync_contactPhone').val(activeMessagesPhone);
    $('#sync_contactEmail').val(activeMessagesEmail); */      
    $("#showContactFavoriteContainer").html(favorite);
    if (activeMessagesLastMessageId == 0) {
        inactiveMessageContainer();
    }
    var string = '';
    var $containerInfo = '';
    $.ajax({
        type: "POST",
        data: {type:"getMessages",contactLastMessageId:activeMessagesLastMessageId,contactId:contactId,instance:instance},
        url: "./php/messagingDataTd.php?var=getMessages",
        dataType: 'json',
        success: function(response) {
            if (activeMessagesLastMessageId == 0) {
                $("#messagesContainer").html('<img src="images/loader.gif" class="messages-container-loader-style">');
            }
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (activeMessagesLastMessageId == 0) {
                    activeMessageContainer();
                    //$("#messagesContainer").empty();
                } 
                var len = response.length;
                $.each(response, function(index, data) {
                    if (data.msgText != null && (data.fileType != "vcard" || data.fileType != "multi_vcard")) {
                        if (data.author == null || data.author == getInstancePhone(instance))  {
                            if (data.internal == 1) {
                                string = '<div class="rbubble bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="rbubble" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            if (data.author == getInstancePhone(instance)) {
                                string += '<span style="color:#428BCA;padding-right:20px;">' +  getInstanceName(instance) + '</span>';
                            } else {
                                string += '<span style="color:#428BCA;padding-right:20px;">' + data.adviser + '</span>';
                            }
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<div id="msgText-'+data.id+'" style="white-space:pre-wrap;">'+urlify(data.msgText)+'</div>'; 
                            string += '</div>';  
                        } else {
                            string = '<div class="lbubble" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            string += '<div>';
                            string += '<span style="color:#428BCA;padding-right:20px;">' + data.senderName + '</span>';
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<div id="msgText-'+data.id+'" style="white-space:pre-wrap;">'+urlify(data.msgText)+'</div>'; 
                            string += '</div>'; 
                        }
                    } else if (data.fileURL != null && data.fileType != null && data.fileType == "image") {
                        if (data.author == null || data.author == getInstancePhone(instance))  {
                            if (data.internal == 1) {
                                string = '<div class="rbubble bubble-img bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="rbubble bubble-img" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            if (data.author == getInstancePhone(instance)) {
                                string += '<span style="color:#428BCA;padding-right:20px;">' +  getInstanceName(instance) + '</span>';
                            } else {
                                string += '<span style="color:#428BCA;padding-right:20px;">' + data.adviser + '</span>';
                            }
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<a id="msgText-'+data.id+'" style="cursor:pointer" target="_blank" href="'+preload_image(data.fileURL)+'">'; 
                            string += '<img src="'+data.fileURL+'" class="img-responsive msg-image center-block">';
                            string += '</a><br>'; 
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            }                      
                            string += '</div>';  
                        } else {
                            if (data.internal == 1) {
                                string = '<div class="lbubble bubble-internal bubble-img" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="lbubble bubble-img" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            string += '<span style="color:#428BCA;padding-right:20px;">' + data.senderName + '</span>';
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<a id="msgText-'+data.id+'" style="cursor:pointer" target="_blank" href="'+data.fileURL+'">'; 
                            string += '<img src="'+data.fileURL+'" class="img-responsive msg-image center-block">';
                            string += '</a><br>'; 
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            } 
                            string += '</div>'; 
                        }
                    } else if (data.fileType != null && (data.fileType == "document" || data.fileType == "pdf")) {
                        var fileName = data.fileURL.split("/");
                        if (data.author == null || data.author == getInstancePhone(instance))  {
                            if (data.internal == 1) {
                                string = '<div class="rbubble bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="rbubble"  id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            if (data.author == getInstancePhone(instance)) {
                                string += '<span style="color:#428BCA;padding-right:20px;">' +  getInstanceName(instance) + '</span>';
                            } else {
                                string += '<span style="color:#428BCA;padding-right:20px;">' + data.adviser + '</span>';
                            }
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<a id="msgText-'+data.id+'" style="cursor:pointer;text-decoration:none;" target="_blank" href="'+data.fileURL+'">'; 
                            string += '<button type="submit" class="btn btn-success"><span class="fa fa-download" style="padding-right:6px;"></span> '+fileName[fileName.length - 1]+'</button>';
                            string += '</a><br><small>Click para descargar</small><br>'; 
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            }                      
                            string += '</div>';  
                        } else {
                            if (data.internal == 1) {
                                string = '<div class="lbubble bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="lbubble" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            string += '<span style="color:#428BCA;padding-right:20px;">' + data.senderName + '</span>';
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<a id="msgText-'+data.id+'" style="cursor:pointer;text-decoration:none;" target="_blank" href="'+data.fileURL+'">'; 
                            string += '<button type="submit" class="btn btn-success"><span class="fa fa-download" style="padding-right:6px;"></span> '+fileName[fileName.length - 1]+'</button>';
                            string += '</a><br><small>Click para descargar</small><br>'; 
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            } 
                            string += '</div>'; 
                        }                        
                    } else if (data.fileType != null && (data.fileType == "ptt" || data.fileType == "audio")) {
                        if (data.author == null || data.author == getInstancePhone(instance))  {
                            if (data.internal == 1) {
                                string = '<div class="rbubble bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="rbubble"  id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            if (data.author == getInstancePhone(instance)) {
                                string += '<span style="color:#428BCA;padding-right:20px;">' +  getInstanceName(instance) + '</span>';
                            } else {
                                string += '<span style="color:#428BCA;padding-right:20px;">' + data.adviser + '</span>';
                            }
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<audio controls>';
                            string += '<source src="' + data.fileURL + '" type="audio/ogg" />';
                            string += '</audio>';
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            }                      
                            string += '</div>';  
                        } else {
                            if (data.internal == 1) {
                                string = '<div class="lbubble bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="lbubble" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            string += '<span style="color:#428BCA;padding-right:20px;">' + data.senderName + '</span>';
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<audio controls>';
                            string += '<source src="' + data.fileURL + '" type="audio/ogg" />';
                            string += '</audio>';
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            } 
                            string += '</div>'; 
                        }                           
                    } else if (data.fileType != null && data.fileType == "video") {
                        if (data.author == null || data.author == getInstancePhone(instance))  {
                            if (data.internal == 1) {
                                string = '<div class="rbubble bubble-img bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="rbubble bubble-img"  id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            if (data.author == getInstancePhone(instance)) {
                                string += '<span style="color:#428BCA;padding-right:20px;">' +  getInstanceName(instance) + '</span>';
                            } else {
                                string += '<span style="color:#428BCA;padding-right:20px;">' + data.adviser + '</span>';
                            }
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<video width="100%" controls>';
                            string += '<source src="' + data.fileURL + '" type="video/mp4" />';
                            string += '</video>';
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            }                      
                            string += '</div>';  
                        } else {
                            if (data.internal == 1) {
                                string = '<div class="lbubble bubble-img bubble-internal" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            } else {
                                string = '<div class="lbubble bubble-img" id="msg-'+data.id+'" data-utc="'+data.providerUTC+'">';
                            }
                            string += '<div>';
                            string += '<span style="color:#428BCA;padding-right:20px;">' + data.senderName + '</span>';
                            string += '<span style="float:right;font-size:11px">'+getDateFormat(data.date) + '&nbsp;' + data.time + '</span>';
                            string += '</div>'; 
                            string += '<video width="100%" controls>';
                            string += '<source src="' + data.fileURL + '" type="video/mp4" />';
                            string += '</video>';
                            if (!((data.caption == 'null') || (data.caption == null))) {
                                string += urlify(data.caption);
                            } 
                            string += '</div>'; 
                        }                           
                    }
                    $containerInfo += '<div class="outer">'+string+'</div>';
                    if (index === (len - 1)) {
                        if (activeMessagesLastMessageId == 0) {
                            $("#messagesContainer").empty();
                        } 
                        $("#messagesContainer").append($containerInfo);
                        activeMessagesLastMessageId = data.id;
                        console.log('Reload Messages Finish', activeMessagesLastMessageId);
                        $('#messagesContainer').stop().animate({
                            scrollTop: 1000000
                        }, 1000);
                    }
                });
            }
        }
    });
}

function getMessageDateLabel() {
    var today = new Date();
    dateT = prependZero(today.getDate())+'/'+prependZero(today.getMonth()+1)+'/'+today.getFullYear();
    var yesterday = new Date(Date.now() - 86400000);
    dateY = prependZero(yesterday.getDate())+'/'+prependZero(yesterday.getMonth()+1)+'/'+yesterday.getFullYear();
}

function getDateFormat(date, flag = 0) {
    if (date == dateT) {
        if (flag == 1) {
            return 'Se añadió hoy';
        } else {
            return 'Hoy';
        }
    } else if (date == dateY) { 
        if (flag == 1) {
            return 'Se añadió ayer';
        } else {
            return 'Ayer';
        }
    } else {
        if (flag == 1) {
            return 'Se añadió el '+date.substr(0,2)+" de "+monthName[parseInt(date.substr(3,2))-1]+" de "+date.substr(-4);
        } else {
            return date.substr(0,2)+" "+monthShortName[parseInt(date.substr(3,2))-1]+" "+date.substr(-2);
        }        
    }
}

function prependZero(number) {
    if (number < 10)
        return "0" + number;
    else
        return number;
}

 function contactFilters() {
    var instance = $('#filterInstances').val();
    var conversationType = $('#filterConversationType').val();
    $('.getContactMessages').show();
    $('.getContactMessages').each(function(i, data) {
        containerId = $(data).attr('id').substring(10);
        if ($(data).attr('data-instance') != instance && instance != 'all') {
            $('#container-'+containerId).hide();
        } 
        if (conversationType == 'favorite') {
            if ($(data).attr('data-favorite') != 1 && conversationType != 'all') {
                $('#container-'+containerId).hide();
            }        
        }
        if (conversationType == 'no-answer') {
            if ($(data).attr('data-msgtype') != '8' && conversationType != 'all') {
                $('#container-'+containerId).hide();
            }        
        }
    });
    return false;
 }

 $(document).on('change', '.activate-filters', function (e) {
    e.preventDefault();
    contactFilters();
});

$(document).on('keyup', '#searchContactInput', function (e) {
    e.preventDefault();
    var entry = normalizeData($("#searchContactInput").val());
    if (!(entry == null || entry == '')) {
        $('#searchClear').css("display", "block");
    } else {
        $('#searchClear').css("display", "none");
    }
    if (!((e.keyCode == 17) || (event.code === 'ControlLeft') || (event.code === 'ControlRight'))) {
        $('.getContactMessages').each(function(i, data) {
            containerId = $(data).attr('id').substring(10);
            if (!normalizeData($('.contact-name-'+containerId).html()).includes(entry)) {
                $('#container-'+containerId).hide();
            } else {
                $('#container-'+containerId).show();
            }
        });
    }
});

$(document).on("click", "#searchClear", function(e) {
    e.preventDefault();
    $("#searchContactInput").val('');
    $('#searchClear').css("display", "none");
    $('.getContactMessages').show();
});

function normalizeData(keyword) {
    return keyword.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toLowerCase();
}

$(document).on("click", ".isPanelActive", function(e) {
    e.preventDefault();  
    var status = $(this).val();
    if (isContactPanelPaused) {
        $(this).removeClass('icon-messages-power-off');  
        $(this).addClass('icon-messages-power-on');  
        isContactPanelPaused = false;
        getContacts(0,range);
    } else {
        $(this).removeClass('icon-messages-power-on');  
        $(this).addClass('icon-messages-power-off');  
        isContactPanelPaused = true;
    }
});

$(document).on("click", ".icon-contacts-filters", function(e) { 
    if ($('#filtersContainer').hasClass('in')) {
        $('#contactsContainer').css('height', $('#contactsContainer').height()+99+'px');
        $('.icon-contacts-filters').children('img').addClass('icon-messages');
        $('.icon-contacts-filters').children('img').removeClass('icon-messages-active');
        $('#filtersContainer').collapse('hide');
    } else {
        $('#contactsContainer').css('height', $('#contactsContainer').height()-99+'px');
        $('.icon-contacts-filters').children('img').addClass('icon-messages-active');
        $('.icon-contacts-filters').children('img').removeClass('icon-messages');
        $('#filtersContainer').collapse('show');
    }

    if ($('#advancedSearchContainer').hasClass('in')) {
        $('.icon-contacts-advanced-search').children('img').addClass('icon-messages');
        $('.icon-contacts-advanced-search').children('img').removeClass('icon-messages-active');
        $('#advancedSearchContainer').collapse('hide');
        $('.contactOptionsContainer').show();
        $('.getContactMessages').show();

        $('#advancedSearchResultContainer').hide(); 
        $('#contactsContainer').show();

    }
});

$(document).on("click", ".icon-contacts-advanced-search", function(e) {
    if ($('#advancedSearchContainer').hasClass('in')) {
        $('.icon-contacts-advanced-search').children('img').addClass('icon-messages');
        $('.icon-contacts-advanced-search').children('img').removeClass('icon-messages-active');
        $('#advancedSearchContainer').collapse('hide');
        $('.contactOptionsContainer').show();

        var divHeight = $('#advancedSearchResultContainer').height();
        $('#advancedSearchResultContainer').hide(); 
        $('#contactsContainer').show();
        $('#contactsContainer').css('height', divHeight+81+'px');
    } else {
        $('.icon-contacts-advanced-search').children('img').addClass('icon-messages-active');
        $('.icon-contacts-advanced-search').children('img').removeClass('icon-messages');
        $('#advancedSearchContainer').collapse('show');
        $('.contactOptionsContainer').hide();
        $('#advancedSearchResultContainer').empty();
        $('#searchAdvancedContactInput').val('');
        $('#searchAdvancedContactSelect').prop('selectedIndex',0);

        var divHeight = $('#contactsContainer').height();
        $('#contactsContainer').hide(); 
        $('#advancedSearchResultContainer').show();
        if (!$('#filtersContainer').hasClass('in')) {
            $('#advancedSearchResultContainer').css('height', divHeight-81+'px');
        }
    }

    if ($('#filtersContainer').hasClass('in')) {
        $('#contactsContainer').css('height', $('#contactsContainer').height()+66+'px');
        $('.icon-contacts-filters').children('img').addClass('icon-messages');
        $('.icon-contacts-filters').children('img').removeClass('icon-messages-active');
        $('#filtersContainer').collapse('hide');
    }
});

$(document).on("click", "#searchAdvancedContactButton", function(e) {
    e.preventDefault();
    var searchAdvancedContactSelect = $('#searchAdvancedContactSelect').val();
    var searchAdvancedContactInput = $('#searchAdvancedContactInput').val();
    if ($('#searchAdvancedContactSelect').val() == 'none' || $('#searchAdvancedContactInput').val() == '') {
        screenMsg('Ups!', 'Debes de agregar un texto y seleccionar una opción de búsqueda.', '4000', 'growl-danger');
    } else {
        $('#advancedSearchResultContainer').html('<img src="images/loader.gif" class="contacts-container-loader-style">');
        $.ajax({
            type: "POST",
            data: {type:"getAdvancedSearch",serchType:searchAdvancedContactSelect,text:searchAdvancedContactInput},
            url: "./php/messagingDataTd.php?var=getAdvancedSearch",
            dataType: 'json',
            success: function(response) {
                $('#advancedSearchResultContainer').empty();
                $.each(response, function(index, data) {
                    $('#advancedSearchResultContainer').prepend(contactContainerData(data));
                });
            },
            error: function() {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');
            }
        });     
    }
    console.log($('#searchAdvancedContactSelect').val(), $('#searchAdvancedContactInput').val());
});

function activeMessageContainer() {
    $("#message").css('background-color', '#ffffff');
    $("#message").attr("contenteditable", true); 
    $("#message").empty();
}

function inactiveMessageContainer() {
    $("#message").css('background-color', '#eee');
    $("#message").attr("contenteditable", false); 
    $("#message").empty();
}

function urlify(str) {
    var urlRegex = /(?:(?:https?|http|ftp|file):\/\/|www\.|ftp\.)(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[-A-Z0-9+&@#\/%=~_|$?!:,.])*(?:\([-A-Z0-9+&@#\/%=~_|$?!:,.]*\)|[A-Z0-9+&@#\/%=~_|$])/igm;
    return str.replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + '</a>';
    });
}

$("#message")[0].addEventListener('keypress', (e) => {
    if (((e.keyCode == 13) || (event.code === 'Enter') || (e.which === 13)) && (!(e.shiftKey))) {
        e.preventDefault();
        var entry = $("#message").html();  
        if (!(entry == null || entry == '')) {
            $("#message").empty();
            sendMessage(sanitizingString(entry));
        }
    } else {
        return false;
    }
});

function sendMessage(message) {
    if (message != '') {
        $('#messageLoader').show();
        $.ajax({
            type: "POST",
            data: {type:"sendMessage",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance,activeMessagesPhone:activeMessagesPhone,activeMessagesProvider:getInstanceProvider(activeMessagesInstance),isInternalMessage:isInternalMessage,message:message},
            url: "./php/messagingDataTd.php?var=sendMessage",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    $('#messageLoader').hide();
                    if (response.result == 'success') {
                        screenMsg('Excelente!', 'El mensaje fue enviado con éxito.', '2000', 'growl-success');
                        getMessages(activeMessagesContactId, activeMessagesInstance); 
                        activeMessagesLastMessageId = response.msgId;                       
                    } else {
                        screenMsg('Ups!', 'Hubo un error al enviar el mensaje.', '2000', 'growl-danger');
                    }
                }
            },
            error: function(response) {
                $('#messageLoader').hide();
                screenMsg('Ups!', 'Hubo un error al enviar el mensaje.', '2000', 'growl-danger');
            }
        });
    }
}

$(document).on("click", ".icon-start-conversation", function (e) { 
    startConversation();
});

$(document).on("click", ".whatsapp-emoticon", function (e) {
    e.preventDefault();
    var emoji = $(this).html();
    var message = $("#message").html();
    var newMessage = message + emoji
    $("#message").html(newMessage);
    $("#message").focus();
});

$('body').on('click', function (e) { 
    if (activeMessagesName == '' || activeMessagesPhone == '') {
        e.stopPropagation();
    }
    if (e.target.classList.contains('show-options-container')) {
        if ($('.more-options-container').is(':visible')) {
            $('.show-options-container').removeClass('icons-message-options-active');
            $('.more-options-container').hide();
        } else {
            $('.show-options-container').addClass('icons-message-options-active');
            $('.more-options-container').show();
        }
    } else {
        if ($('.more-options-container').is(':visible')) {
            $('.show-options-container').removeClass('icons-message-options-active');
            $('.more-options-container').hide();
        }
    }

    if (e.target.classList.contains('show-attachment-container')) {
        if ($('.attachment-menu-container').is(':visible')) {
            $('.show-attachment-container').removeClass('icons-message-options-active');
            $('.attachment-menu-container').hide();
        } else {
            $('.show-attachment-container').addClass('icons-message-options-active');
            $('.attachment-menu-container').show();
        }
    } else {
        if ($('.attachment-menu-container').is(':visible')) {
            $('.show-attachment-container').removeClass('icons-message-options-active');
            $('.attachment-menu-container').hide();
        }
    }

    if (e.target.classList.contains('show-icons-container')) {   
        if ($('.icons-container').is(':visible')) {
            $('.show-icons-container').removeClass('icons-message-options-active');
            $('.icons-container').hide();
        } else {
            $('.show-icons-container').addClass('icons-message-options-active');
            $('.icons-container').show();
        }
    } else {
        if ($('.icons-container').is(':visible')) {
            $('.show-icons-container').removeClass('icons-message-options-active');
            $('.icons-container').hide();
        }
    }
});

$(document).on("change", ".image-btn-go", function(e) {
	e.preventDefault();
    $('#sendImageTitle').html('Archivo');
    $('.container-send-image').hide();
    $('.container-save-image').hide();
    var input = this;
    var flag = 0;
    var sendFileAction = $(this).hasClass('attachment-file') ? true : false;
    if (input.files && input.files[0]) {
        var fileName = input.files[0].name; 
        var randomNum = Math.floor(Math.random() * 90000) + 10000;
        fileName = randomNum+fileName.normalize('NFD').replace(/[\u0300-\u036f]/g,"").replace(/\s+/g, '');
        var fileType = input.files[0].type;
        var reader = new FileReader();
        reader.onload = function(e) {
            if (fileType.search('image') >= 0) {
                $('#image2Send').attr('src', e.target.result);
                $('#image2Send').attr('data-source', 'image');
                $('#image2Send').attr('data-name', fileName);
                $('#image2Send').attr('data-type', 'media');
            } else if (fileType.search('video') >= 0) {
                $('#image2Send').attr('src', './images/videoImage.png');
                $('#image2Send').attr('data-source', e.target.result);
                $('#image2Send').attr('data-name', fileName);
                $('#image2Send').attr('data-type', 'media');
            } else if (fileType.search('pdf') >= 0) { 
                $('#image2Send').attr('src', './images/pdfImage.png');
                $('#image2Send').attr('data-source', e.target.result);
                $('#image2Send').attr('data-name', fileName);
                $('#image2Send').attr('data-type', 'document');
            } else if (fileType.search('officedocument') >= 0 || fileType.search('text') >= 0) { 
                $('#image2Send').attr('src', './images/docImage.png');
                $('#image2Send').attr('data-source', e.target.result);
                $('#image2Send').attr('data-name', fileName);
                $('#image2Send').attr('data-type', 'document');
            } else {
                flag++;
            }            
        }
        reader.readAsDataURL(input.files[0]);
        if (flag == 0) {
            if (sendFileAction) {
                $('.container-send-image').show();
                if (isInternalMessage) {
                    $('#sendImageTitle').html('Envío de mensaje interno');
                } else {
                    $('#sendImageTitle').html('Envío de mensaje');
                }
            } else {
                $('.container-save-image').show();
            }
            openImageModal();
        } else {
            screenMsg('Ups!', 'Hubo un error al cargar el archivo.', '2000', 'growl-danger');
        }
    }
});

$(document).on("click", "#sendImage", function(e) {
    e.preventDefault(); 
    $('.image-container-loader').show();
    $('#sendImage').prop('disabled', true);
    var comment = sanitizingString($('#imgAddionalComment').val());
    var name = $('#image2Send').attr('data-name');
    var type = $('#image2Send').attr('data-type');
    if ($('#image2Send').attr('data-source') == 'image') {
        var data = $('#image2Send').attr('src');
    } else {
        var data = $('#image2Send').attr('data-source');
    }
    var fileData = {comment:comment, name:name, type:type, data:data};
    $.ajax({
        type: "POST",
        data: {type:"sendImage",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance,activeMessagesPhone:activeMessagesPhone,activeMessagesProvider:getInstanceProvider(activeMessagesInstance),isInternalMessage:isInternalMessage,fileData:fileData},
        url: "./php/messagingDataTd.php?var=sendImage",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('.image-container-loader').hide();
                $('#sendImage').prop('disabled', false);
                $('#imgAddionalComment').val('');
                $('#imageModal').modal('hide');
                if (response.result == 'success') {
                    screenMsg('Excelente!', 'El mensaje fue enviado con éxito.', '2000', 'growl-success');
                    getMessages(activeMessagesContactId, activeMessagesInstance); 
                    activeMessagesLastMessageId = response.msgId;                       
                } else {
                    screenMsg('Ups!', 'Hubo un error al enviar el mensaje.', '2000', 'growl-danger');
                }
            }
        },
        error: function(response) {
            $('.image-container-loader').hide();
            $('#sendImage').prop('disabled', false);
            $('#imgAddionalComment').val('');
            $('#imageModal').modal('hide');
            screenMsg('Ups!', 'Hubo un error al enviar el mensaje.', '2000', 'growl-danger');
        }
    });
});

$(document).on("click", "#saveImage", function(e) {
    e.preventDefault(); 
    $('.image-container-loader').show();
    $('#saveImage').prop('disabled', true);
    var name = $('#image2Send').attr('data-name');
    var type = $('#image2Send').attr('data-type');
    if ($('#image2Send').attr('data-source') == 'image') {
        var data = $('#image2Send').attr('src');
    } else {
        var data = $('#image2Send').attr('data-source');
    }
    var fileData = {name:name, type:type, data:data};
    $.ajax({
        type: "POST",
        data: {type:"saveContactFile",activeMessagesContactId:activeMessagesContactId,fileData:fileData},
        url: "./php/messagingDataTd.php?var=saveContactFile",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('.image-container-loader').hide();
                $('#saveImage').prop('disabled', false);
                $('#imageModal').modal('hide');
                if (response.result == 'success') {
                    screenMsg('Excelente!', 'El archivo se guardó con éxito.', '2000', 'growl-success'); 
                    var string = '<form class="sync-data-container">';
                    string += '<div class="form-group row-border-bottom contact-file-container contact-file-container-'+response.id+'" style="padding: 0px 0px !important;">';
                    string += '<span><a href="'+response.url+'" target="_blank" style="text-decoration:none;color:#428BCA;">'+response.name+'</a>&nbsp;|&nbsp;<span class="contact-file-icon-'+response.id+'"><i class="fa fa-trash-o delete-contact-file" name="'+response.id+'" aria-hidden="true" style="color:#f00;cursor:pointer"></i></span></span>';
                    string += '<br><label>Se añadió hoy</label>';
                    string += '</div>';
                    string += '</form>';  
                    $('#contactFilesContainer').prepend(string);                
                } else {
                    screenMsg('Ups!', 'Hubo un error al guardar el archivo.', '2000', 'growl-danger');
                }
            }
        },
        error: function(response) {
            $('.image-container-loader').hide();
            $('#saveImage').prop('disabled', false);
            $('#imageModal').modal('hide');
            screenMsg('Ups!', 'Hubo un error al guardar el archivo.', '2000', 'growl-danger');
        }
    });
});

$(document).on("click", ".internal-message-mode", function(e) {
    e.preventDefault(); 
    if (!isInternalMessage) {
        isInternalMessage = 1;
        $("#message").empty();
        $(this).css('color', '#428bca');
        $("#message").attr('data-text', 'Mensaje interno');
        $("#message").css('background-color', '#d9edf7');
        $("#imgAddionalComment").css('background-color', '#d9edf7');
        $("#sendImage").css('background-color', '#428bca');
    } else {
       desactivateInternalMode();
    }
});

$(document).on("click", "#contactFilesContainerDisplay", function(e) {
    e.preventDefault(); 
    if (!$(this).hasClass('collapsed')) {
        //$('#contactFilesContainer').height($('#contactsContainer').height()-44); 
        $('#contactFilesContainer').html('<div style="text-align:center;"><img src="images/loader.gif" style="width:48px;"></div>');
        $.ajax({
            type: "POST",
            data: {type:"getContactFiles",activeMessagesContactId:activeMessagesContactId},
            url: "./php/messagingDataTd.php?var=getContactFiles",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    var len = response.length;
                    console.log(len);
                    var string = '<form class="sync-data-container">';
                    if (len == 0) {
                        string += '<div class="form-group row-border-bottom" style="padding: 0px 0px !important;">';
                        string += '<span>No se encontraron archivos.</span>';
                        string += '</div>';
                        string += '</form>';
                        $('#contactFilesContainer').html(string);
                    } else {
                        $.each(response, function(index, file) {
                            string += '<div class="form-group row-border-bottom contact-file-container contact-file-container-'+file.id+'" style="padding: 0px 0px !important;">';
                            string += '<span><a href="'+file.url+'" target="_blank" style="text-decoration:none;color:#428BCA;">'+file.name+'</a>&nbsp;|&nbsp;<span class="contact-file-icon-'+file.id+'"><i class="fa fa-trash-o delete-contact-file" name="'+file.id+'" aria-hidden="true" style="color:#f00;cursor:pointer"></i></span></span>';
                            string += '<br><label>'+getDateFormat(file.date, 1)+'</label>';
                            string += '</div>';
                            if (index === (len - 1)) {
                                string += '</form>';
                                $('#contactFilesContainer').html(string);
                            }
                        });                        
                    }
                }
            }
        });
    }
}); 

var preventeventFlag = false;
$(document).on("click", "#contactDataContainerDisplay", function(e) {
    e.preventDefault(); 
    preventeventFlag = true;
    $("#syncContact").prop('disabled', true);
    $('.property-changes').html('');
    if (!$(this).hasClass('collapsed')) {
        $('.contacts-data-loader-style').show();
        $.ajax({
            type: "POST",
            data: {type:"getContactData",activeMessagesContactId:activeMessagesContactId},
            url: "./php/messagingDataTd.php?var=getContactData",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    console.log(response);
                    $('.contacts-data-loader-style').hide();
                    $('#sync_id').val(response.id);
                    $("#sync_id").attr('data-value', response.id);
                    $('#sync_idTd').val(response.idTd);
                    $("#sync_idTd").attr('data-value', response.idTd);
                    response.collaborator_OwnerId == null || response.collaborator_OwnerId == '' ? $("#sync_collaborator_OwnerId").val('').change() : $("#sync_collaborator_OwnerId").val(response.collaborator_OwnerId).change();
                    response.collaborator_OwnerId == null || response.collaborator_OwnerId == '' ? $("#sync_collaborator_OwnerId").attr('data-value', '') : $("#sync_collaborator_OwnerId").attr('data-value', response.collaborator_OwnerId);
                    response.contactType_Id == null || response.contactType_Id == '' ? $("#sync_contactType_Id").val('').change() : $("#sync_contactType_Id").val(response.contactType_Id).change();
                    response.contactType_Id == null || response.contactType_Id == '' ? $("#sync_contactType_Id").attr('data-value', '') : $("#sync_contactType_Id").attr('data-value', response.contactType_Id);
                    response.contactOrigin_Id == null || response.contactOrigin_Id == '' ? $("#sync_contactOrigin_Id").val('').change() : $("#sync_contactOrigin_Id").val(response.contactOrigin_Id).change();
                    response.contactOrigin_Id == null || response.contactOrigin_Id == '' ? $("#sync_contactOrigin_Id").attr('data-value', '') : $("#sync_contactOrigin_Id").attr('data-value', response.contactOrigin_Id);
                    response.channel_Id == null || response.channel_Id == '' ? $("#sync_channel_Id").val('').change() : $("#sync_channel_Id").val(response.channel_Id).change(); 
                    response.channel_Id == null || response.channel_Id == '' ? $("#sync_channel_Id").attr('data-value', '') : $("#sync_channel_Id").attr('data-value', response.channel_Id);
                    response.conversionStatus_Id == null || response.conversionStatus_Id == '' ? $("#sync_conversionStatus_Id").val('').change() : $("#sync_conversionStatus_Id").val(response.conversionStatus_Id).change(); 
                    response.conversionStatus_Id == null || response.conversionStatus_Id == '' ? $("#sync_conversionStatus_Id").attr('data-value', '') : $("#sync_conversionStatus_Id").attr('data-value', response.conversionStatus_Id);
                    response.shortName == null || response.shortName == '' ? $("#sync_shortName").val('') : $("#sync_shortName").val(response.shortName); 
                    response.shortName == null || response.shortName == '' ? $("#sync_shortName").attr('data-value', '') : $("#sync_shortName").attr('data-value', response.shortName);
                    response.name == null || response.name == '' ? $("#sync_contactName").val(''): $("#sync_contactName").val(response.name); 
                    response.name == null || response.name == '' ? $("#sync_contactName").attr('data-value', '') : $("#sync_contactName").attr('data-value', response.name);
                    response.lastName == null || response.lastName == '' ? $("#sync_contactLastName").val('') : $("#sync_contactLastName").val(response.lastName); 
                    response.lastName == null || response.lastName == '' ? $("#sync_contactLastName").attr('data-value', '') : $("#sync_contactLastName").attr('data-value', response.lastName);
                    response.facebookProfile == null || response.facebookProfile == '' ? $("#sync_facebookProfile").val('') : $("#sync_facebookProfile").val(response.facebookProfile); 
                    response.facebookProfile == null || response.facebookProfile == '' ?  $("#sync_facebookProfile").attr('data-value', '') : $("#sync_facebookProfile").attr('data-value', response.facebookProfile);
                    response.instagramProfile == null || response.instagramProfile == '' ? $("#sync_instagramProfile").val('') : $("#sync_instagramProfile").val(response.instagramProfile); 
                    response.instagramProfile == null || response.instagramProfile == '' ? $("#sync_instagramProfile").attr('data-value', '') : $("#sync_instagramProfile").attr('data-value', response.instagramProfile);
                    response.email == null || response.email == '' || response.email == 'null' ? $("#sync_contactEmail").val('') : $("#sync_contactEmail").val(response.email); 
                    response.email == null || response.email == '' || response.email == 'null' ? $("#sync_contactEmail").attr('data-value', '') : $("#sync_contactEmail").attr('data-value', response.email);
                    response.phone == null || response.phone == '' ? $("#sync_contactPhone").val('') : $("#sync_contactPhone").val(response.phone); 
                    response.phone == null || response.phone == '' ?  $("#sync_contactPhone").attr('data-value', '') : $("#sync_contactPhone").attr('data-value', response.phone);
                    response.landLine == null || response.landLine == '' ? $('#sync_contactLandLine').val('') : $('#sync_contactLandLine').val(response.landLine); 
                    response.landLine == null || response.landLine == '' ? $("#sync_contactLandLine").attr('data-value', '') : $("#sync_contactLandLine").attr('data-value', response.landLine);
                    /***********************************************************************************************************************************************************************************************************************************************/
                    response.accredited1Name == null || response.accredited1Name == '' ? $("#sync_accredited1Name").val('') : $("#sync_accredited1Name").val(response.accredited1Name); 
                    response.accredited1LastName == null || response.accredited1LastName == '' ? $("#sync_accredited1LastName").val('') : $("#sync_accredited1LastName").val(response.accredited1LastName); 
                    response.accredited1SecondLastName == null || response.accredited1SecondLastName == '' ? $("#sync_accredited1SecondLastName").val('') : $("#sync_accredited1SecondLastName").val(response.accredited1SecondLastName); 
                    response.accredited1Email == null || response.accredited1Email == '' ? $("#sync_accredited1Email").val('') : $("#sync_accredited1Email").val(response.accredited1Email); 
                    response.accredited1Phone == null || response.accredited1Phone == '' ? $("#sync_accredited1Phone").val('') : $("#sync_accredited1Phone").val(response.accredited1Phone); 
                    response.accredited1Gender_Id == null || response.accredited1Gender_Id == '' ? $("#sync_accredited1Gender_Id").val('').change() : $("#sync_accredited1Gender_Id").val(response.accredited1Gender_Id).change();
                    response.accredited1Curp == null || response.accredited1Curp == '' ? $("#sync_accredited1Curp").val('') : $("#sync_accredited1Curp").val(response.accredited1Curp); 
                    response.accredited1Nss == null || response.accredited1Nss == '' ? $("#sync_accredited1Nss").val('') : $("#sync_accredited1Nss").val(response.accredited1Nss); 
                    response.accredited1Rfc == null || response.accredited1Rfc == '' ? $("#sync_accredited1Rfc").val('') : $("#sync_accredited1Rfc").val(response.accredited1Rfc); 
                    response.accredited1Company == null || response.accredited1Company == '' ? $("#sync_accredited1Company").val('') : $("#sync_accredited1Company").val(response.accredited1Company); 
                    response.accredited1School == null || response.accredited1School == '' ? $("#sync_accredited1School").val('') : $("#sync_accredited1School").val(response.accredited1School); 
                    response.accredited1Dob == null || response.accredited1Dob == '' ? $("#sync_accredited1Dob").val('') : $("#sync_accredited1Dob").val(response.accredited1Dob); 
                    response.accredited1Pob == null || response.accredited1Pob == '' ? $("#sync_accredited1Pob").val('').change() : $("#sync_accredited1Pob").val(response.accredited1Pob).change();
                    response.accredited1MaritalStatusId == null || response.accredited1MaritalStatusId == '' ? $("#sync_accredited1MaritalStatusId").val('').change() : $("#sync_accredited1MaritalStatusId").val(response.accredited1MaritalStatusId).change();
                    response.accredited1Street == null || response.accredited1Street == '' ? $("#sync_accredited1Street").val('') : $("#sync_accredited1Street").val(response.accredited1Street); 
                    response.accredited1Neighborhood == null || response.accredited1Neighborhood == '' ? $("#sync_accredited1Neighborhood").val('') : $("#sync_accredited1Neighborhood").val(response.accredited1Neighborhood); 
                    response.accredited1PostalCode == null || response.accredited1PostalCode == '' ? $("#sync_accredited1PostalCode").val('') : $("#sync_accredited1PostalCode").val(response.accredited1PostalCode); 
                    response.accredited1Locality == null || response.accredited1Locality == '' ? $("#sync_accredited1Locality").val('') : $("#sync_accredited1Locality").val(response.accredited1Locality); 
                    response.accredited1State_Id  == null || response.accredited1State_Id  == '' ? $("#sync_accredited1State_Id").val('').change() : $("#sync_accredited1State_Id").val(response.accredited1State_Id).change();
                    response.accredited1CreditType_Id == null || response.accredited1CreditType_Id == '' ? $("#sync_accredited1CreditType_Id").val('').change() : $("#sync_accredited1CreditType_Id").val(response.accredited1CreditType_Id).change(); 
                    response.accredited1CreditTypeOther == null || response.accredited1CreditTypeOther == '' ? $("#sync_accredited1CreditTypeOther").val('') : $("#sync_accredited1CreditTypeOther").val(response.accredited1CreditTypeOther); 
                    response.accredited1MonthlyIncome == null || response.accredited1MonthlyIncome == '' ? $("#sync_accredited1MonthlyIncome").val('') : $("#sync_accredited1MonthlyIncome").val(response.accredited1MonthlyIncome); 
                    response.accredited1MonthlyPay == null || response.accredited1MonthlyPay == '' ? $("#sync_accredited1MonthlyPay").val('') : $("#sync_accredited1MonthlyPay").val(response.accredited1MonthlyPay); 
                    response.accredited1Prequalify == null || response.accredited1Prequalify == '' ? $("#sync_accredited1Prequalify").val('').change() : $("#sync_accredited1Prequalify").val(response.accredited1Prequalify).change();
                    response.accredited1CreditBuro == null || response.accredited1CreditBuro == '' ? $("#sync_accredited1CreditBuro").val('').change() : $("#sync_accredited1CreditBuro").val(response.accredited1CreditBuro).change();
                    response.accredited1CreditCard == null || response.accredited1CreditCard == '' ? $("#sync_accredited1CreditCard").val('') : $("#sync_accredited1CreditCard").val(response.accredited1CreditCard); 
                    response.accredited1CarCredit == null || response.accredited1CarCredit == '' ? $("#sync_accredited1CarCredit").val('').change() : $("#sync_accredited1CarCredit").val(response.accredited1CarCredit).change();
                    response.accredited1CurrentCredit == null || response.accredited1CurrentCredit == '' ? $("#sync_accredited1CurrentCredit").val('').change() : $("#sync_accredited1CurrentCredit").val(response.accredited1CurrentCredit).change();
                    response.accredited1CreditNumber == null || response.accredited1CreditNumber == '' ? $("#sync_accredited1CreditNumber").val('') : $("#sync_accredited1CreditNumber").val(response.accredited1CreditNumber); 
                    response.accredited1PriorityFivissste == null || response.accredited1PriorityFivissste == '' ? $("#sync_accredited1PriorityFivissste").val('') : $("#sync_accredited1PriorityFivissste").val(response.accredited1PriorityFivissste); 
                    response.accredited1CreditAmount == null || response.accredited1CreditAmount == '' ? $("#sync_accredited1CreditAmount").val('') : $("#sync_accredited1CreditAmount").val(response.accredited1CreditAmount); 
                    response.accredited1SubAccountAmount == null || response.accredited1SubAccountAmount == '' ? $("#sync_accredited1SubAccountAmount").val('') : $("#sync_accredited1SubAccountAmount").val(response.accredited1SubAccountAmount); 
                    response.accredited1TitlingExpenses == null || response.accredited1TitlingExpenses == '' ? $("#sync_accredited1TitlingExpenses").val('') : $("#sync_accredited1TitlingExpenses").val(response.accredited1TitlingExpenses); 
                    response.accredited1AvailableSavings == null || response.accredited1AvailableSavings == '' ? $("#sync_accredited1AvailableSavings").val('') : $("#sync_accredited1AvailableSavings").val(response.accredited1AvailableSavings); 
                    response.accredited1HouseBudget == null || response.accredited1HouseBudget == '' ? $("#sync_accredited1HouseBudget").val('') : $("#sync_accredited1HouseBudget").val(response.accredited1HouseBudget); 
                    response.accredited1Taxes == null || response.accredited1Taxes == '' ? $("#sync_accredited1Taxes").val('') : $("#sync_accredited1Taxes").val(response.accredited1Taxes); 
                    response.accredited1Profile_Id == null || response.accredited1Profile_Id == '' ? $("#sync_accredited1Profile_Id").val('').change() : $("#sync_accredited1Profile_Id").val(response.accredited1Profile_Id).change();
                    response.accredited1StateOfInterestId == null || response.accredited1StateOfInterestId == '' ? $("#sync_accredited1StateOfInterestId").val('').change() : $("#sync_accredited1StateOfInterestId").val(response.accredited1StateOfInterestId).change();
                    response.accredited1LocalityOfInterest == null || response.accredited1LocalityOfInterest == '' ? $("#sync_accredited1LocalityOfInterest").val('') : $("#sync_accredited1LocalityOfInterest").val(response.accredited1LocalityOfInterest);                     
                    /***********************************************************************************************************************************************************************************************************************************************/
                    response.accredited1Name == null || response.accredited1Name == '' ?  $("#sync_accredited1Name").attr('data-value', '') : $("#sync_accredited1Name").attr('data-value', response.accredited1Name);
                    response.accredited1LastName == null || response.accredited1LastName == '' ?  $("#sync_accredited1LastName").attr('data-value', '') : $("#sync_accredited1LastName").attr('data-value', response.accredited1LastName);
                    response.accredited1SecondLastName == null || response.accredited1SecondLastName == '' ?  $("#sync_accredited1SecondLastName").attr('data-value', '') : $("#sync_accredited1SecondLastName").attr('data-value', response.accredited1SecondLastName);
                    response.accredited1Email == null || response.accredited1Email == '' ?  $("#sync_accredited1Email").attr('data-value', '') : $("#sync_accredited1Email").attr('data-value', response.accredited1Email);
                    response.accredited1Phone == null || response.accredited1Phone == '' ?  $("#sync_accredited1Phone").attr('data-value', '') : $("#sync_accredited1Phone").attr('data-value', response.accredited1Phone);
                    response.accredited1Gender_Id == null || response.accredited1Gender_Id == '' ?  $("#sync_accredited1Gender_Id").attr('data-value', '') : $("#sync_accredited1Gender_Id").attr('data-value', response.accredited1Gender_Id);
                    response.accredited1Curp == null || response.accredited1Curp == '' ?  $("#sync_accredited1Curp").attr('data-value', '') : $("#sync_accredited1Curp").attr('data-value', response.accredited1Curp);
                    response.accredited1Nss == null || response.accredited1Nss == '' ?  $("#sync_accredited1Nss").attr('data-value', '') : $("#sync_accredited1Nss").attr('data-value', response.accredited1Nss);
                    response.accredited1Rfc == null || response.accredited1Rfc == '' ?  $("#sync_accredited1Rfc").attr('data-value', '') : $("#sync_accredited1Rfc").attr('data-value', response.accredited1Rfc);
                    response.accredited1Company == null || response.accredited1Company == '' ?  $("#sync_accredited1Company").attr('data-value', '') : $("#sync_accredited1Company").attr('data-value', response.accredited1Company);
                    response.accredited1School == null || response.accredited1School == '' ?  $("#sync_accredited1School").attr('data-value', '') : $("#sync_accredited1School").attr('data-value', response.accredited1School);
                    response.accredited1Dob == null || response.accredited1Dob == '' ?  $("#sync_accredited1Dob").attr('data-value', '') : $("#sync_accredited1Dob").attr('data-value', response.accredited1Dob);
                    response.accredited1Pob == null || response.accredited1Pob == '' ?  $("#sync_accredited1Pob").attr('data-value', '') : $("#sync_accredited1Pob").attr('data-value', response.accredited1Pob);
                    response.accredited1MaritalStatusId == null || response.accredited1MaritalStatusId == '' ?  $("#sync_accredited1MaritalStatusId").attr('data-value', '') : $("#sync_accredited1MaritalStatusId").attr('data-value', response.accredited1MaritalStatusId);
                    response.accredited1Street == null || response.accredited1Street == '' ?  $("#sync_accredited1Street").attr('data-value', '') : $("#sync_accredited1Street").attr('data-value', response.accredited1Street);
                    response.accredited1Neighborhood == null || response.accredited1Neighborhood == '' ?  $("#sync_accredited1Neighborhood").attr('data-value', '') : $("#sync_accredited1Neighborhood").attr('data-value', response.accredited1Neighborhood);
                    response.accredited1PostalCode == null || response.accredited1PostalCode == '' ?  $("#sync_accredited1PostalCode").attr('data-value', '') : $("#sync_accredited1PostalCode").attr('data-value', response.accredited1PostalCode);
                    response.accredited1Locality == null || response.accredited1Locality == '' ?  $("#sync_accredited1Locality").attr('data-value', '') : $("#sync_accredited1Locality").attr('data-value', response.accredited1Locality);
                    response.accredited1State_Id  == null || response.accredited1State_Id  == '' ?  $("#sync_accredited1State_Id ").attr('data-value', '') : $("#sync_accredited1State_Id ").attr('data-value', response.accredited1State_Id );
                    response.accredited1CreditType_Id == null || response.accredited1CreditType_Id == '' ?  $("#sync_accredited1CreditType_Id").attr('data-value', '') : $("#sync_accredited1CreditType_Id").attr('data-value', response.accredited1CreditType_Id);
                    response.accredited1CreditTypeOther == null || response.accredited1CreditTypeOther == '' ?  $("#sync_accredited1CreditTypeOther").attr('data-value', '') : $("#sync_accredited1CreditTypeOther").attr('data-value', response.accredited1CreditTypeOther);
                    response.accredited1MonthlyIncome == null || response.accredited1MonthlyIncome == '' ?  $("#sync_accredited1MonthlyIncome").attr('data-value', '') : $("#sync_accredited1MonthlyIncome").attr('data-value', response.accredited1MonthlyIncome);
                    response.accredited1MonthlyPay == null || response.accredited1MonthlyPay == '' ?  $("#sync_accredited1MonthlyPay").attr('data-value', '') : $("#sync_accredited1MonthlyPay").attr('data-value', response.accredited1MonthlyPay);
                    response.accredited1Prequalify == null || response.accredited1Prequalify == '' ?  $("#sync_accredited1Prequalify").attr('data-value', '') : $("#sync_accredited1Prequalify").attr('data-value', response.accredited1Prequalify);
                    response.accredited1CreditBuro == null || response.accredited1CreditBuro == '' ?  $("#sync_accredited1CreditBuro").attr('data-value', '') : $("#sync_accredited1CreditBuro").attr('data-value', response.accredited1CreditBuro);
                    response.accredited1CreditCard == null || response.accredited1CreditCard == '' ?  $("#sync_accredited1CreditCard").attr('data-value', '') : $("#sync_accredited1CreditCard").attr('data-value', response.accredited1CreditCard);
                    response.accredited1CarCredit == null || response.accredited1CarCredit == '' ?  $("#sync_accredited1CarCredit").attr('data-value', '') : $("#sync_accredited1CarCredit").attr('data-value', response.accredited1CarCredit);
                    response.accredited1CurrentCredit == null || response.accredited1CurrentCredit == '' ?  $("#sync_accredited1CurrentCredit").attr('data-value', '') : $("#sync_accredited1CurrentCredit").attr('data-value', response.accredited1CurrentCredit);
                    response.accredited1CreditNumber == null || response.accredited1CreditNumber == '' ?  $("#sync_accredited1CreditNumber").attr('data-value', '') : $("#sync_accredited1CreditNumber").attr('data-value', response.accredited1CreditNumber);
                    response.accredited1PriorityFivissste == null || response.accredited1PriorityFivissste == '' ?  $("#sync_accredited1PriorityFivissste").attr('data-value', '') : $("#sync_accredited1PriorityFivissste").attr('data-value', response.accredited1PriorityFivissste);
                    response.accredited1CreditAmount == null || response.accredited1CreditAmount == '' ?  $("#sync_accredited1CreditAmount").attr('data-value', '') : $("#sync_accredited1CreditAmount").attr('data-value', response.accredited1CreditAmount);
                    response.accredited1SubAccountAmount == null || response.accredited1SubAccountAmount == '' ?  $("#sync_accredited1SubAccountAmount").attr('data-value', '') : $("#sync_accredited1SubAccountAmount").attr('data-value', response.accredited1SubAccountAmount);
                    response.accredited1TitlingExpenses == null || response.accredited1TitlingExpenses == '' ?  $("#sync_accredited1TitlingExpenses").attr('data-value', '') : $("#sync_accredited1TitlingExpenses").attr('data-value', response.accredited1TitlingExpenses);
                    response.accredited1AvailableSavings == null || response.accredited1AvailableSavings == '' ?  $("#sync_accredited1AvailableSavings").attr('data-value', '') : $("#sync_accredited1AvailableSavings").attr('data-value', response.accredited1AvailableSavings);
                    response.accredited1HouseBudget == null || response.accredited1HouseBudget == '' ?  $("#sync_accredited1HouseBudget").attr('data-value', '') : $("#sync_accredited1HouseBudget").attr('data-value', response.accredited1HouseBudget);
                    response.accredited1Taxes == null || response.accredited1Taxes == '' ?  $("#sync_accredited1Taxes").attr('data-value', '') : $("#sync_accredited1Taxes").attr('data-value', response.accredited1Taxes);
                    response.accredited1Profile_Id == null || response.accredited1Profile_Id == '' ?  $("#sync_accredited1Profile_Id").attr('data-value', '') : $("#sync_accredited1Profile_Id").attr('data-value', response.accredited1Profile_Id);
                    response.accredited1StateOfInterestId == null || response.accredited1StateOfInterestId == '' ?  $("#sync_accredited1StateOfInterestId").attr('data-value', '') : $("#sync_accredited1StateOfInterestId").attr('data-value', response.accredited1StateOfInterestId);
                    response.accredited1LocalityOfInterest == null || response.accredited1LocalityOfInterest == '' ?  $("#sync_accredited1LocalityOfInterest").attr('data-value', '') : $("#sync_accredited1LocalityOfInterest").attr('data-value', response.accredited1LocalityOfInterest);
                    /***********************************************************************************************************************************************************************************************************************************************/
                    response.accredited2Name == null || response.accredited2Name == '' ? $("#sync_accredited2Name").val('') : $("#sync_accredited2Name").val(response.accredited2Name); 
                    response.accredited2LastName == null || response.accredited2LastName == '' ? $("#sync_accredited2LastName").val('') : $("#sync_accredited2LastName").val(response.accredited2LastName); 
                    response.accredited2SecondLastName == null || response.accredited2SecondLastName == '' ? $("#sync_accredited2SecondLastName").val('') : $("#sync_accredited2SecondLastName").val(response.accredited2SecondLastName); 
                    response.accredited2Email == null || response.accredited2Email == '' ? $("#sync_accredited2Email").val('') : $("#sync_accredited2Email").val(response.accredited2Email); 
                    response.accredited2Phone == null || response.accredited2Phone == '' ? $("#sync_accredited2Phone").val('') : $("#sync_accredited2Phone").val(response.accredited2Phone); 
                    response.accredited2Gender_Id == null || response.accredited2Gender_Id == '' ? $("#sync_accredited2Gender_Id").val('').change() : $("#sync_accredited2Gender_Id").val(response.accredited2Gender_Id).change();
                    response.accredited2Curp == null || response.accredited2Curp == '' ? $("#sync_accredited2Curp").val('') : $("#sync_accredited2Curp").val(response.accredited2Curp); 
                    response.accredited2Nss == null || response.accredited2Nss == '' ? $("#sync_accredited2Nss").val('') : $("#sync_accredited2Nss").val(response.accredited2Nss); 
                    response.accredited2Rfc == null || response.accredited2Rfc == '' ? $("#sync_accredited2Rfc").val('') : $("#sync_accredited2Rfc").val(response.accredited2Rfc); 
                    response.accredited2Company == null || response.accredited2Company == '' ? $("#sync_accredited2Company").val('') : $("#sync_accredited2Company").val(response.accredited2Company); 
                    response.accredited2School == null || response.accredited2School == '' ? $("#sync_accredited2School").val('') : $("#sync_accredited2School").val(response.accredited2School); 
                    response.accredited2Dob == null || response.accredited2Dob == '' ? $("#sync_accredited2Dob").val('') : $("#sync_accredited2Dob").val(response.accredited2Dob); 
                    response.accredited2Pob == null || response.accredited2Pob == '' ? $("#sync_accredited2Pob").val('').change() : $("#sync_accredited2Pob").val(response.accredited2Pob).change();
                    response.accredited2MaritalStatusId == null || response.accredited2MaritalStatusId == '' ? $("#sync_accredited2MaritalStatusId").val('').change() : $("#sync_accredited2MaritalStatusId").val(response.accredited2MaritalStatusId).change();
                    response.accredited2Street == null || response.accredited2Street == '' ? $("#sync_accredited2Street").val('') : $("#sync_accredited2Street").val(response.accredited2Street); 
                    response.accredited2Neighborhood == null || response.accredited2Neighborhood == '' ? $("#sync_accredited2Neighborhood").val('') : $("#sync_accredited2Neighborhood").val(response.accredited2Neighborhood); 
                    response.accredited2PostalCode == null || response.accredited2PostalCode == '' ? $("#sync_accredited2PostalCode").val('') : $("#sync_accredited2PostalCode").val(response.accredited2PostalCode); 
                    response.accredited2Locality == null || response.accredited2Locality == '' ? $("#sync_accredited2Locality").val('') : $("#sync_accredited2Locality").val(response.accredited2Locality); 
                    response.accredited2State_Id  == null || response.accredited2State_Id  == '' ? $("#sync_accredited2State_Id").val('').change() : $("#sync_accredited2State_Id").val(response.accredited2State_Id).change();
                    response.accredited2CreditType_Id == null || response.accredited2CreditType_Id == '' ? $("#sync_accredited2CreditType_Id").val('').change() : $("#sync_accredited2CreditType_Id").val(response.accredited2CreditType_Id).change(); 
                    response.accredited2CreditTypeOther == null || response.accredited2CreditTypeOther == '' ? $("#sync_accredited2CreditTypeOther").val('') : $("#sync_accredited2CreditTypeOther").val(response.accredited2CreditTypeOther); 
                    response.accredited2MonthlyIncome == null || response.accredited2MonthlyIncome == '' ? $("#sync_accredited2MonthlyIncome").val('') : $("#sync_accredited2MonthlyIncome").val(response.accredited2MonthlyIncome); 
                    response.accredited2MonthlyPay == null || response.accredited2MonthlyPay == '' ? $("#sync_accredited2MonthlyPay").val('') : $("#sync_accredited2MonthlyPay").val(response.accredited2MonthlyPay); 
                    response.accredited2Prequalify == null || response.accredited2Prequalify == '' ? $("#sync_accredited2Prequalify").val('').change() : $("#sync_accredited2Prequalify").val(response.accredited2Prequalify).change();
                    response.accredited2CreditBuro == null || response.accredited2CreditBuro == '' ? $("#sync_accredited2CreditBuro").val('').change() : $("#sync_accredited2CreditBuro").val(response.accredited2CreditBuro).change();
                    response.accredited2CreditCard == null || response.accredited2CreditCard == '' ? $("#sync_accredited2CreditCard").val('') : $("#sync_accredited2CreditCard").val(response.accredited2CreditCard); 
                    response.accredited2CarCredit == null || response.accredited2CarCredit == '' ? $("#sync_accredited2CarCredit").val('').change() : $("#sync_accredited2CarCredit").val(response.accredited2CarCredit).change();
                    response.accredited2CurrentCredit == null || response.accredited2CurrentCredit == '' ? $("#sync_accredited2CurrentCredit").val('').change() : $("#sync_accredited2CurrentCredit").val(response.accredited2CurrentCredit).change();
                    response.accredited2CreditNumber == null || response.accredited2CreditNumber == '' ? $("#sync_accredited2CreditNumber").val('') : $("#sync_accredited2CreditNumber").val(response.accredited2CreditNumber); 
                    response.accredited2PriorityFivissste == null || response.accredited2PriorityFivissste == '' ? $("#sync_accredited2PriorityFivissste").val('') : $("#sync_accredited2PriorityFivissste").val(response.accredited2PriorityFivissste); 
                    response.accredited2CreditAmount == null || response.accredited2CreditAmount == '' ? $("#sync_accredited2CreditAmount").val('') : $("#sync_accredited2CreditAmount").val(response.accredited2CreditAmount); 
                    response.accredited2SubAccountAmount == null || response.accredited2SubAccountAmount == '' ? $("#sync_accredited2SubAccountAmount").val('') : $("#sync_accredited2SubAccountAmount").val(response.accredited2SubAccountAmount); 
                    response.accredited2TitlingExpenses == null || response.accredited2TitlingExpenses == '' ? $("#sync_accredited2TitlingExpenses").val('') : $("#sync_accredited2TitlingExpenses").val(response.accredited2TitlingExpenses); 
                    response.accredited2AvailableSavings == null || response.accredited2AvailableSavings == '' ? $("#sync_accredited2AvailableSavings").val('') : $("#sync_accredited2AvailableSavings").val(response.accredited2AvailableSavings); 
                    response.accredited2HouseBudget == null || response.accredited2HouseBudget == '' ? $("#sync_accredited2HouseBudget").val('') : $("#sync_accredited2HouseBudget").val(response.accredited2HouseBudget); 
                    response.accredited2Taxes == null || response.accredited2Taxes == '' ? $("#sync_accredited2Taxes").val('') : $("#sync_accredited2Taxes").val(response.accredited2Taxes); 
                    response.accredited2Profile_Id == null || response.accredited2Profile_Id == '' ? $("#sync_accredited2Profile_Id").val('').change() : $("#sync_accredited2Profile_Id").val(response.accredited2Profile_Id).change();
                    response.accredited2StateOfInterestId == null || response.accredited2StateOfInterestId == '' ? $("#sync_accredited2StateOfInterestId").val('').change() : $("#sync_accredited2StateOfInterestId").val(response.accredited2StateOfInterestId).change();
                    response.accredited2LocalityOfInterest == null || response.accredited2LocalityOfInterest == '' ? $("#sync_accredited2LocalityOfInterest").val('') : $("#sync_accredited2LocalityOfInterest").val(response.accredited2LocalityOfInterest);                         
                    /***********************************************************************************************************************************************************************************************************************************************/
                    response.accredited2Name == null || response.accredited2Name == '' ?  $("#sync_accredited2Name").attr('data-value', '') : $("#sync_accredited2Name").attr('data-value', response.accredited2Name);
                    response.accredited2LastName == null || response.accredited2LastName == '' ?  $("#sync_accredited2LastName").attr('data-value', '') : $("#sync_accredited2LastName").attr('data-value', response.accredited2LastName);
                    response.accredited2SecondLastName == null || response.accredited2SecondLastName == '' ?  $("#sync_accredited2SecondLastName").attr('data-value', '') : $("#sync_accredited2SecondLastName").attr('data-value', response.accredited2SecondLastName);
                    response.accredited2Email == null || response.accredited2Email == '' ?  $("#sync_accredited2Email").attr('data-value', '') : $("#sync_accredited2Email").attr('data-value', response.accredited2Email);
                    response.accredited2Phone == null || response.accredited2Phone == '' ?  $("#sync_accredited2Phone").attr('data-value', '') : $("#sync_accredited2Phone").attr('data-value', response.accredited2Phone);
                    response.accredited2Gender_Id == null || response.accredited2Gender_Id == '' ?  $("#sync_accredited2Gender_Id").attr('data-value', '') : $("#sync_accredited2Gender_Id").attr('data-value', response.accredited2Gender_Id);
                    response.accredited2Curp == null || response.accredited2Curp == '' ?  $("#sync_accredited2Curp").attr('data-value', '') : $("#sync_accredited2Curp").attr('data-value', response.accredited2Curp);
                    response.accredited2Nss == null || response.accredited2Nss == '' ?  $("#sync_accredited2Nss").attr('data-value', '') : $("#sync_accredited2Nss").attr('data-value', response.accredited2Nss);
                    response.accredited2Rfc == null || response.accredited2Rfc == '' ?  $("#sync_accredited2Rfc").attr('data-value', '') : $("#sync_accredited2Rfc").attr('data-value', response.accredited2Rfc);
                    response.accredited2Company == null || response.accredited2Company == '' ?  $("#sync_accredited2Company").attr('data-value', '') : $("#sync_accredited2Company").attr('data-value', response.accredited2Company);
                    response.accredited2School == null || response.accredited2School == '' ?  $("#sync_accredited2School").attr('data-value', '') : $("#sync_accredited2School").attr('data-value', response.accredited2School);
                    response.accredited2Dob == null || response.accredited2Dob == '' ?  $("#sync_accredited2Dob").attr('data-value', '') : $("#sync_accredited2Dob").attr('data-value', response.accredited2Dob);
                    response.accredited2Pob == null || response.accredited2Pob == '' ?  $("#sync_accredited2Pob").attr('data-value', '') : $("#sync_accredited2Pob").attr('data-value', response.accredited2Pob);
                    response.accredited2MaritalStatusId == null || response.accredited2MaritalStatusId == '' ?  $("#sync_accredited2MaritalStatusId").attr('data-value', '') : $("#sync_accredited2MaritalStatusId").attr('data-value', response.accredited2MaritalStatusId);
                    response.accredited2Street == null || response.accredited2Street == '' ?  $("#sync_accredited2Street").attr('data-value', '') : $("#sync_accredited2Street").attr('data-value', response.accredited2Street);
                    response.accredited2Neighborhood == null || response.accredited2Neighborhood == '' ?  $("#sync_accredited2Neighborhood").attr('data-value', '') : $("#sync_accredited2Neighborhood").attr('data-value', response.accredited2Neighborhood);
                    response.accredited2PostalCode == null || response.accredited2PostalCode == '' ?  $("#sync_accredited2PostalCode").attr('data-value', '') : $("#sync_accredited2PostalCode").attr('data-value', response.accredited2PostalCode);
                    response.accredited2Locality == null || response.accredited2Locality == '' ?  $("#sync_accredited2Locality").attr('data-value', '') : $("#sync_accredited2Locality").attr('data-value', response.accredited2Locality);
                    response.accredited2State_Id  == null || response.accredited2State_Id  == '' ?  $("#sync_accredited2State_Id ").attr('data-value', '') : $("#sync_accredited2State_Id ").attr('data-value', response.accredited2State_Id );
                    response.accredited2CreditType_Id == null || response.accredited2CreditType_Id == '' ?  $("#sync_accredited2CreditType_Id").attr('data-value', '') : $("#sync_accredited2CreditType_Id").attr('data-value', response.accredited2CreditType_Id);
                    response.accredited2CreditTypeOther == null || response.accredited2CreditTypeOther == '' ?  $("#sync_accredited2CreditTypeOther").attr('data-value', '') : $("#sync_accredited2CreditTypeOther").attr('data-value', response.accredited2CreditTypeOther);
                    response.accredited2MonthlyIncome == null || response.accredited2MonthlyIncome == '' ?  $("#sync_accredited2MonthlyIncome").attr('data-value', '') : $("#sync_accredited2MonthlyIncome").attr('data-value', response.accredited2MonthlyIncome);
                    response.accredited2MonthlyPay == null || response.accredited2MonthlyPay == '' ?  $("#sync_accredited2MonthlyPay").attr('data-value', '') : $("#sync_accredited2MonthlyPay").attr('data-value', response.accredited2MonthlyPay);
                    response.accredited2Prequalify == null || response.accredited2Prequalify == '' ?  $("#sync_accredited2Prequalify").attr('data-value', '') : $("#sync_accredited2Prequalify").attr('data-value', response.accredited2Prequalify);
                    response.accredited2CreditBuro == null || response.accredited2CreditBuro == '' ?  $("#sync_accredited2CreditBuro").attr('data-value', '') : $("#sync_accredited2CreditBuro").attr('data-value', response.accredited2CreditBuro);
                    response.accredited2CreditCard == null || response.accredited2CreditCard == '' ?  $("#sync_accredited2CreditCard").attr('data-value', '') : $("#sync_accredited2CreditCard").attr('data-value', response.accredited2CreditCard);
                    response.accredited2CarCredit == null || response.accredited2CarCredit == '' ?  $("#sync_accredited2CarCredit").attr('data-value', '') : $("#sync_accredited2CarCredit").attr('data-value', response.accredited2CarCredit);
                    response.accredited2CurrentCredit == null || response.accredited2CurrentCredit == '' ?  $("#sync_accredited2CurrentCredit").attr('data-value', '') : $("#sync_accredited2CurrentCredit").attr('data-value', response.accredited2CurrentCredit);
                    response.accredited2CreditNumber == null || response.accredited2CreditNumber == '' ?  $("#sync_accredited2CreditNumber").attr('data-value', '') : $("#sync_accredited2CreditNumber").attr('data-value', response.accredited2CreditNumber);
                    response.accredited2PriorityFivissste == null || response.accredited2PriorityFivissste == '' ?  $("#sync_accredited2PriorityFivissste").attr('data-value', '') : $("#sync_accredited2PriorityFivissste").attr('data-value', response.accredited2PriorityFivissste);
                    response.accredited2CreditAmount == null || response.accredited2CreditAmount == '' ?  $("#sync_accredited2CreditAmount").attr('data-value', '') : $("#sync_accredited2CreditAmount").attr('data-value', response.accredited2CreditAmount);
                    response.accredited2SubAccountAmount == null || response.accredited2SubAccountAmount == '' ?  $("#sync_accredited2SubAccountAmount").attr('data-value', '') : $("#sync_accredited2SubAccountAmount").attr('data-value', response.accredited2SubAccountAmount);
                    response.accredited2TitlingExpenses == null || response.accredited2TitlingExpenses == '' ?  $("#sync_accredited2TitlingExpenses").attr('data-value', '') : $("#sync_accredited2TitlingExpenses").attr('data-value', response.accredited2TitlingExpenses);
                    response.accredited2AvailableSavings == null || response.accredited2AvailableSavings == '' ?  $("#sync_accredited2AvailableSavings").attr('data-value', '') : $("#sync_accredited2AvailableSavings").attr('data-value', response.accredited2AvailableSavings);
                    response.accredited2HouseBudget == null || response.accredited2HouseBudget == '' ?  $("#sync_accredited2HouseBudget").attr('data-value', '') : $("#sync_accredited2HouseBudget").attr('data-value', response.accredited2HouseBudget);
                    response.accredited2Taxes == null || response.accredited2Taxes == '' ?  $("#sync_accredited2Taxes").attr('data-value', '') : $("#sync_accredited2Taxes").attr('data-value', response.accredited2Taxes);
                    response.accredited2Profile_Id == null || response.accredited2Profile_Id == '' ?  $("#sync_accredited2Profile_Id").attr('data-value', '') : $("#sync_accredited2Profile_Id").attr('data-value', response.accredited2Profile_Id);
                    response.accredited2StateOfInterestId == null || response.accredited2StateOfInterestId == '' ?  $("#sync_accredited2StateOfInterestId").attr('data-value', '') : $("#sync_accredited2StateOfInterestId").attr('data-value', response.accredited2StateOfInterestId);
                    response.accredited2LocalityOfInterest == null || response.accredited2LocalityOfInterest == '' ?  $("#sync_accredited2LocalityOfInterest").attr('data-value', '') : $("#sync_accredited2LocalityOfInterest").attr('data-value', response.accredited2LocalityOfInterest);                    
                    /***********************************************************************************************************************************************************************************************************************************************/
                    response.coacreditedCreditType_Id == null || response.coacreditedCreditType_Id == '' ? $("#sync_coacreditedCreditType_Id").val('').change() : $("#sync_coacreditedCreditType_Id").val(response.coacreditedCreditType_Id).change();
                    response.coacreditedCreditType_Id == null || response.coacreditedCreditType_Id == '' ?  $("#sync_coacreditedCreditType_Id").attr('data-value', '') : $("#sync_coacreditedCreditType_Id").attr('data-value', response.coacreditedCreditType_Id);
                    response.coacreditedBudget == null || response.coacreditedBudget == '' ? $("#sync_coacreditedBudget").val('') : $("#sync_coacreditedBudget").val(response.coacreditedBudget); 
                    response.coacreditedBudget == null || response.coacreditedBudget == '' ?  $("#sync_coacreditedBudget").attr('data-value', '') : $("#sync_coacreditedBudget").attr('data-value', response.coacreditedBudget);
                    response.visitedtUrl == null || response.visitedtUrl == '' ? $("#sync_visitedtUrl").val('') : $("#sync_visitedtUrl").val(response.visitedtUrl); 
                    response.visitedtUrl == null || response.visitedtUrl == '' ?  $("#sync_visitedtUrl").attr('data-value', '') : $("#sync_visitedtUrl").attr('data-value', response.visitedtUrl);
                    preventeventFlag = false;
                }
            }
        });
    }
});

$(document).on("keyup", ".sync-data-container input", function(e) {
    e.preventDefault();
    if (!preventeventFlag) {
        hubspotChanges();
    }
});

$(document).on("change", ".sync-data-container select", function(e) {
    e.preventDefault();
    if (!preventeventFlag) {
        hubspotChanges();
    }
});

var userDataChanges = {};
function hubspotChanges() {   
    var flag = 0;
    userDataChanges = {};
    var len = $('[id^="sync_"]').length;
    $('[id^="sync_"]').each(function(i, input) {
        idValue = $(input).attr('id').substring(5);  
        newValue = $(input).val() == '' || $(input).val() == null ? null : $(input).val();
        currentValue = $(input).attr('data-value') ? $(input).attr('data-value') : null;
        if (newValue != currentValue) {
            userDataChanges[capitalizeFirstLetter(idValue)] = newValue;
            flag++;
        }
        if (i === (len - 1)) {
            if (flag == 1) {
                $("#syncContact").prop('disabled', false);
                $('.property-changes').html('Cambiaste 1 propiedad.');
            } else if (flag > 1) {
                $("#syncContact").prop('disabled', false);
                $('.property-changes').html('Cambiaste ' + flag + ' propiedades.');              
            } else {
                $("#syncContact").prop('disabled', true);
                $('.property-changes').html('');
            }                  
        }  
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).on("click", "#syncContact", function(e) {
    e.preventDefault(); 
    console.log(userDataChanges);
    $.ajax({
        type: "POST",
        data: {type:"updateUserData",activeMessagesContactId:activeMessagesContactId,contactId:$('#sync_id').val(),userDataChanges:userDataChanges},
        url: "./php/messagingDataTd.php?var=updateUserData",
        dataType: 'json',
        success: function(response) {
            if (response.result == 'success') {
                screenMsg('Excelente!', 'El contacto fue actualizado con éxito.', '2000', 'growl-success');
            } else {
                screenMsg('Ups!', 'Hubo un error, por favor intentalo más tarde.', '2000', 'growl-danger');
            }
            $("#syncContact").prop('disabled', true);
            $('.property-changes').html('');
        },
        error: function() {
            screenMsg('Ups!', 'Hubo un error, por favor intentalo más tarde.', '2000', 'growl-danger');
            $("#syncContact").prop('disabled', true);
            $('.property-changes').html('');
        }
    });
});

function resetContactData() {
    $('#sync_idTd').val('');
    $("#sync_ownerId").val('none').change();
    $("#sync_contactTypeId").val('none').change();
    $("#sync_originId").val('none').change();
    $("#sync_channelId").val('none').change();
    $("#sync_conversationStatusId").val('none').change();
    return false;
}

$(document).on("click", ".delete-contact-file", function(e) {
    e.preventDefault(); 
    var fileId = $(this).attr('name');
    $('.contact-file-icon-'+fileId).html('<img src="images/loader.gif" style="width:12px;">');
    $.ajax({
        type: "POST",
        data: {type:"deleteContactFiles",activeMessagesContactId:activeMessagesContactId,fileId:fileId},
        url: "./php/messagingDataTd.php?var=deleteContactFiles",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.result == 'success') {
                    screenMsg('Excelente!', 'El archivo fue eliminado con éxito.', '2000', 'growl-success');
                    $('.contact-file-container-'+fileId).remove();
                    if ($('.contact-file-container').length == 0) {
                        var string = '<form class="sync-data-container">';
                        string += '<div class="form-group row-border-bottom" style="padding: 0px 0px !important;">';
                        string += '<span>No se encontraron archivos.</span>';
                        string += '</div>';
                        string += '</form>';
                        $('#contactFilesContainer').html(string);
                    }
                } else {
                    screenMsg('Ups!', 'Hubo un error al tratar de eliminar el mensaje.', '2000', 'growl-danger');
                    $('.contact-file-icon-'+fileId).html('<i class="fa fa-trash-o delete-contact-file" name="'+fileId+'" aria-hidden="true" style="color:#f00;cursor:pointer"></i>');
                }
            }
        },
        error: function(response) {
            screenMsg('Ups!', 'Hubo un error al tratar de eliminar el mensaje.', '2000', 'growl-danger');
            $('.contact-file-icon-'+fileId).html('<i class="fa fa-trash-o delete-contact-file" name="'+fileId+'" aria-hidden="true" style="color:#f00;cursor:pointer"></i>');
        }
    });
});

function desactivateInternalMode() {
    isInternalMessage = 0;
    $("#message").empty();
    $('.internal-message-mode').css('color', '#c1c1c1');
    $("#message").attr('data-text', 'Escribe un mensaje');
    $("#message").css('background-color', '#ffffff');
    $("#imgAddionalComment").css('background-color', '#ffffff');
    $("#sendImage").css('background-color', '#5cb85c');
    return false;
}

function sanitizingString(entry) {
    entry = entry.replace(/&nbsp;/g, " ");
    entry = entry.replace(/&amp;/g, "&");
    entry = entry.replace(/<br>/g, "\n");
    entry = entry.replace(/<\/div><div>/g, "\n");
    entry = entry.replace(/<div>/g, "");
    entry = entry.replace(/<\/div>/g, "");
    return entry;
}

function screenMsg(textTitle, textMsg, time, className) {
    jQuery.gritter.add({
        title: textTitle,
        text: textMsg,
        class_name: className,
        sticky: false,
        time: time
    });
    return false;
}

$(document).on("click", "#showScheduleMessageContainer", function(e) {
    e.preventDefault(); 
    viewScheduleMessageContainer();
});

$(document).on("click", "#showContactTaskContainer", function(e) {
    e.preventDefault(); 
    viewContactTaskContainer();
});

$(document).on("click", "#showContactFavoriteContainer", function(e) {
    e.preventDefault(); 
    viewContactFavoriteContainer();
});

function preload_image(im_url) {
    let img = new Image();
    img.src = im_url;
}