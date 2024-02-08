//v=01.0.0 29/12/2019
$(document).ready(function () {
    getDevelopers();
    $("#newDeveloperModal").on("show", function () {
        $("body").addClass("modal-open");
    }).on("hidden", function () {
        $("body").removeClass("modal-open")
    });  
});

$("#searchDeveloperInput").on('keyup', function (e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchDeveloper").click();
    }
});

$(document).on("click", "#searchDeveloper", function(e) {
    e.preventDefault();
    var searchString = $("#searchDeveloperInput").val();
    var result;
    var flag = 0;
    var string = '<table class="table table-striped" style="width:100%">';  
    string += '<thead><tr>'; 
    string += '<th style="width:50px">&nbsp;</th>'; 
    string += '<th>Id</th>'; 
    string += '<th>Nombre</th>'; 
    string += '<th style="text-align:center;">Status</th>'; 
    string += '<th style="text-align:center;">Asignación Central</th>'; 
    string += '<th style="text-align:center;">Leads al Desarrollador</th>'; 
    string += '<th style="text-align:center;">Sincronización de Precios</th>';
    string += '<th style="text-align:center;">HubSpot Id</th>'; 
    string += '</tr></thead>';
    $.each(developersData, function(index, developer) {
        result = developer.name.toUpperCase().includes(searchString.toUpperCase());
        if (result) {
            string += '<tr>';
            string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
            string += '<button type="button" class="btn btn-sm btn-normal showDeveloperDetail" name="' + developer.id  + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>'                
            string += '</td>';
            string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
            string += developer.id; 
            string += '</td>'; 
            string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
            string += developer.nameText; 
            string += '</td>'; 
            string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
            string += developer.status; 
            string += '</td>'; 
            string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
            if (developer.centralAsignment == 0) {
                centralAsignment = 'No';
            } else if (developer.centralAsignment == 1) {
                centralAsignment = 'Si';
            } else {
                centralAsignment = 'Error';
            }    
            string += centralAsignment; 
            string += '</td>'; 
            string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
            if (developer.leadsToDeveloper == 0) {
                leadsToDeveloper = 'No';
            } else if (developer.leadsToDeveloper == 1) {
                leadsToDeveloper = 'Si';
            } else {
                leadsToDeveloper = 'Error';
            }    
            string += leadsToDeveloper; 
            string += '</td>';   
            string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
            if (developer.priceSync == 0) {
                priceSync = 'No';
            } else if (developer.priceSync == 1) {
                priceSync = 'Si';
            } else {
                priceSync = 'Error';
            } 
            string += priceSync; 
            string += '</td>';                       
            string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center">'; 
            string += developer.hubSpotId; 
            string += '</td>'; 
            string += '</tr>'; 
            flag++;
        }
    });
    if (flag == 0) {
        string += '<tr>';
        string += '<td colspan="7" style="vertical-align:middle;white-space:nowrap;text-align:center">'; 
        string += 'No se encontraron coincidencias.'                
        string += '</td>';
        string += '</tr>';
    }
    string += '</table>';  
    $('#developersInfo').html(string);
});

$(document).on("click", "#newDeveloperButton", function(e) {
    e.preventDefault();
    $('#newDeveloperModalBody').html(''); 
    developerManagement('new', null);
});

$(document).on("click", ".showDeveloperDetail", function(e) {
    e.preventDefault();
    developerId = $(this).attr('name');
    $('#newDeveloperModalBody').html(''); 
    developerManagement('edit', developerId);
});

