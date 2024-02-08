$(document).ready(function () {
    getDevelopers();
    getCollaborators(null); 
});

var developersData = [];
function getDevelopers() {
    $.ajax({
        type: "GET",
        data: {type:"getDevelopers"},
        url: "./php/developerData.php", 
        dataType: 'json',
        success: function(response) {
            getRoles();
            $("#developer").empty();
            $("#developer").append("<option value='0'>Selecciona...</option>");
            $.each(response.developer, function(index, developer) {
                if (developer.statusId == 1) {
                    $("#developer").append('<option value="' + developer.id + '">' + developer.nameText + '</option>');
                    developersData.push({
                        "id": developer.id,
                        "name": developer.nameText,
                        "hubSpotId": developer.hubSpotId,
                        "flagId": developer.statusId
                    });
                }
            });
        }
    });	
}

var localRoles = [];
var centralRoles = [];
var smartoRoles = [];
function getRoles() {
    $.ajax({
        type: "POST",
        data: {type:"getRoles"},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) { 
            getCarriers();
            $.each(response.roles, function(index, role) {
                if ((role.group == 'Local') || (role.id == 13) || (role.id == 16))  {
                    localRoles.push({
                        "id": role.id,
                        "name": role.name.replace(/"/g, ''),
                        "group": role.group
                    });
                } else if (role.group == 'Central') {
                    centralRoles.push({
                        "id": role.id,
                        "name": role.name.replace(/"/g, ''),
                        "group": role.group
                    });
                } else {
                    smartoRoles.push({
                        "id": role.id,
                        "name": role.name.replace(/"/g, ''),
                        "group": role.group
                    });
                }
            });      
        }
    });	
}

var carriersData = [];
function getCarriers() {
    $.ajax({
        type: "POST",
        data: {type:"getCarriers"},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) { 
            $('.openNewCollaboratorModal').prop('disabled', false);
            $.each(response.carrier, function(index, carrier) {
                carriersData.push({
                    "id": carrier.id,
                    "name": carrier.name
                });
            });      
        }
    });	
}

$("#searchInput").on('keyup', function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchCollaborators").click();
    }
});

$(document).on("change", "#developer", () => {
    $("#searchCollaborators").click();
})

$(document).on("click", "#searchCollaborators", function(e) {
    e.preventDefault();
    var developerId = $("#developer").val();
    var keyword = $('#searchInput').val();
    searchCollaborators(developerId,keyword);
});

$(document).on("click", ".showCollaboratorDetail", function(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: 0 }, "slow");
    var collaboratorId = $(this).attr('name');
    showCollaboratorData(collaboratorId);
    showCollaboratorAssignment(collaboratorId);
    $(".hiddencolumn").css("display", "none");
    $("#collaboratorContainer").removeClass("col-md-12");
    $("#collaboratorContainer").addClass("col-md-4");
    $("#collaboratorActions").removeClass("col-md-12");
    $("#collaboratorActions").addClass("col-md-4");
    $("#collaboratorActions").css("display", "block");
    $("#collaboratorDependencies").removeClass("col-md-12");
    $("#collaboratorDependencies").addClass("col-md-4");
    $("#collaboratorDependencies").css("display", "block");
    $("#showColumns").css("display", "inline");
});

function showCollaboratorData(collaboratorId) {
    $('#collaboratorData').html(''); 
    var string = '';
    string += '<table style="width:100%">';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:34%"><label style="padding-top:12px">Id</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorNameText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:150px;margin-bottom:5px" id="collaboratorIdInput" placeholder="Id" disabled/>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:34%"><label style="padding-top:12px">Nombre</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorNameText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:150px;margin-bottom:5px" id="collaboratorNameInput" placeholder="Nombre" disabled/>';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Apellido</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorLastNameText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:150px;margin-bottom:5px" id="collaboratorLastNameInput" placeholder="Apellido" disabled/>';
    string += '</td>';
    string += '</tr>';  
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Status</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    //string += '<label id="collaboratorStatusText" style="padding-top:12px;"></label>';
    string += '<select class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorStatusInput" disabled>';        
    string += '<option value="7">Active</option>';   
    string += '<option value="8">Inactive</option>';      
    string += '</select>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Teléfono</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorPhoneText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorPhoneInput" placeholder="Teléfono" disabled/>';
    string += '</td>';
    string += '</tr>';    
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Proveedor</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorCarrierText" style="padding-top:12px;"></label>';
    string += '<select class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorCarrierInput" disabled>';   
    $.each(carriersData, function(index, carrier) {
        string += '<option value="' + carrier.id + '">' + carrier.name + '</option>'; 
    });       
    string += '</select>';
    string += '</td>';
    string += '</tr>';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;""><label style="padding-top:12px">Correo</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorMailText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="collaboratorMailInput" placeholder="Correo electrónico" disabled/>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Posición</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorJobText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:200px;margin-bottom:5px" id="collaboratorJobInput" placeholder="Puesto de trabajo" disabled/>';
    string += '</td>';
    string += '</tr>';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">HubSpot Id</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorHubSpotIdText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorHubSpotIdInput" placeholder="HubSpot Id" disabled/>';
    string += '</td>';
    string += '</tr>';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">HubSpot Owner Id</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorHubSpotOwnerIdText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorHubSpotOwnerIdInput" placeholder="HubSpot Owner Id" disabled/>';
    string += '</td>';
    string += '</tr>';    
    
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Id Desarrollador</label></td>';
    string += '<td style="padding-left:8px;">';
    //string += '<label id="collaboratorHubSpotOwnerIdText" style="padding-top:12px;"></label>';
    string += '<input type="text" class="form-control input-sm" style="width:200px;margin-bottom:5px" id="collaboratorProviderIdInput" placeholder="Id Desarrollador" disabled/>';
    string += '</td>';
    string += '</tr>'; 

    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;">&nbsp;</td>';
    string += '<td style="vertical-align:middle;padding-left:8px;padding-top:4px;padding-bottom:4px">';
    string += '<button type="button" class="btn btn-sm btn-danger restartCollaboratorInfo" name="' + collaboratorId + '" disabled>Cancelar</button>';
    string += '&nbsp;&nbsp;';
    string += '<button type="button" class="btn btn-sm btn-success editCollaborator" name="' + collaboratorId + '">Editar</button>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="display:none" id="collaboratorEditionResponseContainer">';
    string += '<td style="padding-left:8px;">&nbsp;</td>';
    string += '<td style="text-align:left;vertical-align:top;" id="collaboratorEditionResponse">&nbsp;</td>';
    string += '</tr>';                 
    string += '</table>';
    $('#collaboratorData').html(string); 
    $.each(collaboratorData, function(index, collaborator) {
        if (collaboratorId == collaborator.id) {
            //$('#collaboratorNameText').html(collaborator.name);
            //$('#collaboratorLastNameText').html(collaborator.lastName);
            //$("#collaboratorStatusText").html(collaborator.status);
            //$("#collaboratorPhoneText").html(collaborator.phone);
            //$("#collaboratorCarrierText").html(collaborator.carrier);
            //$("#collaboratorMailText").html(collaborator.email);
            //$("#collaboratorJobText").html(collaborator.position);
            //$("#collaboratorHubSpotIdText").html(collaborator.hubSpotId);
            //$("#collaboratorHubSpotOwnerIdText").html(collaborator.hubSpotOwnerId);
            $('#collaboratorIdInput').val(collaborator.id);
            $('#collaboratorNameInput').val(collaborator.name);
            $("#collaboratorLastNameInput").val(collaborator.lastName);
            $("#collaboratorStatusInput").val(collaborator.statusId).trigger('change'); 
            $('#collaboratorPhoneInput').val(collaborator.phone);
            $('#collaboratorCarrierInput').val(collaborator.carrierId).trigger('change'); 
            $("#collaboratorMailInput").val(collaborator.email);
            $('#collaboratorJobInput').val(collaborator.position);
            $('#collaboratorHubSpotIdInput').val(collaborator.hubSpotId);
            $('#collaboratorHubSpotOwnerIdInput').val(collaborator.hubSpotOwnerId);
            $('#collaboratorProviderIdInput').val(collaborator.providerId);
        }
    });
}

