function validateFirstStep() {
    var valFlag = 0;
    var dev_name = $('#dev_name').val();
    if (dev_name == null || dev_name == "") {
        if ($('#dev_name').next().length == 0) {
            $('#dev_name').after('<label class="error text-danger">Debes ingresar el nombre.</label>');
            $('#dev_name').closest('div').parent().addClass('has-error');
        } 
        valFlag++;
    } else {
        if ($('#dev_name').next().length > 0) {
            $('#dev_name').next('label').remove();
            $('#dev_name').closest('div').parent().removeClass('has-error');
        } 
    }
    if (valFlag == 0) {
        return true;
    } else {
        return false;
    }
}

function validateSecondStep() {
    var valFlag = 0;
    var finance_name = $('#finance_name').val();
    if (finance_name == null || finance_name == "") {
        if ($('#finance_name').next().length == 0) {
            $('#finance_name').after('<label class="error text-danger">Debes ingresar la razón social.</label>');
            $('#finance_name').closest('div').parent().addClass('has-error');
        } 
        valFlag++;
    } else {
        if ($('#finance_name').next().length > 0) {
            $('#finance_name').next('label').remove();
            $('#finance_name').closest('div').parent().removeClass('has-error');
        } 
    }
    if (valFlag == 0) {
        return true;
    } else {
        return false;
    }
}

function validateThirdStep() {
    return false;
}

function validateManagerInfo() {
    var valFlag = 0;
    var manager_name = $('#manager_name').val();
    if (manager_name == null || manager_name == "") {
        if ($('#manager_name').next().length == 0) {
            $('#manager_name').after('<label class="error text-danger">Debes ingresar el nombre del gestor.</label>');
            $('#manager_name').closest('div').parent().addClass('has-error');
        } 
        valFlag++;
    } else {
        if ($('#manager_name').next().length > 0) {
            $('#manager_name').next('label').remove();
            $('#manager_name').closest('div').parent().removeClass('has-error');
        } 
    }
    if (valFlag == 0) {
        return true;
    } else {
        return false;
    }
}

$(document).on("change", '.onchange-managerForm', function(e) {
    e.preventDefault();
    var option = $(this).val();
    if (option == 0) {
        $('#modal_manager').modal('show').find('.modal-body').load('ajax/managerForm.html');
        $('#manager_type').val($(this).attr('id'));
    }
});

$(document).on("click", '#modal_manager_close', function(e) {
    e.preventDefault();
    var flag = $('#manager_type').val();
    $('#' + flag).select2('data', {id: '', text: 'Seleccionar colaborador...'});
    $('#modal_manager').modal('toggle');
});

$(document).on("click", '#validate_manager_info', function(e) {
    e.preventDefault();
    var flag = validateManagerInfo();
});

$(document).on("change", '.onchange-developmentForm', function(e) {
    e.preventDefault();
    var option = $(this).val();
    if (option == 0) {
        $('#modal_development').modal('show').find('.modal-body').load('ajax/developmentForm.html');
    }
});

$(document).on("click", '#modal_development_close', function(e) {
    e.preventDefault();
    $('#development_name').select2('data', {id: '', text: 'Seleccionar desarrollo...'});
    $('#modal_development').modal('toggle');
});