var assignedCollaborators = [];
function developerManagement(actionType, developerId) {
    assignedCollaborators = [];
    string = '<table style="width:100%">';
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Id</label></td>';
    string += '<td style="padding-left:8px;">';
    if (actionType == 'edit') {
        string += '<input type="text" class="form-control input-sm" style="width:110px;margin-bottom:5px" id="developerIdInput" placeholder="Id desarrollador" readonly />';
    } else {
        string += '<input type="text" class="form-control input-sm" style="width:110px;margin-bottom:5px" id="developerIdInput" placeholder="Id desarrollador" />';
    }
    string += '</td>';
    string += '</tr>';  
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Nombre</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerNameInput" placeholder="Nombre del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Nombre Normalizado</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerNameNorInput" placeholder="Nombre del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom: 1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Sitio Web</label></td>';
    string += '<td style="padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerSiteURLInput" placeholder="Sitio del desarrollador"/>';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Status</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:120px;margin-bottom:5px" id="developerStatusInput">';
    if (actionType == 'new') {
        string += '<option value="0">Seleciona...</option>'; 
    }          
    string += '<option value="1">Active</option>';   
    string += '<option value="2">Inactive</option>';      
    string += '<option value="9">Dummy</option>';   
    string += '</select>';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Sincronización de Precios</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:80px;margin-bottom:5px" id="developerPriceSyncInput">';
    string += '<option value="0" selected>No</option>';           
    string += '<option value="1">Si</option>';   
    string += '</select>';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;" id="developerAPIURLContainer">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">API URL (Precio)</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerAPIURLInput" placeholder="API URL del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;" id="developerAPITokenContainer">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">API Token (Precio)</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerAPITokenInput" placeholder="API Token del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;" id="developerProdTypeContainer">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Product Type (Precio)</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerProdTypeInput" placeholder="Product Type del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Admin Key</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<input type="text" class="form-control input-sm" style="width:250px;margin-bottom:5px" id="developerAdminKeyInput" placeholder="Admin Key del desarrollador" />';
    string += '</td>';
    string += '</tr>'; 
    if (actionType == 'new') {
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Asignación Central</label></td>';
        string += '<td style="vertical-align:middle;padding-left:8px;">';
        string += '<select class="form-control input-sm" style="width:80px;margin-bottom:5px" id="developerCentralAsignmentInput" disabled>';
        string += '<option value="0" selected>No</option>';           
        string += '</select>';
        string += '</td>';
        string += '</tr>'; 
    } else {
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Asignación Central</label></td>';
        string += '<td style="vertical-align:middle;padding-left:8px;">';
        string += '<select class="form-control input-sm" style="width:80px;margin-bottom:5px" id="developerCentralAsignmentInput">';
        string += '<option value="0" selected>No</option>';           
        string += '<option value="1">Si</option>';   
        string += '</select>';
        string += '</td>';
        string += '</tr>';         
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Gerente Central</label></td>';
        string += '<td style="text-align:left;vertical-align:top;padding-left:8px;">';
        string += '<label style="padding-top:12px" id="collaboratorsManagerAssignedRow">No aplica</label>';
        string += '</td>';
        string += '</tr>';
        string += '<tr style="border-bottom:1px dotted #eeeeee;" id="developerAssignedCollaboratorsContainer">';
        string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Gestor Central</label></td>';
        string += '<td style="text-align:left;vertical-align:top;padding-left:8px;">';
        string += '<label style="padding-top:12px" id="collaboratorsAssignedRow">No aplica</label>';
        string += '</td>';
        string += '</tr>';
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Colaboradores</label></td>';
        string += '<td style="vertical-align:middle;padding-left:8px;text-align:left;" id="collaboratorsUnassignedRow">';
        string += '<label style="padding-top:12px">No aplica</label>';
        string += '</td>';
        string += '</tr>';   
    }    
    string += '<tr style="border-bottom:1px dotted #eeeeee;">';
    string += '<td style="text-align:right;vertical-align:top;width:200px"><label style="padding-top:12px">Envío de Leads</label></td>';
    string += '<td style="vertical-align:middle;padding-left:8px;">';
    string += '<select class="form-control input-sm" style="width:80px;margin-bottom:5px" id="developerLeadsToDeveloperInput">';
    string += '<option value="0" selected>No</option>';           
    string += '<option value="1">Si</option>';   
    string += '</select>';
    string += '</td>';
    string += '</tr>';    
    if (actionType == 'edit') {
        $('#newDeveloperModalTitle').html('Edición de Desarrollador'); 
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:120px"><label style="padding-top:12px">HubSpot Id</label></td>';
        string += '<td style="vertical-align:middle;padding-left:8px;">';
        string += '<input type="text" class="form-control input-sm" style="width:110px;margin-bottom:5px" id="developerHubSpotIdInput" placeholder="HubSpot Id" readonly />';
        string += '</td>';
        string += '</tr>';
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:120px">';
        string += '<label style="padding-top:12px">Logo</label>';
        string += '</td>';
        string += '<td style="vertical-align:middle;padding-left:8px;" id="developerImg">';
        // string += '<img src="https://tratodirecto.com/images/desarrolladores/HOSM/HOSM_Logo.png" alt="" style="max-height: 80px;">';
        string += '</td>';
        string += '</tr>';
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:120px">&nbsp;</td>';
        string += '<td style="vertical-align:middle;padding-left:8px;padding-top:4px;padding-bottom:4px">';
        string += '<button type="button" class="btn btn-sm btn-danger closeNewDeveloperModal">Cancelar</button>';
        string += '&nbsp;&nbsp;';
        string += '<button type="button" class="btn btn-sm btn-success saveDeveloper" name="edit">Guardar</button>';
        string += '</td>';
        string += '</tr>';
    } else if (actionType == 'new') {
        $('#newDeveloperModalTitle').html('Alta de Desarrollador'); 
        string += '<tr style="border-bottom:1px dotted #eeeeee;">';
        string += '<td style="text-align:right;vertical-align:top;width:120px">&nbsp;</td>';
        string += '<td style="vertical-align:middle;padding-left:8px;padding-top:4px;padding-bottom:4px">';
        string += '<input type="hidden" class="form-control input-sm" style="width:110px;margin-bottom:5px" id="developerHubSpotIdInput" value="0" readonly />';
        string += '<button type="button" class="btn btn-sm btn-danger closeNewDeveloperModal">Cancelar</button>';
        string += '&nbsp;&nbsp;';
        string += '<button type="button" class="btn btn-sm btn-success saveDeveloper" name="new">Agregar</button>';
        string += '</td>';
        string += '</tr>';
    }
    string += '<tr style="display:none" id="developerActionResponseContainer">';
    string += '<td colspan="2" style="text-align:center;vertical-align:top;" id="developerActionResponse">&nbsp;</td>';
    string += '</tr>';
    string += '</table>';
    $('#newDeveloperModalBody').html(string); 
    if (actionType == 'edit') {
        $("#developerSiteURLInput").addClass("loading");
        $.each(developersData, function(index, developer) {
            if (developerId == developer.id) {
                $('#developerIdInput').val(developer.id);
                $('#developerNameInput').val(developer.nameText);
                $('#developerNameNorInput').val(developer.nameNormalized);
                $("#developerStatusInput").val(developer.statusId).trigger('change'); 
                $('#developerAPIURLInput').val(developer.apiURL);
                $('#developerAPITokenInput').val(developer.apiToken);
                $("#developerPriceSyncInput").val(developer.priceSync).trigger('change'); 
                $('#developerProdTypeInput').val(developer.productType);
                $('#developerAdminKeyInput').val(developer.adminKey);
                $("#developerCentralAsignmentInput").val(developer.centralAsignment).trigger('change'); 
                $("#developerLeadsToDeveloperInput").val(developer.leadsToDeveloper).trigger('change'); 
                $('#developerHubSpotIdInput').val(developer.hubSpotId); 
                if (developer.urlImage == "" || developer.urlImage == null) {
                    string = `<form class="formUpload" id="images">
                                <input type="file" id="imgInput" accept="image/*" multiple="">
                            </form>`;
                    $("#developerImg").html(string);
                } else {
                    if (developer.urlImage.indexOf("storage") == -1) {
                        string = '<img src="https://tratodirecto.com/'+developer.urlImage+'" alt="" style="max-height: 80px;">';
                        $("#developerImg").html(string);
                    } else {
                        string = '<img src="'+developer.urlImage+'" alt="" style="max-height: 80px;">';
                        $("#developerImg").html(string);
                    }
                    
                }
                $.ajax({
                    type: "GET",
                    data: {type:"getCompanyData", hubSpotId:developer.hubSpotId},
                    url: "./php/developerData.php", 
                    dataType: 'json',
                    success: function(response) {  
                        $("#developerSiteURLInput").removeClass("loading");
                        $('#developerSiteURLInput').val(response.domain); 
                    }
                });
                if (developer.priceSync == 0) {
                    $("#developerAPIURLContainer").css("display", "none");
                    $("#developerAPITokenContainer").css("display", "none");
                    $("#developerProdTypeContainer").css("display", "none");
                }
            }
        });
        $('#collaboratorsAssignedRow').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:18px;">');
        $('#collaboratorsManagerAssignedRow').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:18px;">');
        var role11Flag = 0;
        var role14Flag = 0;
        $.ajax({
            type: "GET",
            data: {type:"collaboratorsAssigned",developerId:developerId},
            url: "./php/developerData.php", 
            dataType: 'json',
            success: function(response) {
                if (response.collaborator.length == 0) {
                    $('#collaboratorsAssignedRow').html('No hay gestores asignados');
                    $('#collaboratorsManagerAssignedRow').html('No hay gerentes asignados');
                } else {
                    $('#collaboratorsAssignedRow').html('');
                    $('#collaboratorsManagerAssignedRow').html('');
                    $.each(response.collaborator, function(index, collaborator) {
                        if (collaborator.roleId == 11) {
                            $("#collaboratorsAssignedRow").append('<span>' + collaborator.name + ' ' + collaborator.lastName + '&nbsp;&nbsp;&nbsp;<a href="#" class="unassignCollaborator" data-developerid="'+ developerId +'" data-collaboratorid="'+ collaborator.id +'" style="font-size:10px">Desasignar</a><br></span>');
                            role11Flag++;
                        } else {
                            $("#collaboratorsManagerAssignedRow").append('<span>' + collaborator.name + ' ' + collaborator.lastName + '&nbsp;&nbsp;&nbsp;<a href="#" class="unassignCollaborator" data-developerid="'+ developerId +'" data-collaboratorid="'+ collaborator.id +'" style="font-size:10px">Desasignar</a><br></span>');
                            role14Flag++;
                        }
                        assignedCollaborators.push({
                            "developerId": developerId, 
                            "collaboratorId": collaborator.id,
                            "collaboratorName": collaborator.name, 
                            "collaboratorLastName": collaborator.lastName,
                            "collaboratorRole": parseInt(collaborator.roleId)
                        }); 
                    });
                    if (role11Flag == 0) {
                        $('#collaboratorsAssignedRow').html('No hay gestores asignados');
                    }
                    if (role14Flag == 0) {
                        $('#collaboratorsManagerAssignedRow').html('No hay gerentes asignados');
                    }
                }
            }
        });
        $('#collaboratorsUnassignedRow').html('<img src="images/loading.gif" align="left" class="img-responsive" style="margin: 0 auto; width:18px;">');
        $.ajax({
            type: "GET",
            data: {type:"collaboratorsUnassigned",developerId:developerId},
            url: "./php/developerData.php", 
            dataType: 'json',
            success: function(response) {
                if (response.collaborator.length == 0) {
                    $('#collaboratorsUnassignedRow').html('<label style="padding-top:12px">No hay colaboradores disponibles</label>');
                } else {
                    $('#collaboratorsUnassignedRow').html('');
                    stringCollaborators = '<div class="form-group" style="margin-bottom:0px">';
                    stringCollaborators += '<span style="white-space: nowrap">';
                    stringCollaborators += '<select class="form-control input-sm" style="width:250px;margin-bottom:5px;display:inline-block" id="developerCollaboratorsUnassignedInput">'; 
                    stringCollaborators += '<option value="0">Selecciona...</option>';   
                    $.each(response.collaborator, function(index, collaborator) {
                        stringCollaborators += '<option value="'+developerId+'-'+collaborator.id+'" data-collaboratorname="' + collaborator.name + '" data-collaboratorlastname="' + collaborator.lastName + '">' + collaborator.name + ' ' + collaborator.lastName + ' (' + collaborator.role + ', ' + collaborator.status + ')</option>';
                    });
                    stringCollaborators += '</select>';
                    stringCollaborators += '<label id="assignCollaboratorButton"></label>';
                    stringCollaborators += '</span>';
                    stringCollaborators += '</div>';
                    $("#collaboratorsUnassignedRow").html(stringCollaborators);
                }
            }
        });        
    } else {
        $("#developerAssignedCollaboratorsContainer").css("display", "none");
        $("#developerUnassignedCollaboratorsContainer").css("display", "none");
        $("#developerAPIURLContainer").css("display", "none");
        $("#developerAPITokenContainer").css("display", "none");
        $("#developerProdTypeContainer").css("display", "none");
    }
    $('#openNewDeveloperModal').click();
}

