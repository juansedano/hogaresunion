//v=01 05/11/2019
$(document).ready(function () {
    getData();
    getSignboard();
    getPinMessage();
    CKEDITOR.replace( 'decription' ,{
        height  : 300,
        bodyClass : 'contents',
        // readOnly : true
    });
    edit= CKEDITOR.instances.decription;
});
var currentFlag=[];
var Flag = [];
var minPrice = 0;
function getPinMessage() {
    $.ajax({
        type: "GET",
        data: {type:"getPinMessage"},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                Flag = response;
            }
        }
    });
}

function getSignboard() {
    $.ajax({
        type: "GET",
        data: {type:"getSignboard"},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                response.forEach(signboard => {
                    $("#signboards").append('<option value="'+ signboard.Id +'">'+ signboard.Text +'</option>');
                });
            }
        }
    });
}

function getDevelopments() {
    $.ajax({
        type: "GET",
        data: {type:"getDevelopments"},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                $("#development").empty();
                $("#development").append("<option value='All'>Todos</option>");
                response.forEach(element => {
                    string = "<option value='" + element.developmentId + "'>" + `${element.developmentName} - ${element.developer} - ${element.state}` + "</option>";
                    $("#development").append(string);
                });
                $("#development").val('All').trigger('change.select2');
                $("#development").attr("disabled", false);
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
        url: "./php/promotionManagementData.php",
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
                    // $("#development").attr("disabled", false);
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
                        getDevelopments();
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
    $("#development").val('All').trigger('change.select2');
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
    $("#development").val('All').trigger('change.select2');
});

$(document).on("change", "#locality", function(e) {
    e.preventDefault();
    var localityId = $(this).val();
    var previousDevelopment = 0;
    developmentDataTemp = [];
    localityDataLenght = localityDataTemp.length;
    localityDataTemp.sort(dynamicSort("developmentName"));
    if (localityId == 'All') {
        $.each(localityDataTemp, function(index, data) {

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
                    // $("#development").append(string);
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
    // $("#development").empty();
    // $("#development").append("<option value='All'>Todos</option>");
    $.each(localityDataTemp, function(index, data) {
        if (previousDevelopment != data.developmentId) {
            string = "<option value='" + data.developmentId + "'>" + data.developmentName + "</option>";
            // $("#development").append(string);
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
    // $("#development").val('All').trigger('change.select2');
    viewData();
}

function viewData() {
    var developerId = "";
    var stateId = "";
    var localityId = "";
    var developmentId = $("#development").val();
    if (developmentId==="All") {
        developerId = $('#developer').val();
        stateId = $('#state').val();
        localityId = $('#locality').val();
    } else {
        developerId = "All";
        stateId = "All";
        localityId = "All";
    }
    var currentYear = new Date().getFullYear();
    var string = '';
    $('#searchDataContainer').css("display", "block");
    $('#dataContainer').css('max-height', '');
    $('#dataContainer').css('overflow-y', '');
    $('#dataContainer').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;" id="imgLoad">'+
    '<table class="table table-striped" style="width:100%;display:none;" id="result"></table>');
    $('#updateData').attr('Disabled', true);
    var time = new Date();
    time = Date.UTC(time.getFullYear(), time.getMonth(), time.getDate(), 23, 59, 59)/1000;
    $.ajax({
        type: "GET",
        data: {type:"getSignboardCount", developerId:developerId, stateId:stateId, localityId:localityId, developmentId:developmentId, time: time},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                // currentFlag=[];
                // $('#updateData').attr('disabled', false);    //font-size:11px;
                string = '<thead><tr>';
                string += '<th>Desarrollo</th>';
                string += '<th>Modelo</th>';
                // string += '<th>Cintillo</th>';
                string += '<th>Vigentes</th>';
                string += '<th>Vencidas</th>';
                string += '<th>Acciones</th>';
                string += '</tr></thead>';
                $("#result").append(string);
                $('#dataContainer').css('max-height', '500px');
                $('#dataContainer').css('overflow-y', 'scroll');
                $("#updateData").attr("disabled", true);
                var currentHd = response[0].idDevelopment-1;
                response.forEach(element => {
                    // var optionsDevelopment = "<option value='' selected>Ninguna</option>";
                    // var optionsModel = "<option value='' selected>Ninguna</option>";
                    // Flag.forEach(elem => {
                    //     if (elem.id==element.flagModel) {
                    //         optionsModel+="<option value='"+ elem.id +"' selected>"+ elem.text +"</option>";
                    //     } else {
                    //         optionsModel+="<option value='"+ elem.id +"'>"+ elem.text +"</option>";
                    //     }
                    // });
                    if (currentHd==element.idDevelopment) {
                        $("#result").append(
                            "<tr>"+
                                "<td></td>"+
                                "<td>"+ element.nameModel +"</td>"+
                                // "<td>"+
                                //     "<select id='' class='input-sm selectFlag' name='mod-"+ element.idModel +"'>"+
                                //         optionsModel+
                                //     "</select>"+
                                // "</td>"+
                                "<td>"+ element.modelValid +"</td>"+
                                "<td>"+ element.modelInvalid +"</td>"+
                                "<td><button class='btn btn-primary openModal promotion' style='background-color:#FFB71B; padding:5px;' name='pm-"+ element.idModel +"'>Administrar</button></td>"+
                            "</tr>"
                        );
                        // currentFlag.push(element.flagModel);
                    } else {
                        // Flag.forEach(elem => {
                        //     if (parseInt(elem.id)==parseInt(element.flagDevelopment)) {
                        //         optionsDevelopment+="<option value='"+ elem.id +"' selected>"+ elem.text +"</option>";
                        //     } else {
                        //         optionsDevelopment+="<option value='"+ elem.id +"'>"+ elem.text +"</option>";
                        //     }
                        // });
                        currentHd=element.idDevelopment;
                        $("#result").append(
                            "<tr>"+
                                "<td>"+ element.nameDevelopment +"</td>"+
                                "<td></td>"+
                                // "<td>"+
                                //     "<select id='' class='input-sm selectFlag' name='des-"+ element.idDevelopment +"'>"+
                                //         optionsDevelopment+
                                //     "</select>"+
                                // "</td>"+
                                "<td>"+ element.housingdevelopmentValid +"</td>"+
                                "<td>"+ element.housingdevelopmentInvalid +"</td>"+
                                "<td><button class='btn btn-primary openModal promotion' style='background-color:#FFB71B; padding:5px;' name='hd-"+ element.idDevelopment +"'>Administrar</button></td>"+
                            "</tr>"
                        );
                        $("#result").append(
                            "<tr>"+
                                "<td></td>"+
                                "<td>"+ element.nameModel +"</td>"+
                                // "<td>"+
                                //     "<select id='' class='input-sm selectFlag' name='mod-"+ element.idModel+"'>"+
                                //         optionsModel+
                                //     "</select>"+
                                // "</td>"+
                                "<td>"+ element.modelValid +"</td>"+
                                "<td>"+ element.modelInvalid +"</td>"+
                                "<td><button class='btn btn-primary openModal promotion' style='background-color:#FFB71B; padding:5px;' name='pm-"+ element.idModel +"'>Administrar</button></td>"+
                            "</tr>"
                        );
                        // currentFlag.push(element.flagDevelopment);
                        // currentFlag.push(element.flagModel);
                    }

                });
                $('#imgLoad').remove();
                $("#result").show();
            }
        }
    });
}


var modelsData = [];
$(document).on("click", "#updateData", function(e) {
    e.preventDefault();
    var cont = 0;
    var ids = [];
    var type = [];
    var flags = [];
    $.each($(".selectFlag"), function () {
        var curr = currentFlag[cont] == undefined ? "" : currentFlag[cont];
        if ($(this).val()!=curr){//currentFlag[cont]) {
            var val = $(this).attr("name").split("-");
            ids.push(val[1]);
            type.push(val[0]);
            flags.push($(this).val());
        }
        cont++;

    });

    $.ajax({
        type: "GET",
        data: {type:"updateFlags", ids:ids, flags:flags, types:type},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify('growl-success', 'Cintillos actualizados', 'Se han actualizado los cintillos correctamente');
                } else {
                    notify('growl-danger', 'Cintillos no actualizados', 'No se han actualizado los cintillos correctamente');
                }
            }
        }
    });
});

$(document).on("change", ".selectFlag", function (e) {
    e.preventDefault();
    $("#updateData").attr("disabled", false);
});

$(document).on("click", "#viewData", function(e) {
    e.preventDefault();
    viewData();
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
    };
}

$(document).on("click", ".promotion", function (e) {
    e.preventDefault();
    var data = $(this).attr("name");
    var typeP =  data.split("-")[0];
    var id = data.split("-")[1];
    $("#prom").attr("name", data);
    $("#resultPromo").html('');
    $("#fnewPromo").hide();
    $("#addPromo").show();
    $("#resultPromo").hide();
    $("#loading2").show();
    $("#openPromotionModal").click();
    $.ajax({
        type: "GET",
        data: {type:"getPromos", id:id, typeP:typeP},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.length>0) {
                    $("#resultPromo").append(
                        "<table id='promoHd1' class='table table-striped'>"+
                            "<thead>"+
                                "<tr>"+
                                    "<th>Cintillo</th>"+
                                    "<th>Descripción</th>"+
                                    "<th>Fecha inicio</th>"+
                                    "<th>Fecha fin</th>"+
                                    "<th>Estado</th>"+
                                    "<th>Acciones</th>"+
                                "</tr>"+
                            "</thead>"+
                            "<tbody id='promoHdAvalible'></tbody>"+
                        "</table>"
                    );
                    $("#resultPromo").append(
                        "<table id='promoHd2' class='table table-striped' style='display: none'>"+
                            "<thead>"+
                                "<tr>"+
                                    "<th>Cintillo</th>"+
                                    "<th>Descripción</th>"+
                                    "<th>Fecha inicio</th>"+
                                    "<th>Fecha fin</th>"+
                                    "<th>Estado</th>"+
                                    "<th>Acciones</th>"+
                                "</tr>"+
                            "</thead>"+
                            "<tbody id='promoHdUnavalible'></tbody>"+
                        "</table>"
                    );
                    response.forEach(element => {
                        var today=new Date();
                        today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),0,0,0 )/1000;
                        var estado = ((parseInt(element.iniPromotion)-today)>0) ? "Proximo":"Activo";
                        var start=new Date(parseInt(element.iniPromotion)*1000);
                        var end=new Date(parseInt(element.endPromotion)*1000);
                        if ((parseInt(element.endPromotion)-today)>0) {
                            $("#promoHdAvalible").append(
                                "<tr id='promo"+ element.idPromotion +"'>"+
                                    "<td id='nameP"+ element.idPromotion +"' name="+element.idSignboard+">"+ element.nameSignboard +"</td>"+
                                    "<td style='max-width: 360px;'><div class='descProm' id='descP"+ element.idPromotion +"' >"+ element.descPromotion +"</div></td>"+
                                    "<td id='startP"+ element.idPromotion +"' >"+ start.getDate()+"/"+ (start.getMonth()+1)+"/"+ start.getFullYear() +"</td>"+
                                    "<td id='endP"+ element.idPromotion +"' >"+ end.getDate()+"/"+ (end.getMonth()+1)+"/"+ end.getFullYear() +"</td>"+
                                    "<td>"+ estado +"</td>"+
                                    "<td>"+
                                        '<button type="button" class="btn btn-sm btn-normal editPromotion" name="'+ element.idPromotion +'" id="edit'+ element.idPromotion +'" style="margin-right: 5px;"><i class="glyphicon glyphicon-edit" style="color:#ffffff;position: relative;"></i></button>'+
                                        '<button type="button" class="btn btn-sm btn-cancel deletePromotion" name="'+ element.idPromotion +'" id="delete'+ element.idPromotion +'" style="display: inline-block;"><i class="glyphicon glyphicon-minus" style="color:#ffffff;position: relative;"></i></button>'+
                                    "</td>"+
                                "</tr>"
                            );
                        } else {
                            estado = "Vencida";
                            $("#promoHdUnavalible").append(
                                "<tr id='promo"+ element.idPromotion +"'>"+
                                    "<td id='nameP"+ element.idPromotion +"' name="+element.idSignboard+">"+ element.namePromotion +"</td>"+
                                    "<td style='max-width: 360px;'><div class='descProm' id='descP"+ element.idPromotion +"' >"+ element.descPromotion +"</div></td>"+
                                    "<td id='startP"+ element.idPromotion +"' >"+ start.getDate()+"/"+ (start.getMonth()+1)+"/"+ start.getFullYear() +"</td>"+
                                    "<td id='endP"+ element.idPromotion +"' >"+ end.getDate()+"/"+ (end.getMonth()+1)+"/"+ end.getFullYear() +"</td>"+
                                    "<td>"+ estado +"</td>"+
                                    "<td>"+
                                        '<button type="button" class="btn btn-sm btn-normal editPromotion" name="'+ element.idPromotion +'" id="edit'+ element.idPromotion +'" style="margin-right: 5px;"><i class="glyphicon glyphicon-edit" style="color:#ffffff;position: relative;"></i></button>'+
                                        '<button type="button" class="btn btn-sm btn-cancel deletePromotion" name="'+ element.idPromotion +'" id="delete'+ element.idPromotion +'" style="display: inline-block;"><i class="glyphicon glyphicon-minus" style="color:#ffffff;position: relative;"></i></button>'+
                                    "</td>"+
                                "</tr>"
                            );
                        }
                    });
                    $("input[name='radio' ][value='1']").prop("disabled", false);
                    $("input[name='radio' ][value='0']").prop("disabled", false);
                } else {
                    $("#resultPromo").append("<h4 style='color:#FFB71B'>Sin promociones</h4");
                    $("input[name='radio' ][value='1']").prop("disabled", true);
                    $("input[name='radio' ][value='0']").prop("disabled", true);
                }
            }
            $("#radioSuccess").prop("checked", true);
            $("#resultPromo").show();
            $("#selectorType").show();
            $("#loading2").hide();
            // $("#openPromotionModal").click();
        }
    });
});

