/*v=1.0.2.6 8 March 2021 12:50*/
//http://localhost/smarto/tratodirecto/dev/desarrolladores/appointment.php?developmentId=468&developmentName=Aldaba%20Residencial&developmentAddress=Aldaba%20de%20Corralejo,%20No.%20121.%20Le%C3%B3n,%20Guanajuato.%20C.P.%2037297.&developmentLatLng=https://www.google.com/maps/?q=21.1145081,-101.624654&modelId=0&modelName=0&assetType=development&price=0

var developmentId = 0;
var developerId = 0;
var modelId = 0;
var cvs = "";
var userId = 0;

var providerId = '0';
var providerToken = '0';
var providerStatus = '0';	

var assetType = "";
var developmentName = "";
var developmentAddress = "";
var developmentLocality = "";
var developmentState = "";
var developmentLatlng = "";
var developmentShortUrl = ""
var modelName = "";
var modelPrice = 0;
var hubSpotIdDeveloper = "";
var modelShortUrl = ""

var hubSContactId = 0;
var hubSName = "";
var hubSLastName = "";
var hubSSecondLastName = "";
var hubSPhone = "";
var hubSMail = "";
var hubSCreditUserName = "";
var hubSCreditUserLastName = "";
var hubSCreditUserSecondLastName  = "";
var hubSCreditUserPhone = "";
var hubSCreditUserEmail = "";
var hubSCreditType = "";
var hubSCreditTypeId = 0;
var hubSCreditAmount = 0;
var hubSNss = "";
var hubSDob = "";
var hubSCurp = "";
var hubSPartnerName = "";
var hubSPartnerLastName = "";
var hubSPartnerSecondLastName = "";
var hubSPartnerPhone = "";
var hubSPartnerEmail = "";
var hubSPartnerNss = "";
var hubSPartnerCurp = "";
var hubSPartnerCreditType = "";
var hubSPartnerCreditAmount = "";
var hubSProduct = "";
var hubSWhatsappURL = "";

var filesInformation = [];
var fileNum = 1;

var scheduleDateG = "";
var scheduleTimeG = "";
var appointmentNotesG = "";
var hubSpotDealIdG = "";
var leadIdG = 0;

var globalFlag = 0;
var randomNum = "000";

var visitsAllowed = 0;

$(document).ready(function () {
    jQuery("#datepickerAppointment").mask("99/99/9999");
    if (latlng == 0) {
        latlng = getLatlng();
    }
    developmentId = $('#developmentIdForSchedule').val();
    modelId = $('#modelIdForSchedule').val();

    if (developmentId != undefined) {
        getAppointmentData();
    }

    //readImage('./uploadedFiles/snake.jpg', function(base64) {
    //    console.info(base64);
    //});

    randomNum = Math.floor(Math.random() * 999);
    if (randomNum.toString().length == 1) {
        randomNum = '00' + randomNum.toString() + '_';
    } else if (randomNum.toString().length == 2) {
        randomNum = '0' + randomNum.toString() + '_';
    } else {
        randomNum = randomNum.toString() + '_';
    }
});

function readImage(num, filename, url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function() {
       var file = new FileReader();
       file.onloadend = function() {
          //callback(file.result);
          //console.log(file.result);
          //console.log(filename);
          $('#filesname').append('<span><a href="./uploadedFiles/'+ filename +'" target="_blank">' + filename + '</a>&nbsp;&nbsp;<a href="#" class="removeFile" id="' + num + '"><i class="glyphicon glyphicon-remove-circle" style="color:#CC0000"></i></a></span><br>');
          imageInfo = file.result.split(',');
          imageContent = imageInfo[1];
          imageType = imageInfo[0].split(';')[0].split(':')[1];
          filesInformation.push({
              "id": num,
              "name": filename,
              "type": imageType,
              "content": imageContent
          });
       }
       file.readAsDataURL(request.response);
    };

    request.open('GET', url);
    request.responseType = 'blob';
    request.send();
}

function getAppointmentData() {
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
                //console.log(data);
                if (data.developmentName == null) {
                    $('#appointmentData').html('<span style="color:red">No hay información</span>');
                    $("#searchInput").prop("disabled", true);
                } else {
                    if (data == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    developmentAddress = data.street.trim();
                    if ((data.extNumber == '') || (data.extNumber == null) || (data.extNumber == 's/n') || (data.extNumber == 'S/N')) {
                        developmentAddress += ', s/n. ';
                    } else {
                        developmentAddress += ', No. ' + data.extNumber.trim() + '. ';
                    }
                    developmentAddress += data.locality + ', ' + data.state + '.';
                    if (!((data.postalCode == '') || (data.postalCode == null))) {
                        developmentAddress += ' C.P. ' + data.postalCode.trim() + '.';
                    }
                    developmentLatlng = 'https://www.google.com/maps/?q=' + data.latitude + ',' + data.longitude;
                    developerId = data.developerId;
                    developmentName = data.developmentName;
                    developmentLocality = data.locality;
                    developmentState = data.state;
                    hubSpotIdDeveloper = data.hubSpotId;
                    developmentShortUrl = data.developmentShortUrl;
                    modelShortUrl = data.modelShortUrl;
                    if (data.paymentMethods == null) {
                        paymentMethodsArray = null;
                    } else {
                        paymentMethodsArray = data.paymentMethods.split(',');
                        $.each(paymentMethodsArray, function(index, method) {
                            paymentMethods.push(method.trim());
                        });
                    }
                    //console.log(data.localCollaborators, data.centralCollaborators);
                    detailedData = '<table style="width:100%">';
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Desarrollador</strong></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;font-size:18px;"><strong>' + data.developer + '</strong></td>';
                    detailedData += '</tr>';
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Desarrollo</strong></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">';
                    detailedData += '<label style="font-size:16px;font-weight:600"><a href="' +  data.developmentShortUrl + '" target="_blank">' + developmentName + '</a></label>&nbsp;&nbsp;';
                    detailedData += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-4px;" name="' + data.developmentShortUrl + '">Copiar</button>';
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
                        assetType = 'model';
                        modelId = data.modelId;
                        modelName = data.modelName;
                        modelPrice = data.modelPrice;
                        detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                        detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><strong>Modelo</strong></td>';
                        detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">';
                        detailedData += '<label style="font-size:16px;font-weight:600"><a href="'+ data.modelShortUrl +'" target="_blank">' + modelName + '</a></label>&nbsp;&nbsp;';
                        detailedData += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-4px;" name="'+ data.modelShortUrl +'">Copiar</button>';
                        detailedData += '</td>';
                        detailedData += '</tr>';
                        detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                        detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Precio</p></td>';
                        detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + modelPrice + '</label></td>';
                        detailedData += '</tr>';
                    } else {
                        assetType = 'development';
                        modelId = 0;
                        modelName = 0;
                        modelPrice = 0;
                    }
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Formas de Pago</p></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + data.paymentMethods + '</label></td>';
                    detailedData += '</tr>';   
                    if (data.visitsAllowed == 1) {
                        visitsAllowed = 1;
                        var visitsAllowedText = 'Virtual';
                        $('#visitsAllowedInput').val(1).change();
                    } else {
                        visitsAllowed = 0;
                        var visitsAllowedText = 'Física';
                        $('#visitsAllowedInput').val(0).change();                        
                    }
                    detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                    detailedData += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Tipo de visita</p></td>';
                    detailedData += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + visitsAllowedText + '</label></td>';
                    detailedData += '</tr>';    
                    if ((data.localCollaborators == 0) && (data.centralCollaborators == 0)) {
                        detailedData += '<tr style="border-bottom: 1px dotted #dddddd;">';
                        detailedData += '<td colspan="2" style="text-align:left;vertical-align:top;padding-top:4px;color:red;font-weight:bold;">No hay colaboradores asignados</td>';
                        detailedData += '</tr>';
                    }
                    detailedData += '</table>';
                    $('#appointmentData').html(detailedData);
                    if ((data.localCollaborators == 0) && (data.centralCollaborators == 0)) {
                        $("#searchInput").prop('disabled', true);
                    } else {
                        $("#searchInput").prop("disabled", false); 
                    }
                    $("#searchContacts").css('pointer-events', 'auto');
                    $("#searchContacts").css('cursor', 'pointer');
                    $("#accreditedOption").prop("disabled", false); 
                    $("#searchAccredited").css('background-color', '#fff');
                }
            },
            error: function(response) {
                $('#appointmentData').html('<span style="color:red">No hay información</span>');
                $("#searchInput").prop("disabled", true);
            }
        });
    }
}
var paymentMethods = [];