$(document).on("keyup", "#developerNameInput", function (e) {
    e.preventDefault();
    var nameNormalized = $("#developerNameInput").val().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().split(" ").join("-");
    $("#developerNameNorInput").val(nameNormalized);
});

$(document).on("change", "#developerCollaboratorsUnassignedInput", function(e) {
    e.preventDefault();
    var collaboratorData = $(this).val();
    var collaboratorDataArray = collaboratorData.split("-");
    var collaboratorId = collaboratorDataArray[1];
    var developerId = collaboratorDataArray[0];
    var count = assignedCollaborators.length;
    var flag = 0;
    if (collaboratorData != 0) {
        if (count != 0) {
            for (i=0;i<count;i++) {
                if ((assignedCollaborators[i].collaboratorId == collaboratorId) && (assignedCollaborators[i].developerId == developerId)) {
                    flag++;
                }
                if (i == count-1) {
                    if (flag == 0) {
                        $("#assignCollaboratorButton").html('&nbsp;&nbsp;<span style="font-size:10px"><a href="#" class="assignCollaborator" data-developerid="'+ developerId +'" data-collaboratorrole="14">Gerente</a></span><span style="font-size:10px">&nbsp;/&nbsp;<a href="#" class="assignCollaborator" data-developerid="'+ developerId +'" data-collaboratorrole="11">Gestor</a></span>');
                    } else {
                        $("#assignCollaboratorButton").html('');
                    }
                }
            }
        } else {
            $("#assignCollaboratorButton").html('&nbsp;&nbsp;<span style="font-size:10px"><a href="#" class="assignCollaborator" data-developerid="'+ developerId +'" data-collaboratorrole="14">Gerente</a></span><span style="font-size:10px">&nbsp;/&nbsp;<a href="#" class="assignCollaborator" data-developerid="'+ developerId +'" data-collaboratorrole="11">Gestor</a></span>');
        }
    } else {
        $("#assignCollaboratorButton").html('');
    }
});

