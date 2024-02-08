//v=01.1.4 05/11/2019
$(document).ready(function () {
    getData();
    getMinPrice();
});

var minPrice = 0;
function getMinPrice() {
    $.ajax({
        type: "GET",
        data: {type:"getMinPrice"},
        url: "./php/priceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                minPrice = response[0] + '.00';
            }       
        }
    });
}

var developerData = [];
var stateData = [];
var localityData = [];
var developmentData = [];
function getData() {
    $.ajax({
        type: "GET",
        data: {type:"getData", developerId:'All', stateId:'All', localityId:'All', developmentId:'All'},
        url: "./php/priceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                var len = response.data.length;
                $.each(response.data, function(index, data) {
                    $("#developer").prop('disabled', false);
                    $("#state").attr("disabled", false);
                    $("#locality").attr("disabled", false);
                    $("#development").attr("disabled", false);
                    developerData.push({
                        "order": data.developerName + data.stateName + data.localityName + data.developmentName + data.modelName,
                        "developerId": data.developerId,
                        "developerName": data.developerName,
                        "developerStatus": data.developerStatus,
                        "stateId": data.stateId,
                        "stateName": data.stateName,
                        "stateStatus": data.stateStatus,
                        "localityId": data.localityId,
                        "localityName": data.localityName,
                        "localityStatus": data.localityStatus,
                        "developmentSortValue": data.developmentName + data.developmentId,
                        "developmentId": data.developmentId,
                        "developmentName": data.developmentName,
                        "developmentStatus": data.developmentStatus,
                        "modelId": data.modelId,
                        "modelName": data.modelName,
                        "modelPrice": data.modelPrice,
                        "modelAvailability": data.modelAvailability,
                        "modelStatus": data.modelStatus
                    });
                    if (index === (len - 1)) {
                        getDevelopers();
                        getStates();
                        getlocalities();
                        getdevelopments();
                        getModels();                       
                    }  
                });
            }
        }
    });	
}

var developerDataTemp = [];
var stateDataTemp = [];
var localityDataTemp = [];
var developmentDataTemp = [];
var modelDataTemp = [];
function getDevelopers() {
    var previousValue = '';
    var string = '';  
    developerDataTemp = [];  
    developerDataTemp = JSON.parse(JSON.stringify(developerData));
    developerDataTemp.sort(dynamicSort("developerName"));   
    $("#developer").empty();
    $("#developer").append("<option value='All'>Todos</option>");    
    $.each(developerDataTemp, function(index, data) {
        if (previousValue != data.developerId) {
            string = "<option value='" + data.developerId + "'>" + data.developerName + "</option>";
            $("#developer").append(string);
        }
        previousValue = data.developerId;                                
    });
}

function getStates() {
    var previousValue = '';
    var string = '';
    stateDataTemp = [];  
    stateDataTemp = JSON.parse(JSON.stringify(developerData));
    stateDataTemp.sort(dynamicSort("stateName"));    
    $("#state").empty();
    $("#state").append("<option value='All'>Todos</option>");    
    $.each(stateDataTemp, function(index, data) {
        if (previousValue != data.stateId) {
            string = "<option value='" + data.stateId + "'>" + data.stateName + "</option>";
            $("#state").append(string);
        }
        previousValue = data.stateId;                                
    });
}

function getlocalities() {
    var previousValue = '';
    var string = '';
    localityDataTemp = [];
    localityDataTemp = JSON.parse(JSON.stringify(developerData));
    localityDataTemp.sort(dynamicSort("localityName"));
    $("#locality").empty();
    $("#locality").append("<option value='All'>Todos</option>");    
    $.each(localityDataTemp, function(index, data) {
        if (previousValue != data.localityId) {
            string = "<option value='" + data.localityId + "'>" + data.localityName + "</option>";
            $("#locality").append(string);
        }
        previousValue = data.localityId;                                
    });
}

function getdevelopments() {
    var previousValue = '';
    var string = '';
    developmentDataTemp = [];
    developmentDataTemp = JSON.parse(JSON.stringify(developerData));
    developmentDataTemp.sort(dynamicSort("developmentSortValue")); 
    $("#development").empty();
    $("#development").append("<option value='All'>Todos</option>");    
    $.each(developmentDataTemp, function(index, data) {
        if (previousValue != data.developmentName + data.developmentId) {
            string = "<option value='" + data.developmentId + "'>" + data.developmentName + "("+ data.developmentId + ")" + "</option>";
            $("#development").append(string);
            previousValue = data.developmentName + data.developmentId;  
        }                              
    });
}

function getModels() {
    modelDataTemp = [];
    modelDataTemp = JSON.parse(JSON.stringify(developerData));
    modelDataTemp.sort(dynamicSort("order"));   
}

