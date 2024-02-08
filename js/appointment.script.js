/*v=0001.1.0 13/09/2019 17:08*/
//http://localhost/smarto/tratodirecto/dev/desarrolladores/appointment.php?developmentId=468&developmentName=Aldaba%20Residencial&developmentAddress=Aldaba%20de%20Corralejo,%20No.%20121.%20Le%C3%B3n,%20Guanajuato.%20C.P.%2037297.&developmentLatLng=https://www.google.com/maps/?q=21.1145081,-101.624654&modelId=0&modelName=0&assetType=development&price=0
$(document).ready(function () {
    jQuery("#datepickerAppointment").mask("99/99/9999");
    if (latlng == 0) {
        latlng = getLatlng();
    }  
    getAppointmentData($('#developmentIdForSchedule').val(), $('#modelIdForSchedule').val());
});

function getAppointmentData(developmentId, modelId) {
    $('#appointmentData').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    if (developmentId == 0) {
        $('#appointmentData').html('<span style="color:red">No hay información</span>'); 
        $("#searchInput").prop("disabled", true);
    } else {
        $.ajax({
            type: "POST",
            data: {
                type:"getAppointmentData",
                developmentId: developmentId,
                modelId: modelId
            },
            url: "./php/appointmentData.php", 
            dataType: 'json',
            success: function(data) {
                if (data.developmentName == null) {
                    $('#appointmentData').html('<span style="color:red">No hay información</span>'); 
                    $("#searchInput").prop("disabled", true);
                } else {
                    if (data == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    var developmentAddress = data.street.trim();
                    if ((data.extNumber == '') || (data.extNumber == null) || (data.extNumber == 's/n') || (data.extNumber == 'S/N')) {
                        developmentAddress += ', s/n. ';
                    } else {
                        developmentAddress += ', No. ' + data.extNumber.trim() + '. ';
                    }
                    /*if (sublocality != '') {
                        developmentAddress += 'Col. ' + data.sublocality;
                    }*/
                    developmentAddress += data.locality + ', ' + data.state + '.';
                    if (data.postalCode != '') {
                        developmentAddress += ' C.P. ' + data.postalCode.trim() + '.';
                    }
                    var developmentLatlng = 'https://www.google.com/maps/?q=' + data.latitude + ',' + data.longitude;
                    var developmentName = data.developmentName;
                    var developmentLocality = data.locality;
                    var developmentState = data.state;
                    var hubSpotIdDeveloper = data.hubSpotId;
                    detailedData = '<table style="width:100%">';
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Desarrollador</strong></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;font-size:18px;"><strong>' + data.developer + '</strong></td>';
                    detailedData += '</tr>';                    
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Desarrollo</strong></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">';
                    detailedData += '<label style="font-size:16px;font-weight:600"><a href="https://tratod.com/d-' + developmentId + '" target="_blank">' + developmentName + '</a></label>&nbsp;&nbsp;';
                    detailedData += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-4px;" name="https://tratod.com/d-' + data.developmentId + '">Copiar</button>';
                    detailedData += '</td>';
                    detailedData += '</tr>';    
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Geoposición</p></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">Latitud: <label id="latitudeLabel">' + data.latitude + '&nbsp;/&nbsp;Longitud: ' + data.longitude + '</label><br><a href="' + latlng + '" target="_blank">Geoposición del desarrollo</a>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-4px;" name="https://www.google.com/maps/?q=' + data.latitude + ',' + data.longitude + '">Copiar</button></td>';
                    detailedData += '</tr>';
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Dirección</p></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + developmentAddress + '</label></td>';
                    detailedData += '</tr>'; 
                    if (data.modelId != 0) {
                        var assetType = 'model'; 
                        var modelId = data.modelId; 
                        var modelName = data.modelName; 
                        var modelPrice = data.modelPrice; 
                        detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                        detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Modelo</strong></td>';
                        detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">';
                        detailedData += '<label style="font-size:16px;font-weight:600"><a href="https://tratod1.com/m-'+ data.modelId +'" target="_blank">' + modelName + '</a></label>&nbsp;&nbsp;';
                        detailedData += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-4px;" name="https://tratod1.com/m-'+ data.modelId +'">Copiar</button>';
                        detailedData += '</td>';
                        detailedData += '</tr>';  
                        detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                        detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Precio</p></td>';
                        detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + modelPrice + '</label></td>';
                        detailedData += '</tr>';         
                    } else {
                        var assetType = 'development'; 
                        var modelId = 0; 
                        var modelName = 0; 
                        var modelPrice = 0; 
                    }
                    detailedData += '</table>'; 
                    $('#appointmentData').html(detailedData); 
                    $("#searchInput").prop("disabled", false); 
                    $('#assetTypeIdForSchedule').val(assetType);
                    $('#developmentNameForSchedule').val(developmentName);
                    $('#developmentAddressForSchedule').val(developmentAddress);
                    $('#developmentLocalityForSchedule').val(developmentLocality);
                    $('#developmentStateForSchedule').val(developmentState);
                    $('#developmentLatLngForSchedule').val(developmentLatlng);
                    $('#modelIdForSchedule').val(modelId);
                    $('#modelNameForSchedule').val(modelName);
                    $('#priceForSchedule').val(modelPrice);
                    $('#hubSpotIdDeveloper').val(hubSpotIdDeveloper);
                }
            },
            error: function(response) { 
                $('#appointmentData').html('<span style="color:red">No hay información</span>'); 
                $("#searchInput").prop("disabled", true);
            }
        });	
    }
}

var filesInformation = [];
var fileNum = 1;
$(document).on("change", "#imgInput", function(e) {
    e.preventDefault();
    //$('#filesname').html();
    for (x=0;x<$('#imgInput')[0].files.length;x++) {
        setupReader($('#imgInput')[0].files[x]);
    }
});

function verifyFiles(file) {
    var count = filesInformation.length;
    if (count != 0) {
        for (var i=0;i<count;i++) {
            if (filesInformation[i].name == file.name) {
                console.log(file.name + ' / Repetido');
                return 'Duplicate';
            }
        }
    }
}

function setupReader(file) {
    var name = file.name;
    var type = file.type;
    if (verifyFiles(file) != 'Duplicate') {
        var reader = new FileReader();  
        reader.readAsBinaryString(file);
        reader.onload = function(e) {  
            filesInformation.push({
                "id": fileNum,
                "name": name, 
                "type": type, 
                "content": btoa(reader.result)
            });    
            $('#filesname').append('<span>' + name + '&nbsp;&nbsp;<a href="#" class="removeFile" id="' + fileNum + '"><i class="glyphicon glyphicon-remove-circle" style="color:#CC0000"></i></a><br></span>');   
            fileNum++;  
        }
        /*reader.onerror = function() {
            $('#filesname').append(fileNum + '. ' + name + '<i class="glyphicon glyphicon-remove-circle" style="color:red"></i><br>');
        };*/
    }
}

$(document).on("click", ".removeFile", function(e) {
    e.preventDefault();
    var id = parseInt($(this).attr("id"));
    var count = filesInformation.length;
    if (count != 0) {
        for (i=0;i<count;i++) {
            if (filesInformation[i].id == id) {
                filesInformation.splice(i, 1);
                $(this).parent().remove();
                break;
            }
        }
    }
});

$(document).on("click", "#scheduleAppointment", function(e) {
    e.preventDefault();
    var flag = 0;
    var userId = $('#userId').val();
    var userName = $('#userName').val();
    var userLastName = $('#userLastName').val();
    var userPhone = $('#userPhone').val();
    var userMail = $('#userMail').val();
    var userCreditType = $('#userCreditType').val();
    var userCreditTypeId = $('#userCreditTypeId').val();
    var userCreditAmount = $('#userCreditAmount').val();
    var userNss = $('#userNss').val();
    var userCurp = $('#userCurp').val();
    var userDob = $('#userDob').val();
    var userPartnerNss = $('#userPartnerNss').val();
    var userPartnerName = $('#userPartnerName').val();
    var userProduct = $('#userProduct').val();
    var userPartnerCurp = $('#userPartnerCurp').val();  
    var assetType = $('#assetTypeIdForSchedule').val();
    var developmentId = $('#developmentIdForSchedule').val();
    var developmentName = $('#developmentNameForSchedule').val();
    var developmentLocality = $('#developmentLocalityForSchedule').val();
    var developmentState = $('#developmentStateForSchedule').val();
    var developmentAddress = $('#developmentAddressForSchedule').val();
    var developmentLatLng = $('#developmentLatLngForSchedule').val();
    var modelId = $('#modelIdForSchedule').val();
    var modelName = $('#modelNameForSchedule').val();    
    var price = $('#priceForSchedule').val();
    var appointmentNotes = $('#appointmentNotes').val();
    var scheduleDateArr = $('#datepickerAppointment').val().split("/");
    var scheduleDate = scheduleDateArr[2] + '-' + scheduleDateArr[1] + '-' +  scheduleDateArr[0];
    var scheduleTime = $('#calendarInputTime').val().substring(0, 5);
    var scheduleTimeArr = scheduleTime.split(":");
    var currentDate = new Date();
    var hubSpotIdDeveloper = $('#hubSpotIdDeveloper').val();
    var regDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    var regTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    var regBudget = /^(\d+(\.\d{1,2})?)$/; 
    console.log(developmentId, modelId, price);
    console.log(userId, userName, userLastName, userPhone, userMail);
    console.log(userCreditAmount, userCreditTypeId);
    console.log(scheduleDate, scheduleTime);
    console.log(latlng, IPCurrentUser, deviceType, hubSpotIdDeveloper);
    console.log(appointmentNotes);
    if (regDate.test(scheduleDate)) {
        var appointmentDate = new Date(scheduleDateArr[2], parseInt(scheduleDateArr[1])-1, scheduleDateArr[0], scheduleTimeArr[0], scheduleTimeArr[1]);
        if (currentDate > appointmentDate) {
            if (!$("#datepickerAppointment").closest('.input-group').hasClass('has-error')) {
                $("#datepickerAppointment").closest('.input-group').addClass('has-error');
                $("#datepickerAppointment").closest('.input-group').after('<label class="error text-danger" style="font-size:12px;text-align:left">Fecha inválida.</label>');
            }          
            flag++; 
        } else {
            if ($("#datepickerAppointment").closest('.input-group').hasClass('has-error')) {
                $("#datepickerAppointment").closest('.input-group').removeClass('has-error');
                $("#datepickerAppointment").closest('.input-group').next('label').remove();
            } 
        }
    } else {
        if (!$("#datepickerAppointment").closest('.input-group').hasClass('has-error')) {
            $("#datepickerAppointment").closest('.input-group').addClass('has-error');
            $("#datepickerAppointment").closest('.input-group').after('<label class="error text-danger" style="font-size:12px;text-align:left">Fecha inválida.</label>');
        }          
        flag++; 
    }
    if (regTime.test(scheduleTime)) {
        if ($("#calendarInputTime").closest('.input-group').hasClass('has-error')) {
            $("#calendarInputTime").closest('.input-group').removeClass('has-error');
            $("#calendarInputTime").closest('.input-group').next('label').remove();
        } 
    } else {
        if (!$("#calendarInputTime").closest('.input-group').hasClass('has-error')) {
            $("#calendarInputTime").closest('.input-group').addClass('has-error');
            $("#calendarInputTime").closest('.input-group').after('<label class="error text-danger" style="font-size:12px;text-align:left">Hora inválida.</label>');
        }          
        flag++; 
    }   
    /*if (regBudget.test(userCreditAmount))  {
        if ($("#userCreditAmount").parent().hasClass('has-error')) {
            $("#userCreditAmount").parent().removeClass('has-error');
            $("#amountValidationResponse").html('');
        } 
    } else {
        if (!$("#userCreditAmount").parent().hasClass('has-error')) {
            $("#userCreditAmount").parent().addClass('has-error');
            $("#amountValidationResponse").html('<span class="error text-danger" style="font-size:12px;text-align:left">Monto inválido.</span>');
        }          
        flag++; 
    }*/
    if (flag == 0) {
        $("#scheduleAppointmentResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;'>");
        $.ajax({
            type: "POST",
            data: {
                type:"scheduleAppointment",
                developmentId:developmentId,
                modelId:modelId,
                price:price,
                userId:userId,
                userName:userName,
                userLastName:userLastName,
                userPhone:userPhone,
                userMail:userMail,
                scheduleDate:scheduleDate,
                scheduleTime:scheduleTime,
                latlng:latlng,
                IPCurrentUser:IPCurrentUser,
                deviceType:deviceType,
                product:userCreditTypeId,
                userCreditAmount:userCreditAmount,
            },
            url: "./php/appointmentData.php", 
            dataType: 'json',
            success: function(response) { 
                console.log(response);
                if (response == 'success') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled'); 
                    $("#datepickerAppointment").prop("disabled", true);
                    $("#calendarDate").css("pointer-events", "none");
                    $("#calendarInputTime").prop("disabled", true);
                    $("#calendarTime").css("pointer-events", "none");
                    //$('#searchLinkContainer').css('display', 'none');
                    $("#budgetInput").prop("disabled", true);
                    $("#productInput").prop("disabled", true);
                    $("#appointmentNotes").prop("disabled", true);
                    $('#userCreditAmount').prop("disabled", true);
                    verifyCode(userId, userName, userLastName, userPhone, userMail, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, price, scheduleDate, scheduleTime, userCreditAmount, userCreditType, hubSpotIdDeveloper, appointmentNotes);                                     
                } else if (response == 'invalidCarrier') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error, el operador es inválido.</span>');
                    setTimeout(function () { 
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);
                } else {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error.</span>');
                    setTimeout(function () { 
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);
                }
            },
            error: function(err) {
                $("#scheduleAppointment").prop("disabled", true);  
                $(".custom-file").attr('disabled','disabled');
                $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error.</span>');
                setTimeout(function () { 
                    $("#scheduleAppointmentResponse").html('');
                }, 1500);
            }
        }); 
    }   
});

function verifyCode(userId, userName, userLastName, userPhone, userMail, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, price, scheduleDate, scheduleTime, budget, productName, hubSpotIdDeveloper, appointmentNotes) {
    var codeValidationForm = '';
    codeValidationForm += '<div style="padding:0px 10px">';
    codeValidationForm += '<div class="row" style="border-top: 1px dotted #eeeeee;padding-top:10px">';
    codeValidationForm += '<div class="col-sm-12" style="text-align:center">'; 
    codeValidationForm += 'Se envío con éxito un SMS con el código de validación.<br>';
    codeValidationForm += 'Introduce el código: ';
    codeValidationForm += '</div>';   
    codeValidationForm += '</div>';          
    codeValidationForm += '<div class="row">';
    codeValidationForm += '<div class="col-sm-4">';
    codeValidationForm += '</div>';
    codeValidationForm += '<div class="col-sm-4">';
    codeValidationForm += '<div class="form-group" style="margin:0">';
    codeValidationForm += '<div class="input-group">';
    codeValidationForm += '<input type="text" class="form-control" id="cvu" autocomplete="off">';
    codeValidationForm += '<span class="input-group-addon" style="cursor:pointer;background-color:#FFB71B;color:#FFFFFF;" title="Validar" id="codeVerification">';
    codeValidationForm += '<i class="fa fa-check"></i>';
    codeValidationForm += '</span>';

    codeValidationForm += '<input type="hidden" id="userIdCV" value="' + userId + '">';
    codeValidationForm += '<input type="hidden" id="userNameCV" value="' + userName + '">';
    codeValidationForm += '<input type="hidden" id="userLastNameCV" value="' + userLastName + '">';    
    codeValidationForm += '<input type="hidden" id="userPhoneCV" value="' + userPhone + '">';
    codeValidationForm += '<input type="hidden" id="userMailCV" value="' + userMail + '">';

    codeValidationForm += '<input type="hidden" id="developmentIdCV" value="' + developmentId + '">';
    codeValidationForm += '<input type="hidden" id="developmentNameCV" value="' + developmentName + '">';
    codeValidationForm += '<input type="hidden" id="developmentLocalityCV" value="' + developmentLocality + '">';
    codeValidationForm += '<input type="hidden" id="developmentStateCV" value="' + developmentState + '">';
    codeValidationForm += '<input type="hidden" id="developmentAddressCV" value="' + developmentAddress + '">';
    codeValidationForm += '<input type="hidden" id="developmentLatLngCV" value="' + developmentLatLng + '">';
    codeValidationForm += '<input type="hidden" id="modelIdCV" value="' + modelId + '">';
    codeValidationForm += '<input type="hidden" id="modelNameCV" value="' + modelName + '">';
    codeValidationForm += '<input type="hidden" id="priceCV" value="' + price + '">';

    codeValidationForm += '<input type="hidden" id="scheduleDateCV" value="' + scheduleDate + '">';
    codeValidationForm += '<input type="hidden" id="scheduleTimeCV" value="' + scheduleTime + '">';  
    codeValidationForm += '<input type="hidden" id="userBudget" value="' + budget + '">';   
    codeValidationForm += '<input type="hidden" id="userAppointmentNotes" value="' + appointmentNotes + '">'; 
    codeValidationForm += '<input type="hidden" id="userProductName" value="' + productName + '">';  
    codeValidationForm += '<input type="hidden" id="userHubSpotIdDeveloper" value="' + hubSpotIdDeveloper + '">'; 

    codeValidationForm += '</div>';
    codeValidationForm += '</div>';                                                   
    codeValidationForm += '</div>';   
    codeValidationForm += '</div>';
    codeValidationForm += '<div class="row">';
    codeValidationForm += '<div class="col-sm-12" id="codeVerificationResponse" style="text-align:center">';
    codeValidationForm += '</div>';   
    codeValidationForm += '</div>';  
    codeValidationForm += '</div>';    
    $("#scheduleAppointmentResponse").html(codeValidationForm);
}

$(document).on("click", "#codeVerification", function(e) {
    e.preventDefault();
    var flag = 0;
    var userId = $('#userIdCV').val();
    var userName = $('#userNameCV').val();
    var userLastName = $('#userLastNameCV').val();
    var userPhone = $('#userPhoneCV').val();
    var userMail = $('#userMailCV').val();
    var developmentId = $('#developmentIdCV').val();
    var developmentName = $('#developmentNameCV').val();
    var developmentLocality = $('#developmentLocalityCV').val();
    var developmentState = $('#developmentStateCV').val();
    var developmentAddress = $('#developmentAddressCV').val();
    var developmentLatLng = $('#developmentLatLngCV').val();
    var modelId = $('#modelIdCV').val();
    var modelName = $('#modelNameCV').val();    
    var price = $('#priceCV').val();
    var scheduleDate = $('#scheduleDateCV').val();  
    var scheduleTime = $('#scheduleTimeCV').val();  
    var appointmentNotes = $('#userAppointmentNotes').val(); 
    var budget = $('#userBudget').val();  
    var productName = $('#userProductName').val(); 
    var cvu = $('#cvu').val(); 
    var hubSpotIdDeveloper = $('#userHubSpotIdDeveloper').val();
    var regCode = /^\d{5}$/;
    console.log(userId, userName, userLastName, userPhone, userMail, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, price, scheduleDate, scheduleTime, cvu, budget, productName, hubSpotIdDeveloper, appointmentNotes, filesInformation);
    if (regCode.test(cvu)) {
        if ($("#cvu").closest('.input-group').hasClass('has-error')) {
            $("#cvu").closest('.input-group').removeClass('has-error');
            $("#codeVerificationResponse").html('');
        } 
    } else {
        if (!$("#cvu").closest('.input-group').hasClass('has-error')) {
            $("#cvu").closest('.input-group').addClass('has-error');
            $("#codeVerificationResponse").html('<label class="error text-danger" style="font-size:12px;text-align:center">&nbsp;&nbsp;Código Inválido.</label>');
        }          
        flag++; 
    }    

    if (flag == 0) {
        $("#codeVerificationResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;padding-top:6px;'>");
        $.ajax({
            type: "POST",
            data: {
                type:"codeVerification",
                userId:userId, 
                userName:userName,
                userLastName:userLastName,
                userPhone:userPhone, 
                userMail:userMail, 
                developmentId:developmentId, 
                developmentName:developmentName, 
                modelId:modelId, 
                modelName:modelName, 
                price:price, 
                scheduleDate:scheduleDate, 
                scheduleTime:scheduleTime, 
                cvu:cvu,
                budget:budget,
                product:productName,
                developmentLocality:developmentLocality, 
                developmentState:developmentState,
                hubSpotIdDeveloper:hubSpotIdDeveloper,
                appointmentNotes:appointmentNotes,
                attachments:filesInformation
            },
            url: "./php/appointmentData.php", 
            dataType: 'json',
            success: function(response) { 
                if (response.result == 'success') {     
                    $('#appointmentTittle').html('La cita fue agendada exitosamente.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">¡Hemos agendado la cita con éxito!</div>' 
                    responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.messageToCollaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>'               
                    $("#scheduleAppointmentContainer").html(responseData);
                    /*setTimeout(function () { 
                    }, 1500);*/
                } else if (response.result == 'invalidCode') {
                    $("#codeVerificationResponse").html('<div style="color:#d9534f;font-weight:bold;">El código es inválido.</div>');
                } else {
                    $("#codeVerificationResponse").html('<div style="color:#d9534f;font-weight:bold;">Hubo un error.</div>');
                    setTimeout(function () { 
                        $("#codeVerificationResponse").html('');
                        $('#scheduleAppointmentModal').modal('hide');
                    }, 1500);
                }
            },
            error: function(err) {
                $("#codeVerificationResponse").html('<div style="color:#d9534f;font-weight:bold;">Hubo un error.</div>');
                setTimeout(function () { 
                    $("#codeVerificationResponse").html('');
                    $('#scheduleAppointmentModal').modal('hide');
                }, 1500);
            }
        }); 
    }      
});

$(document).on("click", "#showResponse", function(e) {
    var developmentId = $(this).data("developmentid")
    var developmentName = $(this).data("developmentname")
    var modelId = $(this).data("modelid")
    var modelName = $(this).data("modelname")
    var developmentAddress = $(this).data("developmentaddress")
    var developmentLatLng = $(this).data("developmentlatlng")
    var currentDate = formatedDate();
    var msgCollaborator = $(this).data("msgcollaborator")
    var msgUser = $(this).data("msguser")
    var collaboratorName = $(this).data("collaboratorname")
    var collaboratorPhone = $(this).data("collaboratorphone")
    var collaboratorMail = $(this).data("collaboratormail")
    var appointmentdatetime = $(this).data("appointmentdatetime")
    console.log(developmentId,developmentName,modelId,modelName,developmentAddress,developmentLatLng,currentDate,msgCollaborator,msgUser,collaboratorName,collaboratorPhone,collaboratorMail);
    var responseInfo = '<table style="width:100%">';
    /*responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:4px;">';
    responseInfo += '<strong>Copiar y pegar completo en la descripción del negocio de HubSpot</strong><br><br>';
    responseInfo += appointmentdatetime + '<br>';
    responseInfo += msgCollaborator + '<br>';
    message = 'Se envió con éxito el mensaje de confirmación al colaborador ' + collaboratorName + ' (' + collaboratorPhone + ' / ' + collaboratorMail +')';    
    responseInfo += message;
    responseInfo += '<br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="'+ appointmentdatetime + '\n' + msgCollaborator + '\n' + message +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>'; */
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Texto para enviar al Usuario</strong><br><br>';
    responseInfo += msgUser;
    responseInfo += '<br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgUser +'">Copiar</button>';  
    responseInfo += '<br><br>Desarrollo ' + developmentName + ': https://tratod.com/d-' + developmentId + '<br>';
    message = 'Desarrollo ' + developmentName + ': https://tratod.com/d-' + developmentId + '\n';
    if (modelId != 0) {
        responseInfo += 'Modelo ' + modelName + ': https://tratod1.com/m-' + modelId + '<br>';
        message += 'Modelo ' + modelName + ': https://tratod1.com/m-' + modelId + '\n';
    }
    responseInfo += 'Dirección: ' + developmentAddress + '<br>';
    message += 'Dirección: ' + developmentAddress + '\n';
    responseInfo += 'Ubicación: ' + developmentLatLng + '<br>'; 
    message += 'Ubicación: ' + developmentLatLng + '\n'; 
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + message +'">Copiar</button>';     
    responseInfo += '</td>';
    responseInfo += '</tr>';     
    responseInfo += '</table>'; 
    $("#scheduleAppointmentContainer").html(responseInfo);
});

$(document).on("keyup", "#searchInput", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchContacts").click();
    }
});

