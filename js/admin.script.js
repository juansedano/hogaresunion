//v=01.1.4 05/11/2019
$(document).ready(function () {
    getDevelopers();
    //$('#openUploadImagesModal').click();
    //getDevelopmentData('Grupo Mauricio Suárez', 391, 'Zion');
    //getModels(391, 'Zion');
    //newDevLocalities();
    //getModels(262, 'New Development');
    //getDevelopmentData("Desarrollador", 391, "Test");
    //http://www.java2s.com/Code/JavaScript/Language-Basics/UsingtheindexOfMethodtoFindAllOccurrencesoftheLettereinaSentence.htm

    $("#basicFeaturesModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    });

    $("#additionalFeaturesModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    }); 
    
    $("#openCollaboratorModel").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    });     
    
    $("#developmentFeaturesModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    });  
    
    $("#alertModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    });    
    
    $("#openNewLocalityModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open");
    });
    getCategory();
    getNegotation();
});

$(document).on("click", "#searchItems", function(e) {
    e.preventDefault();
    var resultTable = '';
    //var re;
    //var name;
    var description;
    var counter = 0;
    var searchInput = $('#searchInput').val();
    var searchType = $('#searchOption').val();  
    if (searchInput != '') { 
        searchInput = searchInput.trim();
        if($('#searchResultPanel').hasClass('maximize')) {
            $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideDown(200);
            $('#searchResultPanel').removeClass('maximize');
            $('#searchResultPanel').find('i').removeClass('fa-plus').addClass('fa-minus');
            $('#searchResultPanel').attr('data-original-title','Minimize Panel').tooltip();
        }
        $("#developmentContainer").css("display", "none");
        $("#resultsContainerModels").css("display", "none");
        $("#searchResultContainer").css("display", "block");
        $('#searchDataContainer').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
        $.ajax({
            type: "GET",
            data: {type:"getSearchResult",searchType:searchType,searchInput:searchInput},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                searchInput = searchInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                resultTable += '<table class="table table-striped" style="width:100%">';
                resultTable += '<thead><tr><th>Desarrollador</th><th>Desarrollo</th><th>Status</th><th>Modelo</th><th>Status</th>.<th style="width:20%">Colaboradores Centrales</th><th style="width:20%">Colaboradores Locales</th><th>Estado</th><th>Localidad</th><th>&nbsp;</th></tr></thead>';            
                $.each(response.result, function(index, result) {
                    id = result.id;
                    developer = result.developer;
                    development = result.development;
                    model = result.model;
                    modelId = result.modelId;
                    description = result.description;
                    state = result.state;
                    stateId = result.stateId;
                    locality = result.locality;
                    localityId = result.localityId;
                    devstatus = result.devstatus;
                    modelstatus = result.modelstatus;
                    stateUrl = result.stateUrl;
                    localityUrl = result.localityUrl;
                    type = result.type;
                    central = (result.central!=null) ? result.central.replace(/['"]+/g, '').split(",").join("; "):"";
                    local = (result.local!=null) ? result.local.replace(/['"]+/g, '').split(",").join("; "):"";
                    if ((model != '') || (model != null)) { 
                        var modelUrl = "";
                        if (result.modelUrl==''||result.modelUrl==null) { modelUrl = `https://tratodirecto.com/${result.developmentNn}/${result.developerNn}/${result.modelNn}/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else {  modelUrl = result.modelUrl; }
                        rowModel = '<a href="' + modelUrl + '" target="_blank">' + modelId + ' - ' + model + '</a>'; 
                        rowModelStatus = modelstatus;
                    } else { 
                        rowModel = 'NA';
                        rowModelStatus = 'NA';
                    }
                    var devUrl = "";
                    if (result.developmentUrl==''||result.developmentUrl==null) { devUrl = `https://tratodirecto.com/${result.developmentNn}/${result.developerNn}/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else { devUrl = result.developmentUrl; }
                    var localityUrl = "";
                    if (result.localityUrl==''||result.localityUrl==null) { localityUrl = `https://tratodirecto.com/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else { localityUrl = result.localityUrl; }
                    var stateUrl = "";
                    if (result.stateUrl==''||result.stateUrl==null) { stateUrl = `https://tratodirecto.com/casas-en-venta-${result.stateNn}.html`;} else { stateUrl = result.stateUrl; }
                    resultTable += '<tr>';     
                    resultTable += '<input type="hidden" id="searchResultDeveloperName-' + id + '" value="' + developer + '">';    
                    resultTable += '<input type="hidden" id="searchResultDevelopmentName-' + id + '" value="' + development + '">';              
                    resultTable += '<td style="vertical-align: middle;">' + developer + '</td>';
                    resultTable += '<td style="vertical-align: middle;"><a href="' + devUrl + '" target="_blank">' + result.id + ' - ' + development + '</a></td>';
                    resultTable += '<td style="vertical-align: middle;">' + devstatus + '</td>';
                    if (modelId == 0) {
                        resultTable += '<td style="vertical-align: middle;">&nbsp;</td>';  
                    } else {
                        resultTable += '<td style="vertical-align: middle;">' + rowModel + '</td>';  
                    }
                    resultTable += '<td style="vertical-align: middle;">' + rowModelStatus + '</td>'; 
                    resultTable += '<td style="vertical-align: middle;">' + central.split("Central ").join("") + '</td>'; 
                    resultTable += '<td style="vertical-align: middle;">' + local.split("Local ").join("") + '</td>'; 
                    resultTable += '<td style="vertical-align: middle;"><a href="' + stateUrl + '" target="_blank">' + state + '</a></td>';   
                    resultTable += '<td style="vertical-align: middle;"><a href="' + localityUrl + '" target="_blank">' + locality + '</a></td>';                                                  
                    resultTable += '<td style="vertical-align: middle;"><button type="button" class="btn btn-sm btn-normal showResultDetail" name="' + result.id  + '" title="Editar"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button></td>';
                    resultTable += '</tr>';   
                    counter++;             
                });
                resultTable += '</table>';
                $('#searchDataContainer').html(resultTable);
                $('#searchTittle').html('Resultado de la búsqueda (' + counter + ')');
            }
        });
    }
});

$("#searchInput").on('keyup', function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchItems").click();
    }
});

$(document).on("click", ".showResultDetail", function(e) {
    e.preventDefault();
    if(!$('#searchResultPanel').hasClass('maximize')) {
        $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideUp(200);
        $('#searchResultPanel').addClass('maximize');
        $('#searchResultPanel').find('i').removeClass('fa-minus').addClass('fa-plus');
        $('#searchResultPanel').attr('data-original-title','Maximize Panel').tooltip();
     } else {
        $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideDown(200);
        $('#searchResultPanel').removeClass('maximize');
        $('#searchResultPanel').find('i').removeClass('fa-plus').addClass('fa-minus');
        $('#searchResultPanel').attr('data-original-title','Minimize Panel').tooltip();
     }
    var developmentId = $(this).attr('name');
    var developerName = $("#searchResultDeveloperName-" + developmentId).val();
    var developmentName = $("#searchResultDevelopmentName-" + developmentId).val();  
    //console.log(developmentId, developerName, developmentName);
    if (developmentId != 0) {
        getDevelopmentData(developerName, developmentId, developmentName);        
        getModels(developmentId, developmentName);
    }    
});

$("#developer").change(function(){
    var developerId = $(this).val();
    $("#resultsContainerModels").css("display", "none");
    $("#modelsContainer").html('');
    $("#developmentContainer").css("display", "none");
    $("#developmentDataContainer").html(''); 
    $('#newDevelopmentContainer').css('display', 'none');  
    $('#newDevelopmentNameSubTittle').html('');      
    if (developerId != 0 ) {
        $("#newDevelopmentButton").css("display", "block");
        $("#state").prop("disabled", false);
        $("#state").val(0).trigger('change');   
        if ($('#locality').prop("disabled") == false) {
            $("#locality").prop("disabled", true);
            $("#locality").val(0).trigger('change'); 
        }
        
        if ($('#development').prop("disabled") == false) {
            $("#development").prop("disabled", true);
            $("#development").val(0).trigger('change'); 
        }              
        getStates(developerId);
        searchOptions(developerId, 0, 0, 0);
    } else {
        $("#state").prop("disabled", true);
        $("#state").val(0).trigger('change'); 
        $("#locality").prop("disabled", true);
        $("#locality").val(0).trigger('change'); 
        $("#development").prop("disabled", true);
        $("#development").val(0).trigger('change');    
        $('#searchResultPanel').css('display', 'none'); 
        //$("#newDevelopmentButton").css("display", "none");             
    }
});

var negotationOptions = [];
function getNegotation() {
    $.ajax({
        type: 'GET',
        data: {type:'getNegotations'},
        url: './php/adminData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                response.forEach(element => {
                    negotationOptions.push({
                        "id": element.id,
                        "name": element.name
                    });
                });
            }
        }
    });
}

var categoryOptions = [];
function getCategory() {
    $.ajax({
        type: 'GET',
        data: {type:'getCategories'},
        url: './php/adminData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                response.forEach(element => {
                    categoryOptions.push({
                        "id": element.id,
                        "name": element.name
                    });
                });
            }
        }
    });
}

function searchOptions(developerOption, stateOption, localityOption, developmentOption) {
//$(document).on("click", "#searchOptions", function(e) {
    var developmentCount = 0;
    var modelCount = 0;
    var resultTable = '';
    var counter = 0;
    //var developerOption = $("#developer").val();
    //var stateOption  = $("#state").val();
    //var localityOption  = $("#locality").val();
    //var developmentOption  = $("#development").val();
    if ($('#searchResultPanel').hasClass('maximize')) {
        $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideDown(200);
        $('#searchResultPanel').removeClass('maximize');
        $('#searchResultPanel').find('i').removeClass('fa-plus').addClass('fa-minus');
        $('#searchResultPanel').attr('data-original-title','Minimize Panel').tooltip();
    }
    $("#developmentContainer").css("display", "none");
    $("#resultsContainerModels").css("display", "none");
    $("#searchResultContainer").css("display", "block");
    $('#searchDataContainer').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "GET",
        data: {type:"getSearchResultByOptions",developerOption:developerOption, stateOption:stateOption, localityOption:localityOption, developmentOption:developmentOption},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            resultTable += '<table class="table table-striped" style="width:100%">';
            resultTable += '<thead><tr><th>Desarrollador</th><th>Desarrollo</th><th>Status</th><th>Modelo</th><th>Status</th>.<th style="width:20%">Colaboradores Centrales</th><th style="width:20%">Colaboradores Locales</th><th>Estado</th><th>Localidad</th><th>&nbsp;</th></tr></thead>';            
            $.each(response.result, function(index, result) {
                id = result.id;
                developer = result.developer;
                development = result.development;
                model = result.model;
                modelId = result.modelId;
                description = result.description;
                state = result.state;
                stateId = result.stateId;
                locality = result.locality;
                localityId = result.localityId;
                type = result.type;
                devStatus = result.devStatus;
                modelStatus = result.modelStatus;
                stateUrl = result.stateUrl;
                localityUrl = result.localityUrl;
                central = (result.central!=null) ? result.central.replace(/['"]+/g, '').split(",").join("; "):"";
                local = (result.local!=null) ? result.local.replace(/['"]+/g, '').split(",").join("; "):"";
                if (type == 'Development') {
                    developmentCount++;
                } else {
                    modelCount++;
                }
                if ((model != '') || (model != null)) { 
                    var modelUrl = "";
                    if (result.modelUrl==''||result.modelUrl==null) { modelUrl = `https://tratodirecto.com/${result.developmentNn}/${result.developerNn}/${result.modelNn}/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else {  modelUrl = result.modelUrl; }
                    rowModel = '<a href="' + modelUrl + '" target="_blank">' + model + '</a>';
                    rowModelStatus = modelStatus;
                } else { 
                    rowModel = 'NA';
                    rowModelStatus = 'NA';
                }
                var devUrl = "";
                if (result.developmentUrl==''||result.developmentUrl==null) { devUrl = `https://tratodirecto.com/${result.developmentNn}/${result.developerNn}/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else { devUrl = result.developmentUrl; }
                var localityUrl = "";
                if (result.localityUrl==''||result.localityUrl==null) { localityUrl = `https://tratodirecto.com/casas-en-venta-${result.localityNn}/${result.stateNn}.html`;} else { localityUrl = result.localityUrl; }
                var stateUrl = "";
                if (result.stateUrl==''||result.stateUrl==null) { stateUrl = `https://tratodirecto.com/casas-en-venta-${result.stateNn}.html`;} else { stateUrl = result.stateUrl; }
                resultTable += '<tr>';     
                resultTable += '<input type="hidden" id="searchResultDeveloperName-' + id + '" value="' + developer + '">';    
                resultTable += '<input type="hidden" id="searchResultDevelopmentName-' + id + '" value="' + development + '">';              
                resultTable += '<td style="vertical-align: middle;">' + developer + '</td>';
                resultTable += '<td style="vertical-align: middle;"><a href="' + devUrl + '" target="_blank">' + development + '</a></td>';
                resultTable += '<td style="vertical-align: middle;">' + devStatus + '</td>';
                resultTable += '<td style="vertical-align: middle;">' + rowModel + '</td>';   
                resultTable += '<td style="vertical-align: middle;">' + rowModelStatus + '</td>';   
                resultTable += '<td style="vertical-align: middle;">' + central.split("Central ").join("") + '</td>'; 
                resultTable += '<td style="vertical-align: middle;">' + local.split("Local ").join("") + '</td>'; 
                resultTable += '<td style="vertical-align: middle;"><a href="' + stateUrl + '" target="_blank">' + state + '</a></td>';   
                resultTable += '<td style="vertical-align: middle;"><a href="' + localityUrl + '" target="_blank">' + locality + '</a></td>';                                                  
                resultTable += '<td style="vertical-align: middle;"><button type="button" class="btn btn-sm btn-normal showResultDetail" name="' + result.id  + '" title="Editar"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button></td>';
                resultTable += '</tr>';   
                counter++;             
            });
            resultTable += '</table>';
            $('#searchDataContainer').html(resultTable);
            $('#searchTittle').html('Desarrollos: ' + developmentCount + ' / Modelos: '+ modelCount);
        }
    });
//});
}

$(document).on("click", "#newDevelopmentButton", function(e) {
    e.preventDefault();
    var development;
    var developerId = $('#developer').val();
    var developerName = $('option:selected', '#developer').text();  
    $('#newDevelopmentContainer').css('display', 'block');  
    development = '<table style="width:100%">';
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:middle;width:120px">Desarrollador</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">'+developerName+'</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';  
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Nombre</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<input type="text" class="form-control input-sm" style="width:250px;" id="newDevName" placeholder="Nombre del desarrollo" />';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Status</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:120px;" id="newDevStatus">';
    development += '<option value="0">Seleciona...</option>';           
    development += '<option value="1">Activo</option>';   
    development += '<option value="2">Inactivo</option>';      
    development += '<option value="9">Demo</option>';   
    development += '</select>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:68px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Descripción Comercial</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<textarea rows="3" class="form-control" style="min-width:100%" id="newDevDescription"></textarea>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:68px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Slogan</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<textarea rows="2" class="form-control" style="min-width:100%" id="newDevSlogan"></textarea>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Categoria</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:120px;" id="newDevCat">';
    categoryOptions.forEach(element => {
        development += '<option value="'+ element.id +'">'+ element.name +'</option>';  
    });          
    development += '</select>';  
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Tipo de Negocio</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:150px;" id="newDevDeal">';
    negotationOptions.forEach(element => {
        if (element.id == "3") {
            development += '<option value="'+ element.id +'" selected>'+ element.name +'</option>';
        } else {
            development += '<option value="'+ element.id +'">'+ element.name +'</option>'; 
        } 
    });          
    development += '</select>';  
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Zona</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:120px;" id="newDevZone">';
    development += '<option value="0">Ninguna</option>';            
    development += '</select>';  
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:80px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Geoposición del Desarrollo</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<div class="row" style="padding-top:2px;" id="newDevLatitudeContainer">';
    development += '<div class="col-xs-6 col-sm-4  col-md-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevLatitude"  placeholder="Latitud"  />';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-8  col-md-8" style="line-height: 40px;">';
    development += 'Latitud';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;" id="newDevLongitudeContainer">';
    development += '<div class="col-xs-6 col-sm-4  col-md-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevLongitude"  placeholder="Longitud"  />';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-8  col-md-8" style="line-height: 40px;">';
    development += 'Longitud';
    development += '</div>'; 
    development += '</div>';              
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';   
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:222px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Dirección</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<div class="row" style="padding-top:2px;">';
    development += '<div class="col-xs-9 col-sm-6">';
    development += '<input type="text" class="form-control input-sm" id="newDevStreet"  placeholder="Calle"  />';
    development += '</div>'; 
    development += '<div class="col-xs-3 col-sm-6" style="line-height: 40px;">';
    development += 'Calle';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;">';
    development += '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevExtNum"  placeholder="No. Ext."  />';
    development += '</div>'; 
    development += '<div class="col-xs-8 col-sm-8 col-md-9 col-lg-8" style="line-height: 40px;">';
    development += 'No. Exterior';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;">';
    development += '<div class="col-xs-4 col-sm-4 col-md-3 col-lg-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevIntNum"  placeholder="No. Int."  />';
    development += '</div>'; 
    development += '<div class="col-xs-8 col-sm-8 col-md-9 col-lg-8" style="line-height: 40px;">';
    development += 'No. Interior';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;" id="newDevStatesContainer">';
    development += '<div class="col-xs-6 col-sm-8 col-md-8">';
    development += '<select class="form-control input-sm" id="newDevStates" disabled><option value="0">Selecciona...</option></select>';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-4 col-md-4" style="line-height: 40px;">';
    development += 'Estado';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;" id="newDevLocalitiesContainer">';
    development += '<div class="col-xs-6 col-sm-8 col-md-8">';
    development += '<select class="form-control input-sm" id="newDevLocalities" disabled><option value="0">Selecciona...</option></select>';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-4 col-md-4" style="line-height: 40px;">';
    development += 'Municipio';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;" id="newDevPostalCodeContainer">';
    development += '<div class="col-xs-4 col-sm-4 col-md-4 col-lg-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevPostalCode" placeholder="C.P." />';
    development += '</div>'; 
    development += '<div class="col-xs-8 col-sm-8 col-md-8 col-lg-8" style="line-height: 40px;">';
    development += 'Código Postal';
    development += '</div>'; 
    development += '</div>'; 
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';  
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:68px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Cómo llegar</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<textarea rows="2" class="form-control" style="min-width:100%" id="newDevDirections"></textarea>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:80px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Geoposición de Punto de Venta</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<div class="row" style="padding-top:2px;" id="newDevSPLatitudeContainer">';
    development += '<div class="col-xs-6 col-sm-4 col-md-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevSPLatitude"  placeholder="Latitud"  />';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-8 col-md-8" style="line-height: 40px;">';
    development += 'Latitud';
    development += '</div>'; 
    development += '</div>'; 
    development += '<div class="row" style="padding-top:2px;" id="newDevSPLongitudeContainer">';
    development += '<div class="col-xs-6 col-sm-4 col-md-4">';
    development += '<input type="text" class="form-control input-sm" id="newDevSPLongitude"  placeholder="Longitud"  />';
    development += '</div>'; 
    development += '<div class="col-xs-6 col-sm-8 col-md-8" style="line-height: 40px;">';
    development += 'Longitud';
    development += '</div>'; 
    development += '</div>';     
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';   
    development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    development += '<td style="vertical-align:top;padding-top:4px;width:120px;padding-bottom:4px;">Colaboradores</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;padding-bottom:4px;">';
    development += '<div class="row" style="padding-top:2px;">';
    development += '<div class="col-sm-6 col-md-6 col-lg-4">';
    development += '<select class="form-control input-sm" id="newDevCollaborator" disabled>';
    development += '<option value="0">Seleciona...</option>';
    development += '</select>';
    development += '</div>';    
    development += '<div class="col-sm-6 col-md-6 col-lg-4">';
    development += '<select class="form-control input-sm" id="newDevCollaboratorRole">';
    development += '<option value="0">Seleciona...</option>';            
    development += '<option value="12">Local Gerente de Leads</option>';
    development += '<option value="3">Local Gestor de Leads</option>';
    development += '<option value="13">Smarto Afiliador</option>';
    development += '<option value="16">Smarto Vendedor</option>';
    development += '</select>';  
    development += '</div>';
    development += '<div class="col-sm-4 col-md-4 col-lg-4">';
    development += '<button class="btn btn-primary buttons" style="background-color:#FFB71B;" id="devCollaboratorsContainer">Agregar</button>';      
    development += '</div>';  
    development += '</div>'; 
    development += '<div class="row" style="margin:0;padding-top:2px;">';
    development += '<div id="newDevCollaboratorsContainer">'; 
    development += '</div>'; 
    development += '</div>'; 
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>'; 
    development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Características</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<div class="form-group form-inline" style="margin:0;padding-top:2px;padding-top:4px;padding-bottom:4px;">';   
    development += '<button class="btn btn-primary buttons" style="background-color:#FFB71B;" id="devFeaturesContainer">Agregar Características</button>';      
    development += '</div>';
    development += '<div id="newDevFeaturesContainer">';  
    development += '</div>';        
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';   
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Contact Center</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:120px;" id="newDevContactCenter">';
    development += '<option value="none">Seleciona...</option>';           
    development += '<option value="1">Activo</option>';   
    development += '<option value="0">Inactivo</option>';         
    development += '</select>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';   
    development += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    development += '<td style="vertical-align:top;padding-top:8px;width:120px">Tipo de Visita</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;">';
    development += '<select class="form-control input-sm" style="width:120px;" id="newDevVisitsAllowed">';
    development += '<option value="none">Seleciona...</option>';           
    development += '<option value="0">Física</option>';   
    development += '<option value="1">Virtual</option>';         
    development += '</select>';
    development += '</td>';
    development += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    development += '</tr>';              
    development += '<tr style="padding-top:8px;">';
    development += '<td colspan="3" style="vertical-align:middle;text-align:center;padding-top:8px;">';
    development += '<button type="button" class="btn btn-sm btn-success" id="addnewDev">Agregar Desarrollo</button>';
    development += '<div style="vertical-align:middle;text-align:center;" id="addNewDevResponse"></div>';
    development += '</td>';
    development += '</tr>';      
    development += '<input type="hidden" id="newDevDeveloperId" value="'+developerId+'" />';
    development += '<input type="hidden" id="newDevDeveloperName" value="'+developerName+'" />';           
    development += '</table>';  

    /*development += '<form action="files" id="imgInp" class="dropzone dz-clickable">';
    development += '<div class="dz-default dz-message"><span>Drop files here to upload</span></div>';
    development += '</form>';

    development += '<form action="files" class="dropzone">';
    development += '<div class="fallback">';
    development += '<input name="file" type="file" multiple />';
    development += '</div>';
    development += '</form>';*/

    /*development += '<input type="file" id="imgInp" title=" " multiple/>';
    development += '<div id="images"></div>';*/
    //development += '<img id="blah" src="#" alt="your image" />';
    $("#newDevelopmentDataContainer").html(''); 
    getZones('0', 'newDevZone');
    getCollaborators(developerId);
    getAllStatesAvailable();
    $("#newDevelopmentDataContainer").append(development); 
});

$(document).on("click", "#newModelButton", function(e) {
    e.preventDefault();
    var model;
    var developmentId = $(this).attr("data-developmentId");
    var developmenName = $(this).attr("data-developmentName"); 
    model = '<table style="width:100%">'; 
    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:40px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Nombre</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<input type="text" class="form-control input-sm" style="width:250px;" id="newModelName" placeholder="Nombre del Modelo" />';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>'; 
    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:40px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Tipo de Propiedad</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<select class="form-control input-sm" style="width:180px;" id="newModelPropertyType" disabled><option value="0">Selecciona...</option></select>';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>'; 
    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:40px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Niveles</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<select class="form-control input-sm" style="width:120px;" id="newModelLevels">';
    model += '<option value="0">Seleciona...</option>';           
    model += '<option value="1">1 Nivel</option>';   
    for (var i = 2; i<=6; i++) {
        model += '<option value="'+i+'">'+i+' Niveles</option>';    
    }  
    model += '</select>';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';   

    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:40px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:200px">Precio MXN</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<div class="row" style="padding-top:2px;" id="newModelPriceContainer">';
    model += '<div class="col-md-6">';
    model += '<input type="text" class="form-control input-sm" id="newModelPrice" placeholder="$0" />';
    model += '</div>'; 
    model += '<div class="col-md-6" id="minPrice" style="line-height: 40px;">';
    model += '</div>'; 
    model += '</div>'; 
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';   

    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Status</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<select class="form-control input-sm" style="width:120px;" id="newModelStatus">';
    model += '<option value="0">Seleciona...</option>';           
    model += '<option value="1">Activo</option>';   
    model += '<option value="2">Inactivo</option>';      
    model += '<option value="9">Demo</option>';   
    model += '</select>';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>'; 
    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:68px;">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Descripción</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;padding-bottom:4px;padding-top:4px">';
    model += '<textarea rows="3" class="form-control" style="min-width:100%" id="newModelDescription"></textarea>';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';

    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:46px;">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Disponibilidad</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;padding-bottom:4px;padding-top:4px">';
    model += '<div class="row">';
    model += '<div class="col-md-6">';
    model += '<select class="form-control input-sm" id="newModelMonthAvailability">';
    model += '<option value="01">Enero</option>';
    model += '<option value="02">Febrero</option>';
    model += '<option value="03">Marzo</option>';
    model += '<option value="04">Abril</option>';
    model += '<option value="05">Mayo</option>';
    model += '<option value="06">Junio</option>';
    model += '<option value="07">Julio</option>';
    model += '<option value="08">Agosto</option>';
    model += '<option value="09">Septiembre</option>';
    model += '<option value="10">Octubre</option>';
    model += '<option value="11">Noviembre</option>';
    model += '<option value="12">Diciembre</option>';
    model += '</select>'; 
    model += '</div>';
    model += '<div class="col-md-6">';
    model += '<select class="form-control input-sm" style="width:70px;" id="newModelYearAvailability">';
    model += '<option value="2018">2018</option>';
    model += '<option value="2019">2019</option>';
    model += '<option value="2020">2020</option>';
    model += '<option value="2021">2021</option>';
    model += '<option value="2022">2022</option>';
    model += '<option value="2023">2023</option>';
    model += '<option value="2024">2024</option>';
    model += '<option value="2025">2025</option>';
    model += '</select>'; 
    model += '</div>';
    model += '</div>';
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';

    model += '<tr style="border-bottom: 1px dotted #eeeeee;height:80px">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Superficie</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<div class="row" style="padding-top:2px;" id="newModelLandContainer">';
    model += '<div class="col-sm-6">';
    model += '<input type="text" class="form-control input-sm" id="newModelLand" placeholder="Terreno" />';
    model += '</div>'; 
    model += '<div class="col-sm-6" style="line-height: 40px;">';
    model += 'Terreno m²';
    model += '</div>'; 
    model += '</div>'; 
    model += '<div class="row" style="padding-top:2px;" id="newModelBuildingContainer">';
    model += '<div class="col-sm-6">';
    model += '<input type="text" class="form-control input-sm" id="newModelBuilding" placeholder="Construcción" />';
    model += '</div>'; 
    model += '<div class="col-sm-6" style="line-height: 40px;">';
    model += 'Construcción m²';
    model += '</div>'; 
    model += '</div>'; 
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>'; 
    model += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Características Básicas</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;padding-bottom:4px"><div id="basicFeaturesNewModelContainer">';
    model += '</div></td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';       
    model += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    model += '<td style="vertical-align:top;padding-top:8px;width:120px">Características Adicionales</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;">';
    model += '<div class="form-group form-inline" style="margin:0;padding-top:2px;padding-top:4px;padding-bottom:4px;">';   
    model += '<button class="btn btn-primary buttons" style="background-color:#FFB71B;" id="modelFeatureContainer">Agregar Características</button>';      
    model += '</div>';
    model += '<div id="newModelFeaturesContainer">';  
    model += '</div>';        
    model += '</td>';
    model += '<td style="vertical-align:middle;padding-left:8px;text-align:right;">&nbsp;</td>';
    model += '</tr>';          
    model += '<tr style="padding-top:8px;">';
    model += '<td colspan="3" style="vertical-align:middle;text-align:center;padding-top:8px;">';
    model += '<button type="button" class="btn btn-sm btn-success" id="addnewModel">Agregar Modelo</button>';
    model += '<div style="vertical-align:middle;text-align:center;" id="addNewModelResponse"></div>';
    model += '</td>';
    model += '</tr>';  
    model += '<input type="hidden" id="newModelDevelopmentId" value="' + developmentId + '" />';
    model += '<input type="hidden" id="newModelDevelopmentName" value="' + developmenName + '" />';           
    model += '</table>'; 
    $("#developmentName").html(developmenName + ' ('+developmentId+')'); 
    $("#newModelsContainer").html(''); 
    $("#newModelsContainer").append(model); 
    getMinPrice(); 
    getAllPropertyTypes();
    getBasicFeatureNewModel();
    /*jQuery('.datepicker').datepicker({ 
        changeMonth: true,
        changeYear: true,
        dateFormat: 'yy-mm' 
    });*/
});

function getMinPrice() {
    $.ajax({
        type: "GET",
        data: {type:"getMinPrice"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#minPrice").html('Min: ' + formatoMoneda(response[0]) + '<input type="hidden" id="minPriceAmount" value="'+response[0]+'">');         
        }
    });
}

function getBasicFeatureNewModel() {
    var features;
    $('#basicFeaturesNewModelContainer').html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getBasicFeatures",modelId:0},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#basicFeaturesNewModelContainer').html('');
            $.each(response.basicFeature, function(index, basicFeature) {
                features = '<div class="row" style="padding-top:2px;" id="newModelBasicFeatureContainer-'+ basicFeature.id +'">';
                features += '<div class="col-sm-6">';
                features += '<select class="form-control input-sm basicFeatureNewModel" name="' + basicFeature.id + '">';
                features += '<option value="none">Selecciona...</option>';
                for (var i = 0; i<=6; i++) {
                    features += '<option value="'+i+'">'+i+'</option>';    
                }         
                features += '</select>';                
                features += '</div>'; 
                features += '<div class="col-sm-6" style="line-height: 40px;">';
                features += basicFeature.nameText;
                features += '</div>'; 
                features += '</div>'; 
                $("#basicFeaturesNewModelContainer").append(features);                        
            });
        }
    });
}

