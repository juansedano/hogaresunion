$(document).ready(function () {
    getAvailableStates();

    $("#alertModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open")
    }); 
});

function getAvailableStates() {
    var stateOption;
    $.ajax({
        type: "GET",
        data: {type:"getAvailableStates"},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#statesOptions").empty();
            $("#statesOptions").append('<option value="0">Selecciona...</option>');
            $.each(response.state, function(index, state) {
                stateOption = "<option value='" + state.id + "'>" + state.name + "</option>";
                $("#statesOptions").append(stateOption);
            });
        }
    });	
}

function getAvailableLocalities(stateId) {
    var localityOption;
    $.ajax({
        type: "GET",
        data: {type:"getAvailableLocalities",stateId:stateId},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#localitiesOptions").html('');
            localityOption = '<option value="All" selected>Todos</option>';
            $.each(response.locality, function(index, locality) {
                localityOption += "<option value='" + locality.id + "'>" + locality.name + "</option>";
            });
            $("#localitiesOptions").html(localityOption);
            $("#localitiesOptions").prop("disabled", false);
        }
    });	 
}

function getAvailablePropertyTypes(stateId, localityId) {
    var propertyTypeOption;
    $.ajax({
        type: "GET",
        data: {type:"getAvailablePropertyTypes",stateId:stateId,localityId:localityId},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#propertyTypeOption").html('');
            propertyTypeOption = '<option value="0">Todos</option>';
            $.each(response.propertyType, function(index, propertyType) {
                propertyTypeOption += "<option value='" + propertyType.id + "'>" + propertyType.name + "</option>";
            });
            $("#typeOptions").html(propertyTypeOption);
            $("#typeOptions").prop("disabled", false);
        }
    });	
}

function getAvailableRooms(stateId, localityId, propertyType) {
    var roomsOption;
    $.ajax({
        type: "GET",
        data: {type:"getAvailableRooms",stateId:stateId,localityId:localityId,propertyType:propertyType},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#roomsOptions").html('');
            //roomsOption = '<option value="All">Todos</option>';
            $.each(response.rooms, function(index, rooms) {
                roomsOption += "<option value='" + rooms.number + "'>" + rooms.number + "</option>";
            });
            $("#roomsOptions").html(roomsOption);
            $("#roomsOptions").prop("disabled", false);         
        }
    });	
}

function getAvailableBaths(stateId, localityId, propertyType) {
    var bathsOption;
    $.ajax({
        type: "GET",
        data: {type:"getAvailableBaths",stateId:stateId,localityId:localityId,propertyType:propertyType},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#bathsOptions").html('');
            //bathsOption = '<option value="All">Todos</option>';
            $.each(response.baths, function(index, baths) {
                bathsOption += "<option value='" + baths.number + "'>" + baths.number + "</option>";
            });
            $("#bathsOptions").html(bathsOption);
            $("#bathsOptions").prop("disabled", false);         
        }
    });	
}

function getAdditionalFeature(stateId, localityId, propertyType) {
    var bathsOption;
    $.ajax({
        type: "GET",
        data: {type:"getAdditionalFeature",stateId:stateId,localityId:localityId,propertyType:propertyType},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $("#minPrice").val(response.additionalFeature[0].minPrice);
            $("#minPrice").attr('name', response.additionalFeature[0].minPrice);
            $("#minPrice").prop("readonly", false);  
            $("#maxPrice").val(response.additionalFeature[0].maxPrice);
            $("#maxPrice").attr('name', response.additionalFeature[0].maxPrice);
            $("#maxPrice").prop("readonly", false);  
            $("#minArea").val(response.additionalFeature[0].minArea);
            $("#minArea").attr('name', response.additionalFeature[0].minArea);
            $("#minArea").prop("readonly", false);  
            $("#maxArea").val(response.additionalFeature[0].maxArea);
            $("#maxArea").attr('name', response.additionalFeature[0].maxArea);
            $("#maxArea").prop("readonly", false);         
        }
    });	
}

