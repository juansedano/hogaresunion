$(document).ready(function () {
    getDevelopers();
    //getModels(4, "Test");
    getDevelopmentData("Desarrollador", 4, "Test");
    $("#basicFeaturesModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open")
    });

    $("#additionalFeaturesModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open")
    });      
});

$("#developer").change(function(){
    var developerId = $(this).val();
    $("#state").prop("disabled", false);
    $("#state").val(0).trigger('change');   
    $("#locality").prop("disabled", true);
    $("#locality").val(0).trigger('change');   
    $("#development").prop("disabled", true);
    $("#development").val(0).trigger('change'); 
    $("#resultsContainerModels").css("display", "none");
    $("#modelsContainer").html('');
    $("#developmentContainer").css("display", "none");
    $("#developmentDataContainer").html('');    
    getStates(developerId);
});

$("#state").change(function(){
    var developerId = $("#developer").val();
    var stateId = $(this).val();
    $("#locality").prop("disabled", false);
    $("#locality").val(0).trigger('change');   
    $("#development").prop("disabled", true);
    $("#development").val(0).trigger('change');   
    $("#resultsContainerModels").css("display", "none");
    $("#modelsContainer").html('');
    $("#developmentContainer").css("display", "none");
    $("#developmentDataContainer").html('');       
    getLocalities(developerId, stateId);
});

$("#locality").change(function(){
    var developerId = $("#developer").val();
    var stateId = $("#state").val();
    var localityId = $(this).val();
    $("#development").prop("disabled", false);
    $("#development").val(0).trigger('change'); 
    $("#resultsContainerModels").css("display", "none");
    $("#modelsContainer").html('');
    $("#developmentContainer").css("display", "none");
    $("#developmentDataContainer").html('');       
    getDevelopments(developerId, stateId, localityId);
});

$("#development").change(function(){
    var developmentId = $(this).val();
    var developerName = $("#developer option:selected").text();
    var developmentName = $("option:selected", this).text();  
    if (developmentId != 0) {
        getDevelopmentData(developerName, developmentId, developmentName);        
        getModels(developmentId, developmentName);
    }
});

function getDevelopmentData(developerName, developmentId, developmentName) {
    $("#developmentNameTittle").html('Desarrollo: ' + developmentName);
    $("#developmentNameSubTittle").html(developerName);
    $("#developmentContainer").css("display", "block");
    $("#developmentDataContainer").html('');
    $("#developmentDataContainer").append('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    console.log(developmentId);
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentData", developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#developmentDataContainer").html('');
            //console.log(response.development);
            var developmentId = response.development[0].developmentId;
            var developmentName = response.development[0].developmentName;
            var developmentDescription = response.development[0].developmentDescription;
            var developmentLatitude = response.development[0].developmentLatitude;
            var developmentLongitude = response.development[0].developmentLongitude;
            var developmentLongitude = response.development[0].developmentLongitude;
            var developmentStreet = response.development[0].developmentStreet;
            var developmentExtNumber = response.development[0].developmentExtNumber;
            var developmentIntNumber = response.development[0].developmentIntNumber;
            var developmentPostalCode = response.development[0].developmentPostalCode;
            var developmentSublocality = response.development[0].developmentSublocality;
            var developmentLocality = response.development[0].developmentLocality;
            var developmentState = response.development[0].developmentState;
            var developmentDirections = response.development[0].developmentDirections;
            var developmentStatus = response.development[0].developmentStatus;
            /*var collaboratorId = response.development[0].collaboratorId;
            var collaboratorName = response.development[0].collaboratorName;
            var collaboratorLastName = response.development[0].collaboratorLastName;
            var collaboratorPhone = response.development[0].collaboratorPhone;
            var collaboratorMail = response.development[0].collaboratorMail;*/
            var developmentFeatures = response.development[0].developmentFeatures;
            var developmentCollaborator = response.development[0].developmentCollaborator;

            var devFeatures = '';
            $.each(developmentFeatures, function(index, feature) {
                for (i=0; i<feature.length; i++) {
                    devFeatures += feature[i].name + '; ';
                }  
            });

            var devCollaborators = '';
            $.each(developmentCollaborator, function(index, collaborator) {
                for (i=0; i<collaborator.length; i++) {
                    devCollaborators += collaborator[i].name + ' ' + collaborator[i].lastName + ' / ' + collaborator[i].phone + ' / ' + collaborator[i].email + ';<br> ';
                }  
            });            

            var developmentAddress = developmentStreet;
            if ((developmentExtNumber == '') || (developmentExtNumber == null) || (developmentExtNumber == 's/n') || (developmentExtNumber == 'S/N')) {
                developmentAddress += ', s/n. ';
            } else {
                developmentAddress += ', No. ' + developmentExtNumber + '. ';
            }
            if (developmentSublocality != '') {
                developmentAddress += 'Col. ' + developmentSublocality;
            }
            developmentAddress += developmentLocality + ', ' + developmentState + '.';
            if (developmentPostalCode != '') {
                developmentAddress += 'C.P. ' + developmentPostalCode + '.';
            }

            if (developmentStatus == 1) {
                developmentStatusTxt = "Activo"
            } else if (developmentStatus == 2) {
                developmentStatusTxt = "Inactivo"
            } else {
                developmentStatusTxt = "Error";
            }   

            development = '<table style="width:100%">';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Nombre</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devNameContainer"><label id="devNameLabel" style="font-size:16px;font-weight: 600">' + developmentName + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevNameContainer" id="devNameUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Status</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devStatusContainer"><label id="devStatusLabel">' + developmentStatusTxt + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevStatusContainer" id="devStatusUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';             
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Descripción Comercial</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devDescriptionContainer"><label id="devDescriptionLabel">' + developmentDescription + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevDescriptionContainer" id="devDescriptionUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>'; 
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Geoposición</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="geoContainer">Latitud: <label id="latitudeLabel">' + developmentLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="longitudeLabel">' + developmentLongitude + '</label><br><a href="https://mylocation.org/" target="_blank">Mi geoposición</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="https://www.google.com/maps/?q=' + developmentLatitude + ',' + developmentLongitude + '" target="_blank">Geoposición del desarrollo</a></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateGeoContainer" id="geoUpdateButton-" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';   
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Dirección</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devAddressContainer"><label id="devAddressLabel">' + developmentAddress + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevAddressContainer" id="devAddressUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>'; 
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Cómo llegar</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devDirectionContainer"><label id="devDirectionLabel">' + developmentDirections + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevDirectionContainer" id="devDirectionUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';  
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Contacto</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devCollaboratorContainer"><label id="devCollaboratorsLabel">' + devCollaborators + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevCollaboratorContainer" id="devCollaboratorUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';             
            /*development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><input type="hidden" id="collaboratorId" value="' + collaboratorId + '"><p>Contacto</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devCollaboratorContainer">';
            development += '<input type="hidden" id="collaboratorName" value="' + collaboratorName + '">';
            development += '<input type="hidden" id="collaboratorLastName" value="' + collaboratorLastName + '">';
            development += 'Nombre: <label id="collaboratorNameLabel">' + collaboratorName + ' ' + collaboratorLastName + '</label><br>';
            development += 'Teléfono: <label id="collaboratorPhoneLabel">' + collaboratorPhone + '</label><br>';
            development += 'Mail: <label id="collaboratorMailLabel">' + collaboratorMail + '</label>';
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevCollaboratorContainer" id="devCollaboratorUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; */
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Características</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devFeatureContainer"><label id="devFeaturesLabel">' + devFeatures + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevFeaturesContainer" id="devFeaturesUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:none">Editar</a></td>';
            development += '</tr>';   
            development += '</table>';   
            $("#developmentDataContainer").append(development);      
        }
    });
}