/*accreditedName = '';
accreditedLastName = '';
accreditedPhone = '';
accreditedMail = '';
accreditedMailCreditType = '';
accreditedMailCreditAmount = '';*/

$(document).on("change", "#accreditedOption", function(e) {
        e.preventDefault();
    var keyword = $('#searchInput').val();
    if (keyword != '') {
        $("#contactsContainer").css("display", "block");
        getContactsBySearchBox(keyword);
    }
});

var accredited1 = 1; 
var accredited2 = 2;
function getContactsBySearchBox(keyword) {
    var string = '';
    var flag = 0;
    var regBudget = /^\$?(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d{1,2})?$/;
    var regPhone = /^\+\d{8,13}$/;
    $("#hubSpotDataContainer").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px; padding-bottom:10px;padding-top:20px;'>");
    $.ajax({  
        type: "POST",
        data: {type:"getUserData", keyword:keyword, developerId:developerId},
        url: "./php/appointmentData.php",
        dataType: 'json',
        success: function(response) {
            if (response.status == "success") {
                if (response.name != null) {
                    //console.log(response);
                    $('#contactsContainesTitle').html('Información de HubSpot / Usuario: ' + keyword);
                    var accreditedOptio = $('#accreditedOption').val();
                    var errorTxt = '<span style="font-weight:bold;color:red;">¡Atención!</span>';
                    var warning = '<span style="font-weight:bold;color:#FF8800;">Sin información</span>';
                    var warningAmount = '&nbsp;&nbsp;<span style="font-weight:bold;color:red;">¡Monto inválido!</span>';

                    if (visitsAllowed == 0) {
                        $('#visitsAllowedInput').prop('disabled', false);
                        $('#visitsAllowed').css('background-color', '#fff')
                    }

                    hubSContactId = keyword;
                    hubSName = response.name;
                    hubSLastName = response.lastName;
                    hubSSecondLastName = response.secondLastName; //new
                    hubSPhone = response.phone;
                    hubSMail = response.email;
                    hubSCreditTypeId = 0;
                    hubSWhatsappURL = response.whatsappURL;

                    providerId = response.providerId;
                    providerToken = response.providerToken;
                    providerStatus = response.providerStatus;

                    if (accreditedOptio == 1) {
                        accredited1 = 1;
                        accredited2 = 2;
                        hubSCreditUserName = response.creditUserName;
                        hubSCreditUserLastName = response.creditUserLastName;
                        hubSCreditUserSecondLastName = response.creditUserSecondLastName; //new
                        hubSCreditUserPhone = response.userPhone;
                        hubSCreditUserEmail = response.userEmail;
                        hubSCreditType = response.creditType;
                        hubSCreditAmount = response.creditAmount;
                        
                        hubSPartnerName = response.partnerName;
                        hubSPartnerLastName = response.partnerLastName;
                        hubSPartnerPhone = response.partnerPhone;
                        hubSPartnerEmail = response.partnerEmail;
                        hubSPartnerCreditType = response.partnerCreditType;
                        hubSPartnerCreditAmount = response.partnerCreditAmount;

                        hubSNss = response.nss;
                        hubSDob = response.dob;
                        hubSCurp = response.curp;
                        hubSProduct = response.product;

                        hubSPartnerNss = response.partnerNss;  
                        hubSPartnerDob = response.partnerDob;
                        hubSPartnerCurp = response.partnerCurp;
                        hubSPartnerProduct = response.partnerProduct;
                    } else if (accreditedOptio == 2) {
                        accredited1 = 2;
                        accredited2 = 1;
                        hubSCreditUserName = response.partnerName;
                        hubSCreditUserLastName = response.partnerLastName;
                        hubSCreditUserSecondLastName = response.partnerSecondLastName; //new
                        hubSCreditUserPhone = response.partnerPhone;
                        hubSCreditUserEmail = response.partnerEmail;
                        hubSCreditType = response.partnerCreditType;
                        hubSCreditAmount = response.partnerCreditAmount;

                        hubSPartnerName = response.creditUserName;
                        hubSPartnerLastName = response.creditUserLastName;
                        hubSPartnerSecondLastName = response.creditUserSecondLastName; //new
                        hubSPartnerPhone = response.userPhone;
                        hubSPartnerEmail = response.userEmail;
                        hubSPartnerCreditType = response.creditType;
                        hubSPartnerCreditAmount = response.creditAmount;

                        hubSNss = response.partnerNss;
                        hubSDob = response.partnerDob;
                        hubSCurp = response.partnerCurp;
                        hubSProduct = response.partnerProduct;

                        hubSPartnerNss = response.nss;  
                        hubSPartnerDob = response.dob;
                        hubSPartnerCurp = response.curp;
                        hubSPartnerProduct = response.product;    
                                       
                    } else {
                        accredited1 = 1;
                        accredited2 = 2;
                        hubSCreditUserName = response.creditUserName;
                        hubSCreditUserLastName = response.creditUserLastName;
                        hubSCreditUserSecondLastName = response.creditUserSecondLastName; //new
                        hubSCreditUserPhone = response.userPhone;
                        hubSCreditUserEmail = response.userEmail;
                        hubSCreditType = response.coaccreditedCreditType;
                        hubSCreditAmount = response.coaccreditedBudget;
                        
                        hubSPartnerName = response.partnerName;
                        hubSPartnerLastName = response.partnerLastName;
                        hubSPartnerSecondLastName = response.partnerSecondLastName; //new
                        hubSPartnerPhone = response.partnerPhone;
                        hubSPartnerEmail = response.partnerEmail;
                        hubSPartnerCreditType = response.partnerCreditType;
                        hubSPartnerCreditAmount = response.partnerCreditAmount;

                        hubSNss = response.nss;
                        hubSDob = response.dob;
                        hubSCurp = response.curp;
                        hubSProduct = response.product;

                        hubSPartnerNss = response.partnerNss;  
                        hubSPartnerDob = response.partnerDob;
                        hubSPartnerCurp = response.partnerCurp;
                        hubSPartnerProduct = response.partnerProduct;
                    }
                    switch(hubSCreditType) {
                        case 'Otro crédito': tempCreditType = 'Otro'; break;
                        case 'Contado': tempCreditType = 'Contado'; break;
                        case 'Crédito Bancario': tempCreditType = 'Bancario'; break;
                        case 'Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Cofinavit': tempCreditType = 'Bancario'; break;
                        case 'Segundo Crédito Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Conyugal Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Fovissste': tempCreditType = 'Fovissste'; break;
                        case 'Fovissste Mancomunado': tempCreditType = 'Fovissste'; break;
                        case 'Alia2': tempCreditType = 'Fovissste'; break;
                        case 'Segundo Crédito Fovissste': tempCreditType = 'Fovissste'; break;
                        case 'Directo Constructor': tempCreditType = 'Directo'; break;
                        case 'Fovissste + Infonavit Individual': tempCreditType = 'Infonavit'; break;
                        case 'Respalda2': tempCreditType = 'Fovissste'; break;
                        case 'Fovissste tu casa te espera': tempCreditType = 'Fovissste'; break;
                        case 'Crédito Seguro': tempCreditType = 'Infonavit'; break;
                        case 'Cambiavit': tempCreditType = 'Infonavit'; break;
                        case 'Fovissste sorteado': tempCreditType = 'Fovissste'; break;
                        case 'Fovissste disponible': tempCreditType = 'Fovissste'; break;
                        case 'Fovissste vencido': tempCreditType = 'Fovissste'; break;
                        case 'Fovissste para todos': tempCreditType = 'Fovissste'; break;
                        case 'ION': tempCreditType = 'Otro'; break;
                        case 'Familiar Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Corresidencial Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Conyugal Fovissste+Infonavit': tempCreditType = 'Infonavit'; break;
                        case 'Alia2 Conyugal': tempCreditType = 'Fovissste'; break;
                        case 'Respalda2 Conyugal': tempCreditType = 'Fovissste'; break;
                        case 'Crédito Bancario Coacreditados': tempCreditType = 'Bancario'; break;
                        case 'Otro Crédito Coacreditados': tempCreditType = 'Otro'; break;
                        case 'Infonavit Total': tempCreditType = 'Infonavit'; break;
                        case 'Cofinavit Conyugal': tempCreditType = 'Infonavit'; break;                        
                        default: tempCreditType = 'Verify';
                    }

                    if (paymentMethods.includes(tempCreditType)) {
                        var methodFlag = '';
                    } else {
                        var methodFlag = 'Método no aceptado';
                        flag++;
                    }
                    if (hubSName != null) { var name = hubSName; } else { var name = errorTxt; flag++; }
                    if (hubSLastName != null) { var lastName = hubSLastName + ' ' + hubSSecondLastName; } else { var lastName = errorTxt; flag++; }
                    if (regPhone.test(hubSPhone)) {
                        var phone = hubSPhone;
                        if (hubSPhone.substring(0, 3) == '+52') {
                            if (hubSPhone.length == 13) {
                                var phone = hubSPhone;
                            } else {
                                var phone = response.phone + ' ' + errorTxt;
                                flag++;
                            }
                        } else {
                            var phone = hubSPhone;
                        }
                    } else {
                        var phone = response.phone + ' ' + errorTxt;
                        flag++;
                    }
                    if (hubSMail != null) { var email = hubSMail; } else { var email = warning; }
                    if (hubSCreditUserName != null) { var creditUserName = hubSCreditUserName; } else { var creditUserName = errorTxt; flag++; }
                    if (hubSCreditUserLastName != null) { var creditUserLastName = hubSCreditUserLastName  + ' ' + hubSCreditUserSecondLastName; } else { var creditUserLastName = errorTxt; flag++; }
                    if (hubSCreditType != null) { var creditType = hubSCreditType; } else { var creditType = errorTxt; flag++; }
                    if (regBudget.test(hubSCreditAmount)) {
                        if ((hubSCreditAmount == null) || (hubSCreditAmount == 0)) { var creditAmount = hubSCreditAmount; var creditAmountMsg = warningAmount; flag++; }
                        else { var creditAmount = hubSCreditAmount; var creditAmountMsg = ''; }
                    } else {
                        var creditAmount = hubSCreditAmount; var creditAmountMsg = warningAmount;  flag++;
                    }
                    string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-sm-6"><label class="labelTitle">Nombre del Contacto:</label> <label class="labelData" id="userNameApp">'+name+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Apellido del Contacto:</label> <label class="labelData" id="userLastNameApp">'+lastName+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Teléfono del Contacto:</label> <label class="labelData" id="userPhoneApp">'+phone+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Email del Contacto:</label> <label class="labelData" id="userMailApp">'+email+'</label></div>';
                    string += '</div>';

                    string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                    if (accreditedOptio == 3) {
                        string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData" id="userCreditTypeApp">'+creditType+' '+methodFlag+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData" id="userCreditAmountApp">'+creditAmount+'</label>' + creditAmountMsg + '<label id="amountValidationResponse"></label></div>';
                    } else {
                        string += '<div class="col-sm-6"><label class="labelTitle">Producto Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditTypeApp">'+creditType+' '+methodFlag+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditAmountApp">'+creditAmount+'</label>' + creditAmountMsg + '<label id="amountValidationResponse"></label></div>';
                    }
                    string += '</div>';

                    string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditNameApp">'+creditUserName+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditLastNameApp">'+creditUserLastName+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Teléfono Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditPhoneApp">'+hubSCreditUserPhone+'</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Email Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCreditEmailApp">'+hubSCreditUserEmail+'</label></div>';

                    if ((hubSCreditType == 'Infonavit') || (hubSCreditType == 'Cofinavit') || (hubSCreditType == 'Cambiavit') || (hubSCreditType == 'Segundo Crédito Infonavit') || (hubSCreditType == 'Crédito Seguro')) {    
                        if (hubSNss != null) { var nss = hubSNss; } else { var nss = warning; }
                        if (hubSDob != null) { var dob = hubSDob; } else { var dob = warning; }
                        string += '<div class="col-sm-6"><label class="labelTitle">NSS Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userNssApp">'+hubSNss+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Fecha de Nac. Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userDobApp">'+hubSDob+'</label></div>';
                    } else if ((hubSCreditType == 'Fovissste') || (hubSCreditType == 'Alia2') || (hubSCreditType == 'Respalda2')) {
                        if (hubSCurp != null) { var curp = hubSCurp; } else { var curp = warning; }
                        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCurpApp">'+curp+'</label></div>'; 
                    } else if ((hubSCreditType == 'Conyugal Infonavit') ||  (hubSCreditType == 'Familiar Infonavit') || (hubSCreditType == 'Corresidencial Infonavit')) {
                        if (hubSNss != null) { var nss = hubSNss; } else { var nss = warning; }
                        if (hubSDob != null) { var dob = hubSDob; } else { var dob = warning; }
                        if (hubSPartnerName != null) { var partnerName = hubSPartnerName; } else { var partnerName = warning; }   
                        if (hubSPartnerLastName != null) { var partnerLastName = hubSPartnerLastName + ' ' + hubSPartnerSecondLastName; } else { var partnerLastName = warning; } 
                        if (hubSPartnerNss != null) { var partnerNss = hubSPartnerNss; } else { var partnerNss = warning; }
                        string += '<div class="col-sm-6"><label class="labelTitle">NSS Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userNssApp">'+hubSNss+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Fecha de Nac. Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userDobApp">'+hubSDob+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNameApp">'+partnerName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerLastNameApp">'+partnerLastName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">NSS Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNssApp">'+partnerNss+'</label></div>';  
                    } else if (hubSCreditType == 'Crédito Bancario Coacreditados') {
                        if (hubSPartnerName != null) { var partnerName = hubSPartnerName; } else { var partnerName = warning; }   
                        if (hubSPartnerLastName != null) { var partnerLastName = hubSPartnerLastName + ' ' + hubSPartnerSecondLastName; } else { var partnerLastName = warning; } 
                        string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNameApp">'+partnerName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerLastNameApp">'+partnerLastName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Teléfono Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerPhoneApp">'+hubSPartnerPhone+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Email Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerEmailApp">'+hubSPartnerEmail+'</label></div>';
                    } else if (hubSCreditType == 'Infonavit+Fovissste') {
                        globalFlag = 1;
                        string += '<div id="creditTypeOption">';
                        string += '<div class="col-sm-12">';
                        string += '<div class="form-group" style="text-align: center;padding-top:8px;text-align: center;padding-top:8px;margin:0px;">';
                        string += '<label class="labelTitle" style="padding-right:8px;">¿Que tipo de crédito tiene el titular?</label>';
                        string += '<label class="radio-inline labelData" style="margin-top:2px;"><input type="radio" class="optionCredit" name="optionCredit" style="margin-top: 1px;" value="infonavit">Infonavit</label>';
                        string += '<label class="radio-inline labelData" style="margin-top:2px;"><input type="radio" class="optionCredit" name="optionCredit" style="margin-top: 1px;" value="fovissste">Fovissste</label>';
                        string += '</div>';
                        string += '</div>';
                        string += '</div>'; 
                    } else if (hubSCreditType == 'Conyugal Fovissste') {
                        if (hubSCurp != null) { var curp = hubSCurp; } else { var curp = warning; }
                        if (hubSPartnerName != null) { var partnerName = hubSPartnerName; } else { var partnerName = warning; }
                        if (hubSPartnerLastName != null) { var partnerLastName = hubSPartnerLastName + ' ' + hubSPartnerSecondLastName; } else { var partnerLastName = warning; } 
                        if (hubSPartnerCurp != null) { var partnerCurp = hubSPartnerCurp; } else {var partnerCurp = warning; }
                        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCurpApp">'+curp+'</label></div>'; 
                        string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNameApp">'+partnerName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerLastNameApp">'+partnerLastName+'</label></div>';
                        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerCurpApp">'+partnerCurp+'</label></div>';                                                                                  
                    } else if (hubSCreditType == 'Otro crédito') {
                        if (hubSProduct != null) { var product = hubSProduct; } else { var product = warning; }
                        string += '<div class="col-sm-6"><label class="labelTitle">Otro Producto Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userProductApp">'+product+'</label></div>'; 
                    } 
                    string += '<div class="col-sm-12" id="hubSpotMissingRecords" style="text-align: center;padding:0px;"></div>'; 
                    string += '</div>';

                   
                } else {
                    string += '<div class="row" style="padding-top:20px;">';
                    string += '<div class="col-sm-12">';
                    string += '<div class="form-group" style="text-align: center">';
                    string += '<label style="color:red;">No se encontraron coincidencias.</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '</div>';
                }
            } else {
                string += '<div class="row" style="padding-top:20px;">';
                string += '<div class="col-sm-12">';
                string += '<div class="form-group" style="text-align: center">';
                string += '<label style="color:red;">No se encontraron coincidencias.</label>';
                string += '</div>';
                string += '</div>';
                string += '</div>';
            }
            switch(hubSCreditType) {
                case 'Otro crédito': hubSCreditTypeId = 0; break;
                case 'Contado': hubSCreditTypeId = 1; break;
                case 'Crédito Bancario': hubSCreditTypeId = 2; break;
                case 'Infonavit': hubSCreditTypeId = 3; break;
                case 'Cofinavit': hubSCreditTypeId = 4; break;
                case 'Segundo Crédito Infonavit': hubSCreditTypeId = 5; break;
                case 'Conyugal Infonavit': hubSCreditTypeId = 6; break;
                case 'Fovissste': hubSCreditTypeId = 7; break;
                case 'Fovissste Mancomunado': hubSCreditTypeId = 8; break;
                case 'Alia2': hubSCreditTypeId = 9; break;
                case 'Segundo Crédito Fovissste': hubSCreditTypeId = 10; break;
                case 'Directo Constructor': hubSCreditTypeId = 11; break;
                case 'Fovissste + Infonavit Individual': hubSCreditTypeId = 12; break;
                case 'Respalda2': hubSCreditTypeId = 13; break;
                case 'Fovissste tu casa te espera': hubSCreditTypeId = 14; break;
                case 'Crédito Seguro': hubSCreditTypeId = 15; break;
                case 'Cambiavit': hubSCreditTypeId = 16; break;
                case 'Fovissste sorteado': hubSCreditTypeId = 17; break;
                case 'Fovissste disponible': hubSCreditTypeId = 18; break;
                case 'Fovissste vencido': hubSCreditTypeId = 19; break;
                case 'Fovissste para todos': hubSCreditTypeId = 20; break;
                case 'ION': hubSCreditTypeId = 21; break;
                case 'Familiar Infonavit': hubSCreditTypeId = 22; break;
                case 'Corresidencial Infonavit': hubSCreditTypeId = 23; break;
                case 'Conyugal Fovissste+Infonavit': hubSCreditTypeId = 24; break;
                case 'Alia2 Conyugal': hubSCreditTypeId = 25; break;
                case 'Respalda2 Conyugal': hubSCreditTypeId = 26; break;
                case 'Crédito Bancario Coacreditados': hubSCreditTypeId = 27; break;
                case 'Otro Crédito Coacreditados': hubSCreditTypeId = 28; break;
                case 'Infonavit Total': hubSCreditTypeId = 29; break;
                case 'Cofinavit Conyugal': hubSCreditTypeId = 30; break;
                default: hubSCreditTypeId = 0;
            }
            $('#hubSpotDataContainer').html(string);
            console.log(developerId, providerId, providerToken, providerStatus);
            if (flag != 0) {
                $('#hubSpotMissingRecords').html('<label style="color:red;">Debes corregir o llenar los datos faltantes en HubSpot.</label>');
            } else {
                if (globalFlag == 0) {
                    if ((developerId == 'SAD' || developerId == 'ALT' || developerId == 'RUB' || developerId == 'RUB2') && (providerStatus == '0' || providerStatus == 'Rejected')) {
                        $('#hubSpotMissingRecords').html('<label style="color:red;">Debes de dar de alta al contacto en el Constructor primero.</label>');
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
                }
            }
        },
        error: function(response) {
            string += '<div class="row" style="padding-top:20px;">';
            string += '<div class="col-sm-12">';
            string += '<div class="form-group" style="text-align: center">';
            string += '<label style="color:red;">Hubo un error.</label>';
            string += '</div>';
            string += '</div>';
            string += '</div>';
            $('#hubSpotDataContainer').html(string);
        }
    });
}

$(document).on("change", ".optionCredit", function(e) {
    var option = $(this).val();
    var string = '';
    var warning = '<span style="font-weight:bold;color:red;">¡Atención!</span>';
    var flag = 0;
    //console.log(option, dob, curp, partnerName, partnerCurp, partnerNss);
    if (option == 'infonavit') {
        if (hubSNss != null) { var nss = hubSNss; } else { var nss = warning; flag++; }
        if (hubSDob != null) { var dob = hubSDob; } else { var dob = warning; flag++; }
        if (hubSCurp != null) { var curp = hubSCurp; } else { var curp = warning; flag++; }
        if (hubSPartnerName != null) { var partnerName = hubSPartnerName; } else { var partnerName = warning; flag++; }
        if (hubSPartnerLastName != null) { var partnerLastName = hubSPartnerLastName; } else { var partnerLastName = warning; } 
        if (hubSPartnerCurp != null) { var partnerCurp = hubSPartnerCurp; } else { var partnerCurp = warning; flag++; }
        string += '<div class="col-sm-6"><label class="labelTitle">NSS Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userNssApp">'+nss+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">Fecha de Nac. Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userDobApp">'+dob+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCurpApp">'+curp+'</label></div>'; 
        string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNameApp">'+partnerName+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerLastNameApp">'+partnerLastName+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerCurpApp">'+partnerCurp+'</label></div>';  
    } else {
        if (hubSCurp != null) { var curp = hubSCurp; } else { var curp = warning; flag++; }
        if (hubSPartnerName != null) { var partnerName = hubSPartnerName; } else { var partnerName = warning; flag++; }
        if (hubSPartnerLastName != null) { var partnerLastName = hubSPartnerLastName; } else { var partnerLastName = warning; } 
        if (hubSPartnerNss != null) { var partnerNss = hubSPartnerNss; } else { var partnerNss = warning; flag++; }
        string += '<div class="col-sm-6"><label class="labelTitle">CURP Acreditado ' + accredited1 + ':</label> <label class="labelData" id="userCurpApp">'+curp+'</label></div>'; 
        string += '<div class="col-sm-6"><label class="labelTitle">Nombre Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNameApp">'+partnerName+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">Apellido Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerLastNameApp">'+partnerLastName+'</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">NSS Acreditado ' + accredited2 + ':</label> <label class="labelData" id="userPartnerNssApp">'+partnerNss+'</label></div>';  
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
    $('#creditTypeOption').html(string);
});

$(document).on("change", "#imgInput", function(e) {
    e.preventDefault();
    for (x=0;x<$('#imgInput')[0].files.length;x++) {
        setupReader($('#imgInput')[0].files[x]);
    }
});

function verifyFiles(file) {
    var count = filesInformation.length;
    if (count != 0) {
        for (var i=0;i<count;i++) {
            if (filesInformation[i].name == file.name) {
                return 'Duplicate';
            }
        }
    }
}

function setupReader(file) {
    var name = randomNum + file.name;
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
    visitsAllowed = $('#visitsAllowedInput').val();
    visitsAllowed = $('#visitsAllowedInput').val();
    if ($('#sendNotifications').is(':checked')) {
        var sendNotifications = 1;
    } else {
        var sendNotifications = 0;
    }    
    var appointmentNotes = $('#appointmentNotes').val();
    var scheduleDateArr = $('#datepickerAppointment').val().split("/");
    var scheduleDate = scheduleDateArr[2] + '-' + scheduleDateArr[1] + '-' +  scheduleDateArr[0];
    var scheduleTime = $('#calendarInputTime').val().substring(0, 5);
    var scheduleTimeArr = scheduleTime.split(":");
    var currentDate = new Date();
    var regDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    var regTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (sendNotifications == 1) {
        if (regDate.test(scheduleDate)) {
            var appointmentDate = new Date(scheduleDateArr[2], parseInt(scheduleDateArr[1])-1, scheduleDateArr[0], 23, 59);
            //console.log(appointmentDate);
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
    }

    if(filesInformation != null) {
        if (filesInformation.length == 0) {
            filesInformation = null;
        }
    }
    if (flag == 0) {
        //console.log(appointmentNotes);
        $('#visitsAllowedInput').prop('disabled', true);
        $('#visitsAllowed').css('background-color', '#eee')
        $("#scheduleAppointmentResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;'>");
        $.ajax({
            type: "POST",
            data: {
                type:"scheduleAppointment",
                developmentId:developmentId,
                developmentName: developmentName,
                developmentLocality: developmentLocality,
                developmentState: developmentState,
                modelId:modelId,
                modelName: modelName,
                price:modelPrice,
                userId:hubSContactId,
                userName:hubSName,
                userLastName:hubSLastName,
                userSecondLastName:hubSSecondLastName, //new
                userPhone:hubSPhone,
                userMail:hubSMail,
                userCreditName:hubSCreditUserName,
                userCreditLastName:hubSCreditUserLastName,
                userCreditSecondLastName:hubSCreditUserSecondLastName, //new
                scheduleDate:scheduleDate,
                scheduleTime:scheduleTime,
                latlng:latlng,
                IPCurrentUser:IPCurrentUser,
                deviceType:deviceType,
                product:hubSCreditTypeId,
                productName:hubSCreditType,
                userCreditAmount:hubSCreditAmount,
                hubSpotIdDeveloper:hubSpotIdDeveloper,
                userWhatsappURL:hubSWhatsappURL,
                appointmentNotes:appointmentNotes,
                visitsAllowed:visitsAllowed,
                attachments:filesInformation,
                sendNotifications:sendNotifications
            },
            url: "./php/appointmentData.php",
            dataType: 'json',
            success: function(response) {
                //console.log(response);
                if (response.result == 'success') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#datepickerAppointment").prop("disabled", true);
                    $("#calendarDate").css("pointer-events", "none");
                    $("#calendarInputTime").prop("disabled", true);
                    $("#calendarTime").css("pointer-events", "none");
                    $("#budgetInput").prop("disabled", true);
                    $("#productInput").prop("disabled", true);
                    $("#appointmentNotes").prop("disabled", true);
                    $('#userCreditAmount').prop("disabled", true);
                    verifyCode(hubSContactId, hubSName, hubSLastName, hubSSecondLastName, hubSPhone, hubSMail, hubSCreditUserName, hubSCreditUserLastName, hubSCreditUserSecondLastName, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatlng, modelId, modelName, modelPrice, scheduleDate, scheduleTime, hubSCreditAmount, hubSCreditType, hubSpotIdDeveloper, appointmentNotes, response.hubSpotDealId, hubSWhatsappURL, response.leadId);
                } else if (response.result == 'error_AddingLead') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error al generar el Deal en HubSpot, favor de intentarlo nuevamente.</span>');
                    setTimeout(function () {
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);
                } else if (response.result == 'error_sendingUserSMS') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error al enviar el SMS al usuario, favor de verificar el número e intentarlo nuevamente.</span>');
                    setTimeout(function () {
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);
                } else if (response.result == 'invalidCarrier') {
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

function verifyCode(userId, userName, userLastName, userSecondLastName, userPhone, userMail, userCreditName, userCreditLastName, userCreditSecondLastName, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, price, scheduleDate, scheduleTime, budget, productName, hubSpotIdDeveloper, appointmentNotes, hubSpotDealId, userWhatsappURL, leadId) {
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
    codeValidationForm += '<input type="text" class="form-control" id="cvu" autocomplete="off" id="inputForCode">';
    codeValidationForm += '<span class="input-group-addon" style="cursor:pointer;background-color:#FFB71B;color:#FFFFFF;" title="Validar" id="codeVerification">';
    codeValidationForm += '<i class="fa fa-check"></i>';
    codeValidationForm += '</span>';

    codeValidationForm += '<input type="hidden" id="userIdCV" value="' + userId + '">';
    codeValidationForm += '<input type="hidden" id="userNameCV" value="' + userName + '">';
    codeValidationForm += '<input type="hidden" id="userLastNameCV" value="' + userLastName + '">';
    codeValidationForm += '<input type="hidden" id="userSecondLastNameCV" value="' + userSecondLastName + '">';
    codeValidationForm += '<input type="hidden" id="userPhoneCV" value="' + userPhone + '">';
    codeValidationForm += '<input type="hidden" id="userMailCV" value="' + userMail + '">';
    codeValidationForm += '<input type="hidden" id="userCreditNameCV" value="' + userCreditName + '">';
    codeValidationForm += '<input type="hidden" id="userCreditLastNameCV" value="' + userCreditLastName + '">';
    codeValidationForm += '<input type="hidden" id="userCreditSecondLastNameCV" value="' + userCreditSecondLastName + '">';

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
    codeValidationForm += '<input type="hidden" id="userHubSpotDealId" value="' + hubSpotDealId + '">';
    codeValidationForm += '<input type="hidden" id="userUserWhatsappURL" value="' + userWhatsappURL + '">';
    codeValidationForm += '<input type="hidden" id="userLeadId" value="' + leadId + '">';

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
    var userSecondLastName = $('#userSecondLastNameCV').val();
    var userPhone = $('#userPhoneCV').val();
    var userMail = $('#userMailCV').val();
    var userCreditName = $('#userCreditNameCV').val();
    var userCreditLastName = $('#userCreditLastNameCV').val();
    var userCreditSecondLastName = $('#userCreditSecondLastNameCV').val();
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
    var hubSpotDealId = $('#userHubSpotDealId').val();
    var userWhatsappURL = $('#userUserWhatsappURL').val();
    var leadId = $('#userLeadId').val();
    var regCode = /^\d{5}$/;
    if ($('#sendNotifications').is(':checked')) {
        var sendNotifications = 1;
    } else {
        var sendNotifications = 0;
    } 
    //console.log(userId, userName, userLastName, userPhone, userMail, userCreditName, userCreditLastName, developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, price, scheduleDate, scheduleTime, cvu, budget, productName, hubSpotIdDeveloper, appointmentNotes, hubSpotDealId, userWhatsappURL, filesInformation, leadId);
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

    if(filesInformation != null) {
        if (filesInformation.length == 0) {
            filesInformation = null;
        }
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
                userSecondLastName:userSecondLastName, //new
                userPhone:userPhone,
                userMail:userMail,
                userCreditName:userCreditName,
                userCreditLastName:userCreditLastName,
                userCreditSecondLastName:userCreditSecondLastName, //new
                developmentId:developmentId,
                developmentName:developmentName,
                developmentAddress:developmentAddress,
                developmentLatLng:developmentLatLng,
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
                hubSpotDealId:hubSpotDealId,
                userWhatsappURL:userWhatsappURL,
                leadId:leadId,
                visitsAllowed:visitsAllowed,
                attachments:filesInformation,
                sendNotifications:sendNotifications,
                providerId:providerId, 
                providerToken:providerToken, 
                providerStatus:providerStatus
            },
            url: "./php/appointmentData.php",
            dataType: 'json',
            success: function(response) {
                string = 'Confirmación por SMS al Usuario: ';
                if (response.smsUser == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Datos de la Ubicación por WhatsApp al Usuario: ';
                if (response.whatsAppMsgToUser == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Confirmación por SMS al Constructor: ';
                if (response.smsCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Confirmación por WhatsApp al Constructor: ';
                if (response.whatsAppMsgToCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Email al Constructor: ';
                if (response.mailCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
				 string += 'Emails Adicionales: ';
                if (response.additionalEmails == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Alta de la Nota en HubSpot: '
                if (response.hubSpotData == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Actualización del status: '
                if (response.updateDeal == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label>'; }
                if (response.result == 'success') {
                    hubSpotMailBody = response.hubSpotMailBody.replace(/"/g, '');
                    $("#codeVerification").css("pointer-events", "none");
                    $("#codeVerification").css("background-color", "#FFD06B");
                    $("#inputForCode").prop("disabled", true);
                    $('#appointmentTittle').html('La cita fue agendada exitosamente.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">¡Hemos agendado la cita con éxito!</div>'
                    responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
                    $("#scheduleAppointmentContainer").html(responseData);
                    $('#appointmentData').html(string);
                    $('#developmentNameTittle').html('Status del proceso');
                } else if (response.result == 'invalidCode') {
                    $("#codeVerificationResponse").html('<div style="color:#d9534f;font-weight:bold;">El código es inválido.</div>');
                } else {
                    hubSpotMailBody = response.hubSpotMailBody.replace(/"/g, '');
                    $("#codeVerification").css("pointer-events", "none");
                    $("#codeVerification").css("background-color", "#FFD06B");
                    $("#inputForCode").prop("disabled", true);
                    $('#appointmentTittle').html('Hubo errores.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">Hubo un error. Verificar el Log.</div>'
                    responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
                    $("#scheduleAppointmentContainer").html(responseData);
                    $('#appointmentData').html(string);
                    $('#developmentNameTittle').html('Status del proceso');
                }
            },
            error: function(err) {
				console.log(err);
                $("#codeVerificationResponse").html('<div style="color:#d9534f;font-weight:bold;">Hubo un error.</div>');
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
    var hubSpotMailRecipient = $(this).data("hubspotmailrecipient")
    var hubSpotMailCopyto = $(this).data("hubspotmailcopyto")
    var hubSpotMailSubject = $(this).data("hubspotmailsubject")
    var hubSpotMailBody = $(this).data("hubspotmailbody")
    var responseInfo = '<table style="width:100%">';
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Texto para enviar al Usuario</strong><br><br>';
    responseInfo += msgUser;
    responseInfo += '<br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgUser +'">Copiar</button>';
    responseInfo += '<br><br>Desarrollo ' + developmentName + ': ' + developmentShortUrl + '<br>';
    message = 'Desarrollo ' + developmentName + ': ' + developmentShortUrl + '\n';
    if (modelId != 0) {
        responseInfo += 'Modelo ' + modelName + ': ' + modelShortUrl + '<br>';
        message += 'Modelo ' + modelName + ': ' + modelShortUrl + '\n';
    }
    responseInfo += 'Dirección: ' + developmentAddress + '<br>';
    message += 'Dirección: ' + developmentAddress + '\n';
    responseInfo += 'Ubicación: ' + developmentLatLng + '<br>';
    message += 'Ubicación: ' + developmentLatLng + '\n';
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + message +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>';
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Datos para ser enviados por correo:</strong><br><br>';
    responseInfo += '<strong>Para: </strong>';
    responseInfo += hubSpotMailRecipient;
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailRecipient +'">Copiar</button><br>';
    if (hubSpotMailCopyto != '') {
        responseInfo += '<strong>CC: </strong>';
        responseInfo += hubSpotMailCopyto;
        responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailCopyto +'">Copiar</button><br>';
    }
    responseInfo += '<strong>Asunto: </strong>';
    responseInfo += hubSpotMailSubject;
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailSubject +'">Copiar</button><br>';
    responseInfo += '<br><strong>Mensaje:</strong><br><br>';
    responseInfo += hubSpotMailBody + '<br>';
    hubSpotMailBodyTxt = hubSpotMailBody.replace(/<\/br>/g, '\n');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<strong>/g, '');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<\/strong>/g, '');
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + hubSpotMailBodyTxt +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>';

    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<br><strong>Mensaje al Colaborador:</strong><br><br>';
    msgCollaborator1 = msgCollaborator.replace(/\n/g, "<br>"); 
    responseInfo += msgCollaborator1 + '<br>';
    msgCollaboratorTxt = msgCollaborator.replace(/<\/br>/g, '\n');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<strong>/g, '');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<\/strong>/g, '');    
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgCollaboratorTxt +'">Copiar</button>';
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
        yearRange: '2019:2022'
    });
    $('#datepickerAppointment').datepicker('show');
});

$(document).on("click", "#calendarDate", function(e) {
    e.preventDefault();
    $('#datepickerAppointment').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '2019:2022'
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

$(document).on("click", "#searchAppointments", function(e) {
    e.preventDefault();
    var keyword = $('#searchAppointmentInput').val();
    //var searchType = $('input[name=seachType]:checked').val();
    //console.log(keyword);
    if (keyword != '') {
        getScheduleAppointmentData(keyword, 1);
    }
});

$(document).on("keyup", "#searchAppointmentInput", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchAppointments").click();
    }
});

var appointmentScheduleData = [];
function getScheduleAppointmentData(keyword, qType) {
    form = '';
    actions = '';
    flag = 0;
    appointmentScheduleData = [];
    $("#appointmentsContainer").css("display", "block");
    $('#scheduleAppointmentInfo').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "POST",
        data: {type:"getScheduleAppointmentData", keyword:keyword, qType:qType},
        url: "./php/appointmentData.php",
        dataType: 'json',
        success: function(response) {
            //console.log(response);
            form += '<table class="table table-striped" style="width:100%">';
            form += '<thead><tr><th style="width:50px">&nbsp;</th><th style="white-space: nowrap;">HubSpot Id</th><th>Nombre</th><th>Apellidos</th><th>Teléfono</th><th>Desarrollo</th><th>Modelo</th><th style="width:150px">Día</th><th style="width:120px">Hora</th><th style="width:120px">Status</th></tr></thead>';
            $.each(response.appointmentData, function(index, appointmentData) {
                appointmentScheduleData.push({
                    "leadId": appointmentData.leadId,
                    "hubSpotContactId": appointmentData.hubSpotContactId,
                    "developmentId": appointmentData.developmentId,
                    "developmentName": appointmentData.developmentName,
                    "developmentStreet": appointmentData.developmentStreet,
                    "developmentExtNumber": appointmentData.developmentExtNumber,
                    "developmentLocality": appointmentData.developmentLocality,
                    "developmentState": appointmentData.developmentState,
                    "developmentPostalCode": appointmentData.developmentPostalCode,
                    "developmentLatitude": appointmentData.developmentLatitude,
                    "developmentLongitude": appointmentData.developmentLongitude,
                    "modelId": appointmentData.modelId,
                    "modelName": appointmentData.modelName,
                    "price": appointmentData.price,
                    "scheduleDate": appointmentData.scheduleDate,
                    "scheduleTime": appointmentData.scheduleTime,
                    "cvs": appointmentData.cvs,
                    "budget": appointmentData.budget,
                    "productName": appointmentData.productName,
                    "hubSpotIdDeveloper": appointmentData.hubSpotIdDeveloper,
                    "appointmentNotes": appointmentData.appointmentNotes,
                    "hubSpotDealId": appointmentData.hubSpotDealId,
                    "hubSpotOwnerId": appointmentData.hubSpotOwnerId,
                    "leadFlagId": appointmentData.leadFlagId,
                    "hubSCreditUserName": appointmentData.hubSCreditUserName,
                    "hubSCreditUserLastName": appointmentData.hubSCreditUserLastName,
                    "hubSCreditUserSecondLastName": appointmentData.hubSCreditUserSecondLastName,
                    "hubUserPhone": appointmentData.hubUserPhone,
                    "hubUserMail": appointmentData.hubUserMail,
                    "userId": appointmentData.userId,
                    "developmentShortUrl": appointmentData.developmentShortUrl,
                    "modelShortUrl": appointmentData.modelShortUrl,
                    "attachment": appointmentData.attachment,
                    "visitsAllowed": appointmentData.visitsAllowed,
                    "developerId": appointmentData.developerId
                });
                if (appointmentData.leadFlagId == 7) {
                    appointmentStatus = '<label style="color:green;font-weight:bold">Agendada</label>';
                } else {
                    appointmentStatus = '<label style="font-weight:bold">Pendiente</label>';
                }
                form += '<tr>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + appointmentData.leadId  + '" data-developerid="' + appointmentData.developerId  + '" data-hubspotcontact="' + appointmentData.hubSpotContactId  + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>'
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.hubSpotContactId;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.hubSCreditUserName;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.hubSCreditUserLastName;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.hubUserPhone;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.developmentName;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.modelName;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.scheduleDate;
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentData.scheduleTime.substring(0,5);
                form += '</td>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += appointmentStatus;
                form += '</td>';
                form += '</tr>';
            });
            form += '</table>';
            $('#scheduleAppointmentInfo').html(form);
        }
    });
}

$(document).on("click", ".showDetail", function(e) {
    e.preventDefault();
    var leadId = $(this).attr('name');
    var hubSpotContactId = $(this).attr('data-hubspotcontact');
    var developerId = $(this).attr('data-developerid');
    var string = '';
    filesInformation = [];
    //console.log(leadId, hubSpotContactId);
    $.ajax({
        type: "POST",
        data: {type:"getUserData", keyword:hubSpotContactId, developerId:developerId},
        url: "./php/appointmentData.php",
        dataType: 'json',
        success: function(response) {
            //console.log(response);
            hubSName = response.name;
            hubSLastName = response.lastName;
            $.each(appointmentScheduleData, function(index, data) {
                if (data.leadId == leadId) {
                    cvs = data.cvs; // cvs
                    hubSContactId = hubSpotContactId;
                    userId = data.userId; // userId
                    hubSName = response.name; // userName
                    hubSLastName = response.lastName; // userLastName
                    hubSSecondLastName = response.secondLastName, // userSecondLastName
                    hubSPhone = data.hubUserPhone; // userPhone
                    hubSMail = data.hubUserMail; // userMail
                    hubSCreditUserName = data.hubSCreditUserName; // userCreditName
                    hubSCreditUserLastName = data.hubSCreditUserLastName; // userCreditLastName
                    hubSCreditUserSecondLastName = data.hubSCreditUserSecondLastName; // userCreditSecondLastName
                    developmentId = data.developmentId;// developmentId
                    developmentName = data.developmentName; // developmentName
                    developmentLocality = data.developmentLocality; // developmentLocality
                    developmentState = data.developmentState;// developmentState
                    developmentAddress = data.developmentStreet.trim();
                    if ((data.developmentExtNumber == '') || (data.developmentExtNumber == null) || (data.developmentExtNumber == 's/n') || (data.developmentExtNumber == 'S/N')) {
                        developmentAddress += ', s/n. ';
                    } else {
                        developmentAddress += ', No. ' + data.developmentExtNumber.trim() + '. ';
                    }
                    developmentAddress += data.developmentLocality + ', ' + data.developmentState + '.';
                    if (data.developmentPostalCode != '') {
                        developmentAddress += ' C.P. ' + data.developmentPostalCode + '.';
                    }
                    developmentLatLng = 'https://www.google.com/maps/?q=' + data.developmentLatitude + ',' + data.developmentLongitude;
                    developmentShortUrl = data.developmentShortUrl;
                    modelShortUrl = data.modelShortUrl;
                    modelId = data.modelId; // var modelId
                    modelName = data.modelName; //var modelName
                    modelPrice = data.price; //var price
                    scheduleDateG = data.scheduleDate; // scheduleDate
                    scheduleTimeG = data.scheduleTime.substring(0,5); // scheduleTime
                    appointmentNotesG = data.appointmentNotes; // appointmentNotes
                    hubSCreditAmount = data.budget; //budget
                    hubSCreditType = data.productName; // productName
                    hubSpotIdDeveloper = data.hubSpotIdDeveloper; // hubSpotIdDeveloper  hubSpotDealId
                    hubSpotDealIdG = data.hubSpotDealId; //hubSpotDealId
                    hubSWhatsappURL = null; // userWhatsappURL
                    leadIdG = data.leadId; // leadId
                    visitsAllowed = data.visitsAllowed;
                    providerId = response.providerId;
                    providerToken = response.providerToken;
                    providerStatus = response.providerStatus;
                    string += '<div class="row" style="padding-top:12px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-12">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">HubSpot Contact Id:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.hubSpotContactId+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="row" style="padding-top:12px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Desarrollo:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.developmentName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Modelo:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.modelName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-12">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Modelo:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.price+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="row" style="padding-top:12px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Nombre del contacto:&nbsp;&nbsp;</label>';
                    string += '<label>'+hubSName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Apellido del contacto:&nbsp;&nbsp;</label>';
                    string += '<label id="userLastNameApp">'+hubSLastName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Teléfono:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.hubUserPhone+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Email:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.hubUserMail+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Nombre del acreditado:&nbsp;&nbsp;</label>';
                    string += '<labe>'+data.hubSCreditUserName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Apellido del acreditado:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.hubSCreditUserLastName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Producto:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.productName+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Presupuesto:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.budget+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="row" style="padding-top:12px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Fecha de Cita:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.scheduleDate+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Hora de Cita:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.scheduleTime.substring(0,5) +' hrs.</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-12">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Nota:&nbsp;&nbsp;</label>';
                    string += '<label>'+data.appointmentNotes+'</label>';
                    string += '</div>';
                    string += '</div>';
                    string += '<div class="col-xs-12 col-sm-12 col-lg-12">';
                    string += '<div class="form-group">';
                    string += '<label style="font-weight: bold;">Attachments:&nbsp;&nbsp;</label>';
                    string += '<label>&nbsp;</label>';
                    string += '</div>';
                    string += '</div>';
                    currentDate = new Date();
                    scheduleDateArr = data.scheduleDate.split("-");
                    scheduleTimeArr = data.scheduleTime.substring(0,5).split(":");
                    formatedDate = new Date(scheduleDateArr[0], parseInt(scheduleDateArr[1])-1, scheduleDateArr[2], scheduleTimeArr[0], scheduleTimeArr[1]);
                    if ((data.leadFlagId == 12) && (currentDate < formatedDate)) {
                        string += '<div class="col-xs-12 col-sm-12 col-lg-12" style="text-align:center">';
                        string += '<div class="form-group">';
                        string += '<div class="col-md-12" id="filesname" style="padding-bottom:8px">';
                        string += '</div>';
                        string += '<form enctype="multipart/form-data" action="#" method="post" style="padding-top:0px;margin-top:0px">';
                        string += '<label for="imgInput" class="btn custom-file" style="width:100%;height:40px;background-color:#FFB71B;color:#FFFFFF">';
                        string += '<i class="fa fa-upload"></i>&nbsp;&nbsp;Agregar archivos';
                        string += '</label>';
                        string += '<input id="imgInput" name="files" type="file" multiple/>';
                        string += '</form>';
                        string += '</div>';
                        string += '</div>';
                    }
                    string += '</div>';
                    if ((data.leadFlagId == 12) && (currentDate < formatedDate)) {
                        string += '<div class="row" style="padding-top:12px;text-align:center" id="scheduleAppointmentResponse2">';
                        string += '<div class="form-inline col-xs-12 col-sm-12 col-lg-12">';
                        string += '<div class="form-group">';
                        string += '<label style="font-weight: bold;">Código de confirmación:&nbsp;&nbsp;</label>';
                        string += '<input type="text" class="form-control input-sm" id="cvuSA" style="width:80px">';
                        string += '</div>';
                        string += '</div>';
                        string += '<div class="form-inline col-xs-12 col-sm-12 col-lg-12">';
                        string += '<div class="form-group" style="padding-top:8px">';
                        string += '<button class="btn btn-primary btn-sm" style="width:150px;background-color:#FFB71B;color:#FFFFFF" id="codeVerification2">Confirmar Cita</button>';
                        string += '&nbsp;&nbsp;<button class="btn btn-primary btn-sm" style="width:150px;background-color:#3F729B;color:#FFFFFF" id="sendCode">Reenviar Código</button>';
                        string += '</div>';
                        string += '</div>';
                        string += '<div class="col-xs-12 col-sm-12 col-lg-12" style="padding-top:8px;>';
                        string += '<div class="form-group" id="scheduleAppoinmentMsgResponse"></div>';
                        string += '</div>';
                        string += '</div>';
                    }
                    $('#appointmentModalBody').html(string);
                    $.ajax({
                        type: "POST",
                        data: {type:"getAttachmentData", leadId:leadId},
                        url: "./php/appointmentData.php",
                        dataType: 'json',
                        success: function(responseFile) {
                            if (responseFile.attachmentFile.length != 0) {
                                $.each(responseFile.attachmentFile, function(index, attachment) {
                                    readImage(fileNum, attachment.fileName, './uploadedFiles/' + attachment.fileName, function(base64) {
                                    });
                                    fileNum++;
                                });
                            } else {
                                stringAttachment = null;
                            }
                        }
                    });
                }
            });
        }
    });
    $('#openAppointmentDetailModal').click();
});

$(document).on("click", "#sendCode", function(e) {
    e.preventDefault();
    //console.log(userId, hubSName, hubSLastName, hubSPhone, cvs);
    $.ajax({
        type: "POST",
        data: {type:"sendUserCode", userId:userId, name:hubSName, lastName:hubSLastName, phone:hubSPhone, cvs:cvs, hubSContactId:hubSContactId},
        url: "./php/appointmentData.php",
        dataType: 'json',
        success: function(response) {
            //console.log(response);
            if (response.result == 'success') {
                $('#scheduleAppoinmentMsgResponse').html('El mensaje se envió con éxito');
            } else {
                $('#scheduleAppoinmentMsgResponse').html('Hubo un error.<br>' + response.result);
            }
        }
    });
});

$(document).on("click", "#codeVerification2", function(e) {
    e.preventDefault();
    var flag = 0;
    var cvu = $('#cvuSA').val();
    var regCode = /^\d{5}$/;
    sendNotifications = 1;
    //console.log(hubSContactId, hubSName, hubSLastName, hubSPhone, hubSMail, hubSCreditUserName, hubSCreditUserLastName);
    //console.log(developmentId, developmentName, developmentLocality, developmentState, developmentAddress, developmentLatLng, modelId, modelName, modelPrice);
    //console.log(cvu, hubSCreditAmount, hubSCreditType, hubSpotIdDeveloper, hubSpotDealIdG, hubSWhatsappURL, leadIdG);
    //console.log(scheduleDateG, scheduleTimeG, appointmentNotesG);
    if (regCode.test(cvu)) {
        if ($("#cvu").closest('.input-group').hasClass('has-error')) {
            $("#cvu").closest('.input-group').removeClass('has-error');
            $("#scheduleAppoinmentMsgResponse").html('');
        }
    } else {
        if (!$("#cvu").closest('.input-group').hasClass('has-error')) {
            $("#cvu").closest('.input-group').addClass('has-error');
            $("#scheduleAppoinmentMsgResponse").html('<label class="error text-danger" style="font-size:12px;text-align:center">&nbsp;&nbsp;Código Inválido.</label>');
        }
        flag++;
    }

    if(filesInformation != null) {
        if (filesInformation.length == 0) {
            filesInformation = null;
        }
    }

    if (flag == 0) {
        $("#scheduleAppoinmentMsgResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;padding-top:6px;'>");
        $.ajax({
            type: "POST",
            data: {
                type:"codeVerification",
                userId:hubSContactId,
                userName:hubSName,
                userLastName:hubSLastName,
                userSecondLastName:hubSSecondLastName, //new
                userPhone:hubSPhone,
                userMail:hubSMail,
                userCreditName:hubSCreditUserName,
                userCreditLastName:hubSCreditUserLastName,
                userCreditSecondLastName:hubSCreditUserSecondLastName, //new
                developmentId:developmentId,
                developmentName:developmentName,
                developmentAddress:developmentAddress,
                developmentLatLng:developmentLatLng,
                modelId:modelId,
                modelName:modelName,
                price:modelPrice,
                scheduleDate:scheduleDateG,
                scheduleTime:scheduleTimeG,
                cvu:cvu,
                budget:hubSCreditAmount,
                product:hubSCreditType,
                developmentLocality:developmentLocality,
                developmentState:developmentState,
                hubSpotIdDeveloper:hubSpotIdDeveloper,
                appointmentNotes:appointmentNotesG,
                hubSpotDealId:hubSpotDealIdG,
                userWhatsappURL:hubSWhatsappURL,
                leadId:leadIdG,
                visitsAllowed:visitsAllowed, //new
                attachments:filesInformation,
                sendNotifications:sendNotifications,
                providerId:providerId,
                providerToken:providerToken,
                providerStatus:providerStatus
            },
            url: "./php/appointmentData.php",
            dataType: 'json',
            success: function(response) {
                //console.log(response.hubSpotMailBody);
                hubSpotMailBody = response.hubSpotMailBody.toString().replace(/"/g, '');
                string = 'Confirmación por SMS al Usuario: ';
                if (response.smsUser == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Datos de la Ubicación por WhatsApp al Usuario: ';
                if (response.whatsAppMsgToUser == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Confirmación por SMS al Constructor: ';
                if (response.smsCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Confirmación por WhatsApp al Constructor: ';
                if (response.whatsAppMsgToCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Email al Constructor: ';
                if (response.mailCollaborator == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
				 string += 'Emails Adicionales: ';
                if (response.additionalEmails == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Alta de la Nota en HubSpot: '
                if (response.hubSpotData == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label><br>'; }
                string += 'Actualización del status: '
                if (response.updateDeal == true) { string += '<label style="color:#d9534f">Error</label><br>'; } else { string += '<label style="color:green">Ok</label>'; }
                if (response.result == 'success') {
                   $('#appointmentTittle').html('La cita fue agendada exitosamente.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">¡Hemos agendado la cita con éxito!</div>'
                    responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse2" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
                    $("#scheduleAppointmentResponse2").html(responseData + '<br> ' + string);
                    //$('#developmentNameTittle').html('Status del proceso');
                    getScheduleAppointmentData(null, 0);
                } else if (response.result == 'invalidCode') {
                    $("#scheduleAppoinmentMsgResponse").html('<div style="color:#d9534f;font-weight:bold;">El código es inválido.</div>');
                    getScheduleAppointmentData(null, 0);
                } else {
                    $('#appointmentTittle').html('Hubo errores.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">Hubo un error. Verificar el Log.</div>'
                    responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse2" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
                    $("#scheduleAppointmentResponse2").html(responseData + '<br> ' + string);
                    $('#appointmentData').html(string);
                    //$('#developmentNameTittle').html('Status del proceso');
                    getScheduleAppointmentData(null, 0);
                }
            },
            error: function(err) {
                console.log(err);
                getScheduleAppointmentData(null, 0);
                $("#scheduleAppoinmentMsgResponse").html('<div style="color:#d9534f;font-weight:bold;">Hubo un error.</div>');
            }
        });
    }
});

$(document).on("click", "#showResponse2", function(e) {
    var developmentId = $(this).data("developmentid");
    var developmentName = $(this).data("developmentname");
    var modelId = $(this).data("modelid");
    var modelName = $(this).data("modelname");
    var developmentAddress = $(this).data("developmentaddress");
    var developmentLatLng = $(this).data("developmentlatlng");
    var msgCollaborator = $(this).data("msgcollaborator");
    var msgUser = $(this).data("msguser");
    var collaboratorName = $(this).data("collaboratorname");
    var collaboratorPhone = $(this).data("collaboratorphone");
    var collaboratorMail = $(this).data("collaboratormail");
    var appointmentdatetime = $(this).data("appointmentdatetime");
    var hubSpotMailRecipient = $(this).data("hubspotmailrecipient");
    var hubSpotMailCopyto = $(this).data("hubspotmailcopyto");
    var hubSpotMailSubject = $(this).data("hubspotmailsubject");
    var hubSpotMailBody = $(this).data("hubspotmailbody");
    var responseInfo = '<table style="width:100%">';
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Texto para enviar al Usuario</strong><br><br>';
    responseInfo += msgUser;
    responseInfo += '<br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgUser +'">Copiar</button>';
    responseInfo += '<br><br>Desarrollo ' + developmentName + ': ' + developmentShortUrl + '<br>';
    message = 'Desarrollo ' + developmentName + ': ' + developmentShortUrl + '\n';
    if (modelId != 0) {
        responseInfo += 'Modelo ' + modelName + ': ' + modelShortUrl + '<br>';
        message += 'Modelo ' + modelName + ': ' + modelShortUrl + '\n';
    }
    responseInfo += 'Dirección: ' + developmentAddress + '<br>';
    message += 'Dirección: ' + developmentAddress + '\n';
    responseInfo += 'Ubicación: ' + developmentLatLng + '<br>';
    message += 'Ubicación: ' + developmentLatLng + '\n';
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + message +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>';
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Datos para ser enviados por correo:</strong><br><br>';
    responseInfo += '<strong>Para: </strong>';
    responseInfo += hubSpotMailRecipient;
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailRecipient +'">Copiar</button><br>';
    if (hubSpotMailCopyto != '') {
        responseInfo += '<strong>CC: </strong>';
        responseInfo += hubSpotMailCopyto;
        responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailCopyto +'">Copiar</button><br>';
    }
    responseInfo += '<strong>Asunto: </strong>';
    responseInfo += hubSpotMailSubject;
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;" name="' + hubSpotMailSubject +'">Copiar</button><br>';
    responseInfo += '<br><strong>Mensaje:</strong><br><br>';
    responseInfo += hubSpotMailBody + '<br>';
    hubSpotMailBodyTxt = hubSpotMailBody.replace(/<\/br>/g, '\n');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<strong>/g, '');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<\/strong>/g, '');
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + hubSpotMailBodyTxt +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>';

    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<br><strong>Mensaje al Colaborador:</strong><br><br>';
    msgCollaborator1 = msgCollaborator.replace(/\n/g, "<br>"); 
    responseInfo += msgCollaborator1 + '<br>';
    msgCollaboratorTxt = msgCollaborator.replace(/<\/br>/g, '\n');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<strong>/g, '');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<\/strong>/g, '');    
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgCollaboratorTxt +'">Copiar</button>';
    responseInfo += '</td>';
    responseInfo += '</tr>';

    responseInfo += '</table>';
    $("#appointmentModalBody").html(responseInfo);
});