$("#statesOptions").change(function() {
    $('#stateURL').html('');
    $('#localityURL').html('');
    $('#mainURL').html('');
    $('#developmentsNumber').html('<span>Desarrollos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');
    $('#modelsNumber').html('<span>Modelos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');      
    var stateId = $(this).val();
    if (stateId != '0') {
        $('#urlLoader').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:30px;"></img>');
        $.get(getAvailableLocalities(stateId)).done(function() {
            $.get(getAvailablePropertyTypes(stateId, null)).done(function() {
                $.get(getAvailableRooms(stateId, null, null)).done(function() {
                    $.get(getAvailableBaths(stateId, null, null)).done(function() {
                        $.get(getAdditionalFeature(stateId, null, null)).done(function() {
                            $.get(getNumberOfDevelopments(stateId, null, null)).done(function() {
                                $.get(getNumberOfPropertyModels(stateId, null, null)).done(function() {
                                    $('#urlContainer').css('display', 'block');
                                    $('#urlLoader').html('');
                                    urlCreation();
                                });
                            });
                        });
                    });
                });
            });
        });
    } else {
        $('#mainURL').html('');
        $('#urlContainer').css('display', 'none');
        $("#localitiesOptions").prop("disabled", true);
        $("#localitiesOptions").html('<option value="0">...</option>');
        $("#typeOptions").prop("disabled", true);
        $("#typeOptions").html('<option value="0">...</option>');
        $("#roomsOptions").prop("disabled", true);
        $("#roomsOptions").html('<option value="0">...</option>');
        $("#bathsOptions").prop("disabled", true);
        $("#bathsOptions").html('<option value="0">...</option>');
        $("#minPrice").val('...');
        $("#minPrice").prop("readonly", true);
        $("#maxPrice").val('...');
        $("#maxPrice").prop("readonly", true);
        $("#minArea").val('...');
        $("#minArea").prop("readonly", true);
        $("#maxArea").val('...');
        $("#maxArea").prop("readonly", true);
    }
});

$("#localitiesOptions").change(function() {
    var localityId = $(this).val();
    var stateId = $("#statesOptions").val();
    $('#localityURL').html('');
    $('#mainURL').html('');
    $('#developmentsNumber').html('<span>Desarrollos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');
    $('#modelsNumber').html('<span>Modelos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');    
    if (localityId == 'All') {
        localityId = null;
    }
    if (localityId != '0') {
        $('#urlLoader').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:30px;"></img>');
        $.get(getAvailablePropertyTypes(stateId, localityId)).done(function() {
            $.get(getAvailableRooms(stateId, localityId, null)).done(function() {
                $.get(getAvailableBaths(stateId, localityId, null)).done(function() {
                    $.get(getAdditionalFeature(stateId, localityId, null)).done(function() {
                        $.get(getNumberOfDevelopments(stateId, localityId, null)).done(function() {
                            $.get(getNumberOfPropertyModels(stateId, localityId, null)).done(function() {
                                $('#mainURL').html('');
                                $('#urlLoader').html('');
                                urlCreation();
                            });
                        });
                    });
                });
            });
        });
    } 
});

$("#typeOptions").change(function() {
    var propertyType = $(this).val();
    var stateId = $("#statesOptions").val();
    var localityId = $("#localitiesOptions").val();
    $('#mainURL').html('');
    $('#developmentsNumber').html('<span>Desarrollos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');
    $('#modelsNumber').html('<span>Modelos: <img src="images/loading.gif" style="margin-top: -2px; width:12px;"></img></span>');  
    if (localityId == 'All') {
        localityId = null;
    }   
    if (propertyType == 0) {
        propertyType = null;
    }  
    if (localityId != '0') {
        $('#urlLoader').html('<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:30px;"></img>');
        $.get(getAvailableRooms(stateId, localityId, propertyType)).done(function() {
            $.get(getAvailableBaths(stateId, localityId, propertyType)).done(function() {
                $.get(getAdditionalFeature(stateId, localityId, propertyType)).done(function() {
                    $.get(getNumberOfDevelopments(stateId, localityId, propertyType)).done(function() {
                        $.get(getNumberOfPropertyModels(stateId, localityId, propertyType)).done(function() {
                            $('#urlLoader').html('');
                            urlCreation();
                        });
                    });
                });
            });
        });
    }
});

$("#roomsOptions").change(function() {
    urlCreation();
});

$("#bathsOptions").change(function() {
    urlCreation();
});

$("#minPrice").keyup(function() {
    var validNumber = new RegExp(/^\d*\.?\d*$/);
    var minPriceInitial = $(this).attr('name');
    var minPrice = $(this).val();
    if (validNumber.test(minPrice)) {
        $("#minPrice").attr('name', minPrice);
        if (minPriceInitial != minPrice) {
            urlCreation();
        }
    } else {
        $("#minPrice").val(minPriceInitial);
    }
});

$("#maxPrice").keyup(function() {
    var validNumber = new RegExp(/^\d*\.?\d*$/);
    var maxPriceInitial = $(this).attr('name');
    var maxPrice = $(this).val();
    if (validNumber.test(maxPrice)) {
        $("#maxPrice").attr('name', maxPrice);
        if (maxPriceInitial != maxPrice) {
            urlCreation();
        }
    } else {
        $("#maxPrice").val(maxPriceInitial);
    }
});