$(document).on("change", "input[name='radio']", function name(params) {
    option = $("input[name='radio']:checked").val();
    if (option == 1) {
        $("#promoHd2").hide();
        $("#promoHd1").show();
    } else {
        $("#promoHd2").show();
        $("#promoHd1").hide();
    }

});

$(document).on("click", "#addPromo", function (e) {
    e.preventDefault();
    $(this).hide();
    $("#prom").show();
    $("#resultPromo").hide();
    $("#selectorType").hide();
    $("#actProm").hide();
    $("#fnewPromo").show();
    $("#titulo").val('');
    $('#signboards').select2('data', {id: 0, text: 'Selecciona un Cintillo'}); 
    // $("#decription").val('');
    edit.setData('');
    $("#date1").val('');
    $("#date2").val('');
});

$(document).on("click", "#cancelProm", function (e) {
    e.preventDefault();
    $("#addPromo").show();
    $("#resultPromo").show();
    $("#selectorType").show();
    $("#actProm").hide();
    $("#fnewPromo").hide();
});

$(document).on("click", "#prom", function (e) {
    e.preventDefault();
    var data = $(this).attr("name");
    var id = data.split("-")[1];
    var typeP = data.split("-")[0];
    var idSignboard = $("#signboards").val();
    // var title = $("#titulo").val();
    // var description = $("#decription").val();
    var description = edit.getData();
    var start = $("#date1").val().split("/");
    var end = $("#date2").val().split("/");
    var today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),0,0,0 )/1000;

    if (idSignboard != 0 && description!="" && start!="" && end!="") {
        start=((Date.UTC(parseInt(start[2]), (parseInt(start[1])-1), (parseInt(start[0])+1), 0, 0, 0))/1000);
        end=((Date.UTC(parseInt(end[2]), (parseInt(end[1])-1), (parseInt(end[0])+1), 0, 0, 0))/1000);
        $.ajax({
            type: "GET",
            data: {type:"addPromos", id:id, typeP:typeP, idSignboard:idSignboard, description:description, start:start, end:end, today:today},
            url: "./php/promotionManagementData.php",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response) {
                        $('#signboards').select2('data', {id: 0, text: 'Selecciona un Cintillo'}); 
                        $("#decription").val("");
                        $("#date1").val("");
                        $("#date2").val("");
                        $("#addPromo").show();
                        $("#fnewPromo").hide();
                        notify('growl-success', 'Promoción agregada', 'Se han agregado correctamente la promoción');
                        $("#openPromotionModal").click();
                        $("#development").change();
                    } else {
                        notify('growl-danger', 'Promoción no agregada', 'No se han agregado correctamente la promoción');

                    }
                }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                notify('growl-danger', 'Promoción no agregada', xhr.responseText);
            }
        });
    } else {
        notify('growl-danger', 'Datos incompletos', 'Es necesario que llenes todos los campos');
    }

});