$(document).on("change", "#developer", function(e) {
    e.preventDefault();
    var developerId = $(this).val();
    var previousState = 0;
    stateDataTemp = [];
    developerDataLength = developerDataTemp.length;
    developerDataTemp.sort(dynamicSort("developerName"));       
    $("#state").empty();
    $("#state").append("<option value='All'>Todos</option>");  
    if (developerId == 'All') {
        $.each(developerDataTemp, function(index, data) {
            if (previousState != data.stateId) {    
                string = "<option value='" + data.stateId + "'>" + data.stateName + "</option>";
                $("#state").append(string);
            }
            stateDataTemp.push({
                "developerId": data.developerId,
                "developerName": data.developerName,
                "developerStatus": data.developerStatus,
                "stateId": data.stateId,
                "stateName": data.stateName,
                "stateStatus": data.stateStatus,
                "localityId": data.localityId,
                "localityName": data.localityName,
                "localityStatus": data.localityStatus,
                "developmentSortValue": data.developmentName + data.developmentId,
                "developmentId": data.developmentId,
                "developmentName": data.developmentName,
                "developmentStatus": data.developmentStatus,
                "modelId": data.modelId,
                "modelName": data.modelName,
                "modelPrice": data.modelPrice,
                "modelAvailability": data.modelAvailability,
                "modelStatus": data.modelStatus
            });      
            previousState = data.stateId;        
            if (index === (developerDataLength - 1)) {
                states();
            }
        });
    } else {
        $.each(developerDataTemp, function(index, data) {
            if (developerId == data.developerId) {
                if (previousState != data.stateId) {    
                    string = "<option value='" + data.stateId + "'>" + data.stateName + "</option>";
                    $("#state").append(string);
                }
                stateDataTemp.push({
                    "developerId": data.developerId,
                    "developerName": data.developerName,
                    "developerStatus": data.developerStatus,
                    "stateId": data.stateId,
                    "stateName": data.stateName,
                    "stateStatus": data.stateStatus,
                    "localityId": data.localityId,
                    "localityName": data.localityName,
                    "localityStatus": data.localityStatus,
                    "developmentSortValue": data.developmentName + data.developmentId,
                    "developmentId": data.developmentId,
                    "developmentName": data.developmentName,
                    "developmentStatus": data.developmentStatus,
                    "modelId": data.modelId,
                    "modelName": data.modelName,
                    "modelPrice": data.modelPrice,
                    "modelAvailability": data.modelAvailability,
                    "modelStatus": data.modelStatus
                });      
                previousState = data.stateId;        
            }
            if (index === (developerDataLength - 1)) {
                states();
            }
        }); 
    }
    $("#state").val('All').trigger('change.select2');
});

$(document).on("change", "#state", function(e) {
    e.preventDefault();
    var stateId = $(this).val();
    var previousLocality = 0;
    localityDataTemp = [];
    //$("#state option[value='All']").remove();
    stateDataLength = stateDataTemp.length;
    stateDataTemp.sort(dynamicSort("localityName"));       
    $("#locality").empty();
    $("#locality").append("<option value='All'>Todos</option>"); 
    if (stateId == 'All') { 
        $.each(stateDataTemp, function(index, data) {
            if (previousLocality != data.localityId) {    
                string = "<option value='" + data.localityId + "'>" + data.localityName + "</option>";
                $("#locality").append(string);
            }
            localityDataTemp.push({
                "developerId": data.developerId,
                "developerName": data.developerName,
                "developerStatus": data.developerStatus,
                "stateId": data.stateId,
                "stateName": data.stateName,
                "stateStatus": data.stateStatus,
                "localityId": data.localityId,
                "localityName": data.localityName,
                "localityStatus": data.localityStatus,
                "developmentSortValue": data.developmentName + data.developmentId,
                "developmentId": data.developmentId,
                "developmentName": data.developmentName,
                "developmentStatus": data.developmentStatus,
                "modelId": data.modelId,
                "modelName": data.modelName,
                "modelPrice": data.modelPrice,
                "modelAvailability": data.modelAvailability,
                "modelStatus": data.modelStatus
            });     
            previousLocality = data.localityId;        
            if (index === (stateDataLength - 1)) {
                localities();
            }
        });
    } else {
        $.each(stateDataTemp, function(index, data) {
            if (stateId == data.stateId) {
                if (previousLocality != data.localityId) {    
                    string = "<option value='" + data.localityId + "'>" + data.localityName + "</option>";
                    $("#locality").append(string);
                }
                localityDataTemp.push({
                    "developerId": data.developerId,
                    "developerName": data.developerName,
                    "developerStatus": data.developerStatus,
                    "stateId": data.stateId,
                    "stateName": data.stateName,
                    "stateStatus": data.stateStatus,
                    "localityId": data.localityId,
                    "localityName": data.localityName,
                    "localityStatus": data.localityStatus,
                    "developmentSortValue": data.developmentName + data.developmentId,
                    "developmentId": data.developmentId,
                    "developmentName": data.developmentName,
                    "developmentStatus": data.developmentStatus,
                    "modelId": data.modelId,
                    "modelName": data.modelName,
                    "modelPrice": data.modelPrice,
                    "modelAvailability": data.modelAvailability,
                    "modelStatus": data.modelStatus
                });     
                previousLocality = data.localityId;        
            }
            if (index === (stateDataLength - 1)) {
                localities();
            }
        });
    }
    $("#locality").val('All').trigger('change.select2');
});