$(document).on("click", "#addnewModel", function(e) {
    e.preventDefault();  
    var developmentId = $("#newModelDevelopmentId").val(); 
    var developmenName = $("#newModelDevelopmentName").val();      
    var name = $("#newModelName").val(); 
    var propertyType = $("#newModelPropertyType").val(); 
    var levels = $("#newModelLevels").val();
    var price = $("#newModelPrice").val();  
    var status = $("#newModelStatus").val();  
    var description = $("#newModelDescription").val();
    var monthAvailability = $("#newModelMonthAvailability").val();
    var yearAvailability = $("#newModelYearAvailability").val();
    //var availability = $("#newModelAvailability").val();
    var land = $("#newModelLand").val();
    var building = $("#newModelBuilding").val();
    var minPrice = $("#minPriceAmount").val();
    var i = 0;
    var j = 0;
    var flag = 0;
    var regString = /^([a-zA-Z0-9-áéíóúÁÉÍÓÚÜüÑñ&\(\)\s\"\']+)$/;
    var regAmount = /^\$?([0-9]{1,3},([0-9]{3},)*[0-9]{3}|[0-9]+)(\.[0-9][0-9])?$/;
    var regDecimals = /^\d{1,4}(\.\d{1,2})?$/;
    var regLat= /(^$)|(^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$)/;
    var regLng= /(^$)|(^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$)/;
    var regPostalCode = /(^$)|(^\d{5}$)/;
    var regYearMonth = /^(([2][0-9]{3})-(0?[1-9]|1[012])$)/;
    //console.log(developmentId,developmenName,name,propertyType,levels,price,status,description);  
    //console.log(land,building,minPrice);    
    
    if ($('.newModelFeatureToAdd').length == 0) {
        var additionalFeatures = 0;  
    } else {
        var additionalFeatures = [];  
        $('.newModelFeatureToAdd').each(function(index, feature) {
            //console.log('Feature: ' + feature.value);
            additionalFeatures[j] = feature.value;
            j++;
        });
    }

    if (name == null || name == '') {
        if ($("#newModelName").next().length == 0) {
            $("#newModelName").closest('td').parent().addClass('has-error');
            $("#newModelName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
        }         
        flag++;
    } else {
        if (!(regString.test(name))) {
            if ($("#newModelName").next().length == 0) {
                $("#newModelName").closest('td').parent().addClass('has-error');
                $("#newModelName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
            }         
            flag++;
        } else {
            if ($("#newModelName").next().length > 0) {
                $("#newModelName").closest('td').parent().removeClass('has-error');
                $("#newModelName").next('label').remove();
            } 
        }
    }

    if (propertyType != '0') {
        if ($("#newModelPropertyType").next().length > 0) {
            $("#newModelPropertyType").closest('td').parent().removeClass('has-error');
            $("#newModelPropertyType").next('label').remove();
        } 
    } else {
        if ($("#newModelPropertyType").next().length == 0) {
            $("#newModelPropertyType").closest('td').parent().addClass('has-error');
            $("#newModelPropertyType").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona el tipo de propiedad.</label>');
        }         
        flag++;
    }

    if (levels != '0') {
        if ($("#newModelLevels").next().length > 0) {
            $("#newModelLevels").closest('td').parent().removeClass('has-error');
            $("#newModelLevels").next('label').remove();
        } 
    } else {
        if ($("#newModelLevels").next().length == 0) {
            $("#newModelLevels").closest('td').parent().addClass('has-error');
            $("#newModelLevels").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona el número de niveles.</label>');
        }         
        flag++;
    }

    var formatedPrice;
    if (regAmount.test(price)) {
        if (price.substring(0,1) == '$') {
            formatedPrice = price.slice(1);
        } else {
            formatedPrice = price;
        }
        formatedPrice = formatedPrice.replace(/,/g, '');
        if (parseInt(formatedPrice) < parseInt(minPrice)) {
            if (!$("#newModelPriceContainer").hasClass('has-error')) {
                $("#newModelPriceContainer").addClass('has-error');
                $("#newModelPriceContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un precio mayor al monto mínimo.</label>');
            } else {
                $("#newModelPriceContainer").next('label').remove();
                $("#newModelPriceContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un precio mayor al monto mínimo.</label>');
            }      
            flag++;
        } else {
            if ($("#newModelPriceContainer").hasClass('has-error')) {
                $("#newModelPriceContainer").removeClass('has-error');
                $("#newModelPriceContainer").next('label').remove();
            }
        }
    } else {
        if (!$("#newModelPriceContainer").hasClass('has-error')) {
            $("#newModelPriceContainer").addClass('has-error');
            $("#newModelPriceContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un precio válido.</label>');
        } else {
            $("#newModelPriceContainer").next('label').remove();
            $("#newModelPriceContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un precio válido.</label>');
        }    
        flag++;
    }

    if (status != '0') {
        if ($("#newModelStatus").next().length > 0) {
            $("#newModelStatus").closest('td').parent().removeClass('has-error');
            $("#newModelStatus").next('label').remove();
        } 
    } else {
        if ($("#newModelStatus").next().length == 0) {
            $("#newModelStatus").closest('td').parent().addClass('has-error');
            $("#newModelStatus").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona un status.</label>');
        }         
        flag++;
    } 

    if (regDecimals.test(land)) {
        if ($("#newModelLandContainer").hasClass('has-error')) {
            $("#newModelLandContainer").removeClass('has-error');
            $("#newModelLandContainer").next('label').remove();
        } 
    } else {
        if (!$("#newModelLandContainer").hasClass('has-error')) {
            $("#newModelLandContainer").addClass('has-error');
            $("#newModelLandContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un valor válido.</label>');
        }        
        flag++;
    }

    /*if (regYearMonth.test(availability)) {
        if ($("#newModelAvailability").parent().hasClass('has-error')) {
            $("#newModelAvailability").parent().removeClass('has-error');
            $("#newModelAvailability").parent().next('label').remove();
        } 
    } else {
        if (!$("#newModelAvailability").parent().hasClass('has-error')) {
            $("#newModelAvailability").parent().addClass('has-error');
            $("#newModelAvailability").parent().after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un valor válido.</label>');
        }        
        flag++;
    }*/
    
    if (regDecimals.test(building)) {
        if ($("#newModelBuildingContainer").hasClass('has-error')) {
            $("#newModelBuildingContainer").removeClass('has-error');
            $("#newModelBuildingContainer").next('label').remove();
        } 
    } else {
        if (!$("#newModelBuildingContainer").hasClass('has-error')) {
            $("#newModelBuildingContainer").addClass('has-error');
            $("#newModelBuildingContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un valor válido.</label>');
        }         
        flag++;
    }

    var basicFeatures = [];  
    $('.basicFeatureNewModel').each(function(index, feature) {
        //console.log('Feature: ' + feature.value + ', ' + feature.name);
        if (feature.value != 'none') {
            if ($("#newModelBasicFeatureContainer-" + feature.name).hasClass('has-error')) {
                $("#newModelBasicFeatureContainer-" + feature.name).removeClass('has-error');
                $("#newModelBasicFeatureContainer-" + feature.name).next('label').remove();
            } 
        } else {
            if (!$("#newModelBasicFeatureContainer-" + feature.name).hasClass('has-error')) {
                $("#newModelBasicFeatureContainer-" + feature.name).addClass('has-error');
                $("#newModelBasicFeatureContainer-" + feature.name).after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona una opción.</label>');
            }         
            flag++;
        } 
        basicFeatures[i] = feature.name + '/' + feature.value;
        i++;
    });

    //console.log(basicFeatures);
    //console.log(additionalFeatures);

    if (flag == 0) {
        $('#addNewModelResponse').html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {
                type:"insertModel",
                developmentId:developmentId,
                name:name,
                propertyType:propertyType,
                levels:levels,
                price:formatedPrice,
                status:status,
                description:description,
                monthAvailability:monthAvailability,
                yearAvailability:yearAvailability,
                land:land, 
                building:building,
                basicFeatures:basicFeatures,
                additionalFeatures:additionalFeatures
            },
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                //console.log(response);
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    $('#addNewModelResponse').html('<label style="color:green;text-align:center">El Modelo se agregó con éxito.</label>');
                    setTimeout(function () { 
                        $('#addNewModelResponse').html('');
                        $('#newDevelopmentContainer').css('display', 'none');       
                        getModels(developmentId, developmenName);
                    }, 2000);   
                    nameNormalized = normaliza(name);
                    urlFriendly = `https://tratodirecto.com/${response.development}/${response.developer}/${nameNormalized}/casas-en-venta-${response.locality}/${response.state}.html`;
                    shortUrl =  `https://tratod3.com/m-${response.id}`;
                    $("#nameNorm").val(nameNormalized);
                    $("#newFrienlyUrl").val(urlFriendly);
                    $("#newShortUrl").val(shortUrl);
                    $("#urlType").val("mod");
                    $("#addUrls").attr("name", response.id);
                    $("#urlName").attr("name", developmenName+"-"+developmentId);
                    $("#nameNorm").attr("readonly", true);
                    $("#showUrls").click();
                } else {
                    $('#addNewModelResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#addNewModelResponse').html('');
                    }, 2000);                   
                }
            },
            error: function(response) {
                $('#addNewModelResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#addNewModelResponse').html('');
                }, 2000);                     
            }            
        });   
    }
});

function normaliza(nombre) {
    var regString = /[\(\)\s\"\']/g;
    nombre = nombre.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").join("-");
    nombre = nombre.replace(regString, "-");
    nombre = nombre.split('.').join('');
    nombre = nombre.split('&').join('and');
    if (nombre[nombre.length-1]=="-") {
        nombre = nombre.substring(0, nombre.length-1);
    }
    return nombre;
}

$(document).on("click", "#modelFeatureContainer", function(e) {
    e.preventDefault();
    $("#openAdditionalFeaturesModal").click();
    var formAdditionalFeature = '';
    $("#additionalFeaturesModalBody").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getAdditionalFeatures",modelId:0},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) { 
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            formAdditionalFeature += '<form class="form-horizontal" style="margin-left:6px">';
            formAdditionalFeature += '<div class="form-group">';
            $.each(response.additionalFeature, function(index, additionalFeature) {
                formAdditionalFeature += '<div class="col-sm-4">';
                if ($('#modelFeature-' + additionalFeature.id).val() == additionalFeature.id) {
                    formAdditionalFeature += '<input type="checkbox" class="newModel-Feature" value="' + additionalFeature.id + '" name="' + additionalFeature.nameText + '" checked>';
                } else {
                    formAdditionalFeature += '<input type="checkbox" class="newModel-Feature" value="' + additionalFeature.id + '" name="' + additionalFeature.nameText + '">';
                }
                formAdditionalFeature += '&nbsp;<label class="control-label">' + additionalFeature.nameText + '</label>';
                formAdditionalFeature += '</div>';              
            });
            formAdditionalFeature += '</div>'; 
            formAdditionalFeature += '<div class="form-group" style="text-align:center">';
            formAdditionalFeature += '<button type="button" class="btn btn-sm btn-danger" id="closeAdditionalFeatureContainer">Cancelar</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-success" id="newModelFeaturesAdd">Guardar</button>';
            formAdditionalFeature += '</div>';              
            formAdditionalFeature += '</form>';
            $("#additionalFeaturesModalBody").html(formAdditionalFeature);
        }
    });
});

$(document).on("click", "#newModelFeaturesAdd", function(e) {
    e.preventDefault();
    $('#newModelFeaturesContainer').html('');
    $('#additionalFeaturesModal').modal('hide');
    $("#newModelFeaturesContainer").css({"padding-top":"4px", "padding-bottom":"4px"});  
    $('.newModel-Feature').each(function(i, modelFeatures) {
        if (modelFeatures.checked) {         
            $('#newModelFeaturesContainer').append(modelFeatures.name + '<input type="hidden" class="newModelFeatureToAdd" id="modelFeature-' + modelFeatures.value + '" value="' + modelFeatures.value + '">; ');
        }
    });       
});

function getAllPropertyTypes() {
    var propertyTypes;
    $.ajax({
        type: "GET",
        data: {type:"getAllPropertyTypes"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#newModelPropertyType').prop('disabled', false);
            $.each(response.propertyType, function(index, propertyType) {
                propertyTypes = '<option value="' + propertyType.id + '">'+propertyType.name+'</option>';
                $("#newModelPropertyType").append(propertyTypes);         
            });
        }
    });
}

function getAllStatesAvailable() {
    var states;
    $.ajax({
        type: "GET",
        data: {type:"getAllStates"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            $('#newDevStates').prop('disabled', false);
            $.each(response.state, function(index, state) {
                states = '<option value="' + state.id + '">'+state.name+'</option>';
                $("#newDevStates").append(states);         
            });
        }
    });
}

$(document).on("change", "#newDevStates", function(e) {
    e.preventDefault();
    var stateId = $(this).val();
    getAllLocalitiesByState(stateId);
});

function getAllLocalitiesByState(stateId) {
    var localities;
    $.ajax({
        type: "GET",
        data: {type:"getAllLocalitiesByState",stateId:stateId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#newDevLocalities').empty(),
            $('#newDevLocalities').prop('disabled', false);
            $("#newDevLocalities").append('<option value="0">Selecciona...</option>');
            $.each(response.locality, function(index, locality) {
                localities = '<option value="' + locality.id + '">'+locality.name+'</option>';
                $("#newDevLocalities").append(localities);         
            });
            $("#newDevLocalities").append('<option value="add" style="font-weight:bold;">Agregar Municipio</option>');   
        }
    });  
}

$(document).on("change", "#newDevLocalities", function(e) {
    e.preventDefault();
    var localityId = $(this).val();
    var localityform = '';
    //console.log(localityId);
    if (localityId == 'add') {
        localityform += '<form class="form-horizontal" action="/action_page.php" style="padding-left:20px;padding-right:20px">';
        localityform += '<div class="form-group" style="margin:0 0 4px 0">';
        localityform += '<label class="control-label col-sm-3" for="email">Nombre:</label>';
        localityform += '<div class="col-sm-9">';
        localityform += '<input type="text" class="form-control input-sm" id="newLocalityName" placeholder="Nombre">';
        localityform += '</div>';
        localityform += '</div>';
        localityform += '<div class="form-group" style="margin:0 0 4px 0">';
        localityform += '<label class="control-label col-sm-3" for="pwd">Latitud:</label>';
        localityform += '<div class="col-sm-9">';
        localityform += '<input type="text" class="form-control input-sm" id="newLocalityLatitude" placeholder="Latitud">';
        localityform += '</div>';
        localityform += '</div>';
        localityform += '<div class="form-group" style="margin:0 0 4px 0">';
        localityform += '<label class="control-label col-sm-3" for="pwd">Longitud:</label>';
        localityform += '<div class="col-sm-9">';
        localityform += '<input type="text" class="form-control input-sm" id="newLocalityLongitude" placeholder="Longitud">';
        localityform += '</div>';
        localityform += '</div>';        
        localityform += '<div class="form-group" style="margin:12px 0 4px 0">';
        localityform += '<div class="col-sm-offset-3 col-sm-9">';
        localityform += '<button type="button" class="btn btn-sm btn-danger" id="cancelNewLocality">Cancelar</button>&nbsp;&nbsp;';
        localityform += '<button type="button" class="btn btn-sm buttons" id="addNewLocality" style="color:#ffffff">Agregar</button>';
        localityform += '</div>';
        localityform += '</div>';
        localityform += '<div class="form-group" style="margin:12px 0 4px 0;text-align:center" id="addNewLocalityResponse">';
        localityform += '</div>';        
        localityform += '</form>';
        $("#newLocalityModalBody").html(localityform);
        $("#openNewLocalityModal").click();
    }
});

function removeAccents(string) {
	var chars = {
		"á":"a", "é":"e", "í":"i", "ó":"o", "ú":"u",
		"à":"a", "è":"e", "ì":"i", "ò":"o", "ù":"u", "ñ":"n",
		"Á":"A", "É":"E", "Í":"I", "Ó":"O", "Ú":"U",
        "À":"A", "È":"E", "Ì":"I", "Ò":"O", "Ù":"U", "Ñ":"N" 
    }
	var expr = /[áàéèíìóòúùñ]/ig;
	var response = string.replace(expr,function(e){return chars[e]});
	return response;
}

$(document).on("click", "#cancelNewLocality", function(e) {
    e.preventDefault();
    $('#newDevLocalities').val('0');
    $('#newLocalityModal').modal('hide');
});

$(document).on("click", "#addNewLocality", function(e) {
    e.preventDefault();
    var stateId = $("#newDevStates").val();
    var stateName = $("#newDevStates").find('option:selected').text();
    var localityName = $('#newLocalityName').val();
    var localityNameText = localityName;
    var localityLatitude = $('#newLocalityLatitude').val();
    var localityLongitude = $('#newLocalityLongitude').val();
    localityName = removeAccents(localityName).toLowerCase();
    var regString = /^([a-zA-Z0-9-áéíóúÁÉÍÓÚÜüÑñ&\(\)\s\"\']+)$/;
    var regLat= /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    var regLng= /^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$/;
    var flag = 0;
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    //console.log(stateId, stateName, localityName, localityNameText, localityLatitude, localityLongitude, utc);

    if (localityName == null || localityName == '') {
        if ($("#newLocalityName").next().length == 0) {
            $("#newLocalityName").closest('div').parent().addClass('has-error');
            $("#newLocalityName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
        }         
        flag++;
    } else {
        if (!(regString.test(localityName))) {
            if ($("#newLocalityName").next().length == 0) {
                $("#newLocalityName").closest('div').parent().addClass('has-error');
                $("#newLocalityName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
            }         
            flag++;
        } else {
            if ($("#newLocalityName").next().length > 0) {
                $("#newLocalityName").closest('div').parent().removeClass('has-error');
                $("#newLocalityName").next('label').remove();
            } 
        }
    }

    if (regLat.test(localityLatitude)) {
        if ($("#newLocalityLatitude").next().length > 0) {
            $("#newLocalityLatitude").closest('div').parent().removeClass('has-error');
            $("#newLocalityLatitude").next('label').remove();
        } 
    } else {
        if ($("#newLocalityLatitude").next().length == 0) {
            $("#newLocalityLatitude").closest('div').parent().addClass('has-error');
            $("#newLocalityLatitude").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una latitud válida.</label>');
        }         
        flag++;
    }
    
    if (regLng.test(localityLongitude)) {
        if ($("#newLocalityLongitude").next().length > 0) {
            $("#newLocalityLongitude").closest('div').parent().removeClass('has-error');
            $("#newLocalityLongitude").next('label').remove();
        } 
    } else {
        if ($("#newLocalityLongitude").next().length == 0) {
            $("#newLocalityLongitude").closest('div').parent().addClass('has-error');
            $("#newLocalityLongitude").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una longitud válida.</label>');
        }         
        flag++;
    }

    if (flag == 0) {
        $('#addNewLocalityResponse').html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"addLocality",stateId:stateId,localityName:localityName,localityNameText:localityNameText,localityLatitude:localityLatitude,localityLongitude:localityLongitude,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#addNewLocalityResponse').html('<label style="color:green;text-align:center">El municipio se agregó con éxito.</label>');
                    setTimeout(function () { 
                        $('#newLocalityModal').modal('hide');
                        getAllLocalitiesByState(stateId);
                    }, 2000);
                } else {
                    $('#addNewLocalityResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#newLocalityModal').modal('hide');
                        getAllLocalitiesByState(stateId);
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#addNewLocalityResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#newLocalityModal').modal('hide');
                    getAllLocalitiesByState(stateId);
                }, 2000);                   
            }            
        });     
    }
});

function getCollaborators(developerId) {
    var collaborators;
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorsByDeveloper", developerId:developerId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {   
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#newDevCollaborator').prop('disabled', false);
            $.each(response.collaborator, function(index, collaborator) {
                collaborators = '<option value="' + collaborator.id + '">' + collaborator.name + ' ' + collaborator.lastName + ' / ' + collaborator.phone + '</option>';
                $("#newDevCollaborator").append(collaborators);         
            });
        } 
    });
}

$(document).on("click", "#devCollaboratorsContainer", function(e) {
    e.preventDefault();
    var string = '';
    var collaboratorId = $("#newDevCollaborator").val();
    var colaboratorName = $("#newDevCollaborator").find('option:selected').text();
    var roleId = $("#newDevCollaboratorRole").val();
    var roleName = $("#newDevCollaboratorRole").find('option:selected').text();
    if ((collaboratorId != 0) && (roleId != 0)) {
        $("#newDevCollaboratorsContainer").css({"padding-top":"4px"});  
        if ($('#collaborator-' + collaboratorId + '-' + roleId).val() != collaboratorId) {
            string += '<div class="form-group form-inline" style="padding-top:4px;padding-bottom:4px;margin:0;height:30px;border-top: 1px dotted #eeeeee;" id="divCollaborator-' + collaboratorId + '-' + roleId + '">';
            string += colaboratorName + ' / ' + roleName;
            string += '<input type="hidden" class="newDevCollaboratorToAdd" id="collaborator-' + collaboratorId + '-' + roleId + '" value="' + collaboratorId + '" name="' + roleId + '">';
            string += '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-cancel removeCollaborator" value="' + collaboratorId + '" name="' + roleId + '"><i class="glyphicon glyphicon-remove"></i></button>';
            string += '</div>';
            $('#newDevCollaboratorsContainer').append(string);
            //$('#newDevCollaboratorsContainer').append('<div class="form-group form-inline" style="margin:0">' + colaboratorName + ' / ' + roleName + '<input type="hidden" class="newDevCollaboratorToAdd" id="collaborator-' + collaboratorId + '-' + roleId + '" value="' + collaboratorId + '" name="' + roleId + '">Quitar</div>');
        } 
    }
});

$(document).on("click", ".removeCollaborator", function(e) {
    e.preventDefault();
    var collaboratorId = $(this).val();
    var roleId = $(this).attr('name');
    //console.log(collaboratorId, roleId);
    $('#divCollaborator-' + collaboratorId + '-' + roleId).remove();
});

$(document).on("click", "#devFeaturesContainer", function(e) {
    e.preventDefault();
    var featuresForm = '';
    var featuresFormPayment = '';
    $("#openDevelopmentFeaturesModal").click();
    $("#developmentFeaturesModalBody").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentFeatures",developmentId:0},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {  
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            featuresForm += '<form class="form-horizontal" style="margin-left:6px">';
            featuresForm += '<div class="form-group" style="text-align:center;font-weight:bold;">';            
            featuresForm += 'Características'; 
            featuresForm += '</div>';              
            featuresForm += '<div class="form-group">';
            $.each(response.developmentFeature, function(index, developmentFeature) {
                if (developmentFeature.featureCat != 4) {
                    featuresForm += '<div class="col-sm-6 col-md-6 col-lg-4">';
                    if ($('#feature-' + developmentFeature.featureId).val() == developmentFeature.featureId) {
                        featuresForm += '<input type="checkbox" class="newDev-Feature" value="' + developmentFeature.featureId + '" name="' + developmentFeature.featureName + '" checked>';
                    } else {
                        featuresForm += '<input type="checkbox" class="newDev-Feature" value="' + developmentFeature.featureId + '" name="' + developmentFeature.featureName + '">';
                    }
                    featuresForm += '&nbsp;<label class="control-label">'+developmentFeature.featureName+'</label>';
                    featuresForm += '</div>';              
                } else {
                    featuresFormPayment += '<div class="col-sm-6 col-md-6 col-lg-4">';
                    if ($('#feature-' + developmentFeature.featureId).val() == developmentFeature.featureId) {
                        featuresFormPayment += '<input type="checkbox" class="newDev-Feature" value="' + developmentFeature.featureId + '" name="' + developmentFeature.featureName + '" checked>';
                    } else {
                        featuresFormPayment += '<input type="checkbox" class="newDev-Feature" value="' + developmentFeature.featureId + '" name="' + developmentFeature.featureName + '">';
                    }
                    featuresFormPayment += '&nbsp;<label class="control-label">'+developmentFeature.featureName+'</label>';
                    featuresFormPayment += '</div>';   
                }
            });
            featuresForm += '</div>'; 
            featuresForm += '<div class="form-group" style="text-align:center;font-weight:bold;">';            
            featuresForm += 'Métodos de pago'; 
            featuresForm += '</div>';             
            featuresForm += '<div class="form-group">';
            featuresForm += featuresFormPayment;
            featuresForm += '</div>';   
            featuresForm += '<div class="form-group" style="text-align:center">';
            featuresForm += '<button type="button" class="btn btn-sm btn-danger" id="closeDevelopmentFeatureContainer">Cancelar</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-success" id="newDevFeaturesAdd">Agregar</button>';
            featuresForm += '</div>';
            featuresForm += '<div class="form-group" style="text-align:center" id="developmentFeaturesResponse">';
            featuresForm += '</div>';                
            featuresForm += '</form>';
            $("#developmentFeaturesModalBody").html(featuresForm);
    }
    });
});

$(document).on("click", "#newDevFeaturesAdd", function(e) {
    e.preventDefault();
    $('#newDevFeaturesContainer').html('');
    $('#developmentFeaturesModal').modal('hide');
    $("#newDevFeaturesContainer").css({"padding-top":"4px", "padding-bottom":"4px"});  
    $('.newDev-Feature').each(function(i, developmentFeatures) {
        if (developmentFeatures.checked) {
            featureId = developmentFeatures.value;
            $('#newDevFeaturesContainer').append(developmentFeatures.name + '<input type="hidden" class="newDevFeatureToAdd" id="feature-' + developmentFeatures.value + '" value="' + developmentFeatures.value + '">; ');
        }
    });    
});