$(document).on("click", "#datepickerAppointment", function(e) {
    e.preventDefault();
    $('#datepickerAppointment').datepicker({ 
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '2019:2020'
    });  
    $('#datepickerAppointment').datepicker('show');
});

$(document).on("click", "#calendarDate", function(e) {
    e.preventDefault();
    $('#datepickerAppointment').datepicker({ 
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '2019:2020'
    });  
    $('#datepickerAppointment').datepicker('show');
});

$(document).on('keypress', '.calendarTime', function(e) {
    e.preventDefault();
    return false;
});

$(document).mouseup(function (e) {
  var container = $("#timeOption"); 
  if (!container.is(e.target)  && container.has(e.target).length === 0) {
    container.hide();
  }
});

$(document).on('click', '#timeOption li', function(e) {
    $('#calendarInputTime').val($(this).html());
    $('#calendarInputTime').attr('name', $(this).attr('name'));
    $('#timeOption').css('display', 'none');
});

$(document).on('mouseover', '#timeOption li', function(e) {
    $(this).css('background-color', '#FFB71B');
    $(this).css('color', '#FFFFFF');
});

$(document).on('mouseout', '#timeOption li', function(e) {
    $(this).css('background-color', '#FFFFFF');
    $(this).css('color', '#4A535E');
});