$(document).on("change", "#locality", function(e) {
    e.preventDefault();
    var localityId = $(this).val();
    var previousDevelopment = 0;
    developmentDataTemp = [];
    localityDataLenght = localityDataTemp.length;
    localityDataTemp.sort(dynamicSort("developmentName"));       
    $("#development").empty();
    $("#development").append("<option value='All'>Todos</option>");  
    if (localityId == 'All') { 
        $.each(localityDataTemp, function(index, data) {
            if (previousDevelopment != data.developmentId) {    
                string = "<option value='" + data.developmentId + "'>" + data.developmentName + "</option>";
                $("#development").append(string);
            }
            developmentDataTemp.push({
                "developerId": data.developerId,
                "developerName": data.developerName,
                "developerStatus": data.developerStatus,
                "stateId": data.stateId,
                "stateName": data.stateName,
                "stateStatus": data.stateStatus,
                "localityId": data.localityId,
                "localityName": data.localityName,
                "localityStatus": data.localityStatus,
                "developmentSortValue": data.developmentName + data.developmentId,
                "developmentId": data.developmentId,
                "developmentName": data.developmentName,
                "developmentStatus": data.developmentStatus,
                "modelId": data.modelId,
                "modelName": data.modelName,
                "modelPrice": data.modelPrice,
                "modelAvailability": data.modelAvailability,
                "modelStatus": data.modelStatus
            });
            previousDevelopment = data.developmentId;  
            if (index === (localityDataLenght - 1)) {
                developments();
            }                                    
        });
    } else {
        $.each(localityDataTemp, function(index, data) {
            if (localityId == data.localityId) {
                if (previousDevelopment != data.developmentId) {    
                    string = "<option value='" + data.developmentId + "'>" + data.developmentName + "</option>";
                    $("#development").append(string);
                }
                developmentDataTemp.push({
                    "developerId": data.developerId,
                    "developerName": data.developerName,
                    "developerStatus": data.developerStatus,
                    "stateId": data.stateId,
                    "stateName": data.stateName,
                    "stateStatus": data.stateStatus,
                    "localityId": data.localityId,
                    "localityName": data.localityName,
                    "localityStatus": data.localityStatus,
                    "developmentSortValue": data.developmentName + data.developmentId,
                    "developmentId": data.developmentId,
                    "developmentName": data.developmentName,
                    "developmentStatus": data.developmentStatus,
                    "modelId": data.modelId,
                    "modelName": data.modelName,
                    "modelPrice": data.modelPrice,
                    "modelAvailability": data.modelAvailability,
                    "modelStatus": data.modelStatus
                });
                previousDevelopment = data.developmentId;  
            }
            if (index === (localityDataLenght - 1)) {
                developments();
            }                                    
        });  
    }
    $("#development").val('All').trigger('change.select2');
});

$(document).on("change", "#development", function(e) {
    e.preventDefault();
    var developmentId = $(this).val();
    modelDataTemp = [];
    developmentDataLenght = developmentDataTemp.length;
    //$("#development option[value='All']").remove();
    developmentDataTemp.sort(dynamicSort("modelName"));    
    if (developmentId == 'All') {    
        $.each(developmentDataTemp, function(index, data) {
            modelDataTemp.push({
                "order": data.developerName + data.stateName + data.localityName + data.developmentName + data.modelName,
                "developerId": data.developerId,
                "developerName": data.developerName,
                "developerStatus": data.developerStatus,
                "stateId": data.stateId,
                "stateName": data.stateName,
                "stateStatus": data.stateStatus,
                "localityId": data.localityId,
                "localityName": data.localityName,
                "localityStatus": data.localityStatus,
                "developmentSortValue": data.developmentName + data.developmentId,
                "developmentId": data.developmentId,
                "developmentName": data.developmentName,
                "developmentStatus": data.developmentStatus,
                "modelId": data.modelId,
                "modelName": data.modelName,
                "modelPrice": data.modelPrice,
                "modelAvailability": data.modelAvailability,
                "modelStatus": data.modelStatus
            });   
            if (index === (developmentDataLenght - 1)) {
                viewData();
            }                            
        });
    } else {
        $.each(developmentDataTemp, function(index, data) {
            if (developmentId == data.developmentId) {
                modelDataTemp.push({
                    "order": data.developerName + data.stateName + data.localityName + data.developmentName + data.modelName,
                    "developerId": data.developerId,
                    "developerName": data.developerName,
                    "developerStatus": data.developerStatus,
                    "stateId": data.stateId,
                    "stateName": data.stateName,
                    "stateStatus": data.stateStatus,
                    "localityId": data.localityId,
                    "localityName": data.localityName,
                    "localityStatus": data.localityStatus,
                    "developmentSortValue": data.developmentName + data.developmentId,
                    "developmentId": data.developmentId,
                    "developmentName": data.developmentName,
                    "developmentStatus": data.developmentStatus,
                    "modelId": data.modelId,
                    "modelName": data.modelName,
                    "modelPrice": data.modelPrice,
                    "modelAvailability": data.modelAvailability,
                    "modelStatus": data.modelStatus
                });
            }   
            if (index === (developmentDataLenght - 1)) {
                viewData();
            }                                              
        });
    }
});