$(document).on("click", "#addnewDev", function(e) {
    e.preventDefault();
    var developerId = $("#newDevDeveloperId").val(); 
    var developerName = $("#newDevDeveloperName").val();      
    var name = $("#newDevName").val(); 
    var status = $("#newDevStatus").val(); 
    var description = $("#newDevDescription").val();
    var slogan = $("#newDevSlogan").val();  
    var zone = $("#newDevZone").val();  
    var latitude = $("#newDevLatitude").val();  
    var longitude = $("#newDevLongitude").val();
    var street = $("#newDevStreet").val(); 
    var extNum = $("#newDevExtNum").val();
    var intNum = $("#newDevIntNum").val(); 
    var state = $("#newDevStates").val(); 
    var locality = $("#newDevLocalities").val(); 
    var postalCode = $("#newDevPostalCode").val();
    var directions = $("#newDevDirections").val(); 
    var spLatitude = $("#newDevSPLatitude").val(); 
    var spLongitude = $("#newDevSPLongitude").val();  
    var contactCenter = $("#newDevContactCenter").val();
    var visitsAllowed = $("#newDevVisitsAllowed").val(); 
    var i = 0;
    var j = 0;
    var flag = 0;
    var regString = /^([a-zA-Z0-9-áéíóúÁÉÍÓÚÜüÑñ&\(\)\s\"\']+)$/;
    var regLat = /(^$)|(^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$)/;
    var regLng = /(^$)|(^(\+|-)?(?:180(?:(?:\.0{1,6})?)|(?:[0-9]|[1-9][0-9]|1[0-7][0-9])(?:(?:\.[0-9]{1,6})?))$)/;
    var regPostalCode = /(^$)|(^\d{5}$)/;
    var category = $("#newDevCat").val();
    var typeDeal = $("#newDevDeal").val();
    //console.log(developerId, developerName, name,status,description,slogan,latitude,longitude);  
    //console.log(street,extNum,intNum,state,locality,postalCode);    
    //console.log(directions,spLatitude,spLongitude);  

    if ($('.newDevCollaboratorToAdd').length == 0) {
        var developmentCollaborators = 0;  
    } else {
        var developmentCollaborators = [];  
        $('.newDevCollaboratorToAdd').each(function(index, collaborator) {
            developmentCollaborators[i] = collaborator.value + '/' + collaborator.name;
            i++;
        });
    }

    if ($('.newDevFeatureToAdd').length == 0) {
        var developmentFeatures = 0;  
    } else {
        var developmentFeatures = [];  
        $('.newDevFeatureToAdd').each(function(index, feature) {
            developmentFeatures[j] = feature.value;
            j++;
        });
    }

    if (name == null || name == '') {
        if ($("#newDevName").next().length == 0) {
            $("#newDevName").closest('td').parent().addClass('has-error');
            $("#newDevName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
        }         
        flag++;
    } else {
        if (!(regString.test(name))) {
            if ($("#newDevName").next().length == 0) {
                $("#newDevName").closest('td').parent().addClass('has-error');
                $("#newDevName").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un nombre válido.</label>');
            }         
            flag++;
        } else {
            if ($("#newDevName").next().length > 0) {
                $("#newDevName").closest('td').parent().removeClass('has-error');
                $("#newDevName").next('label').remove();
            } 
        }
    }

    if (status != '0') {
        if ($("#newDevStatus").next().length > 0) {
            $("#newDevStatus").closest('td').parent().removeClass('has-error');
            $("#newDevStatus").next('label').remove();
        } 
    } else {
        if ($("#newDevStatus").next().length == 0) {
            $("#newDevStatus").closest('td').parent().addClass('has-error');
            $("#newDevStatus").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona un Status.</label>');
        }         
        flag++;
    }

    if (contactCenter != 'none') {
        if ($("#newDevContactCenter").next().length > 0) {
            $("#newDevContactCenter").closest('td').parent().removeClass('has-error');
            $("#newDevContactCenter").next('label').remove();
        } 
    } else {
        if ($("#newDevContactCenter").next().length == 0) {
            $("#newDevContactCenter").closest('td').parent().addClass('has-error');
            $("#newDevContactCenter").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona una opción.</label>');
        }         
        flag++;
    }

    if (visitsAllowed != 'none') {
        if ($("#newDevVisitsAllowed").next().length > 0) {
            $("#newDevVisitsAllowed").closest('td').parent().removeClass('has-error');
            $("#newDevVisitsAllowed").next('label').remove();
        } 
    } else {
        if ($("#newDevVisitsAllowed").next().length == 0) {
            $("#newDevVisitsAllowed").closest('td').parent().addClass('has-error');
            $("#newDevVisitsAllowed").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona una opción.</label>');
        }         
        flag++;
    }
    
    if (regLat.test(latitude)) {
        if ($("#newDevLatitudeContainer").hasClass('has-error')) {
            $("#newDevLatitudeContainer").removeClass('has-error');
            $("#newDevLatitudeContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevLatitudeContainer").hasClass('has-error')) {
            $("#newDevLatitudeContainer").addClass('has-error');
            $("#newDevLatitudeContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una latitud válida.</label>');
        }         
        flag++;
    }
    
    if (regLng.test(longitude)) {
        if ($("#newDevLongitudeContainer").hasClass('has-error')) {
            $("#newDevLongitudeContainer").removeClass('has-error');
            $("#newDevLongitudeContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevLongitudeContainer").hasClass('has-error')) {
            $("#newDevLongitudeContainer").addClass('has-error');
            $("#newDevLongitudeContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una longitud válida.</label>');
        }         
        flag++;
    }

    if (state != '0') {
        if ($("#newDevStatesContainer").hasClass('has-error')) {
            $("#newDevStatesContainer").removeClass('has-error');
            $("#newDevStatesContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevStatesContainer").hasClass('has-error')) {
            $("#newDevStatesContainer").addClass('has-error');
            $("#newDevStatesContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona un Estado.</label>');
        }         
        flag++;
    }

    if (state != '0') {
        if (locality != '0') {
            if ($("#newDevLocalitiesContainer").hasClass('has-error')) {
                $("#newDevLocalitiesContainer").removeClass('has-error');
                $("#newDevLocalitiesContainer").next('label').remove();
            } 
        } else {
            if (!$("#newDevLocalitiesContainer").hasClass('has-error')) {
                $("#newDevLocalitiesContainer").addClass('has-error');
                $("#newDevLocalitiesContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona un Municipio.</label>');
            }         
            flag++;
        }
    }

    if (regPostalCode.test(postalCode)) {
        if ($("#newDevPostalCodeContainer").hasClass('has-error')) {
            $("#newDevPostalCodeContainer").removeClass('has-error');
            $("#newDevPostalCodeContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevPostalCodeContainer").hasClass('has-error')) {
            $("#newDevPostalCodeContainer").addClass('has-error');
            $("#newDevPostalCodeContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una CP válido.</label>');
        }         
        flag++;
    }

    if (regLat.test(spLatitude)) {
        if ($("#newDevSPLatitudeContainer").hasClass('has-error')) {
            $("#newDevSPLatitudeContainer").removeClass('has-error');
            $("#newDevSPLatitudeContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevSPLatitudeContainer").hasClass('has-error')) {
            $("#newDevSPLatitudeContainer").addClass('has-error');
            $("#newDevSPLatitudeContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una latitud válida.</label>');
        }         
        flag++;
    }
    
    if (regLng.test(spLongitude)) {
        if ($("#newDevSPLongitudeContainer").hasClass('has-error')) {
            $("#newDevSPLongitudeContainer").removeClass('has-error');
            $("#newDevSPLongitudeContainer").next('label').remove();
        } 
    } else {
        if (!$("#newDevSPLongitudeContainer").hasClass('has-error')) {
            $("#newDevSPLongitudeContainer").addClass('has-error');
            $("#newDevSPLongitudeContainer").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa una longitud válida.</label>');
        }         
        flag++;
    }

    if (flag == 0) {
        $('#addNewDevResponse').html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        //console.log(developmentFeatures);
        $.ajax({
            type: "GET",
            data: {
                type:"insertDevelopment",
                developerId:developerId,
                name:name,
                status:status,
                description:description,
                slogan:slogan,
                zone:zone,
                latitude:latitude,
                longitude:longitude, 
                street:street,
                extNum:extNum,
                intNum:intNum,
                state:state,
                locality:locality,
                postalCode:postalCode,
                directions:directions,
                spLatitude:spLatitude,
                spLongitude:spLongitude,
                developmentCollaborators:developmentCollaborators,
                developmentFeatures:developmentFeatures,
                contactCenter:contactCenter,
                visitsAllowed:visitsAllowed,
                negotation:typeDeal,
                category:category
            },
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    $('#addNewDevResponse').html('<label style="color:green;text-align:center">El desarrollo se agregó con éxito.</label>');
                    setTimeout(function () { 
                        $('#addNewDevResponse').html('');
                        $('#newDevelopmentContainer').css('display', 'none');  
                        getDevelopmentData(developerName, response.id, name);        
                        getModels(response.id, name);
                    }, 2000);
                    nameNormalized = normaliza(name);
                    urlFriendly = `https://tratodirecto.com/${nameNormalized}/${response.developer}/casas-en-venta-${response.locality}/${response.state}.html`;
                    shortUrl =  `https://tratod1.com/d-${response.id}`;
                    $("#nameNorm").val(nameNormalized);
                    $("#newFrienlyUrl").val(urlFriendly);
                    $("#newShortUrl").val(shortUrl);
                    $("#urlType").val("dev");
                    $("#nameNorm").attr("readonly", true);
                    $("#addUrls").attr("name", response.id);
                    $("#urlName").attr("name", developerName+"-"+name);
                    $("#showUrls").click();
                } else {
                    $('#addNewDevResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#addNewDevResponse').html('');
                        //getDevelopmentData(developerName, null, 'La Florida');      
                        //getModels(developmentId, developmentName);
                    }, 2000);                   
                }
            },
            error: function(response) {
                $('#addNewDevResponse').html('<label style="color:red;text-align:center">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#addNewDevResponse').html('');
                    //getDevelopmentData(developerName, 262, 'La Floprida');        
                    //getModels(developmentId, developmentName);
                }, 2000);                     
            }            
        });   
    }
});

$(document).on("click", "#editUrl", function (e) {
    e.preventDefault();
    $("#nameNorm").attr("readonly", false);
});

$(document).on("keyup", "#nameNorm", function (e) {
    e.preventDefault();
    var nameNormalized = normaliza($("#nameNorm").val());
    var urlFriendly = $("#newFrienlyUrl").val();
    if ($("#urlType").val()=="dev") {
        urlFriendly = urlFriendly.split("/");
        urlFriendly[3] = nameNormalized;
        urlFriendly = urlFriendly.join("/");
        $("#newFrienlyUrl").val(urlFriendly);
        $("#nameNorm").val(nameNormalized);
    } else {
        urlFriendly = urlFriendly.split("/");
        urlFriendly[5] = nameNormalized;
        urlFriendly = urlFriendly.join("/");
        $("#newFrienlyUrl").val(urlFriendly);
        $("#nameNorm").val(nameNormalized);
    }
});

$(document).on("click", "#addUrls", function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    var nameNormalized = $("#nameNorm").val();
    var urlFriendly = $("#newFrienlyUrl").val();
    var shortUrl = $("#newShortUrl").val();
    var target = $("#urlType").val();
    var updateTo = $("#urlName").attr("name").split("-");
    // if( nameNormalized.indexOf("&")>-1 ) {
    //     notify('growl-danger', 'Error', "El nombre normalizado no puede contener el caracter '&'");
    //     return false;
    // }
    $.ajax({
        type: "GET",
        data: {type:"addAllUrls",target:target,id:id,nameNormalized:nameNormalized,urlFriendly:urlFriendly,shortUrl:shortUrl},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    //console.log(response);
                    notify("growl-success", "Agregado Correctamente", "Se agregaron las urls correctamente");
                    if (target==="dev") {
                        getDevelopmentData(updateTo[0], id, updateTo[1]);        
                        getModels(id, updateTo[1]);
                    } else {
                        getModels(updateTo[1], updateTo[0]);
                    }
                    $("#showUrls").click();
                } else {
                    //console.log(response);
                    var mensaje = "";
                    if (response.info==="Error al insertar en BD") {
                        mensaje = response.info;
                    } else {
                        mensaje = "Bitly dice: "+ response.info.message + ". Solo se agrego el nombre normalizado, intenta mas tarde";
                    }
                    notify("growl-danger", "Error al agregar", mensaje);                  
                }
            }
        },
        error: function(response) {
            //console.log(response);      
            notify("growl-danger", "Error", "Error");           
        }            
    });
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
    if (stateId != 0) {     
        getLocalities(developerId, stateId);
        searchOptions(developerId, stateId, 0, 0)
    } else {
        searchOptions(developerId, 0, 0, 0)
    }
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
    if (localityId != 0) {      
        getDevelopments(developerId, stateId, localityId);
        searchOptions(developerId, stateId, localityId, 0)
    } else {
        searchOptions(developerId, stateId, 0, 0)
    }
});

$("#development").change(function(){
    var developmentId = $(this).val();
    var developerName = $("#developer option:selected").text();
    var developmentName = $("option:selected", this).text();  
    if (developmentId != 0) {
        getDevelopmentData(developerName, developmentId, developmentName);        
        getModels(developmentId, developmentName);
        if(!$('#searchResultPanel').hasClass('maximize')) {
            $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideUp(200);
            $('#searchResultPanel').addClass('maximize');
            $('#searchResultPanel').find('i').removeClass('fa-minus').addClass('fa-plus');
            $('#searchResultPanel').attr('data-original-title','Maximize Panel').tooltip();
         } else {
            $('#searchResultPanel').closest('.panel').find('.panel-body, .panel-footer').slideDown(200);
            $('#searchResultPanel').removeClass('maximize');
            $('#searchResultPanel').find('i').removeClass('fa-plus').addClass('fa-minus');
            $('#searchResultPanel').attr('data-original-title','Minimize Panel').tooltip();
         }
    }
});

function getDevelopmentData(developerName, developmentId, developmentName) {
    $("#developmentNameTittle").html('Desarrollo: ' + developmentName);
    $("#developmentNameSubTittle").html(developerName);
    $("#developmentContainer").css("display", "block");
    $("#developmentDataContainer").html('');
    $("#developmentDataContainer").html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentData", developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#developmentDataContainer").html('');
            var developerId = response.development[0].developerId;
            var developmentId = response.development[0].developmentId;
            var developmentName = response.development[0].developmentName;
            var developmentDescription = response.development[0].developmentDescription;
            var developmentSlogan = response.development[0].developmentSlogan;
            var developmentLatitude = response.development[0].developmentLatitude;
            var developmentLongitude = response.development[0].developmentLongitude;
            var developmentLongitude = response.development[0].developmentLongitude;
            var developmentStreet = response.development[0].developmentStreet;
            if (developmentStreet == '') { developmentStreet = null; }
            var developmentExtNumber = response.development[0].developmentExtNumber;
            if (developmentExtNumber == '') { developmentExtNumber = null; }
            var developmentIntNumber = response.development[0].developmentIntNumber;
            if (developmentIntNumber == '') { developmentIntNumber = null; }
            var developmentPostalCode = response.development[0].developmentPostalCode;
            if (developmentPostalCode == '') { developmentPostalCode = null; }
            var developmentSublocality = response.development[0].developmentSublocality;
            if (developmentSublocality == '') { developmentSublocality = null; }
            var developmentLocality = response.development[0].developmentLocality;
            if (developmentLocality == '') { developmentLocality = null; }
            var developmentState = response.development[0].developmentState;
            if (developmentState == '') { developmentState = null; }
            var developmentDirections = response.development[0].developmentDirections;
            var developmentPsLatitude = response.development[0].psLatitude;
            var developmentPsLongitude = response.development[0].psLongitude;
            var developmentStatus = response.development[0].developmentStatus;
            var developmentFeatures = response.development[0].developmentFeatures;
            var developmentCollaborator = response.development[0].developmentCollaborator;
            var developmentSublocalityId = response.development[0].developmentSublocalityId;
            var developmentLocalityId = response.development[0].developmentLocalityId;
            var developmentStateId = response.development[0].developmentStateId;
            var developmentContactCenter = response.development[0].developmentContactCenter;
            var developerCentralAssigment = response.development[0].developerCentralAssigment;
            var developmentVisitsAllowed = response.development[0].developmentVisitsAllowed;
            var psDirections = response.development[0].psDirections;
            var saleArgument = response.development[0].saleArgument;
            if (saleArgument == null) { saleArgument = "No se han agregado argumentos"; }
            var negotation = response.development[0].negotation;
            var category = response.development[0].category;

            var developmentZoneId = response.development[0].zoneId;
            var developmentZoneName = response.development[0].zoneName;

            var psAddressStreet = response.development[0].psAddressStreet;
            if (psAddressStreet == '') { psAddressStreet = null; }
            var psAddressExtNumber = response.development[0].psAddressExtNumber;
            if (psAddressExtNumber == '') { psAddressExtNumber = null; }
            var psAddressIntNumber = response.development[0].psAddressIntNumber;
            if (psAddressIntNumber == '') { psAddressIntNumber = null; }
            var psAddressPostalCode = response.development[0].psAddressPostalCode;
            if (psAddressPostalCode == '') { psAddressPostalCode = null; }
            var psAddressSublocality = response.development[0].psAddressSublocality;
            if (psAddressSublocality == '') { psAddressSublocality = null; }     
            var psAddressSublocalityId = response.development[0].psAddressSublocalityId;
            if (psAddressSublocalityId == '') { psAddressSublocalityId = null; }                 
            var psLocality = response.development[0].psLocality;
            if (psLocality == '') { psLocality = null; }
            var psLocalityId = response.development[0].psLocalityId;
            if (psLocalityId == '') { psLocalityId = null; }
            var psState = response.development[0].psState;
            if (psState == '') { psState = null; }
            var psStateId = response.development[0].psStateId;
            if (psStateId == '') { psStateId = null; }


            var developmentPsAddress = psAddressStreet;
            if ((psAddressExtNumber == '') || (psAddressExtNumber == null) || (psAddressExtNumber == 's/n') || (psAddressExtNumber == 'S/N')) {
                developmentAddress += ', s/n. ';
            } else {
                developmentPsAddress += ', No. ' + psAddressExtNumber + '. ';
            }
            if (developmentSublocality != null) {
                developmentPsAddress += 'Col. ' + psAddressSublocality;
            }
            developmentPsAddress += psLocality + ', ' + psState + '.';
            if (psAddressPostalCode != null) {
                developmentPsAddress += ' C.P. ' + psAddressPostalCode + '.';
            }

            if (developmentVisitsAllowed == 0) {
                var developmentVisitsAllowedTxt = 'Física';
            } else {
                var developmentVisitsAllowedTxt = 'Virtual';
            } 
            
            if (response.development[0].developmentVideo360.video360[0].id == 0) {
                var devVideo360Id = 0;
                var devVideo360Url = '';
                var devVideo360Provider = 0;
                var devVideo360ProviderName = '';              

            } else {
                var devVideo360Id = response.development[0].developmentVideo360.video360[0].id;
                var devVideo360Url = response.development[0].developmentVideo360.video360[0].url;
                var devVideo360Provider = response.development[0].developmentVideo360.video360[0].mediaProvider;
                var devVideo360ProviderName = response.development[0].developmentVideo360.video360[0].mediaProviderName;
            }

            var cover = response.development[0].developmentCover.cover[0];

            //console.log(devVideo360Id, devVideo360Url, devVideo360Provider, devVideo360ProviderName);

            if (response.development[0].developmentVideos.video[0].id == 0) {
                var devVideoId = 0;
                var devVideoUrl = '';
                var devVideoStart = '00:04';
                var devVideoEnd = '';
                var devVideoPriceId = '0';
                var devVideoPriceTxt = 'Oculto';
            } else {
                var devVideoId = response.development[0].developmentVideos.video[0].id;
                var devVideoUrl = response.development[0].developmentVideos.video[0].url;
                var devVideoStart = response.development[0].developmentVideos.video[0].start;
                var devVideoEnd = response.development[0].developmentVideos.video[0].end;
                var devVideoPriceId = response.development[0].developmentVideos.video[0].price;
                if (devVideoPriceId == 1) {
                    var devVideoPriceTxt = 'Visible';
                } else {
                    var devVideoPriceTxt = 'Oculto';
                }
            }

            var devFeatures = '';
            var devFeaturesPayment = '';
            $.each(developmentFeatures, function(index, feature) {
                for (i=0; i<feature.length; i++) {
                    if (feature[i].featureFlag != 0) {
                        if (feature[i].featureCat != 4) {
                            devFeatures += feature[i].featureName + '; ';
                        } else {
                            devFeaturesPayment += feature[i].featureName + '; ';
                        }
                    }
                }  
            });  

            var developmentAddress = developmentStreet;
            if ((developmentExtNumber == '') || (developmentExtNumber == null) || (developmentExtNumber == 's/n') || (developmentExtNumber == 'S/N')) {
                developmentAddress += ', s/n. ';
            } else {
                developmentAddress += ', No. ' + developmentExtNumber + '. ';
            }
            if (developmentSublocality != null) {
                developmentAddress += 'Col. ' + developmentSublocality;
            }
            developmentAddress += developmentLocality + ', ' + developmentState + '.';
            if (developmentPostalCode != null) {
                developmentAddress += ' C.P. ' + developmentPostalCode + '.';
            }

            if (developmentStatus == 1) {
                developmentStatusTxt = "Activo";
            } else if (developmentStatus == 2) {
                developmentStatusTxt = "Inactivo";
            } else if (developmentStatus == 9) {
                developmentStatusTxt = "Demo";
            } else {
                developmentStatusTxt = "Error";
            }   

            if (developmentContactCenter == 1) {
                developmentContactCenterTxt = "Activo";
            } else if (developmentContactCenter == 0) {
                developmentContactCenterTxt = "Inactivo";
            } else {
                developmentContactCenterTxt = "Sin definir";
            }  
            var devUrl = "";
            if (response.development[0].developmentUrl==''||response.development[0].developmentUrl==null) { devUrl = `https://tratodirecto.com/${response.development[0].developmentNn}/${response.development[0].developerNn}/casas-en-venta-${response.development[0].localityNn}/${response.development[0].stateNn}.html`; } else { devUrl = response.development[0].developmentUrl; }
            development = '<table style="width:100%">';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Nombre</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devNameContainer"><label id="devNameLabel" style="font-size:16px;font-weight: 600" name="' + developmentName + '"><a href="' + devUrl + '" target="_blank">' + developmentName + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + devUrl + '">Copiar URL</button>';
            if (response.development[0].developmentUrl==''||response.development[0].developmentUrl==null) {
                development += '<button class="btn btn-primary" id="retryUrlsDev" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;margin-left: 5px;" data-longurl="' + devUrl + '" data-id="'+developmentId+'" data-namenorm="'+response.development[0].developmentNn+'" data-name="'+developmentName+'">Agregar Urls</button>';
            }
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevNameContainer" id="devNameUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';            
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Id</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + developmentId + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;">&nbsp;</td>';
            development += '</tr>';            
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Status</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devStatusContainer"><label id="devStatusLabel" name="' + developmentStatus + '">' + developmentStatusTxt + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevStatusContainer" id="devStatusUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';             
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Descripción Comercial</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devDescriptionContainer"><label id="devDescriptionLabel">' + developmentDescription + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevDescriptionContainer" id="devDescriptionUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; 
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Slogan</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devSloganContainer"><label id="devSloganLabel">' + developmentSlogan + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevSloganContainer" id="devSloganUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Categoría</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devCategoryContainer"><label id="devCategoryLabel">' + category + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevCategoryContainer" id="devCategoryUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Video</p></td>';
            if (devVideoId == 0) {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devVideoContainer"><label id="devVideoLabel" data-id="' + devVideoId + '" data-url="' + devVideoUrl + '" data-start="' + devVideoStart + '" data-end="' + devVideoEnd + '" data-priceid="' + devVideoPriceId + '" data-pricetxt="' + devVideoPriceTxt + '">&nbsp;</label></td>';  
            } else {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devVideoContainer"><label id="devVideoLabel" data-id="' + devVideoId + '" data-url="' + devVideoUrl + '" data-start="' + devVideoStart + '" data-end="' + devVideoEnd + '" data-priceid="' + devVideoPriceId + '" data-pricetxt="' + devVideoPriceTxt + '"><a href="' + devVideoUrl + '" target="_blank">' + devVideoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + devVideoUrl + '">Copiar URL</button><br>Inicio: ' + devVideoStart + '<br>Fin: ' + devVideoEnd + '<br>Precio: ' + devVideoPriceTxt + '</td>';  
            } 
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevVideoContainer" id="devVideoUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';    
                        development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Recorrido Virtual</p></td>';
            if (devVideo360Id == 0) {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devVideo360Container"><label id="devVideo360Label" data-id="' + devVideo360Id + '" data-url="' + devVideo360Url + '" data-provider="' + devVideo360Provider + '" data-providername="' + devVideo360ProviderName + '">&nbsp;</label></td>';  
            } else {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devVideo360Container"><label id="devVideo360Label" data-id="' + devVideo360Id + '" data-url="' + devVideo360Url + '" data-provider="' + devVideo360Provider + '" data-providername="' + devVideo360ProviderName + '"><a href="' + devVideo360Url + '" target="_blank">' + devVideo360Url + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + devVideo360Url + '">Copiar URL</button><br>Proveedor: ' + devVideo360ProviderName + '</td>';  
            } 
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevVideo360Container" id="devVideo360UpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';    
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Zona</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devZoneContainer"><label id="devZoneLabel" name="' + developmentZoneId + '">' + developmentZoneName + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevZoneContainer" id="devZoneUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Geoposición del Desarrollo</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="geoDevContainer">Latitud: <label id="latitudeLabel">' + developmentLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="longitudeLabel">' + developmentLongitude + '</label><br><a href="https://mylocation.org/" target="_blank">Mi geoposición</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="https://www.google.com/maps/?q=' + developmentLatitude + ',' + developmentLongitude + '" target="_blank">Geoposición del Desarrollo</a><br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="https://www.google.com/maps/?q=' + developmentLatitude + ',' + developmentLongitude + '">Copiar URL</button></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateGeoContainer" id="geoUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';   
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Dirección del Desarrollo</p></td>';
            development += '<input type="hidden" id="addressDevStreet" value="' + developmentStreet + '">';
            development += '<input type="hidden" id="addressDevExtNumber" value="' + developmentExtNumber + '">';
            development += '<input type="hidden" id="addressDevIntNumber" value="' + developmentIntNumber + '">';
            development += '<input type="hidden" id="addressDevPostalCode" value="' + developmentPostalCode + '">';
            development += '<input type="hidden" id="addressDevSubLocality" value="' + developmentSublocality + '">';
            development += '<input type="hidden" id="addressDevSubLocalityId" value="' + developmentSublocalityId + '">';
            development += '<input type="hidden" id="addressDevLocality" value="' + developmentLocality + '">';
            development += '<input type="hidden" id="addressDevLocalityId" value="' + developmentLocalityId + '">';
            development += '<input type="hidden" id="addressDevState" value="' + developmentState + '">';  
            development += '<input type="hidden" id="addressDevStateId" value="' + developmentStateId + '">';              
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devAddressContainer"><label id="devAddressLabel">' + developmentAddress + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevAddressContainer" id="devAddressUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; 
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Cómo llegar al Desarrollo</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devDirectionContainer"><label id="devDirectionLabel">' + developmentDirections + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevDirectionContainer" id="devDirectionUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Geoposición del Punto de Venta</p></td>';
            if (developmentPsLatitude == null) { developmentPsLatitude = 'NA'; }
            if (developmentPsLongitude == null) { developmentPsLongitude = 'NA'; }
            if ((developmentPsLatitude == 'NA') || (developmentPsLongitude == 'NA')) {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="psGeoDevContainer">Latitud: <label id="psLatitudeLabel">' + developmentPsLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="psLongitudeLabel">' + developmentPsLongitude + '</label></td>';
            } else {
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="psGeoDevContainer">Latitud: <label id="psLatitudeLabel">' + developmentPsLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="psLongitudeLabel">' + developmentPsLongitude + '</label><br><a href="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '" target="_blank">Geoposición del Punto de Venta</a><br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '">Copiar URL</button></td>';
            }
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updatePsGeoContainer" id="psGeoUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';   

            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Dirección del Punto de Venta</p></td>';
            development += '<input type="hidden" id="addressDevPsStreet" value="' + psAddressStreet + '">';
            development += '<input type="hidden" id="addressDevPsExtNumber" value="' + psAddressExtNumber + '">';
            development += '<input type="hidden" id="addressDevPsIntNumber" value="' + psAddressIntNumber + '">';
            development += '<input type="hidden" id="addressDevPsPostalCode" value="' + psAddressPostalCode + '">';
            development += '<input type="hidden" id="addressDevPsSubLocality" value="' + psAddressSublocality + '">';
            development += '<input type="hidden" id="addressDevPsSubLocalityId" value="' + psAddressSublocalityId + '">';
            development += '<input type="hidden" id="addressDevPsLocality" value="' + psLocality + '">';
            development += '<input type="hidden" id="addressDevPsLocalityId" value="' + psLocalityId + '">';
            development += '<input type="hidden" id="addressDevPsState" value="' + psState + '">';  
            development += '<input type="hidden" id="addressDevPsStateId" value="' + psStateId + '">';              
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devPsAddressContainer"><label id="devPsAddressLabel">' + developmentPsAddress + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevPsAddressContainer" id="devPsAddressUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; 

            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Cómo llegar al Punto de Venta</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devPsDirectionContainer"><label id="devPsDirectionLabel">' + psDirections + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevPsDirectionContainer" id="devPsDirectionUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  

            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Colaboradores</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devCollaboratorContainer">';
            $.each(developmentCollaborator, function(index, collaborator) {
                if (collaborator.length != 0 ) {
                    for (i=0; i<collaborator.length; i++) {
                        coordinator = ' / Coordinador: ' + collaborator[i].coordinatorName + ' ' + collaborator[i].coordinatorLastName + ' (' + collaborator[i].coordinatorPhone + ' / ' + collaborator[i].coordinatorEmail + ')';
                        development += '<input type="hidden" id="collaboratorTxtData_' + collaborator[i].id + '" value="' + collaborator[i].id + '/' + collaborator[i].name + '/' + collaborator[i].lastName + '/' + collaborator[i].role + '">';   
                        if (collaborator[i].coordinatorName == '') {
                            development += '<label class="collaboratorData" id="devCollaboratorsLabel_' + collaborator[i].id + '" name="' + collaborator[i].id + '">' + collaborator[i].name + ' ' + collaborator[i].lastName + ' / ' + collaborator[i].phone + ' / ' + collaborator[i].email + ' / ' + collaborator[i].role + '</label><br>';
                        }  else {      
                            development += '<label class="collaboratorData" id="devCollaboratorsLabel_' + collaborator[i].id + '" name="' + collaborator[i].id + '">' + collaborator[i].name + ' ' + collaborator[i].lastName + ' / ' + collaborator[i].phone + ' / ' + collaborator[i].email + ' / ' + collaborator[i].role + coordinator + '</label><br>';
                        }
                    }  
                } else {
                    development += '<label id="devCollaboratorsLabel">No existen contactos asignados.</label>';
                }
            });            
            development += '</td>';
            development += '<input type="hidden" id="developerId" value="' + developerId + '">';  
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="openCollaboratorModal" id="devCollaboratorUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  
            if (developerCentralAssigment == 1 ) {
                development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                development += '<td style="vertical-align:top;padding-top:4px;width:120px">&nbsp;</td>';
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label style="font-weight: bold">' + developerName + ' cuenta con Asignación Central</label></td>';
                development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;">&nbsp;</td>';
                development += '</tr>';  
            }           
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Características</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devFeatureContainer"><label id="devFeaturesLabel">' + devFeatures + '<br>Métodos de pago: ' + devFeaturesPayment + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevFeaturesContainer" id="devFeaturesUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Argumentos de venta</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devSaleArgumentContainer"><label id="devSaleArgumentLabel" name="' + developmentContactCenter + '">' + saleArgument + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevSaleArgumentContainer" id="devSaleArgumentUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';  
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Contact Center</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devContactCenterContainer"><label id="devContactCenterLabel" name="' + developmentContactCenter + '">' + developmentContactCenterTxt + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevContactCenterContainer" id="devContactCenterUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';               
            development += '<tr style="border-bottom: 1 px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Imágenes</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label id="devCount">';
            if (response.development[0].mediaApi=="0") {
                development += '<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto;width: 20px;"></label></td>';
            } else {
                development += 'No se han agregardo imagenes nuevas';
            }
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;">'
            if (response.development[0].mediaApi=="0") {
                development += '<a href="#" id="devOpenImageModalButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a>';
            } else {
                development += '';
            }
            development += '</td>';
            development += '</tr>';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Imágenes en uso</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="imgSelect">';
            if (response.development[0].mediaApi=="0") {
                development += 'Nuevas';
            } else {
                development += 'Viejas';
            }
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" id="devOpenImageSelect" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; 

            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Cover</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="imgCover">';
            if (cover.id == 0) {
                development += '<p id="currentCover">Sin cover</p>';
            } else {
                development += '<p id="currentCover"><a href="' + cover.url + '" target="_blank">Ver cover</a></p>';
            }
            development += '</td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" id="devOpenImageCover" name="' + developmentId  + '" data-currentcover="' + cover.mediaGroup + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>'; 

            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Tipo de visita</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devVisitsAllowedContainer"><label id="devVisitsAllowedLabel" name="' + developmentVisitsAllowed + '">' + developmentVisitsAllowedTxt + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevVisitsAllowedContainer" id="devVisitsAllowedUpdateButton" name="' + developmentId  + '" style="font-size:12px;">Editar</a></td>';
            development += '</tr>';
            development += '<tr style="border-bottom: 1px dotted #eeeeee;">';
            development += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Tipo de Negocio</p></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="devNegotationContainer"><label id="devNegotationLabel">' + negotation + '</label></td>';
            development += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateDevNegotationContainer" id="devNegotationUpdateButton" name="' + developmentId  + '" style="font-size:12px;display:block">Editar</a></td>';
            development += '</tr>';
            development += '</table>';
            if (response.development[0].mediaApi=="0") {
                getImagesCount(developmentId, "hd", "devCount");
            }
            if (developmentId != null) { 
                $("#developmentDataContainer").append(development); 
            } else {
                $("#developmentDataContainer").append("Error"); 
            }     
        }
    });
}