$("#minArea").keyup(function() {
    var validNumber = new RegExp(/^\d*\.?\d*$/);
    var minAreaInitial = $(this).attr('name');
    var minArea = $(this).val();
    if (validNumber.test(minArea)) {
        $("#minArea").attr('name', minArea);
        if (minAreaInitial != minArea) {
            urlCreation();
        }
    } else {
        $("#minArea").val(minAreaInitial);
    }
});

$("#maxArea").keyup(function() {
    var validNumber = new RegExp(/^\d*\.?\d*$/);
    var maxAreaInitial = $(this).attr('name');
    var maxArea = $(this).val();
    if (validNumber.test(maxArea)) {
        $("#maxArea").attr('name', maxArea);
        if (maxAreaInitial != maxArea) {
            urlCreation();
        }
    } else {
        $("#maxArea").val(maxAreaInitial);
    }
});


function getNumberOfDevelopments(stateId, localityId, propertyType) {
    $.ajax({
        type: "GET",
        data: {type:"getNumberOfDevelopments",stateId:stateId,localityId:localityId,propertyType:propertyType},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {   
            $('#developmentsNumber').html('Desarrollos: ' + response.developments[0].number);   
        }
    });	
}

function getNumberOfPropertyModels(stateId, localityId, propertyType) {
    $.ajax({
        type: "GET",
        data: {type:"getNumberOfPropertyModels",stateId:stateId,localityId:localityId,propertyType:propertyType},
        url: "./php/toolsData.php", 
        dataType: 'json',
        success: function(response) {
            $('#modelsNumber').html('Modelos: ' + response.models[0].number);      
        }
    });	
}

function urlCreation() {
    var url;
    var stateId = $("#statesOptions").val();
    var localityId = $("#localitiesOptions").val();
    var tyim = $("#typeOptions").val();
    var bdmn = $("#roomsOptions").val();
    var btmn = $("#bathsOptions").val();
    var pcmn = Math.trunc($("#minPrice").val());
    var pcmx = Math.trunc($("#maxPrice").val());
    var mcmn = Math.trunc($("#minArea").val());
    var mcmx = Math.trunc($("#maxArea").val());
    if (localityId != "All") {
        $('#localityURL').html('<p style="display:inline;cursor:pointer;"><a style="margin-top:8px;" href="https://tratodirecto.com/?municipio=' + localityId + '" target="_blank" id="urlLocalityTxt">https://tratodirecto.com/?municipio=' + localityId + '</a></p>&nbsp;&nbsp;&nbsp;<div style="display: inline;"><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="urlLocalityTxt">Copiar URL</button></div>');
        var i = localityId;
        var is = 0;
    } else {
        var i = stateId;
        var is = 1;
    }
    url = 'https://tratodirecto.com/resultado.html?i='+i+'&is='+is+'&shurl=1&tyim='+tyim+'&bdmn='+bdmn+'&btmn='+btmn+'&pcmn='+pcmn+'&pcmx='+pcmx+'&mcmn='+mcmn+'&mcmx='+mcmx;
    shortUrl = 'https://tratodirecto.com/resultado.html?i='+i+'&is='+is;
    console.log(url);
    $('#stateURL').html('<p style="display:inline;cursor:pointer;"><a style="margin-top:8px;" href="https://tratodirecto.com/?estado=' + stateId + '" target="_blank"  id="urlStateTxt">https://tratodirecto.com/?estado=' + stateId + '</a></p>&nbsp;&nbsp;&nbsp;<div style="display: inline;"><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="urlStateTxt">Copiar URL</button></div>');
    $('#mainURL').html('<p style="display:inline;cursor:pointer;"><a href="'+url+'" target="_blank" id="urlMainTxt">'+url+'</a></p>&nbsp;&nbsp;&nbsp;<div style="display: inline;"><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="urlMainTxt">Copiar URL</button></div>');
    $('#shortURL').html('<p style="display:inline;cursor:pointer;"><a href="'+shortUrl+'" target="_blank" id="urlShortTxt">'+shortUrl+'</a></p>&nbsp;&nbsp;&nbsp;<div style="display: inline;"><button class="btn btn-primary copyURL" style="font-size:12px;height:18px;padding:0px 4px;background-color:#FFB71B;color:#FFFFFF;margin-top:-2px;" name="urlShortTxt">Copiar URL</button></div>');
}

$(document).on("click", ".copyURL", function(e) {
    e.preventDefault();
    var textArea = document.createElement('textarea');
    var URLType = $(this).attr('name');
    var url = $('#' + URLType).html();
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

function formatoMoneda(stringVal) {
	if(stringVal == undefined){return "$0";}
	stringVal = stringVal.indexOf(".") >= 0 ? stringVal.split(".")[0] : stringVal;
	var val = "$" + stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	if (val.length === 1 && val === "$") {
		val = "";
	}
	return val;
}