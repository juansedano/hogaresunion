$(document).ready(function () {
    getStoredStates();

    $(function() {
        var availableFeatures = returnAllFeatures();
        $("#autocompleteTest").autocomplete({
            minLength:2,   
            delay:500,   
            source: availableFeatures
        });
    });

    getStoredStatesNum();

    getRecords('null', 'null', 'null', 'null', 'null', 'null', 'null');
});

$('#addFeature').on('click', function(e) {
    e.preventDefault();
    newFeature = $("#autocompleteTest").val();
    if (newFeature != '') {
        $("#autocompleteTest").val('');
        $('#featuresContainer').append('<label class="label-filter" value="' + newFeature + '" class="featureElement">' + newFeature + '<a href="#" class="closeFeature"><i class="glyphicon glyphicon-remove" style="padding-top:2px; padding-left:6px; color: #fff;"></i></a></label>');
    } 
});

$(document).on('click', '.closeFeature', function(e) {
    e.preventDefault();
    $(this).parent().remove();
});

$('#searchOptions').on('click', function(e) {
    var flag = $('.featureElement').length;
    var featureElement = $('.featureElement');
    if (flag == 0) {
        console.log('Ninguno');  
    } else if (flag == 1) {
        console.log($('.featureElement').attr('value'));  
    } else {
        $('.featureElement').each(function(i, feature) {
            console.log($(feature).attr('value'));
         });
    }   
});

$('#surveyStoredStates').on('change', function(e) {
    e.preventDefault();
    stateId = $('#surveyStoredStates').val();
    if ($('#surveyStoredLocations').is(':disabled')) {
        $('#surveyStoredLocations').prop('disabled', false);
    }
    $("#surveyStoredLocations").select2('data', {id: '0', text: 'Selecciona el Municipio o Delegación...'});
    getStoredLocations(stateId);
});

function getStoredStates() {
    $.ajax({
        type: "GET",
        data: {type:"getStoredStates"},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            $.each(response.states, function(index, states) {
                string = "<option value='" + states.id + "'>" + states.name + "</option>";
                $("#surveyStoredStates").append(string);
            });
        }
    });	
}

function getStoredLocations(stateId) {
    $.ajax({
        type: "GET",
        data: {type:"getStoredLocByState", stateId:stateId},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            $('#surveyStoredLocations').empty();
            $.each(response.locations, function(index, locations) {
                string = "<option value='" + locations.id + "'>" + locations.name + "</option>";
                $("#surveyStoredLocations").append(string);
            });
        }
    });	
}

function returnAllFeatures() {
    var featuresArray = new Array();
    $.ajax({
        type: "GET",
        data: {type:"getFeatures"},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            $.each(response.features, function(index, features) {
                featuresArray.push(features.name);
            });
        }
    });	
    return featuresArray;
}
//New Options
function getStoredStatesNum() {
    $.ajax({
        type: "GET",
        data: {type:"getStoredStatesNum"},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            $.each(response.states, function(index, states) {
                string = '<div><a href="#" value="' + states.id + '" id="addStateResult">'+ states.name +' </a><label style="font-size:10px; font-weight: bold; margin-bottom:12px;padding:2px 6px; color:#ffffff; background-color: #428bca;border-radius: 16px;">'+ states.qty +'</label></div>';
                $("#surveyStoredStatesNum").append(string);
            });
        }
    });	
}

function getStoredLocationsNum(stateId) {
    $.ajax({
        type: "GET",
        data: {type:"getStoredLocByStateNum", stateId:stateId},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            $("#surveyStoredLocalitiesNum").empty();
            $.each(response.localities, function(index, localities) {
                string = '<div><a href="#" value="' + localities.id + '" id="addLocalityResult">'+ localities.name +' </a><label style="font-size:10px; font-weight: bold; margin-bottom:12px;padding:2px 6px; color:#ffffff; background-color: #428bca;border-radius: 16px;">'+ localities.qty +'</label></div>';
                $("#surveyStoredLocalitiesNum").append(string);
            });
        }
    });	
}

function getFilters() {
    window.scrollTo(0, 0);

    if ($('.closeStateResult').attr('value') == null) {
        var stateId = 'null';
    } else {
        var stateId = $('.closeStateResult').attr('value');
    }

    if ($('.closeLocalityResult').attr('value') == null) {
        var locId = 'null';
    } else {
        var locId = $('.closeLocalityResult').attr('value');
    }

    if ($('.closeTypeResult').attr('value') == null) {
        var hType = 'null';
    } else {
        var hType = $('.closeTypeResult').attr('value');
    }

    if ($('.closeRoomsResult').attr('value') == null) {
        var numRooms = 'null';
    } else {
        var numRooms = $('.closeRoomsResult').attr('value');
    }

    if ($('.closeBathroomsResult').attr('value') == null) {
        var numBaths ='null';
        var numHalfBaths ='null';
    } else {
        var numBathrooms = parseFloat($('.closeBathroomsResult').attr('value')).toFixed(1).toString();
        var numBathroomsArr = numBathrooms.split(".");
        var numBaths = numBathroomsArr[0];
        if (numBathroomsArr[1] == '5') {
            var numHalfBaths = 1;
        } else {
            var numHalfBaths = 0;
        }    
    }

    if ($('.closeParkingResult').attr('value') == null) {
        var numParkingPlace = 'null';
    } else {
        var numParkingPlace = $('.closeParkingResult').attr('value');
    }

    if ($('.closePricingResult').attr('value') == null) {
        var priceRange = 'null';
    } else {
        var priceRange = $('.closePricingResult').attr('value');
        var priceArr = priceRange.split("|");
        var minPrice = priceArr[0];
        var maxPrice = priceArr[1];
        priceRange = "De " + minPrice + " a " + maxPrice;
    }
    
    var filters = '';
    filters += "State: " + stateId + " / ";
    filters += "Locality: " + locId + " / ";
    filters += "Type: " + hType + " / ";
    filters += "Rooms: " + numRooms + " / ";
    filters += "Bathrooms: " + numBaths + " / ";
    filters += "Half_Bathrooms: " + numHalfBaths + " / ";
    filters += "Parking: " + numParkingPlace + " / ";
    filters += "Price: " + priceRange + "</br></br>";
    $('#filterResponse').html(filters);

    $("#filteredRecords").empty();

    getRecords(stateId, locId, hType, numRooms, numBaths, numHalfBaths, numParkingPlace);
}