$(document).on("click", ".updateDevNameContainer", function(e) {
    e.preventDefault();
    var formDevName = '';
    var developmentId = $(this).attr('name');
    var currentName = $('#devNameLabel').attr('name');
    var currentNameNormalize = normaliza(currentName);
    $('#devNameUpdateButton').css("display", "none");
    formDevName = '<form class="form-inline" style="padding-bottom:6px;">';
    formDevName += '<div class="form-group">';
    formDevName += '<input type="hidden" id="textDevName" value="' + currentName + '">';
    formDevName += '<input type="text" class="form-control input-sm" style="width:250px;" id="inputDevName" value="' + currentName + '">';
    formDevName += '<input type="text" class="form-control input-sm" style="width:250px;" id="inputDevNameNormalize" value="' + currentNameNormalize + '">';
    formDevName += '</div>'; 
    formDevName += '<div class="form-group">';
    formDevName += '<button type="button" class="btn btn-sm btn-cancel cancelDevName" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formDevName += '&nbsp;&nbsp;';  
    formDevName += '<button type="button" class="btn btn-sm btn-go updateDevName" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formDevName += '</div>';    
    formDevName += '<div class="form-group" id="updateDevNameResponse" style="margin-top:2px">';    
    formDevName += '</div>';    
    formDevName += '</form>';
    $('#devNameContainer').html(formDevName);    
});

$(document).on("keyup", "#inputDevName", function (e) {
    var nameNormalize = normaliza($("#inputDevName").val());
    $("#inputDevNameNormalize").val(nameNormalize);
});

$(document).on("click", ".cancelDevName", function(e) {
    e.preventDefault();
    var developmentId = $(this).attr('name');
    var currentName = $('#textDevName').val();
    $('#devNameUpdateButton').css("display", "block");
    $('#devNameContainer').html('<label id="devNameLabel" style="font-size:16px;font-weight: 600" name="' + currentName + '"><a href="https://tratod.com/d-' + developmentId + '" target="_blank">' + currentName + '</a></label>');    
});

$(document).on("click", ".updateDevName", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentName = $('#textDevName').val().trim();
    var developmentName = $('#inputDevName').val().trim();
    var devNameNormalize = $('#inputDevNameNormalize').val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;  
    var regString = /^([a-zA-Z0-9-áéíóúÁÉÍÓÚÜüÑñ&\(\)\s\"\']+)$/;
    if (currentName == developmentName) {
        $('#updateDevNameResponse').html('<label style="color:red">El nombre no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevNameResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        if (developmentName == '') {
            $('#updateDevNameResponse').html('<label style="color:red">Ingresa un nombre válido.</label>');       
            flag++;
        } else {
            if (!(regString.test(developmentName))) {
                $('#updateDevNameResponse').html('<label style="color:red">Ingresa un nombre válido.</label>');       
                flag++;
            } else {
                $('#updateDevNameResponse').html('');
            }
        }
    }

    if (flag == 0) {
        $('#updateDevNameResponse').html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentName",developmentId:developmentId,developmentName:developmentName,devNameNormalize:devNameNormalize,currentName:currentName,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                if (response == 'success') {
                    $('#updateDevNameResponse').html('<label style="color:green">El nombre se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devNameContainer').html('<label id="devNameLabel" style="font-size:16px;font-weight: 600" name="' + developmentName + '"><a href="https://tratod.com/d-' + developmentId + '" target="_blank">' + developmentName + '</a></label>');    
                        $('#updateDevNameResponse').html('');
                        $('#devNameUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevNameResponse').html('<label style="color:red">Hubo un error. '+response+'</label>');
                    setTimeout(function () { 
                        $('#updateDevNameResponse').html('');
                        $('#devNameUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevNameResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevNameResponse').html('');
                    $('#devNameUpdateButton').css("display", "block");
                }, 2000);                   
            }            
        });       
    }  
});

$(document).on("click", ".updateDevZoneContainer", function(e) {
    e.preventDefault();
    var formZone = '';
    var developmentId = $(this).attr('name');
    var currentZoneId = $('#devZoneLabel').attr('name');
    var currentZoneName = $('#devZoneLabel').html();
    //console.log(developmentId, currentZoneId, currentZoneName);
    $('#devZoneUpdateButton').css("display", "none");
    formZone = '<form class="form-inline" style="padding-bottom:6px;">';
    formZone += '<div class="form-group">';
    formZone += '<input type="hidden" id="textDevZoneId" value="' + currentZoneId + '">';
    formZone += '<input type="hidden" id="textDevZoneName" value="' + currentZoneName + '">';
    formZone += '<select class="form-control input-sm" id="selectDevZones">';
    if (currentZoneId == 0) {
        formZone += '<option value="0" selected>Ninguno</option>';
    } else {
        formZone += '<option value="0">Ninguno</option>';
    }
    formZone += '</select>';
    formZone += '</div>';  
    formZone += '<div class="form-group">';
    formZone += '<button type="button" class="btn btn-sm btn-cancel cancelDevZone" value="' + developmentId + '" data-currentid="' + currentZoneId + '" data-currentname="' + currentZoneName + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formZone += '&nbsp;&nbsp;';
    formZone += '<button type="button" class="btn btn-sm btn-go updateDevZone" value="' + developmentId + '" name="' + currentZoneId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formZone += '</div>';    
    formZone += '<div class="form-group" id="updateDevZoneResponse" style="margin-top:2px">';    
    formZone += '</div>';    
    formZone += '</form>';
    $('#devZoneContainer').html(formZone);
    getZones(currentZoneId, 'selectDevZones');
});

$(document).on("click", ".updateDevZone", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentZoneId = $('#textDevZoneId').val();
    var currentZoneName = $('#textDevZoneName').val();   $( "#myselect option:selected" ).text();
    var zoneId = $('#selectDevZones').val();
    var zoneName = $( "#selectDevZones option:selected" ).text();
    var flag = 0;
    //console.log(developmentId, currentZoneId, currentZoneName, zoneId, zoneName);
    if (currentZoneId == zoneId) {
        $('#updateDevZoneResponse').html('<label style="color:red">La zona no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updateDevZoneResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        $('#updateDevZoneResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevZoneResponse').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentZone",developmentId:developmentId,zoneId:zoneId,currentZoneId:currentZoneId},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevZoneResponse').html('<label style="color:green">La zona se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devZoneContainer').html('<label id="devZoneLabel" name="' + zoneId + '">' + zoneName + '</label>'); 
                        $('#updateDevZoneResponse').html('');
                        $('#devZoneUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevZoneResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevZoneResponse').html('');
                        $('#devZoneUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevZoneResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevZoneResponse').html('');
                    $('#devZoneUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });        
    }    
});

$(document).on('click', '.cancelDevZone', function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var zoneId = $('.cancelDevZone').attr('data-currentid');
    var zoneName = $('.cancelDevZone').attr('data-currentname');
    $('#devZoneUpdateButton').css("display", "block");
    $('#devZoneContainer').html('<label id="devZoneLabel" name="' + zoneId + '">' + zoneName + '</label>'); 
});

function getZones(currentZoneId, container) {
    $.ajax({
        type: "GET",
        data: {type:"getZones"},
        url: "./php/adminData.php",
        dataType: 'json',
        success: function(response) {
            $.each(response.zone, function(index, zone) {
                if (currentZoneId == zone.id) {
                    $('#' + container).append('<option value="'+zone.id+'" selected>'+zone.name+'</option>');
                } else {
                    $('#' + container).append('<option value="'+zone.id+'">'+zone.name+'</option>');
                }
            });
        }
    });
}

$(document).on("click", ".updateDevStatusContainer", function(e) {
    e.preventDefault();
    var formStatus = '';
    var developmentId = $(this).attr('name');
    var currentStatus = $('#devStatusLabel').attr('name');
    //console.log(developmentId, currentStatus);
    $('#devStatusUpdateButton').css("display", "none");
    formStatus = '<form class="form-inline" style="padding-bottom:6px;">';
    formStatus += '<div class="form-group">';
    formStatus += '<input type="hidden" id="textDevStatus" value="' + currentStatus + '">';
    formStatus += '<select class="form-control input-sm" id="selectDevStatus">';
    formStatus += '<option value="1" '; 
    if (currentStatus == 1) { formStatus += 'selected'; }
    formStatus += '>Activo</option>';
    formStatus += '<option value="2" '; 
    if (currentStatus == 2) { formStatus += 'selected'; }
    formStatus += '>Inactivo</option>';
    formStatus += '<option value="9" '; 
    if (currentStatus == 9) { formStatus += 'selected'; }
    formStatus += '>Demo</option>';    
    formStatus += '</select>';
    formStatus += '</div>';  
    formStatus += '<div class="form-group">';
    formStatus += '<button type="button" class="btn btn-sm btn-cancel cancelDevStatus" value="' + developmentId + '" name="' + currentStatus + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formStatus += '&nbsp;&nbsp;';
    formStatus += '<button type="button" class="btn btn-sm btn-go updateDevStatus" value="' + developmentId + '" name="' + currentStatus + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formStatus += '</div>';    
    formStatus += '<div class="form-group" id="updateDevStatusResponse" style="margin-top:2px">';    
    formStatus += '</div>';    
    formStatus += '</form>';
    $('#devStatusContainer').html(formStatus);
});

$(document).on('click', '.cancelDevStatus', function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var developmentStatus = $('#textDevStatus').val();
    if (developmentStatus == 1) {
        currentStatus = "Activo"
    } else if (developmentStatus == 2) {
        currentStatus = "Inactivo"
    } else if (developmentStatus == 9) {
        currentStatus = "Demo"        
    } else {
        currentStatus = "Error";
    }
    $('#devStatusUpdateButton').css("display", "block");
    $('#devStatusContainer').html('<label id="devStatusLabel" name="' + developmentStatus + '">' + currentStatus + '</label>'); 
});

$(document).on("click", ".updateDevStatus", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDevelopmentStatus = $('#textDevStatus').val();
    var newDevelopmentStatus = $('#selectDevStatus').val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;
    if (newDevelopmentStatus == 1) {
        var status = "Activo"
    } else if (newDevelopmentStatus == 2) {
        var status = "Inactivo"
    } else if (newDevelopmentStatus == 9) {
        var status = "Demo"        
    } else {
        var status = "Error"
    }
    //console.log(developmentId, currentDevelopmentStatus, newDevelopmentStatus, status);
    if (currentDevelopmentStatus == newDevelopmentStatus) {
        $('#updateDevStatusResponse').html('<label style="color:red">El status no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevStatusResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        $('#updateDevStatusResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevStatusResponse').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentStatus",developmentId:developmentId,newDevelopmentStatus:newDevelopmentStatus,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevStatusResponse').html('<label style="color:green">El status se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devStatusContainer').html('<label id="devStatusLabel" name="' + newDevelopmentStatus + '">' + status + '</label>'); 
                        $('#updateDevStatusResponse').html('');
                        $('#devStatusUpdateButton').css("display", "block");
                    }, 2000);
                } else if(response == 'error') {
                    $('#updateDevStatusResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevStatusResponse').html('');
                        $('#devStatusUpdateButton').css("display", "block");
                    }, 2000);                    
                } else {
                    $('#updateDevStatusResponse').html('<label style="color:green">El status se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devStatusContainer').html('<label id="devStatusLabel" name="' + newDevelopmentStatus + '">' + status + '</label>'); 
                        $('#updateDevStatusResponse').html('');
                        $('#devStatusUpdateButton').css("display", "block");
                    }, 2000);
                    text = response.state+" estado(s), "+response.locality+" municipio(s) y "+response.zone+" zona(s) tienen el desarrollo como publicidad, favor de cambiar";
                    notify("growl-danger", "Publicidad", text); 
                }
            },
            error: function(response) {
                $('#updateDevStatusResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevStatusResponse').html('');
                    $('#devStatusUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });        
    }    
});

$(document).on("click", ".updateDevPsDirectionContainer", function(e) {
    e.preventDefault();
    var formDirection = '';
    var developmentId = $(this).attr('name');
    var currentPsDirection = $('#devPsDirectionLabel').html();
    $('#devPsDirectionUpdateButton').css("display", "none");
    formDirection = '<form style="padding-bottom:6px;">';
    formDirection += '<input type="hidden" id="inputDevPsDirection" value="' + currentPsDirection + '">';
    formDirection += '<div class="row">';
    formDirection += '<div class="form-group" style="margin:2px;">';
    formDirection += '<div class="col-md-12">';
    formDirection += '<textarea rows="3" style="min-width:100%" id="textDevPsDirection">' + currentPsDirection + '</textarea>';
    formDirection += '</div>';  
    formDirection += '</div>';  
    formDirection += '</div>'; 
    formDirection += '<div class="row">';
    formDirection += '<div class="form-group style="margin:2px;">'; 
    formDirection += '<div class="col-md-6 col-lg-3">';
    formDirection += '<button type="button" class="btn btn-sm btn-cancel cancelDevPsDirection" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formDirection += '&nbsp;&nbsp;';  
    formDirection += '<button type="button" class="btn btn-sm btn-go updateDevPsDirection" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formDirection += '</div>'; 
    formDirection += '<div class="col-md-6 col-lg-9" id="updateDevPsDirectionResponse" style="margin-top:2px">';  
    formDirection += '</div>'; 
    formDirection += '</div>';    
    formDirection += '</div>';  
    formDirection += '</form>';
    $('#devPsDirectionContainer').html(formDirection);    
});

$(document).on('click', '.cancelDevPsDirection', function(e) {
    e.preventDefault(e);
    var direction = $('#inputDevPsDirection').val();
    $('#devPsDirectionUpdateButton').css("display", "block");
    $('#devPsDirectionContainer').html('<label id="devPsDirectionLabel">' + direction + '</label>');   
});

$(document).on("click", ".updateDevPsDirection", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentPsDirection = $('#inputDevPsDirection').val().trim();
    var psDirection = $('#textDevPsDirection').val().trim();
    var flag = 0;    
    //console.log(developmentId, currentDescription, description);
    if (currentPsDirection == psDirection) {
        $('#updateDevPsDirectionResponse').html('<label style="color:red">El texto no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updateDevPsDirectionResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updateDevPsDirectionResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevPsDirectionResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentPsDirection",developmentId:developmentId,psDirection:psDirection,currentPsDirection:currentPsDirection},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevPsDirectionResponse').html('<label style="color:green">La descripción se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devPsDirectionContainer').html('<label id="devDirectionLabel">' + psDirection + '</label>'); 
                        $('#updateDevPsDirectionResponse').html('');
                        $('#devPsDirectionUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevPsDirectionResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevPsDirectionResponse').html('');
                        $('#devPsDirectionUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevPsDirectionResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevPsDirectionResponse').html('');
                    $('#devPsDirectionUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });         
    }       
});

$(document).on("click", ".updateDevDirectionContainer", function(e) {
    e.preventDefault();
    var formDirection = '';
    var developmentId = $(this).attr('name');
    var currentDirection = $('#devDirectionLabel').html();
    $('#devDirectionUpdateButton').css("display", "none");
    formDirection = '<form style="padding-bottom:6px;">';
    formDirection += '<input type="hidden" id="inputDevDirection" value="' + currentDirection + '">';
    formDirection += '<div class="row">';
    formDirection += '<div class="form-group" style="margin:2px;">';
    formDirection += '<div class="col-md-12">';
    formDirection += '<textarea rows="3" style="min-width:100%" id="textDevDirection">' + currentDirection + '</textarea>';
    formDirection += '</div>';  
    formDirection += '</div>';  
    formDirection += '</div>'; 
    formDirection += '<div class="row">';
    formDirection += '<div class="form-group style="margin:2px;">'; 
    formDirection += '<div class="col-md-6 col-lg-3">';
    formDirection += '<button type="button" class="btn btn-sm btn-cancel cancelDevDirection" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formDirection += '&nbsp;&nbsp;';  
    formDirection += '<button type="button" class="btn btn-sm btn-go updateDevDirection" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formDirection += '</div>'; 
    formDirection += '<div class="col-md-6 col-lg-9" id="updateDevDirectionResponse" style="margin-top:2px">';  
    formDirection += '</div>'; 
    formDirection += '</div>';    
    formDirection += '</div>';  
    formDirection += '</form>';
    $('#devDirectionContainer').html(formDirection);    
});

$(document).on('click', '.cancelDevDirection', function(e) {
    e.preventDefault(e);
    var direction = $('#inputDevDirection').val();
    $('#devDirectionUpdateButton').css("display", "block");
    $('#devDirectionContainer').html('<label id="devDirectionLabel">' + direction + '</label>');   
});

$(document).on("click", ".updateDevDirection", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDirection = $('#inputDevDirection').val().trim();
    var direction = $('#textDevDirection').val().trim();
    var flag = 0;    
    //console.log(developmentId, currentDescription, description);
    if (currentDirection == direction) {
        $('#updateDevDirectionResponse').html('<label style="color:red">El texto no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updateDevDirectionResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updateDevDirectionResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevDirectionResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentDirection",developmentId:developmentId,direction:direction,currentDirection:currentDirection},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevDirectionResponse').html('<label style="color:green">La descripción se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devDirectionContainer').html('<label id="devDirectionLabel">' + direction + '</label>'); 
                        $('#updateDevDirectionResponse').html('');
                        $('#devDirectionUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevDirectionResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevDirectionResponse').html('');
                        $('#devDirectionUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevDirectionResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevDirectionResponse').html('');
                    $('#devDirectionUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });         
    }       
});

$(document).on("click", ".updateDevDescriptionContainer", function(e) {
    e.preventDefault();
    var formDescription = '';
    var developmentId = $(this).attr('name');
    var currentDescription = $('#devDescriptionLabel').html();
    $('#devDescriptionUpdateButton').css("display", "none");
    formDescription = '<form style="padding-bottom:6px;">';
    formDescription += '<input type="hidden" id="inputDevDescription" value="' + currentDescription + '">';
    formDescription += '<div class="row">';
    formDescription += '<div class="form-group" style="margin:2px;">';
    formDescription += '<div class="col-md-12">';
    formDescription += '<textarea rows="3" style="min-width:100%" id="textDevDescription">' + currentDescription + '</textarea>';
    formDescription += '</div>';  
    formDescription += '</div>';  
    formDescription += '</div>'; 
    formDescription += '<div class="row">';
    formDescription += '<div class="form-group style="margin:2px;">'; 
    formDescription += '<div class="col-md-6 col-lg-3">';
    formDescription += '<button type="button" class="btn btn-sm btn-cancel cancelDevDescription" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formDescription += '&nbsp;&nbsp;';  
    formDescription += '<button type="button" class="btn btn-sm btn-go updateDevDescription" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formDescription += '</div>'; 
    formDescription += '<div class="col-md-6 col-lg-9" id="updateDevDescriptionResponse" style="margin-top:2px">';  
    formDescription += '</div>'; 
    formDescription += '</div>';    
    formDescription += '</div>';  
    formDescription += '</form>';
    $('#devDescriptionContainer').html(formDescription);    
});

$(document).on('click', '.cancelDevDescription', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var description = $('#inputDevDescription').val();
    $('#devDescriptionUpdateButton').css("display", "block");
    $('#devDescriptionContainer').html('<label id="devDescriptionLabel">' + description + '</label>');   
});

$(document).on("click", ".updateDevDescription", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDescription = $('#inputDevDescription').val().trim();
    var description = $('#textDevDescription').val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    //console.log(developmentId, currentDescription, description);
    if (currentDescription == description) {
        $('#updateDevDescriptionResponse').html('<label style="color:red">La descripción no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updateDevDescriptionResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updateDevDescriptionResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevDescriptionResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentDescription",developmentId:developmentId,description:description,currentDescription:currentDescription,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevDescriptionResponse').html('<label style="color:green">La descripción se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devDescriptionContainer').html('<label id="devDescriptionLabel">' + description + '</label>'); 
                        $('#updateDevDescriptionResponse').html('');
                        $('#devDescriptionUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevDescriptionResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevDescriptionResponse').html('');
                        $('#devDescriptionUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevDescriptionResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevDescriptionResponse').html('');
                    $('#devDescriptionUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });         
    }       
});

$(document).on("click", ".updateDevSloganContainer", function(e) {
    e.preventDefault();
    var formSlogan = '';
    var developmentId = $(this).attr('name');
    var currentSlogan = $('#devSloganLabel').html();
    $('#devSloganUpdateButton').css("display", "none");
    formSlogan = '<form style="padding-bottom:6px;">';
    formSlogan += '<input type="hidden" id="textDevSlogan" value="' + currentSlogan + '">';
    formSlogan += '<div class="row">';
    formSlogan += '<div class="form-group" style="margin:2px;">';
    formSlogan += '<div class="col-md-12">';
    formSlogan += '<textarea rows="2" style="min-width:100%" id="inputDevSlogan">' + currentSlogan + '</textarea>';
    formSlogan += '</div>';  
    formSlogan += '</div>';  
    formSlogan += '</div>'; 
    formSlogan += '<div class="row">';
    formSlogan += '<div class="form-group style="margin:2px;">'; 
    formSlogan += '<div class="col-md-6 col-lg-3">';
    formSlogan += '<button type="button" class="btn btn-sm btn-cancel cancelDevSlogan" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formSlogan += '&nbsp;&nbsp;';  
    formSlogan += '<button type="button" class="btn btn-sm btn-go updateDevSlogan" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formSlogan += '</div>'; 
    formSlogan += '<div class="col-md-6 col-lg-9" id="updateDevSloganResponse" style="margin-top:2px">';  
    formSlogan += '</div>'; 
    formSlogan += '</div>';    
    formSlogan += '</div>';  
    formSlogan += '</form>';
    $('#devSloganContainer').html(formSlogan);    
});

$(document).on('click', '.cancelDevSlogan', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var slogan = $('#inputDevSlogan').val();
    $('#devSloganUpdateButton').css("display", "block");
    $('#devSloganContainer').html('<label id="devSloganLabel">' + slogan + '</label>');   
});

$(document).on("click", ".updateDevSlogan", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentSlogan = $('#textDevSlogan').val().trim();
    var slogan = $('#inputDevSlogan').val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    if (currentSlogan == slogan) {
        $('#updateDevSloganResponse').html('<label style="color:red">El Slogan no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevSloganResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updateDevSloganResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevSloganResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentSlogan",developmentId:developmentId,slogan:slogan,currentSlogan:currentSlogan,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevSloganResponse').html('<label style="color:green">El Slogan se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devSloganContainer').html('<label id="devSloganLabel">' + slogan + '</label>'); 
                        $('#updateDevSloganResponse').html('');
                        $('#devSloganUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevSloganResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevSloganResponse').html('');
                        $('#devSloganUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevSloganResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevSloganResponse').html('');
                    $('#devSloganUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });         
    }       
});

$(document).on("click", ".updateDevVideoContainer", function(e) {
    e.preventDefault();
    var formVideo = '';
    var developmentId = $(this).attr('name');
    var currentVideoId = $('#devVideoLabel').data('id');    
    var currentVideoUrl = $('#devVideoLabel').data('url');
    var currentVideoStart = $('#devVideoLabel').data('start');
    var currentVideoEnd = $('#devVideoLabel').data('end');
    var currentPriceId = $('#devVideoLabel').data('priceid');
    var currentPriceTxt = $('#devVideoLabel').data('pricetxt');
    $('#devVideoUpdateButton').css("display", "none");
    formVideo = '<form class="form-horizontal">';
    formVideo += '<input type="hidden" id="textDevVideoId" value="' + currentVideoId + '">';
    formVideo += '<input type="hidden" id="textDevVideoUrl" value="' + currentVideoUrl + '">';    
    formVideo += '<input type="hidden" id="textDevVideoStart" value="' + currentVideoStart + '">';
    formVideo += '<input type="hidden" id="textDevVideoEnd" value="' + currentVideoEnd + '">';
    formVideo += '<input type="hidden" id="textDevVideoPriceId" value="' + currentPriceId + '">';
    formVideo += '<input type="hidden" id="textDevVideoPriceTxt" value="' + currentPriceTxt + '">';
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">URL</label>';
    formVideo += '<div class="col-sm-7">';
    formVideo += '<input type="text" class="form-control input-sm" style="height:24px;" id="inputDevVideo" value="' + currentVideoUrl + '">';
    formVideo += '</div>';
    formVideo += '</div>';
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">Inicio</label>';
    formVideo += '<div class="col-sm-4">';
    formVideo += '<input type="text" class="form-control input-sm" style="height:24px;" id="inputDevVideoStart" value="' + currentVideoStart + '">';
    formVideo += '</div>';       
    formVideo += '</div>';   
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">Fin</label>';
    formVideo += '<div class="col-sm-4">';
    formVideo += '<input type="text" class="form-control input-sm" style="height:24px;" id="inputDevVideoEnd" value="' + currentVideoEnd + '">';
    formVideo += '</div>';       
    formVideo += '</div>';  
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">Precio</label>';
    formVideo += '<div class="col-sm-4">';
    formVideo += '<select class="form-control input-sm" id="inputDevVideoPriceId" style="height:24px;padding:4px;">';
    if (currentVideoId == 0) {
        formVideo += '<option value="0" selected>Oculto</option>';
        formVideo += '<option value="1">Visible</option>';
    } else {
        if (currentPriceId == 1) {
            formVideo += '<option value="0">Oculto</option>';
            formVideo += '<option value="1" selected>Visible</option>';
        } else {
            formVideo += '<option value="0" selected>Oculto</option>';
            formVideo += '<option value="1">Visible</option>';
        }
    }
    formVideo += '</select>';
    formVideo += '</div>';       
    formVideo += '</div>';
    formVideo += '<div class="form-group" style="margin-bottom:12px;">';
    formVideo += '<div class="col-sm-9 col-md-offset-2">';
    formVideo += '<button type="button" class="btn btn-md btn-cancel cancelDevVideo" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formVideo += '&nbsp;&nbsp;'; 
    formVideo += '<button type="button" class="btn btn-md btn-go updateDevVideo" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formVideo += '</div>';  
    formVideo += '<div class="col-sm-9 col-md-offset-2" style="margin-top:4px;" id="updateDevVideoResponse">';
    formVideo += '</div>';  
    formVideo += '</div>';                                
    formVideo += '</form>';          
    $('#devVideoContainer').html(formVideo); 
    jQuery("#inputDevVideoStart").mask('99:99');
    jQuery("#inputDevVideoEnd").mask('99:99');   
});


