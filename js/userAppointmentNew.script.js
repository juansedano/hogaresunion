/*v=2.2.1 13:00 10/February/2023*/
//http://localhost/smarto/tratodirecto/dev/desarrolladores/appointment.php?developmentId=468&developmentName=Aldaba%20Residencial&developmentAddress=Aldaba%20de%20Corralejo,%20No.%20121.%20Le%C3%B3n,%20Guanajuato.%20C.P.%2037297.&developmentLatLng=https://www.google.com/maps/?q=21.1145081,-101.624654&modelId=0&modelName=0&assetType=development&price=0

var developmentId = 0;
var modelId = 0;
var hubspotId = 0;
var cvs = "";
var userId = 0;

var providerId = '0';
var providerToken = '0';
var providerStatus = '0';	

var assetType = "";
var developerId = "";
var developmentName = "";
var developmentAddress = "";
var developmentLocality = "";
var developmentState = "";
var developmentLatlng = "";
var developmentShortUrl = ""
var modelName = "";
var modelPrice = 0;
var modelMinId = null;
var modelMinName = null;
var modelMinPrice = null;
var modelMinShortUrl = null;
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
var hubSCreditUserAmount = "";
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
    getProductInfo();
    getCoordinator();
    jQuery("#datepickerAppointment").mask("99/99/9999");
    if (latlng == 0) {
        latlng = getLatlng();
    }
    developmentId = $('#developmentIdForSchedule').val();
    modelId = $('#modelIdForSchedule').val();
    hubspotId = parseInt($('#hubspotIdForSchedule').val());

    if (developmentId != undefined) {
        getAppointmentData();
    }
    randomNum = Math.floor(Math.random() * 999);
    if (randomNum.toString().length == 1) {
        randomNum = '00' + randomNum.toString() + '_';
    } else if (randomNum.toString().length == 2) {
        randomNum = '0' + randomNum.toString() + '_';
    } else {
        randomNum = randomNum.toString() + '_';
    }
});

function getCoordinator() {
    $.ajax({
        type: "POST",
        async: false,  
        data: {type:"getCoodinatorInfo"},
        url: "./php/appointmentDataNew.php?var=getCoodinatorInfo",
        dataType: 'json',
        success: function(response) {
            $.each(response, function(index, coodinator) {
                $("#coordinatorId").append('<option value="'+coodinator.id+'">'+coodinator.name+'</option>');   
            });
        }
    });
}

function readImage(num, filename, url, callback) {
    var request = new XMLHttpRequest();
    request.onload = function() {
       var file = new FileReader();
       file.onloadend = function() {
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

var paymentMethods = [];
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
            url: "./php/appointmentDataNew.php",
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
                    developerId =  data.developerId;
                    developmentLatlng = 'https://www.google.com/maps/?q=' + data.latitude + ',' + data.longitude;
                    developmentName = data.developmentName;
                    developmentLocality = data.locality;
                    developmentState = data.state;
                    hubSpotIdDeveloper = data.hubSpotId;
                    developmentShortUrl = data.developmentShortUrl;
                    modelShortUrl = data.modelShortUrl;
                    var modelMinPriceData = data.modelMinData;
                    modelMinPriceData = modelMinPriceData.split("|");
                    modelMinId = modelMinPriceData[0];
                    modelMinName = modelMinPriceData[1];
                    modelMinPrice = modelMinPriceData[2];
                    modelMinShortUrl = modelMinPriceData[3];
                    if (data.paymentMethods == null) {
                        paymentMethodsArray = null;
                    } else {
                        paymentMethodsArray = data.paymentMethods.split(',');
                        $.each(paymentMethodsArray, function(index, method) {
                            paymentMethods.push(method.trim());
                        });
                    }

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
                    $("#coordinatorId").prop("disabled", false); 
                    $(".searchAccredited").css('background-color', '#fff');  
                }
                if (hubspotId != 0) {
                    $("#searchInput").val(hubspotId);
                    $("#searchContacts").click();
                }
            },
            error: function(response) {
                $('#appointmentData').html('<span style="color:red">No hay información</span>');
                $("#searchInput").prop("disabled", true);
            }
        });
    }
}

$(document).on("change", "#accreditedOption", function(e) {
        e.preventDefault();
    var keyword = $('#searchInput').val();
    if (keyword != '') {
        $("#contactsContainer").css("display", "block");
        getContactsBySearchBox(keyword);
    }
});

var producstInfo = [];
function getProductInfo() {
    $.ajax({
        type: "POST",
        async: false,  
        data: {type:"getProductInfo"},
        url: "./php/appointmentDataNew.php?var=getProductInfo",
        dataType: 'json',
        success: function(response) {
            $.each(response.product, function(index, data) {
                producstInfo.push({
                    "id": data.id,
                    "type": data.type,
                    "name": data.name
                });
            });
        }
    });
}