function getModels(developmentId, developmentName) {
    x = 0;
    var models = '';
    var basicFeaturesColumn = '';
    var additionalFeaturesColumn = '';
    $("#developmentName").html(developmentName);
    $("#resultsContainerModels").css("display", "block");
    $("#modelsContainer").html('');
    $("#modelsContainer").append('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "GET",
        data: {type:"getModels", developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#modelsContainer").html('');
            $.each(response.model, function(index, model) {
                price = formatoMoneda(model.modelPrice);
                if (model.status == 1) {
                    status = "Activo"
                } else if (model.status == 2) {
                    status = "Inactivo"
                } else {
                    status = "Error";
                }
                basicFeaturesColumn = '';
                additionalFeaturesColumn = '';
                $.each(model.feature, function(index, feature) {
                    for (i=0; i<feature.length; i++) {
                        if (feature[i].type == 1) {
                            basicFeaturesColumn +=  feature[i].nameText + ': ' + feature[i].quantity + '<br>';
                        } else {
                            if (feature[i].quantity != 0) {
                                additionalFeaturesColumn += feature[i].nameText + '; ';
                            }                            
                        }
                    }                                                     
                });                
                models = '<table style="width:100%">';
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Nombre</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="nameContainer-' + model.modelId + '"><label id="nameLabel-' + model.modelId + '" style="font-size:16px;font-weight: 600">' + model.modelName + '</label></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateNameContainer" id="nameUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                models += '</tr>';
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Precio</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="priceContainer-' + model.modelId + '"><label id="priceLabel-' + model.modelId + '">' + price + '</label></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updatePriceContainer" id="priceUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                models += '</tr>';
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Status</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="statusContainer-' + model.modelId + '"><label id="statusLabel-' + model.modelId + '" name="' + model.status + '">' + status + '</label></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateStatusContainer" id="statusUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                models += '</tr>';                
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Descripción</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="descriptionContainer-' + model.modelId + '"><label id="descriptionLabel-' + model.modelId + '">' + model.description + '</label></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDescriptionContainer" id="descriptionUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                models += '</tr>';
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Superficie</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="areaContainer-' + model.modelId + '">Construcción: <label id="buildingAreaLabel-' + model.modelId + '">' + model.buildingArea + '</label>&nbsp;m&#178;&nbsp;&nbsp;Terreno: <label id="landAreaLabel-' + model.modelId + '">' + model.landArea + '</label>&nbsp;m&#178;</td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateAreaContainer" id="areaUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                models += '</tr>';                             
                models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Características Básicas</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="basicFeaturesContainer-' + model.modelId + '">' + basicFeaturesColumn + '</td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateBasicFeatureContainer" name="' + model.modelId + '"  style="font-size:12px;">Editar</a></td>';
                models += '</tr>';                
                models += '<tr>';
                models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Características Adicionales</p></td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="additionalFeaturesContainer-' + model.modelId + '">' + additionalFeaturesColumn + '</td>';
                models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateAdditionalFeatureContainer" name="' + model.modelId + '"  style="font-size:12px;">Editar</a></td>';
                models += '</tr>';
                models += '</table>';
                models += '<hr style="border-bottom: 2px solid #cccccc;">';
                $("#modelsContainer").append(models);
                x++;
            });
            $("#developmentSize").html('Modelos (' + x + ')');
        }
    });	
}

