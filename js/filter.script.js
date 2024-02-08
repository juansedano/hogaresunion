//v=1.7.0 14:00 30/Mayo/2020*/
$(document).ready(function () {
    getDataFilter();
    getBestFeature();
});

function formatedDateByMonth(availability) {
    if ((availability == null) || (availability == 'null')) {
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

function formatoMoneda(stringVal) {
	if(stringVal == undefined){return "$0";}
	stringVal = stringVal.indexOf(".") >= 0 ? stringVal.split(".")[0] : stringVal;
	var val = "$" + stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	if (val.length === 1 && val === "$") {
		val = "";
	}
	return val;
}

$("#pGlobalType.div-content-td-span-arrow").click(function(e){
    if( e.target.type != "radio" && e.target.type != "checkbox" && (e.target.id != undefined && e.target.id !="radios-content-tyim-selected" && e.target.id != "checks-content-tyim-selected") ){
      if($("#radios-content-tyim-selected.content-filters-td").is(":visible")){
        $("#radios-content-tyim-selected.content-filters-td").hide();//.slideUp('fast');
        $("#span-arrow-tyim1.td-span-arrow").removeClass("td-span-arrow-rotated");
        $("#radios-content-tyim-selected").css("z-index","1");
      } else {
        $("#radios-content-tyim-selected.content-filters-td").slideDown('fast');
        $("#span-arrow-tyim1.td-span-arrow").addClass("td-span-arrow-rotated");
        $("#radios-content-tyim-selected").css("z-index","11");
      }
    }
});

$("#payment.div-content-td-span-arrow").click(function(e){
    if( e.target.type != "radio" && e.target.type != "checkbox" && (e.target.id != undefined && e.target.id !="radios-content-tyim-selected" && e.target.id != "checks-content-tyim-selected") ){
      if($("#checkMethod.content-filters-td").is(":visible")){
        $("#checkMethod.content-filters-td").hide();//.slideUp('fast');
        $("#span-arrow-tyim2.td-span-arrow").removeClass("td-span-arrow-rotated");
        $("#checkMethod").css("z-index","1");
      } else {
        $("#checkMethod.content-filters-td").slideDown('fast');
        $("#span-arrow-tyim2.td-span-arrow").addClass("td-span-arrow-rotated");
        $("#checkMethod").css("z-index","11");
      }
    }
});

// Opciones de Metodos de pago
var paymentData = new Map();
paymentData.set("131", "Contado");
paymentData.set("132", "Bancario");
paymentData.set("133", "Infonavit");
paymentData.set("134", "Fovissste");
paymentData.set("135", "Otro");
paymentData.set("136", "Directo");

var developerRegister = ['ALT', 'ARA', 'SAD', 'RUB', 'RUB2', 'STHANA'];
var housingTypes = ['casa', 'departamento', 'terreno', 'duplex', 'triplex', 'tetraplex', 'pentaplex','hexaplex'];

var zonesInfo = [];
var statesInfo = [];
var localitiesInfo = [];
var developmentsInfo = [];
var propertyInfo = [];
var propertyTypesInfo = [];
var propertyFloorsInfo = [];
var roomsInfo = [];
var bathsInfo = [];
var minPriceInfo = [];
var maxPriceInfo = [];
var minAreaInfo = [];
var maxAreaInfo = [];
var labels = [];
var maxAvailability = '';
var minAvailability = '';

function getDataFilter() {
    var options;
    $.ajax({
        type: 'POST',
        data: {type:'getData',stateId:null,localityId:null,developmentId:null},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response) {
            maxAvailability = response.maxAvailability;
            minAvailability = response.minAvailability;

            zonesInfo = response.zones;
            $('#zones').empty();
            $('#zones').append('<option value="All">Todos</option>');
            response.zones.forEach(zone => {
                options = `<option value="${zone.id}">${zone.name}</option>`;
                $('#zones').append(options);
            });
            $('#zones').prop('disabled', false);

            statesInfo = response.states;
            $('#states').empty();
            $('#states').append('<option value="All">Todos</option>');
            response.states.forEach(state => {
                options = `<option value="${state.id}" data-url="${state.shortUrl}">${state.name}</option>`;
                $('#states').append(options);
            });
            $('#states').prop('disabled', false);

            localitiesInfo = response.localities;

            developmentsInfo = response.developments;

            propertyInfo = response.models;

            propertyTypesInfo = response.pTypes;

            propertyFloorsInfo = response.pFloors;

            roomsInfo = response.rooms;

            bathsInfo = response.baths;

            for ( var counter1 = 0; counter1 < 26; counter1++){
                for ( var counter2 = 0; counter2 < 26; counter2++){
                    for ( var counter3 = 0; counter3 < 26; counter3++){
                        var value= "";
                        if (counter1 != 0 )
                            value = String.fromCharCode(counter1+65);
                        if (counter1 != 0 || counter2 != 0 )
                            value = value + String.fromCharCode(counter2+65);
                        value = value + String.fromCharCode(counter3+65);
                        labels.push(value);
                    }
                }
            }
            resetFilterData();
        }
    });
}

var bestFeature = [];
function getBestFeature() {
    $.ajax({
        type: 'POST',
        data: {type:'getBestFeature'},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                response.forEach(element => {
                    bestFeature.push({
                        "id": element.id,
                        "name": element.name
                    });
                });
            }
        }
    });
}

function resetFilterData() {
    $("#developmentList").hide();
    /* Accredited*/
    $('#accredited').select2('data', {id: '1', text: 'Acreditado 1'});
    if ($("#sync_house_budget").attr('data-value') != undefined) {
        $('#accredited').change();
    }

    /* Zone */
    $('#zones').select2('data', {id: 'All', text: 'Todos'});
    $('#zones').attr('disabled', false);

    /* State */
    $('#states').select2('data', {id: 'All', text: 'Todos'});
    $('#states').attr('disabled', false);

    /* Locality */
    $('#localities').empty();
    $('#localities').append('<option value="All">Todos</option>');
    localitiesInfo.forEach(locality => {
        options = `<option value="${locality.id}" data-stateId="${locality.stateId}" data-url="${locality.shortUrl}">${locality.name}</option>`;
        $('#localities').append(options);
    });
    $('#localities').select2('data', {id: 'All', text: 'Todos'});
    $('#localities').attr('disabled', false);

    /* Property Type */
    $('#pTypes').empty();
    var tempTypes = '';
    var landCount = 0;
    propertyTypesInfo.forEach(propertyType => {
        if (tempTypes != propertyType.name ) {
            if (propertyType.id != 3) {
                options = `<input type="checkbox" name="vehicle" value="${propertyType.id}" checked>${propertyType.name}<br>`;
                $('#pTypes').append(options);
                tempTypes = propertyType.name;
            } else {
                landCount++;
            }
        }
    });
    if (landCount>0) {
        $("input[type=radio][name=imtype][value='terreno']").attr("disabled", false);
    } else {
        $("input[type=radio][name=imtype][value='terreno']").attr("disabled", true);
    }
    if ($("input[name=vehicle]").length===0 && landCount>0) {
        $("#lbl-tyim-selected").text("Terreno");
        notify('growl-danger', 'Solo Terrenos', 'Solo se encontraron terrenos');
        $("input[type=radio][name=imtype][value='terreno']").attr("checked", true);
    } else {
        $("#lbl-tyim-selected").text("Vivienda");
        $("input[type=radio][name=imtype][value='vivienda']").attr("checked", true);
    }
    $('#pGlobalType').attr('disabled', false);

    /* Payment */
    var paymentMe = [];
    propertyInfo.forEach(model => {
        if (model.type != 3) {
            var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
            res.forEach(method => {
                if (paymentMe.indexOf(method) == -1) {
                    paymentMe.push(method);
                }
            });
        }
    });
    $("#checkMethodOpt").empty();
    paymentMe.forEach(element => {
        opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
        $("#checkMethodOpt").append(opt);
    });
    $('#payment').attr('disabled', false);

    /* Availability */
    $("#dateFrom").empty();
    $("#dateTo").empty();
    $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
    $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
    var immediate = 0;
    var today = new Date();
    var dates = [];
    propertyInfo.forEach(model => {
        if ( model.type != 3 ) {
            var availability = model.availability.split('-');
            availability = new Date(availability[0], availability[1]-1, availability[2]);
            if (availability < today) {
                immediate++;
            } else {
                if (dates.indexOf(model.availability) == -1) {
                    dates.push(model.availability);
                }
            }
        }
    });
    if (immediate > 0) {
        $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
        $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
    }
    dates.sort();
    dates.forEach(date => {
        option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
        $("#dateFrom").append(option);
        $("#dateTo").append(option);
    });
    $("#dateFrom").attr('disabled', false);
    $("#dateTo").attr('disabled', false);

    /* Floors */
    $('#pFloors').empty();
    $('#pFloors').append('<option value="All">Todos</option>');
    var tempFloors = '';
    propertyFloorsInfo.forEach(propertyFloors => {
        if (tempFloors != propertyFloors.num) {
            options = '<option value="' + propertyFloors.num + '">' + propertyFloors.num + '</option>';
            $('#pFloors').append(options);
            tempFloors = propertyFloors.num;
        }
    });
    $('#pFloors').prop('disabled', false);

    /* Rooms */
    $('#rooms').empty();
    $('#rooms').append('<option value="All">Todos</option>');
    var tempRooms = '';
    roomsInfo.forEach(rooms => {
        if (tempRooms != rooms.num) {
            options = '<option value="' + rooms.num + '">' + rooms.num + '</option>';
            $('#rooms').append(options);
            tempRooms = rooms.num;
        }
    });
    $('#rooms').prop('disabled', false);

    /* Baths */
    $('#baths').empty();
    $('#baths').append('<option value="All">Todos</option>');
    var tempBaths = '';
    bathsInfo.forEach(baths => {
        if (tempBaths != baths.num) {
            options = '<option value="' + baths.num + '">' + baths.num + '</option>';
            $('#baths').append(options);
            tempBaths = baths.num;
        }
    });
    $('#baths').prop('disabled', false);

    /* Price and Area */
    $.each(propertyInfo, function(index, model) {
        if (model.type != 3) {
            minPriceInfo.push(parseInt(model.price));
            maxPriceInfo.push(parseInt(model.price));
            minAreaInfo.push(Math.floor(model.area));
            maxAreaInfo.push(Math.ceil(model.area));
        }
    });

    var minPrice = Math.min.apply(null,minPriceInfo).toString();
    $('#minPrice').val(formatoMoneda(minPrice));

    var maxPrice = Math.max.apply(null,maxPriceInfo).toString();
    $('#maxPrice').val(formatoMoneda(maxPrice));

    var minArea = Math.min.apply(null,minAreaInfo);
    $('#minArea').val(minArea);

    var maxArea = Math.max.apply(null,maxAreaInfo);
    $('#maxArea').val(maxArea);

    $('#developers').select2('data', null);
    $("#developers").attr("disabled", true);

    $('#developments').empty();
    developmentsInfo.forEach(development => {
        var newOption = new Option(development.name + " " + development.id , development.id, false, false);
        $('#developments').append(newOption);
    });
    // $('#developments').trigger('change');
    $("#developments").select2({maximumSelectionSize: 1});
    $("#developments").attr("disabled", false);

    $("#filterRes").hide();

}