$(document).on("click", ".deletePromotion", function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    console.log(id);
    $.ajax({
        type: "GET",
        data: {type:"deletePromotion", id:id},
        url: "./php/promotionManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify('growl-success', 'Promoción eliminado', 'Se han eliminado correctamente la promoción');
                    $("#promo"+id).remove();
                } else {
                    notify('growl-danger', 'Promoción no eliminado', 'No se han eliminado correctamente la promoción');
                }
            }
        },
        error: function(xhr, status, error) {
            console.log(xhr.responseText);

        }
    });
});

$(document).on("click", ".editPromotion", function (e) {
    e.preventDefault();
    $("#resultPromo").hide();
    $("#selectorType").hide();
    var id = $(this).attr("name");
    $('#signboards').select2('data', {id:$("#nameP"+id).attr("name") ,text: $("#nameP"+id).text()}); 
    // $("#titulo").val($("#nameP"+id).text());
    // $("#decription").val($("#descP"+id).text());
    // console.log($("#descP"+id).text());
    // console.log($("#descP"+id).html());

    edit.setData($("#descP"+id).html());
    $("#date1").val($("#startP"+id).text());
    $("#date2").val($("#endP"+id).text());
    $("#actProm").attr("name", id);
    $("#addPromo").hide();
    $("#prom").hide();
    $("#actProm").show();
    $("#fnewPromo").show();
});