/*$(document).on("click", ".updateDevCollaboratorContainer", function(e) {
    e.preventDefault();
    var formCollaborator = '';
    var devlId = $(this).attr('name');
    var collaboratorName = $('#collaboratorName').val();
    var collaboratorLastName = $('#collaboratorLastName').val();
    var collaboratorPhone = $('#collaboratorPhoneLabel').html();
    var collaboratorMail = $('#collaboratorMailLabel').html();
    console.log(devlId, collaboratorName, collaboratorLastName, collaboratorPhone, collaboratorMail);
    $('#devCollaboratorUpdateButton').css("display", "none");
    formCollaborator = '<form style="padding-bottom:6px;">';
    formCollaborator += '<input type="hidden" id="textCollaboratorName" value="' + collaboratorName + '">';
    formCollaborator += '<input type="hidden" id="textCollaboratorLastName" value="' + collaboratorLastName + '">';
    formCollaborator += '<input type="hidden" id="textCollaboratorPhone" value="' + collaboratorPhone + '">';
    formCollaborator += '<input type="hidden" id="textCollaboratorMail" value="' + collaboratorMail + '">';    
    formCollaborator += '<div class="row">';
    formCollaborator += '<div class="form-group" style="margin:2px;">';
    formCollaborator += '<label class="col-md-4 col-lg-3 control-label">Nombre:</label>';
    formCollaborator += '<div class="col-md-8 col-lg-8">';
    formCollaborator += '<input type="text" name="name" class="form-control" id="inputCollaboratorName" style="max-width:160px;height:24px;" value="' + collaboratorName + '">';
    formCollaborator += '</div>';
    formCollaborator += '</div>';
    formCollaborator += '</div>';  
    formCollaborator += '<div class="row">';
    formCollaborator += '<div class="form-group" style="margin:2px;">';
    formCollaborator += '<label class="col-md-4 col-lg-3  control-label">Apellido:</label>';
    formCollaborator += '<div class="col-md-8 col-lg-8">';
    formCollaborator += '<input type="text" name="name" class="form-control" id="inputCollaboratorLastName" style="max-width:160px;height:24px;" value="' + collaboratorLastName + '">';
    formCollaborator += '</div>';
    formCollaborator += '</div>';
    formCollaborator += '</div>';  
    formCollaborator += '<div class="row">';
    formCollaborator += '<div class="form-group" style="margin:2px;">';
    formCollaborator += '<label class="col-md-4 col-lg-3  control-label">Teléfono:</label>';
    formCollaborator += '<div class="col-md-8 col-lg-8">';
    formCollaborator += '<input type="text" name="name" class="form-control" id="inputCollaboratorPhone" style="max-width:160px;height:24px;" value="' + collaboratorPhone + '">';
    formCollaborator += '</div>';
    formCollaborator += '</div>';
    formCollaborator += '</div>';  
    formCollaborator += '<div class="row">';
    formCollaborator += '<div class="form-group" style="margin:2px;">';
    formCollaborator += '<label class="col-md-4 col-lg-3  control-label">Email:</label>';
    formCollaborator += '<div class="col-md-8 col-lg-8">';
    formCollaborator += '<input type="text" name="name" class="form-control" id="inputCollaboratorMail" style="max-width:160px;height:24px;" value="' + collaboratorMail + '">';
    formCollaborator += '</div>';
    formCollaborator += '</div>';
    formCollaborator += '</div>';              
    formCollaborator += '<div class="row">';
    formCollaborator += '<div class="form-group" style="margin:2px;">';
    formCollaborator += '<div class="col-md-4 col-lg-3">';
    formCollaborator += '<button type="button" class="btn btn-md btn-cancel cancelCollaborator" value="' + devlId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formCollaborator += '&nbsp;&nbsp;'; 
    formCollaborator += '<button type="button" class="btn btn-md btn-go updateCollaborator" value="' + devlId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formCollaborator += '</div>';
    formCollaborator += '<div class="col-md-8 col-lg-9" style="text-align:left;" id="updateCollaboratorResponse"></div>';
    formCollaborator += '</div>';        
    formCollaborator += '</div>';   
    formCollaborator += '</form>';
    $("#devCollaboratorContainer").html(formCollaborator);
});*/

/*$(document).on("click", ".updateCollaborator", function(e) {
    e.preventDefault();
    var formCollaborator = '';
    var devlId = $(this).val(); 
    var collaboratorId = $("#collaboratorId").val();
    var currentCollaboratorName = $("#textCollaboratorName").val().trim();
    var currentCollaboratorLastName = $("#textCollaboratorLastName").val().trim();
    var currentCollaboratorPhone = $("#textCollaboratorPhone").val().trim();
    var currentCollaboratorMail = $("#textCollaboratorMail").val().trim();   
    var collaboratorName = $("#inputCollaboratorName").val().trim();
    var collaboratorLastName = $("#inputCollaboratorLastName").val().trim();
    var collaboratorPhone = $("#inputCollaboratorPhone").val().trim();
    var collaboratorMail = $("#inputCollaboratorMail").val().trim();
    var recordDescription = "Before: " + currentCollaboratorName + " " + currentCollaboratorLastName + " " + currentCollaboratorPhone + " " + currentCollaboratorMail + " " + "/ After: " + collaboratorName + " " + collaboratorLastName + " " + collaboratorPhone + " " + collaboratorMail;
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();      
    var flag = 0;
    var regNumbers = /^\d+$/;
    var regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //console.log(currentCollaboratorName, currentCollaboratorLastName, currentCollaboratorPhone, currentCollaboratorMail);
    //console.log(collaboratorName, collaboratorLastName, collaboratorPhone, collaboratorMail);
    //console.log(recordDescription);
    if (!(regNumbers.test(collaboratorPhone))) {
        if (collaboratorPhone != '') {
            if ($("#inputCollaboratorPhone").next().length == 0) {
                $("#inputCollaboratorPhone").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorPhone").after('<label class="error text-danger" style="font-size:12px;text-align:left">Solo se admiten números.</label>');
            } 
            flag++;
        } else {
            if ($("#inputCollaboratorPhone").next().length == 0) {
                $("#inputCollaboratorPhone").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorPhone").after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un teléfono.</label>');
            }  
            flag++;               
        }
    } else {
        if ($("#inputCollaboratorPhone").next().length > 0) {
            $("#inputCollaboratorPhone").closest('div').parent().removeClass('has-error');
            $("#inputCollaboratorPhone").next('label').remove();
        } 
    }
    if (!(regMail.test(collaboratorMail))) {
        if (collaboratorMail != '') {
            if ($("#inputCollaboratorMail").next().length == 0) {
                $("#inputCollaboratorMail").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorMail").after('<label class="error text-danger" style="font-size:12px;text-align:left">Email inválido.</label>');
            } 
            flag++;
        } else {
            if ($("#inputCollaboratorMail").next().length == 0) {
                $("#inputCollaboratorMail").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorMail").after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Email.</label>');
            }  
            flag++;               
        }
    } else {
        if ($("#inputCollaboratorMail").next().length > 0) {
            $("#inputCollaboratorMail").closest('div').parent().removeClass('has-error');
            $("#inputCollaboratorMail").next('label').remove();
        } 
    }    
    if ((currentCollaboratorName == collaboratorName) && (currentCollaboratorLastName == collaboratorLastName) && (currentCollaboratorPhone == collaboratorPhone) && (currentCollaboratorMail == collaboratorMail)) {
        $("#updateCollaboratorResponse").html('<label style="color:red">No has hecho ningun cambio.</label>');      
        setTimeout(function () { 
            $("#updateCollaboratorResponse").html('');
        }, 2000);         
        flag++;
    }  
    if (flag == 0) { 
        $("#updateCollaboratorResponse").html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto;width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateCollaborator",devlId:devlId,collaboratorId:collaboratorId,collaboratorName:collaboratorName,collaboratorLastName:collaboratorLastName,collaboratorPhone:collaboratorPhone,collaboratorMail:collaboratorMail,recordDescription:recordDescription,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updateCollaboratorResponse").html('<label style="color:green">El nombre se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        formCollaborator += '<input type="hidden" id="collaboratorName" value="' + collaboratorName + '">';
                        formCollaborator += '<input type="hidden" id="collaboratorLastName" value="' + collaboratorLastName + '">';
                        formCollaborator += 'Nombre: <label id="collaboratorNameLabel">' + collaboratorName + ' ' + collaboratorLastName + '</label><br>';
                        formCollaborator += 'Teléfono: <label id="collaboratorPhoneLabel">' + collaboratorPhone + '</label><br>';
                        formCollaborator += 'Mail: <label id="collaboratorMailLabel">' + collaboratorMail + '</label>';
                        $("#devCollaboratorContainer").html(formCollaborator);  
                        $('#updateCollaboratorResponse').html('');
                        $('#devCollaboratorUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $("#updateCollaboratorResponse").html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateCollaboratorResponse').html('');
                        $('#devCollaboratorUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            }
        });      
    }
}); */