$(document).on("click", ".assignCollaborator", function(e) {
    e.preventDefault();
    var collaboratorData = $('#developerCollaboratorsUnassignedInput').val();
    var collaboratorDataArray = collaboratorData.split("-");
    var collaboratorId = collaboratorDataArray[1];
    var developerId = collaboratorDataArray[0];
    var selected = $('#developerCollaboratorsUnassignedInput').find('option:selected');
    var collaboratorName = selected.data('collaboratorname'); 
    var collaboratorLastName = selected.data('collaboratorlastname');
    var collaboratorRole = $(this).data('collaboratorrole');
    //console.log(developerId, collaboratorId, collaboratorName, collaboratorLastName, collaboratorRole);
    assignedCollaborators.push({
        "developerId": developerId, 
        "collaboratorId": collaboratorId,
        "collaboratorName": collaboratorName, 
        "collaboratorLastName": collaboratorLastName,
        "collaboratorRole": collaboratorRole
    }); 
    if (($("#collaboratorsAssignedRow").children().length == 0) && (collaboratorRole == 11)) {
        $("#collaboratorsAssignedRow").removeClass('text-danger');
        $("#collaboratorsAssignedRow").html('');
    }
    if (($("#collaboratorsManagerAssignedRow").children().length == 0) && (collaboratorRole == 14))  {
        $("#collaboratorsManagerAssignedRow").removeClass('text-danger');
        $("#collaboratorsManagerAssignedRow").html('');
    }
    if (collaboratorRole == 11) {
        $("#collaboratorsAssignedRow").append('<span>' + collaboratorName + ' ' + collaboratorLastName + '&nbsp;&nbsp;&nbsp;<a href="#" class="unassignCollaborator" data-developerid="'+ developerId +'" data-collaboratorid="'+ collaboratorId +'" data-collaboratorrole="'+ collaboratorRole +'" style="font-size:10px">Desasignar</a><br></span>');
    } else {
        $("#collaboratorsManagerAssignedRow").append('<span>' + collaboratorName + ' ' + collaboratorLastName + '&nbsp;&nbsp;&nbsp;<a href="#" class="unassignCollaborator" data-developerid="'+ developerId +'" data-collaboratorid="'+ collaboratorId +'" data-collaboratorrole="'+ collaboratorRole +'" style="font-size:10px">Desasignar</a><br></span>');
    }
    $("#developerCollaboratorsUnassignedInput").val(0).trigger('change'); 
});