$(document).on('click', '#calendarTime', function(e) {
    e.preventDefault();
    $('#timeOption').toggle();
});

$(document).on('click', '.calendarTime', function(e) {
    e.preventDefault();
    $('#timeOption').toggle();
});

$(document).on("click", "#searchContacts", function(e) {
    e.preventDefault();
    var keyword = $('#searchInput').val();
    if (keyword != '') { 
        $("#contactsContainer").css("display", "block");  
        getContactsBySearchBox(keyword);
    }
});

var globalFlag = 0;
function getContactsBySearchBox(keyword) {
    console.log('here');
    var form = '';
    var flag = 0;
    var regBudget = /^\$?(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d{1,2})?$/; 
    $("#contactsDataContainer").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px; padding-bottom:10px;'>");
    $.ajax({
        type: "POST",
        data: {type:"getUserData", keyword:keyword},
        url: "./php/appointmentData.php", 
        dataType: 'json',
        success: function(response) { 
            console.log(response.status);     
            if (response.status == "success") {
                $('#contactsContainesTitle').html('Información de HubSpot / Usuario: ' + keyword);
                console.log(response.creditAmount);
                var warning = '<span style="font-weight:bold;color:red;">¡Atención!</span>';
                var warningAmount = '&nbsp;&nbsp;<span style="font-weight:bold;color:red;">¡Monto inválido!</span>';
                if (response.name != null) { var name = response.name; } else { var name = warning; flag++; }
                if (response.lastName != null) { var lastName = response.lastName; } else { var lastName = warning; flag++; }                
                if (response.phone != null) { var phone = response.phone; } else { var phone = warning; flag++; }    
                if (response.email != null) { var email = response.email; } else { var email = warning; flag++; }   
                if (response.creditType != null) { var creditType = response.creditType; } else { var creditType = warning; flag++; }
                if (regBudget.test(response.creditAmount)) {
                    if ((response.creditAmount == null) || (response.creditAmount == 0)) { 
                        var creditAmount = response.creditAmount;
                        var creditAmountMsg = warningAmount; 
                        flag++;
                    } else { 
                        var creditAmount = response.creditAmount; 
                        var creditAmountMsg = ''; 
                    }
                } else {
                    var creditAmount = response.creditAmount;
                    var creditAmountMsg = warningAmount; 
                    flag++;
                }
                //if ((response.creditAmount == null) || (response.creditAmount == 0)) { var creditAmount = warning; flag++; } else { var creditAmount = response.creditAmount;  } 
                console.log(flag);  
                form += '<div class="row" style="padding-top:12px;width:98%">';                                                                                                                                                                                                                                                         
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Nombre:&nbsp;&nbsp;</label>';
                form += '<label id="userNameApp">'+name+'</label>';
                form += '</div>';
                form += '</div>';
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Apellido:&nbsp;&nbsp;</label>';
                form += '<label id="userLastNameApp">'+lastName+'</label>';
                form += '</div>'; 
                form += '</div>';
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Teléfono:&nbsp;&nbsp;</label>';
                form += '<label id="userPhoneApp">'+phone+'</label>';
                form += '</div>';
                form += '</div>';
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Email:&nbsp;&nbsp;</label>';
                form += '<label id="userMailApp">'+email+'</label>';
                form += '</div>';
                form += '</div>';     
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Producto:&nbsp;&nbsp;</label>';
                form += '<label id="userCreditTypeApp">'+creditType+'</label>';
                form += '</div>';
                form += '</div>';  
                form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                form += '<div class="form-group">';
                form += '<label style="font-weight: bold;">Presupuesto:&nbsp;&nbsp;</label>';
                form += '<label id="userCreditAmountApp">'+creditAmount+'</label>' + creditAmountMsg;
                //form += '<label id="userCreditAmountApp"><input type="text" class="form-control input-sm" id="userCreditAmount" style="padding:2px;"value="'+creditAmount+'"></label>';
                form += '<label id="amountValidationResponse"></label>';
                form += '</div>';
                form += '</div>';  
                if ((response.creditType == 'Infonavit') || (response.creditType == 'Cofinavit')) {  
                    if (response.nss != null) { var nss = response.nss; } else { var nss = warning; flag++; } 
                    if (response.dob != null) { var dob = response.dob; } else { var dob = warning; flag++; }                        
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">NSS:&nbsp;&nbsp;</label>';
                    form += '<label id="userNssApp">'+nss+'</label>';
                    form += '</div>';
                    form += '</div>';  
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Fecha de Nacimiento:&nbsp;&nbsp;</label>';
                    form += '<label id="userDobApp">'+dob+'</label>';
                    form += '</div>';
                    form += '</div>';  
                } else if ((response.creditType == 'Fovissste') || (response.creditType == 'Alia2') || (response.creditType == 'Respalda2')) {  
                    if (response.curp != null) { var curp = response.curp; } else { var curp = warning; flag++; }   
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">CURP:&nbsp;&nbsp;</label>';
                    form += '<label id="userCurpApp">'+curp+'</label>';
                    form += '</div>';
                    form += '</div>';  
                } else if (response.creditType == 'Conyugal Infonavit') {  
                    if (response.nss != null) { var nss = response.nss; } else { var nss = warning; flag++; } 
                    if (response.dob != null) { var dob = response.dob; } else { var dob = warning; flag++; }                        
                    if (response.partnerName != null) { var partnerName = response.partnerName; } else { var partnerName = warning; flag++; } 
                    if (response.partnerNss != null) { var partnerNss = response.partnerNss; } else { var partnerNss = warning; flag++; }   
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">NSS:&nbsp;&nbsp;</label>';
                    form += '<label id="userNssApp">'+nss+'</label>';
                    form += '</div>';
                    form += '</div>';  
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Fecha de Nacimiento:&nbsp;&nbsp;</label>';
                    form += '<label id="userDobApp">'+dob+'</label>';
                    form += '</div>';
                    form += '</div>';                      
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Cónyuge:&nbsp;&nbsp;</label>';
                    form += '<label id="userPartnerNameApp">'+partnerName+'</label>';
                    form += '</div>';
                    form += '</div>';  
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Cónyuge NSS:&nbsp;&nbsp;</label>';
                    form += '<label id="userPartnerNssApp">'+partnerNss+'</label>';
                    form += '</div>';
                    form += '</div>';                                                                                
                } else if (response.creditType == 'Infonavit+Fovisssste') { 
                    globalFlag = 1;     
                    form += '<div id="creditTypeOption">';
                    form += '<div class="col-sm-12">';
                    form += '<div class="form-group" style="text-align: center">';
                    form += '<label style="font-weight: bold;">¿Que tipo de crédito tiene el titular?</label><br>';
                    form += '<label class="radio-inline"><input type="radio" class="optionCredit" name="optionCredit" value="infonavit" data-dob = "'+response.dob+'" data-curp = "'+response.curp+'" data-partnername = "'+response.partnerName+'" data-partnercurp = "'+response.partnerCurp+'" data-partnernss = "'+response.partnerNss+'">Infonavit</label><br>';
                    form += '<label class="radio-inline"><input type="radio" class="optionCredit" name="optionCredit" value="fovissste" data-dob = "'+response.dob+'" data-curp = "'+response.curp+'" data-partnername = "'+response.partnerName+'" data-partnercurp = "'+response.partnerCurp+'" data-partnernss = "'+response.partnerNss+'">Fovisssste</label>';
                    form += '</div>';
                    form += '</div>';   
                    form += '</div>';        
                } else if (response.creditType == 'Conyugal Fovissste') {  
                    if (response.curp != null) { var curp = response.curp; } else { var curp = warning; flag++; }   
                    if (response.partnerName != null) { var partnerName = response.partnerName; } else { var partnerName = warning; flag++; }                     
                    if (response.partnerCurp != null) { var partnerCurp = response.partnerCurp; } else {var partnerCurp = warning; flag++; }
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">CURP:&nbsp;&nbsp;</label>';
                    form += '<label id="userCurpApp">'+curp+'</label>';
                    form += '</div>';
                    form += '</div>';      
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Cónyuge:&nbsp;&nbsp;</label>';
                    form += '<label id="userPartnerNameApp">'+partnerName+'</label>';
                    form += '</div>';
                    form += '</div>';                                         
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Cónyuge CURP:&nbsp;&nbsp;</label>';
                    form += '<label id="userPartnerCurpApp">'+partnerCurp+'</label>';
                    form += '</div>';
                    form += '</div>';                                    
                } else if (response.creditType == 'Otro crédito') {  
                    if (response.product != null) { var product = response.product; } else { var product = warning; flag++; }    
                    form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
                    form += '<div class="form-group">';
                    form += '<label style="font-weight: bold;">Especificar:&nbsp;&nbsp;</label>';
                    form += '<label id="userProductApp">'+product+'</label>';
                    form += '</div>';
                    form += '</div>';                                    
                }  
                form += '<div class="col-sm-12" id="hubSpotMissingRecords" style="text-align: center;">';
                form += '</div>';                                      
                form += '</div>';              
            } else {
                form += '<div class="row" style="padding-top:20px;">';
                form += '<div class="col-sm-12">';
                form += '<div class="form-group" style="text-align: center">';
                form += '<label style="color:red;">No se encontraron coincidencias.</label>';
                form += '</div>';
                form += '</div>';                   
                form += '</div>';   
            }  
            switch(response.creditType) {      
                case 'Infonavit': var creditTypeId = 3; break;
                case 'Cofinavit': var creditTypeId = 4; break;
                case 'Conyugal Infonavit': var creditTypeId = 6; break;
                case 'Infonavit+Fovisssste': var creditTypeId = 12; break;
                case 'Fovissste': var creditTypeId = 7; break;
                case 'Conyugal Fovissste': var creditTypeId = 8; break;
                case 'Alia2': var creditTypeId = 9; break;
                case 'Respalda2': var creditTypeId = 13; break;
                case 'Crédito Bancario': var creditTypeId = 2; break;
                case 'Otro crédito': var creditTypeId = 0; break;
                case 'Contado': var creditTypeId = 1; break;
                default: var creditTypeId = 0;
              }
            form += '<input type="hidden" value="'+keyword+'" id="userId">';
            form += '<input type="hidden" value="'+response.name+'" id="userName">';
            form += '<input type="hidden" value="'+response.lastName+'" id="userLastName">';
            form += '<input type="hidden" value="'+response.phone+'" id="userPhone">';
            form += '<input type="hidden" value="'+response.email+'" id="userMail">';
            form += '<input type="hidden" value="'+response.creditType+'" id="userCreditType">';
            form += '<input type="hidden" value="'+creditTypeId+'" id="userCreditTypeId">';
            form += '<input type="hidden" value="'+response.creditAmount+'" id="userCreditAmount">';
            form += '<input type="hidden" value="'+response.nss+'" id="userNss">';
            form += '<input type="hidden" value="'+response.curp+'" id="userCurp">';
            form += '<input type="hidden" value="'+response.dob+'" id="userDob">';
            form += '<input type="hidden" value="'+response.partnerNss+'" id="userPartnerNss">';
            form += '<input type="hidden" value="'+response.partnerName+'" id="userPartnerName">';
            form += '<input type="hidden" value="'+response.product+'" id="userProduct">';
            form += '<input type="hidden" value="'+response.partnerCurp+'" id="userPartnerCurp">';            
            $('#contactsDataContainer').html(form);
            if (flag != 0) { 
                $('#hubSpotMissingRecords').html('<label style="color:red;">Debes corregir o llenar los datos faltantes en HubSpot.</label>');
            } else {
                if (globalFlag == 0) {
                    $("#datepickerAppointment").prop("disabled", false);
                    $("#calendarDate").css("pointer-events", "auto");
                    $("#calendarInputTime").prop("disabled", false);
                    $("#calendarTime").css("pointer-events", "auto");
                    $("#scheduleAppointment").prop("disabled", false);  
                    $(".custom-file").removeAttr('disabled');
                    $('#searchInputContainer').css('display', 'none');
                    $('#searchLinkContainer').css('display', 'block');
                    $("#budgetInput").prop("disabled", false);
                    $("#productInput").prop("disabled", false);
                    $("#appointmentNotes").prop("disabled", false);
                }
            }                  
        },
        error: function(response) { 
            form += '<div class="row" style="padding-top:20px;">';
            form += '<div class="col-sm-12">';
            form += '<div class="form-group" style="text-align: center">';
            form += '<label style="color:red;">Hubo un error.</label>';
            form += '</div>';
            form += '</div>';                   
            form += '</div>';   
            $('#contactsDataContainer').html(form);                
        }
    });   
}