$(document).on("click", ".restartCollaboratorInfo", function(e) {
    e.preventDefault();
    var collaboratorId = $(this).attr('name');
    showCollaboratorData(collaboratorId);
});

$(document).on("click", ".editCollaborator", function(e) {
    e.preventDefault();
    //$('#collaboratorIdInput').prop('disabled', false);
    $('#collaboratorNameInput').prop('disabled', false);
    $("#collaboratorLastNameInput").prop('disabled', false);
    $("#collaboratorStatusInput").prop('disabled', false);
    $('#collaboratorPhoneInput').prop('disabled', false);
    $('#collaboratorCarrierInput').prop('disabled', false);
    $("#collaboratorMailInput").prop('disabled', false);
    $('#collaboratorJobInput').prop('disabled', false);
    //$('#collaboratorHubSpotIdInput').prop('disabled', false);
    //$('#collaboratorHubSpotOwnerIdInput').prop('disabled', false);
    $('#collaboratorProviderIdInput').prop('disabled', false);
    $('.restartCollaboratorInfo').prop('disabled', false);
    $('.editCollaborator').addClass('saveCollaboratorEdition');
    $('.editCollaborator').html('Guardar');
    $('.editCollaborator').removeClass('editCollaborator');
});

var centralAssignedCollaboratorsData = [];
var localAssignedCollaboratorsData = [];
var strippedFlag = 0;
var strippedFlag2 = 0;
function showCollaboratorAssignment(collaboratorId) {
    var string = '';
    string += '<table style="width:100%">';
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding-top:8px;" colspan="2"><label style="font-weight:bold;padding-top:12px">Asignaciones Centrales</label></td>';
    string += '</tr>';
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding:4px 0px 4px 0px;" colspan="2" id="availableDevelopers">';
    string += '<select style="width:340px;margin-bottom:5px" id="developers">';
    string += '<option value="0" selected>Selecciona un Desarrollador...</option>';           
    string += '</select><br>';    
    string += '<select style="width:240px;margin-bottom:5px" id="centralRoles">';
    string += '<option value="0" selected>Selecciona un rol...</option>'; 
    $.each(centralRoles, function(index, role) {
        string += '<option value="' + role.id + '">' + role.name + '</option>';
    });              
    string += '</select>'; 
    string += '&nbsp;&nbsp;&nbsp;&nbsp;';
    string += '<button type="button" class="btn btn-sm btn-success" id="assignDeveloper" style="padding-top:4px;height:28px;margin-top:-6px;">Asignar</button><br>';    
    //string += '<a href="#" id="assignDeveloper">Asignar</a><br>';  
    //string += '<div style="display:inline"><button type="button" class="btn btn-sm btn-danger restartCentralAssignment" name="' + collaboratorId + '" style="background-color:#FFB71B;color:#FFFFFF;">Restablecer</button>';
    //string += '&nbsp;&nbsp;';
    //string += '<button type="button" class="btn btn-sm btn-success saveCentralAssignment" name="' + collaboratorId + '">Guardar cambios</button></div>';
    //string += '&nbsp;&nbsp;';
    string += '<div style="display:inline" id="responseCentralAssignment"></div>';
    string += '</td>';
    string += '</tr>';         
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding:2px 0px;" colspan="2" id="collaboratorsCentralAssignment">&nbsp;</td>';
    string += '</tr>';   
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding-top:8px;" colspan="2"><label style="font-weight:bold;padding-top:12px">Asignaciones Locales</label></td>';
    string += '</tr>';
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding:4px 0px 4px 0px;" colspan="2" id="availableDevelopments">';
    string += '</td>';
    string += '</tr>';       
    string += '<tr>';
    string += '<td style="text-align:left;vertical-align:top;padding:4px 0px 4px 0px;" colspan="2" id="collaboratorsLocalAssignment">&nbsp;</td>';
    string += '</tr>';      
    string += '</tr>';             
    string += '</table>';
    $('#collaboratorAssignment').html(string); 

    collaboratorsCentralAssignment(collaboratorId);
    collaboratorsLocalAssignment(collaboratorId);
    collaboratorsLocalAssignmentData(collaboratorId);
   
    $.each(developersData, function(index, developer) {
        $('#developers').append('<option value="' + developer.id + '" data-collaboratorid="' + collaboratorId + '" data-developername="' + developer.name + '">' + developer.id + ' - ' + developer.name + '</option>');
    });

    $('#developers').select2();  
    $('#centralRoles').select2();
    $('span[id*=select2-chosen-]').not($("#select2-chosen-1")).attr('style','line-height : 24px !important');
    $('span[id*=select2-chosen-]').not($("#select2-chosen-1")).parent().find('.select2-arrow').attr('style','top : -3px !important');         
}

$(document).on("click", ".saveLocalAssignment", function(e) {
    e.preventDefault();
    var collaboratorId = $(this).attr('name');
    var flag = 0;
    if (flag == 0) {
        if ((localAssignedCollaboratorsData.length == 0) || (localAssignedCollaboratorsData == null)) {
            localAssignedCollaboratorsData = null;
        }
        $("#responseLocalAssignment").html('<img src="images/loading.gif" style="margin: 0 auto; width:24px;">');
        $.ajax({
            type: "POST",              
            data: {
                type: "updateLocalAssignment",
                collaboratorId: collaboratorId,
                localAssignedCollaboratorsData: localAssignedCollaboratorsData
            },
            url: "./php/collaboratorData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response == 'success') {
                    $("#responseLocalAssignment").html('<label style="color:green">Los cambios se realizaron con éxito.</label>');
                    setTimeout(function () { 
                        collaboratorsLocalAssignment(collaboratorId);
                        $('#responseLocalAssignment').html('');
                    }, 2000);              
                } else {
                    $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                    setTimeout(function () {
                        $('#responseLocalAssignment').html('');
                    }, 2000);                 
                }                
            },
            error: function(response) { 
                $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                setTimeout(function () {
                    $('#responseLocalAssignment').html('');
                }, 2000);    
            } 
        });  
    }
});