/*$(document).on("change", "#developerCentralAsignmentInput", function(e) {
    e.preventDefault();
    if ($(this).val() == 0) {
        $("#developerAssignedCollaboratorsContainer").css("display", "none");
    } else {
        $("#developerAssignedCollaboratorsContainer").css("display", "table-row");
    }
});*/

$(document).on("change", "#developerPriceSyncInput", function(e) {
    e.preventDefault();
    if ($(this).val() == 0) {
        $("#developerAPIURLContainer").css("display", "none");
        $("#developerAPITokenContainer").css("display", "none");
        $("#developerProdTypeContainer").css("display", "none");
    } else {
        $("#developerAPIURLContainer").css("display", "table-row");
        $("#developerAPITokenContainer").css("display", "table-row");
        $("#developerProdTypeContainer").css("display", "table-row");
    }
});
    
$(document).on("click", ".unassignCollaborator", function(e) {
    e.preventDefault();
    $("#developerCollaboratorsUnassignedInput").val(0).trigger('change'); 
    var collaboratorId = $(this).data("collaboratorid");
    var developerId = $(this).data("developerid");
    var collaboratorRole = $(this).data("collaboratorrole");
    var count = assignedCollaborators.length;
    if (count != 0) {
        for (i=0;i<count;i++) {
            if ((assignedCollaborators[i].collaboratorId == collaboratorId) && (assignedCollaborators[i].developerId == developerId)) {
                assignedCollaborators.splice(i, 1);
                $(this).parent().remove();
                if ($("#collaboratorsAssignedRow").html() == '') {
                    $("#collaboratorsAssignedRow").html('No hay gestores asignados');
                }
                if ($("#collaboratorsManagerAssignedRow").html() == '') {
                    $("#collaboratorsManagerAssignedRow").html('No hay gerentes asignados');
                }
                break;
            }
        }
    }
});