/*$(document).on("click", ".cancelCollaborator", function(e) {
    e.preventDefault();
    var formCollaborator = '';
    var devlId = $(this).val(); 
    var collaboratorName = $("#textCollaboratorName").val();
    var collaboratorLastName = $("#textCollaboratorLastName").val();
    var collaboratorPhone = $("#textCollaboratorPhone").val();
    var collaboratorMail = $("#textCollaboratorMail").val();
    $("#devCollaboratorUpdateButton").css("display", "block");
    formCollaborator += '<input type="hidden" id="collaboratorName" value="' + collaboratorName + '">';
    formCollaborator += '<input type="hidden" id="collaboratorLastName" value="' + collaboratorLastName + '">';
    formCollaborator += 'Nombre: <label id="collaboratorNameLabel">' + collaboratorName + ' ' + collaboratorLastName + '</label><br>';
    formCollaborator += 'Teléfono: <label id="collaboratorPhoneLabel">' + collaboratorPhone + '</label><br>';
    formCollaborator += 'Mail: <label id="collaboratorMailLabel">' + collaboratorMail + '</label>';
    $("#devCollaboratorContainer").html(formCollaborator);   
}); */

$(document).on("click", ".updateNameContainer", function(e) {
    e.preventDefault();
    var formName = '';
    var modelId = $(this).attr('name');
    var currentName = $('#nameLabel-' + modelId).html();
    $('#nameUpdateButton-' + modelId).css("display", "none");
    formName = '<form class="form-inline" style="padding-bottom:6px;">';
    formName += '<div class="form-group">';
    formName += '<input type="hidden" id="textName-' + modelId + '" value="' + currentName + '">';
    formName += '<input type="text" class="form-control input-sm" style="max-width:100px;" id="inputName-' + modelId + '" value="' + currentName + '">';
    formName += '&nbsp;&nbsp;';
    formName += '<button type="button" class="btn btn-sm btn-cancel cancelName" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formName += '&nbsp;&nbsp;';  
    formName += '<button type="button" class="btn btn-sm btn-go updateName" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formName += '</div>';    
    formName += '<div class="form-group" id="updateNameResponse-' + modelId + '" style="margin-top:2px">';    
    formName += '</div>';    
    formName += '</form>';
    $("#nameContainer-" + modelId).html(formName);    
});

$(document).on("click", ".cancelName", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var modelName = $("#textName-" + modelId).val();
    $('#nameUpdateButton-' + modelId).css("display", "block");
    $("#nameContainer-" + modelId).html('<label id="nameLabel-' + modelId + '" value="' + modelName + '" style="font-size:16px;font-weight: 600">' + modelName + '</label>');   
}); 