function states() {
    var previousLocality = 0;
    localityDataTemp = [];
    stateDatalength = stateDataTemp.length;
    stateDataTemp.sort(dynamicSort("localityName"));       
    $("#locality").empty();
    $("#locality").append("<option value='All'>Todos</option>");  
    $.each(stateDataTemp, function(index, data) {
        if (previousLocality != data.localityId) {    
            string = "<option value='" + data.localityId + "'>" + data.localityName + "</option>";
            $("#locality").append(string);
        }     
        localityDataTemp.push({
            "developerId": data.developerId,
            "developerName": data.developerName,
            "developerStatus": data.developerStatus,
            "stateId": data.stateId,
            "stateName": data.stateName,
            "stateStatus": data.stateStatus,
            "localityId": data.localityId,
            "localityName": data.localityName,
            "localityStatus": data.localityStatus,
            "developmentSortValue": data.developmentName + data.developmentId,
            "developmentId": data.developmentId,
            "developmentName": data.developmentName,
            "developmentStatus": data.developmentStatus,
            "modelId": data.modelId,
            "modelName": data.modelName,
            "modelPrice": data.modelPrice,
            "modelAvailability": data.modelAvailability,
            "modelStatus": data.modelStatus
        });                        
        previousLocality = data.localityId; 
        if (index === (stateDatalength - 1)) {
            localities();
        }
    });
    $("#locality").val('All').trigger('change.select2'); 
}

function localities() {
    var previousDevelopment = 0;
    developmentDataTemp = [];
    localityDatalength = localityDataTemp.length;
    localityDataTemp.sort(dynamicSort("developmentSortValue"));       
    $("#development").empty();
    $("#development").append("<option value='All'>Todos</option>");  
    $.each(localityDataTemp, function(index, data) {
        if (previousDevelopment != data.developmentId) {    
            string = "<option value='" + data.developmentId + "'>" + data.developmentName + "</option>";
            $("#development").append(string);
        }    
        developmentDataTemp.push({
            "developerId": data.developerId,
            "developerName": data.developerName,
            "developerStatus": data.developerStatus,
            "stateId": data.stateId,
            "stateName": data.stateName,
            "stateStatus": data.stateStatus,
            "localityId": data.localityId,
            "localityName": data.localityName,
            "localityStatus": data.localityStatus,
            "developmentSortValue": data.developmentName + data.developmentId,
            "developmentId": data.developmentId,
            "developmentName": data.developmentName,
            "developmentStatus": data.developmentStatus,
            "modelId": data.modelId,
            "modelName": data.modelName,
            "modelPrice": data.modelPrice,
            "modelAvailability": data.modelAvailability,
            "modelStatus": data.modelStatus
        });                        
        previousDevelopment = data.developmentId; 
        if (index === (localityDatalength - 1)) {
            developments();
        }
    });
    $("#development").val('All').trigger('change.select2'); 
}

function developments() {
    var previousModel = 0;
    modelDataTemp = [];
    developmentDatalength = developmentDataTemp.length;
    developmentDataTemp.sort(dynamicSort("modelName"));       
    $.each(developmentDataTemp, function(index, data) {
        if (previousModel != data.modelId) {       
            modelDataTemp.push({
                "order": data.developerName + data.stateName + data.localityName + data.developmentName + data.modelName,
                "developerId": data.developerId,
                "developerName": data.developerName,
                "developerStatus": data.developerStatus,
                "stateId": data.stateId,
                "stateName": data.stateName,
                "stateStatus": data.stateStatus,
                "localityId": data.localityId,
                "localityName": data.localityName,
                "localityStatus": data.localityStatus,
                "developmentSortValue": data.developmentName + data.developmentId,
                "developmentId": data.developmentId,
                "developmentName": data.developmentName,
                "developmentStatus": data.developmentStatus,
                "modelId": data.modelId,
                "modelName": data.modelName,
                "modelPrice": data.modelPrice,
                "modelAvailability": data.modelAvailability,
                "modelStatus": data.modelStatus
            });                        
            previousModel = data.modelId; 
        }
    });
    $("#development").val('All').trigger('change.select2'); 
    viewData();
}