$(document).on("focusout", '#mapinfo_longitude', function(e) {
    e.preventDefault();
    var flag = 0;
    $('#mapinfo_street').val('');
    $('#mapinfo_neighborhood').val('');
    $('#mapinfo_postalcode').val('');
    $('#mapinfo_city').val('');
    $('#mapinfo_state').val('');
    var latitude = $('#mapinfo_latitude').val();
    var longitude = $('#mapinfo_longitude').val();
    if (!((latitude >= 14.5408333333) && (latitude <= 32.7183333333))) {
        if ($('#mapinfo_latitude').next().length == 0) {
            $('#mapinfo_latitude').after('<label class="error text-danger">No válido.</label>');
            $('#mapinfo_latitude').closest('div').parent().addClass('has-error');
        } 
        flag++;
    } else {
        if ($('#mapinfo_latitude').next().length > 0) {
            $('#mapinfo_latitude').next('label').remove();
            $('#mapinfo_latitude').closest('div').parent().removeClass('has-error');
        } 
    }
    if (!((longitude >= -118.456666667) && (longitude <= -86.7100000000))) {
        if ($('#mapinfo_longitude').next().length == 0) {
            $('#mapinfo_longitude').after('<label class="error text-danger">No válido.</label>');
            $('#mapinfo_longitude').closest('div').parent().addClass('has-error');
        } 
        flag++;
    } else {
        if ($('#mapinfo_longitude').next().length > 0) {
            $('#mapinfo_longitude').next('label').remove();
            $('#mapinfo_longitude').closest('div').parent().removeClass('has-error');
        } 
    }
    if (flag == 0) {
        getMapInfo(latitude, longitude);
        initializeMap(latitude, longitude);
    }
});

function getMapInfo(latitude, longitude){
    var cords = latitude + ',' + longitude;
    $('#mapinfo_postalcode').val("");
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc',{
        sensor: false,
        latlng: cords
    }, 
    function(data) {
        console.log(data);
        if (data.status == 'OK') {
            flag = data.results[0]['address_components'].length;
            console.log(flag);
            if (flag >= 6 ) {
                postalCode = data.results[0]['address_components'][flag-1]['long_name'];
                if (postalCode != "" || postalCode != null) {
                    //$('#mapinfo_postalcode').prop('disabled', true);
                    $('#mapinfo_postalcode').val(postalCode);
                    getAddressInfo(postalCode);
                    console.log(postalCode);
                } else {
                    invalidCoordinate();                
                }
            } else {
                invalidCoordinate();           
            }
        } else {
            invalidCoordinate();
        }
    })
    .error(function() { 
        invalidCoordinate();
    });
}

function invalidCoordinate() {
    $('#mapinfo_postalcode').prop('disabled', false);
    $('#mapinfo_neighborhood_container').html('<input type="text" value="Ingresar Código Postal" id="mapinfo_neighborhood" class="form-control" style="height: 22px; padding: 2px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px;" disabled/>');
    $('#mapinfo_city').val('Ingresar Código Postal');
    $('#mapinfo_state').val('Ingresar Código Postal');
    $('#get_map_cords').prop('disabled', true);
}

$(document).on("focusout", '#mapinfo_postalcode', function(e) {
    getAddressInfo($('#mapinfo_postalcode').val());
});

function initializeMap(latitude, longitude) {
    var point = new google.maps.LatLng(latitude, longitude);
    var map = new google.maps.Map(document.getElementById('developmentMap'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14,
        center: point,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    });
    var marker = new google.maps.Marker({ 
        position: point, 
        map: map, 
        icon: 'http://www.google.com/intl/en_us/mapfiles/ms/icons/red-dot.png',
        draggable: true,
    });
    marker.setMap(map);

    google.maps.event.addListener(marker, 'dragend', function(evt){
        lat = evt.latLng.lat().toFixed(6);
        lng = evt.latLng.lng().toFixed(6);
        $('#mapinfo_latitude').val(lat);
        $('#mapinfo_longitude').val(lng);
        getMapInfo(lat, lng);
    });
}

//https://maps.googleapis.com/maps/api/geocode/json?latlng=19.4785,-99.2396&key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc
//https://maps.google.com/maps/api/geocode/json?key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc&address=margarita%20maza%20de%20juare+cuernavaca+morelos+mexico
//https://maps.google.com/maps/api/geocode/json?key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc&address=margarita%20maza%20de%20juarez%20cuernavaca

$(document).on("click", '#development_attributes_form', function(e) {
    e.preventDefault();
    getAttributes();
    $('#modal_development').modal('hide');
    $('#modal_development_attributes').modal('show');
});

$(document).on("click", '#modal_attributes_close', function(e) {
    $('#modal_development_attributes').modal('toggle');
    $('#modal_development').modal('show');
});