function getRecords(stateId, locId, hType, numRooms, numBaths, numHalfBaths, numParkingPlace) {
    $.ajax({
        type: "GET",
        data: {type:"getFilteredRecords",stateId:stateId,locId:locId,hType:hType,numRooms:numRooms,numBaths:numBaths,numHalfBaths:numHalfBaths,numParkingPlace:numParkingPlace},
        url: "./content/surveyData.php", 
        dataType: 'json',
        success: function(response) {
            console.log(response);
            if (response.records.length == 0) { 
                $("#filteredRecords").append("No se encontraron coincidencias con ese criterio de búsqueda");
            } else { 
                $.each(response.records, function(index, record) {
                    string = '<div>' + record.Development_Name + ' | ' +record.Model_Name + ' | ' +record.Price + ' | ' +record.State + ' | ' +record.Locality + ' | ' +record.Type + ' | ' +record.Rooms + ' | ' +record.Bathrooms + ' | ' +record.Half_Bathrooms + ' | ' +record.Parking_Spot + '<div>';
                    $("#filteredRecords").append(string);
                });
            }    
        }
    });	
}


$(document).on('click', '#addStateResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#statesContainer").css("display", "none");
    $("#localitiesContainer").css("display", "block"); 
    getStoredLocationsNum(id);
    $('#filterContainer').prepend('<div><label id="firstChild" class="label-filter">' + value + '<a href="#" class="closeStateResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');  
    getFilters();
});

$(document).on('click', '#addLocalityResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#localitiesContainer").css("display", "none");
    $('#firstChild').after('<div><label class="label-filter">' + value + '<a href="#" class="closeLocalityResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');
    getFilters();
});
 
$(document).on('click', '.closeStateResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $('.closeLocalityResult').parent().remove();
    $("#statesContainer").css("display", "block");
    if($('#localitiesContainer').is(':visible'))
    {
        $("#localitiesContainer").css("display", "none");
    }
    getFilters();
});

$(document).on('click', '.closeLocalityResult', function(e) {
    e.preventDefault();
    var id = $('.closeStateResult').attr('value');
    $(this).parent().remove();
    getStoredLocationsNum(id);
    $("#localitiesContainer").css("display", "block");
    getFilters();
});

$(document).on('click', '.addTypeResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#typeContainer").css("display", "none");
    $('#filterContainer').append('<div><label class="label-filter">' + value + '<a href="#" class="closeTypeResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');  
    getFilters();
});

$(document).on('click', '.closeTypeResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $("#typeContainer").css("display", "block");
    getFilters();
});

$(document).on('click', '.addRoomsResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#roomsContainer").css("display", "none");
    $('#filterContainer').append('<div><label class="label-filter">' + value + '<a href="#" class="closeRoomsResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>'); 
    getFilters();
});

$(document).on('click', '.closeRoomsResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $("#roomsContainer").css("display", "block");
    getFilters();
});

$(document).on('click', '.addBathroomsResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#bathroomsContainer").css("display", "none");
    $('#filterContainer').append('<div><label class="label-filter">' + value + '<a href="#" class="closeBathroomsResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');  
    getFilters();
});

$(document).on('click', '.closeBathroomsResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $("#bathroomsContainer").css("display", "block");
    getFilters();
});

$(document).on('click', '.addParkingResult', function(e) {
    e.preventDefault();
    var id = $(this).attr('value');
    var value = $(this).html();
    $("#parkingContainer").css("display", "none");
    $('#filterContainer').append('<div><label class="label-filter">' + value + '<a href="#" class="closeParkingResult" value="' + id + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');  
    getFilters();
});

$(document).on('click', '.closeParkingResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $("#parkingContainer").css("display", "block");
    getFilters();
});

$('#addPriceFilter').on('click', function(e) {
    e.preventDefault();
    var minPrice = $('#minPrice').val();
    var maxPrice = $('#maxPrice').val();
    minPriceFormatted = parseFloat(minPrice).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
    minPriceFormatted = parseFloat(maxPrice).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');;
    $("#priceContainer").css("display", "none");
    $('#filterContainer').append('<div><label class="label-filter">De $' + minPriceFormatted + ' a $' + minPriceFormatted + ' <a href="#" class="closePricingResult"  value="' + minPrice + '|' + maxPrice + '"><i class="glyphicon glyphicon-remove input-label-icon"></i></a></label></div>');  
    getFilters();
});

$(document).on('click', '.closePricingResult', function(e) {
    e.preventDefault();
    $(this).parent().remove();
    $("#priceContainer").css("display", "block");
    getFilters();
});