function viewData() {
    var developerId = $('#developer').val();
    var stateId = $('#state').val();
    var localityId = $('#locality').val();
    var developmentId = $('#development').val();
    var currentYear = new Date().getFullYear();
    var string = '';
    $('#searchDataContainer').css("display", "block");
    $('#dataContainer').css('max-height', ''); 
    $('#dataContainer').css('overflow-y', '');
    $('#dataContainer').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $('#updateData').attr('Disabled', true);
    $.ajax({
        type: "GET",
        data: {type:"getData", developerId:developerId, stateId:stateId, localityId:localityId, developmentId:developmentId},
        url: "./php/priceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('#updateData').attr('disabled', false);  
                string += '<table class="table table-striped" style="width:100%;">';  //font-size:11px;
                string += '<thead><tr>'; 
                string += '<th>Desarrollador</th>';
                string += '<th>Estado</th>';
                string += '<th>Municipio</th>';
                string += '<th>Desarrollo</th>';
                string += '<th>Modelo</th>';
                string += '<th style="text-align:center;">Precio Actual</th>';
                string += '<th style="text-align:center;">Precio Nuevo</th>';
                string += '<th style="text-align:center;">Disponibilidad Actual</th>';
                string += '<th style="text-align:center;">Disponibilidad Nueva</th>';
                string += '</tr></thead>';       
                $('#dataContainer').css('max-height', '500px'); 
                $('#dataContainer').css('overflow-y', 'scroll');
                $.each(response.data, function(index, data) {
                    string += '<tr>';
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    string += data.developerName;                          
                    string += '</td>';
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    string += data.stateName;              
                    string += '</td>';
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    string += data.localityName;            
                    string += '</td>';        
                    string += '<td style="vertical-align:middle;white-space: nowrap;">';                 
                    if (data.developmentStatus != 1) {                     
                        //string += '<i style="color:#d9534f;cursor:pointer;" id="developmentStatusFor-' + data.modelId + '" class="fa fa-circle activateDevelopment dev-' + data.developmentId + '" data-developmentid="' + data.developmentId + '" data-developmentname="' + data.developmentName + '" data-currentstatus="' + data.developmentStatus + '" data-newstatus="' + data.developmentStatus + '"></i>&nbsp&nbsp';
                        string += data.developmentName;   
                    } else {
                        //string += '<i style="color:#5cb85c;cursor:pointer;" id="developmentStatusFor-' + data.modelId + '" class="fa fa-circle deactivateDevelopment dev-' + data.developmentId + '" data-developmentid="' + data.developmentId + '" data-developmentname="' + data.developmentName + '" data-currentstatus="' + data.developmentStatus + '" data-newstatus="' + data.developmentStatus + '"></i>&nbsp&nbsp';                        
                        string += '<a href="' + data.developmentUrl + '" target="_blank">' + data.developmentName + '</a>'; 
                    }                 
                    string += '</td>';
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    if (data.modelStatus != 1) {                       
                        string += '<i style="color:#d9534f;cursor:pointer;" id="modelStatusFor-' + data.modelId + '" class="fa fa-circle activateModel" data-currentstatus="' + data.modelStatus + '" data-newstatus="' + data.modelStatus + '" data-developmentname="' + data.developmentName + '" data-modelname="' + data.modelName + '"></i>&nbsp&nbsp';
                        string += data.modelName; 
                    } else {
                        string += '<i style="color:#5cb85c;cursor:pointer;" id="modelStatusFor-' + data.modelId + '" class="fa fa-circle deactivateModel" data-currentstatus="' + data.modelStatus + '" data-newstatus="' + data.modelStatus + '"data-developmentname="' + data.developmentName + '" data-modelname="' + data.modelName + '"></i>&nbsp&nbsp';                        
                        string += '<a href="' + data.modelUrl + '" target="_blank">' + data.modelName + '</a>'; 
                    }                                 
                    string += '</td>';        
                    string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">'; 
                    string += moneyFormat(data.modelPrice);              
                    string += '</td>';
                    string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">'; 
                    string += '<input type="text" style="display:inline;width:100px;height:24px" class="form-control input-sm priceInput" name="' + data.modelId + '" data-currentprice="' + data.modelPrice + '" id="newPrice-' + data.modelId + '"data-developmentname="' + data.developmentName + '" data-modelname="' + data.modelName + '">';              
                    string += '</td>';                    
                    string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">'; 
                    string += data.modelAvailability;                    
                    string += '</td>';
                    string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">';  
                    string += '<select style="display:inline;width:64px;height:24px;padding:2px 2px 2px 4px" class="form-control input-sm" id="availabilityYearFor-' + data.modelId + '" data-currentavailability="' + data.modelAvailability + '">';
                    string += '<option value="0">Año</option>';
                    for (x=currentYear-1;x<=currentYear + 2;x++) {
                        string += '<option value="' + x + '">' + x + '</option>'; 
                    }
                    string += '</select> - ';   
                    string += '<select style="display:inline;width:54px;height:24px;padding:2px 2px 2px 4px" class="form-control input-sm" id="availabilityMonthFor-' + data.modelId + '">';
                    string += '<option value="0">Mes</option>';
                    for (x=1;x<=12;x++) {
                        if (x < 10) {
                            y = '0' + x;
                        } else {
                            y = x;
                        }                        
                        string += '<option value="' + x + '">' + getMonth(x) + '</option>'; 
                    }
                    string += '</select>';                    
                    string += '</td>';                    
                    string += '</tr>';
                });
                string += '<table>';
                $('#dataContainer').html(string);
            }
        }
    });  
}