$(document).on("click", ".updateName", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentName = $("#textName-"+modelId).val().trim();
    var modelName = $("#inputName-"+modelId).val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    

    if (currentName == modelName) {
        $("#updateNameResponse-"+modelId).html('<label style="color:red">El nombre no ha sido actualizado.</label>');
        setTimeout(function () { 
            $("#updateNameResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updateNameResponse-"+modelId).html('');
    }

    if (flag == 0) {
        $("#updateNameResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateName",modelId:modelId,modelName:modelName,currentName:currentName,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updateNameResponse-"+modelId).html('<label style="color:green">El nombre se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $("#nameContainer-"+modelId).html('<label id="nameLabel-' + modelId + '" value="' + modelName + '" style="font-size:16px;font-weight: 600">' + modelName + '</label>'); 
                        $("#updateNameResponse-"+modelId).html('');
                        $('#nameUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateNameResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateNameResponse-"+modelId).html('');
                        $('#nameUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            }
        });           
    }  
});

$(document).on("click", ".updatePriceContainer", function(e) {
    e.preventDefault();
    var formPrice = '';
    var modelId = $(this).attr('name');
    var currentPrice = $('#priceLabel-' + modelId).html();
    $('#priceUpdateButton-' + modelId).css("display", "none");
    price = formatoMoneda(currentPrice);
    formPrice = '<form class="form-inline" style="padding-bottom:6px;">';
    formPrice += '<div class="form-group">';
    formPrice += '<input type="hidden" id="textPrice-' + modelId + '" value="' + currentPrice + '">';
    formPrice += '<input type="text" class="form-control input-sm" style="max-width:100px;" id="inputPrice-' + modelId + '" value="' + price + '">';
    formPrice += '&nbsp;&nbsp;';   
    formPrice += '<button type="button" class="btn btn-sm btn-cancel cancelPrice" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formPrice += '&nbsp;&nbsp;';  
    formPrice += '<button type="button" class="btn btn-sm btn-go updatePrice" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formPrice += '</div>';    
    formPrice += '<div class="form-group" id="updatePriceResponse-' + modelId + '" style="margin-top:2px">';    
    formPrice += '</div>';    
    formPrice += '</form>';
    $("#priceContainer-" + modelId).html(formPrice);
});

$(document).on("click", ".cancelPrice", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentPrice = $("#textPrice-" + modelId).val();
    price = formatoMoneda(currentPrice);
    $('#priceUpdateButton-' + modelId).css("display", "block");
    $("#priceContainer-" + modelId).html('<label id="priceLabel-' + modelId + '" value="' + price + '">' + price + '</label>');   
});

$(document).on("click", ".updatePrice", function(e){
    e.preventDefault();
    var modelId = $(this).val();
    var currentPrice = $("#textPrice-"+modelId).val().trim();
    var newPrice = $("#inputPrice-"+modelId).val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();
    var regNum = /^([0-9]+)$/;
    var flag = 0;

    if (newPrice.substring(0,1) == '$') {
        newPrice = newPrice.slice(1);
    }
    newPrice = newPrice.replace(/,/g, '');

    if (currentPrice.substring(0,1) == '$') {
        currentPrice = currentPrice.slice(1);
    }
    currentPrice = currentPrice.replace(/,/g, '');

    if (!(regNum.test(newPrice)) || (newPrice == '')) {
        $("#updatePriceResponse-"+modelId).html('<label style="color:red">Solo puedes introducir números.</label>');
        setTimeout(function () { 
            $("#updatePriceResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updatePriceResponse-"+modelId).html('');
    }

    if (flag == 0) {
        $("#updatePriceResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updatePrice",modelId:modelId,currentPrice:currentPrice,newPrice:newPrice,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updatePriceResponse-"+modelId).html('<label style="color:green">El precio se actualizó con éxito.</label>');
                    price = formatoMoneda(newPrice);
                    setTimeout(function () { 
                        $("#priceContainer-"+modelId).html('<label id="priceLabel-' + modelId + '" value="' + price + '">' + price + '</label>');                    
                        $("#updatePriceResponse-"+modelId).html('');
                        $('#priceUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updatePriceResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updatePriceResponse-"+modelId).html('');
                        $('#priceUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }                    
            }
        });           
    }
});

$(document).on("click", ".updateStatusContainer", function(e) {
    e.preventDefault();
    var formStatus = '';
    var modelId = $(this).attr('name');
    var currentStatus = $('#statusLabel-' + modelId).attr('name');
    $('#statusUpdateButton-' + modelId).css("display", "none");
    formStatus = '<form class="form-inline" style="padding-bottom:6px;">';
    formStatus += '<div class="form-group">';
    formStatus += '<input type="hidden" id="textStatus-' + modelId + '" value="' + currentStatus + '">';
    formStatus += '<select class="form-control input-sm" id="selectStatus-' + modelId + '">';
    formStatus += '<option value="1" '; if (currentStatus == 1) { formStatus += 'selected'; }
    formStatus += '>Activo</option>';
    formStatus += '<option value="2" '; if (currentStatus == 2) { formStatus += 'selected'; }
    formStatus += '>Inactivo</option>';
    formStatus += '</select>';
    formStatus += '&nbsp;&nbsp;'; 
    formStatus += '<button type="button" class="btn btn-sm btn-cancel cancelStatus" value="' + modelId + '" name="' + currentStatus + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formStatus += '&nbsp;&nbsp;';
    formStatus += '<button type="button" class="btn btn-sm btn-go updateStatus" value="' + modelId + '" name="' + currentStatus + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formStatus += '</div>';    
    formStatus += '<div class="form-group" id="updateStatusResponse-' + modelId + '" style="margin-top:2px">';    
    formStatus += '</div>';    
    formStatus += '</form>';
    $("#statusContainer-" + modelId).html(formStatus);
});

$(document).on("click", ".cancelStatus", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var status = $("#textStatus-" + modelId).val();
    if (status == 1) {
        currentStatus = "Activo"
    } else if (status == 2) {
        currentStatus = "Inactivo"
    } else {
        currentStatus = "Error";
    }
    $('#statusUpdateButton-' + modelId).css("display", "block");
    $("#statusContainer-" + modelId).html('<label id="statusLabel-' + modelId + '" name="' + status + '">' + currentStatus + '</label>');   
});

$(document).on("click", ".updateStatus", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentStatus = $("#textStatus-" + modelId).val();
    var newStatus = $("#selectStatus-" + modelId).val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;
    if (newStatus == 1) {
        var status = "Activo"
    } else if (newStatus == 2) {
        var status = "Inactivo"
    } else {
        var status = "Error"
    }
    if (currentStatus == newStatus) {
        $("#updateStatusResponse-"+modelId).html('<label style="color:red">El status no ha sido actualizado.</label>');
        setTimeout(function () { 
            $("#updateStatusResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updateStatusResponse-"+modelId).html('');
    }
    if (flag == 0) {
        $("#updateStatusResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateStatus",modelId:modelId,newStatus:newStatus,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updateStatusResponse-"+modelId).html('<label style="color:green">El status se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#statusContainer-'+modelId).html('<label id="statusLabel-' + modelId + '" name="' + newStatus + '">' + status + '</label>');
                        $("#updateStatusResponse-"+modelId).html('');
                        $('#statusUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateStatusResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateStatusResponse-"+modelId).html('');
                        $('#statusUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            }
        });           
    }    
});

$(document).on("click", ".updateDescriptionContainer", function(e) {
    e.preventDefault();
    var formDescription = '';
    var modelId = $(this).attr('name');
    var currentDescription = $('#descriptionLabel-' + modelId).html();
    $('#descriptionUpdateButton-' + modelId).css("display", "none");
    formDescription = '<form style="padding-bottom:6px;">';
    formDescription += '<input type="hidden" class="form-control input-sm" id="inputdescription-' + modelId + '" value="' + currentDescription + '">';
    formDescription += '<div class="row">';
    formDescription += '<div class="form-group" style="margin:2px;">';
    formDescription += '<div class="col-md-12">';
    formDescription += '<textarea rows="3" style="min-width:100%" id="textDescription-' + modelId + '">' + currentDescription + '</textarea>';
    formDescription += '</div>';  
    formDescription += '</div>';  
    formDescription += '</div>'; 
    formDescription += '<div class="row">';
    formDescription += '<div class="form-group style="margin:2px;">'; 
    formDescription += '<div class="col-md-4">';
    formDescription += '<button type="button" class="btn btn-sm btn-cancel cancelDescription" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formDescription += '&nbsp;&nbsp;';  
    formDescription += '<button type="button" class="btn btn-sm btn-go updateDescription" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formDescription += '</div>'; 
    formDescription += '<div class="col-md-8" id="updateDescriptionResponse-' + modelId + '" style="margin-top:2px">';  
    formDescription += '</div>'; 
    formDescription += '</div>';    
    formDescription += '</div>';  
    formDescription += '</form>';
    $("#descriptionContainer-" + modelId).html(formDescription);    
});

$(document).on("click", ".cancelDescription", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var description = $("#inputdescription-" + modelId).val();
    $('#descriptionUpdateButton-' + modelId).css("display", "block");
    $("#descriptionContainer-" + modelId).html('<label id="descriptionLabel-' + modelId + '">' + description + '</label>');   
});

$(document).on("click", ".updateDescription", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentDescription = $("#inputdescription-" + modelId).val().trim();
    var description = $("#textDescription-" + modelId).val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    if (currentDescription == description) {
        $("#updateDescriptionResponse-" + modelId).html('<label style="color:red">La descripción no ha sido actualizada.</label>');
        setTimeout(function () { 
            $("#updateDescriptionResponse-"+modelId).html('');
        }, 2000);           
        flag++;
    } else { 
        $("#updateDescriptionResponse-"  +modelId).html('');
    }
    if (flag == 0) {
        $("#updateDescriptionResponse-" + modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateDescription",modelId:modelId,description:description,currentDescription:currentDescription,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updateDescriptionResponse-"+modelId).html('<label style="color:green">El status se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $("#descriptionContainer-"+modelId).html('<label id="descriptionLabel-' + modelId + '">' + description + '</label>'); 
                        $("#updateDescriptionResponse-"+modelId).html('');
                        $('#descriptionUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateDescriptionResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateDescriptionResponse-"+modelId).html('');
                        $('#descriptionUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            }
        });           
    }       
});

$(document).on("click", ".updateAreaContainer", function(e) {
    e.preventDefault();
    var formArea = '';
    var modelId = $(this).attr('name');
    var currentLandArea = $('#landAreaLabel-' + modelId).html();
    var currentBuildingArea = $('#buildingAreaLabel-' + modelId).html();
    $('#areaUpdateButton-' + modelId).css("display", "none");
    formArea = '<form style="padding-bottom:6px;">';
    formArea += '<input type="hidden" id="textLandArea-' + modelId + '" value="' + currentLandArea + '">';
    formArea += '<input type="hidden" id="textBuildingArea-' + modelId + '" value="' + currentBuildingArea + '">';
    formArea += '<div class="row">';
    formArea += '<div class="form-group" style="margin:2px;">';
    formArea += '<label class="col-md-4 control-label">Construcción:</label>';
    formArea += '<div class="col-md-4">';
    formArea += '<input type="text" name="name" class="form-control" id="inputBuildingArea-' + modelId + '" style="height:24px;" value="' + currentBuildingArea + '">';
    formArea += '</div>';
    formArea += '<label class="col-md-1 control-label" style="padding:0px;">m&#178;</label>';
    formArea += '</div>';
    formArea += '<div class="form-group" style="margin:2px;">';
    formArea += '<label class="col-md-4 control-label">Terreno:</label>';
    formArea += '<div class="col-md-4">';
    formArea += '<input type="text" name="name" class="form-control" id="inputLandArea-' + modelId + '" style="height:24px;" value="' + currentLandArea + '">';
    formArea += '</div>';
    formArea += '<label class="col-md-1 control-label" style="padding:0px;">m&#178;</label>';
    formArea += '</div>'; 
    formArea += '</div>';  
    formArea += '<div class="row">';
    formArea += '<div class="form-group" style="margin:2px;">';
    formArea += '<div class="col-md-4">';
    formArea += '<button type="button" class="btn btn-md btn-cancel cancelArea" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formArea += '&nbsp;&nbsp;'; 
    formArea += '<button type="button" class="btn btn-md btn-go updateArea" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formArea += '</div>';
    formArea += '<div class="col-sm-8" style="text-align:left;" id="updateAreaResponse-'+ modelId + '"></div>';
    formArea += '</div>';        
    formArea += '</div>';   
    formArea += '</form>';
    $("#areaContainer-" + modelId).html(formArea);    
});

$(document).on("click", ".cancelArea", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var landArea = $("#textLandArea-" + modelId).val();
    var buildingArea = $("#textBuildingArea-" + modelId).val();
    $('#areaUpdateButton-' + modelId).css("display", "block");
    $("#areaContainer-" + modelId).html('Construcción: <label id="buildingAreaLabel-' + modelId + '">' + buildingArea + '</label>&nbsp;m&#178;&nbsp;&nbsp;/&nbsp;&nbsp;Terreno: <label id="landAreaLabel-' + modelId + '">' + landArea + '</label>&nbsp;m&#178;');   
});

$(document).on("click", ".updateArea", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentLandArea = $('#textLandArea-' + modelId).val().trim();
    var currentBuildingArea = $('#textBuildingArea-' + modelId).val().trim();
    var landArea = $('#inputLandArea-' + modelId).val().trim();
    var buildingArea = $('#inputBuildingArea-' + modelId).val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var regex = /^(\d+\.?\d{0,9}|\.\d{1,9})$/;
    var regDec = /^\d+(\.\d{1,2})?$/;
    var flag = 0;    
    console.log(currentLandArea, currentBuildingArea, landArea, buildingArea);
    if ((currentBuildingArea == buildingArea) && (currentLandArea == landArea)) {
        $("#updateAreaResponse-" + modelId).html('<label style="color:red">La superficie no han sido actualizada.</label>');
        setTimeout(function () { 
            $("#updateAreaResponse-" + modelId).html('');
        }, 2000);           
        flag++;
    } else { 
        if (!(regDec.test(buildingArea)) || !(regDec.test(landArea))) {
            $("#updateAreaResponse-" + modelId).html('<label style="color:red">Solo se admiten números.</label>');
            setTimeout(function () { 
                $("#updateAreaResponse-"+modelId).html('');
            }, 2000);           
            flag++;
        } else {
            $("#updateAreaResponse-"  +modelId).html('');
        }
    }
    if (flag == 0) {
        $("#updateAreaResponse-" + modelId).html("<img src='images/loading.gif' style='text-align: left; margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateArea",modelId:modelId,buildingArea:buildingArea,currentBuildingArea:currentBuildingArea,landArea:landArea,currentLandArea:currentLandArea,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    $("#updateAreaResponse-"+modelId).html('<label style="color:green">La superficie se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $("#areaContainer-"+modelId).html('Construcción: <label id="buildingAreaLabel-' + modelId + '">' + buildingArea + '</label>&nbsp;m&#178;&nbsp;&nbsp;/&nbsp;&nbsp;Terreno: <label id="landAreaLabel-' + modelId + '">' + landArea + '</label>&nbsp;m&#178;'); 
                        $("#updateAreaResponse-"+modelId).html('');
                        $('#areaUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateAreaResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateAreaResponse-"+modelId).html('');
                        $('#areaUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            }
        });         
    }  
});

$(document).on("click", ".updateBasicFeatureContainer", function(e) {
    e.preventDefault();
    $("#openBasicFeaturesModal").click();
    var formBasicFeature = '';
    var modelId = $(this).attr('name');
    var modelName = $('#nameLabel-'+modelId).html();
    $("#basicFeaturesModalBody").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getBasicFeatures",modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#basicFeaturesModalTittle").html('Características Básicas / ' + modelName);             
            formBasicFeature += '<form style="text-align:center">';
            $.each(response.basicFeature, function(index, basicFeature) {
                formBasicFeature += '<div class="form-group" style="font-size:14px">';
                formBasicFeature += '<label class="control-label basic-features" id="basic-features-' + basicFeature.id + '" name="' + basicFeature.id + '/' + basicFeature.quantity + '">' + basicFeature.nameText + ': <strong><label id="featureQty-' + basicFeature.id + '">' + basicFeature.quantity + '</label></strong>&nbsp;&nbsp;';
                formBasicFeature += '<a href="#" class="add-Basic-Feature" name="' + basicFeature.id + '"><i class="fa fa-plus" style="color:#5cb85c"></i></a></label>';
                formBasicFeature += '&nbsp;&nbsp;';
                formBasicFeature += '<a href="#" class="subtract-Basic-Feature" name="' + basicFeature.id + '"><i class="fa fa-minus" style="color:#d9534f"></i></a></label>';
                formBasicFeature += '</div>';                              
            });
            formBasicFeature += '<div class="form-group">';
            formBasicFeature += '<input type="hidden" value="' + modelId + '" id="modelIdBasicFea">';
            formBasicFeature += '<button type="button" class="btn btn-sm btn-danger" id="closeBasicFeatureContainer">Cancelar</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-success" id="saveBasicFeatureContainer">Guardar</button>';
            formBasicFeature += '</div>';
            formBasicFeature += '<div class="form-group" id="basicFeaturesResponse">';
            formBasicFeature += '</div>';
            formBasicFeature += '</form>';
            $("#basicFeaturesModalBody").html(formBasicFeature); 
        }
    });
});

$(document).on("click", "#closeBasicFeatureContainer", function(e) {
    e.preventDefault();
    $('#basicFeaturesModal').modal('hide');
});

$(document).on("click", ".add-Basic-Feature", function(e) {
    e.preventDefault();
    var featureId = $(this).attr('name');
    var featureQty = parseInt($('#featureQty-'+featureId).html()) + 1;
    if (featureQty <= 9) {
        $('#featureQty-'+featureId).html(featureQty);
        $('#basic-features-'+featureId).attr('name', featureId + '/' + featureQty);
    }    
});

$(document).on("click", ".subtract-Basic-Feature", function(e) {
    e.preventDefault();
    var featureId = $(this).attr('name');
    var featureQty = parseInt($('#featureQty-'+featureId).html()) - 1;
    if (featureQty >= 0) {
        $('#featureQty-'+featureId).html(featureQty);
        $('#basic-features-'+featureId).attr('name', featureId + '/' + featureQty);
    }
});

$(document).on("click", "#saveBasicFeatureContainer", function(e) {
    e.preventDefault();
    var modelId = $('#modelIdBasicFea').val();
    var arrbasicFeatures = []; 
    var i = 0;
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    $('.basic-features').each(function(i, basicFeatures) {
        arrbasicFeatures[i] = $(basicFeatures).attr('name');
        i++;
     });
     $("#basicFeaturesResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:30px;'>");
     $.ajax({
         type: "GET",
         data: {type:"updateBasicFeatures",modelId:modelId,basicFeatures:arrbasicFeatures,utc:utc},
         url: "./php/adminData.php", 
         dataType: 'json',
         success: function(response) {
             if (response) {
                 $("#basicFeaturesResponse").html('<label style="color:green">Las características se actualizaron con éxito.</label>');
                 setTimeout(function () { 
                     $("#basicFeaturesResponse").html('');
                     $('#basicFeaturesModal').modal('hide');
                 }, 2000);
                 getBasicFeatures(modelId);
             } else {
                 $("#basicFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
                 setTimeout(function () { 
                     $("#basicFeaturesResponse").html('');
                     $('#basicFeaturesModal').modal('hide');
                 }, 2000);                
             }
         }
     });
});

$(document).on("click", ".updateAdditionalFeatureContainer", function(e) {
    e.preventDefault();
    $("#openAdditionalFeaturesModal").click();
    var formAdditionalFeature = '';
    var modelId = $(this).attr('name');
    var modelName = $('#nameLabel-'+modelId).html();
    $("#additionalFeaturesModalBody").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getAdditionalFeatures",modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#additionalFeaturesModalTittle").html('Características Básicas / ' + modelName);     
            formAdditionalFeature += '<form class="form-horizontal" style="margin-left:6px">';
            formAdditionalFeature += '<div class="form-group">';
            $.each(response.additionalFeature, function(index, additionalFeature) {
                formAdditionalFeature += '<div class="col-sm-4">';
                if (additionalFeature.quantity != 0) {
                    formAdditionalFeature += '<input type="checkbox" class="additional-Feature" value="' + additionalFeature.id + '" checked>';
                } else {
                    formAdditionalFeature += '<input type="checkbox" class="additional-Feature" value="' + additionalFeature.id + '">';
                }
                formAdditionalFeature += '&nbsp;<label class="control-label">'+additionalFeature.nameText+'</label>';
                formAdditionalFeature += '</div>';              
            });
            formAdditionalFeature += '</div>'; 
            formAdditionalFeature += '<div class="form-group" style="text-align:center">';
            formAdditionalFeature += '<input type="hidden" value="' + modelId + '" id="modelIdAdditionalFea">';
            formAdditionalFeature += '<button type="button" class="btn btn-sm btn-danger" id="closeAdditionalFeatureContainer">Cancelar</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-success" id="saveAdditionalFeatureContainer">Guardar</button>';
            formAdditionalFeature += '</div>';
            formAdditionalFeature += '<div class="form-group" style="text-align:center" id="additionalFeaturesResponse">';
            formAdditionalFeature += '</div>';                
            formAdditionalFeature += '</form>';
            $("#additionalFeaturesModalBody").html(formAdditionalFeature);
        }
    });
});