function collaboratorsCentralAssignment(collaboratorId) {
    centralAssignedCollaboratorsData = [];
    $('#collaboratorsCentralAssignment').html('<img src="images/loading.gif" class="img-responsive" style="margin:0 auto;width:18px;" align="left">');
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorCentralAssignment",collaboratorId:collaboratorId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('#collaboratorsCentralAssignment').html('');
                if (response.collaboratorCentralAssignment.length == 0) {
                    $('#collaboratorsCentralAssignment').html('No existen asignaciones centrales');
                } else {
                    $.each(response.collaboratorCentralAssignment, function(index, collaboratorAssignment) {
                        if (strippedFlag == 0) {
                            $("#collaboratorsCentralAssignment").append('<div style="width:100%;background-color:#f7f7f7;border-top:1px solid #ddd;line-height:32px;vertical-align:middle;padding-left:8px;">' + collaboratorAssignment.developerName + ' / ' + collaboratorAssignment.role.replace(/"/g, '') + '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger unassignDeveloper"  data-developerid="'+ collaboratorAssignment.developerId +'" data-collaboratorid="'+ collaboratorId +'" data-roleid="'+ collaboratorAssignment.roleId +'" style="font-size:12px;padding-top:0px;height:18px;margin-top:-4px;">Desasignar</button><br></div>');
                            strippedFlag = 1;
                        } else {
                            $("#collaboratorsCentralAssignment").append('<div style="width:100%;background-color:#ffffff;border-top:1px solid #ddd;line-height:32px;vertical-align:middle;padding-left:8px;">' + collaboratorAssignment.developerName + ' / ' + collaboratorAssignment.role.replace(/"/g, '') + '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger unassignDeveloper"  data-developerid="'+ collaboratorAssignment.developerId +'" data-collaboratorid="'+ collaboratorId +'" data-roleid="'+ collaboratorAssignment.roleId +'" style="font-size:12px;padding-top:0px;height:18px;margin-top:-4px;">Desasignar</button><br></div>');
                            strippedFlag = 0;
                        }
                        centralAssignedCollaboratorsData.push({
                            "developerId": collaboratorAssignment.developerId, 
                            "collaboratorId": collaboratorId,
                            "collaboratorRole":  collaboratorAssignment.roleId
                        }); 
                    });
                }
            }
        }
    });
}

function collaboratorsLocalAssignmentData(collaboratorId) {
    localAssignedCollaboratorsData = [];
    $('#collaboratorsLocalAssignment').html('<img src="images/loading.gif" class="img-responsive" style="margin:0 auto;width:18px;" align="left">');
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorLocalAssignment",collaboratorId:collaboratorId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('#collaboratorsLocalAssignment').html('');
                if (response.collaboratorLocalAssignment.length == 0) {
                    $('#collaboratorsLocalAssignment').html('No existen asignaciones centrales');
                } else {
                    $.each(response.collaboratorLocalAssignment, function(index, collaboratorAssignment) {
                        if (strippedFlag2 == 0) {
                            $("#collaboratorsLocalAssignment").append('<div style="width:100%;background-color:#f7f7f7;border-top:1px solid #ddd;line-height:32px;vertical-align:middle;padding-left:8px;">' + collaboratorAssignment.developerName + ' / ' + collaboratorAssignment.developmentName + ' / ' + collaboratorAssignment.role.replace(/"/g, '') + '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger unassignDevelopment"  data-developmentId="'+ collaboratorAssignment.developmentId +'" data-collaboratorid="'+ collaboratorId +'" data-roleid="'+ collaboratorAssignment.roleId +'" style="font-size:12px;padding-top:0px;height:18px;margin-top:-4px;">Desasignar</button><br></div>');
                            strippedFlag2 = 1;
                        } else {
                            $("#collaboratorsLocalAssignment").append('<div style="width:100%;background-color:#ffffff;border-top:1px solid #ddd;line-height:32px;vertical-align:middle;padding-left:8px;">' + collaboratorAssignment.developerName + ' / ' + collaboratorAssignment.developmentName + ' / ' + collaboratorAssignment.role.replace(/"/g, '') + '&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-sm btn-danger unassignDevelopment"  data-developmentId="'+ collaboratorAssignment.developmentId +'" data-collaboratorid="'+ collaboratorId +'" data-roleid="'+ collaboratorAssignment.roleId +'" style="font-size:12px;padding-top:0px;height:18px;margin-top:-4px;">Desasignar</button><br></div>');
                            strippedFlag2 = 0;
                        }                        
                        localAssignedCollaboratorsData.push({
                            "developmentId": collaboratorAssignment.developmentId, 
                            "collaboratorId": collaboratorId,
                            "collaboratorRole":  collaboratorAssignment.roleId
                        }); 
                    });
                }
            }
        }
    });
}

function collaboratorsLocalAssignment(collaboratorId) {
    var stringDev = '';
    $('#availableDevelopments').html('<img src="images/loading.gif" class="img-responsive" style="margin:0 auto;width:18px;" align="left">');
    $.ajax({
        type: "POST",
        data: {type:"getCollaboratorAvailableDevelopments",collaboratorId:collaboratorId},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('#availableDevelopments').html('');
                if (response.collaboratorAvailableDevelopments.length == 0) {
                    $('#availableDevelopments').html('Aún no está asignado a ningun Desarrollador');
                } else {
                    stringDev += '<select  style="width:340px;margin-bottom:5px" id="developments">';
                    stringDev += '<option value="0" selected>Selecciona un Desarrollo...</option>';           
                    $.each(response.collaboratorAvailableDevelopments, function(index, availableDevelopments) {
                        stringDev += '<option value="' + availableDevelopments.developmentId + '" data-collaboratorid="' + collaboratorId + '" data-developmentname="' + availableDevelopments.developmentName + '" data-developername="' + availableDevelopments.developerName + '">' + availableDevelopments.developerId + ' - ' + availableDevelopments.developmentName + ' - ' + availableDevelopments.localityName + ' - ' + availableDevelopments.stateName + '</option>'
                    });
                    stringDev += '</select><br>';
                    stringDev += '<select style="width:240px;margin-bottom:5px" id="localRoles">';
                    stringDev += '<option value="0" selected>Selecciona un rol...</option>'; 
                    $.each(localRoles, function(index, role) {
                        stringDev += '<option value="' + role.id + '">' + role.name + '</option>';
                    });              
                    stringDev += '</select>';  
                    stringDev += '&nbsp;&nbsp;&nbsp;&nbsp;';
                    stringDev += '<button type="button" class="btn btn-sm btn-success" id="assignDevelopment" style="padding-top:4px;height:28px;margin-top:-6px;">Asignar</button><br>';
                    //stringDev += '<a href="#" id="assignDevelopment">Asignar</a><br>';                   
                }
            }
            //stringDev += '<button type="button" class="btn btn-sm btn-danger restartLocalAssignment" name="' + collaboratorId + '" style="background-color:#FFB71B;color:#FFFFFF;">Restablecer</button>';
            //stringDev += '&nbsp;&nbsp;';
            //stringDev += '<div style="display:inline"><button type="button" class="btn btn-sm btn-success saveLocalAssignment" name="' + collaboratorId + '">Guardar cambios</button></div>';
            //stringDev += '&nbsp;&nbsp;';
            stringDev += '<div style="display:inline" id="responseLocalAssignment"></div>';                                    
            $('#availableDevelopments').html(stringDev);
            $('#developments').select2();
            $('#localRoles').select2();   
            $('span[id*=select2-chosen-]').not($("#select2-chosen-1")).attr('style','line-height : 24px !important');
            $('span[id*=select2-chosen-]').not($("#select2-chosen-1")).parent().find('.select2-arrow').attr('style','top : -3px !important');     
        }
    });    
}