$(document).on("click", ".updateDevVideo360Container", function(e) {
    e.preventDefault();
    var formVideo = '';
    var developmentId = $(this).attr('name');
    var currentVideo360Id = $('#devVideo360Label').data('id');    
    var currentVideo360Url = $('#devVideo360Label').data('url');
    var currentVideo360Provider = $('#devVideo360Label').data('provider');
    var currentVideo360ProviderName = $('#devVideo360Label').data('providername');
    $('#devVideo360UpdateButton').css("display", "none");
    formVideo = '<form class="form-horizontal">';
    formVideo += '<input type="hidden" id="textDevVideo360Id" value="' + currentVideo360Id + '">';
    formVideo += '<input type="hidden" id="textDevVideo360Url" value="' + currentVideo360Url + '">';    
    formVideo += '<input type="hidden" id="textDevVideo360Provider" value="' + currentVideo360Provider + '">';
    formVideo += '<input type="hidden" id="textDevVideo360ProviderName" value="' + currentVideo360ProviderName + '">';
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">URL</label>';
    formVideo += '<div class="col-sm-7">';
    formVideo += '<input type="text" class="form-control input-sm" style="height:24px;" id="inputDevVideo360Url" value="' + currentVideo360Url + '">';
    formVideo += '</div>';
    formVideo += '</div>';
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">Proveedor</label>';
    formVideo += '<div class="col-sm-4">';
    formVideo += '<select class="form-control input-sm" id="inputDevVideo360Provider-' + developmentId + '" style="height:24px;padding:4px;">';
    formVideo += '<option value="0">Selecciona...</option>';
    formVideo += '</select>';
    formVideo += '</div>';       
    formVideo += '</div>';
    formVideo += '<div class="form-group" style="margin-bottom:12px;">';
    formVideo += '<div class="col-sm-9 col-md-offset-2">';
    formVideo += '<button type="button" class="btn btn-md btn-cancel cancelDevVideo360" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formVideo += '&nbsp;&nbsp;'; 
    formVideo += '<button type="button" class="btn btn-md btn-go updateDevVideo360" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formVideo += '</div>';  
    formVideo += '<div class="col-sm-9 col-md-offset-2" style="margin-top:4px;" id="updateDevVideo360Response">';
    formVideo += '</div>';  
    formVideo += '</div>';                                
    formVideo += '</form>';          
    $('#devVideo360Container').html(formVideo); 
    getMediaProvider('inputDevVideo360Provider-' + developmentId, currentVideo360Provider);
});

$(document).on("click", ".updateDevVideo360", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentVideoId = $('#textDevVideo360Id').val();
    var currentVideoUrl = $('#textDevVideo360Url').val();
    var currentVideoProvider = $('#textDevVideo360Provider').val();
    var videoUrl = $('#inputDevVideo360Url').val().trim();
    var videoProvider = $('#inputDevVideo360Provider-' + developmentId).val();
    var videoProviderName = $('#inputDevVideo360Provider-' + developmentId + ' option:selected').text();
    var flag = 0;
    if (flag == 0) {
        $('#updateDevVideo360Response').html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentVideo360",developmentId:developmentId,videoUrl:videoUrl,videoProvider:videoProvider,currentVideoId:currentVideoId,currentVideoUrl:currentVideoUrl,currentVideoProvider:currentVideoProvider},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevVideo360Response').html('<label style="color:green">La URL del Recorrido Virtual se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        updateDevVideo360Container(developmentId)
                    }, 2000);                       
                } else {
                    $('#updateDevVideo360Response').html('<label style="color:red">Hubo un error.</label>');  
                    setTimeout(function () { 
                        updateDevVideo360Container(developmentId)
                    }, 2000);           
                }
            },
            error: function(response) {
                $('#updateDevVideo360Response').html('<label style="color:red">Hubo un error.</label>');   
                    setTimeout(function () { 
                        updateDevVideo360Container(developmentId)
                    }, 2000);            
            }            
        });   
    }
});

function updateDevVideo360Container(developmentId) {
    $('#devVideo360UpdateButton').css("display", "block");
    $('#updateDevVideo360Response').html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentVideo360", developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            if (response.id == 0) {
                string = '<label id="devVideo360Label" data-id="' + response.id + '" data-url="' + response.url + '" data-provider="' + response.mediaProvider + '" data-providername="' + response.mediaProviderName + '">&nbsp;</label>';  
            } else {
                string = '<label id="devVideo360Label" data-id="' + response.id + '" data-url="' + response.url + '" data-provider="' + response.mediaProvider + '" data-providername="' + response.mediaProviderName + '"><a href="' + response.url + '" target="_blank">' + response.url + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + response.url + '">Copiar URL</button><br>Proveedor: ' + response.mediaProviderName;  
            }     
            $('#devVideo360Container').html(string);              
        }
    });
}

$(document).on("click", ".cancelDevVideo360", function(e) {
    e.preventDefault();
    var currentVideoId = $('#textDevVideo360Id').val();
    var currentVideoUrl = $('#textDevVideo360Url').val();
    var currentVideoProvider = $('#textDevVideo360Provider').val();
    var currentVideoProviderName = $('#textDevVideo360ProviderName').val();
    //console.log(currentVideoId, currentVideoUrl, currentVideoProvider, currentVideoProviderName);
    $('#devVideo360UpdateButton').css("display", "block");
    if (currentVideoId == 0) {
        string = '<label id="devVideo360Label" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-provider="' + currentVideoProvider + '" data-providername="' + currentVideoProviderName + '">&nbsp;</label>';  
    } else {
        string = '<label id="devVideo360Label" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-provider="' + currentVideoProvider + '" data-providername="' + currentVideoProviderName + '"><a href="' + currentVideoUrl + '" target="_blank">' + currentVideoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + currentVideoUrl + '">Copiar URL</button><br>Proveedor: ' + currentVideoProviderName;  
    }    
    $('#devVideo360Container').html(string);    
});

function getMediaProvider(elementId, providerId) {   
    $.ajax({
        type: "GET",
        data: {type:"getMediaProvider"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $.each(response.mediaProvider, function(index, provider) {
                if (providerId == provider.id) {
                    string = "<option value='" + provider.id + "' selected>" + provider.name + "</option>";
                } else {
                    string = "<option value='" + provider.id + "'>" + provider.name + "</option>";
                }
                $('#' + elementId).append(string);
            });
        }
    });	
}

$(document).on("click", ".cancelDevVideo", function(e) {
    e.preventDefault();
    var currentVideoId = $('#textDevVideoId').val();
    var currentVideoUrl = $('#textDevVideoUrl').val();
    var currentVideoStart = $('#textDevVideoStart').val();
    var currentVideoEnd = $('#textDevVideoEnd').val();
    var currentPriceId = $('#textDevVideoPriceId').val();
    var currentPriceTxt = $('#textDevVideoPriceTxt').val();
    $('#devVideoUpdateButton').css("display", "block");
    if (currentVideoId == 0) {
        var string = '<label id="devVideoLabel" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-start="' + currentVideoStart + '" data-end="' + currentVideoEnd + '" data-priceid="' + currentPriceId + '" data-pricetxt="' + currentPriceTxt + '">&nbsp;</label>';  
    } else {
        var string = '<label id="devVideoLabel" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-start="' + currentVideoStart + '" data-end="' + currentVideoEnd + '" data-priceid="' + currentPriceId + '" data-pricetxt="' + currentPriceTxt + '"><a href="' + currentVideoUrl + '" target="_blank">' + currentVideoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + currentVideoUrl + '">Copiar URL</button><br>Inicio: ' + currentVideoStart + '<br>Fin: ' + currentVideoEnd + '<br>Precio: ' + currentPriceTxt;  
    }     
    $('#devVideoContainer').html(string);    
});

$(document).on("click", ".updateDevVideo", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentVideoId = $('#textDevVideoId').val();
    var currentVideoUrl = $('#textDevVideoUrl').val();
    var currentVideoStart = $('#textDevVideoStart').val();
    var currentVideoEnd = $('#textDevVideoEnd').val();
    var currentVideoPrice = $('#textDevVideoPriceId').val();
    var videoUrl = $('#inputDevVideo').val().trim();
    var videoStart = $('#inputDevVideoStart').val();
    var videoEnd = $('#inputDevVideoEnd').val();
    var videoPrice = $('#inputDevVideoPriceId').val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();      
    var flag = 0;    
    //console.log(videoPrice, currentVideoPrice);
    /*if (currentVideoUrl == videoUrl) {
        $('#updateDevVideoResponse').html('<label style="color:red">La URL no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevVideoResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        $('#updateDevVideoResponse').html('');
    }*/
    if (flag == 0) {
        $('#updateDevVideoResponse').html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentVideo",developmentId:developmentId,videoUrl:videoUrl,videoStart:videoStart,videoEnd:videoEnd,videoPrice:videoPrice,currentVideoId:currentVideoId,currentVideoUrl:currentVideoUrl,currentVideoStart:currentVideoStart,currentVideoEnd:currentVideoEnd,currentVideoPrice:currentVideoPrice,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevVideoResponse').html('<label style="color:green">La URL del video se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        updateDevVideoContainer(developmentId)
                    }, 2000);                       
                } else {
                    $('#updateDevVideoResponse').html('<label style="color:red">Hubo un error.</label>');  
                    setTimeout(function () { 
                        updateDevVideoContainer(developmentId)
                    }, 2000);           
                }
            },
            error: function(response) {
                $('#updateDevVideoResponse').html('<label style="color:red">Hubo un error.</label>');   
                    setTimeout(function () { 
                        updateDevVideoContainer(developmentId)
                    }, 2000);            
            }            
        });   
    }
});

function updateDevVideoContainer(developmentId) {
    $('#devVideoUpdateButton').css("display", "block");
    $('#updateDevVideoResponse').html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentVideo", developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            if (response.videoPrice == 1) {
                var devVideoPriceTxt = 'Visible';
            } else {
                var devVideoPriceTxt = 'Oculto';
            }
            if (response.videoId == 0) {
                var string = '<label id="devVideoLabel" data-id="' + response.videoId + '" data-url="' + response.videoUrl + '" data-start="' + response.videoStart + '" data-end="' + response.videoEnd + '" data-priceid="' + response.videoPrice + '" data-pricetxt="' + devVideoPriceTxt + '">&nbsp;</label>';  
            } else {
                var string = '<label id="devVideoLabel" data-id="' + response.videoId + '" data-url="' + response.videoUrl + '" data-start="' + response.videoStart + '" data-end="' + response.videoEnd + '" data-priceid="' + response.videoPrice + '" data-pricetxt="' + devVideoPriceTxt + '"><a href="' + response.videoUrl + '" target="_blank">' + response.videoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + response.videoUrl + '">Copiar URL</button><br>Inicio: ' + response.videoStart + '<br>Fin: ' + response.videoEnd + '<br>Precio: ' + devVideoPriceTxt;  
            }     
            $('#devVideoContainer').html(string);              
        }
    });
}

$(document).on("click", ".updateGeoContainer", function(e) {
    e.preventDefault();
    var formGeo = '';
    var developmentId = $(this).attr('name');
    var currentDevelopmentLatitude = $('#latitudeLabel').html();
    var currentDevelopmentLongitude = $('#longitudeLabel').html();
    $('#geoUpdateButton').css("display", "none");
    formGeo = '<form class="form-horizontal">';
    formGeo += '<input type="hidden" id="textLatitude" value="' + currentDevelopmentLatitude + '">';
    formGeo += '<input type="hidden" id="textLongitude" value="' + currentDevelopmentLongitude + '">';
    formGeo += '<div class="form-group" style="margin-bottom:4px;">';
    formGeo += '<label class="col-sm-3 control-label">Latitud</label>';
    formGeo += '<div class="col-sm-7">';
    formGeo += '<input type="text" class="form-control input-sm" id="inputLatitude" style="height:30px;" value="' + currentDevelopmentLatitude + '" placeholder="Latitud..." />';
    formGeo += '</div>';
    formGeo += '</div>';
    formGeo += '<div class="form-group" style="margin-bottom:4px;">';
    formGeo += '<label class="col-sm-3 control-label">Longitud</label>';
    formGeo += '<div class="col-sm-7">';
    formGeo += '<input type="text" class="form-control input-sm" id="inputLongitude" style="height:30px;" value="' + currentDevelopmentLongitude + '" placeholder="Longitud..." />';
    formGeo += '</div>';
    formGeo += '</div>'; 
    formGeo += '<div class="form-group" style="margin-bottom:12px;">';
    formGeo += '<div class="col-sm-9 col-md-offset-3">';
    formGeo += '<button type="button" class="btn btn-md btn-cancel cancelDevGeo" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formGeo += '&nbsp;&nbsp;'; 
    formGeo += '<button type="button" class="btn btn-md btn-go updateDevGeo" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formGeo += '</div>';  
    formGeo += '<div class="col-sm-12" id="updateGeoResponse">';
    formGeo += '</div>';  
    formGeo += '</div>';                                
    formGeo += '</form>';   
    $("#geoDevContainer").html(formGeo);    
});

$(document).on("click", ".updatePsGeoContainer", function(e) {
    e.preventDefault();
    var formGeo = '';
    var developmentId = $(this).attr('name');
    var currentDevelopmentPsLatitude = $('#psLatitudeLabel').html();
    if (currentDevelopmentPsLatitude == 'null') {
        currentDevelopmentPsLatitude = '';
    }
    var currentDevelopmentPsLongitude = $('#psLongitudeLabel').html();
    if (currentDevelopmentPsLongitude == 'null') {
        currentDevelopmentPsLongitude = '';
    }
    $('#psGeoUpdateButton').css("display", "none");
    formGeo = '<form class="form-horizontal">';
    formGeo += '<input type="hidden" id="textPsLatitude" value="' + currentDevelopmentPsLatitude + '">';
    formGeo += '<input type="hidden" id="textPsLongitude" value="' + currentDevelopmentPsLongitude + '">';
    formGeo += '<div class="form-group" style="margin-bottom:4px;">';
    formGeo += '<label class="col-sm-3 control-label">Latitud</label>';
    formGeo += '<div class="col-sm-7">';
    formGeo += '<input type="text" class="form-control input-sm" id="inputPsLatitude" style="height:30px;" value="' + currentDevelopmentPsLatitude + '" placeholder="Latitud..." />';
    formGeo += '</div>';
    formGeo += '</div>';
    formGeo += '<div class="form-group" style="margin-bottom:4px;">';
    formGeo += '<label class="col-sm-3 control-label">Longitud</label>';
    formGeo += '<div class="col-sm-7">';
    formGeo += '<input type="text" class="form-control input-sm" id="inputPsLongitude" style="height:30px;" value="' + currentDevelopmentPsLongitude + '" placeholder="Longitud..." />';
    formGeo += '</div>';
    formGeo += '</div>'; 
    formGeo += '<div class="form-group" style="margin-bottom:12px;">';
    formGeo += '<div class="col-sm-9 col-md-offset-3">';
    formGeo += '<button type="button" class="btn btn-md btn-cancel cancelDevPsGeo" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formGeo += '&nbsp;&nbsp;'; 
    formGeo += '<button type="button" class="btn btn-md btn-go updateDevPsGeo" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formGeo += '</div>';  
    formGeo += '<div class="col-sm-12" id="updatePsGeoResponse">';
    formGeo += '</div>';  
    formGeo += '</div>';                                
    formGeo += '</form>';   
    $("#psGeoDevContainer").html(formGeo);    
});

$(document).on('click', '.cancelDevGeo', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var developmentLatitude = $('#textLatitude').val();
    var developmentLongitude = $('#textLongitude').val();
    $('#geoUpdateButton').css("display", "block");
    $('#geoDevContainer').html('Latitud: <label id="latitudeLabel">' + developmentLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="longitudeLabel">' + developmentLongitude + '</label><br><a href="https://mylocation.org/" target="_blank">Mi geoposición</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="https://www.google.com/maps/?q=' + developmentLatitude + ',' + developmentLongitude + '" target="_blank">Geoposición del desarrollo</a>');   
});

$(document).on('click', '.cancelDevPsGeo', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var developmentPsLatitude = $('#textPsLatitude').val();
    var developmentPsLongitude = $('#textPsLongitude').val();
    $('#psGeoUpdateButton').css("display", "block");
    if ((developmentPsLatitude == 'NA') || (developmentPsLongitude == 'NA')) {
        $('#psGeoDevContainer').html('Latitud: <label id="psLatitudeLabel">' + developmentPsLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="psLongitudeLabel">' + developmentPsLongitude + '</label>');
    } else {
        $('#psGeoDevContainer').html('Latitud: <label id="psLatitudeLabel">' + developmentPsLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="psLongitudeLabel">' + developmentPsLongitude + '</label><br><a href="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '" target="_blank">Geoposición del Punto de Venta</a><br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '">Copiar URL</button>');
    }
});