var accredited1 = 1; 
var accredited2 = 2;
var contactDataObject = [];
var accreditedDataObject_01 = [];
var accreditedDataObject_02 = [];
var appointmentDataObject = [];
function getContactsBySearchBox(keyword) {
    var string = '';
    var flag = 0;
    var regBudget = /^\$?(([1-9]\d{0,2}(,\d{3})*)|(([1-9]\d*)?\d))(\.\d{1,2})?$/;
    var regPhone = /^\+\d{8,13}$/;
    accreditedDataObject_01 = [];
    accreditedDataObject_02 = [];
    appointmentDataObject = [];
    $("#hubSpotDataContainer").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px; padding-bottom:10px;padding-top:20px;'>");
    $("#scheduleAppointment").prop("disabled", false);
    $.ajax({  
        type: "POST",
        data: {type:"getUserData", keyword:keyword, developerId:developerId},
        url: "./php/appointmentDataNew.php?var=getUserData",
        dataType: 'json',
        success: function(response) {
            if (response.status == "success") {
                providerId = response.providerId;
                providerToken = response.providerToken;
                providerStatus = response.providerStatus;

                if (response.name != null) {
                    var accreditedOption = $('#accreditedOption').val();
                    var errorTxt = '<span style="font-weight:bold;color:red;">Error</span>';
                    //var warning = '<span style="font-weight:bold;color:#FF8800;">Sin información</span>';
                    //var warningAmount = '<span style="font-weight:bold;color:red;">Error</span>';
                    if (visitsAllowed == 0) {
                        $('#visitsAllowedInput').prop('disabled', false);
                        $('#visitsAllowedIcon').css('background-color', '#fff')
                    }
                    contactHubSpotId = keyword;
                    if (response.name == null || response.name == "") { contactName = errorTxt; flag++; } else { contactName = response.name; }
                    if (response.lastName == null || response.lastName == "") { contactLastName = errorTxt; flag++; } else { contactLastName = response.lastName; }
                    //if (response.secondLastName == null || response.secondLastName == "") { contactSecondLastName = errorTxt; flag++; } else { contactSecondLastName = response.secondLastName; }
                    if (response.phone == null || response.phone == "") { contactPhone = errorTxt; flag++; } else { contactPhone = response.phone; }
                    if (response.email == null || response.email == "") { contactMail = null; } else { contactMail = response.email; }
                    if (response.creditType == null || response.creditType == "") { accreditedProduct_01 = null; } else { accreditedProduct_01 = response.creditType; }
                    if (response.creditAmount == null || response.creditAmount == "") { accreditedBudget_01 = null; } else { accreditedBudget_01 = response.creditAmount; }
                    contactDataObject = {
                        "contactHubSpotId": keyword,
                        "contactName": contactName,
                        "contactLastName": contactLastName,
                        "contactSecondLastName": response.secondLastName,
                        "contactPhone": contactPhone,
                        "contactMail": contactMail
                    };
                    string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                    string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Contacto</strong></label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + contactName + '</label></div>';
                    //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + contactPhone + '</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + contactLastName + '</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + contactMail + '</label></div>';
                    string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.secondLastName + '</label></div>';
                    string += '</div>';
                    if (accreditedOption == 1) {
                        if (response.creditUserName == null || response.creditUserName == "") { accreditedName_01 = errorTxt; flag++; } else { accreditedName_01 = response.creditUserName; }
                        if (response.creditUserLastName == null || response.creditUserLastName == "") { accreditedLastName_01 = errorTxt; flag++; } else { accreditedLastName_01 = response.creditUserLastName; }
                        //if (response.creditUserSecondLastName == null || response.creditUserSecondLastName == "") { accreditedSecondLastName_01 = errorTxt; flag++; } else { accreditedSecondLastName_01 = response.creditUserSecondLastName; }
                        if (response.userPhone == null || response.userPhone == "") { accreditedPhone_01 = errorTxt; flag++; } else { accreditedPhone_01 = response.userPhone; }
                        if (response.userEmail == null || response.userEmail == "") { accreditedMail_01 = null; } else { accreditedMail_01 = response.userEmail; }
                        if (response.creditType == null || response.creditType == "") { accreditedProduct_01 = errorTxt; flag++; } else { accreditedProduct_01 = response.creditType; }
                        if (response.creditAmount == null || response.creditAmount == "") { accreditedBudget_01 = errorTxt; flag++; } else { accreditedBudget_01 = response.creditAmount; }

                        $.each(producstInfo, function(index, product) {
                            if (product.name == accreditedProduct_01) {
                                appointmentProductId = product.id;
                                appointmentProductType = product.type;
                            }
                        });

                        if (appointmentProductType == 'Infonavit') {
                            //if (response.nss == null || response.nss == "") { accreditedNSS_01 = errorTxt; flag++; } else { accreditedNSS_01 = response.nss; }
                            //if (response.dob == null || response.dob == "") { accreditedDoB_01 = errorTxt; flag++; } else { accreditedDoB_01 = response.dob; }
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' +response.nss + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + response.dob + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_01,
                                "accreditedLastName": accreditedLastName_01,
                                "accreditedSecondLastName": response.creditUserSecondLastName,
                                "accreditedPhone": accreditedPhone_01,
                                "accreditedMail": accreditedMail_01,
                                "accreditedNSS": response.nss,                              
                                "accreditedDoB": response.dob,
                                "accreditedCURP": response.curp,
                                "accreditedProduct": accreditedProduct_01,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_01,
                            };
                        } else if (appointmentProductType == 'Fovissste') {
                            //if (response.curp == null || response.curp == "") { accreditedCURP_01 = errorTxt; flag++; } else { accreditedCURP_01 = response.curp; }
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + response.curp + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_01,
                                "accreditedLastName": accreditedLastName_01,
                                "accreditedSecondLastName": response.creditUserSecondLastName,
                                "accreditedPhone": accreditedPhone_01,
                                "accreditedMail": accreditedMail_01,
                                "accreditedNSS": response.nss,                              
                                "accreditedDoB": response.dob,
                                "accreditedCURP": response.curp,
                                "accreditedProduct": accreditedProduct_01,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_01,
                            };                            
                        } else if (appointmentProductType == 'Bancario' || appointmentProductType == 'Directo' || appointmentProductType == 'Contado' || appointmentProductType == 'Otro') {
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_01,
                                "accreditedLastName": accreditedLastName_01,
                                "accreditedSecondLastName": response.creditUserSecondLastName,
                                "accreditedPhone": accreditedPhone_01,
                                "accreditedMail": accreditedMail_01,
                                "accreditedNSS": response.nss,                              
                                "accreditedDoB": response.dob,
                                "accreditedCURP": response.curp,
                                "accreditedProduct": accreditedProduct_01,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_01,
                            };                               
                        } else {
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelData"><strong>Producto Inválido</strong></label></div>';
                            string += '</div>';
                            flag++;
                        }
                        accreditedDataObject_02 = {
                            "accreditedName": null,
                            "accreditedLastName": null,
                            "accreditedSecondLastName": null,
                            "accreditedPhone": null,
                            "accreditedMail": null,
                            "accreditedNSS": null,                              
                            "accreditedDoB": null,
                            "accreditedCURP": null,
                            "accreditedProduct": null,
                            "accreditedProductId": null,
                            "accreditedBudget": null,
                        };  
                        appointmentDataObject = {
                            "contactHubSpotId": contactHubSpotId,
                            "numberOfAccredited": 1,
                            "appointmentProduct": accreditedProduct_01,
                            "appointmentProductId": appointmentProductId,
                            "appointmentBudget": accreditedBudget_01,
                            "developerId": developerId,
                            "developmentId": developmentId,
                            "developmentName": developmentName,
                            "developmentAddress": developmentAddress,
                            "developmentLatlng": developmentLatlng,
                            "developmentLocality": developmentLocality,
                            "developmentState": developmentState,
                            "developerHubSpotId": hubSpotIdDeveloper,
                            "developmentShortUrl": developmentShortUrl,
                            "modelId": modelId,
                            "modelName": modelName,
                            "modelPrice": modelPrice,
                            "modelShortUrl": modelShortUrl,
                            "modelMinId": modelMinId,
                            "modelMinName": modelMinName,
                            "modelMinPrice": modelMinPrice,
                            "modelMinShortUrl": modelMinShortUrl
                        };
                    } else if (accreditedOption == 2) {
                        if (response.partnerName == null || response.partnerName == "") { accreditedName_02 = errorTxt; flag++; } else { accreditedName_02 = response.partnerName; }
                        if (response.partnerLastName == null || response.partnerLastName == "") { accreditedLastName_02 = errorTxt; flag++; } else { accreditedLastName_02 = response.partnerLastName; }
                        //if (response.partnerSecondLastName == null || response.partnerSecondLastName == "") { accreditedSecondLastName_02 = errorTxt; flag++; } else { accreditedSecondLastName_02 = response.partnerSecondLastName; }
                        if (response.partnerPhone == null || response.partnerPhone == "") { accreditedPhone_02 = errorTxt; flag++; } else { accreditedPhone_02 = response.partnerPhone; }
                        if (response.partnerEmail == null || response.partnerEmail == "") { accreditedMail_02 = null; } else { accreditedMail_02 = response.partnerEmail; }
                        if (response.partnerCreditType == null || response.partnerCreditType == "") { accreditedProduct_02 = errorTxt; flag++; } else { accreditedProduct_02 = response.partnerCreditType; }
                        if (response.partnerCreditAmount == null || response.partnerCreditAmount == "") { accreditedBudget_02 = errorTxt; flag++; } else { accreditedBudget_02 = response.partnerCreditAmount; }

                        $.each(producstInfo, function(index, product) {
                            if (product.name == accreditedProduct_02) {
                                appointmentProductId = product.id;
                                appointmentProductType = product.type;
                            }
                        });
                        if (appointmentProductType == 'Infonavit') {
                            //if (response.partnerNss == null || response.partnerNss == "") { accreditedNSS_02 = errorTxt; flag++; } else { accreditedNSS_02 = response.partnerNss; }
                            //if (response.partnerDob == null || response.partnerDob == "") { accreditedDoB_02 = errorTxt; flag++; } else { accreditedDoB_02 = response.partnerDob; }
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + response.partnerSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' + response.partnerNss + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + response.partnerDob + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_02,
                                "accreditedLastName": accreditedLastName_02,
                                "accreditedSecondLastName": response.partnerSecondLastName,
                                "accreditedPhone": accreditedPhone_02,
                                "accreditedMail": accreditedMail_02,
                                "accreditedNSS": response.partnerNss,                              
                                "accreditedDoB": response.partnerDob,
                                "accreditedCURP": response.partnerCurp,
                                "accreditedProduct": accreditedProduct_02,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_02,
                            };
                        } else if (appointmentProductType == 'Fovissste') {
                            //if (response.partnerCurp == null || response.partnerCurp == "") { accreditedCURP_02 = errorTxt; flag++; } else { accreditedCURP_02 = response.partnerCurp; }
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.partnerSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + response.partnerCurp + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_02,
                                "accreditedLastName": accreditedLastName_02,
                                "accreditedSecondLastName": response.partnerSecondLastName,
                                "accreditedPhone": accreditedPhone_02,
                                "accreditedMail": accreditedMail_02,
                                "accreditedNSS": response.partnerNss,                              
                                "accreditedDoB": response.partnerDob,
                                "accreditedCURP": response.partnerCurp,
                                "accreditedProduct": accreditedProduct_02,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_02,
                            };                             
                        } else if (appointmentProductType == 'Bancario' || appointmentProductType == 'Directo' || appointmentProductType == 'Contado' || appointmentProductType == 'Otro') {
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                            //string += '<div class="col-sm-6"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                            string += '<div class="col-sm-6"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.partnerSecondLastName + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_02,
                                "accreditedLastName": accreditedLastName_02,
                                "accreditedSecondLastName": response.partnerSecondLastName,
                                "accreditedPhone": accreditedPhone_02,
                                "accreditedMail": accreditedMail_02,
                                "accreditedNSS": response.partnerNss,                              
                                "accreditedDoB": response.partnerDob,
                                "accreditedCURP": response.partnerCurp,
                                "accreditedProduct": accreditedProduct_02,
                                "accreditedProductId": appointmentProductId,
                                "accreditedBudget": accreditedBudget_02,
                            };                               
                        } else {
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-12"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelData"><strong>Producto Inválido</strong></label></div>';
                            string += '</div>';
                            flag++;
                        }
                        accreditedDataObject_02 = {
                            "accreditedName": null,
                            "accreditedLastName": null,
                            "accreditedSecondLastName": null,
                            "accreditedPhone": null,
                            "accreditedMail": null,
                            "accreditedNSS": null,                              
                            "accreditedDoB": null,
                            "accreditedCURP": null,
                            "accreditedProduct": null,
                            "accreditedProductId": null,
                            "accreditedBudget": null,
                        };  
                        appointmentDataObject = {
                            "contactHubSpotId": contactHubSpotId,
                            "numberOfAccredited": 1,
                            "appointmentProduct": accreditedProduct_02,
                            "appointmentProductId": appointmentProductId,
                            "appointmentBudget": accreditedBudget_02,
                            "developerId": developerId,
                            "developmentId": developmentId,
                            "developmentName": developmentName,
                            "developmentAddress": developmentAddress,
                            "developmentLatlng": developmentLatlng,
                            "developmentLocality": developmentLocality,
                            "developmentState": developmentState,
                            "developerHubSpotId": hubSpotIdDeveloper,
                            "developmentShortUrl": developmentShortUrl,
                            "modelId": modelId,
                            "modelName": modelName,
                            "modelPrice": modelPrice,
                            "modelShortUrl": modelShortUrl,  
                            "modelMinId": modelMinId,
                            "modelMinName": modelMinName,
                            "modelMinPrice": modelMinPrice,
                            "modelMinShortUrl": modelMinShortUrl                                                    
                        };                    
                    } else {
                        if (response.creditUserName == null || response.creditUserName == "") { accreditedName_01 = errorTxt; flag++; } else { accreditedName_01 = response.creditUserName; }
                        if (response.creditUserLastName == null || response.creditUserLastName == "") { accreditedLastName_01 = errorTxt; flag++; } else { accreditedLastName_01 = response.creditUserLastName; }
                        //if (response.creditUserSecondLastName == null || response.creditUserSecondLastName == "") { accreditedSecondLastName_01 = errorTxt; flag++; } else { accreditedSecondLastName_01 = response.creditUserSecondLastName; }
                        if (response.userPhone == null || response.userPhone == "") { accreditedPhone_01 = errorTxt; flag++; } else { accreditedPhone_01 = response.userPhone; }
                        if (response.userEmail == null || response.userEmail == "") { accreditedMail_01 = null; } else { accreditedMail_01 = response.userEmail; }
                        if (response.creditType == null || response.creditType == "") { accreditedProduct_01 = errorTxt; flag++; } else { accreditedProduct_01 = response.creditType; }
                        if (response.creditAmount == null || response.creditAmount == "") { accreditedBudget_01 = errorTxt; flag++; } else { accreditedBudget_01 = response.creditAmount; }
                        if (response.partnerName == null || response.partnerName == "") { accreditedName_02 = errorTxt; flag++; } else { accreditedName_02 = response.partnerName; }
                        if (response.partnerLastName == null || response.partnerLastName == "") { accreditedLastName_02 = errorTxt; flag++; } else { accreditedLastName_02 = response.partnerLastName; }
                        //if (response.partnerSecondLastName == null || response.partnerSecondLastName == "") { accreditedSecondLastName_02 = errorTxt; flag++; } else { accreditedSecondLastName_02 = response.partnerSecondLastName; }
                        if (response.partnerPhone == null || response.partnerPhone == "") { accreditedPhone_02 = errorTxt; flag++; } else { accreditedPhone_02 = response.partnerPhone; }
                        if (response.partnerEmail == null || response.partnerEmail == "") { accreditedMail_02 = null; } else { accreditedMail_02 = response.partnerEmail; }
                        if (response.partnerCreditType == null || response.partnerCreditType == "") { accreditedProduct_02 = errorTxt; flag++; } else { accreditedProduct_02 = response.partnerCreditType; }
                        if (response.partnerCreditAmount == null || response.partnerCreditAmount == "") { accreditedBudget_02 = errorTxt; flag++; } else { accreditedBudget_02 = response.partnerCreditAmount; }
                        if (response.coaccreditedCreditType == null || response.coaccreditedCreditType == "") { appointmentProduct = errorTxt; flag++; } else { appointmentProduct = response.coaccreditedCreditType; }
                        if (response.coaccreditedBudget == null || response.coaccreditedBudget == "") { appointmentBudget = errorTxt; flag++; } else { appointmentBudget = response.coaccreditedBudget; }
                        $.each(producstInfo, function(index, product) {
                            if (product.name == accreditedProduct_01) {
                                appointmentProductId_01 = product.id;
                                appointmentProductType_01 = product.type;
                            }
                            if (product.name == accreditedProduct_02) {
                                appointmentProductId_02 = product.id;
                                appointmentProductType_02 = product.type;
                            }                                                        
                            if (product.name == appointmentProduct) {
                                appointmentProductId = product.id;
                                appointmentProductType = product.type;
                            }
                        });
                        if (appointmentProductType == 'Infonavit') {
                            if ((appointmentProduct == 'Conyugal Fovissste+Infonavit') || (appointmentProduct == 'Fovissste + Infonavit Individual')) {
                                accreditedNSS_01 = response.nss; 
                                accreditedDoB_01 = response.dob; 
                                accreditedCURP_01 = response.curp; 
                                accreditedNSS_02 = response.partnerNss;
                                accreditedDoB_02 = response.partnerDob;
                                accreditedCURP_02 = response.partnerCurp;                            
                                globalFlag = 1;
                                string += '<div id="creditTypeOption">';
                                string += '<div class="col-sm-12" style="padding:0px;margin:0px;">';
                                string += '<div class="form-group" style="text-align: center;padding-top:8px;text-align: center;padding-top:8px;margin:0px;">';
                                string += '<label class="labelTitle" style="padding-right:8px;">¿Que tipo de crédito tiene el titular?</label><br>';
                                string += '<label class="radio-inline" style="margin-top:2px;"><input type="radio" class="optionCredit" name="optionCredit" style="margin-top: 1px;" value="infonavit">Infonavit</label>';
                                string += '<label class="radio-inline" style="margin-top:2px;"><input type="radio" class="optionCredit" name="optionCredit" style="margin-top: 1px;" value="fovissste">Fovissste</label>';
                                string += '</div>';
                                string += '</div>';
                                string += '</div>'; 

                                accreditedDataObject_01 = {
                                    "accreditedName": accreditedName_01,
                                    "accreditedLastName": accreditedLastName_01,
                                    "accreditedSecondLastName": response.creditUserSecondLastName,
                                    "accreditedPhone": accreditedPhone_01,
                                    "accreditedMail": accreditedMail_01,
                                    "accreditedNSS": accreditedNSS_01,                              
                                    "accreditedDoB": accreditedDoB_01,
                                    "accreditedCURP": accreditedCURP_01,
                                    "accreditedProduct": accreditedProduct_01,
                                    "accreditedProductId": appointmentProductId_01,
                                    "accreditedBudget": accreditedBudget_01,
                                };

                                accreditedDataObject_02 = {
                                    "accreditedName": accreditedName_02,
                                    "accreditedLastName": accreditedLastName_02,
                                    "accreditedSecondLastName": response.partnerSecondLastName,
                                    "accreditedPhone": accreditedPhone_02,
                                    "accreditedMail": accreditedMail_02,
                                    "accreditedNSS": accreditedNSS_02,                              
                                    "accreditedDoB": accreditedDoB_02,
                                    "accreditedCURP": accreditedCURP_02,
                                    "accreditedProduct": accreditedProduct_02,
                                    "accreditedProductId": appointmentProductId_02,
                                    "accreditedBudget": accreditedBudget_02,
                                };   

                                appointmentDataObject = {
                                    "contactHubSpotId": contactHubSpotId,
                                    "numberOfAccredited": 2,
                                    "appointmentProduct": appointmentProduct,
                                    "appointmentProductId": appointmentProductId,
                                    "appointmentBudget": appointmentBudget,
                                    "developerId": developerId,
                                    "developmentId": developmentId,
                                    "developmentName": developmentName,
                                    "developmentAddress": developmentAddress,
                                    "developmentLatlng": developmentLatlng,
                                    "developmentLocality": developmentLocality,
                                    "developmentState": developmentState,
                                    "developerHubSpotId": hubSpotIdDeveloper,
                                    "developmentShortUrl": developmentShortUrl,
                                    "modelId": modelId,
                                    "modelName": modelName,
                                    "modelPrice": modelPrice,
                                    "modelShortUrl": modelShortUrl,
                                    "modelMinId": modelMinId,
                                    "modelMinName": modelMinName,
                                    "modelMinPrice": modelMinPrice,
                                    "modelMinShortUrl": modelMinShortUrl                                    
                                };

                            } else {
                                //if (response.nss == null || response.nss == "") { accreditedNSS_01 = errorTxt; flag++; } else { accreditedNSS_01 = response.nss; }
                                //if (response.dob == null || response.dob == "") { accreditedDoB_01 = errorTxt; flag++; } else { accreditedDoB_01 = response.dob; }
                                //if (response.partnerNss == null || response.partnerNss == "") { accreditedNSS_02 = errorTxt; flag++; } else { accreditedNSS_02 = response.partnerNss; }
                                //if (response.partnerDob == null || response.partnerDob == "") { accreditedDoB_02 = errorTxt; flag++; } else { accreditedDoB_02 = response.partnerDob; }
                                accreditedNSS_01 = response.nss; 
                                accreditedDoB_01 = response.dob; 
                                accreditedNSS_02 = response.partnerNss;
                                accreditedDoB_02 = response.partnerDob;
                                string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                                string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData">' + appointmentProduct + '</label></div>';
                                string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData"> ' + appointmentBudget + '</label></div>';
                                string += '</div>';
                                string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                                string += '<div class="col-sm-6" style="padding:0px;">';
                                string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                                //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                                string += '<div class="col-sm-12"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' + accreditedNSS_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + accreditedDoB_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                                string += '</div>'
                                string += '<div class="col-sm-6" style="padding:0px;">';
                                string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + response.partnerSecondLastName + '</label></div>';                            
                                //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                                string += '<div class="col-sm-12"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' + accreditedNSS_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + accreditedDoB_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                                string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                                string += '</div>';                            
                                string += '</div>';
                                accreditedDataObject_01 = {
                                    "accreditedName": accreditedName_01,
                                    "accreditedLastName": accreditedLastName_01,
                                    "accreditedSecondLastName": response.creditUserSecondLastName,
                                    "accreditedPhone": accreditedPhone_01,
                                    "accreditedMail": accreditedMail_01,
                                    "accreditedNSS": accreditedNSS_01,                              
                                    "accreditedDoB": accreditedDoB_01,
                                    "accreditedCURP": null,
                                    "accreditedProduct": accreditedProduct_01,
                                    "accreditedProductId": appointmentProductId_01,
                                    "accreditedBudget": accreditedBudget_01,
                                };
                                accreditedDataObject_02 = {
                                    "accreditedName": accreditedName_02,
                                    "accreditedLastName": accreditedLastName_02,
                                    "accreditedSecondLastName": response.partnerSecondLastName,
                                    "accreditedPhone": accreditedPhone_02,
                                    "accreditedMail": accreditedMail_02,
                                    "accreditedNSS": accreditedNSS_02,                              
                                    "accreditedDoB": accreditedDoB_02,
                                    "accreditedCURP": null,
                                    "accreditedProduct": accreditedProduct_02,
                                    "accreditedProductId": appointmentProductId_02,
                                    "accreditedBudget": accreditedBudget_02,
                                }; 
                            }
                        } else if (appointmentProductType == 'Fovissste') {
                            //if (response.curp == null || response.curp == "") { accreditedCURP_01 = errorTxt; flag++; } else { accreditedCURP_01 = response.curp; }
                            //if (response.partnerCurp == null || response.partnerCurp == "") { accreditedCURP_02 = errorTxt; flag++; } else { accreditedCURP_02 = response.partnerCurp; }
                            accreditedCURP_01 = response.curp; 
                            accreditedCURP_02 = response.partnerCurp;   
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData">' + appointmentProduct + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData"> ' + appointmentBudget + '</label></div>';
                            string += '</div>';
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-6" style="padding:0px;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                            //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                            string += '<div class="col-sm-12"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + accreditedCURP_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                            string += '</div>'
                            string += '<div class="col-sm-6" style="padding:0px;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + response.partnerSecondLastName + '</label></div>';                            
                            //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                            string += '<div class="col-sm-12"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + accreditedCURP_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                            string += '</div>';                            
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_01,
                                "accreditedLastName": accreditedLastName_01,
                                "accreditedSecondLastName": response.creditUserSecondLastName,
                                "accreditedPhone": accreditedPhone_01,
                                "accreditedMail": accreditedMail_01,
                                "accreditedNSS": null,                              
                                "accreditedDoB": null,
                                "accreditedCURP": accreditedCURP_01,
                                "accreditedProduct": accreditedProduct_01,
                                "accreditedProductId": appointmentProductId_01,
                                "accreditedBudget": accreditedBudget_01,
                            };
                            accreditedDataObject_02 = {
                                "accreditedName": accreditedName_02,
                                "accreditedLastName": accreditedLastName_02,
                                "accreditedSecondLastName": response.partnerSecondLastName,
                                "accreditedPhone": accreditedPhone_02,
                                "accreditedMail": accreditedMail_02,
                                "accreditedNSS": null,                              
                                "accreditedDoB": null,
                                "accreditedCURP": accreditedCURP_02,
                                "accreditedProduct": accreditedProduct_02,
                                "accreditedProductId": appointmentProductId_02,
                                "accreditedBudget": accreditedBudget_02,
                            }; 
                        } else if (appointmentProductType == 'Bancario' || appointmentProductType == 'Directo' || appointmentProductType == 'Contado' || appointmentProductType == 'Otro') {
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData">' + appointmentProduct + '</label></div>';
                            string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData"> ' + appointmentBudget + '</label></div>';
                            string += '</div>';
                            string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
                            string += '<div class="col-sm-6" style="padding:0px;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + response.creditUserSecondLastName + '</label></div>';
                            //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_01 + '</label></div>'; 
                            string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_01 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_01 + '</label></div>';
                            string += '</div>'
                            string += '<div class="col-sm-6" style="padding:0px;">';
                            string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedName_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedLastName_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + response.partnerSecondLastName + '</label></div>';                            
                            //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedPhone_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedMail_02 + '</label></div>'; 
                            string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedProduct_02 + '</label></div>';
                            string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedBudget_02 + '</label></div>';
                            string += '</div>';                            
                            string += '</div>';
                            accreditedDataObject_01 = {
                                "accreditedName": accreditedName_01,
                                "accreditedLastName": accreditedLastName_01,
                                "accreditedSecondLastName": response.creditUserSecondLastName,
                                "accreditedPhone": accreditedPhone_01,
                                "accreditedMail": accreditedMail_01,
                                "accreditedNSS": null,                              
                                "accreditedDoB": null,
                                "accreditedCURP": null,
                                "accreditedProduct": accreditedProduct_01,
                                "accreditedProductId": appointmentProductId_01,
                                "accreditedBudget": accreditedBudget_01,
                            };
                            accreditedDataObject_02 = {
                                "accreditedName": accreditedName_02,
                                "accreditedLastName": accreditedLastName_02,
                                "accreditedSecondLastName": response.partnerSecondLastName,
                                "accreditedPhone": accreditedPhone_02,
                                "accreditedMail": accreditedMail_02,
                                "accreditedNSS": null,                              
                                "accreditedDoB": null,
                                "accreditedCURP": null,
                                "accreditedProduct": accreditedProduct_02,
                                "accreditedProductId": appointmentProductId_02,
                                "accreditedBudget": accreditedBudget_02,
                            };                             
                        }
                        appointmentDataObject = {
                            "contactHubSpotId": contactHubSpotId,
                            "numberOfAccredited": 2,
                            "appointmentProduct": appointmentProduct,
                            "appointmentProductId": appointmentProductId,
                            "appointmentBudget": appointmentBudget,
                            "developerId": developerId,
                            "developmentId": developmentId,
                            "developmentName": developmentName,
                            "developmentAddress": developmentAddress,
                            "developmentLatlng": developmentLatlng,
                            "developmentLocality": developmentLocality,
                            "developmentState": developmentState,
                            "developerHubSpotId": hubSpotIdDeveloper,
                            "developmentShortUrl": developmentShortUrl,
                            "modelId": modelId,
                            "modelName": modelName,
                            "modelPrice": modelPrice,
                            "modelShortUrl": modelShortUrl,
                            "modelMinId": modelMinId,
                            "modelMinName": modelMinName,
                            "modelMinPrice": modelMinPrice,
                            "modelMinShortUrl": modelMinShortUrl                         
                        };
                    }

                    /*$.each(producstInfo, function(index, product) {
                        if (product.name == appointmentProduct) {
                            hubSCreditTypeId  = product.id;
                            tempCreditType = product.type;
                        }
                    });*/

                    /*if (paymentMethods.includes(tempCreditType)) {
                        var methodFlag = '';
                    } else {
                        var methodFlag = 'Método no aceptado';
                        flag++;
                    }*/

                    /*if (hubSName != null) { var name = hubSName; } else { var name = errorTxt; flag++; }
                    if (hubSLastName != null) { var lastName = hubSLastName + ' ' + hubSSecondLastName; } else { var lastName = errorTxt; flag++; }
                    if (regPhone.test(hubSPhone)) { var phone = hubSPhone; } else { var phone = hubSPhone + ' ' + errorTxt; flag++; }
                    if (hubSMail != null) { var email = hubSMail; } else { var email = warning; }
                                        
                    if (hubSCreditType != null) { var creditType = hubSCreditType; } else { var creditType = errorTxt; flag++; }

                    if (regBudget.test(hubSCreditAmount)) {
                        if ((hubSCreditAmount == null) || (hubSCreditAmount == 0)) { var creditAmount = hubSCreditAmount; var creditAmountMsg = warningAmount; flag++; }
                        else { var creditAmount = hubSCreditAmount; var creditAmountMsg = ''; }
                    } else {
                        var creditAmount = hubSCreditAmount; var creditAmountMsg = warningAmount;  flag++;
                    }*/
                    
                    string += '<div class="col-sm-12" id="hubSpotMissingRecords" style="text-align: center;padding:0px;"></div>'; 
                   
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
            $('#hubSpotDataContainer').html(string);
            if (flag != 0) {  
                $('#hubSpotMissingRecords').html('<label style="color:red;">Debes corregir o llenar los datos faltantes en HubSpot.</label>');
                $("#scheduleAppointment").prop("disabled", true);
            } else {
                if (globalFlag == 0) {
                    if ((developerId == 'SAD' || developerId == 'ALT' || developerId == 'STHANA' || developerId == 'RUB' || developerId == 'RUB2') && (providerStatus == '0' || providerStatus == 'Rejected')) {
                        $('#hubSpotMissingRecords').html('<label style="color:red;">Debes de dar de alta al contacto en el Constructor primero.</label>');
                        $("#scheduleAppointment").prop("disabled", true);
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
    var errorTxt = '<span style="font-weight:bold;color:red;">Error</span>';
    var flag = 0;
    if (option == 'infonavit') {
        //if (accreditedDataObject_01.accreditedNSS == null || accreditedDataObject_01.accreditedNSS == "") { accreditedNSS_01 = errorTxt; flag++; } else { accreditedNSS_01 = accreditedDataObject_01.accreditedNSS; }
        //if (accreditedDataObject_01.accreditedDoB == null || accreditedDataObject_01.accreditedDoB == "") { accreditedDoB_01 = errorTxt; flag++; } else { accreditedDoB_01 = accreditedDataObject_01.accreditedDoB; }
        //if (accreditedDataObject_02.accreditedNSS == null || accreditedDataObject_02.accreditedNSS == "") { accreditedNSS_02 = errorTxt; flag++; } else { accreditedNSS_02 = accreditedDataObject_02.accreditedNSS; }
        //if (accreditedDataObject_02.accreditedDoB == null || accreditedDataObject_02.accreditedDoB == "") { accreditedDoB_02 = errorTxt; flag++; } else { accreditedDoB_02 = accreditedDataObject_02.accreditedDoB; }
        accreditedNSS_01 = accreditedDataObject_01.accreditedNSS;
        accreditedDoB_01 = accreditedDataObject_01.accreditedDoB;
        accreditedNSS_02 = accreditedDataObject_02.accreditedNSS;
        accreditedDoB_02 = accreditedDataObject_02.accreditedDoB;
        accreditedDataObject_01.accreditedNSS = accreditedNSS_01;
        accreditedDataObject_01.accreditedDoB = accreditedDoB_01;
        accreditedDataObject_01.accreditedCURP = null;
        accreditedDataObject_02.accreditedNSS = accreditedNSS_02;
        accreditedDataObject_02.accreditedDoB = accreditedDoB_02;
        accreditedDataObject_02.accreditedCURP = null;
        string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
        string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData">' + appointmentDataObject.appointmentProduct + '</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData"> ' + appointmentDataObject.appointmentBudget + '</label></div>';
        string += '</div>';
        string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
        string += '<div class="col-sm-6" style="padding:0px;">';
        string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedLastName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedSecondLastName + '</label></div>';
        //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedPhone + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedMail + '</label></div>'; 
        string += '<div class="col-sm-12"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedNSS + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedDoB + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedProduct + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedBudget + '</label></div>';
        string += '</div>'
        string += '<div class="col-sm-6" style="padding:0px;">';
        string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedLastName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + accreditedDataObject_02.accreditedSecondLastName + '</label></div>';                            
        //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedPhone + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedMail + '</label></div>'; 
        string += '<div class="col-sm-12"><label class="labelTitle">NSS:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedNSS + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Fecha de Nacimiento:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedDoB + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedProduct + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedBudget + '</label></div>';
        string += '</div>';                            
        string += '</div>';
    } else {
        //if (accreditedDataObject_01.accreditedCURP == null || accreditedDataObject_01.accreditedCURP == "") { accreditedCURP_01 = errorTxt; flag++; } else { accreditedCURP_01 = accreditedDataObject_01.accreditedCURP; }
        //if (accreditedDataObject_02.accreditedCURP == null || accreditedDataObject_02.accreditedCURP == "") { accreditedCURP_02 = errorTxt; flag++; } else { accreditedCURP_02 = accreditedDataObject_02.accreditedCURP; }
        accreditedCURP_01 = accreditedDataObject_01.accreditedCURP;
        accreditedCURP_02 = accreditedDataObject_02.accreditedCUR
        accreditedDataObject_01.accreditedNSS = null;
        accreditedDataObject_01.accreditedDoB = null;
        accreditedDataObject_01.accreditedCURP = accreditedCURP_01;
        accreditedDataObject_02.accreditedNSS = null;
        accreditedDataObject_02.accreditedDoB = null;
        accreditedDataObject_02.accreditedCURP = accreditedCURP_02;
        string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
        string += '<div class="col-sm-6"><label class="labelTitle">Producto Coacreditados:</label> <label class="labelData">' + appointmentDataObject.appointmentProduct + '</label></div>';
        string += '<div class="col-sm-6"><label class="labelTitle">Presupuesto Coacreditados:</label> <label class="labelData"> ' + appointmentDataObject.appointmentBudget + '</label></div>';
        string += '</div>';
        string += '<div class="row" style="padding:6px 0px;border-bottom: 1px dotted #dddddd;">';
        string += '<div class="col-sm-6" style="padding:0px;">';
        string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 1</strong></label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedLastName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedSecondLastName + '</label></div>';
        //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedPhone + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedMail + '</label></div>'; 
        string += '<div class="col-sm-12"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedCURP + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedProduct + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedDataObject_01.accreditedBudget + '</label></div>';
        string += '</div>'
        string += '<div class="col-sm-6" style="padding:0px;">';
        string += '<div class="col-sm-12" style="text-align:center;padding-bottom:6px;"><label class="labelData"><strong>Acreditado 2</strong></label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Nombre:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Paterno:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedLastName + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Apellido Materno: </label> <label class="labelData">' + accreditedDataObject_02.accreditedSecondLastName + '</label></div>';                            
        //string += '<div class="col-sm-12"><label class="labelTitle">Teléfono:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedPhone + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Email:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedMail + '</label></div>'; 
        string += '<div class="col-sm-12"><label class="labelTitle">CURP:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedCURP + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Método de Pago:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedProduct + '</label></div>';
        string += '<div class="col-sm-12"><label class="labelTitle">Presupuesto:&nbsp;</label><label class="labelData">' + accreditedDataObject_02.accreditedBudget + '</label></div>';
        string += '</div>';                            
        string += '</div>';
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
    if ($('#sendNotifications').is(':checked')) {
        var sendNotifications = 1;
    } else {
        var sendNotifications = 0;
    }    
    var appointmentNotes = $('#appointmentNotes').val();
    var scheduleDateArr = $('#datepickerAppointment').val().split("/");
    var scheduleDate = scheduleDateArr[2] + '-' + scheduleDateArr[1] + '-' +  scheduleDateArr[0];
    var scheduleTime = $('#calendarInputTime').val().substring(0, 5);
    var coordinatorId = $('#coordinatorId').val();
    var coordinatorName = $('#coordinatorId').find(":selected").text();
    var scheduleTimeArr = scheduleTime.split(":");
    var currentDate = new Date();
    var regDate = /^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/;
    var regTime = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

    if (sendNotifications == 1) {
        if (regDate.test(scheduleDate)) {
            var appointmentDate = new Date(scheduleDateArr[2], parseInt(scheduleDateArr[1])-1, scheduleDateArr[0], 23, 59);
            console.log(appointmentDate);
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

    if (coordinatorId == 0) {
        screenMsgGlobal('Ups!', 'Debes seleccionar un Coordinador.', '3000', 'growl-danger');
        flag++;
    }

    if(filesInformation != null) {
        if (filesInformation.length == 0) {
            filesInformation = null;
        }
    }

    var eachLine = appointmentNotes.split('\n');

    if (eachLine.length > 2) {
        screenMsgGlobal('Ups!', 'No es posible agregar mas de 2 saltos de línea (Enter) en la Nota.', '3000', 'growl-danger');
        flag++;
    }

    if (appointmentNotes.length > 150) {
        screenMsgGlobal('Ups!', 'Solo se permiten Notas de 150 caractéres máximo.', '3000', 'growl-danger');
        flag++;
    }

    if (flag == 0) {
        $('#visitsAllowedInput').prop('disabled', true);
        $('#visitsAllowed').css('background-color', '#eee')
        $("#scheduleAppointmentResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;'>");
        $.ajax({
            type: "POST",
            data: {
                type:"scheduleAppointment", 
                contact: contactDataObject,
                accredited01: accreditedDataObject_01,
                accredited02: accreditedDataObject_02,
                appointmentData: appointmentDataObject,  
                appointmentDate:scheduleDate,
                appointmentTime:scheduleTime,
                latlng:latlng,
                IPCurrentUser:IPCurrentUser,
                deviceType:deviceType,
                appointmentNotes:appointmentNotes,
                visitsAllowed:visitsAllowed,
                sendNotifications:sendNotifications,
                attachments:filesInformation,
                coordinatorId:coordinatorId,
                coordinatorName:coordinatorName
            },
            url: "./php/appointmentDataNew.php",
            dataType: 'json',
            success: function(response) {
                console.log(response);
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
                    verifyCode(scheduleDate, scheduleTime, appointmentNotes, visitsAllowed, sendNotifications, response.hubSpotDealId, response.leadId, response.userId);
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
                } else if (response.result == 'invalid_instance') {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error al generar la cita en esta instancia.</span>');
                    setTimeout(function () {
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);                    
                } else {
                    $("#scheduleAppointment").prop("disabled", true);
                    $(".custom-file").attr('disabled','disabled');
                    $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">'+response.result+'</span>');
                    setTimeout(function () {
                        $("#scheduleAppointmentResponse").html('');
                    }, 1500);
                }
            },
            error: function(err) {
                //$("#scheduleAppointment").prop("disabled", true);
                $(".custom-file").attr('disabled','disabled');
                $("#scheduleAppointmentResponse").html('<span style="color:#d9534f;font-weight:bold;">Hubo un error.</span>');
                setTimeout(function () {
                    $("#scheduleAppointmentResponse").html('');
                }, 1500);
            }
        });
    }
});

function verifyCode(appointmentDate, appointmentTime, appointmentNotes, visitsAllowed, sendNotifications, hubSpotDealId, leadId, userId) {
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
    codeValidationForm += '<input type="hidden" id="appointmentDate" value="' + appointmentDate + '">';
    codeValidationForm += '<input type="hidden" id="appointmentTime" value="' + appointmentTime + '">';
    codeValidationForm += '<input type="hidden" id="appointmentNotes" value="' + appointmentNotes + '">';
    codeValidationForm += '<input type="hidden" id="visitsAllowed" value="' + visitsAllowed + '">';
    codeValidationForm += '<input type="hidden" id="sendNotifications" value="' + sendNotifications + '">';
    codeValidationForm += '<input type="hidden" id="dealId" value="' + hubSpotDealId + '">';
    codeValidationForm += '<input type="hidden" id="leadId" value="' + leadId + '">';
    codeValidationForm += '<input type="hidden" id="userId" value="' + userId + '">';
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
    var cvu = $('#cvu').val();
    var appointmentDate = $('#appointmentDate').val();
    var appointmentTime = $('#appointmentTime').val();
    var appointmentNotes = $('#appointmentNotes').val();
    var visitsAllowed = $('#visitsAllowed').val();
    var sendNotifications = $('#sendNotifications').val();
    var dealId = $('#dealId').val();
    var leadId = $('#leadId').val();
    var userId = $('#userId').val();
    var regCode = /^\d{5}$/;
    if ($('#sendNotifications').is(':checked')) {
        var sendNotifications = 1;
    } else {
        var sendNotifications = 0;
    } 
    console.log('here', visitsAllowed);
    console.log(appointmentDate, appointmentTime, appointmentNotes, visitsAllowed, sendNotifications, filesInformation, dealId, leadId, userId);
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
                contact: contactDataObject,
                accredited01: accreditedDataObject_01,
                accredited02: accreditedDataObject_02,
                appointmentData: appointmentDataObject,  
                appointmentDate:appointmentDate,
                appointmentTime:appointmentTime,
                cvu:cvu,
                hubSpotDealId:dealId,
                leadId:leadId,
                userId:userId,
                latlng:latlng,
                IPCurrentUser:IPCurrentUser,
                deviceType:deviceType,
                appointmentNotes:appointmentNotes,
                visitsAllowed:visitsAllowed,
                sendNotifications:sendNotifications,
                attachments:filesInformation,
                providerId:providerId, 
                providerToken:providerToken, 
                providerStatus:providerStatus
            },
            url: "./php/appointmentDataNew.php",
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
                    //responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatlng + '" data-messagetouserwhats="' + response.whatsAppMsg2User + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
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
                    //responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatlng + '" data-messagetouserwhats="' + response.whatsAppMsg2User + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
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
    //var developmentId = $(this).data("developmentid");
    //var developmentName = $(this).data("developmentname");
    //var modelId = $(this).data("modelid");
    //var modelName = $(this).data("modelname");
    //var developmentAddress = $(this).data("developmentaddress");
    //var developmentLatLng = $(this).data("developmentlatlng");
    //var currentDate = formatedDate();
    var msgCollaborator = $(this).data("msgcollaborator"); 
    var whatsApp2User = $(this).data("messagetouserwhats");
    var msgUser = $(this).data("msguser");
    //var collaboratorName = $(this).data("collaboratorname");
    var collaboratorPhone = $(this).data("collaboratorphone");
    //var collaboratorMail = $(this).data("collaboratormail");
    //var appointmentdatetime = $(this).data("appointmentdatetime");
    var hubSpotMailRecipient = $(this).data("hubspotmailrecipient");
    var hubSpotMailCopyto = $(this).data("hubspotmailcopyto");
    var hubSpotMailSubject = $(this).data("hubspotmailsubject");
    var hubSpotMailBody = $(this).data("hubspotmailbody");
    
    var responseInfo = '<table style="width:100%">';
    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>SMS al Contacto</strong><br><br>';
    responseInfo += msgUser;
    responseInfo += '<br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgUser +'">Copiar</button><br>';
    //responseInfo += '<br><br>Desarrollo ' + developmentName + ': ' + developmentShortUrl + '<br>';
    //message = 'Desarrollo ' + developmentName + ': ' + developmentShortUrl + '\n';
    //if (modelId != 0) {
    //    responseInfo += 'Modelo ' + modelName + ': ' + modelShortUrl + '<br>';
    //    message += 'Modelo ' + modelName + ': ' + modelShortUrl + '\n';
    //}
    //responseInfo += 'Dirección: ' + developmentAddress + '<br>';
    //message += 'Dirección: ' + developmentAddress + '\n';
    //responseInfo += 'Ubicación: ' + developmentLatLng + '<br>';
    //message += 'Ubicación: ' + developmentLatLng + '\n';
    //responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + message +'">Copiar</button><br>';
    responseInfo += '</td>';
    responseInfo += '</tr>';

    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Whatsapp al Contacto:</strong><br><br>';
    whatsApp2User1 = whatsApp2User.replace(/\n/g, "<br>"); 
    responseInfo += whatsApp2User1 + '<br>';
    whatsApp2UserTxt = whatsApp2User.replace(/<\/br>/g, '\n');
    whatsApp2UserTxt = whatsApp2UserTxt.replace(/<strong>/g, '');
    whatsApp2UserTxt = whatsApp2UserTxt.replace(/<\/strong>/g, '');    
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + whatsApp2UserTxt +'">Copiar</button><br>';
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
    responseInfo += '<strong>Mensaje:</strong><br><br>';
    responseInfo += hubSpotMailBody + '<br>';
    hubSpotMailBodyTxt = hubSpotMailBody.replace(/<\/br>/g, '\n');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<strong>/g, '');
    hubSpotMailBodyTxt = hubSpotMailBodyTxt.replace(/<\/strong>/g, '');
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + hubSpotMailBodyTxt +'">Copiar</button><br>';
    responseInfo += '</td>';
    responseInfo += '</tr>';

    responseInfo += '<tr style="border-bottom: 1px dotted #dddddd;">';
    responseInfo += '<td style="vertical-align:top;padding-top:12px;">';
    responseInfo += '<strong>Mensaje al Colaborador ('+collaboratorPhone+'):</strong><br><br>';
    msgCollaborator1 = msgCollaborator.replace(/\n/g, "<br>"); 
    responseInfo += msgCollaborator1 + '<br>';
    msgCollaboratorTxt = msgCollaborator.replace(/<\/br>/g, '\n');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<strong>/g, '');
    msgCollaboratorTxt = msgCollaboratorTxt.replace(/<\/strong>/g, '');    
    responseInfo += '<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px;background-color:#FFB71B;color:#FFFFFF;margin-top:8px;" name="' + msgCollaboratorTxt +'">Copiar</button><br>';
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
        yearRange: '2019:2023'
    });
    $('#datepickerAppointment').datepicker('show');
});