$(document).on("click", "#assignDeveloper", function(e) {
    e.preventDefault();
    var developerId = $('#developers').val();
    var developerName = $('#developers').find('option:selected').data('developername'); 
    var collaboratorId = $('#developers').find('option:selected').data('collaboratorid'); 
    var roleId = $('#centralRoles').val();
    var roleName =  $('#centralRoles option:selected').text();
    var dupliateFlag = 0;
    strippedFlag = 1;

    if (!((developerId == 0) || (roleId == 0))) {
        $.each(centralAssignedCollaboratorsData, function(index, data) {
            if ((data.developerId == developerId) && (data.collaboratorId == collaboratorId) && (data.collaboratorRole == roleId)) {
                dupliateFlag++;
            }
        });

        if ($("#collaboratorsCentralAssignment").children().length == 0) {
            $("#collaboratorsCentralAssignment").html('');
        }

        if (dupliateFlag == 0) {
            $("#responseCentralAssignment").html('<img src="images/loading.gif" style="margin: 0 auto; width:24px;">');
            $.ajax({
                type: "POST",              
                data: {
                    type: "updateCentralAssignment",
                    developerId: developerId,
                    collaboratorId: collaboratorId,
                    collaboratorRole: roleId,
                    action: 'add'
                },
                url: "./php/collaboratorData.php", 
                dataType: 'json',
                success: function(response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    } else if (response == 'success') {
                        centralAssignedCollaboratorsData.push({
                            "developerId": developerId, 
                            "collaboratorId": collaboratorId,
                            "collaboratorRole":  roleId
                        }); 
                        $("#responseCentralAssignment").html('<label style="color:green">La asignación se agregó con éxito.</label>');
                        collaboratorsCentralAssignment(collaboratorId);
                        collaboratorsLocalAssignment(collaboratorId);
                        collaboratorsLocalAssignmentData(collaboratorId);
                        setTimeout(function () { 
                            $('#responseCentralAssignment').html('');
                        }, 2000);              
                    } else {
                        $("#responseCentralAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                        setTimeout(function () {
                            $('#responseCentralAssignment').html('');
                        }, 2000);                 
                    }                
                },
                error: function(response) { 
                    $("#responseCentralAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                    setTimeout(function () {
                        $('#responseCentralAssignment').html('');
                    }, 2000);    
                } 
            });  
        }
    }
});

$(document).on("click", ".unassignDeveloper", function(e) {
    e.preventDefault();
    var developerId = $(this).attr('data-developerid');
    var collaboratorId = $(this).attr('data-collaboratorid');
    var roleId = $(this).attr('data-roleid');
    var count = centralAssignedCollaboratorsData.length;
    if (count != 0) {
        for (i=0;i<count;i++) {
            if ((centralAssignedCollaboratorsData[i].developerId == developerId) && (centralAssignedCollaboratorsData[i].collaboratorId == collaboratorId) && (centralAssignedCollaboratorsData[i].collaboratorRole == roleId)) {
                $("#responseCentralAssignment").html('<img src="images/loading.gif" style="margin: 0 auto; width:24px;">');
                $.ajax({
                    type: "POST",              
                    data: {
                        type: "updateCentralAssignment",
                        developerId: developerId,
                        collaboratorId: collaboratorId,
                        collaboratorRole: roleId,
                        action: 'remove'
                    },
                    url: "./php/collaboratorData.php", 
                    dataType: 'json',
                    success: function(response) {
                        if (response == 'timeout') {
                            window.location.replace("logout.php?var=timeout");
                        } else if (response == 'success') {
                            centralAssignedCollaboratorsData.splice(i, 1);
                            if ($("#collaboratorsCentralAssignment").html() == '') {
                                $("#collaboratorsCentralAssignment").html('No existen asignaciones centrales');
                            }
                            $("#responseCentralAssignment").html('<label style="color:green">La asignación se eliminó con éxito.</label>');
                            collaboratorsCentralAssignment(collaboratorId);
                            collaboratorsLocalAssignment(collaboratorId);
                            collaboratorsLocalAssignmentData(collaboratorId);
                            setTimeout(function () { 
                                $('#responseCentralAssignment').html('');
                            }, 2000);              
                        } else {
                            $("#responseCentralAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                            setTimeout(function () {
                                $('#responseCentralAssignment').html('');
                            }, 2000);                 
                        }                
                    },
                    error: function(response) { 
                        $("#responseCentralAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                        setTimeout(function () {
                            $('#responseCentralAssignment').html('');
                        }, 2000);    
                    } 
                });  
            }
        }
    }    
});

$(document).on("click", "#assignDevelopment", function(e) {
    e.preventDefault();
    var developmentId = $('#developments').val();
    var developmentName = $('#developments').find('option:selected').data('developmentname'); 
    var developerName = $('#developments').find('option:selected').data('developername'); 
    var collaboratorId = $('#developments').find('option:selected').data('collaboratorid'); 
    var roleId = $('#localRoles').val();
    var roleName =  $('#localRoles option:selected').text();
    var dupliateFlag = 0;
    strippedFlag2 = 1;

    if (!((developmentId == 0) || (roleId == 0))) {
        $.each(localAssignedCollaboratorsData, function(index, data) {
            if ((data.developmentId == developmentId) && (data.collaboratorId == collaboratorId) && (data.collaboratorRole == roleId)) {
                dupliateFlag++;
            }
        });

        if ($("#collaboratorsLocalAssignment").children().length == 0) {
            $("#collaboratorsLocalAssignment").html('');
        }

        if (dupliateFlag == 0) {
            if ((localAssignedCollaboratorsData.length == 0) || (localAssignedCollaboratorsData == null)) {
                localAssignedCollaboratorsData = [];
            }
            $("#responseLocalAssignment").html('<img src="images/loading.gif" style="margin: 0 auto; width:24px;">');
            $.ajax({
                type: "POST",              
                data: {
                    type: "updateLocalAssignment",
                    developmentId: developmentId,
                    collaboratorId: collaboratorId,
                    collaboratorRole: roleId,
                    action: 'add'
                },
                url: "./php/collaboratorData.php", 
                dataType: 'json',
                success: function(response) {
                    if (response == 'timeout') {
                        window.location.replace("logout.php?var=timeout");
                    } else if (response == 'success') {
                        localAssignedCollaboratorsData.push({
                            "developmentId": developmentId, 
                            "collaboratorId": collaboratorId,
                            "collaboratorRole":  roleId
                        });                         
                        $("#responseLocalAssignment").html('<label style="color:green">La asignación se agregó con éxito.</label>');
                        setTimeout(function () { 
                            collaboratorsLocalAssignment(collaboratorId);
                            collaboratorsLocalAssignmentData(collaboratorId);
                            $('#responseLocalAssignment').html('');
                        }, 2000);              
                    } else {
                        $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                        setTimeout(function () {
                            $('#responseLocalAssignment').html('');
                        }, 2000);                 
                    }                
                },
                error: function(response) { 
                    $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                    setTimeout(function () {
                        $('#responseLocalAssignment').html('');
                    }, 2000);    
                } 
            });  
        }
    }      
});