$(document).on("click", "#actProm", function (e) {
    e.preventDefault();
    var idPromo = $(this).attr("name");
    console.log(idPromo);

    // var title = $("#titulo").val();
    // var description = $("#decription").val();
    var signboard = $("#signboards").val();
    var description = edit.getData();
    var start = $("#date1").val().split("/");
    var end = $("#date2").val().split("/");

    if (signboard!=0 && description!=""&&start!=""&&end!="") {
        start=((Date.UTC(parseInt(start[2]), (parseInt(start[1])-1), (parseInt(start[0])+1), 0, 0, 0))/1000);
        end=((Date.UTC(parseInt(end[2]), (parseInt(end[1])-1), (parseInt(end[0])+1), 0, 0, 0))/1000);
        $.ajax({
            type: "GET",
            data: {type:"updatePromo", id:idPromo, signboard:signboard, description:description, start:start, end:end},
            url: "./php/promotionManagementData.php",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response) {
                        $("#titulo").val("");
                        $("#decription").val("");
                        $("#date1").val("");
                        $("#date2").val("");
                        $("#addPromo").show();
                        $("#fnewPromo").hide();
                        $("#closei").click();
                        notify('growl-success', 'Promoción agregada', 'Se han agregado correctamente la promoción');
                        $("#development").change();
                    } else {
                        notify('growl-danger', 'Promoción no agregada', 'No se han agregado correctamente la promoción');
                    }
                }
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                notify('growl-danger', 'Promoción no agregada', xhr.responseText);
            }
        });
    } else {
        notify('growl-danger', 'Datos incompletos', 'Es necesario que llenes todos los campos');
    }

});

$(document).on("change", "#development", function (e) {
    e.preventDefault();
    viewData();
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