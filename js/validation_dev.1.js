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
        //initializeMap("39.16976", "-91.88295"); 
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
        flag++;
    }
    if (!((longitude >= -118.456666667) && (longitude <= 86.7100000000))) {
        flag++;
    }
    if (flag == 0) {
        getMapInfo(latitude, longitude);
        initializeMap(latitude, longitude);
        getAddressInfo();
    }
});

function getMapInfo(latitude, longitude){
    var cords = latitude + ',' + longitude;
    $.getJSON('https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc',{
        sensor: false,
        latlng: cords
    }, 
    function(data, textStatus) {
        //console.log(data);
        if (data.status == 'OK') {
            var arrsize = data.results[0]['address_components'].length;
            if (arrsize >= 7) {
                $('#mapinfo_street').val(data.results[0]['address_components'][1]['long_name']);
                $('#mapinfo_neighborhood').val(data.results[0]['address_components'][2]['long_name']);
                $('#mapinfo_postalcode').val(data.results[0]['address_components'][6]['long_name']);
                $('#mapinfo_city').val(data.results[5]['address_components'][0]['long_name']);
                $('#mapinfo_state').val(data.results[0]['address_components'][4]['long_name']);
            } else {
                $('#mapinfo_city').val(data.results[1]['address_components'][0]['long_name']);
                $('#mapinfo_state').val(data.results[1]['address_components'][1]['long_name']);  
            }
        }
    })
    .error(function() { 
        $('#mapinfo_street').val('');
        $('#mapinfo_neighborhood').val('');
        $('#mapinfo_postalcode').val('');
        $('#mapinfo_city').val('');
        $('#mapinfo_state').val('');
    });
}

function initializeMap(latitude, longitude) {
    var point = new google.maps.LatLng(latitude, longitude);
    var map = new google.maps.Map(document.getElementById('developmentMap'), {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        zoom: 14,
        center: point
    });
    var marker = new google.maps.Marker({ position: point, map: map, icon: 'http://www.google.com/intl/en_us/mapfiles/ms/icons/red-dot.png' });
}

//https://maps.googleapis.com/maps/api/geocode/json?latlng=19.4785,-99.2396&key=AIzaSyB8uu1scfFc1dFZ7H77r3ZqZzlifH7yNcc


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
                    string = '';
                    for(var i = 0; i < response.length; i++) {
                        string = '<div class="col-sm-3" class="ckbox ckbox-primary"><input type="checkbox" value="' + response[i][1] + '" id="checkboxPrimary" /><label for="checkboxPrimary">&nbsp;&nbsp;' + response[i][0] + '</label></div>';
                        $('#attributes_container').append(string);
                    }
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

function getAddressInfo() {
    var postalCode = '20010';
    $.ajax({
        type: "POST",
        data: {type:"getAddressInfo",postalCode:postalCode},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response) {
            string = '';
            for(var i = 0; i < response.length; i++) {
                console.log(response[i][0] + '|' + response[i][1] + '|' + response[i][2]);
            }
        }
    });	
}

//https://innostudio.de/fileuploader/