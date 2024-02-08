
function startConversation() { 
    resetStartConversationForm();
    $("#openStartConversationModal").click(); 
    return false;
}

function resetStartConversationForm() {
    $('#startConversationName').val('');
    $('#startConversationLastName').val('');
    $('#startConversationSecondLastName').val('');
    $('#startConversationPhone').val('');
    $('#startConversationMail').val('');
    $('#startConversationInstance').select2('data', { id:0, text:'Selecciona una Instancia *'});
    $('#startConversationAdviser').select2('data', { id:0, text:'Selecciona un Asesor *'});
    $('#startConversationMessage').val('');
    $('#startConversationInternalMsg').val('');
    $('#startConversationCancel').prop('disabled', false);
    $('#startConversationGo').prop('disabled', false);
    $('.new-contact-container-loader').hide();
    return false;
}

$(document).on("click", "#startConversationGo", function(e) {
    e.preventDefault();
    var flag = 0;
    var regString = /^([a-zA-Z0-9 _-áéíóúÁÉÍÓÚÜüÑñ]+)$/;
    var regPhone = /^[\+](\d{12})$|^(\d{10})$|^(\d{12})$/;
    var regMail = /^(\s*|(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/; 

    if ($('#startConversationName').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el nombre.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regString.test($('#startConversationName').val()))) {
            screenMsg('Ups!', 'El nombre no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if ($('#startConversationLastName').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el apellido.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regString.test($('#startConversationLastName').val()))) {
            screenMsg('Ups!', 'El apellido no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if ($('#startConversationPhone').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el teléfono.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regPhone.test($('#startConversationPhone').val()))) {
            screenMsg('Ups!', 'El número de teléfono no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if (!(regMail.test($('#startConversationMail').val()))) {
        screenMsg('Ups!', 'El email no es válido.', '4000', 'growl-danger');
        flag++;
    }

    if ($('#startConversationInstance').val() == 0) {
        screenMsg('Ups!', 'Debes seleccionar una instancia.', '4000', 'growl-danger');
        flag++;
    }

    if ($('#startConversationAdviser').val() == 0) {
        screenMsg('Ups!', 'Debes seleccionar una instancia.', '4000', 'growl-danger');
        flag++;
    }    

    if ($('#startConversationMessageFlag').is(":checked")) {
        if ($('#startConversationMessage').val() == 0) {
            screenMsg('Ups!', 'Debes ingresar el mensaje al cliente.', '4000', 'growl-danger');
            flag++;
        } 
    }

    if ($('#startConversationInternalMsg').val() == 0) {
        screenMsg('Ups!', 'Debes ingresar un mensaje interno.', '4000', 'growl-danger');
        flag++;
    } 

    var startConversationData = {
        name:$('#startConversationName').val(), 
        lastName:$('#startConversationLastName').val(), 
        phone:$('#startConversationPhone').val(),
        email:$('#startConversationMail').val(),
        instance:$('#startConversationInstance').val(),
        adviser:$('#startConversationAdviser').val(),
        messageFlag:$('#startConversationMessageFlag').is(":checked") ? 1 : 0,
        message:$('#startConversationMessage').val(),
        internalMessage:$('#startConversationInternalMsg').val()
        };

    if (flag == 0) {
        $('#startConversationGo').prop('disabled', true);
        $('#startConversationCancel').prop('disabled', true);
        $('.new-contact-container-loader').show();
        $.ajax({
            type: "POST",
            data: {type:"startConversationGo",startConversationData:startConversationData},
            url: "./php/wainboxData.php?var=startConversationGo",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    screenMsg('Excelente!', 'El contacto fue dado de alta con éxito.', '4000', 'growl-success');
                    $('#startConversationModal').modal('hide');
                    activeMessagesLastMessageId = response.msgId;  
                    getContacts(0,range);  
                } else if (response.result == 'duplicate') {
                    screenMsg('El teléfono ya existe.!', 'Verifica en Búsqueda avanzada.', '4000', 'growl-warning');
                    $('#startConversationModal').modal('hide');
                } else {
                    screenMsg('Ups!', response.msgId, '4000', 'growl-danger');   
                    $('#startConversationModal').modal('hide');
                }
            },
            error: function(response) {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                $('#startConversationModal').modal('hide');
            }
        });
        /*setTimeout(
            function() 
            {
                $('#startConversationModal').modal('hide');
                resetStartConversationForm();
            }, 3000);*/
    }
});

$("#startConversationPhone").focusout(function() {
    $("#startConversationPhone").val(onlyNumbers($("#startConversationPhone").val()));
});

function viewScheduleMessageContainer() { 
    if (activeMessagesName == '' || activeMessagesPhone == '') {
        screenMsg('Ups!', 'Debes seleccionar un contacto.', '2000', 'growl-danger');
        return false;
    }

    $('.schedule-msg-container-loader').show();
    $('#scheduleMsgTemplate').prop("selectedIndex", 0);
    $('#scheduleMsgCustomTxt').val('');
    $('#scheduleMsgOutput').val('Este mensaje está previamente definido.');
    $('#scheduleMsgDate').val(currentDate());
    $('#scheduleMsgClose').prop('disabled', true);
    $('#scheduleMsgSave').prop('disabled', true);
    $('#scheduleMsgCancel').prop('disabled', true);
    $('#scheduleMsgCancel').hide();

    $.ajax({
        type: "POST",
        data: {type:"getScheduleMessage",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance},
        url: "./php/wainboxData.php?var=getScheduleMessage",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#scheduleMsgClose').prop('disabled', false);
            $('#scheduleMsgSave').prop('disabled', false);
            $('#scheduleMsgCancel').prop('disabled', false);
            $('.schedule-msg-container-loader').hide();
            if (response.id) {
                $('#scheduleMsgTemplate').val(response.template);
                $('#scheduleMsgCustomTxt').val(response.message);
                getMsgOutput(response.template);
                $('#scheduleMsgDate').val(response.scheduleDate);
                $('#scheduleMsgTime').val(response.scheduleTime);
                $('.schedule-button-type').html('Reprogramar');
                $('#scheduleMsgCancel').show();
            } else {
                $('.schedule-button-type').html('Programar');
            }
        }
    });

    $('.schedule-msg-name').html(activeMessagesName+' '+activeMessagesLastName);
    $('.schedule-msg-phone').html('('+activeMessagesPhone+' / '+getInstanceName(activeMessagesInstance)+')');
    if (getInstanceProvider(activeMessagesInstance) != 'waba') {
        if ($("#scheduleMsgTemplate option[value='text']").length == 0) {
            $('#scheduleMsgTemplate').append('<option value="text">Texto Libre</option>');
        }
    } else {
        if ($("#scheduleMsgTemplate option[value='text']").length > 0) {
            $('#scheduleMsgTemplate option[value="text"]').remove();
        }
    }
    $("#openScheduleMessageModal").click();
    return false;
}

function viewContactFavoriteContainer() { 
    if (activeMessagesName == '' || activeMessagesPhone == '') {
        screenMsg('Ups!', 'Debes seleccionar un contacto.', '2000', 'growl-danger');
        return false;
    }
    $('#contactFavoriteComment').val('')
    var string = activeMessagesIsFavorite == 1 ? 'Quitar de favoritos' : 'Añadir a favoritos';
    $('#contactFavoriteSave').html(string+' <span class="fa fa-angle-right" style="padding-left:8px;font-weight: 900;"></span>')
    $('.contact-favorite-name').html(activeMessagesName+' '+activeMessagesLastName);
    $('.contact-favorite-phone').html('('+activeMessagesPhone+')');
    $('#contactFavoriteSave').prop('disabled', false);
    $('#contactFavoriteClose').prop('disabled', false);
    $('.contact-favorite-container-loader').hide();
    $("#openContactFavoriteModal").click();
    return false;
}

$(document).on("click", "#contactFavoriteSave", function (e) {
    e.preventDefault();
    if ($('#contactFavoriteComment').val() == "") {
        screenMsg('Ups!', 'Debes agregar un comentario.', '4000', 'growl-danger');  
    } else {
        $('#contactFavoriteSave').prop('disabled', true);
        $('#contactFavoriteClose').prop('disabled', true);
        $('.contact-favorite-container-loader').show();

        $.ajax({
            type: "POST",
            data: {type:"addRemoveFavorite",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance,activeMessagesPhone:activeMessagesPhone,activeMessagesIsFavorite:activeMessagesIsFavorite,favoriteComment:$('#contactFavoriteComment').val()},
            url: "./php/wainboxData.php?var=addRemoveFavorite",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    screenMsg('Excelente!', 'El contacto fue modificado con éxito.', '4000', 'growl-success');
                    $('#contactFavoriteModal').modal('hide');
                    if (activeMessagesIsFavorite == 1) {
                        $('.icon-contact-favorite-'+activeMessagesContactId).hide();
                        $("#showContactFavoriteContainer").html('<span class="fa fa-heart-o"></span>&nbsp;&nbsp;&nbsp;Añadir a favoritos');
                        activeMessagesIsFavorite = 0;
                    } else {
                        $('.icon-contact-favorite-'+activeMessagesContactId).show();
                        $("#showContactFavoriteContainer").html('<span class="fa fa-heart-o"></span>&nbsp;&nbsp;&nbsp;Quitar de favoritos');
                        activeMessagesIsFavorite = 1;
                    }
                } else {
                    screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                    $('#contactFavoriteModal').modal('hide');
                }
            },
            error: function(response) {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                $('#contactFavoriteModal').modal('hide');
            }
        });        
    }
});