$(document).on("focusout", ".priceInput", function(e) {
    var modelId = $(this).attr('name');
    var modelName = $(this).attr('data-modelname');
    var developmentName = $(this).data('developmentname');
    var currentPrice = $(this).data('currentprice');
    var newPrice = $(this).val();
    if (newPrice != '') {
        newPrice= newPrice.substr(1).replace(/\,/g,'') + '.00';
        var decreaseValue = parseInt(currentPrice) - parseInt(newPrice);
        var changePercent = Math.abs((decreaseValue / parseInt(newPrice)) * 100);
        if (parseInt(newPrice) < minPrice) {
            screenMsg(0, 'priceLimit', modelName, developmentName, null, null);
            $(this).parent().addClass('has-error');
        } else {
            if (changePercent > 10) {
                console.log(changePercent, decreaseValue);
                screenMsg(0, 'pricePercent', modelName, developmentName, changePercent, decreaseValue);
                $(this).parent().removeClass('has-error');
            } else {
                $(this).parent().removeClass('has-error');
            }
        }
    } else {
        return false; 
    }
});

var modelsData = [];
$(document).on("click", "#updateData", function(e) {
    e.preventDefault();
    var currentStatus = 0;
    var newStatus = 0;
    var modelId = 0;
    var currentPrice = 0;
    var newPrice = 0; 
    var currentAvailability = 0;
    var newAvailability = 0;
    var regAmount = /^([0-9]{6,9})+(.00)$/;
    var flag = 0;
    var len = $('.priceInput').length;
    modelsData = [];
    $('#updateData').attr('Disabled', true);
    $('.priceInput').each(function(i, priceInput) {    
        modelId = $(priceInput).attr('name');
        currentStatus = $('#modelStatusFor-' + modelId).attr('data-currentstatus');
        newStatus = $('#modelStatusFor-' + modelId).attr('data-newstatus');
        currentPrice = $('#newPrice-' + modelId).data('currentprice');
        newPrice = $('#newPrice-' + modelId).val();
        if (newPrice == '') { newPrice = currentPrice; } else { newPrice = newPrice.substr(1).replace(/\,/g,'') + '.00'; }
        currentAvailability = $('#availabilityYearFor-' + modelId).attr('data-currentavailability');
        newAvailabilityYear = $('#availabilityYearFor-' + modelId).val();
        newAvailabilityMonth = $('#availabilityMonthFor-' + modelId).val();

        if ((newAvailabilityYear == 0) && newAvailabilityMonth == 0) {
            newAvailabilityYear = $('#availabilityYearFor-' + modelId).parent().removeClass('has-error')
            newAvailability = currentAvailability;
        } else if ((newAvailabilityYear == 0) && newAvailabilityMonth != 0) {
            $('#availabilityYearFor-' + modelId).parent().addClass('has-error')
            newAvailability = 'error';
            flag++;
        } else if ((newAvailabilityYear != 0) && newAvailabilityMonth == 0) {
            $('#availabilityYearFor-' + modelId).parent().addClass('has-error')
            newAvailability = 'error';
            flag++;
        } else {
            $('#availabilityYearFor-' + modelId).parent().removeClass('has-error')
            newAvailability = newAvailabilityYear + '-' + newAvailabilityMonth;
        }

        if (!(regAmount.test(newPrice)) || (parseInt(newPrice) < parseInt(minPrice))) {
            $('#newPrice-' + modelId).parent().addClass('has-error')
            flag++;
        } else {
            $('#newPrice-' + modelId).parent().removeClass('has-error')
        }

        if (!((currentStatus == newStatus) && (currentPrice == newPrice) && (currentAvailability === newAvailability))) {
            modelsData.push({
                'modelId': modelId,
                'currentStatus': currentStatus,
                'newStatus': newStatus,
                'currentPrice': currentPrice,
                'newPrice': newPrice,
                'currentAvailability': currentAvailability,
                'newAvailability': newAvailability
            });
        }
        if (i === (len - 1)) {
            if (flag == 0) {
                if (modelsData.length == 0) {
                    $('#loading').css("display", "none");
                    $('#updateData').attr('Disabled', false);
                    screenMsg(null, 'noData', null, null, null, null);
                } else {
                    var data = JSON.stringify(modelsData);
                    $('#loading').css("display", "inline");
                    $.ajax({
                        type: "GET",              
                        data: {
                            type: "updatePropertyModelData",
                            data: data
                        },
                        url: "./php/priceManagementData.php", 
                        dataType: 'json',
                        success: function(response) {
                            if (response == 'timeout') {
                                window.location.replace("logout.php?var=timeout");
                            } else if (response == 'success') {
                                viewData();
                                getData();
                                $("#developer").val('All').trigger('change.select2');
                                $("#state").val('All').trigger('change.select2');
                                $("#locality").val('All').trigger('change.select2');
                                $("#development").val('All').trigger('change.select2');
                                $('#loading').css("display", "none");
                                $('#updateData').attr('Disabled', false);
                                screenMsg(null, 'success', null, null, null, null);        
                            } else {
                                $('#loading').css("display", "none");
                                $('#updateData').attr('Disabled', false);    
                                screenMsg(null, 'updateError', null, null, null, null);  
                            }                
                        },
                        error: function(response) { 
                            $('#loading').css("display", "none");
                            $('#updateData').attr('Disabled', false);
                            screenMsg(null, 'updateError', null, null, null, null);
                        } 
                    });  
                }
             } else {
                screenMsg(flag, 'saveChangesError', null, null, null, null);
                $('#updateData').attr('Disabled', false);
             }
        }
     });  
});

