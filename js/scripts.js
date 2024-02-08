$(document).ready(function () {
    getDevelopersName();
});

function getDevelopersName() {
    $.ajax({
        type: "POST",
        data: {type:"getDeveloperName"},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response){
            for(var i = 0; i < response.length; i++) {
                string = "<option value='" + response[i][0] + "'>" + response[i][1] + "</option>";
                $("#developersName").append(string);
            }
        }
    });	
}

$('#developersName').on('change', function() {
    getDevelopmentsName(this.value);
    getDeveloperInfo(this.value);
    $("#showDevButtonContainer").css("display", "block");
    $("#developerDataContainer").css("display", "block");
    $("#developmentsNameContainer").css("display", "none");
});

$(document).on("click", '#showDevButtonContainer', function(e) {
    e.preventDefault();
    $("#developmentsNameContainer").css("display", "block");
    $("#showDevButtonContainer").css("display", "none");
});

function getDevelopmentsName(developerId) {
    $.ajax({
        type: "POST",
        data: {type:"getDevelopmentName", id:developerId},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response) {
            $('#developmentsName').empty();
            for(var i = 0; i < response.length; i++) {
                string = "<option value='" + response[i][0] + "'>" + response[i][1] + "</option>";
                $("#developmentsName").append(string);
            }
        }
    });	
}

function getDeveloperInfo(developerId) {
    $.ajax({
        type: "POST",
        data: {type:"getDeveloperInfo", id:developerId},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response) {
            $("#developerFlagText").html(response[0][3]);
            $("#developerFlagLink").html("<a href='#' id='showFlagChangeForm' value='" + response[0][2] + "'><i class='fa fa-edit'></i></a>");
        }
    });	
}

$(document).on("click", '#showFlagChangeForm', function(e) {
    e.preventDefault();
    getFlags(this.getAttribute("value"));
    showHideFlagForm();
});

$(document).on("click", '#cancelChangeFlag', function(e) {
    e.preventDefault();
    showHideFlagForm();
});

function showHideFlagForm() {
    if($('#changeFlagForm').css('display') == 'none') {
        $("#changeFlagForm").css("display", "block");
        $("#developerFlagContainer").css("display", "none");
    } else {
        $("#changeFlagForm").css("display", "none");
        $("#developerFlagContainer").css("display", "block");     
    }
}

function getFlags(flag) {
    $.ajax({
        type: "POST",
        data: {type:"getFlags"},
        url: "./content/developerData.php", 
        dataType: 'json',
        success: function(response) {
            string = '';
            for(var i = 0; i < response.length; i++) {
                string += "<option value='" + response[i][0] + "' selected>" + response[i][1] + "</option>";
            }
            $("#flags").append(string);
            $("#flags").val(flag).trigger('change');
        }
    });	
}