$("#accredited").change(function () {
    var accredited = $(this).val();
    switch (accredited) {
        case "1":
            budget1 = $("#sync_house_budget").attr('data-value');
            budget1 = budget1.replace(/,/g, "");
            if (budget1 == "null") budget1 = 0;
            $("#userBudget").val(formatoMoneda(budget1.toString()));
            break;
        case "2":
            budget2 = $("#sync_presupuesto_vivienda_acreditado_2").attr('data-value');
            budget2 = budget2.replace(/,/g, "");
            if (budget2 == "null") budget2 = 0;
            $("#userBudget").val(formatoMoneda(budget2.toString()));
            break;
        case "3":
            budget1 = $("#sync_house_budget").attr('data-value');
            budget1 = budget1.replace(/,/g, "");
            if (budget1 == "null") budget1 = 0;
            budget2 = $("#sync_presupuesto_vivienda_acreditado_2").attr('data-value');
            budget2 = budget2.replace(/,/g, "");
            if (budget2 == "null") budget2 = 0;
            total = parseInt(budget2)+parseInt(budget1);
            total = formatoMoneda(total.toString());
            $("#userBudget").val(total);
            break;
        default:
            break;
    }
});

$("#zones").change(function() {
    var zoneId = $(this).val();
    var selected = $(this).find('option:selected');
    var zoneName = selected.text();
    if (zoneId != 'All') {
        $('#states').prop('disabled', true);
        $('#states').select2('data', {id: 'All', text: 'Todos'});
        $('#localities').prop('disabled', true);
        $('#localities').select2('data', {id: 'All', text: 'Todos'});

        /* Property Type */
        $('#pTypes').empty();
        var tempTypes = '';
        var landCount = 0;
        $.each(propertyTypesInfo, function(index, propertyTypes) {
            if (zoneId == propertyTypes.zoneId) {
                if (tempTypes != propertyTypes.name ) {
                    if (propertyTypes.id != 3) {
                        options = '<input type="checkbox" name="vehicle" value="' + propertyTypes.id + '" checked> ' + propertyTypes.name + '<br>';
                        $('#pTypes').append(options);
                        tempTypes = propertyTypes.name;
                    } else {
                        landCount++;
                    }
                }
            }
        });
        if (landCount>0) {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", false);
        } else {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", true);
        }
        if ($("input[name=vehicle]").length===0 && landCount>0) {
            $("#lbl-tyim-selected").text("Terreno");
            notify('growl-danger', 'Solo Terrenos', 'Solo se encontraron terrenos');
            $("input[type=radio][name=imtype][value='terreno']").attr("checked", true);
        } else {
            $("#lbl-tyim-selected").text("Vivienda");
            $("input[type=radio][name=imtype][value='vivienda']").attr("checked", true);
        }

        /* Availability */
        $("#dateFrom").empty();
        $("#dateTo").empty();
        $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
        $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
        var immediate = 0;
        var today = new Date();
        var dates = [];
        propertyInfo.forEach(model => {
            if (zoneId == model.zoneId && model.type != 3 ) {
                var availability = model.availability.split('-');
                availability = new Date(availability[0], availability[1]-1, availability[2]);
                if (availability < today) {
                    immediate++;
                } else {
                    if (dates.indexOf(model.availability) == -1) {
                        dates.push(model.availability);
                    }
                }
            }
        });
        if (immediate > 0) {
            $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
            $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
        }
        dates.sort();
        dates.forEach(date => {
            option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
            $("#dateFrom").append(option);
            $("#dateTo").append(option);
        });
        $("#dateFrom").attr('disabled', false);
        $("#dateTo").attr('disabled', false);

        /* Floors */
        $('#pFloors').empty();
        $('#pFloors').append('<option value="All">Todos</option>');
        var tempFloors = '';
        $.each(propertyFloorsInfo, function(index, propertyFloors) {
            if (zoneId == propertyFloors.zoneId) {
                if (tempFloors != propertyFloors.num) {
                    options = '<option value="' + propertyFloors.num + '">' + propertyFloors.num + '</option>';
                    $('#pFloors').append(options);
                    tempFloors = propertyFloors.num;
                }
            }
        });
        $('#pFloors').prop('disabled', false);

        /* Rooms */
        $('#rooms').empty();
        $('#rooms').append('<option value="All">Todos</option>');
        var tempRooms = '';
        $.each(roomsInfo, function(index, rooms) {
            if (zoneId == rooms.zoneId) {
                if (tempRooms != rooms.num) {
                    options = '<option value="' + rooms.num + '">' + rooms.num + '</option>';
                    $('#rooms').append(options);
                    tempRooms = rooms.num;
                }
            }
        });
        $('#rooms').prop('disabled', false);

        /* Baths */
        $('#baths').empty();
        $('#baths').append('<option value="All">Todos</option>');
        var tempBaths = '';
        $.each(bathsInfo, function(index, baths) {
            if (zoneId == baths.zoneId) {
                if (tempBaths != baths.num) {
                    options = '<option value="' + baths.num + '">' + baths.num + '</option>';
                    $('#baths').append(options);
                    tempBaths = baths.num;
                }
            }
        });
        $('#baths').prop('disabled', false);

        /* Price and Area */
        minPriceInfo = [];
        maxPriceInfo = [];
        minAreaInfo = [];
        maxAreaInfo = [];

        $.each(propertyInfo, function(index, model) {
            if (zoneId == model.zoneId) {
                if (model.type != 3) {
                    minPriceInfo.push(parseInt(model.price));
                    maxPriceInfo.push(parseInt(model.price));
                    minAreaInfo.push(Math.floor(model.area));
                    maxAreaInfo.push(Math.ceil(model.area));
                }
            }
        });

        var minPrice = Math.min.apply(null,minPriceInfo).toString();
        $('#minPrice').val(formatoMoneda(minPrice));

        var maxPrice = Math.max.apply(null,maxPriceInfo).toString();
        $('#maxPrice').val(formatoMoneda(maxPrice));

        var minArea = Math.min.apply(null,minAreaInfo);
        $('#minArea').val(minArea);

        var maxArea = Math.max.apply(null,maxAreaInfo);
        $('#maxArea').val(maxArea);

        /* Payment */
        var paymentMe = [];
        propertyInfo.forEach(model => {
            if (zoneId == model.zoneId) {
                if (model.type != 3) {
                    var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                    res.forEach(method => {
                        if (paymentMe.indexOf(method) == -1) {
                            paymentMe.push(method);
                        }
                    });
                }
            }
        });
        $("#checkMethodOpt").empty();
        paymentMe.forEach(element => {
            opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
            $("#checkMethodOpt").append(opt);
        });

        getNumberOfDevs();

    } else {
        resetFilterData();
    }
});