$(document).on("click", "#viewData", function(e) {
    e.preventDefault();
    viewData()
});

function exportF(elem) {
    var modelDataTemplength = modelDataTemp.length;
    var localDate = new Date().getTime() / 1000;
    var utc = moment.utc(localDate).valueOf();    
    var string = '';
    string += '<table class="table table-striped" style="width:100%;font-size:11px;display:none" id="table">';  
    string += '<thead><tr>'; 
    string += '<th>Id Desarrollador</th>';
    string += '<th>Nombre Desarrollador</th>';
    string += '<th>Status Desarrollador</th>';
    string += '<th>Id Estado</th>';
    string += '<th>Nombre Estado</th>';
    string += '<th>Status Estado</th>';
    string += '<th>Id Municipio</th>';
    string += '<th>Nombre Municipio</th>';
    string += '<th>Status Municipio</th>';
    string += '<th>Id Desarrollo</th>';
    string += '<th>Nombre Desarrollo</th>';
    string += '<th>Status Desarrollo</th>';
    string += '<th>Id Modelo</th>';
    string += '<th>Nombre Modelo</th>';
    string += '<th>Status Modelo</th>';
    string += '<th style="text-align:center;width:120px">Precio</th>';
    string += '<th style="text-align:center;width:120px">Disponibilidad</th>';
    string += '</tr></thead>';
    $.each(modelDataTemp, function(index, data) {
        string += '<tr>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developerId;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developerName;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developerStatus;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.stateId;            
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.stateName;            
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.stateStatus;            
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.localityId;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.localityName;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.localityStatus;              
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developmentId;               
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developmentName;               
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string += data.developmentStatus;               
        string += '</td>';
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string +=  data.modelId;               
        string += '</td>';        
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string +=  data.modelName;               
        string += '</td>';  
        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
        string +=  data.modelStatus;               
        string += '</td>';  
        string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">'; 
        string += moneyFormat(data.modelPrice);              
        string += '</td>';
        string += '<td style="text-align:center;vertical-align:middle;white-space: nowrap;">'; 
        string += data.modelAvailability;              
        string += '</td>';
        string += '</tr>';
        if (index === (modelDataTemplength - 1)) {
            string += '<table>';
            $('#dataContainerExcel').html(string);
            var table = document.getElementById("table");
            var html = table.outerHTML;
            var url = 'data:application/vnd.ms-excel,' + escape(html);
            elem.setAttribute("href", url);
            elem.setAttribute("download", "File_" + utc + ".xls");
            return false;
        }    
    });
}

$(document).on("click", ".deactivateDevelopment", function(e) {
    e.preventDefault();
    var developmentId = $(this).data('developmentid');
    var developmentName = $(this).data('developmentname');
    //$(this).css('color', '#d43f3a');
    $(this).data('currentstatus');
    $(this).data('currentstatus');
    $(".dev-"+developmentId).css('color', '#d43f3a');
    $(".dev-"+developmentId).removeClass('deactivateDevelopment');
    $(".dev-"+developmentId).addClass('activateDevelopment');
    $(".dev-"+developmentId).attr('name', '2')
    jQuery.gritter.add({
        title: 'Desarrollo: ' + developmentName,
        text: 'Está opcion desactivará el Desarrollo después de guardar los cambios.',
        class_name: 'growl-danger',
        sticky: false,
        time: '4000'
    });
    return false;
});

$(document).on("click", ".activateDevelopment", function(e) {
    e.preventDefault();
    var developmentId = $(this).data('developmentid');
    var developmentName = $(this).data('developmentname');
    //$(this).css('color', '#4cae4c');
    $(".dev-"+developmentId).css('color', '#4cae4c');
    $(".dev-"+developmentId).removeClass('activateDevelopment');
    $(".dev-"+developmentId).addClass('deactivateDevelopment');
    $(".dev-"+developmentId).attr('name', '1')    
    jQuery.gritter.add({
        title: 'Desarrollo: ' + developmentName,
        text: 'Está opcion activará el Desarrollo después de guardar los cambios.',
        class_name: 'growl-success',
        sticky: false,
        time: '4000'
    });
    return false;
});