$(document).on("click", "#calendarDate", function(e) {
    e.preventDefault();
    $('#datepickerAppointment').datepicker({
        dateFormat: 'dd/mm/yy',
        changeMonth: true,
        changeYear: true,
        yearRange: '2019:2023'
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
        url: "./php/appointmentDataNew.php",
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
                    "visitsAllowed": appointmentData.visitsAllowed
                });
                if (appointmentData.leadFlagId == 7) {
                    appointmentStatus = '<label style="color:green;font-weight:bold">Agendada</label>';
                } else {
                    appointmentStatus = '<label style="font-weight:bold">Pendiente</label>';
                }
                form += '<tr>';
                form += '<td style="vertical-align:middle;white-space: nowrap;">';
                form += '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + appointmentData.leadId  + '" data-hubspotcontact="' + appointmentData.hubSpotContactId  + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>'
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
    var string = '';
    filesInformation = [];
    //console.log(leadId, hubSpotContactId);
    $.ajax({
        type: "POST",
        data: {type:"getUserData", keyword:hubSpotContactId},
        url: "./php/appointmentDataNew.php",
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
                    //string += '<div class="col-xs-12 col-sm-12 col-lg-6">';
                    //string += '<div class="form-group">';
                    //string += '<label style="font-weight: bold;">Teléfono:&nbsp;&nbsp;</label>';
                    //string += '<label>'+data.hubUserPhone+'</label>';
                    //string += '<label>&nbsp;</label>';
                    //string += '</div>';
                    //string += '</div>';
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
                    string += '<label style="font-weight: bold;">Método de Pago:&nbsp;&nbsp;</label>';
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
                        url: "./php/appointmentDataNew.php",
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
        url: "./php/appointmentDataNew.php",
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
                sendNotifications:sendNotifications
            },
            url: "./php/appointmentDataNew.php",
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
                    //responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse2" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
                    $("#scheduleAppointmentResponse2").html(responseData + '<br> ' + string);
                    //$('#developmentNameTittle').html('Status del proceso');
                    getScheduleAppointmentData(null, 0);
                } else if (response.result == 'invalidCode') {
                    $("#scheduleAppoinmentMsgResponse").html('<div style="color:#d9534f;font-weight:bold;">El código es inválido.</div>');
                    getScheduleAppointmentData(null, 0);
                } else {
                    $('#appointmentTittle').html('Hubo errores.')
                    responseData = '<div style="width:100%;text-align:center;padding-top:6px;font-weight:bold">Hubo un error. Verificar el Log.</div>'
                    //responseData += '<div style="width:100%;text-align:center;padding-top:16px;"><button type="button" id="showResponse2" data-developmentid="' + developmentId + '" data-developmentname="' + developmentName + '" data-modelid="' + modelId + '" data-modelname="' + modelName + '" data-developmentaddress="' + developmentAddress + '" data-developmentlatlng="' + developmentLatLng + '" data-msgcollaborator="' + response.whatsappMessage2Collaborator + '" data-msguser="' + response.messageToUser + '" data-collaboratorname="' + response.collaboratorName + '" data-collaboratorphone="' + response.collaboratorPhone + '" data-collaboratormail="' + response.collaboratorMail + '" data-appointmentdatetime="' + response.appointmentDateTime + '" data-hubspotmailrecipient="' + response.hubSpotMailRecipient + '" data-hubspotmailcopyto="' + response.hubSpotMailCopyTo + '" data-hubspotmailsubject="' + response.hubSpotMailSubject + '" data-hubspotmailbody="' + hubSpotMailBody + '" class="btn btn-success" style="background-color:#FFB71B;color:#FFFFFF;">Continuar</button></div>';
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

function screenMsgGlobal(textTitle, textMsg, time, className) {
    jQuery.gritter.add({
        title: textTitle,
        text: textMsg,
        class_name: className,
        sticky: false,
        time: time
    });
    return false;
}