$("#states").change(function() {
    var options;
    var stateId = $(this).val();
    var selected = $(this).find('option:selected');
    if (stateId != 'All') {
        /* Locality */
        $('#localities').empty();
        $('#localities').append('<option value="All">Todos</option>');
        $.each(localitiesInfo, function(index, locality) {
            if (stateId == locality.stateId) {
                options = '<option value="' + locality.id + '" data-stateId="' + locality.stateId + '" data-url="'+locality.shortUrl+'">' + locality.name + '</option>';
                $('#localities').append(options);
            }
        });
        $('#localities').select2('data', {id: 'All', text: 'Todos'});

        /* Property type */
        $('#pTypes').empty();
        var tempTypes = '';
        var landCount = 0;
        $.each(propertyTypesInfo, function(index, propertyTypes) {
            if (stateId == propertyTypes.stateId) {
                if (tempTypes != propertyTypes.name ) {
                    if (propertyTypes.id != 3) {
                        options = '<input type="checkbox" name="vehicle" value="' + propertyTypes.id + '" checked> ' + propertyTypes.name + '<br>';
                        $('#pTypes').append(options);
                        tempTypes = propertyTypes.name;
                    } else {
                        landCount++;
                    }

                }
            }
        });
        if (landCount>0) {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", false);
        } else {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", true);
        }
        if ($("input[name=vehicle]").length===0 && landCount>0) {
            $("#lbl-tyim-selected").text("Terreno");
            notify('growl-danger', 'Solo Terrenos', 'Solo se encontraron terrenos');
        } else {
            $("#lbl-tyim-selected").text("Vivienda");
            $("input[type=radio][name=imtype][value='vivienda']").attr("checked", true);
        }

        /* Availability */
        $("#dateFrom").empty();
        $("#dateTo").empty();
        $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
        $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
        var immediate = 0;
        var today = new Date();
        var dates = [];
        propertyInfo.forEach(model => {
            if (stateId == model.stateId && model.type != 3 ) {
                var availability = model.availability.split('-');
                availability = new Date(availability[0], availability[1]-1, availability[2]);
                if (availability < today) {
                    immediate++;
                } else {
                    if (dates.indexOf(model.availability) == -1) {
                        dates.push(model.availability);
                    }
                }
            }
        });
        if (immediate > 0) {
            $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
            $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
        }
        dates.sort();
        dates.forEach(date => {
            option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
            $("#dateFrom").append(option);
            $("#dateTo").append(option);
        });
        $("#dateFrom").attr('disabled', false);
        $("#dateTo").attr('disabled', false);

        /* Floors */
        $('#pFloors').empty();
        $('#pFloors').append('<option value="All">Todos</option>');
        var tempFloors = '';
        $.each(propertyFloorsInfo, function(index, propertyFloors) {
            if (stateId == propertyFloors.stateId) {
                if (tempFloors != propertyFloors.num) {
                    options = '<option value="' + propertyFloors.num + '">' + propertyFloors.num + '</option>';
                    $('#pFloors').append(options);
                    tempFloors = propertyFloors.num;
                }
            }
        });
        $('#pFloors').prop('disabled', false);

        /* Rooms */
        $('#rooms').empty();
        $('#rooms').append('<option value="All">Todos</option>');
        var tempRooms = '';
        $.each(roomsInfo, function(index, rooms) {
            if (stateId == rooms.stateId) {
                if (tempRooms != rooms.num) {
                    options = '<option value="' + rooms.num + '">' + rooms.num + '</option>';
                    $('#rooms').append(options);
                    tempRooms = rooms.num;
                }
            }
        });
        $('#rooms').prop('disabled', false);

        /* Baths */
        $('#baths').empty();
        $('#baths').append('<option value="All">Todos</option>');
        var tempBaths = '';
        $.each(bathsInfo, function(index, baths) {
            if (stateId == baths.stateId) {
                if (tempBaths != baths.num) {
                    options = '<option value="' + baths.num + '">' + baths.num + '</option>';
                    $('#baths').append(options);
                    tempBaths = baths.num;
                }
            }
        });
        $('#baths').prop('disabled', false);

        /* Price and Area */
        minPriceInfo = [];
        maxPriceInfo = [];
        minAreaInfo = [];
        maxAreaInfo = [];

        $.each(propertyInfo, function(index, model) {
            if (stateId == model.stateId) {
                if (model.type != 3) {
                    minPriceInfo.push(parseInt(model.price));
                    maxPriceInfo.push(parseInt(model.price));
                    minAreaInfo.push(Math.floor(model.area));
                    maxAreaInfo.push(Math.ceil(model.area));
                }
            }
        });

        var minPrice = Math.min.apply(null,minPriceInfo).toString();
        $('#minPrice').val(formatoMoneda(minPrice));

        var maxPrice = Math.max.apply(null,maxPriceInfo).toString();
        $('#maxPrice').val(formatoMoneda(maxPrice));

        var minArea = Math.min.apply(null,minAreaInfo);
        $('#minArea').val(minArea);

        var maxArea = Math.max.apply(null,maxAreaInfo);
        $('#maxArea').val(maxArea);

        /* Payment */
        var paymentMe = [];
        propertyInfo.forEach(model => {
            if (stateId == model.stateId) {
                if (model.type != 3) {
                    var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                    res.forEach(method => {
                        if (paymentMe.indexOf(method) == -1) {
                            paymentMe.push(method);
                        }
                    });
                }
            }
        });
        $("#checkMethodOpt").empty();
        paymentMe.forEach(element => {
            opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
            $("#checkMethodOpt").append(opt);
        });

        getNumberOfDevs();

    } else {
        resetFilterData();
    }
});

$("#localities").change(function() {
    var options;
    var localityId = $(this).val();
    var selected = $(this).find('option:selected');
    var stateId = selected.data('stateid');
    if (localityId != 'All') {
        /* State */
        $('#states').empty();
        $('#states').append('<option value="All">Todos</option>');
        $.each(statesInfo, function(index, state) {
            options = '<option value="' + state.id + '" data-url="'+state.shortUrl+'">' + state.name + '</option>';
            $('#states').append(options);
            if (state.id == stateId) {
                $('#states').select2('data', {id: state.id , text: state.name});
            }
        });

        /* Locality */
        $('#localities').empty();
        $('#localities').append('<option value="All">Todos</option>');
        $.each(localitiesInfo, function(index, locality) {
            if (stateId == locality.stateId) {
                options = '<option value="' + locality.id + '" data-stateId="' + locality.stateId + '" data-url="'+locality.shortUrl+'">' + locality.name + '</option>';
                $('#localities').append(options);
                if (localityId == locality.id) {
                    $('#localities').select2('data', {id: locality.id, text: locality.name});
                }
            }
        });

        /* Property type */
        $('#pTypes').empty();
        var tempTypes = '';
        var landCount = 0;
        $.each(propertyTypesInfo, function(index, propertyTypes) {
            if (localityId == propertyTypes.localityId ) {
                if (tempTypes != propertyTypes.name ) {
                    if (propertyTypes.id != '3') {
                        options = '<input type="checkbox" name="vehicle" value="' + propertyTypes.id + '" checked> ' + propertyTypes.name + '<br>';
                        $('#pTypes').append(options);
                        tempTypes = propertyTypes.name;
                    } else {
                        landCount++;
                    }
                }
            }
        });
        if (landCount>0) {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", false);
        } else {
            $("input[type=radio][name=imtype][value='terreno']").attr("disabled", true);
        }
        if ($("input[name=vehicle]").length===0 && landCount>0) {
            $("#lbl-tyim-selected").text("Terreno");
            notify('growl-danger', 'Solo Terrenos', 'Solo se encontraron terrenos');
            $("input[type=radio][name=imtype][value='terreno']").attr("checked", true);
        } else {
            $("#lbl-tyim-selected").text("Vivienda");
            $("input[type=radio][name=imtype][value='vivienda']").attr("checked", true);
        }

        /* Availability */
        $("#dateFrom").empty();
        $("#dateTo").empty();
        $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
        $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
        var immediate = 0;
        var today = new Date();
        var dates = [];
        propertyInfo.forEach(model => {
            if (localityId == model.localityId && model.type != 3 ) {
                var availability = model.availability.split('-');
                availability = new Date(availability[0], availability[1]-1, availability[2]);
                if (availability < today) {
                    immediate++;
                } else {
                    if (dates.indexOf(model.availability) == -1) {
                        dates.push(model.availability);
                    }
                }
            }
        });
        if (immediate > 0) {
            $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
            $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
        }
        dates.sort();
        dates.forEach(date => {
            option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
            $("#dateFrom").append(option);
            $("#dateTo").append(option);
        });
        $("#dateFrom").attr('disabled', false);
        $("#dateTo").attr('disabled', false);

        /* Floors */
        $('#pFloors').empty();
        $('#pFloors').append('<option value="All">Todos</option>');
        var tempFloors = '';
        $.each(propertyFloorsInfo, function(index, propertyFloors) {
            if (localityId == propertyFloors.localityId) {
                if (tempFloors != propertyFloors.num) {
                    options = '<option value="' + propertyFloors.num + '">' + propertyFloors.num + '</option>';
                    $('#pFloors').append(options);
                    tempFloors = propertyFloors.num;
                }
            }
        });
        $('#pFloors').prop('disabled', false);

        /* Rooms */
        $('#rooms').empty();
        $('#rooms').append('<option value="All">Todos</option>');
        var tempRooms = '';
        $.each(roomsInfo, function(index, rooms) {
            if (localityId == rooms.localityId) {
                if (tempRooms != rooms.num) {
                    options = '<option value="' + rooms.num + '">' + rooms.num + '</option>';
                    $('#rooms').append(options);
                    tempRooms = rooms.num;
                }
            }
        });
        $('#rooms').prop('disabled', false);

        /* Baths */
        $('#baths').empty();
        $('#baths').append('<option value="All">Todos</option>');
        var tempBaths = '';
        $.each(bathsInfo, function(index, baths) {
            if (localityId == baths.localityId) {
                if (tempBaths != baths.num) {
                    options = '<option value="' + baths.num + '">' + baths.num + '</option>';
                    $('#baths').append(options);
                    tempBaths = baths.num;
                }
            }
        });
        $('#baths').prop('disabled', false);
        
        /* Price and Area */
        minPriceInfo = [];
        maxPriceInfo = [];
        minAreaInfo = [];
        maxAreaInfo = [];

        $.each(propertyInfo, function(index, model) {
            if (localityId == model.localityId) {
                if (model.type != 3) {
                    minPriceInfo.push(parseInt(model.price));
                    maxPriceInfo.push(parseInt(model.price));
                    minAreaInfo.push(Math.floor(model.area));
                    maxAreaInfo.push(Math.ceil(model.area));
                }
            }
        });

        var minPrice = Math.min.apply(null,minPriceInfo).toString();
        $('#minPrice').val(formatoMoneda(minPrice));

        var maxPrice = Math.max.apply(null,maxPriceInfo).toString();
        $('#maxPrice').val(formatoMoneda(maxPrice));

        var minArea = Math.min.apply(null,minAreaInfo);
        $('#minArea').val(minArea);

        var maxArea = Math.max.apply(null,maxAreaInfo);
        $('#maxArea').val(maxArea);

        /* Payment */
        var paymentMe = [];
        propertyInfo.forEach(model => {
            if (localityId == model.localityId) {
                if (model.type != 3) {
                    var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                    res.forEach(method => {
                        if (paymentMe.indexOf(method) == -1) {
                            paymentMe.push(method);
                        }
                    });
                }
            }
        });
        $("#checkMethodOpt").empty();
        paymentMe.forEach(element => {
            opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
            $("#checkMethodOpt").append(opt);
        });

        getNumberOfDevs();
    } else {
        $("#states").change();
    }

});