var getAttributes = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            $.ajax({
                type: "POST",
                data: {type:"getAttributes"},
                url: "./content/developerData.php", 
                dataType: 'json',
                success: function(response) {
                    $.each(response.records, function(index, attributes) {
                        string = '<div class="col-sm-3" class="ckbox ckbox-primary"><input type="checkbox" value="' + attributes.id + '" id="checkboxPrimary" /><label for="checkboxPrimary">&nbsp;&nbsp;' + attributes.description + '</label></div>';
                        $('#attributes_container').append(string);
                    });
                }
            });	
        }
    };
})();

$(document).on("click", '#development_images_form', function(e) {
    e.preventDefault();
    getAttributes();
    $('#modal_development').modal('hide');
    $('#modal_development_images').modal('show');
});

$(document).on("click", '#modal_images_close', function(e) {
    $('#modal_development_images').modal('toggle');
    $('#modal_development').modal('show');
});

function getAddressInfo(postalCode) {
    if ($('#get_map_cords').attr('disabled') == false){
        $('#get_map_cords').prop('disabled', true);
    }
    $.ajax({
        type: "POST",
        data: {type:"getAddressInfo",postalCode:postalCode},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == null || response == 'null') {
                $('#mapinfo_neighborhood_container').html('<input type="text" value="Código Postal no válido" id="mapinfo_neighborhood" class="form-control" style="height: 22px; padding: 2px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px;" disabled/>');
                $('#mapinfo_city').val('Código Postal no válido');
                $('#mapinfo_state').val('Código Postal no válido');
                $('#get_map_cords').prop('disabled', true);   
            } else {
                if (response.length == 1) {
                    string = '<select id="mapinfo_neighborhood" class="form-control" style="height: 22px; padding: 2px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px;width:100%;">';
                    string += '<option value="' + response[0][3] + '">' + response[0][2] + '</option>';
                    string += '</select>';
                    $('#mapinfo_neighborhood_container').html(string);
                    $('#mapinfo_city').val(response[0][1]);
                    $('#mapinfo_state').val(response[0][0]);
                    $('#get_map_cords').prop('disabled', false);
                } else {
                    string = '<select id="mapinfo_neighborhood" class="form-control" style="height: 22px; padding: 2px 5px; font-size: 12px; line-height: 1.5; border-radius: 3px;width:100%;">';
                    string += '<option value="0">Selecciona...</option>';
                    for(var i = 0; i < response.length; i++) {
                        string += '<option value="' + response[i][3] + '">' + response[i][2] + '</option>';
                    }
                    string += '</select>';
                    $('#mapinfo_neighborhood_container').html(string);
                    $('#mapinfo_city').val(response[0][1]);
                    $('#mapinfo_state').val(response[0][0]);
                    $('#get_map_cords').prop('disabled', true);
                }
            }
        }
    });	
}



function getMapCords(){
    postalCode = $('#mapinfo_postalcode').val();
    city = $('#mapinfo_city').val();
    state = $('#mapinfo_state').val();
    neighborhood = $('#mapinfo_neighborhood').val();
    $.getJSON('https://maps.google.com/maps/api/geocode/json?key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc&address=' + neighborhood + '+' + city + '+' + state + '+' + postalCode + '+mexico',
    function(data) {
        console.log(data);
        lat = data.results[1]['geometry']['location'].lat.toFixed(6);
        lng = data.results[1]['geometry']['location'].lng.toFixed(6);
        $('#mapinfo_latitude').val(lat);
        $('#mapinfo_longitude').val(lng);
        initializeMap(lat, lng);
    })
}

$(document).on("click", '#get_map_cords', function(e) {
    e.preventDefault();
    getMapCords();
});

$(document).on("change", '#mapinfo_neighborhood', function(e) {
    e.preventDefault();
    $("#mapinfo_neighborhood option[value='']").remove();
    $('#get_map_cords').prop('disabled', false);
});
//https://innostudio.de/fileuploader/