$(document).on("click", ".saveDeveloper", function(e) {
    e.preventDefault();
    var developerId = $('#developerIdInput').val();
    var developerName = $('#developerNameInput').val();
    var developerNameNormalized = $('#developerNameNorInput').val();
    var developerSiteURL = $("#developerSiteURLInput").val();
    var developerStatus = $("#developerStatusInput").val(); 
    var developerPriceSync = $("#developerPriceSyncInput").val(); 
    var developerAPIURL = $('#developerAPIURLInput').val();
    var developerAPIToken = $('#developerAPITokenInput').val();
    var developerProdType = $('#developerProdTypeInput').val();
    var developerCentralAsignment = $('#developerCentralAsignmentInput').val();
    var developerAdminKey = $('#developerAdminKeyInput').val();
    var developerLeadsToDeveloper = $('#developerLeadsToDeveloperInput').val();
    var developerHubSpotId = $("#developerHubSpotIdInput").val(); 
    var actionType = $(this).attr('name');
    var flag = 0;
    var developerIdFlag = 0;
    if (developerPriceSync == 0) {
        developerAPIURL = null;
        developerAPIToken = null;
        developerProdType = null;
    } 
    //console.log(actionType, developerId, developerName, developerSiteURL, developerStatus);
    //console.log(developerPriceSync, developerAPIURL, developerAPIToken, developerProdType, developerAdminKey);
    //console.log(developerCentralAsignment, developerHubSpotId, developerLeadsToDeveloper);
    //console.log(assignedCollaborators);
    $.each(developersData, function(index, developer) {
        if (developerId.toUpperCase() == developer.id.toUpperCase()) {
            developerIdFlag = 1;
        }
    });
    if (actionType == 'new') {
        if (developerId != '') {
            developerId = developerId.toUpperCase();
            $('#developerIdInput').val(developerId);
            if (developerIdFlag == 1) {
                if ($("#developerIdInput").next().length == 0) {
                    $("#developerIdInput").closest('td').parent().addClass('has-error');
                    $("#developerIdInput").after('<label class="error text-danger" style="font-size:12px;text-align:left">El Id ya existe</label>');
                }         
                flag++;
            } else {
                if ($("#developerIdInput").next().length > 0) {
                    $("#developerIdInput").closest('td').parent().removeClass('has-error');
                    $("#developerIdInput").next('label').remove();
                }
            }
        } else {
            if ($("#developerIdInput").next().length == 0) {
                $("#developerIdInput").closest('td').parent().addClass('has-error');
                $("#developerIdInput").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un Id</label>');
            }         
            flag++;
        }
    }
    if (developerName != '') {
        if ($("#developerNameInput").next().length > 0) {
            $("#developerNameInput").closest('td').parent().removeClass('has-error');
            $("#developerNameInput").next('label').remove();
        }
    } else {
        if ($("#developerNameInput").next().length == 0) {
            $("#developerNameInput").closest('td').parent().addClass('has-error');
            $("#developerNameInput").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un Nombre</label>');
        }         
        flag++;
    }
    if (developerNameNormalized != '') {
        if ($("#developerNameNorInput").next().length > 0) {
            $("#developerNameNorInput").closest('td').parent().removeClass('has-error');
            $("#developerNameNorInput").next('label').remove();
        }
    } else {
        if ($("#developerNameNorInput").next().length == 0) {
            $("#developerNameNorInput").closest('td').parent().addClass('has-error');
            $("#developerNameNorInput").after('<label class="error text-danger" style="font-size:12px;text-align:left">Ingresa un Nombre</label>');
        }         
        flag++;
    }
    if (developerStatus != 0) {
        if ($("#developerStatusInput").next().length > 0) {
            $("#developerStatusInput").closest('td').parent().removeClass('has-error');
            $("#developerStatusInput").next('label').remove();
        }
    } else {
        if ($("#developerStatusInput").next().length == 0) {
            $("#developerStatusInput").closest('td').parent().addClass('has-error');
            $("#developerStatusInput").after('<label class="error text-danger" style="font-size:12px;text-align:left">Selecciona el Status</label>');
        }         
        flag++;
    }

    var collaboratorFlag = 0;
    if (assignedCollaborators.length != 0) {
        $.each(assignedCollaborators, function(index, collaborator) {
            if (collaborator.collaboratorRole == 11) {
                collaboratorFlag++;
            }
        });
    }

    if ((developerCentralAsignment != 0) && (collaboratorFlag == 0) && (actionType == 'edit')) {
        $("#collaboratorsAssignedRow").addClass('text-danger');
        $("#collaboratorsAssignedRow").html('Debes agregar al menos un gestor.');   
        flag++;
    } 
    if(flag == 0) {
        if (developerCentralAsignment == 0) {
            assignedCollaborators = null;
        }
        $("#developerActionResponseContainer").css("display", "table-row");
        $("#developerActionResponse").html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:24px;">');
        $.ajax({
            type: "GET",              
            data: {
                type: "insertDeveloper",
                actionType: actionType,
                developerId: developerId,
                developerName: developerName,
                developerNameNormalized: developerNameNormalized,
                developerSiteURL: developerSiteURL,
                developerStatus: developerStatus,
                developerPriceSync: developerPriceSync,
                developerAPIURL: developerAPIURL,
                developerAPIToken: developerAPIToken,
                developerProdType: developerProdType,
                developerAdminKey: developerAdminKey,
                developerCentralAsignment: developerCentralAsignment,
                developerLeadsToDeveloper: developerLeadsToDeveloper,
                companyHubSpotId: developerHubSpotId,
                collaborators: assignedCollaborators
            },
            url: "./php/developerData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    if (actionType == 'new') {
                        $("#developerActionResponse").html('<label style="color:green">El Desarrollador se agregó con éxito.</label>');
                    } else {
                        $("#developerActionResponse").html('<label style="color:green">El Desarrollador se actualizó con éxito.</label>');  
                    }
                    setTimeout(function () { 
                        getDevelopers();
                        $('#newDeveloperModal').modal('hide');
                    }, 2000);
                    if (developerStatus==2) {
                        verifyAdvertising(developerId);
                    }
                } else {
                    $("#developerActionResponse").html('<label style="color:red">Hubo un error ('+response.result+').</label>'); 
                    /*setTimeout(function () {
                        $('#newDeveloperModal').modal('hide'); 
                    }, 2000); */                 
                }                
            },
            error: function(response) { 
                $("#developerActionResponse").html('<label style="color:red">Hubo un error.</label>');
                /*setTimeout(function () { 
                    $('#newDeveloperModal').modal('hide');
                }, 2000);  */  
            } 
        });  
    }
});