function getMinAndMax(housingType) {
    var state = $("#states").val();
    var locality = $("#localities").val();
    var zone = $("#zones").val();
    var minPriceInfo = [];
    var maxPriceInfo = [];
    var minAreaInfo = [];
    var maxAreaInfo = [];
    var immediate = 0;
    var today = new Date();
    var dates = [];
    var paymentMe = [];
    if(housingType == 'vivienda'){
        var types = [];
        $('input:checkbox[name=vehicle]:checked').each(function(){types.push(parseInt($(this).val()));});
        if (zone != 'All') {
            /* Availability */
            $("#dateFrom").empty();
            $("#dateTo").empty();
            $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
            $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
            propertyInfo.forEach(model => {
                if (zone == model.zoneId && types.indexOf(model.type) > -1) {
                    var availability = model.availability.split('-');
                    availability = new Date(availability[0], availability[1]-1, availability[2]);
                    if (availability < today) {
                        immediate++;
                    } else {
                        if (dates.indexOf(model.availability) == -1) {
                            dates.push(model.availability);
                        }
                    }
                }
            });
            if (immediate > 0) {
                $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
            }
            dates.sort();
            dates.forEach(date => {
                option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                $("#dateFrom").append(option);
                $("#dateTo").append(option);
            });
            $("#dateFrom").attr('disabled', false);
            $("#dateTo").attr('disabled', false);
            $.each(propertyInfo, function(index, model) {
                if (zone == model.zoneId) {
                    if (types.indexOf(model.type) > -1) {
                        minPriceInfo.push(parseInt(model.price));
                        maxPriceInfo.push(parseInt(model.price));
                        minAreaInfo.push(Math.floor(model.area));
                        maxAreaInfo.push(Math.ceil(model.area));
                    }
                }
            });
            /* Payment */
            propertyInfo.forEach(model => {
                if (zone == model.zoneId) {
                    if (types.indexOf(model.type) > -1) {
                        var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                        res.forEach(method => {
                            if (paymentMe.indexOf(method) == -1) {
                                paymentMe.push(method);
                            }
                        });
                    }
                }
            });
            $("#checkMethodOpt").empty();
            paymentMe.forEach(element => {
                opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                $("#checkMethodOpt").append(opt);
            });
        } else {
            if (locality != 'All') {
                /* Availability */
                $("#dateFrom").empty();
                $("#dateTo").empty();
                $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
                $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
                propertyInfo.forEach(model => {
                    if (locality == model.localityId && types.indexOf(model.type) > -1) {
                        var availability = model.availability.split('-');
                        availability = new Date(availability[0], availability[1]-1, availability[2]);
                        if (availability < today) {
                            immediate++;
                        } else {
                            if (dates.indexOf(model.availability) == -1) {
                                dates.push(model.availability);
                            }
                        }
                    }
                });
                if (immediate > 0) {
                    $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                    $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
                }
                dates.sort();
                dates.forEach(date => {
                    option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                    $("#dateFrom").append(option);
                    $("#dateTo").append(option);
                });
                $("#dateFrom").attr('disabled', false);
                $("#dateTo").attr('disabled', false);
                $.each(propertyInfo, function(index, model) {
                    if (locality == model.localityId) {
                        if (types.indexOf(model.type) > -1) {
                            minPriceInfo.push(parseInt(model.price));
                            maxPriceInfo.push(parseInt(model.price));
                            minAreaInfo.push(Math.floor(model.area));
                            maxAreaInfo.push(Math.ceil(model.area));
                        }
                    }
                });
                /* Payment */
                propertyInfo.forEach(model => {
                    if (locality == model.localityId) {
                        if (types.indexOf(model.type) > -1) {
                            var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                            res.forEach(method => {
                                if (paymentMe.indexOf(method) == -1) {
                                    paymentMe.push(method);
                                }
                            });
                        }
                    }
                });
                $("#checkMethodOpt").empty();
                paymentMe.forEach(element => {
                    opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                    $("#checkMethodOpt").append(opt);
                });
            } else {
                /* Availability */
                $("#dateFrom").empty();
                $("#dateTo").empty();
                $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
                $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
                propertyInfo.forEach(model => {
                    if (state == model.stateId && types.indexOf(model.type) > -1) {
                        var availability = model.availability.split('-');
                        availability = new Date(availability[0], availability[1]-1, availability[2]);
                        if (availability < today) {
                            immediate++;
                        } else {
                            if (dates.indexOf(model.availability) == -1) {
                                dates.push(model.availability);
                            }
                        }
                    }
                });
                if (immediate > 0) {
                    $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                    $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
                }
                dates.sort();
                dates.forEach(date => {
                    option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                    $("#dateFrom").append(option);
                    $("#dateTo").append(option);
                });
                $("#dateFrom").attr('disabled', false);
                $("#dateTo").attr('disabled', false);
                $.each(propertyInfo, function(index, model) {
                    if (state == model.stateId) {
                        if (types.indexOf(model.type) > -1) {
                            minPriceInfo.push(parseInt(model.price));
                            maxPriceInfo.push(parseInt(model.price));
                            minAreaInfo.push(Math.floor(model.area));
                            maxAreaInfo.push(Math.ceil(model.area));
                        }
                    }
                });
                /* Payment */
                propertyInfo.forEach(model => {
                    if (state == model.stateId) {
                        if (types.indexOf(model.type) > -1) {
                            var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                            res.forEach(method => {
                                if (paymentMe.indexOf(method) == -1) {
                                    paymentMe.push(method);
                                }
                            });
                        }
                    }
                });
                $("#checkMethodOpt").empty();
                paymentMe.forEach(element => {
                    opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                    $("#checkMethodOpt").append(opt);
                });
            }
        }
    } else {
        if (zone != 'All') {
            /* Availability */
            $("#dateFrom").empty();
            $("#dateTo").empty();
            $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
            $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
            propertyInfo.forEach(model => {
                if (zone == model.zoneId && model.type == 3) {
                    var availability = model.availability.split('-');
                    availability = new Date(availability[0], availability[1]-1, availability[2]);
                    if (availability < today) {
                        immediate++;
                    } else {
                        if (dates.indexOf(model.availability) == -1) {
                            dates.push(model.availability);
                        }
                    }
                }
            });
            if (immediate > 0) {
                $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
            }
            dates.sort();
            dates.forEach(date => {
                option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                $("#dateFrom").append(option);
                $("#dateTo").append(option);
            });
            $("#dateFrom").attr('disabled', false);
            $("#dateTo").attr('disabled', false);
            $.each(propertyInfo, function(index, model) {
                if (zone == model.zoneId) {
                    if (model.type == 3) {
                        minPriceInfo.push(parseInt(model.price));
                        maxPriceInfo.push(parseInt(model.price));
                        minAreaInfo.push(Math.floor(model.landArea));
                        maxAreaInfo.push(Math.ceil(model.landArea));
                    }
                }
            });
            /* Payment */
            propertyInfo.forEach(model => {
                if (zone == model.zoneId) {
                    if (model.type == 3) {
                        var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                        res.forEach(method => {
                            if (paymentMe.indexOf(method) == -1) {
                                paymentMe.push(method);
                            }
                        });
                    }
                }
            });
            $("#checkMethodOpt").empty();
            paymentMe.forEach(element => {
                opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                $("#checkMethodOpt").append(opt);
            });
        } else {
            if (locality != 'All') {
                /* Availability */
                $("#dateFrom").empty();
                $("#dateTo").empty();
                $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
                $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
                propertyInfo.forEach(model => {
                    if (locality == model.localityId && model.type == 3) {
                        var availability = model.availability.split('-');
                        availability = new Date(availability[0], availability[1]-1, availability[2]);
                        if (availability < today) {
                            immediate++;
                        } else {
                            if (dates.indexOf(model.availability) == -1) {
                                dates.push(model.availability);
                            }
                        }
                    }
                });
                if (immediate > 0) {
                    $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                    $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
                }
                dates.sort();
                dates.forEach(date => {
                    option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                    $("#dateFrom").append(option);
                    $("#dateTo").append(option);
                });
                $("#dateFrom").attr('disabled', false);
                $("#dateTo").attr('disabled', false);
                $.each(propertyInfo, function(index, model) {
                    if (locality == model.localityId) {
                        if (model.type == 3) {
                            minPriceInfo.push(parseInt(model.price));
                            maxPriceInfo.push(parseInt(model.price));
                            minAreaInfo.push(Math.floor(model.landArea));
                            maxAreaInfo.push(Math.ceil(model.landArea));
                        }
                    }
                });
                /* Payment */
                propertyInfo.forEach(model => {
                    if (locality == model.localityId) {
                        if (model.type == 3) {
                            var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                            res.forEach(method => {
                                if (paymentMe.indexOf(method) == -1) {
                                    paymentMe.push(method);
                                }
                            });
                        }
                    }
                });
                $("#checkMethodOpt").empty();
                paymentMe.forEach(element => {
                    opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                    $("#checkMethodOpt").append(opt);
                });
            } else {
                /* Availability */
                $("#dateFrom").empty();
                $("#dateTo").empty();
                $("#dateFrom").append('<option value="' + minAvailability + '">Todos</option>');
                $("#dateTo").append('<option value="' + maxAvailability + '">Todos</option>');
                propertyInfo.forEach(model => {
                    if (state == model.stateId && model.type == 3) {
                        var availability = model.availability.split('-');
                        availability = new Date(availability[0], availability[1]-1, availability[2]);
                        if (availability < today) {
                            immediate++;
                        } else {
                            if (dates.indexOf(model.availability) == -1) {
                                dates.push(model.availability);
                            }
                        }
                    }
                });
                if (immediate > 0) {
                    $("#dateFrom").append('<option value="' + minAvailability + '">Inmediata</option>');
                    $("#dateTo").append('<option value="'+ today.getFullYear() + "-" + (((today.getMonth()+1) < 10) ? "0"+(today.getMonth()+1) : (today.getMonth()+1)) + "-" + (((today.getDate()) < 10) ? "0"+(today.getDate()) : (today.getDate())) +'">Inmediata </option>');
                }
                dates.sort();
                dates.forEach(date => {
                    option = '<option value="' + date + '">' + formatedDateByMonth(date) + '</option>';
                    $("#dateFrom").append(option);
                    $("#dateTo").append(option);
                });
                $("#dateFrom").attr('disabled', false);
                $("#dateTo").attr('disabled', false);
                $.each(propertyInfo, function(index, model) {
                    if (state == model.stateId) {
                        if (model.type == 3) {
                            minPriceInfo.push(parseInt(model.price));
                            maxPriceInfo.push(parseInt(model.price));
                            minAreaInfo.push(Math.floor(model.landArea));
                            maxAreaInfo.push(Math.ceil(model.landArea));
                        }
                    }
                });
                /* Payment */
                propertyInfo.forEach(model => {
                    if (state == model.stateId) {
                        if (model.type == 3) {
                            var res = (model.paymentMethod != null) ? model.paymentMethod.split(",") : [];
                            res.forEach(method => {
                                if (paymentMe.indexOf(method) == -1) {
                                    paymentMe.push(method);
                                }
                            });
                        }
                    }
                });
                $("#checkMethodOpt").empty();
                paymentMe.forEach(element => {
                    opt = '<input type="checkbox" name="methodPay" value="'+element+'" data-label="'+paymentData.get(element).toLocaleLowerCase()+'" checked=""> '+paymentData.get(element)+'<br>';
                    $("#checkMethodOpt").append(opt);
                });
            }
        }
    }
    var minPrice = Math.min.apply(null,minPriceInfo).toString();
    $('#minPrice').val(formatoMoneda(minPrice));

    var maxPrice = Math.max.apply(null,maxPriceInfo).toString();
    $('#maxPrice').val(formatoMoneda(maxPrice));

    var minArea = Math.min.apply(null,minAreaInfo);
    $('#minArea').val(minArea);

    var maxArea = Math.max.apply(null,maxAreaInfo);
    $('#maxArea').val(maxArea);
}