$(document).on("change", ".optionCredit", function(e) {
    var option = $(this).val();
    var dob = $('.optionCredit').data('dob'); 
    var curp = $('.optionCredit').data('curp'); 
    var partnerName = $('.optionCredit').data('partnername'); 
    var partnerCurp = $('.optionCredit').data('partnercurp'); 
    var partnerNss = $('.optionCredit').data('partnernss');
    var form = '';
    var warning = '<span style="font-weight:bold;color:red;">¡Atención!</span>';
    var flag = 0;
    console.log(option, dob, curp, partnerName, partnerCurp, partnerNss);
    if (option == 'infonavit') {
        if (nss != null) { var nss = nss; } else { var nss = warning; flag++; } 
        if (dob != null) { var dob = dob; } else { var dob = warning; flag++; }   
        if (partnerName != null) { var partnerName = partnerName; } else { var partnerName = warning; flag++; }                     
        if (partnerCurp != null) { var partnerCurp = partnerCurp; } else { var partnerCurp = warning; flag++; }                                         
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">NSS:&nbsp;&nbsp;</label>';
        form += '<label id="userNssApp">'+nss+'</label>';
        form += '</div>';
        form += '</div>';  
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">Fecha de Nacimiento:&nbsp;&nbsp;</label>';
        form += '<label id="userDobApp">'+dob+'</label>';
        form += '</div>';
        form += '</div>';  
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">CURP:&nbsp;&nbsp;</label>';
        form += '<label id="userCurpApp">'+curp+'</label>';
        form += '</div>';
        form += '</div>';      
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">Cónyuge:&nbsp;&nbsp;</label>';
        form += '<label id="userPartnerNameApp">'+partnerName+'</label>';
        form += '</div>';
        form += '</div>';                                         
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">Cónyuge CURP:&nbsp;&nbsp;</label>';
        form += '<label id="userPartnerCurpApp">'+partnerCurp+'</label>';
        form += '</div>';
        form += '</div>';
    } else {         
        if (curp != null) { var curp = curp; } else { var curp = warning; flag++; }   
        if (partnerName != null) { var partnerName = partnerName; } else { var partnerName = warning; flag++; } 
        if (partnerNss != null) { var partnerNss = partnerNss; } else { var partnerNss = warning; flag++; }   
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">CURP:&nbsp;&nbsp;</label>';
        form += '<label id="userCurpApp">'+curp+'</label>';
        form += '</div>';
        form += '</div>'; 
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">Cónyuge:&nbsp;&nbsp;</label>';
        form += '<label id="userPartnerNameApp">'+partnerName+'</label>';
        form += '</div>';
        form += '</div>';  
        form += '<div class="col-xs-6 col-sm-4 col-lg-6">';
        form += '<div class="form-group">';
        form += '<label style="font-weight: bold;">Cónyuge NSS:&nbsp;&nbsp;</label>';
        form += '<label id="userPartnerNssApp">'+partnerNss+'</label>';
        form += '</div>';
        form += '</div>'; 
    }
    if (flag != 0) {    
        $('#hubSpotMissingRecords').html('<label style="color:red;">Debes corregir o llenar los datos faltantes en HubSpot.</label>'); 
    } else {
        $("#datepickerAppointment").prop("disabled", false);
        $("#calendarDate").css("pointer-events", "auto");
        $("#calendarInputTime").prop("disabled", false);
        $("#calendarTime").css("pointer-events", "auto");
        $("#scheduleAppointment").prop("disabled", false);  
        $(".custom-file").removeAttr('disabled');
        $('#searchInputContainer').css('display', 'none');
        $('#searchLinkContainer').css('display', 'block');
        $("#budgetInput").prop("disabled", false);
        $("#productInput").prop("disabled", false);
        $("#appointmentNotes").prop("disabled", false);
    }  
    $('#creditTypeOption').html(form);
});