function verifyAdvertising(developerId) {
    $.ajax({
        type: "GET",              
        data: {type: "verifyAdvertising",developerId: developerId},
        url: "./php/developerData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.state>0 || response.locality>0 || response.zone>0) {
                    text = response.state+" estado(s), "+response.locality+" municipio(s) y "+response.zone+" zona(s) tienen desarrollos del desarrollador como publicidad, favor de cambiar";
                    notify("growl-danger", "Publicidad", text);
                }
            }                
        },
        error: function(response) { 
            notify("growl-danger", "Error", "Hubo un error");
        } 
    });
}

var developersData = [];
function getDevelopers() {
    var string = '';
    developersData = [];
    $('#developersInfo').html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48px;">');
    $.ajax({
        type: "GET",
        data: {type:"getDevelopers"},
        url: "./php/developerData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                string += '<table class="table table-striped" style="width:100%">';  
                string += '<thead><tr>';
                string += '<th style="width:50px">&nbsp;</th>';
                string += '<th>Id</th><th>Nombre</th>';
                string += '<th style="text-align:center;">Status</th>';
                string += '<th style="text-align:center;">Asignación Central</th>';
                string += '<th style="text-align:center;">Leads al Desarrollador</th>';
                string += '<th style="text-align:center;">Sincronización de Precios</th>';               
                string += '<th style="text-align:center;">HubSpot Id</th>';
                string += '</tr></thead>';
                $.each(response.developer, function(index, developer) {
                    developersData.push({
                        "id": developer.id,
                        "name": developer.name,
                        "nameText": developer.nameText,
                        "nameNormalized": developer.nameNormalized,
                        "statusId": developer.statusId,
                        "status": developer.status,
                        "mediaId": developer.mediaId,
                        "apiURL": developer.apiURL,
                        "apiToken": developer.apiToken,
                        "priceSync": developer.priceSync,
                        "productType": developer.productType,
                        "adminKey": developer.adminKey,
                        "centralAsignment": developer.centralAsignment,
                        "leadsToDeveloper": developer.leadsToDeveloper,
                        "hubSpotId": developer.hubSpotId,
                        "urlImage": developer.urlImage
                    });
                    string += '<tr>';
                    string += '<td style="vertical-align:middle;white-space: nowrap;">'; 
                    string += '<button type="button" class="btn btn-sm btn-normal showDeveloperDetail" name="' + developer.id  + '" title="Detalles"><i class="glyphicon glyphicon-edit" style="color:#ffffff"></i></button>'                
                    string += '</td>';
                    string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
                    string += developer.id; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;">'; 
                    string += developer.nameText; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    string += developer.status; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    if (developer.centralAsignment == 0) {
                        centralAsignment = 'No';
                    } else if (developer.centralAsignment == 1) {
                        centralAsignment = 'Si';
                    } else {
                        centralAsignment = 'Error';
                    }    
                    string += centralAsignment; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    if (developer.leadsToDeveloper == 0) {
                        leadsToDeveloper = 'No';
                    } else if (developer.leadsToDeveloper == 1) {
                        leadsToDeveloper = 'Si';
                    } else {
                        leadsToDeveloper = 'Error';
                    }    
                    string += leadsToDeveloper; 
                    string += '</td>'; 
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center;">'; 
                    if (developer.priceSync == 0) {
                        priceSync = 'No';
                    } else if (developer.priceSync == 1) {
                        priceSync = 'Si';
                    } else {
                        priceSync = 'Error';
                    } 
                    string += priceSync; 
                    string += '</td>';                     
                    string += '<td style="vertical-align:middle;white-space:nowrap;text-align:center">'; 
                    string += developer.hubSpotId; 
                    string += '</td>'; 
                    string += '</tr>'; 
                });
                string += '</table>';  
                $('#developersInfo').html(string);
            }
        }
    });	
}