$(document).on("click", ".updateDevGeo", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDevelopmentLatitude = $('#textLatitude').val();
    var currentDevelopmentLongitude = $('#textLongitude').val();
    var developmentLatitude = $('#inputLatitude').val();
    var developmentLongitude = $('#inputLongitude').val();    
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    if ((currentDevelopmentLatitude == developmentLatitude) && (currentDevelopmentLongitude == developmentLongitude)) { 
        $('#updateGeoResponse').html('<label style="color:red">La geoposición no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updateGeoResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updateGeoResponse').html('');
    }
    if (flag == 0) {
        $('#updateGeoResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentGeoposition",developmentId:developmentId,developmentLatitude:developmentLatitude,currentDevelopmentLatitude:currentDevelopmentLatitude,developmentLongitude:developmentLongitude,currentDevelopmentLongitude:currentDevelopmentLongitude,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateGeoResponse').html('<label style="color:green">El geoposición se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#geoDevContainer').html('Latitud: <label id="latitudeLabel">' + developmentLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="longitudeLabel">' + developmentLongitude + '</label><br><a href="https://mylocation.org/" target="_blank">Mi geoposición</a>&nbsp;&nbsp;/&nbsp;&nbsp;<a href="https://www.google.com/maps/?q=' + developmentLatitude + ',' + developmentLongitude + '" target="_blank">Geoposición del desarrollo</a>'); 
                        $('#updateGeoResponse').html('');
                        $('#geoUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateGeoResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateGeoResponse').html('');
                        $('#geoUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateGeoResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateGeoResponse').html('');
                    $('#geoUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });   
    }       
});

$(document).on("click", ".updateDevPsGeo", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDevelopmentPsLatitude = $('#textPsLatitude').val();
    var currentDevelopmentPsLongitude = $('#textPsLongitude').val();
    var developmentPsLatitude = $('#inputPsLatitude').val();
    var developmentPsLongitude = $('#inputPsLongitude').val();    
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    if ((currentDevelopmentPsLatitude == developmentPsLatitude) && (currentDevelopmentPsLongitude == developmentPsLongitude)) { 
        $('#updatePsGeoResponse').html('<label style="color:red">La geoposición no ha sido actualizada.</label>');
        setTimeout(function () { 
            $('#updatePsGeoResponse').html('');
        }, 2000);           
        flag++;
    } else { 
        $('#updatePsGeoResponse').html('');
    }
    if (flag == 0) {
        $('#updatePsGeoResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentPsGeoposition",developmentId:developmentId,developmentPsLatitude:developmentPsLatitude,currentDevelopmentPsLatitude:currentDevelopmentPsLatitude,developmentPsLongitude:developmentPsLongitude,currentDevelopmentPsLongitude:currentDevelopmentPsLongitude,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updatePsGeoResponse').html('<label style="color:green">El geoposición se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#psGeoDevContainer').html('Latitud: <label id="psLatitudeLabel">' + developmentPsLatitude + '</label>&nbsp;&nbsp;Longitud: <label id="psLongitudeLabel">' + developmentPsLongitude + '</label><br><a href="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '" target="_blank">Geoposición del desarrollo</a><br><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="https://www.google.com/maps/?q=' + developmentPsLatitude + ',' + developmentPsLongitude + '">Copiar URL</button>'); 
                        $('#updatePsGeoResponse').html('');
                        $('#psGeoUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updatePsGeoResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updatePsGeoResponse').html('');
                        $('#psGeoUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updatePsGeoResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updatePsGeoResponse').html('');
                    $('#psGeoUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });   
    }       
});

$(document).on("click", ".updateDevPsAddressContainer", function(e) {
    e.preventDefault();
    var formAddress = '';
    var developmentId = $(this).attr('name');
    var addressDevStreet = $('#addressDevPsStreet').val();
    var addressDevExtNumber = $('#addressDevPsExtNumber').val();
    var addressDevIntNumber = $('#addressDevPsIntNumber').val();
    var addressDevPostalCode = $('#addressDevPsPostalCode').val();
    var addressDevSubLocality = $('#addressDevPsSubLocality').val();
    var addressDevSubLocalityId = $('#addressDevPsSubLocalityId').val();
    var addressDevLocality = $('#addressDevPsLocality').val();
    var addressDevLocalityId = $('#addressDevPsLocalityId').val();
    var addressDevState = $('#addressDevPsState').val();
    var addressDevStateId = $('#addressDevPsStateId').val();
    var currentAddress = $('#devPsAddressLabel').html();
    if (addressDevStreet == 'null') { addressDevStreet = ''; }
    if (addressDevExtNumber == 'null') { addressDevExtNumber = ''; }
    if (addressDevIntNumber == 'null') { addressDevIntNumber = ''; }
    if (addressDevPostalCode == 'null') { addressDevPostalCode = ''; }
    if (addressDevSubLocality == 'null') { addressDevSubLocality = ''; }
    if (addressDevLocality == 'null') { addressDevLocality = ''; }
    if (addressDevState == 'null') { addressDevState = ''; }
    $('#devPsAddressUpdateButton').css("display", "none");
    formAddress = '<form class="form-horizontal">';
    formAddress += '<input type="hidden" id="textPsAddress" value="' + currentAddress + '">';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Calle</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Calle</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPsStreet" value="' + addressDevStreet + '" placeholder="Calle..." />';
    formAddress += '</div>';
    formAddress += '</div>';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">No. Ext.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">No. Ext.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPsExtNumber" value="' + addressDevExtNumber + '" placeholder="No. Ext..." />';
    formAddress += '</div>';
    formAddress += '</div>'; 
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">No. Int.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">No. Int.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPsIntNumber" value="' + addressDevIntNumber + '" placeholder="No. Int..." />';
    formAddress += '</div>';
    formAddress += '</div>';  
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">C.P.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">C.P.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPsPostalCode" value="' + addressDevPostalCode + '" placeholder="Código Postal..." />';
    formAddress += '</div>';
    formAddress += '</div>';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Estado</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Estado</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<select class="form-control input-sm" id="selectAddressDevPsState"></select>';
    formAddress += '</div>';
    formAddress += '<div class="col-sm-2" style="padding-top:6px;" id="selectAddressDevPsStateLoader">';
    formAddress += '<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">';
    formAddress += '</div>';     
    formAddress += '</div>'; 
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Municipio</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Municipio</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<select class="form-control input-sm" id="selectAddressDevPsLocality"></select>';
    formAddress += '</div>';
    formAddress += '<div class="col-sm-2" style="padding-top:6px;" id="selectAddressDevPsLocalityLoader">';
    formAddress += '<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">';
    formAddress += '</div>';        
    formAddress += '</div>';            
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Colonia</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Colonia</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPsSubLocality" value="' + addressDevSubLocality + '" placeholder="Colonia..." readonly/>';
    formAddress += '</div>';   
    formAddress += '</div>';  
    formAddress += '<div class="form-group" style="margin-bottom:12px;">';
    formAddress += '<div class="col-sm-4 col-md-offset-3">';
    formAddress += '<button type="button" class="btn btn-md btn-cancel cancelDevPsAddress" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formAddress += '&nbsp;&nbsp;'; 
    formAddress += '<button type="button" class="btn btn-md btn-go updateDevPsAddress" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';   
    formAddress += '</div>';  
    formAddress += '<div class="col-sm-5" id="updatePsAddressResponse">';
    formAddress += '</div>';  
    formAddress += '</div>';                            
    formAddress += '</form>';  
    getAllStates(developmentId, 'selectAddressDevPsState', addressDevStateId, 'selectAddressDevPsStateLoader'); 
    getAllLocatiesByState(developmentId, 'selectAddressDevPsLocality', addressDevStateId, addressDevLocalityId, 'selectAddressDevPsLocalityLoader'); 
    $("#devPsAddressContainer").html(formAddress);    
});

$(document).on('click', '.cancelDevPsAddress', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var developmentAddress = $('#textPsAddress').val();
    $('#devPsAddressUpdateButton').css("display", "block");
    $('#devPsAddressContainer').html('<label id="devPsAAddressLabel">' + developmentAddress + '</label>');   
});

$(document).on("click", ".updateDevPsAddress", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentAddress = $('#textPsAddress').val();
    var addressDevStreet = $('#inputAddressDevPsStreet').val();
    var addressDevExtNumber = $('#inputAddressDevPsExtNumber').val();
    var addressDevIntNumber = $('#inputAddressDevPsIntNumber').val();
    var addressDevPostalCode = $('#inputAddressDevPsPostalCode').val();
    var addressDevState = $('#selectAddressDevPsState').val();
    var addressDevStateName = $('option:selected', '#selectAddressDevPsState').text();  
    var addressDevLocality = $('#selectAddressDevPsLocality').val();
    var addressDevLocalityName = $('option:selected', '#selectAddressDevPsLocality').text();  
    var addressDevSubLocality = $('#inputAddressDevPsSubLocality').val();    
    var flag = 0;    
    //console.log(developmentId, currentAddress, addressDevStreet, addressDevExtNumber, addressDevIntNumber, addressDevPostalCode, addressDevState, addressDevStateName, addressDevLocality, addressDevLocalityName, addressDevSubLocality);
    if (flag == 0) {
        $('#updatePsAddressResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updatePsDevelopmentAddress",developmentId:developmentId,currentAddress:currentAddress,addressDevStreet:addressDevStreet,addressDevExtNumber:addressDevExtNumber,addressDevIntNumber:addressDevIntNumber,addressDevPostalCode:addressDevPostalCode,addressDevState:addressDevState,addressDevLocality:addressDevLocality,addressDevSubLocality:addressDevSubLocality},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) { 
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    var developmentAddress = addressDevStreet;
                    if ((addressDevExtNumber == '') || (addressDevExtNumber == null) || (addressDevExtNumber == 's/n') || (addressDevExtNumber == 'S/N')) {
                        developmentAddress += ', s/n. ';
                    } else {
                        developmentAddress += ', No. ' + addressDevExtNumber + '. ';
                    }
                    if (addressDevSubLocality != null) {
                        developmentAddress += 'Col. ' + addressDevSubLocality;
                    }
                    developmentAddress += addressDevLocalityName + ', ' + addressDevStateName + '.';
                    if (addressDevPostalCode != null) {
                        developmentAddress += 'C.P. ' + addressDevPostalCode + '.';
                    }                    
                    $('#updatePsAddressResponse').html('<label style="color:green">La dirección se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devPsAddressContainer').html('<label id="devPsAddressLabel">' + developmentAddress + '</label>'); 
                        $('#updatePsAddressResponse').html('');
                        $('#devPsAddressUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updatePsAddressResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updatePsAddressResponse').html('');
                        $('#devPsAddressUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updatePsAddressResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updatePsAddressResponse').html('');
                    $('#devPsAddressUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });
    }       
});

$(document).on("click", ".updateDevAddressContainer", function(e) {
    e.preventDefault();
    var formAddress = '';
    var developmentId = $(this).attr('name');
    var addressDevStreet = $('#addressDevStreet').val();
    var addressDevExtNumber = $('#addressDevExtNumber').val();
    var addressDevIntNumber = $('#addressDevIntNumber').val();
    var addressDevPostalCode = $('#addressDevPostalCode').val();
    var addressDevSubLocality = $('#addressDevSubLocality').val();
    var addressDevSubLocalityId = $('#addressDevSubLocalityId').val();
    var addressDevLocality = $('#addressDevLocality').val();
    var addressDevLocalityId = $('#addressDevLocalityId').val();
    var addressDevState = $('#addressDevState').val();
    var addressDevStateId = $('#addressDevStateId').val();
    var currentAddress = $('#devAddressLabel').html();
    if (addressDevStreet == 'null') { addressDevStreet = ''; }
    if (addressDevExtNumber == 'null') { addressDevExtNumber = ''; }
    if (addressDevIntNumber == 'null') { addressDevIntNumber = ''; }
    if (addressDevPostalCode == 'null') { addressDevPostalCode = ''; }
    if (addressDevSubLocality == 'null') { addressDevSubLocality = ''; }
    if (addressDevLocality == 'null') { addressDevLocality = ''; }
    if (addressDevState == 'null') { addressDevState = ''; }
    $('#devAddressUpdateButton').css("display", "none");
    formAddress = '<form class="form-horizontal">';
    formAddress += '<input type="hidden" id="textAddress" value="' + currentAddress + '">';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Calle</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Calle</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevStreet" value="' + addressDevStreet + '" placeholder="Calle..." />';
    formAddress += '</div>';
    formAddress += '</div>';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">No. Ext.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">No. Ext.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevExtNumber" value="' + addressDevExtNumber + '" placeholder="No. Ext..." />';
    formAddress += '</div>';
    formAddress += '</div>'; 
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">No. Int.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">No. Int.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevIntNumber" value="' + addressDevIntNumber + '" placeholder="No. Int..." />';
    formAddress += '</div>';
    formAddress += '</div>';  
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">C.P.</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">C.P.</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevPostalCode" value="' + addressDevPostalCode + '" placeholder="Código Postal..." />';
    formAddress += '</div>';
    formAddress += '</div>';
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Estado</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Estado</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<select class="form-control input-sm" id="selectAddressDevState"></select>';
    formAddress += '</div>';
    formAddress += '<div class="col-sm-2" style="padding-top:6px;" id="selectAddressDevStateLoader">';
    formAddress += '<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">';
    formAddress += '</div>';     
    formAddress += '</div>'; 
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Municipio</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Municipio</label>';
    formAddress += '<div class="col-sm-6">';
    formAddress += '<select class="form-control input-sm" id="selectAddressDevLocality"></select>';
    formAddress += '</div>';
    formAddress += '<div class="col-sm-2" style="padding-top:6px;" id="selectAddressDevLocalityLoader">';
    formAddress += '<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">';
    formAddress += '</div>';        
    formAddress += '</div>';            
    formAddress += '<div class="form-group" style="margin-bottom:4px;">';
    formAddress += '<label class="col-sm-4 control-label">Colonia</label>';
    //formAddress += '<label class="col-sm-2" style="text-align:right;padding-top:6px;">Colonia</label>';
    formAddress += '<div class="col-sm-7">';
    formAddress += '<input type="text" class="form-control input-sm" style="height:30px;" id="inputAddressDevSubLocality" value="' + addressDevSubLocality + '" placeholder="Colonia..." readonly/>';
    formAddress += '</div>';   
    formAddress += '</div>';  
    formAddress += '<div class="form-group" style="margin-bottom:12px;">';
    formAddress += '<div class="col-sm-4 col-md-offset-3">';
    formAddress += '<button type="button" class="btn btn-md btn-cancel cancelDevAddress" value="' + developmentId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formAddress += '&nbsp;&nbsp;'; 
    formAddress += '<button type="button" class="btn btn-md btn-go updateDevAddress" value="' + developmentId + '"><i class="glyphicon glyphicon-ok"></i></button>';   
    formAddress += '</div>';  
    formAddress += '<div class="col-sm-5" id="updateAddressResponse">';
    formAddress += '</div>';  
    formAddress += '</div>';                            
    formAddress += '</form>';  
    getAllStates(developmentId, 'selectAddressDevState', addressDevStateId, 'selectAddressDevStateLoader'); 
    getAllLocatiesByState(developmentId, 'selectAddressDevLocality', addressDevStateId, addressDevLocalityId, 'selectAddressDevLocalityLoader'); 
    $("#devAddressContainer").html(formAddress);    
});

$(document).on('click', '.cancelDevAddress', function(e) {
    e.preventDefault(e);
    var developmentId = $(this).val();
    var developmentAddress = $('#textAddress').val();
    $('#devAddressUpdateButton').css("display", "block");
    $('#devAddressContainer').html('<label id="devAddressLabel">' + developmentAddress + '</label>');   
});

$(document).on("click", ".updateDevAddress", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentAddress = $('#textAddress').val();
    var addressDevStreet = $('#inputAddressDevStreet').val();
    var addressDevExtNumber = $('#inputAddressDevExtNumber').val();
    var addressDevIntNumber = $('#inputAddressDevIntNumber').val();
    var addressDevPostalCode = $('#inputAddressDevPostalCode').val();
    var addressDevState = $('#selectAddressDevState').val();
    var addressDevStateName = $('option:selected', '#selectAddressDevState').text();  
    var addressDevLocality = $('#selectAddressDevLocality').val();
    var addressDevLocalityName = $('option:selected', '#selectAddressDevLocality').text();  
    var addressDevSubLocality = $('#inputAddressDevSubLocality').val();    
    var flag = 0;    
    //console.log(developmentId, currentAddress, addressDevStreet, addressDevExtNumber, addressDevIntNumber, addressDevPostalCode, addressDevState, addressDevStateName, addressDevLocality, addressDevLocalityName, addressDevSubLocality);
    if (flag == 0) {
        $('#updateAddressResponse').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentAddress",developmentId:developmentId,currentAddress:currentAddress,addressDevStreet:addressDevStreet,addressDevExtNumber:addressDevExtNumber,addressDevIntNumber:addressDevIntNumber,addressDevPostalCode:addressDevPostalCode,addressDevState:addressDevState,addressDevLocality:addressDevLocality,addressDevSubLocality:addressDevSubLocality},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) { 
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    var developmentAddress = addressDevStreet;
                    if ((addressDevExtNumber == '') || (addressDevExtNumber == null) || (addressDevExtNumber == 's/n') || (addressDevExtNumber == 'S/N')) {
                        developmentAddress += ', s/n. ';
                    } else {
                        developmentAddress += ', No. ' + addressDevExtNumber + '. ';
                    }
                    if (addressDevSubLocality != null) {
                        developmentAddress += 'Col. ' + addressDevSubLocality;
                    }
                    developmentAddress += addressDevLocalityName + ', ' + addressDevStateName + '.';
                    if (addressDevPostalCode != null) {
                        developmentAddress += 'C.P. ' + addressDevPostalCode + '.';
                    }                    
                    $('#updateAddressResponse').html('<label style="color:green">La dirección se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devAddressContainer').html('<label id="devAddressLabel">' + developmentAddress + '</label>'); 
                        $('#updateAddressResponse').html('');
                        $('#devAddressUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateAddressResponse').html('<label style="color:red">Hubo un error. '+response+'</label>');
                    //console.log(response);
                    setTimeout(function () { 
                        $('#updateAddressResponse').html('');
                        $('#devAddressUpdateButton').css("display", "block");
                    }, 7000);                    
                }
            },
            error: function(response) {
                $('#updateAddressResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateAddressResponse').html('');
                    $('#devAddressUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });
    }       
});

$(document).on("click", ".openCollaboratorModal", function(e) {
    e.preventDefault();
    $("#openCollaboratorModel").click();
    var developmentId = $(this).attr('name');
    var developerId = $('#developerId').val();
    getCurrentCollaborators(developmentId);
    getUnassignedCollaborators(developerId, developmentId);
    var newCollaborators = '';
    newCollaborators += '<a data-toggle="collapse" class="collapsed" href="#new" style="margin-bottom:8px;">';
    newCollaborators += 'Agregar y asignar nuevos Colaboradores';
    newCollaborators += '</a>';
    newCollaborators += '<div id="new" class="panel-collapse collapse">';    
    newCollaborators += '<form class="form-horizontal" id="newCollaboratorsForm" style="padding-bottom:6px;">';
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Nombre:</label>';
    newCollaborators += '</div>'; 
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<input type="text" name="name" class="form-control input-sm" id="inputCollaboratorName" placeholder="Nombre">';
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';  
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Apellido:</label>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<input type="text" name="name" class="form-control input-sm" id="inputCollaboratorLastName" placeholder="Apellido">';
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Celular:</label>';
    newCollaborators += '</div>';   
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<input type="text" name="name" class="form-control input-sm" id="inputCollaboratorPhone" placeholder="Celular">';
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';  
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Proveedor:</label>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<select class="form-control input-sm" id="inputCollaboratorCarrier">';   
    newCollaborators += '<option value="0">Desconocido</option>';             
    newCollaborators += '<option value="1">Telcel</option>';   
    newCollaborators += '<option value="2">AT&T</option>';   
    newCollaborators += '<option value="3">Movistar</option>';    	
    newCollaborators += '</select>'; 
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';  
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Email:</label>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<input type="text" name="name" class="form-control input-sm" id="inputCollaboratorMail" placeholder="Email">';
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';   
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Posición:</label>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<input type="text" name="name" class="form-control input-sm" id="inputCollaboratorPosition" placeholder="Posición">';
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';  
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-4 col-lg-2">';
    newCollaborators += '<label class="control-label">Rol:</label>';
    newCollaborators += '</div>';     
    newCollaborators += '<div class="col-md-8 col-lg-5">';
    newCollaborators += '<select class="form-control input-sm" id="inputCollaboratorRole">';   
    newCollaborators += '<option value="0">Selecciona...</option>';   
    newCollaborators += '<option value="12">Local Gerente de Leads</option>';
    newCollaborators += '<option value="3">Local Gestor de Leads</option>';
    newCollaborators += '<option value="9">Local Gestor de Precios</option>';
    newCollaborators += '<option value="11">Asesor Local</option>';    
    newCollaborators += '<option value="13">Smarto Afiliador</option>';
    newCollaborators += '<option value="16">Smarto Vendedor</option>';
    newCollaborators += '</select>'; 
    newCollaborators += '</div>';
    newCollaborators += '</div>';
    newCollaborators += '</div>';                  
    newCollaborators += '<div class="row">';
    newCollaborators += '<div class="form-group" style="margin:2px;">';
    newCollaborators += '<div class="col-md-6 col-lg-2">';
    newCollaborators += '&nbsp;';
    newCollaborators += '</div>';            
    newCollaborators += '<div class="col-md-6 col-lg-3">';   
    newCollaborators += '<button type="button" style="margin-top:4px" class="btn btn-sm btn-go saveCollaborator" value="' + developmentId + '" data-developer="'+ developerId +'">Agregar al desarrollo</button>';
    newCollaborators += '</div>';  
    newCollaborators += '<div class="col-md-6 col-lg-7" style="margin-top:4px" id="insertCollaboratorResponse"></div>';         
    newCollaborators += '</div>';
    newCollaborators += '</div>';   
    newCollaborators += '</form>';    
    newCollaborators += '</div>';    
    $("#newCollaborators").html(newCollaborators);
});

$(document).on("click", ".updateDevFeaturesContainer", function(e) {
    e.preventDefault();
    $("#openDevelopmentFeaturesModal").click();
    var formDevelopmentFeature = '';
    var formDevelopmentFeaturePayment = '';
    var developmentId = $(this).attr('name');
    $("#developmentFeaturesModalBody").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:60px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentFeatures",developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {  
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            formDevelopmentFeature += '<form class="form-horizontal" style="margin-left:6px">';
            formDevelopmentFeature += '<div class="form-group" style="text-align:center;font-weight:bold;">';            
            formDevelopmentFeature += 'Características'; 
            formDevelopmentFeature += '</div>';            
            formDevelopmentFeature += '<div class="form-group">';
            $.each(response.developmentFeature, function(index, developmentFeature) {
                if (developmentFeature.featureCat != 4) {
                    formDevelopmentFeature += '<div class="col-sm-6 col-md-6 col-lg-4">';
                    if (developmentFeature.featureFlag != 0) {
                        formDevelopmentFeature += '<input type="checkbox" class="development-Feature" value="' + developmentFeature.featureId + '" checked>';
                    } else {
                        formDevelopmentFeature += '<input type="checkbox" class="development-Feature" value="' + developmentFeature.featureId + '">';
                    }
                    formDevelopmentFeature += '&nbsp;<label class="control-label">'+developmentFeature.featureName+'</label>';
                    formDevelopmentFeature += '</div>';   
                } else {
                    formDevelopmentFeaturePayment += '<div class="col-sm-6 col-md-6 col-lg-4">';
                    if (developmentFeature.featureFlag != 0) {
                        formDevelopmentFeaturePayment += '<input type="checkbox" class="development-Feature" value="' + developmentFeature.featureId + '" checked>';
                    } else {
                        formDevelopmentFeaturePayment += '<input type="checkbox" class="development-Feature" value="' + developmentFeature.featureId + '">';
                    }
                    formDevelopmentFeaturePayment += '&nbsp;<label class="control-label">'+developmentFeature.featureName+'</label>';
                    formDevelopmentFeaturePayment += '</div>';   
                }      
            });
            formDevelopmentFeature += '</div>'; 
            formDevelopmentFeature += '<div class="form-group" style="text-align:center;font-weight:bold;">';            
            formDevelopmentFeature += 'Métodos de pago'; 
            formDevelopmentFeature += '</div>';             
            formDevelopmentFeature += '<div class="form-group">';
            formDevelopmentFeature += formDevelopmentFeaturePayment;
            formDevelopmentFeature += '</div>';             
            formDevelopmentFeature += '<div class="form-group" style="text-align:center">';
            formDevelopmentFeature += '<input type="hidden" value="' + developmentId + '" id="developmentIdFeatures">';
            formDevelopmentFeature += '<button type="button" class="btn btn-sm btn-danger" id="closeDevelopmentFeatureContainer">Cancelar</button>&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-success" id="saveDevelopmentFeatureContainer">Guardar</button>';
            formDevelopmentFeature += '</div>';
            formDevelopmentFeature += '<div class="form-group" style="text-align:center" id="developmentFeaturesResponse">';
            formDevelopmentFeature += '</div>';                
            formDevelopmentFeature += '</form>';
            $("#developmentFeaturesModalBody").html(formDevelopmentFeature);
        }
    });
});

$(document).on("click", "#closeDevelopmentFeatureContainer", function(e) {
    e.preventDefault();
    $('#developmentFeaturesModal').modal('hide');
});

$(document).on("click", "#saveDevelopmentFeatureContainer", function(e) {
    e.preventDefault();
    var developmentId = $('#developmentIdFeatures').val().trim();
    var arrDevelopmentFeatures = []; 
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();      
    $('.development-Feature').each(function(i, developmentFeatures) {
        if (developmentFeatures.checked) {
            featureId = developmentFeatures.value;
            arrDevelopmentFeatures[i] = featureId + '/1'
        } else {
            featureId = developmentFeatures.value;
            arrDevelopmentFeatures[i] = featureId + '/0'
        }
        i++;
    });
    $("#developmentFeaturesResponse").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
    //console.log(arrDevelopmentFeatures);
    $.ajax({
        type: "GET",
        data: {type:"updateDevelopmentFeatures",developmentId:developmentId,developmentFeatures:arrDevelopmentFeatures,utc:utc},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                $("#developmentFeaturesResponse").html('<label style="color:green">Las características se actualizaron con éxito.</label>');
                setTimeout(function () { 
                    $("#developmentFeaturesResponse").html('');
                    $('#developmentFeaturesModal').modal('hide');
                }, 2000);
                getDevelopmentFeatures(developmentId);
            } else {
                $("#developmentFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#developmentFeaturesResponse").html('');
                    $('#developmentFeaturesModal').modal('hide');
                }, 2000);    
                getDevelopmentFeatures(developmentId);            
            }
        },
        error: function(response) {
            $("#developmentFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
            setTimeout(function () { 
                $("#developmentFeaturesResponse").html('');
                $('#developmentFeaturesModal').modal('hide');
            }, 2000);    
            getDevelopmentFeatures(developmentId);                  
        }
     });
});

function getCurrentCollaborators(developmentId) {
    var developmentName = $('#devNameLabel').html();
    $("#assignedCollaborators").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:40px;'>");
    var currentCollaborators = '';
    currentCollaborators += '<label>Colaboradores asignados a <strong>' + developmentName + '</strong></label>';
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorsByDevelopment", developmentId:developmentId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#assignedCollaborators").html('');          
            $.each(response.collaborator, function(index, collaborator) {
                currentCollaborators += '<div class="row" id="currentCollaboratorRow-' + collaborator.id + '-' + collaborator.roleId + '">';
                currentCollaborators += '<div class="form-group" style="margin:2px; margin-top:8px">';
                currentCollaborators += '<label class="col-md-8 col-lg-7 control-label">' + collaborator.name + ' ' + collaborator.lastName + ' / ' + collaborator.role + '</label>';
                currentCollaborators += '<div class="col-md-4 col-lg-1">';
                currentCollaborators += '<input type="hidden" id="collaboratorUnassignRole-' + collaborator.id + '" value="' + collaborator.roleId + '">';
                currentCollaborators += '<button type="button" class="btn btn-sm btn-cancel unassignCollaborator" name="' + developmentId + '" value="' + collaborator.id + '" title="Click para desasignar"><i class="glyphicon glyphicon-minus"></i></button>';
                currentCollaborators += '</div>';
                currentCollaborators += '<div class="col-md-12 col-lg-4" id="currentCollaboratorResponse-' + collaborator.id + '-' + collaborator.roleId + '">';
                currentCollaborators += '</div>';                
                currentCollaborators += '</div>';
                currentCollaborators += '</div>'; 
            }); 
            $("#assignedCollaborators").append(currentCollaborators);
        } 
    });   
}

function getUnassignedCollaborators(developerId, developmentId) {
    //console.log(developerId, developmentId);
    $("#unassignedCollaborators").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:40px;'>");
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorsByDeveloper", developerId:developerId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#unassignedCollaborators").html('');
            var unasignCollaborators = '';
            unasignCollaborators += '<a data-toggle="collapse" class="collapsed" href="#assign" style="margin-bottom:8x;">';
            unasignCollaborators += 'Asignar Colaboradores existentes al desarrollo';
            unasignCollaborators += '</a>';
            unasignCollaborators += '<div id="assign" class="panel-collapse collapse">';
            unasignCollaborators += '<form class="form-horizontal">';
            unasignCollaborators += '<div class="row">';
            unasignCollaborators += '<div class="form-group" style="margin:2px;">';
            unasignCollaborators += '<div class="col-md-6 col-lg-2">';
            unasignCollaborators += '<label class="control-label">Colaborador:</label>';
            unasignCollaborators += '</div>';             
            unasignCollaborators += '<div class="col-md-6 col-lg-5">';   
            unasignCollaborators += '<select class="form-control input-sm" id="unassignedCollaboratorsIdSelect">';   
            unasignCollaborators += '<option value="0">Selecciona...</option>';             
            $.each(response.collaborator, function(index, collaborator) {
                unasignCollaborators += '<option value="' + collaborator.id + '">' + collaborator.name + ' ' + collaborator.lastName + '</option>';               
            });
            unasignCollaborators += '</select>';  
            unasignCollaborators += '</div>';      
            unasignCollaborators += '</div>';
            unasignCollaborators += '</div>';
            unasignCollaborators += '<div class="row">';
            unasignCollaborators += '<div class="form-group" style="margin:2px;">';
            unasignCollaborators += '<div class="col-md-6 col-lg-2">';
            unasignCollaborators += '<label class="control-label">Rol:</label>';
            unasignCollaborators += '</div>';            
            unasignCollaborators += '<div class="col-md-6 col-lg-5">';   
            unasignCollaborators += '<select class="form-control input-sm" id="unassignedCollaboratorsRoleSelect">';   
            unasignCollaborators += '<option value="0">Selecciona...</option>';             
            unasignCollaborators += '<option value="12">Local Gerente de Leads</option>';
            unasignCollaborators += '<option value="3">Local Gestor de Leads</option>';
            unasignCollaborators += '<option value="13">Smarto Afiliador</option>';
            unasignCollaborators += '<option value="16">Smarto Vendedor</option>';
            unasignCollaborators += '</select>';  
            unasignCollaborators += '</div>';      
            unasignCollaborators += '</div>';
            unasignCollaborators += '</div>';  
            unasignCollaborators += '<div class="row">';
            unasignCollaborators += '<div class="form-group" style="margin:2px;">';
            unasignCollaborators += '<div class="col-md-6 col-lg-2">';
            unasignCollaborators += '&nbsp;';
            unasignCollaborators += '</div>';            
            unasignCollaborators += '<div class="col-md-6 col-lg-3">';   
            unasignCollaborators += '<button type="button" style="margin-top:4px;" class="btn btn-sm btn-go assignCollaborator" name="' + developmentId + '">Agregar al desarrollo</button>';
            unasignCollaborators += '</div>';  
            unasignCollaborators += '<div class="col-md-12 col-lg-7" style="margin-top:4px" id="assignCollaboratorResponse">';   
            unasignCollaborators += '</div>';                 
            unasignCollaborators += '</div>';
            unasignCollaborators += '</div>';                         
            unasignCollaborators += '</form>';
            unasignCollaborators += '</div>';
            $("#unassignedCollaborators").append(unasignCollaborators);
        } 
    });
}

$(document).on("click", ".assignCollaborator", function(e) {
    e.preventDefault();
    var developmentId = $(this).attr('name');
    var collaboratorId = $('#unassignedCollaboratorsIdSelect').val();
    var collaboratorRole = $('#unassignedCollaboratorsRoleSelect').val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();  
    var flag = 0;  
    //console.log(developmentId, collaboratorId, collaboratorRole);
    if ((collaboratorId == 0) || (collaboratorRole == 0)) {
        $("#assignCollaboratorResponse").html('<label style="color:red">Debes seleccinar un Colaborador y un Rol.</label>');
        setTimeout(function () { 
            $("#assignCollaboratorResponse").html('');
        }, 2000);   
        flag++;        
    }

    if (flag == 0) {
        $("#assignCollaboratorResponse").html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto;width:22px;'>");
        $.ajax({
            type: "POST",
            data: {type:"assignCollaborator",developmentId:developmentId,collaboratorId:collaboratorId,collaboratorRole:collaboratorRole,utc:utc},
            url: "./php/collaboratorData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $("#assignCollaboratorResponse").html('<label style="color:green">El Colaborador fue asignado.</label>');
                    setTimeout(function () { 
                        $("#assignCollaboratorResponse").html('');
                        updateCollaboratorContainer(developmentId);
                        getCurrentCollaborators(developmentId)
                    }, 2000);
                } else if (response == 'duplicate') {
                    $("#assignCollaboratorResponse").html('<label style="color:red">La Asignación ya existe.</label>');
                    setTimeout(function () { 
                        $("#assignCollaboratorResponse").html('');
                    }, 2000);                    
                } else {
                    $("#assignCollaboratorResponse").html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#assignCollaboratorResponse").html('');
                    }, 2000);                  
                }  
            },
            error: function(response) { 
                $("#assignCollaboratorResponse").html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    ("#assignCollaboratorResponse").html('');
                }, 2000);   
            } 
        }); 
    }
});

$(document).on("click", ".unassignCollaborator", function(e) {
    e.preventDefault();
    var developmentId = $(this).attr('name');
    var collaboratorId = $(this).val();
    var collaboratorRole = $("#collaboratorUnassignRole-" + collaboratorId).val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    //console.log(developmentId, collaboratorId, collaboratorRole);
    $("#currentCollaboratorResponse-" + collaboratorId + '-' + collaboratorRole).html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto;width:22px;'>");
    $.ajax({
        type: "POST",
        data: {type:"unassignCollaborator",developmentId:developmentId,collaboratorId:collaboratorId,collaboratorRole:collaboratorRole,utc:utc},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                $("#currentCollaboratorResponse-" + collaboratorId + '-' + collaboratorRole).html('<label style="color:green">El Colaborador fue desasignado.</label>');
                setTimeout(function () { 
                    $("#currentCollaboratorResponse-" + collaboratorId + '-' + collaboratorRole).html('');
                    $("#currentCollaboratorRow-" + collaboratorId + '-' + collaboratorRole).remove();
                    updateCollaboratorContainer(developmentId);
                }, 2000);
            } else {
                $("#currentCollaboratorResponse-" + collaboratorId + '-' + collaboratorRole).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    ("#currentCollaboratorResponse-" + collaboratorId + '-' + collaboratorRole).html('');
                }, 2000);                    
            }
        }
    });       
});

$(document).on("click", ".saveCollaborator", function(e) {
    e.preventDefault();
    var developmentId = $(this).val(); 
    var developerId = $(this).data('developer');  
    var collaboratorName = $("#inputCollaboratorName").val().trim();
    var collaboratorLastName = $("#inputCollaboratorLastName").val().trim();
    var collaboratorPosition = $("#inputCollaboratorPosition").val().trim();
    var collaboratorPhone = $("#inputCollaboratorPhone").val().trim();
    var collaboratorCarrier = $("#inputCollaboratorCarrier").val();
    var collaboratorMail = $("#inputCollaboratorMail").val().trim();
    var collaboratorRole = $("#inputCollaboratorRole").val().trim();    
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();      
    var flag = 0;
    var regNumbers = /^\+([0-9]{12})$/;
    var regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //console.log(developerId, developmentId, collaboratorName, collaboratorLastName, collaboratorPosition, collaboratorPhone, collaboratorMail, collaboratorRole);
    if (!(regNumbers.test(collaboratorPhone))) {
        if (collaboratorPhone != '') {
            if ($("#inputCollaboratorPhone").next().length == 0) {
                $("#inputCollaboratorPhone").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorPhone").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un número válido.</label>');
            } 
            flag++;
        } else {
            if ($("#inputCollaboratorPhone").next().length == 0) {
                $("#inputCollaboratorPhone").closest('div').parent().addClass('has-error');
                $("#inputCollaboratorPhone").after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Celular.</label>');
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

    if (flag == 0) {       
        $("#insertCollaboratorResponse").html('&nbsp;&nbsp;<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:24px;">');
        $.ajax({
            type: "POST",              
            data: {type:"insertCollaboratorDevelopment",developerId:developerId,collaboratorDevelopment:developmentId,collaboratorName:collaboratorName,collaboratorLastName:collaboratorLastName,collaboratorPosition:collaboratorPosition,collaboratorPhone:collaboratorPhone,collaboratorCarrier:collaboratorCarrier,collaboratorMail:collaboratorMail,collaboratorRole:collaboratorRole,utc:utc},
            url: "./php/collaboratorData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $("#insertCollaboratorResponse").html('<label style="color:green">El registro se agregó con éxito.</label>');
                    setTimeout(function () { 
                        $("#newCollaboratorsForm").trigger("reset");
                        getCurrentCollaborators(developmentId);
                        getUnassignedCollaborators(developerId, developmentId);
                        updateCollaboratorContainer(developmentId);
                        $('#insertCollaboratorResponse').html('');
                    }, 2000);
                } else if (response == 'duplicate') {
                    $("#insertCollaboratorResponse").html('<label style="color:green">Colaborador existente.</label>');
                    setTimeout(function () { 
                        $("#newCollaboratorsForm").trigger("reset");
                        $('#insertCollaboratorResponse').html('');
                    }, 2000);                    
                } else {
                    $("#insertCollaboratorResponse").html('<label style="color:red">' + response + '</label>');
                    setTimeout(function () { 
                        $("#newCollaboratorsForm").trigger("reset");
                        $('#insertCollaboratorResponse').html('');
                    }, 2000);           
                }                
            },
            error: function(response) { 
                $("#insertCollaboratorResponse").html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#newCollaboratorsForm").trigger("reset");
                    $('#insertCollaboratorResponse').html('');
                }, 2000);    
            } 
        });  
    }
}); 

function updateCollaboratorContainer(developmentId) {
    $("#devCollaboratorContainer").html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:40px;'>");
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorsByDevelopment", developmentId:developmentId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response != null) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                $("#devCollaboratorContainer").html('');   
                var development = '';       
                $.each(response.collaborator, function(index, collaborator) {
                    development += '<input type="hidden" id="collaboratorTxtData_' + collaborator.id + '" value="' + collaborator.id + '/' + collaborator.name + '/' + collaborator.lastName + '/' + collaborator.role + '">';            
                    development += '<label class="collaboratorData" id="devCollaboratorsLabel_' + collaborator.id + '" name="' + collaborator.id + '">' + collaborator.name + ' ' + collaborator.lastName + ' / ' + collaborator.role + '</label><br>';                               
                });
                $("#devCollaboratorContainer").html(development);
            } else {
                $("#devCollaboratorContainer").html('<label id="devCollaboratorsLabel">No existen contactos asignados.</label>');
            }
        } 
    });
}