$(document).on("click", "#closeAdditionalFeatureContainer", function(e) {
    e.preventDefault();
    $('#additionalFeaturesModal').modal('hide');
});

$(document).on("click", "#saveAdditionalFeatureContainer", function(e) {
    e.preventDefault();
    var modelId = $('#modelIdAdditionalFea').val();
    var arrAdditionalFeatures = []; 
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();      
    $('.additional-Feature').each(function(i, additionalFeatures) {
        if (additionalFeatures.checked) {
            featureId = additionalFeatures.value;
            arrAdditionalFeatures[i] = featureId + '/1'
        } else {
            featureId = additionalFeatures.value;
            arrAdditionalFeatures[i] = featureId + '/0'
        }
        i++;
    });
    $("#additionalFeaturesResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
    $.ajax({
        type: "GET",
        data: {type:"updateAdditionalFeatures",modelId:modelId,additionalFeatures:arrAdditionalFeatures,utc:utc},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response) {
                $("#additionalFeaturesResponse").html('<label style="color:green">Las características se actualizaron con éxito.</label>');
                setTimeout(function () { 
                    $("#additionalFeaturesResponse").html('');
                    $('#additionalFeaturesModal').modal('hide');
                }, 2000);
                getAdditionalFeatures(modelId);
            } else {
                $("#additionalFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#additionalFeaturesResponse").html('');
                    $('#additionalFeaturesModal').modal('hide');
                }, 2000);                
            }
        }
     });
});