$(document).on("click", "#showSearchInputContainer", function(e) {
    e.preventDefault();  
    $("#scheduleAppointmentResponse").html('');
    $("#contactsContainer").css("display", "none");  
    $('#searchInputContainer').css('display', 'block');
    $('#searchLinkContainer').css('display', 'none');
    $("#datepickerAppointment").prop("disabled", true);
    $("#calendarDate").css("pointer-events", "none");
    $("#calendarInputTime").prop("disabled", true);
    $("#calendarTime").css("pointer-events", "none");
    $("#scheduleAppointment").prop("disabled", true);
    $(".custom-file").attr('disabled','disabled'); 
    $("#budgetInput").prop("disabled", true);
    $("#productInput").prop("disabled", true);
    $("#appointmentNotes").prop("disabled", true);
    $("#filesname").html('');
    //filesInformation = null;
    if ($("#datepickerAppointment").closest('.input-group').hasClass('has-error')) {
        $("#datepickerAppointment").closest('.input-group').removeClass('has-error');
        $("#datepickerAppointment").closest('.input-group').next('label').remove();
    } 
    if ($("#calendarInputTime").closest('.input-group').hasClass('has-error')) {
        $("#calendarInputTime").closest('.input-group').removeClass('has-error');
        $("#calendarInputTime").closest('.input-group').next('label').remove();
    }  
});