$(document).on("click", ".updateDevVisitsAllowedContainer", function(e) {
    e.preventDefault();
    var formVisitsAllowed = '';
    var developmentId = $(this).attr('name');
    var currentVisitsAllowed = $('#devVisitsAllowedLabel').attr('name');
    //console.log(developmentId, currentVisitsAllowed);
    $('#devVisitsAllowedUpdateButton').css("display", "none");
    formVisitsAllowed = '<form class="form-inline" style="padding-bottom:6px;">';
    formVisitsAllowed += '<div class="form-group">';
    formVisitsAllowed += '<input type="hidden" id="textDevVisitsAllowed" value="' + currentVisitsAllowed + '">';
    formVisitsAllowed += '<select class="form-control input-sm" id="selectDevVisitsAllowed">';
    formVisitsAllowed += '<option value="0" '; 
    if (currentVisitsAllowed == 0) { formVisitsAllowed += 'selected'; }
    formVisitsAllowed += '>Física</option>';
    formVisitsAllowed += '<option value="1" '; 
    if (currentVisitsAllowed == 1) { formVisitsAllowed += 'selected'; }
    formVisitsAllowed += '>Virtual</option>'; 
    formVisitsAllowed += '</select>';
    formVisitsAllowed += '</div>';  
    formVisitsAllowed += '<div class="form-group">';
    formVisitsAllowed += '<button type="button" class="btn btn-sm btn-cancel cancelDevVisitsAllowed" value="' + developmentId + '" name="' + currentVisitsAllowed + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formVisitsAllowed += '&nbsp;&nbsp;';
    formVisitsAllowed += '<button type="button" class="btn btn-sm btn-go updateDevVisitsAllowed" value="' + developmentId + '" name="' + currentVisitsAllowed + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formVisitsAllowed += '</div>';    
    formVisitsAllowed += '<div class="form-group" id="updateDevVisitsAllowedResponse" style="margin-top:2px">';    
    formVisitsAllowed += '</div>';    
    formVisitsAllowed += '</form>';
    $('#devVisitsAllowedContainer').html(formVisitsAllowed);
});

$(document).on('click', '.cancelDevVisitsAllowed', function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var developmentVisitsAllowed = $('#textDevVisitsAllowed').val();
    if (developmentVisitsAllowed == 1) {
        currentVisitsAllowed = "Física"
    } else if (developmentVisitsAllowed == 2) {
        currentVisitsAllowed = "Virtual"      
    } else {
        currentVisitsAllowed = "Sin definir";
    }
    $('#devVisitsAllowedUpdateButton').css("display", "block");
    $('#devVisitsAllowedContainer').html('<label id="devVisitsAllowedLabel" name="' + developmentVisitsAllowed + '">' + currentVisitsAllowed + '</label>'); 
});

$(document).on("click", ".updateDevVisitsAllowed", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDevelopmentVisitsAllowed = $('#textDevVisitsAllowed').val();
    var developmentVisitsAllowed = $('#selectDevVisitsAllowed').val();
    var flag = 0;
    if (developmentVisitsAllowed == 0) {
        var visitsAllowed = "Física"
    } else if (developmentVisitsAllowed == 1) {
        var visitsAllowed = "Virtual"      
    } else {
        var visitsAllowed = "Sin definir";
    }
    //console.log(developmentId, currentDevelopmentVisitsAllowed, developmentVisitsAllowed, visitsAllowed);
    if (currentDevelopmentVisitsAllowed == developmentVisitsAllowed) {
        $('#updateDevVisitsAllowedResponse').html('<label style="color:red">La bandera de Tipo de Visita no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevVisitsAllowedResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        $('#updateDevVisitsAllowedResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevVisitsAllowedResponse').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentVisitsAllowed",developmentId:developmentId,visitsAllowed:visitsAllowed},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevVisitsAllowedResponse').html('<label style="color:green">La bandera del Tipo de Visita se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devVisitsAllowedContainer').html('<label id="devVisitsAllowedLabel" name="' + developmentVisitsAllowed + '">' + visitsAllowed + '</label>'); 
                        $('#updateDevVisitsAllowedResponse').html('');
                        $('#devVisitsAllowedUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevVisitsAllowedResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevVisitsAllowedResponse').html('');
                        $('#devVisitsAllowedUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevVisitsAllowedResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevVisitsAllowedResponse').html('');
                    $('#devVisitsAllowedUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });        
    }    
});

$(document).on("click", ".updateDevContactCenterContainer", function(e) {
    e.preventDefault();
    var formContactCenter = '';
    var developmentId = $(this).attr('name');
    var currentContactCenter = $('#devContactCenterLabel').attr('name');
    //console.log(developmentId, currentContactCenter);
    $('#devContactCenterUpdateButton').css("display", "none");
    formContactCenter = '<form class="form-inline" style="padding-bottom:6px;">';
    formContactCenter += '<div class="form-group">';
    formContactCenter += '<input type="hidden" id="textDevContactCenter" value="' + currentContactCenter + '">';
    formContactCenter += '<select class="form-control input-sm" id="selectDevContactCenter">';
    formContactCenter += '<option value="1" '; 
    if (currentContactCenter == 1) { formContactCenter += 'selected'; }
    formContactCenter += '>Activo</option>';
    formContactCenter += '<option value="0" '; 
    if (currentContactCenter == 0) { formContactCenter += 'selected'; }
    formContactCenter += '>Inactivo</option>'; 
    formContactCenter += '</select>';
    formContactCenter += '</div>';  
    formContactCenter += '<div class="form-group">';
    formContactCenter += '<button type="button" class="btn btn-sm btn-cancel cancelDevContactCenter" value="' + developmentId + '" name="' + currentContactCenter + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formContactCenter += '&nbsp;&nbsp;';
    formContactCenter += '<button type="button" class="btn btn-sm btn-go updateDevContactCenter" value="' + developmentId + '" name="' + currentContactCenter + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formContactCenter += '</div>';    
    formContactCenter += '<div class="form-group" id="updateDevContactCenterResponse" style="margin-top:2px">';    
    formContactCenter += '</div>';    
    formContactCenter += '</form>';
    $('#devContactCenterContainer').html(formContactCenter);
});

$(document).on('click', '.cancelDevContactCenter', function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var developmentContactCenter = $('#textDevContactCenter').val();
    if (developmentContactCenter == 1) {
        currentContactCenter = "Activo"
    } else if (developmentContactCenter == 0) {
        currentContactCenter = "Inactivo"      
    } else {
        currentContactCenter = "Sin definir";
    }
    $('#devContactCenterUpdateButton').css("display", "block");
    $('#devContactCenterContainer').html('<label id="devContactCenterLabel" name="' + developmentContactCenter + '">' + currentContactCenter + '</label>'); 
});

$(document).on("click", ".updateDevContactCenter", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    var currentDevelopmentContactCenter = $('#textDevContactCenter').val();
    var newDevelopmentContactCenter = $('#selectDevContactCenter').val();
    var flag = 0;
    if (newDevelopmentContactCenter == 1) {
        var ContactCenter = "Activo"
    } else if (newDevelopmentContactCenter == 0) {
        var ContactCenter = "Inactivo"      
    } else {
        var ContactCenter = "Sin definir";
    }
    //console.log(developmentId, currentDevelopmentContactCenter, newDevelopmentContactCenter, ContactCenter);
    if (currentDevelopmentContactCenter == newDevelopmentContactCenter) {
        $('#updateDevContactCenterResponse').html('<label style="color:red">La bandera del Contact Center no ha sido actualizado.</label>');
        setTimeout(function () { 
            $('#updateDevContactCenterResponse').html('');
        }, 2000);          
        flag++;
    } else { 
        $('#updateDevContactCenterResponse').html('');
    }
    if (flag == 0) {
        $('#updateDevContactCenterResponse').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:22px;">');
        $.ajax({
            type: "GET",
            data: {type:"updateDevelopmentContactCenter",developmentId:developmentId,newDevelopmentContactCenter:newDevelopmentContactCenter},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateDevContactCenterResponse').html('<label style="color:green">La bandera del Contact Center se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#devContactCenterContainer').html('<label id="devContactCenterLabel" name="' + newDevelopmentContactCenter + '">' + ContactCenter + '</label>'); 
                        $('#updateDevContactCenterResponse').html('');
                        $('#devContactCenterUpdateButton').css("display", "block");
                    }, 2000);
                } else {
                    $('#updateDevContactCenterResponse').html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#updateDevContactCenterResponse').html('');
                        $('#devContactCenterUpdateButton').css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $('#updateDevContactCenterResponse').html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#updateDevContactCenterResponse').html('');
                    $('#devContactCenterUpdateButton').css("display", "block");
                }, 2000);                   
            }
        });        
    }    
});

function getModels(developmentId, developmentName) {
    x = 0;
    var models = '';
    var basicFeaturesColumn = '';
    var additionalFeaturesColumn = '';
    $("#developmentName").html(developmentName);
    $("#resultsContainerModels").css("display", "block");
    $("#developmentSize").html('');
    $("#modelsContainer").html('');
    if (developmentId != 0) {
        $("#modelsContainer").append('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
        $.ajax({
            type: "GET",
            data: {type:"getModels", developmentId:developmentId},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                $("#modelsContainer").html('');
                $.each(response.model, function(index, model) {
                    price = formatoMoneda(model.modelPrice);
                    priceUSD = formatoMoneda(model.modelPriceUSD);
                    if (model.status == 1) {
                        status = "Activo"
                    } else if (model.status == 2) {
                        status = "Inactivo"
                    } else if (model.status == 9) {
                        status = "Demo"                        
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
                    var modelUrl = "";
                    if (model.modelUrl==''||model.modelUrl==null) { modelUrl = `https://tratodirecto.com/${model.developmentNn}/${model.developerNn}/${model.modelNn}/casas-en-venta-${model.localityNn}/${model.stateNn}.html` } else {  modelUrl = model.modelUrl; }
                    //console.log(model.videoId, model.videoUrl, model.videoProvider, model.videoProviderName);          
                    models = '<table style="width:100%">';
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<input type="hidden" id="modelDevelopmentId-' + model.modelId + '" value="' + developmentId + '">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Nombre</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="nameContainer-' + model.modelId + '"><label id="nameLabel-' + model.modelId + '" style="font-size:16px;font-weight: 600" name="' + model.modelName + '"><a href="'+ modelUrl +'" target="_blank">' + model.modelName + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="'+ modelUrl +'">Copiar URL</button>';
                    if (model.modelUrl==''||model.modelUrl==null) {
                        models += '<button class="btn btn-primary retryUrlsMod" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;margin-left: 5px;" data-longurl="' + modelUrl + '" data-iddev="'+developmentId+'" data-namenorm="'+model.modelNn+'" data-name="'+developmentName+'" data-id="'+model.modelId+'">Agregar Urls</button>'
                    }
                    models +='</td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateNameContainer" id="nameUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                    models += '</tr>';                
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Id</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;"><label>' + model.modelId + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;">&nbsp;</td>';
                    models += '</tr>';    
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Tipo</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="typeContainer-' + model.modelId + '"><label id="typeLabel-' + model.modelId + '" name="' + model.typeId + '">' + model.typeDescription + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateTypeContainer" id="typeUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                    models += '</tr>';  
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Niveles</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="floorsContainer-' + model.modelId + '"><label id="floorsLabel-' + model.modelId + '" name="' + model.floors + '">' + model.floors + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateFloorsContainer" id="floorsUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                    models += '</tr>';                           
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Precio MXN</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="priceContainer-' + model.modelId + '"><label id="priceLabel-' + model.modelId + '">' + price + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updatePriceContainer" id="priceUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                    models += '</tr>';
                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Precio USD</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="priceUSDContainer-' + model.modelId + '"><label id="priceUSDLabel-' + model.modelId + '">' + priceUSD + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updatePriceUSDContainer" id="priceUSDUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
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
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Recorrido Virtual</p></td>';
                    if (model.videoId == null) {
                        models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="video360Container-' + model.modelId + '"><label id="video360Label-' + model.modelId + '" data-id="' + model.videoId + '" data-url="' + model.videoUrl + '" data-provider="' + model.videoProvider  + '" data-providername="' + model.videoProviderName  + '">&nbsp;</label></td>';  
                    } else {
                        models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="video360Container-' + model.modelId + '"><label id="video360Label-' + model.modelId + '" data-id="' + model.videoId + '" data-url="' + model.videoUrl + '" data-provider="' + model.videoProvider  + '" data-providername="' + model.videoProviderName  + '"><a href="' + model.videoUrl + '" target="_blank">' + model.videoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + model.videoUrl + '">Copiar URL</button><br>Proveedor: ' + model.videoProviderName + '</td>';  
                    } 
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateVideo360Container" id="video360UpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
                    models += '</tr>';

                    models += '<tr style="border-bottom: 1px dotted #eeeeee;">';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Disponibilidad</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id="availabilityContainer-' + model.modelId + '"><label id="availabilityLabel-' + model.modelId + '">' + formatedDateByMonth(model.availability) + '</label></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;"><a href="#" class="updateAvailabilityContainer" id="availabilityUpdateButton-' + model.modelId + '" name="' + model.modelId + '" style="font-size:12px;">Editar</a></td>';
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
                    models += '<tr>';
                    models += '<td style="vertical-align:top;padding-top:4px;width:120px"><p>Imágenes</p></td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;" id=""><label id="modNum'+x+'">';
                    if (model.mediaApi=="0") {
                        models += '<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto;width: 20px;"></label>';
                    } else {
                        models += 'No se han agregado imagenes nuevas';
                    }
                    models += '</td>';
                    models += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;width:50px;text-align:right;">';
                    if (model.mediaApi=="0") {
                        models += '<a href="#" class="modOpenImageModal" name="' + model.modelId + '" style="font-size:12px;">Editar</a>';
                    } else {
                        models += '';
                    }
                    '</td>';
                    models += '</tr>';
                    models += '</table>';
                    models += '<hr style="border-bottom: 2px solid #cccccc;">';
                    if (model.mediaApi=="0") {
                        getImagesCount(model.modelId, "pm", "modNum"+x);
                    }
                    $("#modelsContainer").append(models);
                    x++;
                });
                $("#developmentSize").html('Modelos (' + x + ')');
            }
        });	
    } else {
        //$("#developmentSize").html('Modelos');
        //$("#modelsContainer").html('<div style="text-align: right;">&nbsp;<a href="#" id="newModelButton" data-developmentId="'+developmentId+'" data-developmentName="'+developmentName+'">Agregar un nuevo Modelo</a></div>');
    }
    $("#newModelsContainer").html('<div style="text-align: right;">&nbsp;<a href="#" id="newModelButton" data-developmentId="'+developmentId+'" data-developmentName="'+developmentName+'">Agregar un nuevo Modelo</a></div>');
}

$(document).on("click", ".updateNameContainer", function(e) {
    e.preventDefault();
    var formName = '';
    var modelId = $(this).attr('name');
    var currentName = $('#nameLabel-' + modelId).attr('name');
    var currentNameNormalize = normaliza(currentName);
    $('#nameUpdateButton-' + modelId).css("display", "none");
    formName = '<form class="form-inline" style="padding-bottom:6px;">';
    formName += '<div class="form-group">';
    formName += '<input type="hidden" id="textName-' + modelId + '" value="' + currentName + '">';
    formName += '<input type="text" class="form-control input-sm" style="max-width:100px;" id="inputName-' + modelId + '" value="' + currentName + '">';
    formName += '<input type="text" class="form-control input-sm" style="max-width:100px;" id="inputNameNormalize-' + modelId + '" value="' + currentNameNormalize + '">';
    formName += '&nbsp;&nbsp;';
    formName += '<button type="button" class="btn btn-sm btn-cancel cancelName" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formName += '&nbsp;&nbsp;';  
    formName += '<button type="button" class="btn btn-sm btn-go updateName" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formName += '</div>';    
    formName += '<div class="form-group" id="updateNameResponse-' + modelId + '" style="margin-top:2px">';    
    formName += '</div>';    
    formName += '</form>';
    $("#nameContainer-" + modelId).html(formName);
    $(document).on("keyup", "#inputName-"+modelId, function (e) {
        var nameNormalize = normaliza($("#inputName-"+modelId).val());
        $("#inputNameNormalize-"+modelId).val(nameNormalize);
    });
});

$(document).on("click", ".cancelName", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var modelName = $("#textName-" + modelId).val();
    var developmentId = $("#modelDevelopmentId-" + modelId).val();
    $('#nameUpdateButton-' + modelId).css("display", "block");
    $("#nameContainer-" + modelId).html('<label id="nameLabel-' + modelId + '" style="font-size:16px;font-weight: 600" name="' + modelName + '"><a href="https://tratod1.com/m-'+ modelId +'" target="_blank">' + modelName + '</a></label>');   
}); 

$(document).on("click", ".updateName", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentName = $("#textName-"+modelId).val().trim();
    var modelName = $("#inputName-"+modelId).val().trim();
    var modelNameNorm = $("#inputNameNormalize-"+modelId).val().trim();
    var developmentId = $("#modelDevelopmentId-" + modelId).val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;    
    var regString = /^([a-zA-Z0-9-áéíóúÁÉÍÓÚÜüÑñ&\(\)\s\"\']+)$/;

    if (currentName == modelName) {
        $("#updateNameResponse-"+modelId).html('<label style="color:red">El nombre no ha sido actualizado.</label>');
        setTimeout(function () { 
            $("#updateNameResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        if (modelName == '') {
            $("#updateNameResponse-"+modelId).html('<label style="color:red">Ingresa un nombre válido.</label>');       
            flag++;
        } else {
            if (!(regString.test(modelName))) {
                $("#updateNameResponse-"+modelId).html('<label style="color:red">Ingresa un nombre válido.</label>');       
                flag++;
            } else {
                $("#updateNameResponse-"+modelId).html('');
            }
        }
    }

    if (flag == 0) {
        $("#updateNameResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateName",modelId:modelId,modelName:modelName,modelNameNorm:modelNameNorm,currentName:currentName,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                if (response == 'success') {
                    $("#updateNameResponse-"+modelId).html('<label style="color:green">El nombre se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $("#nameContainer-" + modelId).html('<label id="nameLabel-' + modelId + '" style="font-size:16px;font-weight: 600" name="' + modelName + '"><a href="https://tratod1.com/m-'+ modelId +'" target="_blank">' + modelName + '</a></label>');  
                        $("#updateNameResponse-"+modelId).html('');
                        $('#nameUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateNameResponse-"+modelId).html('<label style="color:red">Hubo un error. '+response+'</label>');
                    setTimeout(function () { 
                        $("#updateNameResponse-"+modelId).html('');
                        $('#nameUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $("#updateNameResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateNameResponse-"+modelId).html('');
                    $('#nameUpdateButton-' + modelId).css("display", "block");
                }, 2000);                    
            }
        });           
    }  
});

$(document).on("click", ".updateTypeContainer", function(e) {
    e.preventDefault();
    var formType = '';
    var modelId = $(this).attr('name');
    var currentType = $('#typeLabel-' + modelId).attr('name');
    $('#typeUpdateButton-' + modelId).css("display", "none");
    formType = '<form class="form-inline" style="padding-bottom:6px;">';
    formType += '<div class="form-group">';
    formType += '<input type="hidden" id="textType-' + modelId + '" value="' + currentType + '">';
    formType += '<select class="form-control input-sm" id="selectType-' + modelId + '">';
    formType += '<option value="0" '; if (currentType == 0) { formType += 'selected'; }
    formType += '>Todos</option>';    
    formType += '<option value="1" '; if (currentType == 1) { formType += 'selected'; }
    formType += '>Casa</option>';
    formType += '<option value="2" '; if (currentType == 2) { formType += 'selected'; }
    formType += '>Departamento</option>';
    formType += '<option value="3" '; if (currentType == 3) { formType += 'selected'; }
    formType += '>Terreno</option>'; 
    formType += '<option value="4" '; if (currentType == 4) { formType += 'selected'; }
    formType += '>Duplex</option>';    
    formType += '<option value="5" '; if (currentType == 5) { formType += 'selected'; }
    formType += '>Triplex</option>';   
    formType += '<option value="6" '; if (currentType == 6) { formType += 'selected'; }
    formType += '>Tetraplex</option>';   
    formType += '<option value="7" '; if (currentType == 7) { formType += 'selected'; }
    formType += '>Pentaplex</option>';     
    formType += '<option value="8" '; if (currentType == 8) { formType += 'selected'; }
    formType += '>Hexaplex</option>';          
    formType += '</select>';
    formType += '&nbsp;&nbsp;'; 
    formType += '<button type="button" class="btn btn-sm btn-cancel cancelType" value="' + modelId + '" name="' + currentType + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formType += '&nbsp;&nbsp;';
    formType += '<button type="button" class="btn btn-sm btn-go updateType" value="' + modelId + '" name="' + currentType + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formType += '</div>';    
    formType += '<div class="form-group" id="updateTypeResponse-' + modelId + '" style="margin-top:2px">';    
    formType += '</div>';    
    formType += '</form>';
    $("#typeContainer-" + modelId).html(formType);
});

$(document).on("click", ".cancelType", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var type = $("#textType-" + modelId).val();
    if (type == 0) { currentType = 'Todos'; }
    else if (type == 1) { currentType = 'Casa'; }
    else if (type == 2) { currentType = 'Departamento'; }
    else if (type == 3) { currentType = 'Terreno'; }
    else if (type == 4) { currentType = 'Duplex'; }
    else if (type == 5) { currentType = 'Triplex'; }
    else if (type == 6) { currentType = 'Tetraplex'; }
    else if (type == 7) { currentType = 'Pentaplex'; }
    else if (type == 8) { currentType = 'Hexaplex'; }
    else { type = 'Error'; }
    $('#typeUpdateButton-' + modelId).css("display", "block");
    $("#typeContainer-" + modelId).html('<label id="typeLabel-' + modelId + '" name="' + type + '">' + currentType + '</label>');   
});

$(document).on("click", ".updateType", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentType = $("#textType-" + modelId).val();
    var newType = $("#selectType-" + modelId).val();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var flag = 0;

    if (newType == 0) { type = 'Todos'; }
    else if (newType == 1) { type = 'Casa'; }
    else if (newType == 2) { type = 'Departamento'; }
    else if (newType == 3) { type = 'Terreno'; }
    else if (newType == 4) { type = 'Duplex'; }
    else if (newType == 5) { type = 'Triplex'; }
    else if (newType == 6) { type = 'Tetraplex'; }
    else if (newType == 7) { type = 'Pentaplex'; }
    else if (newType == 8) { type = 'Hexaplex'; }
    else { newType = 'Error'; }

    if (currentType == newType) {
        $("#updateTypeResponse-"+modelId).html('<label style="color:red">El tipo de propiedad no ha sido actualizado.</label>');
        setTimeout(function () { 
            $("#updateTypeResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updateTypeResponse-"+modelId).html('');
    }
    if (flag == 0) {
        $("#updateTypeResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateType",modelId:modelId,newType:newType,currentType:currentType,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    $("#updateTypeResponse-" + modelId).html('<label style="color:green">El tipo de propiedad se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $('#typeContainer-'+modelId).html('<label id="typeLabel-' + modelId + '" name="' + newType + '">' + type + '</label>');
                        $("#updateTypeResponse-"+modelId).html('');
                        $('#typeUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateTypeResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateTypeResponse-"+modelId).html('');
                        $('#typeUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $("#updateTypeResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateTypeResponse-"+modelId).html('');
                    $('#typeUpdateButton-' + modelId).css("display", "block");
                }, 2000);                     
            }                 
        });           
    }    
});

$(document).on("click", ".updateFloorsContainer", function(e) {
    e.preventDefault();
    var formFloors = '';
    var modelId = $(this).attr('name');
    var currentFloors = $('#floorsLabel-' + modelId).attr('name');
    $('#floorsUpdateButton-' + modelId).css("display", "none");
    formFloors = '<form class="form-inline" style="padding-bottom:6px;">';
    formFloors += '<div class="form-group">';
    formFloors += '<input type="hidden" id="textFloors-' + modelId + '" value="' + currentFloors + '">';
    formFloors += '<select class="form-control input-sm" id="selectFloors-' + modelId + '">';
    for (x=1;x<7;x++) {
        formFloors += '<option value="'+x+'" '; if (currentFloors == x) { formFloors += 'selected'; }
        formFloors += '>'+x+'</option>'; 
    }           
    formFloors += '</select>';
    formFloors += '&nbsp;&nbsp;'; 
    formFloors += '<button type="button" class="btn btn-sm btn-cancel cancelFloors" value="' + modelId + '" name="' + currentFloors + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formFloors += '&nbsp;&nbsp;';
    formFloors += '<button type="button" class="btn btn-sm btn-go updateFloors" value="' + modelId + '" name="' + currentFloors + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formFloors += '</div>';    
    formFloors += '<div class="form-group" id="updateFloorsResponse-' + modelId + '" style="margin-top:2px">';    
    formFloors += '</div>';    
    formFloors += '</form>';
    $("#floorsContainer-" + modelId).html(formFloors);
});

$(document).on("click", ".cancelFloors", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var floors = $("#textFloors-" + modelId).val();
    $('#floorsUpdateButton-' + modelId).css("display", "block");
    $("#floorsContainer-" + modelId).html('<label id="floorsLabel-' + modelId + '" name="' + floors + '">' + floors + '</label>');   
});

$(document).on("click", ".updateFloors", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentFloors = $("#textFloors-" + modelId).val();
    var newFloors = $("#selectFloors-" + modelId).val();
    var flag = 0;
    if (currentFloors == newFloors) {
        $("#updateFloorsResponse-"+modelId).html('<label style="color:red">Los niveles no han sido actualizado.</label>');
        setTimeout(function () { 
            $("#updateFloorsResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updateFloorsResponse-"+modelId).html('');
    }
    if (flag == 0) {
        $("#updateFloorsResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateFloors",modelId:modelId,newFloors:newFloors,currentFloors:currentFloors},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    $("#updateFloorsResponse-"+modelId).html('<label style="color:green">Los niveles se actualizaron con éxito.</label>');
                    setTimeout(function () { 
                        $("#floorsContainer-" + modelId).html('<label id="floorsLabel-' + modelId + '" name="' + newFloors + '">' + newFloors + '</label>');   
                        $("#updateFloorsResponse-"+modelId).html('');
                        $('#floorsUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateFloorsResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateFloorsResponse-"+modelId).html('');
                        $('#floorsUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $("#updateFloorsResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateFloorsResponse-"+modelId).html('');
                    $('#floorsUpdateButton-' + modelId).css("display", "block");
                }, 2000);                     
            }                 
        });           
    }    
});

$(document).on("click", ".updatePriceContainer", function(e) {
    e.preventDefault();
    var formPrice = '';
    var modelId = $(this).attr('name');
    if ($(`#priceUSDLabel-${modelId}`).html() != "$0" ) return notify('growl-danger', 'Precio en dolares', 'No se puede modificar si tiene precio en dolares'); 
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

$(document).on("click", ".updatePriceUSDContainer", function(e) {
    e.preventDefault();
    var formPriceUSD = '';
    var modelId = $(this).attr('name');
    var currentPriceUSD = $('#priceUSDLabel-' + modelId).html();
    $('#priceUSDUpdateButton-' + modelId).css("display", "none");
    priceUSD = formatoMoneda(currentPriceUSD);
    formPriceUSD = '<form class="form-inline" style="padding-bottom:6px;">';
    formPriceUSD += '<div class="form-group">';
    formPriceUSD += '<input type="hidden" id="textPriceUSD-' + modelId + '" value="' + currentPriceUSD + '">';
    formPriceUSD += '<input type="text" class="form-control input-sm" style="max-width:100px;" id="inputPriceUSD-' + modelId + '" value="' + priceUSD + '">';
    formPriceUSD += '&nbsp;&nbsp;';   
    formPriceUSD += '<button type="button" class="btn btn-sm btn-cancel cancelPriceUSD" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>';
    formPriceUSD += '&nbsp;&nbsp;';  
    formPriceUSD += '<button type="button" class="btn btn-sm btn-go updatePriceUSD" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';
    formPriceUSD += '</div>';    
    formPriceUSD += '<div class="form-group" id="updatePriceUSDResponse-' + modelId + '" style="margin-top:2px">';    
    formPriceUSD += '</div>';    
    formPriceUSD += '</form>';
    $("#priceUSDContainer-" + modelId).html(formPriceUSD);
});

$(document).on("click", ".cancelPrice", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentPrice = $("#textPrice-" + modelId).val();
    var price = formatoMoneda(currentPrice);
    $('#priceUpdateButton-' + modelId).css("display", "block");
    $("#priceContainer-" + modelId).html('<label id="priceLabel-' + modelId + '" value="' + price + '">' + price + '</label>');   
});

$(document).on("click", ".cancelPriceUSD", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentPriceUSD = $("#textPriceUSD-" + modelId).val();
    var priceUSD = formatoMoneda(currentPriceUSD);
    $('#priceUSDUpdateButton-' + modelId).css("display", "block");
    $("#priceUSDContainer-" + modelId).html('<label id="priceUSDLabel-' + modelId + '" value="' + priceUSD + '">' + priceUSD + '</label>');   
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
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
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
            },
            error: function(response) {
                $("#updatePriceResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updatePriceResponse-"+modelId).html('');
                    $('#priceUpdateButton-' + modelId).css("display", "block");
                }, 2000);                    
            }            
        });           
    }
});