$("#pTypes").change(function() {
    housingType = 'vivienda';
    getMinAndMax(housingType);
    getNumberOfDevs();
});

$("#apply").click(function() {
    var type = $("input[type=radio][name=imtype]:checked").val();
    housingType = type;
    if (type == "vivienda") {
        $("#pFloors").attr("disabled", false);
        $("#rooms").attr("disabled", false);
        $("#baths").attr("disabled", false);
    } else {
        $("#pFloors").attr("disabled", true);
        $("#rooms").attr("disabled", true);
        $("#baths").attr("disabled", true);
    }
    getMinAndMax(housingType);
    getNumberOfDevs();
});

$("#applyMethod").click( function () {
    getNumberOfDevs();
});

$("#dateFrom").change( function () {
    getNumberOfDevs();
});

$("#dateTo").change( function () {
    getNumberOfDevs();
});

$("#pFloors").change(function() {
    getNumberOfDevs();
});

$("#rooms").change(function() {
    getNumberOfDevs();
});

$("#baths").change(function() {
    getNumberOfDevs();
});

$("#minPrice").keyup(function() {
    var minPrice = $('#minPrice').val().replace(/,/g, '');
    if (minPrice.substring(0,1) == '$') { minPrice = minPrice.substring(1); }
    $('#minPrice').val(formatoMoneda(minPrice));
    getNumberOfDevs();
});

$("#maxPrice").keyup(function() {
    var maxPrice = $('#maxPrice').val().replace(/,/g, '');
    if (maxPrice.substring(0,1) == '$') { maxPrice = maxPrice.substring(1); }
    $('#maxPrice').val(formatoMoneda(maxPrice));
    getNumberOfDevs();
});

$("#minArea").keyup(function() {
    getNumberOfDevs();
});

$("#maxArea").keyup(function() {
    getNumberOfDevs();
});

$("#developers").change(function () {
    getNumberOfDevs(false);
});