$(document).on("click", ".unassignDevelopment", function(e) {
    e.preventDefault();
    var developmentId = $(this).attr('data-developmentid');
    var collaboratorId = $(this).attr('data-collaboratorid');
    var roleId = $(this).attr('data-roleid');
    var count = localAssignedCollaboratorsData.length;
    if (count != 0) {
        for (i=0;i<count;i++) {
            if ((localAssignedCollaboratorsData[i].developmentId == developmentId) && (localAssignedCollaboratorsData[i].collaboratorId == collaboratorId) && (localAssignedCollaboratorsData[i].collaboratorRole == roleId)) {
                $("#responseLocalAssignment").html('<img src="images/loading.gif" style="margin: 0 auto; width:24px;">');
                $.ajax({
                    type: "POST",              
                    data: {
                        type: "updateLocalAssignment",
                        developmentId: developmentId,
                        collaboratorId: collaboratorId,
                        collaboratorRole: roleId,
                        action: 'remove'
                    },
                    url: "./php/collaboratorData.php", 
                    dataType: 'json',
                    success: function(response) {
                        if (response == 'timeout') {
                            window.location.replace("logout.php?var=timeout");
                        } else if (response == 'success') {
                            localAssignedCollaboratorsData.splice(i, 1);                         
                            $("#responseLocalAssignment").html('<label style="color:green">La asignación se eliminó con éxito.</label>');
                            setTimeout(function () { 
                                collaboratorsLocalAssignmentData(collaboratorId);
                                $('#responseLocalAssignment').html('');
                            }, 2000);              
                        } else {
                            $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                            setTimeout(function () {
                                $('#responseLocalAssignment').html('');
                            }, 2000);                 
                        }                
                    },
                    error: function(response) { 
                        $("#responseLocalAssignment").html('<label style="color:red">Hubo un error.</label>'); 
                        setTimeout(function () {
                            $('#responseLocalAssignment').html('');
                        }, 2000);    
                    } 
                });  
            }
        }
    }    
});

$(document).on("click", "#showColumns", function(e) {
    e.preventDefault();
    $(".hiddencolumn").css("display", "table-cell");
    $("#collaboratorContainer").removeClass("col-md-4");
    $("#collaboratorContainer").addClass("col-md-12");
    $("#collaboratorActions").removeClass("col-md-4");
    $("#collaboratorActions").addClass("col-md-12");
    $("#collaboratorActions").css("display", "none");
    $("#collaboratorDependencies").removeClass("col-md-4");
    $("#collaboratorDependencies").addClass("col-md-12");
    $("#collaboratorDependencies").css("display", "none");
    $("#showColumns").css("display", "none");
});

var collaboratorData = [];
function getCollaborators(collaboratorId) {
    var string = '';
    collaboratorData = [];
    $('#collaboratorInfo').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "POST",
        data: {type:"getCollaborators"},
        url: "./php/collaboratorData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                string += '<table class="table table-striped" style="width:100%">';  
                string += '<thead><tr>'; 
                string += '<th style="width:30px">&nbsp;</th>';
                string += '<th>Nombre</th>';
                string += '<th style="text-align:center;">Teléfono</th>';
                // string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
                string += '<th class="hiddencolumn" style="text-align:center;">Desarrollador</th>';
                string += '<th class="hiddencolumn" style="text-align:center;">Rol</th>';
                // string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
                string += '<th class="hiddencolumn" style="text-align:center;">Desarrollo</th>';
                string += '<th class="hiddencolumn" style="text-align:center;">Rol</th>';
                string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
                string += '</tr></thead>';
                var len = response.collaborator.length;
                $.each(response.collaborator, function(index, collaborator) {
                    collaboratorData.push({
                        "id": collaborator.id,
                        "name": collaborator.name,
                        "lastName": collaborator.lastName,
                        "phone": collaborator.phone,
                        "carrierId": collaborator.carrierId,
                        "carrierName": collaborator.carrierName,
                        "email": collaborator.email,
                        "position": collaborator.position,
                        "statusId": collaborator.statusId,
                        "status": collaborator.status,
                        "developerId": collaborator.developerId,
                        "developerName": collaborator.developerName,
                        "roleId": collaborator.roleId,
                        "role": collaborator.role.replace(/"/g, ""), 
                        "devStatusId": collaborator.devStatusId,
                        "devStatus": collaborator.devStatus,
                        "hubSpotId": collaborator.hubSpotId,
                        "hubSpotOwnerId": collaborator.hubSpotOwnerId,
                        "developmentId": collaborator.developmentId,
                        "developmentName": collaborator.developmentName,
                        "developmentRolId": collaborator.developmentRolId,
                        "developmentRolName": collaborator.developmentRolName,
                        "developmentStatusId": collaborator.developmentStatusId,
                        "developmentStatus": collaborator.developmentStatus,
                        "providerId": collaborator.providerId
                    });
                    var allStatus = '';
                    collaborator.statusId = 7;
                    if (collaborator.status !== "Activo") {
                        allStatus += "Colaborador Inactivo<br>";
                        collaborator.statusId = 8;
                    }
                    if (collaborator.devStatus !== "Activo") {
                        allStatus += "Inactivo en Desarrollador<br>";
                        collaborator.statusId = 8;
                    }
                    if (collaborator.developmentStatus !== "Activo" && collaborator.developmentName !=="") {
                        allStatus += "Inactivo en Desarrollo";
                        collaborator.statusId = 8;
                    }
                    if (collaborator.statusId == 7 && collaborator.developmentRolName != "") {
                        string += '<tr>';
                        string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                        string += '<button type="button" class="btn btn-sm btn-normal showCollaboratorDetail" name="' + collaborator.id  + '" title="Detalles"><i class="glyphicon glyphicon-edit" style="color:#ffffff"></i></button>'                
                        string += '</td>';
                        string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
                        string += collaborator.name + ' ' + collaborator.lastName + ' (' + collaborator.id + ')'; 
                        string += '</td>'; 
                        string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += collaborator.phone; 
                        string += '</td>'; 
                        // string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        // string += collaborator.status; 
                        // string += '</td>'; 
                        string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += collaborator.developerName; 
                        string += '</td>'; 
                        string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += collaborator.role.replace(/"/g, ""); 
                        string += '</td>'; 
                        // string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        // string += collaborator.devStatus; 
                        // string += '</td>';  
                        string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += collaborator.developmentName; 
                        string += '</td>';   
                        string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += collaborator.developmentRolName; 
                        string += '</td>';   
                        string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                        string += (allStatus==="")? "Activo": allStatus;
                        string += '</td>'; 
                        string += '</tr>'; 
                    }
                    if (index === (len - 1)) {
                        if (collaboratorId != null) {
                            showCollaboratorData(collaboratorId);
                        }
                    }                    
                });
                string += '</table>';  
                $('#collaboratorInfo').html(string);
                if (collaboratorId != null) {
                    $(".hiddencolumn").css("display", "none");
                    searchCollaborators($('#developer').val(),$('#searchInput').val());
                }                
            }
        }
    });
}