function currentDate() {
    var date = new Date();  
    var currentDay = parseInt(date.getDate()) < 10 ? '0'+date.getDate() : date.getDate()
    return currentDay+'/'+parseInt(date.getMonth()+1)+'/'+date.getFullYear();
}

function openImageModal() {
    if (activeMessagesName == '' || activeMessagesPhone == '') {
        screenMsg('Ups!', 'Debes seleccionar un contacto.', '2000', 'growl-danger');
        return false;
    }
    $("#openImageModal").click();
    return false;
}

$(document).on('focus',"#scheduleMsgDate", function(){
    var currentDate = new Date();
    var currentYear = currentDate.getFullYear();
    var fromYear = currentYear - 1; 
    var toYear = currentYear + 2;
    var range = fromYear + ':' + toYear;
    $(this).datepicker({        
        yearRange: range
    });
});

$(document).on("change", "#scheduleMsgTemplate", function (e) {
    e.preventDefault();
    getMsgOutput($(this).val());
});  

$(document).on("click", "#scheduleMsgSave", function (e) {
    e.preventDefault();
    var dateArray = $('#scheduleMsgDate').val().split("/");
    var utcDateTime = new Date(dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0]+' '+$('#scheduleMsgTime').val()+':00')/1000;
    var scheduleMsgUtc = moment.utc(utcDateTime).valueOf();
    var currentUtc = ((moment.utc().valueOf())/1000).toFixed(0);

    if ($('#scheduleMsgTemplate').val() == "0") {
        screenMsg('Ups!', 'Debes seleccionar un template.', '4000', 'growl-danger');        
    } else if ($('#scheduleMsgCustomTxt').val() == "") {
        screenMsg('Ups!', 'Debes agregar un texto personalizado.', '4000', 'growl-danger');    
    } else if ($('#scheduleMsgCustomTxt').val().split('\n').length > 2) {
        screenMsg('Ups!', 'Solo es posible agregar un salto de línea (enter).', '4000', 'growl-danger');            
    } else if (scheduleMsgUtc < parseInt(currentUtc)) {
        screenMsg('Ups!', 'La fecha de la cita no puede ser menor a la fecha y hora actual.', '4000', 'growl-danger');
    } else {
        $('#scheduleMsgSave').prop('disabled', true);
        $('#scheduleMsgClose').prop('disabled', true);
        $('#scheduleMsgCancel').prop('disabled', true);
        $('.schedule-msg-container-loader').show();

        $.ajax({
            type: "POST",
            data: {type:"saveScheduleMessage",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance,activeMessagesPhone:activeMessagesPhone,activeMessagesProvider:getInstanceProvider(activeMessagesInstance),messageTemplate:$('#scheduleMsgTemplate').val(),messageTxt:$('#scheduleMsgCustomTxt').val(),messageUTC:scheduleMsgUtc},
            url: "./php/wainboxData.php?var=saveScheduleMessage",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    screenMsg('Excelente!', 'El mensaje fue programado con éxito.', '4000', 'growl-success');
                    $('#scheduleMessageModal').modal('hide');
                    getMessages(activeMessagesContactId, activeMessagesInstance); 
                } else {
                    screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                    $('#scheduleMessageModal').modal('hide');
                }
            },
            error: function(response) {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                $('#scheduleMessageModal').modal('hide');
            }
        });
    }
});