$(document).on("click", ".closeNewDeveloperModal", function(e) {
    e.preventDefault();
    $('#newDeveloperModal').modal('hide');
});

$(document).on("change", "#imgInput", function(e) {
    e.preventDefault();
    readURL(this);
});

function readURL(input) {
    if (input.files && input.files[0]  && (input.files[0].type.indexOf("image") > -1)) {
        string = `<div class="row">
                    <div class="col-md-6" style="text-align: center;"><img src="" id="imageDev" alt="" style="max-height: 80px;"></div>
                    <div class="col-md-6"><button type="button" id="uploadImage" class="btn btn-sm btn-success" style="margin-top: 20px">Agregar imagen</button></div>
                </div>`;
        $("#developerImg").html(string);
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#imageDev').attr('src', e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    } else {
        notify("growl-danger", "Error", "Solo se aceptan imagenes.");  
    }
}

$(document).on("click", "#uploadImage", function (e) {
    e.preventDefault();
    dataImg = $('#imageDev').attr("src").split(";");
    developer = $("#developerIdInput").val();
    typeImg = dataImg[0].split(":")[1];
    srcImg = dataImg[1].split(",")[1];
    nameImg = developer+"-logo."+ typeImg.split("/")[1];
    myblob = b64toBlob(srcImg, typeImg);
    today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds() )/1000;
    var data = new FormData();
    data.append("type", "uploadImage");
    data.append("developerId", developer);
    data.append("nameImage", nameImg);
    data.append("uploadTime", today);
    data.append("myfile", myblob, nameImg);
    $.ajax({
        type: "POST",
        data: data,
        url: "./php/developerData.php", 
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response == true) {
                    string = '<img src="https://storage.googleapis.com/tratodirecto.com/'+nameImg+'" alt="" style="max-height: 80px;">';
                    $("#developerImg").html(string);
                } else if( response == 'Error al subir' ){
                    notify("growl-danger", "Error", "Error al subir la imagen, intentalo mas tarde");  
                } else {
                    notify("growl-danger", "Error", "Error al registrar la imagen, intentalo mas tarde");  
                }
                setTimeout(() => {
                    $("#openNewDeveloperModal").click();
                    getDevelopers();
                }, 1500);
                
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", "Ha ocurrido un problema, intentalo mas tarde");  
        }
    });
});

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