$(document).on("click", ".updatePriceUSD", function(e){
    e.preventDefault();
    var modelId = $(this).val();
    var currentPriceUSD = $("#textPriceUSD-"+modelId).val().trim();
    var newPriceUSD = $("#inputPriceUSD-"+modelId).val().trim();
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();
    var regNum = /^([0-9]+)$/;
    var flag = 0;

    if (newPriceUSD.substring(0,1) == '$') {
        newPriceUSD = newPriceUSD.slice(1);
    }
    newPriceUSD = newPriceUSD.replace(/,/g, '');

    if (currentPriceUSD.substring(0,1) == '$') {
        currentPriceUSD = currentPriceUSD.slice(1);
    }
    currentPriceUSD = currentPriceUSD.replace(/,/g, '');

    if (!(regNum.test(newPriceUSD)) || (newPriceUSD == '')) {
        $("#updatePriceUSDResponse-"+modelId).html('<label style="color:red">Solo puedes introducir números.</label>');
        setTimeout(function () { 
            $("#updatePriceUSDResponse-"+modelId).html('');
        }, 2000);          
        flag++;
    } else { 
        $("#updatePriceUSDResponse-"+modelId).html('');
    }

    if (flag == 0) {
        $("#updatePriceUSDResponse-"+modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updatePriceUSD",modelId:modelId,currentPriceUSD:currentPriceUSD,newPriceUSD:newPriceUSD,utc:utc},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    $("#updatePriceUSDResponse-"+modelId).html('<label style="color:green">El precio se actualizó con éxito.</label>');
                    priceUSD = formatoMoneda(newPriceUSD);
                    priceMXN = formatoMoneda((parseInt(newPriceUSD)*20).toString());
                    setTimeout(function () { 
                        $("#priceUSDContainer-"+modelId).html('<label id="priceUSDLabel-' + modelId + '" value="' + priceUSD + '">' + priceUSD + '</label>');                    
                        $("#priceContainer-"+modelId).html('<label id="priceLabel-' + modelId + '" value="' + priceMXN + '">' + priceMXN + '</label>');                    
                        $("#updatePriceUSDResponse-"+modelId).html('');
                        $('#priceUSDUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updatePriceUSDResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updatePriceUSDResponse-"+modelId).html('');
                        $('#priceUSDUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }                    
            },
            error: function(response) {
                $("#updatepriceUSDResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updatepriceUSDResponse-"+modelId).html('');
                    $('#priceUSDUpdateButton-' + modelId).css("display", "block");
                }, 2000);                    
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
    formStatus += '<option value="1" '; 
    if (currentStatus == 1) { formStatus += 'selected'; }
    formStatus += '>Activo</option>';
    formStatus += '<option value="2" '; 
    if (currentStatus == 2) { formStatus += 'selected'; }
    formStatus += '>Inactivo</option>';
    formStatus += '<option value="9" '; 
    if (currentStatus == 2) { formStatus += 'selected'; }
    formStatus += '>Demo</option>';    
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
    } else if (status == 9) {
        currentStatus = "Demo"        
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
    } else if (newStatus == 9) {
        var status = "Demo"
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
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
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
            },
            error: function(response) {
                $("#updateStatusResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateStatusResponse-"+modelId).html('');
                    $('#statusUpdateButton-' + modelId).css("display", "block");
                }, 2000);                     
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

$(document).on("click", ".updateVideo360Container", function(e) {
    e.preventDefault();
    var formVideo = '';
    var modelId = $(this).attr('name');
    var currentVideo360Id = $('#video360Label-' + modelId).data('id');    
    var currentVideo360Url = $('#video360Label-' + modelId).data('url');
    if (currentVideo360Url == null) { currentVideo360Url = ''; }
    var currentVideo360Provider = $('#video360Label-' + modelId).data('provider');
    var currentVideo360ProviderName = $('#video360Label-' + modelId).data('providername');
    $('#video360UpdateButton-' + modelId).css("display", "none");
    formVideo = '<form style="padding-bottom:6px;">';
    formVideo += '<input type="hidden" class="form-control input-sm" id="inputVideo360Id-' + modelId + '" value="' + currentVideo360Id + '">';
    formVideo += '<input type="hidden" class="form-control input-sm" id="inputVideo360Url-' + modelId + '" value="' + currentVideo360Url + '">';
    formVideo += '<input type="hidden" class="form-control input-sm" id="inputVideo360Provider-' + modelId + '" value="' + currentVideo360Provider + '">';
    formVideo += '<input type="hidden" class="form-control input-sm" id="inputVideo360ProviderName-' + modelId + '" value="' + currentVideo360ProviderName + '">';
    formVideo += '<div class="row">';    
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">URL</label>';
    formVideo += '<div class="col-sm-7">';
    formVideo += '<input type="text" class="form-control input-sm" style="height:24px;" id="textVideo360Url-' + modelId + '" value="' + currentVideo360Url + '">';
    formVideo += '</div>';       
    formVideo += '</div>';    
    formVideo += '</div>'; 
    formVideo += '<div class="row">';    
    formVideo += '<div class="form-group" style="margin-bottom:4px;">';
    formVideo += '<label class="col-sm-2 control-label">Proveedor</label>';
    formVideo += '<div class="col-sm-4">';
    formVideo += '<select class="form-control input-sm" id="textVideo360Provider-' + modelId + '" style="height:24px;padding:4px;">';
    formVideo += '<option value="0">Selecciona...</option>';
    formVideo += '</select>';
    formVideo += '</div>';       
    formVideo += '</div>';    
    formVideo += '</div>'; 
    formVideo += '<div class="row">';
    formVideo += '<div class="form-group style="margin:2px;">'; 
    formVideo += '<div class="col-sm-9 col-md-offset-2">';
    formVideo += '<button type="button" class="btn btn-sm btn-cancel cancelVideo360" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formVideo += '&nbsp;&nbsp;';  
    formVideo += '<button type="button" class="btn btn-sm btn-go updateVideo360" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>';     
    formVideo += '</div>'; 
    formVideo += '<div class="col-sm-9 col-md-offset-2" id="updateVideo360Response-' + modelId + '" style="margin-top:2px">';  
    formVideo += '</div>'; 
    formVideo += '</div>';    
    formVideo += '</div>';  
    formVideo += '</form>';
    $("#video360Container-" + modelId).html(formVideo); 
    getMediaProvider('textVideo360Provider-' + modelId, currentVideo360Provider);
});

$(document).on("click", ".updateVideo360", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentVideoId = $('#inputVideo360Id-' + modelId).val();
    var currentVideoUrl = $('#inputVideo360Url-' + modelId).val();
    var currentVideoProvider =$('#inputVideo360Provider-' + modelId).val();
    var currentVideoProviderName = $('#inputVideo360ProviderName-' + modelId).val();
    var videoUrl = $('#textVideo360Url-' + modelId).val();
    var videoProvider = $('#textVideo360Provider-' + modelId).val();
    var flag = 0;
    if (flag == 0) {
        $('#updateVideo360Response-' + modelId).html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateModelVideo360",modelId:modelId,videoUrl:videoUrl,videoProvider:videoProvider,currentVideoId:currentVideoId,currentVideoUrl:currentVideoUrl,currentVideoProvider:currentVideoProvider},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $('#updateVideo360Response-' + modelId).html('<label style="color:green">La URL del Recorrido Virtual se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        updateVideo360Container(modelId);
                    }, 2000);                       
                } else {
                    $('#updateVideo360Response-' + modelId).html('<label style="color:red">Hubo un error.</label>');  
                    setTimeout(function () { 
                        updateVideo360Container(modelId);
                    }, 2000);           
                }
            },
            error: function(response) {
                $('#updateVideo360Response-' + modelId).html('<label style="color:red">Hubo un error.</label>');   
                setTimeout(function () { 
                    updateVideo360Container(modelId);
                }, 2000);         
            }            
        });   
    } 
});

function updateVideo360Container(modelId) {
    $('#video360UpdateButton-' + modelId).css("display", "block");
    $('#updateVideo360Response-' + modelId).html("<img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:24px;'>");
    $.ajax({
        type: "GET",
        data: {type:"getModelVideo360", modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            if (response.id == null) {
                string = '<label id="video360Label-' + modelId + '" data-id="' + response.id + '" data-url="' + response.url + '" data-provider="' + response.mediaProvider  + '" data-providername="' + response.mediaProviderName  + '">&nbsp;</label>';  
            } else {
                string = '<label id="video360Label-' + modelId + '" data-id="' + response.id + '" data-url="' + response.url + '" data-provider="' + response.mediaProvider  + '" data-providername="' + response.mediaProviderName  + '"<a href="' + response.url + '" target="_blank">' + response.url + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + response.url + '">Copiar URL</button><br>Proveedor: ' + response.mediaProviderName;  
            }      
            $('#video360Container-' + modelId).html(string);              
        }
    });
}

$(document).on("click", ".cancelVideo360", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentVideoId = $('#inputVideo360Id-' + modelId).val();
    var currentVideoUrl = $('#inputVideo360Url-' + modelId).val();
    var currentVideoProvider =$('#inputVideo360Provider-' + modelId).val();
    var currentVideoProviderName = $('#inputVideo360ProviderName-' + modelId).val();
    $('#video360UpdateButton-' + modelId).css("display", "block");
    if (currentVideoId == 'null') {
        string = '<label id="video360Label-' + modelId + '" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-provider="' + currentVideoProvider  + '" data-providername="' + currentVideoProviderName  + '">&nbsp;</label>';  
    } else {
        string = '<label id="video360Label-' + modelId + '" data-id="' + currentVideoId + '" data-url="' + currentVideoUrl + '" data-provider="' + currentVideoProvider  + '" data-providername="' + currentVideoProviderName  + '"<a href="' + currentVideoUrl + '" target="_blank">' + currentVideoUrl + '</a></label>&nbsp;&nbsp;<button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="' + currentVideoUrl + '">Copiar URL</button><br>Proveedor: ' + currentVideoProviderName;  
    }    
    $('#video360Container-' + modelId).html(string);    
});

$(document).on("click", ".updateAvailabilityContainer", function(e) {
    e.preventDefault();
    var formAvailability = '';
    var modelId = $(this).attr('name');
    var currentAvailability = $('#availabilityLabel-' + modelId).html();
    $('#availabilityUpdateButton-' + modelId).css("display", "none");
    var resAvailability = currentAvailability.split(" ");
    var monthAvailability = resAvailability[0];
    var yearAvailability = resAvailability[1];
    formAvailability = '<form class="form-inline" style="padding-bottom:6px;">';
    formAvailability += '<div class="form-group">';
    formAvailability += '<input type="hidden" class="form-control input-sm" id="inputAvailability-' + modelId + '" value="' + currentAvailability + '">';
    formAvailability += '<select class="form-control input-sm" style="width:100px;" id="monthAvailability-' + modelId + '">';
    formAvailability += '<option value="01">Enero</option>';
    formAvailability += '<option value="02">Febrero</option>';
    formAvailability += '<option value="03">Marzo</option>';
    formAvailability += '<option value="04">Abril</option>';
    formAvailability += '<option value="05">Mayo</option>';
    formAvailability += '<option value="06">Junio</option>';
    formAvailability += '<option value="07">Julio</option>';
    formAvailability += '<option value="08">Agosto</option>';
    formAvailability += '<option value="09">Septiembre</option>';
    formAvailability += '<option value="10">Octubre</option>';
    formAvailability += '<option value="11">Noviembre</option>';
    formAvailability += '<option value="12">Diciembre</option>';
    formAvailability += '</select>'; 
    formAvailability += '&nbsp;&nbsp;'; 
    formAvailability += '<select class="form-control input-sm" style="width:70px;" id="yearAvailability-' + modelId + '">';
    formAvailability += '<option value="2018">2018</option>';
    formAvailability += '<option value="2019">2019</option>';
    formAvailability += '<option value="2020">2020</option>';
    formAvailability += '<option value="2021">2021</option>';
    formAvailability += '<option value="2022">2022</option>';
    formAvailability += '<option value="2023">2023</option>';
    formAvailability += '<option value="2024">2024</option>';    
    formAvailability += '<option value="2025">2025</option>';   
    formAvailability += '</select>'; 
    formAvailability += '&nbsp;&nbsp;'; 
    formAvailability += '<button type="button" class="btn btn-sm btn-cancel cancelAvailability" value="' + modelId + '"><i class="glyphicon glyphicon-remove"></i></button>'; 
    formAvailability += '&nbsp;&nbsp;';
    formAvailability += '<button type="button" class="btn btn-sm btn-go updateAvailability" value="' + modelId + '"><i class="glyphicon glyphicon-ok"></i></button>'; 
    formAvailability += '</div>';    
    formAvailability += '<div class="col-md-8" id="updateAvailabilityResponse-' + modelId + '" style="margin-top:2px">';   
    formAvailability += '</div>';    
    formAvailability += '</form>';
    var selectMonth = 'monthAvailability-' + modelId;
    var selectYear = 'yearAvailability-' + modelId;
    $("#availabilityContainer-" + modelId).html(formAvailability); 
    $('#' + selectMonth + '  option').filter(function() { 
        return ($(this).text() == monthAvailability); //To select Blue
    }).prop('selected', true);
    $('#' + selectYear + '  option').filter(function() { 
        return ($(this).text() == yearAvailability); //To select Blue
    }).prop('selected', true);
});

$(document).on("click", ".cancelAvailability", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var availability = $("#inputAvailability-" + modelId).val();
    $('#availabilityUpdateButton-' + modelId).css("display", "block");
    $("#availabilityContainer-" + modelId).html('<label id="availabilityLabel-' + modelId + '">' + availability + '</label>');   
});

$(document).on("click", ".updateAvailability", function(e) {
    e.preventDefault();
    var modelId = $(this).val();
    var currentAvailability = $("#inputAvailability-" + modelId).val().trim();
    var monthAvailability = $('#monthAvailability-' + modelId).val();
    var monthAvailabilityText = $('option:selected', '#monthAvailability-' + modelId).text();  
    var yearAvailability = $('#yearAvailability-' + modelId).val();
    var availability = monthAvailabilityText + ' ' + yearAvailability;
    var flag = 0;    
    if (currentAvailability == availability) {
        $("#updateAvailabilityResponse-" + modelId).html('<label style="color:red">La disponibilidad no ha sido actualizada.</label>');
        setTimeout(function () { 
            $("#updateAvailabilityResponse-"+modelId).html('');
        }, 2000);           
        flag++;
    } else { 
        $("#updateAvailabilityResponse-"  +modelId).html('');
    }
    if (flag == 0) {
        $("#updateAvailabilityResponse-" + modelId).html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:24px;'>");
        $.ajax({
            type: "GET",
            data: {type:"updateAvailability",modelId:modelId,monthAvailability:monthAvailability,yearAvailability:yearAvailability,currentAvailability:currentAvailability},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
                    $("#updateAvailabilityResponse-"+modelId).html('<label style="color:green">La disponibilidad se actualizó con éxito.</label>');
                    setTimeout(function () { 
                        $("#availabilityContainer-"+modelId).html('<label id="availabilityLabel-' + modelId + '">' + availability + '</label>'); 
                        $("#updateAvailabilityResponse-"+modelId).html('');
                        $('#availabilityUpdateButton-' + modelId).css("display", "block");
                    }, 2000);
                } else {
                    $("#updateAvailabilityResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $("#updateAvailabilityResponse-"+modelId).html('');
                        $('#availabilityUpdateButton-' + modelId).css("display", "block");
                    }, 2000);                    
                }
            },
            error: function(response) {
                $("#updateAvailabilityResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateAvailabilityResponse-"+modelId).html('');
                    $('#availabilityUpdateButton-' + modelId).css("display", "block");
                }, 2000);                  
            }               
        });           
    }       
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
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
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
            },
            error: function(response) {
                $("#updateDescriptionResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateDescriptionResponse-"+modelId).html('');
                    $('#descriptionUpdateButton-' + modelId).css("display", "block");
                }, 2000);                  
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
    //console.log(currentLandArea, currentBuildingArea, landArea, buildingArea);
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
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    }
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
            },
            error: function(response) {
                $("#updateAreaResponse-"+modelId).html('<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $("#updateAreaResponse-"+modelId).html('');
                    $('#areaUpdateButton-' + modelId).css("display", "block");
                }, 2000);                 
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
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
         },
         error: function(response) {
            $("#basicFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
            setTimeout(function () { 
                $("#basicFeaturesResponse").html('');
                $('#basicFeaturesModal').modal('hide');
            }, 2000);                
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#additionalFeaturesModalTittle").html('Características Adicionales / ' + modelName);     
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
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
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
        },
        error: function(response) {
            $("#additionalFeaturesResponse").html('<label style="color:red">Hubo un error.</label>');
            setTimeout(function () { 
                $("#additionalFeaturesResponse").html('');
                $('#additionalFeaturesModal').modal('hide');
            }, 2000);              
        }          
     });
});

$(document).on("click", "#devCategoryUpdateButton", function (e) {
    e.preventDefault();
    var category = $("#devCategoryLabel").html();
    var developmentId = $(this).attr("name");
    $(this).hide();
    var formCategory = '<form class="form-inline"><div class="form-group"><select class="form-control input-sm" style="width:120px;" id="updateDevCat">';
    categoryOptions.forEach(element => {
        if (element.name == category) {
            formCategory += '<option value="'+ element.id +'" selected>'+ element.name +'</option>';
        } else {
            formCategory += '<option value="'+ element.id +'">'+ element.name +'</option>';
        } 
    });          
    formCategory += '</select></div><div class="form-group">';
    formCategory += '<button type="button" class="btn btn-sm btn-cancel cancelCategory" value="'+ developmentId+'" name="'+category+'"><i class="glyphicon glyphicon-remove"></i></button>&nbsp;&nbsp;';
    formCategory += '<button type="button" class="btn btn-sm btn-go updateCategory" value="'+ developmentId+'" name="0"><i class="glyphicon glyphicon-ok"></i></button></div></form>';
    $("#devCategoryContainer").html(formCategory);
});

$(document).on("click", ".cancelCategory", function (e) {
    e.preventDefault();
    var category = $(this).attr("name");
    $("#devCategoryContainer").html('<label id="devCategoryLabel">' + category + '</label>');
    $("#devCategoryUpdateButton").show();
});

$(document).on("click", ".updateCategory", function (e) {
    e.preventDefault();
    var development = $(this).val();
    var categoryId = $("#updateDevCat").val();
    var categoryName = $('#updateDevCat option:selected').text();
    $.ajax({
        type: "GET",
        data: {type:"updateCategory", categoryId:categoryId, developmentId:development},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else if(response){
                $("#devCategoryContainer").html('<label id="devCategoryLabel">' + categoryName + '</label>');
                $("#devCategoryUpdateButton").show();
            } else {
                notify("growl-danger", "Error", "Error al actualizar. Intentalo más tarde");
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;
        }
    });
});

$(document).on("click", "#devNegotationUpdateButton", function (e) {
    e.preventDefault();
    var negotation = $("#devNegotationLabel").html();
    var developmentId = $(this).attr("name");
    $(this).hide();
    var formNegotation = '<form class="form-inline"><div class="form-group"><select class="form-control input-sm" style="width:150px;" id="updateDevNegotation">';
    negotationOptions.forEach(element => {
        if (element.name == negotation) {
            formNegotation += '<option value="'+ element.id +'" selected>'+ element.name +'</option>';
        } else {
            formNegotation += '<option value="'+ element.id +'">'+ element.name +'</option>';
        } 
    });          
    formNegotation += '</select></div><div class="form-group">';
    formNegotation += '<button type="button" class="btn btn-sm btn-cancel cancelNegotation" value="'+ developmentId+'" name="'+negotation+'"><i class="glyphicon glyphicon-remove"></i></button>&nbsp;&nbsp;';
    formNegotation += '<button type="button" class="btn btn-sm btn-go updateNegotation" value="'+ developmentId+'" name="0"><i class="glyphicon glyphicon-ok"></i></button></div></form>';
    $("#devNegotationContainer").html(formNegotation);
});

$(document).on("click", ".cancelNegotation", function (e) {
    e.preventDefault();
    var negotation = $(this).attr("name");
    $("#devNegotationContainer").html('<label id="devNegotationLabel">' + negotation + '</label>');
    $("#devNegotationUpdateButton").show();
});

$(document).on("click", ".updateNegotation", function (e) {
    e.preventDefault();
    var development = $(this).val();
    var negotationId = $("#updateDevNegotation").val();
    var negotationName = $('#updateDevNegotation option:selected').text();
    $.ajax({
        type: "GET",
        data: {type:"updateNegotation", negotationId:negotationId, developmentId:development},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else if(response){
                $("#devNegotationContainer").html('<label id="devNegotationLabel">' + negotationName + '</label>');
                $("#devNegotationUpdateButton").show();
            } else {
                notify("growl-danger", "Error", "Error al actualizar. Intentalo más tarde");
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
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
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $.each(response.additionalFeature, function(index, additionalFeature) {
                if (additionalFeature.quantity != 0) {
                    additionalFeaturesColumn += additionalFeature.nameText + '; ';
                }               
            })
            $("#additionalFeaturesContainer-" + modelId).html(additionalFeaturesColumn);      
        }
    });	
}

function getDevelopmentFeatures(developmentId) {
    var developmentFeatures = '';
    var devFeaturesPayment = '';
    $('#devFeatureContainer').html("<div style='text-align:left;'><img src='images/loading.gif' class='img-responsive' align='left' style='margin: 0 auto; width:30px;'></div>");
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentFeatures",developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $.each(response.developmentFeature, function(index, developmentFeature) {
                if (developmentFeature.featureFlag != 0) {
                    if (developmentFeature.featureCat != 4) {
                        developmentFeatures += developmentFeature.featureName + '; ';
                    } else {
                        devFeaturesPayment += developmentFeature.featureName + '; ';
                    }
                }               
            })
            $('#devFeatureContainer').html('<label id="devFeaturesLabel">' + developmentFeatures + '<br>Métodos de pago: ' + devFeaturesPayment + '</lable>');      
        }
    });	
}

function getAllStates(developmentId, selectName, stateId, loader) {   
    $.ajax({
        type: "GET",
        data: {type:"getAllStates"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#' + loader).html('');
            $('#' + selectName).empty();
            $('#' + selectName).append("<option value='0'>Selecciona...</option>");
            $.each(response.state, function(index, state) {
                if (stateId == state.id) {
                    states = "<option value='" + state.id + "' selected>" + state.name + "</option>";
                } else {
                    states = "<option value='" + state.id + "'>" + state.name + "</option>";
                }
                $('#' + selectName).append(states);
            });
        }
    });	
}

$(document).on("change", "#selectAddressDevState", function(e) {
    e.preventDefault();
    var developmentId = null;
    var stateId = $(this).val();
    var localityLoader = 'selectAddressDevLocalityLoader';
    $('#' + localityLoader).html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;"></img>');
    getAllLocatiesByState(developmentId, 'selectAddressDevLocality', stateId, null, localityLoader); 
});

$(document).on("change", "#selectAddressDevPsState", function(e) {
    e.preventDefault();
    var developmentId = null;
    var stateId = $(this).val();
    var localityLoader = 'selectAddressDevPsLocalityLoader';
    $('#' + localityLoader).html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:22px;"></img>');
    getAllLocatiesByState(developmentId, 'selectAddressDevPsLocality', stateId, null, localityLoader); 
});

function getAllLocatiesByState(developmentId, selectName, stateId, localityId, loader) {
    $.ajax({
        type: "GET",
        data: {type:"getAllLocalitiesByState",stateId:stateId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $('#' + loader).html('');            
            if (response.locality.length > 0) {
                $('#' + selectName).empty();
                $('#' + selectName).append("<option value='0'>Selecciona...</option>");
                $.each(response.locality, function(index, locality) {
                    if (localityId == locality.id) {
                        localities = "<option value='" + locality.id + "' selected>" + locality.name + "</option>";
                    } else {
                        localities = "<option value='" + locality.id + "'>" + locality.name + "</option>";
                    }
                    $('#' + selectName).append(localities);
                });
            } else {
                $('#' + selectName).empty();
                $('#' + selectName).append("<option value='0'>Sin información</option>");                
            }
        }
    });	
}

$(document).on("click", ".copyURL", function(e) {
    e.preventDefault();
    var textArea = document.createElement('textarea');
    var url = $(this).attr('name');
	var isiOSDevice = navigator.userAgent.match(/ipad|iphone/i);    
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
    $('#typeMsg').css('background-color', '#5cb85c');
    $('#alerMsg').html('<h4 style="font-size:14px;color:#FFFFFF">¡Listo! La URL fue copiada al portapapeles.</h4>');
    $('#openAlertModal').click();
    setTimeout(function () { 
        $('#alertModal').modal('hide');
   }, 2000);       
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
/*function getFeatures() {
    var features;
    $.ajax({
        type: "GET",
        data: {type:"getDevelopmentFeatures",developmentId:0},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {  
            $('#newDevFeatures').prop('disabled', false);
            $.each(response.developmentFeature, function(index, developmentFeature) {
                features = '<option value="' + developmentFeature.featureId + '">'+developmentFeature.featureName+'</option>';
                $("#newDevFeatures").append(features);         
            });
        }
    });
}*/

$(document).on("click", "#retryUrlsDev", function (e) {
    e.preventDefault();
    data = $(this);
    id = data.data('id');
    developmenName = data.data('name');
    nameNormalized = data.data('namenorm');
    urlFriendly = data.data('longurl');
    shortUrl = 'https://tratod1.com/d-'+id;
    $("#nameNorm").val(nameNormalized);
    $("#newFrienlyUrl").val(urlFriendly);
    $("#newShortUrl").val(shortUrl);
    $("#urlType").val("dev");
    $("#addUrls").attr("name", id);
    $("#urlName").attr("name", developmenName+"-"+id);
    $("#nameNorm").attr("readonly", true);
    $("#showUrls").click();
});

$(document).on("click", ".retryUrlsMod", function (e) {
    e.preventDefault();
    data = $(this);
    idDev = data.data('iddev');
    idMod = data.data('id');
    developmenName = data.data('name');
    nameNormalized = data.data('namenorm');
    urlFriendly = data.data('longurl');
    shortUrl = 'https://tratod3.com/m-'+idMod;
    $("#nameNorm").val(nameNormalized);
    $("#newFrienlyUrl").val(urlFriendly);
    $("#newShortUrl").val(shortUrl);
    $("#urlType").val("mod");
    $("#addUrls").attr("name", idMod);
    $("#urlName").attr("name", developmenName+"-"+idDev);
    $("#nameNorm").attr("readonly", true);
    $("#showUrls").click();
});

$(document).on("click", "#devSaleArgumentUpdateButton", function (e) {
    e.preventDefault();
    $(this).hide();
    var developmentId = $(this).attr("name");
    var text = $("#devSaleArgumentLabel").html();
    var field = `<div class="row">
                    <textarea name="" id="updateSaleArgumentField" class="form-control" style="resize: none;height: 150px;"></textarea>
                </div>
                <div class="row" style="padding: 5px;">
                    <button type="button" class="btn btn-sm btn-cancel" value="${text}" id="cancelSaleArgument" ><i class="glyphicon glyphicon-remove"></i></button>
                    <button type="button" class="btn btn-sm btn-go" value="${developmentId}" id="updateSaleArgument"><i class="glyphicon glyphicon-ok"></i></button>
                </div>`
    $("#devSaleArgumentContainer").html(field);
    $("#updateSaleArgumentField").val(text);
});

$(document).on("click", "#cancelSaleArgument", function (e) {
    e.preventDefault();
    $("#devSaleArgumentUpdateButton").show();
    var text = $(this).val();
    $("#devSaleArgumentContainer").html('<label id="devSaleArgumentLabel">' + text + '</label>');
});

$(document).on("click", "#updateSaleArgument", function (e) {
    e.preventDefault();
    var newArgument = $("#updateSaleArgumentField").val();
    var developmentId = $(this).val();
    $.ajax({
        type: "GET",
        data: {type:"updateSaleArgument",argument:newArgument,developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    $("#devSaleArgumentUpdateButton").show();
                    $("#devSaleArgumentContainer").html('<label id="devSaleArgumentLabel">' + newArgument + '</label>');
                } else {
                    notify('growl-danger', 'Error al actualizar', 'Error al actualizar el argurmento de venta, intentalo mas tarde');
                }
            }
        }
    });
});

function notify(type, title, text) {
    jQuery.gritter.add({
        title: title,
        text: text,
        // image: 'https://cdn.hobbyconsolas.com/sites/navi.axelspringer.es/public/styles/1200/public/media/image/2019/03/dragon-ball-fighterz-goku-gt_1.jpg',
        class_name: type,
        sticky: false,
        time: '4000'
    });
}