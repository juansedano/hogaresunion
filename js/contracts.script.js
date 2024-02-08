$(document).ready(function () {
    getDevelopers();
    //getCollaborators(null); 
});

var developers = [];
function getDevelopers() {
    $.ajax({
        type: "GET",
        data: {type:"getDevelopers"},
        url: "./php/contractsData.php", 
        dataType: 'json',
        success: function(response) {
            len = response.data.length;
            $.each(response.data, function(index, data) {
                developers.push({
                    "developerId": data.developerId,
                    "developerName": data.developerName,
                    "developerHubSpotId": data.developerHubSpotId,
                    "developerFlag": data.developerFlag,
                    "developmentId": data.developmentId,
                    "developmentName": data.developmentName,
                    "developmentUrl": data.developmentUrl,
                    "developmentFlag": data.developmentFlag
                });
                if (index === (len - 1)) {
                    showDevelopersData();
                }
            });
        }
    });	
}

$("#searchInput").on('keyup', function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        showDevelopersData();
    }
});


$(document).on("click", "#searchCollaborators", function(e) {
    e.preventDefault();
    showDevelopersData();
});

function showDevelopersData() {
    var keyword = $('#searchInput').val();
    console.log(keyword);
    $('#dataContainer').html(''); 
    var string = '';
    var rowCount = 0;
    string += '<table class="table table-striped" style="width:100%">';
    string += '<thead>';
    string += '<tr>';
    string += '<td style="text-align:center;width:30px;font-weight:bold;">&nbsp;&nbsp;</td>'; 
    string += '<td style="text-align:center;width:146px;font-weight:bold;">Id Desarrollador</td>';
    string += '<td style="text-align:center;font-weight:bold;">Desarrollador</td>';
    string += '<td style="text-align:center;font-weight:bold;">HubSpot Id</td>';
    string += '<td style="text-align:center;font-weight:bold;">Status</td>';
    string += '<td style="text-align:center;width:120px;font-weight:bold;">Id Desarrollo</td>';
    string += '<td style="text-align:center;font-weight:bold;">Desarrollo</td>';
    string += '<td style="text-align:center;font-weight:bold;">Status</td>';     
    string += '</thead>';
    string += '</tr>';
    len = developers.length;
    $.each(developers, function(index, data) {
        if (data.developerName.toLowerCase().includes(keyword.toLowerCase()) || data.developmentName.toLowerCase().includes(keyword.toLowerCase())) {
            rowCount++;
            string += '<tr>';  
            string += '<td><button type="button" class="btn btn-sm btn-normal showDetail" data-developerid="' + data.developerId + '" data-developername="' + data.developerName + '" data-developerhubspotid="' + data.developerHubSpotId + '" data-developerstatus="' + data.developerFlag + '" title="Detalles"><i class="glyphicon glyphicon-edit" style="color:#ffffff"></i></button></td>';  
            string += '<td style="text-align: center;">' + data.developerId + '</td>';
            string += '<td>' + data.developerName + '</td>';
            string += '<td style="text-align: center;">' + data.developerHubSpotId + ' </td>';
            string += '<td style="text-align: center;">' + data.developerFlag + '</td>';
            string += '<td style="text-align: center;">' + data.developmentId + '</td>';
            string += '<td><a href="' + data.developmentUrl + '" target="_blank">' + data.developmentName + '</a></td>';
            string += '<td style="text-align: center;">' + data.developmentFlag + '</td>';  
            string += '</tr>';
        }
        if (index === (len - 1)) {
            if (rowCount == 0) {
                string += '<tr><td colspan="8" style="text-align:center;">No se encontraron coincidencias.</td></tr>';  
            }
        }        
    });
    string += '</table>';
    $('#dataContainer').html(string); 
}

$(document).on("click", ".showDetail", function(e) {
    e.preventDefault();
    minimizePanel();
    var developerId = $(this).attr('data-developerid');
    var developerName = $(this).attr('data-developername');  
    var developerHubSpotId = $(this).attr('data-developerhubspotid');
    var developerStatus = $(this).attr('data-developerstatus');
    $('#developerContainer').css("display", "block");
    $('#developmentsContainer').css("display", "block");
    developerString = '<table style="width:100%">';
    developerString += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    developerString += '<td style="vertical-align:top;padding-top:4px;width:120px;font-weight:bold;">Id</td>';
    developerString += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">' + developerId + '</td>';;
    developerString += '</tr>';
    developerString += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    developerString += '<td style="vertical-align:top;padding-top:4px;width:120px;font-weight:bold;">Nombre</td>';
    developerString += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">' + developerName + '</td>';;
    developerString += '</tr>';
    developerString += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    developerString += '<td style="vertical-align:top;padding-top:4px;width:120px;font-weight:bold;">HubSpot Id</td>';
    developerString += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">' + developerHubSpotId + '</td>';;
    developerString += '</tr>';    
    developerString += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    developerString += '<td style="vertical-align:top;padding-top:4px;width:120px;font-weight:bold;">Status</td>';
    developerString += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">' + developerStatus + '</td>';;
    developerString += '</tr>';            
    developerString += '</table>';
    developmentString = '<table>';
    $.each(developers, function(index, data) {
        if (data.developerId == developerId) {
            developmentString += '<tr style="border-bottom: 1px dotted #eeeeee;">';  
            developmentString += '<td style="vertical-align:top;padding-left:8px;padding-top:4px;">' + data.developmentName + '</td>';;
            developmentString += '</tr>'; 
        }       
    });
    developmentString += '</table>';
    $('#developerNameTittle').html(developerName);
    $('#developertDataContainer').html(developerString);
    $('#developmentsDataContainer').html(developmentString);
});

function minimizePanel() {
    if(!$('#closeSearchData').hasClass('maximize')) {
        $('#closeSearchData').closest('.panel').find('.panel-body, .panel-footer').slideUp(200);
        $('#closeSearchData').addClass('maximize');
        $('#closeSearchData').find('i').removeClass('fa-minus').addClass('fa-plus');
        $('#closeSearchData').attr('data-original-title','Maximize Panel').tooltip();
     }
}

function maximizePanel() {
    if($('#closeSearchData').hasClass('maximize')) {
        $('#closeSearchData').closest('.panel').find('.panel-body, .panel-footer').slideDown(200);
        $('#closeSearchData').removeClass('maximize');
        $('#closeSearchData').find('i').removeClass('fa-plus').addClass('fa-minus');
        $('#closeSearchData').attr('data-original-title','Minimize Panel').tooltip();
     }
}