function screenMsg(errors, type, modelName, developmentName, percent, difference) {
    if (type == 'saveChangesError') {
        if (errors == 1) {
            var textTitle = 'Atención!';
            var textMsg = 'Se encontró 1 error, favor de corregirlo e intentarlo nuevamente.<br>El precio debe ser mayor de ' + moneyFormat(minPrice) + '.<br>Para actualizar la disponibilidad debes seleccionar el año y el mes.';
            var time = '8000';
            var className = 'growl-danger';
        } else {
            var textTitle = 'Atención!';
            var textMsg = 'Se encontraron ' + errors + ' errores, favor de corregirlos e intentarlo nuevamente.<br><br>El precio debe ser mayor de ' + moneyFormat(minPrice) + '<br><br>Para actualizar la disponibilidad debes seleccionar el año y el mes.';
            var time = '8000';
            var className = 'growl-danger';
        }   
    } else if (type == 'pricePercent') {
        var textTitle = 'Atención!';
        difference = Math.abs(difference) + '.00';
        console.log(percent, difference);
        var textMsg = 'Por favor verifica el precio del Modelo ' + modelName + ' en el Desarrollo ' + developmentName + ', la diferencia es de ' + moneyFormat(difference) + ' que equivale a más del ' + Math.trunc(percent) + '% del Precio original.';
        var time = '4000';  
        var className = 'growl-warning';
    } else if (type == 'priceLimit') {
        var textTitle = 'Atención!';
        var textMsg = 'Por favor cambia el precio del Modelo ' + modelName + ' en el Desarrollo ' + developmentName + ', no puede ser menor a ' + moneyFormat(minPrice) + '.';
        var time = '4000';  
        var className = 'growl-danger';
    } else if (type == 'updateError') { 
        var textTitle = 'Hubo un error!';
        var textMsg = 'Por favor actualiza la página e intentalo nuevamente';
        var time = '4000';  
        var className = 'growl-danger';  
    } else if (type == 'noData') {
        var textTitle = 'No hubo cambios!';
        var textMsg = 'No has actualizado ningún registro.';
        var time = '4000';  
        var className = 'growl-success';        
    } else if (type == 'success') {
        var textTitle = 'Bien hecho!';
        var textMsg = 'La información fue actualizada con éxito';
        var time = '4000';  
        var className = 'growl-success';   
    } else {
        var textTitle = 'Error!';
        var textMsg = 'Por favor actualiza la página e intentalo nuevamente';
        var time = '4000';  
        var className = 'growl-danger';  
    }
    jQuery.gritter.add({
        title: textTitle,
        text: textMsg,
        class_name: className,
        sticky: false,
        time: time
    });
    return false; 
}

$(document).on("click", ".deactivateModel", function(e) {
    e.preventDefault();
    var currentStatus = $(this).attr('data-currentstatus');
    $(this).css('color', '#d43f3a');
    $(this).removeClass('deactivateModel');
    $(this).addClass('activateModel');
    if (currentStatus == 9) {
        $(this).attr('data-newstatus', '9')
    } else {
        $(this).attr('data-newstatus', '2')
    }
    var modelName = $(this).data('modelname');
    var developmentName = $(this).data('developmentname');
    jQuery.gritter.add({
        title: 'Modelo: ' + modelName +'<br>Desarrollo: ' + developmentName,
        text: 'Está opcion desactivará el Modelo después de guardar los cambios.',
        class_name: 'growl-danger',
        sticky: false,
        time: '4000'
    });
    return false;
});

$(document).on("click", ".activateModel", function(e) {
    e.preventDefault();
    $(this).css('color', '#4cae4c');
    $(this).removeClass('activateModel');
    $(this).addClass('deactivateModel');
    $(this).attr('data-newstatus', '1')
    var modelName = $(this).data('modelname');
    var developmentName = $(this).data('developmentname');
    jQuery.gritter.add({
        title: 'Modelo: ' + modelName +'<br>Desarrollo: ' + developmentName,
        text: 'Está opcion activará el Modelo después de guardar los cambios.',
        class_name: 'growl-success',
        sticky: false,
        time: '4000'
    });
    return false;
});

$(document).on("keyup", ".priceInput", function(e) {
    var numberFormated = moneyFormat($(this).val());
    $(this).val(numberFormated);
});

$(document).on("input", ".priceInput", function(e) {
    var numberFormated = moneyFormat($(this).val());
    $(this).val(numberFormated);
});

function dynamicSort(property) {
    var sortOrder = 1;
    if(property[0] === "-") {
        sortOrder = -1;
        property = property.substr(1);
    }
    return function (a,b) {
        if(sortOrder == -1){
            return b[property].localeCompare(a[property]);
        }else{
            return a[property].localeCompare(b[property]);
        }        
    }
}

function moneyFormat(stringVal) {
	if(stringVal == undefined){return "$0";}
	stringVal = stringVal.indexOf(".") >= 0 ? stringVal.split(".")[0] : stringVal;
	var val = "$" + stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	if (val.length === 1 && val === "$") {
		val = "";
	}
	return val;
}

function getMonth(x) {
    var monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return monthNames[x-1];
} 