function getNumberOfDevs( fill = true ) {
    $("#developmentList").hide();
    var devTemp_1 = [];
    var devTemp_2 = [];
    var zoneId = $('#zones').val();
    var stateId = $('#states').val();
    var localityId = $('#localities').val();
    var global = $("input[type=radio][name=imtype]:checked").val();
    var types = [];
    if (global == "vivienda") {
        $('input:checkbox[name=vehicle]:checked').each(function(){types.push(parseInt($(this).val()));});
    } else {
        types.push(3);
    }
    var payment = [];
    $('input:checkbox[name=methodPay]:checked').each(function(){payment.push($(this).val());});
    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();
    if(dateFrom>dateTo){
        var temp = dateTo;
        dateTo = dateFrom;
        dateFrom = temp;
        notify('growl-danger', 'Rango de fechas', 'Desde es mayor que Hasta. Las fechas Desde y Hasta se intercambiarion.');
    }
    var floors = $('#pFloors').val();
    var rooms = $('#rooms').val();
    var baths = $('#baths').val();
    var minPrice = $('#minPrice').val().replace(/,/g, '');
    if (minPrice.substring(0,1) == '$') { minPrice = minPrice.substring(1); }
    minPrice = parseInt(minPrice)-(parseInt(minPrice)%10000);
    var maxPrice = $('#maxPrice').val().replace(/,/g, '');
    if (maxPrice.substring(0,1) == '$') { maxPrice = maxPrice.substring(1); }
    maxPrice = ((parseInt(maxPrice)%10000)===0) ? maxPrice:parseInt(maxPrice)+(10000-(parseInt(maxPrice)%10000));
    var minArea = $('#minArea').val();
    var maxArea = $('#maxArea').val();

    devTemp_1 = propertyInfo.slice();

    if (zoneId != 'All') devTemp_1 = devTemp_1.filter((model) => zoneId == model.zoneId);

    if (stateId != 'All') devTemp_1 = devTemp_1.filter((model) => stateId == model.stateId);

    if (localityId != 'All') devTemp_1 = devTemp_1.filter((model) => localityId == model.localityId);

    if (types.length > 0) devTemp_1 = devTemp_1.filter((model) => types.indexOf(model.type) > -1);

    if (payment.length < 6 && payment.length > 0) {
        devTemp_1 = devTemp_1.filter((model) => {
            if (model.paymentMethod != null) {
                let agregado = false;
                for (let index = 0; index < payment.length; index++) {
                    if( (model.paymentMethod.indexOf(payment[index]) > -1)  &&  !agregado) {
                        agregado = true;
                        return model;
                    }
                }
            }
        });
        
    }

    if (dateFrom != '' && dateTo != '') devTemp_1 = devTemp_1.filter((model) => dateFrom <= model.availability && model.availability <= dateTo);
    
    if (floors != 'All') devTemp_1 = devTemp_1.filter((model) => model.floors <= floors);
    
    if (rooms != 'All') devTemp_1 = devTemp_1.filter((model) => model.rooms >= rooms);
    
    if (baths != 'All') devTemp_1 = devTemp_1.filter((model) => model.baths >= baths);
    
    if ((minPrice != '') && (maxPrice != '')) devTemp_1 = devTemp_1.filter((model) => (Math.trunc(model.price) >= Math.trunc(minPrice)) && (Math.trunc(model.price) <= Math.trunc(maxPrice)));

    if ((minArea != '') && (maxArea != '')) {
        if (types[0] != 3) {
            devTemp_1 = devTemp_1.filter((model) => (Math.trunc(model.area) >= minArea) && (Math.trunc(model.area) <= maxArea));
        } else {
            devTemp_1 = devTemp_1.filter((model) => (Math.trunc(model.landArea) >= minArea) && (Math.trunc(model.landArea) <= maxArea));
        }
    }

    if (fill) {
        $("#developers").empty();
        devTemp_1.forEach(model => {
            var newOption = new Option();
            if ( $("#developers option[value='"+model.developerId+"']").length == 0 ) {
                newOption = new Option(model.developerName, model.developerId, false, true);
                $('#developers').append(newOption);
            }
        });
        $('#developers').select2();
        $('#developers').attr('disabled', false);

    } else {
        $("#developments").empty();
        var developers = $('#developers').val();
        if (developers != null) {
            // devTemp_2 = [];
            // $.each(devTemp_1, function(index, model) {
            //     if (developers.indexOf(model.developerId) > -1) {
            //         devTemp_2.push(model);
            //     }
            // });
            // devTemp_1 = [];
            // devTemp_1 = devTemp_2.slice();
            devTemp_1 = devTemp_1.filter((model) => developers.indexOf(model.developerId) > -1);
        } else {
            console.log('Sin desarrolladores');
        }
    }

    $("#developments").empty();
    devTemp_1.forEach(model => {
        var newOption = new Option();
        if ( $("#developments option[value='"+model.developmentId+"']").length == 0 ) {
            newOption = new Option(model.developmentName+ " "+ model.developmentId , model.developmentId, false, true);
            $('#developments').append(newOption);
        }
    });
    $('#developments').select2();
    $("#developments").change();
}

$("#developments").change(function (e) {
    e.preventDefault();
    var developments = $(this).val();
    if (developments == null) {
        $("#filterRes").hide();
        $("#openModalMap").hide();
        $("#openSC").hide();
        return;
    }
    var zoneId = $('#zones').val();
    var zoneName = $("#zones").find('option:selected').text();
    var stateId = $('#states').val();
    var stateName = $("#states").find('option:selected').text();
    var localityId = $('#localities').val();
    var localityName = $("#localities").find('option:selected').text();
    var numberOfDevelopments = developments.length;
    var location = "";
    if( zoneId != "All" ) {
        location = zoneName;
    } else {
        if ( localityId != "All" ) {
            location = localityName + ", " + stateName;
        } else {
            location = stateName;
        }
    }
    var resultText;
    if (numberOfDevelopments > 0) {
        if (zoneId != "All" || stateId != "All" ) {
            if (numberOfDevelopments == 1) {
                resultText = "En " + location + " contamos con 1 Desarrollo que te puede interesar, permíteme mostrarte un mapa para que puedas ver la ubicación";
                $("#filterResult").html(resultText);
                $("#copyFilter").attr("name", resultText);
                $("#filterRes").show();
            } else {
                resultText = "En " + location + " contamos con " + numberOfDevelopments + " Desarrollos que te pueden interesar, permíteme mostrarte un mapa para que puedas ver la ubicación";
                $("#filterResult").html(resultText);
                $("#copyFilter").attr("name", resultText);
                $("#filterRes").show();
            }
        } else {
            if (numberOfDevelopments == 1) {
                // resultText = "En " + location + " contamos con 1 desarrollo con las características que te interesan, permíteme mostrarte un mapa para que puedas ver la ubicación";
                developmentsInfo.forEach(development => {
                    if (developments[0] == development.id) {
                        resultText = `Conoce el Desarrollo ID: ${development.id} en ${development.locality}, ${development.state}, permíteme mostrarte un mapa para que puedas ver la ubicación`;
                    }
                });
                $("#filterResult").html(resultText);
                $("#copyFilter").attr("name", resultText);
                $("#filterRes").show();
            }
        }        
        
        $("#openModalMap").hide();
        $("#openSC").hide();
    } else {
        notify('growl-danger', 'Sin resultados', 'No se encontraron desarrollos con los filtros ingesados.');
        $("#filterRes").hide();
    }
});

var paramsURL = '';
$(document).on("click", "#getDataDev", function (e) {
    e.preventDefault();
    var zoneId =  $('#zones').val();
    if (zoneId == 'All') {zoneId = '';}
    var stateId = $('#states').val();
    if (stateId == 'All') {stateId = '';}
    var localityId = $('#localities').val();
    if (localityId == 'All') {localityId = '';}
    var developments = $("#developments").val();
    if (developments == null) {
        developments = [];
        return;
    }
    if (developments.length == 1) {
        developmentsInfo.forEach(development => {
            if (developments[0] == development.id) {
                zoneId = '';
                stateId = development.stateId;
                localityId = development.localityId;
            }
        });
    }

    developments = developments.join(',');

    $("#map").hide();
    $(".openMapModal").click();
    $("#loadingMap").show();
    $.ajax({
        type: 'POST',
        data: {type:'getFilteredDevelopments',zoneId:zoneId,stateId:stateId,localityId:localityId,developments:developments},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response) {
            var infowindow = new google.maps.InfoWindow();
            var position = {lat: parseFloat(response.latitude), lng: parseFloat(response.longitude)};
            var zoom = response.zoom;
            if (zoom == null) zoom = 11;
            zoom = parseInt(zoom);
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: zoom,
                center: position,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            google.maps.event.addListener(map, 'zoom_changed', function(ee) {
                google.maps.event.addListenerOnce(map, 'bounds_changed', function(e) {
                    zoomLevel = map.getZoom();
                    if (zoomLevel >= 12) {
                        $('#mapSubmenu').css('display', 'block');
                    } else {
                        $('#mapSubmenu').css('display', 'none');
                        removeMarkerPlaces();
                    }
                });
            });
            var cont = 0;
            var string = '';
            $("#developmentList").empty();
            $("#developmentList").append("<h4>Resultados</h4>");
            response.development.forEach(development => {
                markerLat = parseFloat(development.latitude);
                markerLng = parseFloat(development.longitude);
                marker = new google.maps.Marker({position: {lat: markerLat, lng: markerLng}, markerId: cont, map: map, label: labels[cont]});
                google.maps.event.addListener(marker, 'mouseover', (function(marker, cont) {
                    return function() {
                        infowindow.setContent(development.name);
                        infowindow.open(map, marker);
                    };
                })(marker, cont));
                google.maps.event.addListener(marker, 'click', (function(marker, cont) {
                    return function() {
                        removeMarkerPlaces();
                        $('#mapSubmenu').css('display', 'block');
                        $('#showSchools').html('Mostrar Escuelas');
                        $('#showHospitals').html('Mostrar Hospitales');
                        $('#showInterestSites').html('Mostrar Sitios de Interés');
                        map.setZoom(12);
                        map.setCenter({lat: parseFloat(development.latitude), lng: parseFloat(development.longitude)});
                    };
                })(marker, cont));                   
                google.maps.event.addListener(marker, 'mouseout', function() {
                    infowindow.close();
                }); 
                string = '';
                registerButton = '';
                if (developerRegister.indexOf(development.developerId) > -1) { registerButton = `<button class="btn buttonDev registerButton" name="${development.developerId}-${development.stateId}-${development.id}">Registrar</button>`; }
                rooms = (development.maxRooms == development.minRooms) ? `Recamaras ${development.maxRooms}` : `Recamaras ${development.minRooms} - ${development.maxRooms}`;
                baths = (development.maxBaths == development.minBaths) ? `Baños ${development.maxBaths}` : `Baños ${development.minBaths} - ${development.maxBaths}`;
                developmetText = `Conoce el desarrollo ID: ${development.id} en ${development.localityName}, ${development.stateName} en esta liga ${development.urlDev}`;
                // developmetText = `Conoce ${development.name} en ${development.localityName}, ${development.stateName} en esta liga ${development.urlDev}`;
                updateUrlButton = '';
                if(development.urlDev.indexOf("tratod") > 0){
                    updateUrlButton = `<button class="btn buttonDev updateUrl" name="${development.id}">Actualizar url</button>`;
                };
                saleArguments = '';
                if (development.saleArguments != '' && development.saleArguments != null) {
                    saleArguments = `<div class="col-sm-9 col-md-12 col-xl-9 spaceRigth spaceUp">
                                        ${development.saleArguments}
                                    </div>
                                    <div class="col-sm-3 col-md-12 col-xl-3 spaceRigth spaceUp">
                                        <button class="btn buttonDev buttonSend" name="${development.saleArguments}" >Enviar</button>
                                    </div>`;
                }
                string = `<div class="row spaceUp">
                            <div class="col-xs-12">
                                ${labels[cont]}: ${development.name}, ${development.developer}<br>
                                ${formatoMoneda(development.minPrice)} - ${formatoMoneda(development.maxPrice)} / ${rooms} / ${baths}<br>
                            </div>
                            <div class="col-sm-9 col-md-12 col-xl-8 spaceRigth spaceUp">
                                ${labels[cont]}: ${developmetText}
                            </div>
                            <div class="col-sm-3 col-md-12 col-xl-4 spaceRigth spaceUp">
                                <div class="row">
                                    <div class="col-xs-6 col-md-6 col-xl-6 spaceRigth"><button class="btn buttonDev buttonSend offerSend" name="${labels[cont]}: ${developmetText}" data-dev= "${development.id}">Enviar</button></div>
                                    <div class="col-xs-6 col-md-6 col-xl-6 spaceRigth"><a class="btn buttonDev buttonOpen" href="${development.urlDev}" target="_blank">Abrir</a></div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-6 col-md-6 col-xl-6 spaceRigth"><button class="btn buttonDev detailDev" name="${development.id}">Detalle</button></div>
                                    <div class="col-xs-6 col-md-6 col-xl-6 spaceRigth">${registerButton}</div>
                                </div>
                                <div class="row">
                                    <div class="col-xs-12 col-md-12 col-xl-12 spaceRigth">${updateUrlButton}</div>
                                </div>
                            </div>
                            ${saleArguments}
                        </div>
                        <hr>`;
                $("#developmentList").append(string);
                cont++;
            });
            $("#developmentList").show();
            $("#openModalMap").show();
            // $("#openSC").show();
            $("#loadingMap").hide();
            $("#map").show();
        }
    });
});