function getDevelopers() {
    $.ajax({
        type: "GET",
        data: {type:"getDevelopers"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#developer").empty();
            $("#developer").append("<option value='0'>Selecciona...</option>");
            $.each(response.developer, function(index, developer) {
                developers = "<option value='" + developer.id + "'>" + developer.name + "</option>";
                $("#developer").append(developers);
            });
        }
    });	
}

function getStates(developerId) {
    $.ajax({
        type: "GET",
        data: {type:"getStates",developerId:developerId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#state").empty();
            $("#state").append("<option value='0'>Selecciona...</option>");
            $.each(response.state, function(index, state) {
                states = "<option value='" + state.id + "'>" + state.name + "</option>";
                $("#state").append(states);
            });
        }
    });	
}

function getLocalities(developerId, stateId) {
    $.ajax({
        type: "GET",
        data: {type:"getLocalities",developerId:developerId,stateId:stateId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#locality").empty();
            $("#locality").append("<option value='0'>Selecciona...</option>");
            $.each(response.locality, function(index, locality) {
                localities = "<option value='" + locality.id + "'>" + locality.name + "</option>";
                $("#locality").append(localities);
            });
        }
    });	
}

function getDevelopments(developerId, stateId, localityId) {
    $.ajax({
        type: "GET",
        data: {type:"getDevelopments",developerId:developerId,stateId:stateId,localityId:localityId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $("#development").empty();
            $("#development").append("<option value='0'>Selecciona...</option>");
            $.each(response.development, function(index, development) {
                developments = "<option value='" + development.id + "'>" + development.name + "</option>";
                $("#development").append(developments);
            });
        }
    });	
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

function getBasicFeatures(modelId) {
    basicFeaturesColumn = '';
    $("#basicFeaturesContainer-" + modelId).html("<div style='text-align:left;'><img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:30px;'></div>");
    $.ajax({
        type: "GET",
        data: {type:"getBasicFeatures",modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $.each(response.basicFeature, function(index, basicFeature) {
                basicFeaturesColumn +=  basicFeature.nameText + ': ' + basicFeature.quantity + '<br>';
            })
            $("#basicFeaturesContainer-" + modelId).html(basicFeaturesColumn);      
        }
    });	
}

function getAdditionalFeatures(modelId) {
    additionalFeaturesColumn = '';
    $("#additionalFeaturesContainer-" + modelId).html("<div style='text-align:left;'><img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:30px;'></div>");
    $.ajax({
        type: "GET",
        data: {type:"getAdditionalFeatures",modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $.each(response.additionalFeature, function(index, additionalFeature) {
                if (additionalFeature.quantity != 0) {
                    additionalFeaturesColumn += additionalFeature.nameText + '; ';
                }               
            })
            $("#additionalFeaturesContainer-" + modelId).html(additionalFeaturesColumn);      
        }
    });	
}