$(document).on("click", "#scheduleMsgCancel", function (e) {
    e.preventDefault();
    var dateArray = $('#scheduleMsgDate').val().split("/");
    var utcDateTime = new Date(dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0]+' '+$('#scheduleMsgTime').val()+':00')/1000;
    var scheduleMsgUtc = moment.utc(utcDateTime).valueOf();
    $('#scheduleMsgSave').prop('disabled', true);
    $('#scheduleMsgClose').prop('disabled', true);
    $('#scheduleMsgCancel').prop('disabled', true);
    $('.schedule-msg-container-loader').show();
    $.ajax({
        type: "POST",
        data: {type:"cancelScheduleMessage",activeMessagesContactId:activeMessagesContactId,activeMessagesInstance:activeMessagesInstance,activeMessagesPhone:activeMessagesPhone,messageUTC:scheduleMsgUtc},
        url: "./php/wainboxData.php?var=cancelScheduleMessage",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else if (response.result == 'success') {
                screenMsg('Excelente!', 'El mensaje fue cancelado con éxito.', '4000', 'growl-success');
                $('#scheduleMessageModal').modal('hide');
                getMessages(activeMessagesContactId, activeMessagesInstance); 
            } else {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                $('#scheduleMessageModal').modal('hide');
            }
        },
        error: function(response) {
            screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
            $('#scheduleMessageModal').modal('hide');
        }
    });
});

function getMsgOutput(templateName) {
    var string = '';
    if (templateName == 'comentario') {
        string = 'Hola '+activeMessagesName+', te comento:\n[texto personalizado]\nSigo a tus órdenes.';
    } else if (templateName == 'pregunta') {
        string = 'Hola '+activeMessagesName+',\n[texto personalizado]\nQuedo atento a tu respuesta.';
    }
    $('#scheduleMsgOutput').val(string);
}

function onlyNumbers(string) {
    return string.replace(/[^0-9\+]/g, '');
}