function searchCollaborators(developerId,keyword) {
    var actives = 7;
    var inactives = 8;
    if (($('#box_1').is(':checked')) && ($('#box_0').is(':checked'))) {
        actives = 7;
        inactives = 8;        
    } else if (!($('#box_1').is(':checked')) && ($('#box_0').is(':checked'))) {
        actives = 8;
        inactives = 8;   
    } else if (($('#box_1').is(':checked')) && (!$('#box_0').is(':checked'))) {
        actives = 7;
        inactives = 7;   
    } else {
        actives = 7;
        inactives = 8;
    }
    $('#collaboratorInfo').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    string = '';
    string += '<table class="table table-striped" style="width:100%">';  
    string += '<thead><tr>'; 
    string += '<th style="width:30px">&nbsp;</th>';
    string += '<th>Nombre</th>';
    string += '<th style="text-align:center;">Teléfono</th>';
    // string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
    string += '<th class="hiddencolumn" style="text-align:center;">Desarrollador</th>';
    string += '<th class="hiddencolumn" style="text-align:center;">Rol</th>';
    // string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
    string += '<th class="hiddencolumn" style="text-align:center;">Desarrollo</th>';
    string += '<th class="hiddencolumn" style="text-align:center;">Rol</th>';
    string += '<th class="hiddencolumn" style="text-align:center;">Status</th>';
    string += '</tr></thead>';
    $.each(collaboratorData, function(index, collaborator) {
        if ((collaborator.developerId == developerId) || (developerId == 0)) {
            fullName = collaborator.name.toUpperCase() + ' ' + collaborator.lastName.toUpperCase();
            if ((fullName.indexOf(keyword.toUpperCase()) != -1) || (collaborator.phone.indexOf(keyword.toUpperCase()) != -1)) {
                var allStatus = '';
                collaborator.statusId = 7;
                if (collaborator.status !== "Activo") {
                    allStatus += "Colaborador Inactivo<br>";
                    collaborator.statusId = 8;
                }
                if (collaborator.devStatus !== "Activo") {
                    allStatus += "Inactivo en Desarrollador<br>";
                    collaborator.statusId = 8;
                }
                if (collaborator.developmentStatus !== "Activo" && collaborator.developmentName !=="") {
                    allStatus += "Inactivo en Desarrollo";
                    collaborator.statusId = 8;
                }
                if ((collaborator.statusId == actives) || (collaborator.statusId == inactives)) {
                    string += '<tr>'; 
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    string += '<button type="button" class="btn btn-sm btn-normal showCollaboratorDetail" name="' + collaborator.id  + '" title="Detalles"><i class="glyphicon glyphicon-edit" style="color:#ffffff"></i></button>'                
                    string += '</td>';
                    string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
                    string += collaborator.name + ' ' + collaborator.lastName + ' (' + collaborator.id + ')'; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += collaborator.phone; 
                    string += '</td>'; 
                    // string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    // string += collaborator.status; 
                    // string += '</td>'; 
                    string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += collaborator.developerName; 
                    string += '</td>'; 
                    string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += collaborator.role.replace(/"/g, ""); 
                    string += '</td>'; 
                    // string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    // string += collaborator.devStatus; 
                    // string += '</td>'; 
                    string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += collaborator.developmentName; 
                    string += '</td>';   
                    string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += collaborator.developmentRolName; 
                    string += '</td>';   
                    string += '<td class="hiddencolumn" style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += (allStatus==="")? "Activo": allStatus;
                    string += '</td>'; 
                    string += '</tr>'; 
                }
            }
        }
    });
    string += '</table>';  
    $('#collaboratorInfo').html(string);
    if ($("#collaboratorContainer").hasClass("col-md-4")) {
        $(".hiddencolumn").css("display", "none");
    }
}

$(document).on("click", ".saveCollaboratorEdition", function(e) {
    e.preventDefault();
    var buttons = '';
    var collaboratorId = $(this).attr('name');
    var collaboratorName = $('#collaboratorNameInput').val();
    var collaboratorLastName = $("#collaboratorLastNameInput").val();
    var collaboratorStatus = $("#collaboratorStatusInput").val(); 
    var collaboratorPhone = $('#collaboratorPhoneInput').val();
    var collaboratorCarrier = $('#collaboratorCarrierInput').val(); 
    var collaboratorMail = $("#collaboratorMailInput").val();
    var collaboratorJob = $('#collaboratorJobInput').val();
    var collaboratorProviderId = $('#collaboratorProviderIdInput').val();
    var flag = 0;
    var regString = /^([a-zA-Z0-9 _-áéíóúÁÉÍÓÚÜüÑñ\']+)$/;
    var regNumbers = /^\+([0-9]{12})$/;
    var regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;      
    if (!(regNumbers.test(collaboratorPhone))) {
        if (collaboratorPhone != '') {
            if ($('#collaboratorPhoneInput').next().length == 0) {
                $('#collaboratorPhoneInput').addClass('input-danger');
                $('#collaboratorPhoneInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Celular válido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorPhoneInput').next().length == 0) {
                $('#collaboratorPhoneInput').addClass('input-danger');
                $('#collaboratorPhoneInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Celular válido.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorPhoneInput').next().length > 0) {
            $('#collaboratorPhoneInput').removeClass('has-error');
            $('#collaboratorPhoneInput').next('label').remove();
        } 
    }
    if (!(regString.test(collaboratorName))) {
        if (collaboratorName != '') {
            if ($('#collaboratorNameInput').next().length == 0) {
                $('#collaboratorNameInput').addClass('input-danger');
                $('#collaboratorNameInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Nombre inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorNameInput').next().length == 0) {
                $('#collaboratorNameInput').addClass('input-danger');
                $('#collaboratorNameInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Nombre.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorNameInput').next().length > 0) {
            $('#collaboratorNameInput').removeClass('input-danger');
            $('#collaboratorNameInput').next('label').remove();
        } 
    } 
    if (!(regString.test(collaboratorLastName))) {
        if (collaboratorLastName != '') {
            if ($('#collaboratorLastNameInput').next().length == 0) {
                $('#collaboratorLastNameInput').addClass('input-danger');
                $('#collaboratorLastNameInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Nombre inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorLastNameInput').next().length == 0) {
                $('#collaboratorLastNameInput').addClass('input-danger');
                $('#collaboratorLastNameInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Nombre.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorLastNameInput').next().length > 0) {
            $('#collaboratorLastNameInput').removeClass('input-danger');
            $('#collaboratorLastNameInput').next('label').remove();
        } 
    } 
    if (!(regMail.test(collaboratorMail))) {
        if (collaboratorMail != '') {
            if ($('#collaboratorMailInput').next().length == 0) {
                $('#collaboratorMailInput').addClass('input-danger');
                $('#collaboratorMailInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Email inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorMailInput').next().length == 0) {
                $('#collaboratorMailInput').addClass('input-danger');
                $('#collaboratorMailInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Email.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorMailInput').next().length > 0) {
            $('#collaboratorMailInput').removeClass('input-danger');
            $('#collaboratorMailInput').next('label').remove();
        } 
    } 
    if (!(regString.test(collaboratorJob))) {
        if (collaboratorJob != '') {
            if ($('#collaboratorJobInput').next().length == 0) {
                $('#collaboratorJobInput').addClass('input-danger');
                $('#collaboratorJobInput').after('<label class="error text-danger" style="font-size:12px;text-align:left">Formato incorrecto.</label>');
            } 
            flag++;
        }
    } else {
        if ($('#collaboratorJobInput').next().length > 0) {
            $('#collaboratorJobInput').removeClass('input-danger');
            $('#collaboratorJobInput').next('label').remove();
        } 
    } 
    if (flag == 0) {
        $('.saveCollaboratorEdition').prop('disabled', true);
        $('.restartCollaboratorInfo').prop('disabled', true);
        var recordDescription = "Before: " + collaboratorId + " / " + collaboratorName + " / " + collaboratorLastName + " / " + collaboratorStatus + " / " + collaboratorCarrier + " / " + collaboratorMail + " / " + collaboratorJob + " / " + collaboratorProviderId;
        $('#collaboratorEditionResponseContainer').css('display', 'table-row');
        $('#collaboratorEditionResponse').html('&nbsp;&nbsp;<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:24px;">');
        $.ajax({ 
            type: "POST",
            data: {
                type:"updateCollaborator",
                collaboratorId:collaboratorId,
                collaboratorName:collaboratorName,
                collaboratorLastName:collaboratorLastName,
                collaboratorStatus:collaboratorStatus,
                collaboratorPhone:collaboratorPhone,
                collaboratorCarrier:collaboratorCarrier,
                collaboratorMail:collaboratorMail,
                collaboratorJob:collaboratorJob,
                collaboratorProviderId:collaboratorProviderId,
                recordDescription:recordDescription
            },
            url: "./php/collaboratorData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'success') {
                    $('#collaboratorEditionResponse').html('&nbsp;&nbsp;<label style="color:green">Los cambios se realizaron con éxito.</label>');
                    setTimeout(function () { 
                        getCollaborators(collaboratorId); 
                        $('#collaboratorEditionResponse').html('');
                   }, 1500);                  
                } else {
                    $('#collaboratorEditionResponse').html('&nbsp;&nbsp;<label style="color:red">Hubo un error.</label>');
                    setTimeout(function () { 
                        $('#collaboratorEditionResponse').html('');
                   }, 1500);                      
                }   
            },
            error: function(response) { 
                $('#collaboratorEditionResponse').html('&nbsp;&nbsp;<label style="color:red">Hubo un error.</label>');
                setTimeout(function () { 
                    $('#collaboratorEditionResponse').html('');
               }, 2000);     
            } 
        });       
    } 
});

$(document).on("click", ".openNewCollaboratorModal", function(e) {
    e.preventDefault();
    $("#openNewCollaboratorModal").click();
    $('#newCollaboratorBody').html('uiy'); 
    var string = '';
    string += '<table style="width:100%">';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:34%"><label style="padding-top:12px">Nombre</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:150px;margin-bottom:5px" id="collaboratorNameNew" placeholder="Nombre"/>';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Apellido</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:150px;margin-bottom:5px" id="collaboratorLastNameNew" placeholder="Apellido"/>';
    string += '</td>';
    string += '</tr>';  
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Status</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorStatusNew">';
    string += '<option value="0">Selecciona...</option>';         
    string += '<option value="7">Active</option>';   
    string += '<option value="8">Inactive</option>';      
    string += '</select>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Teléfono</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorPhoneNew" placeholder="Teléfono"/>';
    string += '</td>';
    string += '</tr>';    
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Proveedor</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:120px;margin-bottom:5px" id="collaboratorCarrierNew">';  
    $.each(carriersData, function(index, carrier) {
        string += '<option value="' + carrier.id + '">' + carrier.name + '</option>'; 
    });        
    string += '</select>';
    string += '</td>';
    string += '</tr>';
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;""><label style="padding-top:12px">Correo</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="collaboratorMailNew" placeholder="Correo electrónico"/>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Posición</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:200px;margin-bottom:5px" id="collaboratorJobNew" placeholder="Puesto de trabajo"/>';
    string += '</td>';
    string += '</tr>';  
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Desarrollador</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:240px;margin-bottom:5px" id="collaboratorDeveloperNew">'; 
    string += '<option value="0">Selecciona...</option>'; 
    $.each(developersData, function(index, developers) {
        if (developers.flagId == 1) {
            string += '<option value="' + developers.id + '" data-hubspotid="' + developers.hubSpotId + '">' + developers.name + '</option>';  
        }
    });        
    string += '</select>';
    string += '</td>';
    string += '</tr>';    
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Id Desarrollador</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="collaboratorProviderIdNew" placeholder="Puesto de trabajo"/>';
    string += '</td>';
    string += '</tr>';  
    /*string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;"><label style="padding-top:12px">Rol Central</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:240px;margin-bottom:5px" id="collaboratorRoleNew">'; 
    string += '<option value="0">Selecciona...</option>'; 
    $.each(centralRoles, function(index, roles) {
        string += '<option value="' + roles.id + '">' + roles.name + '</option>'; 
    });        
    string += '</select>';
    string += '</td>';
    string += '</tr>'; */  
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;">&nbsp;</td>';
    string += '<td style="vertical-align:middle;padding-left:8px;padding-top:4px;padding-bottom:4px">';
    string += '<button type="button" class="btn btn-sm btn-danger closeNewCollaboratorModal">Cancelar</button>';
    string += '&nbsp;&nbsp;';
    string += '<button type="button" class="btn btn-sm btn-success saveCollaborator">Agregar</button>';
    string += '</td>';
    string += '</tr>';     
    string += '<tr style="display:none" id="collaboratorNewResponseContainer">';
    string += '<td style="padding-left:8px;">&nbsp;</td>';
    string += '<td style="text-align:left;vertical-align:top;" id="collaboratorNewResponse">&nbsp;</td>';
    string += '</tr>';                 
    string += '</table>';
    $('#newCollaboratorBody').html(string); 
});

$(document).on("click", ".saveCollaborator", function(e) {
    e.preventDefault();
    var collaboratorName = $('#collaboratorNameNew').val();
    var collaboratorLastName = $("#collaboratorLastNameNew").val();
    var collaboratorStatus = $("#collaboratorStatusNew").val(); 
    var collaboratorPhone = $('#collaboratorPhoneNew').val();
    var collaboratorCarrier = $('#collaboratorCarrierNew').val(); 
    var collaboratorMail = $("#collaboratorMailNew").val();
    var collaboratorJob = $('#collaboratorJobNew').val();
    var developerId = $('#collaboratorDeveloperNew').val();
    var collaboratorProviderId = $('#collaboratorProviderIdNew').val();
    var developerHubSpotId = $('#collaboratorDeveloperNew').find('option:selected').data('hubspotid'); 
    var roleId = 7;
    //console.log(collaboratorName,collaboratorLastName,collaboratorStatus,collaboratorPhone, collaboratorCarrier,collaboratorMail,collaboratorJob,developerId,developerHubSpotId,roleId);
    var flag = 0;
    var regString = /^([a-zA-Z0-9 _-áéíóúÁÉÍÓÚÜüÑñ\']+)$/;
    var regNumbers = /^\+([0-9]{12})$/;
    var regMail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (collaboratorStatus == 0) {
        if ($('#collaboratorStatusNew').next().length == 0) {
            $('#collaboratorStatusNew').addClass('input-danger');
            $('#collaboratorStatusNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona el Status.</label>');
        } 
        flag++;
    } else {
        if ($('#collaboratorStatusNew').next().length > 0) {
            $('#collaboratorStatusNew').removeClass('input-danger');
            $('#collaboratorStatusNew').next('label').remove();
        } 
    }   
    
    if (developerId == 0) {
        if ($('#collaboratorDeveloperNew').next().length == 0) {
            $('#collaboratorDeveloperNew').addClass('input-danger');
            $('#collaboratorDeveloperNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona un Desarrollador.</label>');
        } 
        flag++;
    } else {
        if ($('#collaboratorDeveloperNew').next().length > 0) {
            $('#collaboratorDeveloperNew').removeClass('input-danger');
            $('#collaboratorDeveloperNew').next('label').remove();
        } 
    } 
    /*if (roleId == 0) {
        if ($('#collaboratorRoleNew').next().length == 0) {
            $('#collaboratorRoleNew').addClass('input-danger');
            $('#collaboratorRoleNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona el Rol.</label>');
        } 
        flag++;
    } else {
        if ($('#collaboratorRoleNew').next().length > 0) {
            $('#collaboratorRoleNew').removeClass('input-danger');
            $('#collaboratorRoleNew').next('label').remove();
        } 
    }*/

    if (!(regNumbers.test(collaboratorPhone))) {
        if (collaboratorPhone != '') {
            if ($('#collaboratorPhoneNew').next().length == 0) {
                $('#collaboratorPhoneNew').addClass('input-danger');
                $('#collaboratorPhoneNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Celular válido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorPhoneNew').next().length == 0) {
                $('#collaboratorPhoneNew').addClass('input-danger');
                $('#collaboratorPhoneNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Celular válido.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorPhoneNew').next().length > 0) {
            $('#collaboratorPhoneNew').removeClass('input-danger');
            $('#collaboratorPhoneNew').next('label').remove();
        } 
    } 
    if (!(regString.test(collaboratorName))) {
        if (collaboratorName != '') {
            if ($('#collaboratorNameNew').next().length == 0) {
                $('#collaboratorNameNew').addClass('input-danger');
                $('#collaboratorNameNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Nombre inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorNameNew').next().length == 0) {
                $('#collaboratorNameNew').addClass('input-danger');
                $('#collaboratorNameNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Nombre.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorNameNew').next().length > 0) {
            $('#collaboratorNameNew').removeClass('input-danger');
            $('#collaboratorNameNew').next('label').remove();
        } 
    } 
    if (!(regString.test(collaboratorLastName))) {
        if (collaboratorLastName != '') {
            if ($('#collaboratorLastNameNew').next().length == 0) {
                $('#collaboratorLastNameNew').addClass('input-danger');
                $('#collaboratorLastNameNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Nombre inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorLastNameNew').next().length == 0) {
                $('#collaboratorLastNameNew').addClass('input-danger');
                $('#collaboratorLastNameNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Apellido.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorLastNameNew').next().length > 0) {
            $('#collaboratorLastNameNew').removeClass('input-danger');
            $('#collaboratorLastNameNew').next('label').remove();
        } 
    } 
    if (!(regMail.test(collaboratorMail))) {
        if (collaboratorMail != '') {
            if ($('#collaboratorMailNew').next().length == 0) {
                $('#collaboratorMailNew').addClass('input-danger');
                $('#collaboratorMailNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Email inválido.</label>');
            } 
            flag++;
        } else {
            if ($('#collaboratorMailNew').next().length == 0) {
                $('#collaboratorMailNew').addClass('input-danger');
                $('#collaboratorMailNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Debes ingresar un Email.</label>');
            }  
            flag++;               
        }
    } else {
        if ($('#collaboratorMailNew').next().length > 0) {
            $('#collaboratorMailNew').removeClass('input-danger');
            $('#collaboratorMailNew').next('label').remove();
        } 
    } 
    if (!(regString.test(collaboratorJob))) {
        if (collaboratorJob != '') {
            if ($('#collaboratorJobNew').next().length == 0) {
                $('#collaboratorJobNew').addClass('input-danger');
                $('#collaboratorJobNew').after('<label class="error text-danger" style="font-size:12px;text-align:left">Formato incorrecto.</label>');
            } 
            flag++;
        }
    } else {
        if ($('#collaboratorJobNew').next().length > 0) {
            $('#collaboratorJobNew').removeClass('input-danger');
            $('#collaboratorJobNew').next('label').remove();
        } 
    } 
    if (flag == 0) {
        //$('.saveCollaborator').prop('disabled', true);
        //$('.closeNewCollaboratorModal').prop('disabled', true);
        var recordDescription = "New: " + collaboratorName + " / " + collaboratorLastName + " / " + collaboratorStatus + " / " + collaboratorPhone + " / " + collaboratorCarrier + " / " + collaboratorMail + " / " + collaboratorJob + " / " + developerId + " / " + developerHubSpotId + " / " + roleId + " / " + collaboratorProviderId;
        $('#collaboratorNewResponseContainer').css('display', 'table-row');
        $('#collaboratorNewResponse').html('&nbsp;&nbsp;<img src="images/loading.gif" class="img-responsive" align="left" style="margin: 0 auto; width:24px;">');
        $.ajax({ 
            type: "POST",
            data: {
                type:"insertCollaborator",
                collaboratorName:collaboratorName,
                collaboratorLastName:collaboratorLastName,
                collaboratorStatus:collaboratorStatus,
                collaboratorPhone:collaboratorPhone ,
                collaboratorCarrier:collaboratorCarrier,
                collaboratorMail:collaboratorMail,
                collaboratorJob:collaboratorJob,
                collaboratorProviderId:collaboratorProviderId,
                developerId:developerId,
                developerHubSpotId:developerHubSpotId,
                roleId:roleId,
                recordDescription:recordDescription
            },
            url: "./php/collaboratorData.php", 
            dataType: 'json',
            success: function(response) {
                console.log(response);
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response.result == 'success') {
                        $('#collaboratorNewResponse').html('&nbsp;&nbsp;<label style="color:green">El colaborador se agregó con éxito.</label>');
                        setTimeout(function () { 
                            $('#newCollaboratorModal').modal('hide');
                            getCollaborators(response.collaboratorId); 
                            showCollaboratorData(response.collaboratorId);
                            showCollaboratorAssignment(response.collaboratorId);
                            $(".hiddencolumn").css("display", "none");
                            $("#collaboratorContainer").removeClass("col-md-12");
                            $("#collaboratorContainer").addClass("col-md-4");
                            $("#collaboratorActions").removeClass("col-md-12");
                            $("#collaboratorActions").addClass("col-md-4");
                            $("#collaboratorActions").css("display", "block");
                            $("#collaboratorDependencies").removeClass("col-md-12");
                            $("#collaboratorDependencies").addClass("col-md-4");
                            $("#collaboratorDependencies").css("display", "block");
                            $("#showColumns").css("display", "inline");                            
                        }, 1500);  
                    } else if (response.result == 'duplicate') {
                        $('#collaboratorNewResponse').html('&nbsp;&nbsp;<label style="color:red">El resgitro ya existe.</label>');
                    } else {
                        $('#collaboratorNewResponse').html('&nbsp;&nbsp;<label style="color:red">Hubo un error. ('+ response.message +')</label>');
                    }
                }
            },
            error: function(response) { 
                $('#collaboratorNewResponse').html('&nbsp;&nbsp;<label style="color:red">Hubo un error.</label>');
            } 
        });       
    } 
});

$(document).on("click", ".closeNewCollaboratorModal", function(e) {
    e.preventDefault();
    $('#newCollaboratorModal').modal('hide');
});

$(document).on("change", "#box_1", function(e) {
    if ($('#box_0').is(':checked')) {
        if ($('#box_1').is(':checked')) {
            $("#box_1").prop('checked', true);
        } else {
            $("#box_1").prop('checked', false);
        }
    } else {
        $("#box_1").prop('checked', true);
    }
});

$(document).on("change", "#box_0", function(e) {
    if ($('#box_1').is(':checked')) {
        if ($('#box_0').is(':checked')) {
            $("#box_0").prop('checked', true);
        } else {
            $("#box_0").prop('checked', false);
        }
    } else {
        $("#box_0").prop('checked', true);
    }
});