$(document).on("click", ".buttonSend", function (e) {
    e.preventDefault();
    var text = $(this).attr("name");
    // var developmentId = $(this).attr("data-dev");
    // if(developmentId != undefined){
    //     $("#message").attr("data-offer", developmentId);
    // } else {
    //     $("#message").attr("data-offer", 0);
    // }
    $("#message").html(text);
    $("#message").focus();
});

$(document).on("click", ".detailDev", function (e) {
    e.preventDefault();
    var developmentId = $(this).attr("name");
    var params = `map.php?developmentId=${developmentId}`;
    var redirectWindow = window.open(params, '_blank');
    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function (data) {
            redirectWindow.location;
        }
    });
});

$(document).on("click", ".registerButton", function (e) {
    e.preventDefault();
    var text = $(this).attr("name");
    var accredited = $("#accredited").val();
    $("#constructorData").click();
    setTimeout(() => {
        $("input:radio[data-num='"+accredited+"']").prop("checked", true);
        $("input:radio[data-num='"+accredited+"']").change();
    }, 2000);
    text = text.split("-");
    setTimeout(() => {
        $(".api-data-developer option[value='"+text[0]+"']").attr("selected", true);
        $(".api-data-developer").change();
    }, 3000);
    setTimeout(() => {
        $(".api-data-states option[value='"+text[1]+"']").attr("selected", true);
        $(".api-data-states").change();
    }, 4000);
    setTimeout(() => {
        $(".api-data-developments option[value='"+text[2]+"']").attr("selected", true);
        $(".api-data-developments").change();
    }, 5500);
});

$(document).on("click", "#openModalMap", function (e) {
    e.preventDefault();
    $(".openMapModal").click();
});

$(document).on("click", "#openSC", function (e) {
    e.preventDefault();
    var redirectWindow = window.open(paramsURL, '_blank');
    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function (data) {
            redirectWindow.location;
        }
    });
});

$(document).on("click", "#showSchools", function(e) {
    e.preventDefault();
    var text = $('#showSchools').html();
    if (text == 'Mostrar Escuelas') {
        $('#showSchools').html('Ocultar Escuelas');
        getPlaces('school');
    } else {
        $('#showSchools').html('Mostrar Escuelas');
        for (var i = 0; i < markerSchools.length; i++ ) {
            markerSchools[i].setMap(null);
        }
        markerSchools = [];
    }
});

$(document).on("click", "#showHospitals", function(e) {
    e.preventDefault();
    var text = $('#showHospitals').html();
    if (text == 'Mostrar Hospitales') {
        $('#showHospitals').html('Ocultar Hospitales');
        getPlaces('hospital');
    } else {
        $('#showHospitals').html('Mostrar Hospitales');
        for (var i = 0; i < markerHospitals.length; i++ ) {
            markerHospitals[i].setMap(null);
        }
        markerHospitals = [];
    }
});

$(document).on("click", "#showInterestSites", function(e) {
    e.preventDefault();
    var text = $('#showInterestSites').html();
    if (text == 'Mostrar Sitios de Interés') {
        $('#showInterestSites').html('Ocultar Sitios de Interés');
        getPlaces('point_of_interest');
    } else {
        $('#showInterestSites').html('Mostrar Sitios de Interés');
        for (var i = 0; i < markerInterestSite.length; i++ ) {
            markerInterestSite[i].setMap(null);
        }
        markerInterestSite = [];
    }
});

function getPlaces(placeType) {
    markerType = placeType;
    var center = map.getCenter();
    var request = {
        location: {lat: parseFloat(center.lat()), lng: parseFloat(center.lng())},
        radius: '5000',
        type: [placeType]
    };
    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, callback);
}

var markerType = '';
var markersPlace = [];
var markerSchools = [];
var markerHospitals = [];
var markerInterestSite = [];
function callback(results, status) {
    var i = 0;
    var infowindow = new google.maps.InfoWindow();  
    markerPlace = [];
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        $.each(results, function(index, place) {  
            var icon = {
                url: place.icon, 
                scaledSize: new google.maps.Size(20,20), 
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(0,0) 
            };
            if (markerType == 'school') {
                markerPlace = new google.maps.Marker({position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}, map: map});
                markerPlace.setIcon(icon);
                markersPlace.push(markerPlace);
                markerSchools.push(markerPlace);
            } else if (markerType == 'hospital') {
                markerPlace = new google.maps.Marker({position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}, map: map});
                markerPlace.setIcon(icon);
                markersPlace.push(markerPlace);
                markerHospitals.push(markerPlace);
            } else if (markerType == 'point_of_interest') {
                markerPlace = new google.maps.Marker({position: {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}, map: map});
                markerPlace.setIcon(icon);
                markersPlace.push(markerPlace);
                markerInterestSite.push(markerPlace);
            }
            google.maps.event.addListener(markerPlace, 'mouseover', (function(markerPlace, i) {
                return function() {
                    infowindow.setContent(place.name);
                    infowindow.open(map, markerPlace);
                };
            })(markerPlace, i));
            google.maps.event.addListener(markerPlace, 'mouseout', function() {
                infowindow.close();
            });  
            i++;
        });
    }
}

function removeMarkerPlaces() {
    for (var i = 0; i < markersPlace.length; i++ ) {
        markersPlace[i].setMap(null);
    }
    markersPlace.length = 0;
}

$(document).on("click", ".offerSend", function (e) {
    e.preventDefault();
    var developmentId = $(this).attr("data-dev");
    // var developmentId = $("#message").attr("data-offer");
    if ( developmentId != 0 && developmentId != undefined && developmentId != null ) {
        var today=new Date();
        today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds() )/1000;
        $.ajax({
            type: 'POST',
            data: {type:'registerOffer', hubSpotContactId:gHubSpotContactId,developmentId:developmentId,date:today},
            url: './php/filterMessagingData.php',
            dataType: 'json',
            success: function(response){
                if(response == 'timeout'){
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response) {
                        // $("#message").attr('data-offer', 0);
                        notify("growl-success", "Agregado", "Se agrego correctamente la oferta");
                        getOfferSale();
                    } else {
                        notify("growl-danger", "Error", "Error al registrar la oferta");
                    }
                }
            }
        });
    }
});

function registerOffer(hubSpotContactId) {
    
}