function formatedDateByMonth(availability) {
    if ((availability == null) | (availability == null)) {
        return 'NA';
    } else {
        var months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        dateArray = availability.split("-");
        monthNum = parseInt(dateArray[1]) - 1;
        monthName = months[monthNum];
        var formatedDate = monthName + ' ' + dateArray[0];
        return formatedDate;
    }
}

function formatedDate() {
    var currentTime = new Date();
    var currentHour = currentTime.getHours() - (currentTime.getHours() >= 12 ? 12 : 0);
    var timeIndicator = currentTime.getHours() >= 12 ? 'PM' : 'AM';    
    var months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    var now = new Date(); 
    var currentYear = now.getFullYear();
    var currentMonth = months[now.getMonth()]; 
    var currentDay = now.getDate();
    var formatedDate = currentDay + ' ' + currentMonth + ' ' + currentYear.toString().substr(-2) + ' ' + currentHour + ':' + currentTime.getMinutes() + timeIndicator.toLowerCase();
    return formatedDate;
}

function formatoMoneda(stringVal) {
	if(stringVal == undefined){return "$0";}
	stringVal = stringVal.indexOf(".") >= 0 ? stringVal.split(".")[0] : stringVal;
	var val = "$" + stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	if (val.length === 1 && val === "$") {
		val = "";
	}
	return val;
}

$(document).on("click", ".copyURL", function(e) {
    e.preventDefault();
    var x1 = $(this).offset().top;
    var textArea = document.createElement('textarea');
    var url = $(this).attr('name');
    var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i); 
    var button = $(this);
    url = url.replace(/&amp;/g, '&');
    textArea.value = url;
    document.body.appendChild(textArea);
    console.log(textArea.value);
	if (isiOSDevice) {
		var editable = textArea.contentEditable;
		var readOnly = textArea.readOnly;
		textArea.contentEditable = true;
		textArea.readOnly = false;
		var range = document.createRange();
		range.selectNodeContents(textArea);
		var selection = window.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
		textArea.setSelectionRange(0, 999999);
		textArea.contentEditable = editable;
		textArea.readOnly = readOnly;
	} else {
        textArea.select();
	}
	document.execCommand('copy');
    document.body.removeChild(textArea);
    button.css('background-color', '#5cb85c');
    button.html('¡Listo!');
    setTimeout(function () { 
        button.css('background-color', '#FFB71B');
        button.html('Copiar');
   }, 1400);    
   var x2 = $(this).offset().top;
   var dx = x2 - x1;
   $(document).scrollTop($(document).scrollTop() + dx);      
});