function getOfferSale() {
    $("#offerDataContainer").empty();
    $("#offerDataContainer").html('<div style="padding:8px;" align="center"><img src="images/loading.gif" style="width:48px;"></div>');
    $.ajax({
        type: 'POST',
        data: {type:'getOfferSale', hubSpotContactId:gHubSpotContactId},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                $("#offerDataContainer").empty();
                if (response.length != 0) {
                    $("#offerCount").html('Oferta enviada ('+response.length+')');
                    response.forEach(element => {
                        baths = `Baños ${element.minBaths}`;
                        if (element.minBaths != element.maxBaths) baths += `-${element.maxBaths}`;
                        rooms = `Récamaras ${element.minRooms}`;
                        if (element.minRooms != element.maxRooms) rooms += `-${element.maxRooms}` ;
                        options = `<option value="0" data-development="" data-user="">Seleccina una opción</option>`;
                        bestFeature.forEach(option => {
                            if (element.bestFeature == option.id) {
                                options += `<option value="${option.id}"selected>${option.name}</option>`;
                            } else {
                                options += `<option value="${option.id}" data-development="${element.developmentId}" data-user="${gHubSpotContactId}">${option.name}</option>`;
                            }
                        });
                        modelsOption = "";
                        element.models.forEach(model => {
                            modelsOption += `<option value="${model.id}">${model.name} ${formatoMoneda(model.price)}</option>`;
                        });
                        string = `<div class="offer">
                                ${element.date}<br>
                                <label class="detailDev" name="${element.developmentId}" style="cursor: pointer;color:#428BCA;">${element.developmentId} ${element.developmentName}, ${element.localityName}, ${element.stateName} (${element.developerName})</label><br>
                                ${formatoMoneda(element.minPrice)}-${formatoMoneda(element.maxPrice)} / ${rooms} / ${baths}<br>
                                <select class="changeFeature" data-development="${element.developmentId}" data-user="${gHubSpotContactId}" style="max-width: 48%;margin-bottom: 5px;">${options}</select>&nbsp;&nbsp;<br>
                                <select class="changeModelAppo" id="selectAppo-${element.developmentId}" style="max-width: 48%;" ${(!element.models.length) ? "disabled" : ""}>${modelsOption}</select>&nbsp;&nbsp;
                                <button class="btn btn-primary btn-appo" id="btnAppo-${element.developmentId}" data-dev="${element.developmentId}" data-mod=${(element.models.length) ? element.models[0].id : ""} data-hubspotId=${gHubSpotContactId} ${(!element.models.length) ? "disabled" : ""}>Agendar Cita</button>
                                </div>
                        `;
                        $("#offerDataContainer").append(string);
                    });
                } else {
                    $("#offerCount").html('Oferta enviada ('+response.length+')');
                    $("#offerDataContainer").append("<div style='text-align: center;'>No hay informacion</div>");
                }
            }
        }
    });
}

$(document).on("change", ".changeModelAppo", function (e) {
    e.preventDefault();
    var id = $(this).attr("id");
    id = id.split("-")[1];
    var modelId = $(this).val();
    $("#btnAppo-"+id).attr("data-mod", modelId);
});

$(document).on("click", ".btn-appo", function (e) {
    e.preventDefault();
    var developmentId = $(this).attr("data-dev");
    var modelId = $(this).attr("data-mod");
    var product = $("#sync_credit_type").val();
    if (product == '') {
        notify('growl-danger', 'Datos insuficientes', 'No se ha ingresado un producto valido.');
        return;
    }
    var budget = $("#sync_house_budget").val();
    if (budget == '') {
        notify('growl-danger', 'Datos insuficientes', 'No se ha ingresado un presupuesto valido.');
        return;
    }
    var params = `userAppointment.php?developmentId=${developmentId}&modelId=${modelId}&hubspotId=${gHubSpotContactId}`;
    var redirectWindow = window.open(params, '_blank');
    $.ajax({
        type: 'POST',
        url: '/echo/json/',
        success: function (data) {
            redirectWindow.location;
        }
    });
});

$(document).on("change", ".changeFeature", function (e) {
    var featureId = $(this).val();
    if (featureId != 0) {
        var developmentId = $(this).attr('data-development');
        var userId = $(this).attr('data-user');
        $.ajax({
            type: 'POST',
            data: {type:'setBestFeature', featureId:featureId, developmentId:developmentId, userId:userId},
            url: './php/filterMessagingData.php',
            dataType: 'json',
            success: function(response){
                if(response == 'timeout'){
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response) {
                        notify("growl-success", "Actualizado", "Actualizado correctamente");
                    } else {
                        notify("growl-danger", "Error", "Error al actualizar, intentalo mas tarde");
                    }
                }
            }
        });
    }
});

$(document).on("change", "#fileContactInput", function(e) {
    e.preventDefault();
    readURLFile(this);
});

function readURLFile(input) {
    var namefile = '';
    if (input.files && input.files[0]) {
        namefile = input.files[0].name;
        var reader = new FileReader();
        reader.onload = function(e) {
            $("#fileContactUpload").hide();
            $('#fileSource').attr('name', e.target.result);
            $("#fielContactName").html(namefile);
            $("#fileData").show();
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function b64toBlob(b64Data, contentType){
    contentType = contentType || '';
    sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];
    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize);
        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        var byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}

$(document).on("click", "#cancelUpload", function (e) {
    e.preventDefault();
    $("#fileContactUpload").show();
    $("#fileData").hide();
});

$(document).on("click", "#uploadFile", function (e) {
    e.preventDefault();
    var fileName = $("#fielContactName").html();
    var extension = fileName.split(".");
    extension = extension[extension.length-1];
    var fileData = $("#fileSource").attr('name').split(";");
    var typeFile = fileData[0].split(":")[1];
    var srcFile = fileData[1].split(",")[1];
    var now = new Date();
    var utcNow = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),now.getHours(),now.getMinutes(),now.getSeconds() )/1000;
    var internalName = 'File-'+gHubSpotContactId+'-'+utcNow+"."+extension;
    var myblob = b64toBlob(srcFile, typeFile);
    var data = new FormData();
    data.append("type", "uploadFileContact");
    data.append("contactId", gHubSpotContactId);
    data.append("nameFile", fileName);
    data.append("myfile", myblob, internalName);
    data.append("mimeType", typeFile);
    $.ajax({
        type: 'POST',
        data: data,
        url: "./php/filterMessagingData.php",
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response == true) {
                    getContactFiles();
                    $("#fileContactUpload").show();
                    $("#fileData").hide();
                } else if( response == 'Error al subir' ){
                    notify("growl-danger", "Error", "Error al subir el archivo, intentalo mas tarde");
                } else {
                    notify("growl-danger", "Error", "Error al registrar el archivo, solicita ayuda para registrarlo");
                }
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", "Ha ocurrido un problema, intentalo mas tarde");
        }
    });
});

function getContactFiles() {
    $("#filesDataContainer").empty();
    $("#filesDataContainer").html('<div style="padding:8px;" align="center"><img src="images/loading.gif" style="width:48px;"></div>');
    $.ajax({
        type: 'POST',
        data: {type:'getFiles', hubSpotContactId:gHubSpotContactId},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                $("#filesDataContainer").empty();
                if (response.length != 0) {
                    $("#filesCount").html('Archivos ('+response.length+')');
                    response.forEach(element => {
                        fileName = element.name;
                        if (fileName == null) { fileName = element.url.split("/")[5]; }
                        url = element.url.replace(/&/g, "&amp;");
                        string = `<div>
                                    <span class="fa fa-file"></span>&nbsp;
                                    ${element.date}
                                    <a target="_blank" href="${url}">${fileName}</a>
                                    <span name="${element.id}" class="glyphicon glyphicon-remove-sign deleteFile"></span>
                                </div>
                        `;
                        $("#filesDataContainer").append(string);
                    });
                } else {
                    $("#filesCount").html('Archivos ('+response.length+')');
                    $("#filesDataContainer").append("<div style='text-align: center;'>No hay informacion</div>");
                }
            }
        }
    });
}

$(document).on("click", ".deleteFile", function (e) {
    e.preventDefault();
    fileId = $(this).attr("name");
    $.ajax({
        type: 'POST',
        data: {type:'deleteFileContact', fileId:fileId},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    getContactFiles();
                } else {
                    notify("growl-danger", "Error", "Ha ocurrido un problema, intentalo mas tarde");
                }
            }
        }
    });
});

$(document).on("click", ".appointments-height", function(e) {
    e.preventDefault();
    $('#appointmentsDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-310+'px');
});

$(document).on("click", ".developers-height", function(e) {
    e.preventDefault();
    $('#developersDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-280+'px');
});

$(document).on("click", ".dev-height", function(e) {
    e.preventDefault();
    $('#devDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-280+'px');
});

$(document).on("click", ".offer-height", function(e) {
    e.preventDefault();
    $('#offerDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-280+'px');
});

$(document).on("click", ".leads-height", function(e) {
    e.preventDefault();
    $('#leadsDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-310+'px');
});

$(document).on("click", ".files-height", function(e) {
    e.preventDefault();
    $('#filesDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-280+'px');
});

$(document).on("click", ".hubspot-height", function(e) {
    $('#hubspotDiv').css('height', (window.innerHeight)-$('.height-reference').offset().top-328+'px');
});

$(document).on("click", ".updateUrl", function (e) {
    e.preventDefault();
    const developmentId = $(this).attr('name');
    $.ajax({
        type: 'POST',
        data: {type:'updateUrlDev', developmentId},
        url: './php/filterMessagingData.php',
        dataType: 'json',
        success: function(response){
            if(response == 'timeout'){
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Actualizado", "Se ha actualizado la url, actualiza los desarrollos");
                } else {
                    notify("growl-danger", "Error", "Ha ocurrido un problema, intentalo mas tarde");
                }
            }
        }
    });
})