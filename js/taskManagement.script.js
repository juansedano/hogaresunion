$(document).ready(function () {
    // getData();
    getFilters();
    getOptions();
    getFilteredTasks();
    table= $('#basicTable').DataTable({
        responsive: false,
        autoWidth: false,
        order: [[ 4, 'asc' ]],
        language: {
            "emptyTable": "No hay tareas con los filtros de busqueda"
        },
        columnDefs: [ 
            {"targets": 2, "type": "date"},
            {"targets": 3, "type": "date"},
            {"targets": 4, "type": "date"},
            {"targets": 5, "type": "date"}
        ]
    });
});

var data= [];
var meses = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
var mesesE = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getData() {
    $.ajax({
        type: "GET",
        data: {type:"getData"},
        url: "./php/taskManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                data = [];
                $('#basicTable').dataTable().fnClearTable();
                response.forEach(element => {
                    data.push({ 
                        "idTask" : element.idTask,
                        "createdAt" : element.createdAt,
                        "expire" : element.expire,
                        "idTypeTask" : element.idTypeTask,
                        "nameTypeTask" : element.nameTypeTask,
                        "description" : element.description,
                        "idCollaborator" : element.idCollaborator,
                        "nameCollaborator" : element.nameCollaborator,
                        "idPriority" : element.idPriority,
                        "namePriority" : element.namePriority,
                        "idStatus" : element.idStatus,
                        "status" : element.status, 
                        "newDate" : element.newDate,
                        "rescheduled" : element.rescheduled,
                        "idContact" : element.idContact, 
                        "itsPublic" : "1",
                        "lastActivity" : element.lastActivity,
                        "idCreatedBy": element.idCreatedBy,
                        "nameCreatedBy": element.nameCreatedBy
                    });
                    if (element.newDate=="") {
                        newDate = new Date(parseInt(element.expire)*1000);
                    } else {
                        newDate=new Date(parseInt(element.newDate)*1000);
                    }
                    date=new Date(parseInt(element.expire)*1000);
                    date = returnTime(date);
                    order = returnTimeOrder(newDate);
                    newDate = returnTime(newDate);
                    // create=new Date((parseInt(element.createdAt)*1000)+(6*60*60*1000));
                    create = new Date((element.createdAt*1000));
                    create = new Date((element.createdAt*1000) + (create.getTimezoneOffset()*60*1000));
                    create = returnTime(create);//create.getDate()+"-"+(meses[create.getMonth()])+"-"+create.getFullYear().toString().substr(-2);
                    lastActivity = new Date((element.lastActivity*1000));
                    lastActivity = new Date((element.lastActivity*1000) + (lastActivity.getTimezoneOffset()*60*1000));
                    lastActivity = returnTime(lastActivity);
                    if (element.idStatus==26) {
                        $('#basicTable').dataTable().fnAddData([
                            '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + element.idTask + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>',
                            element.idTask,
                            element.nameCreatedBy,
                            create,
                            date,
                            newDate,
                            lastActivity,
                            element.nameTypeTask,
                            '<div style="width: 450px;height: 15px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">'+ element.description +'</div>',
                            element.idContact,
                            element.nameCollaborator,
                            element.namePriority,
                            element.status
                        ]);
                    }
                    
                    if ($("#task option[value='"+ element.idTypeTask +"']").length==0) $("#task").append("<option value='"+ element.idTypeTask +"'>"+ element.nameTypeTask +"</option>");
                    if ($("#collaborator option[value='"+ element.idCollaborator +"']").length==0) $("#collaborator").append("<option value='"+ element.idCollaborator +"'>"+ element.nameCollaborator +"</option>");
                    if ($("#collaborator option[value='"+ element.idCreatedBy +"']").length==0) $("#collaborator").append("<option value='"+ element.idCreatedBy +"'>"+ element.nameCreatedBy +"</option>");
                    if ($("#priority option[value='"+ element.idPriority +"']").length==0) $("#priority").append("<option value='"+ element.idPriority +"'>"+ element.namePriority +"</option>");
                    if ($("#status option[value='"+ element.idStatus +"']").length==0) $("#status").append("<option value='"+ element.idStatus +"'>"+ element.status +"</option>");
                });
                getPrivate();
                $("#resultsContainer").show();
                $("#status").val('26').trigger('change.select2');
            }
        }
    });
}

function returnTime(date) {
    dia = (parseInt(date.getDate())<10) ? "0"+ parseInt(date.getDate()) : parseInt(date.getDate());
    // mes = ((parseInt(date.getMonth())+1)<10) ? "0"+ (parseInt(date.getMonth())+1) : (parseInt(date.getMonth())+1);
    mes = mesesE[date.getMonth()];
    return dia +"-"+ mes +"-"+ date.getFullYear() +" "+date.getHours()+":"+((date.getMinutes()<10) ? "0"+date.getMinutes() : date.getMinutes());
}

function returnTimeOrder(date) {
    var anio= date.getFullYear().toString().substr(-2);
    var mes = ((parseInt(date.getMonth())+1)<10) ? "0"+(parseInt(date.getMonth())+1):parseInt(date.getMonth())+1;
    var dia = ((parseInt(date.getDate()))<10) ? "0"+parseInt(date.getDate()):parseInt(date.getDate());
    var hora = date.getHours();
    var minu = ((date.getMinutes()==0) ? "00" : date.getMinutes());
    return `${anio}-${mes}-${dia} ${hora}:${minu}`;
}

function getPrivate() {
    $.ajax({
        type: "GET",
        data: {type:"getPrivateData"},
        url: "./php/taskManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                response.forEach(element => {
                    data.push({ 
                        "idTask" : element.idTask,
                        "createdAt" : element.createdAt,
                        "expire" : element.expire,
                        "idTypeTask" : element.idTypeTask,
                        "nameTypeTask" : element.nameTypeTask,
                        "description" : element.description,
                        "idCollaborator" : element.idCollaborator,
                        "nameCollaborator" : element.nameCollaborator,
                        "idPriority" : element.idPriority,
                        "namePriority" : element.namePriority,
                        "idStatus" : element.idStatus,
                        "status" : element.status, 
                        "newDate" : element.newDate,
                        "rescheduled" : element.rescheduled,
                        "idContact" : element.idContact, 
                        "itsPublic" : "0",
                        "lastActivity" : element.lastActivity,
                        "idCreatedBy": element.idCreatedBy,
                        "nameCreatedBy": element.nameCreatedBy
                    });
                    if (element.newDate=="") {
                        newDate = new Date(parseInt(element.expire)*1000);
                    } else {
                        newDate=new Date(parseInt(element.newDate)*1000);
                    }
                    date=new Date(parseInt(element.expire)*1000);
                    date = returnTime(date);
                    order = returnTimeOrder(newDate);
                    newDate = returnTime(newDate);
                    // create=new Date((parseInt(element.createdAt)*1000)+(6*60*60*1000));
                    create = new Date((element.createdAt*1000));
                    create = new Date((element.createdAt*1000) + (create.getTimezoneOffset()*60*1000));
                    create = returnTime(create);
                    lastActivity = new Date((element.lastActivity*1000));
                    lastActivity = new Date((element.lastActivity*1000) + (lastActivity.getTimezoneOffset()*60*1000));
                    lastActivity = returnTime(lastActivity);
                    if (element.idStatus==26) {
                        $('#basicTable').dataTable().fnAddData([
                            '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + element.idTask + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>',
                            element.idTask,
                            element.nameCreatedBy,
                            create,
                            date,
                            newDate,
                            lastActivity,
                            element.nameTypeTask,
                            '<div style="width: 450px;height: 15px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">'+ element.description +'</div>',
                            element.idContact,
                            element.nameCollaborator,
                            element.namePriority,
                            element.status
                        ]);
                    }
                    
                    if ($("#task option[value='"+ element.idTypeTask +"']").length==0) $("#task").append("<option value='"+ element.idTypeTask +"'>"+ element.nameTypeTask +"</option>");
                    if ($("#collaborator option[value='"+ element.idCollaborator +"']").length==0) $("#collaborator").append("<option value='"+ element.idCollaborator +"'>"+ element.nameCollaborator +"</option>");
                    if ($("#priority option[value='"+ element.idPriority +"']").length==0) $("#priority").append("<option value='"+ element.idPriority +"'>"+ element.namePriority +"</option>");
                    if ($("#status option[value='"+ element.idStatus +"']").length==0) $("#status").append("<option value='"+ element.idStatus +"'>"+ element.status +"</option>");
                });
            }
        }
    });
}

function getOptions() {
    $.ajax({
        type: "GET",
        data: {type:"getOptions"},
        url: "./php/taskManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                response.priority.forEach(element => {
                    $("#priority1").append("<option value='"+ element.idPriority +"'>"+ element.namePriority +"</option>");
                    $("#priority2").append("<option value='"+ element.idPriority +"'>"+ element.namePriority +"</option>");
                });
                response.task.forEach(element => {
                    $("#taskType1").append("<option value='"+ element.idTask +"'>"+ element.nameTask +"</option>");
                    $("#taskType2").append("<option value='"+ element.idTask +"'>"+ element.nameTask +"</option>");
                });
                
            }
        }
    });
}

function getFilters() {
    $.ajax({
        type: "GET",
        data: {type:"getFilters"},
        url: "./php/taskManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                response.taskTypes.forEach(taskType => $("#task").append(new Option(taskType.name, taskType.id, false, false)) );
                response.priorities.forEach(priority => $("#priority").append(new Option(priority.name, priority.id, false, false)) );
                response.collaborators.forEach(collaborator => $("#collaborator").append(new Option(collaborator.name, collaborator.id, false, false)) );
            }
        }
    });
}

$(document).on("keyup", "#idHubspot", function(e) {
    e.preventDefault();
    if (e.keyCode == 13) {
        $("#searchContacts").click();
    }
});

$(document).on("change", "#public", function (e) {
    e.preventDefault();
    console.log("hola");
    
});

$(document).on("click", "#searchContacts", function(e) {
    e.preventDefault();
    var keyword = $('#idHubspot').val();
    if (keyword != '') {   
        getContactsBySearchBox(keyword);
    }
});

var globalFlag = 0;
function getContactsBySearchBox(keyword) {
    $("#nameUserH").html("<img src='images/loading.gif' class='img-responsive' style='margin: 0 auto; width:20px; padding-bottom:10px;'>");
    $.ajax({
        type: "POST",
        data: {type:"getHubSpotUserData", hubSpotUserId:keyword},
        url: "./php/messagingData.php", 
        dataType: 'json',
        success: function(response) {     
            if (response.firstName != "") {
                $("#nameUserH").html('<label style="font-weight: bold;color:black">Nombre del contacto:&nbsp;&nbsp;</label>'+response.firstName+ ' ' +response.lastName);
                $("#date1").attr("disabled", false);
                $("#timepicker1").attr("disabled", false);
                $("#priority1").attr("disabled", false);
                $("#taskType1").attr("disabled", false);
                $("#description").attr("disabled", false);
                $("#addTask").attr("disabled", false);
            }else{
                $("#nameUserH").html('<label style="font-weight: bold;color:red">No se encontraron coincidencias.</label>');
            }                  
        },
        error: function(response) { 
            $("#nameUserH").html('<label style="font-weight: bold;color:red">Hubo un error</label>');     
        }
    });   
}

$(document).on("click", "#addTask", function (e) {
    e.preventDefault();
    var idUser = $("#idHubspot").val();
    var date = $("#date1").val().split("/");
    var time = $("#timepicker1").val().split(":");
    var priority = $("#priority1").val();
    var type = $("#taskType1").val();
    var desc = $("#description").val();
    var itsPublic = $("#itsPublic").prop("checked");
    if (date!=""&&priority!=0&&type!=0&&desc!="") {
        var datetime = Date.UTC(date[2], parseInt(date[1])-1, date[0],parseInt(time[0])+6,time[1],0 )/1000;
        var today=new Date();
        today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours(), today.getMinutes(), 0 )/1000;
        $.ajax({
            type: "GET",
            data: {type:"addTask", desc:desc, today:today, datetime:datetime, typeTask:type, idUser:idUser, priority:priority, public:itsPublic },
            url: "./php/taskManagementData.php",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    today=new Date();
                    $('#basicTable').dataTable().fnAddData([
                        '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + response.idInsert + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>',
                        response.idInsert, 
                        '',
                        returnTime(today),
                        returnTime(new Date(datetime*1000)), 
                        returnTime(new Date(datetime*1000)),
                        returnTime(today),
                        $("#taskType1 option[value='"+ type +"']").text(),
                        desc,
                        idUser,
                        "Sin asignar", 
                        $("#priority1 option[value='"+ priority +"']").text(), 
                        "Pendiente"
                    ]);
                    $("#openAddTaskModal").click();
                    notify("growl-success", "Tarea agregada", "Tarea agregada correctamente");
                    $("#idHubspot").val("");
                    $("#date1").val("");
                    $("#priority1 option[value='0']").attr("selected",true);
                    $("#taskType1 option[value='0']").attr("selected",true);
                    $("#description").val("");
                    $("#itsPublic").prop("checked", true);
                    $("#itsPublic").change();
                    date = new Date();
                    date = (parseInt(date.getDate())+1)+"/"+(parseInt(date.getMonth())+1)+"/"+date.getFullYear();
                    $('#date1').datepicker({ dateFormat: 'dd/mm/yy', minDate: date });
                    $('#date1').val(date);
                    $("#nameUserH").html('Aqui va en nombre del usuario de HubSpot');
                }
            }
        });
    } else {
        notify("growl-danger", "Datos no validos", "Llena todos los datos");
    }
    
});

$(document).on("click", "#newTask", function (e) {
    e.preventDefault();
    $("#openAddTaskModal").click();
});

$(document).on("click", ".showDetail",function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    $("#idTask").attr("name", id);
    $("#taskNumber").text(id);
    developer = 0;
    $.ajax({
        type: "GET",
        data: {type:"getTaskData", id:id},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) { 
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                var keyword = response.contact;
                $.ajax({
                    type: "POST",
                    data: {type:"getUserData", keyword:keyword,developerId:developer},
                    url: "./php/appointmentDataNew.php", 
                    dataType: 'json',
                    success: function(response2) {  
                        if (response2.status == "success") {
                            $("#imageUploadContainer").hide();
                            $("#contacTitle1").html("Datos de HubSpot/Usuario: " + response.contact);
                            $("#contactData").empty();
                            $("#contactData").append(
                                '<div class="col-md-6"><label style="font-weight: bold;color:black">Nombre del contacto:&nbsp;&nbsp;</label>'+ response2.name +'</div>'+
                                '<div class="col-md-6"><label style="font-weight: bold;color:black">Apellidos del contacto:&nbsp;&nbsp;</label> '+ response2.lastName +' </div>'+
                                '<div class="col-md-6"><label style="font-weight: bold;color:black">Telefono del contacto:&nbsp;&nbsp;</label> '+ response2.phone +' </div>'+
                                '<div class="col-md-6"><label style="font-weight: bold;color:black">Email del contacto:&nbsp;&nbsp;</label> '+ response2.email +' </div>'
                            );
                            var fullDate='';
                            if (response.newDate=="") {
                                fullDate=new Date(parseInt(response.expiresAt)*1000);
                            } else {
                                fullDate=new Date(parseInt(response.newDate)*1000);
                            }
                            $('#date2').datepicker({ dateFormat: 'dd/mm/yy', minDate: new Date(fullDate.getFullYear(), parseInt(fullDate.getMonth()), fullDate.getDate()+1)});
                            var date = fullDate.getDate()+"/"+(parseInt(fullDate.getMonth())+1)+"/"+fullDate.getFullYear();
                            var time = fullDate.getHours()+":"+((fullDate.getMinutes()==0) ? "00" : fullDate.getMinutes());
                            $("#date2").val(date);
                            $("#timepicker2").val(time);
                            $("#priority2 option[value='"+response.priority+"']").attr("selected", true);
                            $("#taskType2 option[value='"+ response.taskType +"']").attr("selected", true);
                            $("#desc").val(response.description);
                            $("#hand").empty();
                            if (response.colAsigned!="0") { 
                                $("#hand").append('<img src="images/fillHand.png" alt="manita" style="height: 60px;" id="asigned" name="'+  response.colAsigned+'"></img>');
                                $("#hand").append('<label>'+ response.nameAsigned +'</label>');
                            } else { 
                                $("#hand").append('<img src="images/emptyHand.png" alt="manita" style="height: 60px;" id="asigned"  name="'+  response.colAsigned+'"></img>');
                                $("#hand").append('<label>'+ response.nameAsigned +'</label>');
                            }
                            // $("#changePublic").next().addClass("disabled");
                            if (response.public==1) {
                                $("#changePublic").prop("checked", true);
                            } else {
                                $("#changePublic").prop("checked", false);
                            }
                            if (response.itsMine&&(response.status!=27&&response.status!=28)) {
                                $("#addNote").attr("disabled", false);
                                $("#newNote").attr("disabled", false);
                                $("#date2").attr("disabled", false);
                            } else {
                                $("#addNote").attr("disabled", true);
                                $("#newNote").attr("disabled", true);
                                $("#cancelTask").attr("disabled", true);
                                $("#date2").attr("disabled", true);
                                $("#timepicker2").attr("disabled", true);
                                $("#repTask").attr("disabled", true);
                                $("#finishTask").attr("disabled", true);
                            }
                            $("#cancelTask").attr("disabled", true);
                            $("#repTask").attr("disabled", true);
                            $("#finishTask").attr("disabled", true);
                            $("#messagesContainer").empty();
                            $("#openTaskDeatilModal").click();
                            var datecre = new Date((response.createdAt*1000));
                            datecre = new Date( (response.createdAt*1000) + (datecre.getTimezoneOffset()*60*1000));
                            $("#messagesContainer").append(
                                '<div class="msg-contact" id="msg-0" data-utc="0">'+
                                    '<div>'+
                                        '<span style="color:#428BCA">Sistema</span>'+
                                        '<span style="float:right;font-size:11px">'+ returnTime(datecre) +'</span>'+
                                    '</div>Tarea creada por '+ response.ColCreated +
                                '</div>'
                            );
                            getNotes(id);
                        }            
                    }
                });   
            }
        }
    }); 
});

function getNotes(idTask) {
    $.ajax({
        type: "GET",
        data: {type:"getNotes", idTask:idTask},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // var response = $.parseJSON(response);
                console.log(response);
                
                if (response.length>0) {
                    response.forEach(element => {
                        var date = new Date(element.date*1000);
                        date = new Date( (element.date*1000) + (date.getTimezoneOffset()*60*1000));
                        date = returnTime( date );
                        // localtex = 'dev/upload/';
                        prodtex = 'desarrolladores/uploadedFiles/';
                        if (element.textNote.indexOf(prodtex)>-1) {
                            texto = '<a style="cursor:pointer" target="_blank" href="' + element.textNote + '">'+
                                        '<img src="' + element.textNote + '" class="msg-image">'+
                                    '</a>';
                        } else {
                            texto = element.textNote;
                        }
                        $("#messagesContainer").append(
                            '<div class="msg-contact" id="msg-'+ element.idNote +'" data-utc="'+ element.date +'">'+
                                '<div>'+
                                    '<span style="color:#428BCA">'+ element.nameCollaborator +'</span>'+
                                    '<span style="float:right;font-size:11px">'+ date +'</span>'+
                                '</div>'+ 
                                texto +
                            '</div>'
                        );
                        setTimeout(() => {
                            $('#messagesContainer').scrollTop( $('#messagesContainer').prop('scrollHeight') ); 
                        }, 1000);
                    });
                } 
            }
        }
    });
}

$(document).on("click", "#asigned", function (e) {
    e.preventDefault();
    colaborator = $(this).attr("name");
    if (colaborator!=0) {
        unassigned();
    } else {
        var id =$("#idTask").attr("name");
        $.ajax({
            type: "GET",
            data: {type:"assignTask", idTask:id},
            url: "./php/taskManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if(response.status){
                        $("#hand").empty();
                        notify("growl-success", "Tarea asignada", "La tarea se te ha asignado correctamente.");
                        $("#hand").append('<img src="images/fillHand.png" alt="manita" style="height: 60px;" id="asigned" name="'+  response.id+'"></img>');
                        $("#hand").append('<label>'+ response.name +'</label>');
                        $("#addNote").attr("disabled", false);
                        $("#newNote").attr("disabled", false);
                        $("#date2").attr("disabled", false);
                        $("#timepicker2").attr("disabled", false);
                        getFilteredTasks();
                    } else {
                        $("#hand").empty();
                        notify("growl-danger", "Tarea ya tomada", "La tarea ya ha sido tomada. Recarga la pagina para actualizar la tabla");
                        $("#hand").append('<img src="images/fillHand.png" alt="manita" style="height: 60px;" id="asigned" name="1"></img>');
                        $("#hand").append('<label>'+ response.name +'</label>');
                    }
                }
                            
            }
        });   
    }
});

function unassigned() {
    var id =$("#idTask").attr("name");
    $.ajax({
        type: "GET",
        data: {type:"unassignTask", idTask:id},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if(response){
                    $("#hand").empty();
                    notify("growl-success", "Tarea desasignada", "La tarea se te ha desasignado correctamente.");
                    $("#hand").append('<img src="images/emptyHand.png" alt="manita" style="height: 60px;" id="asigned" name="0"></img>');
                    $("#hand").append('<label>Sin asignar</label>');
                    $("#addNote").attr("disabled", true);
                    $("#newNote").attr("disabled", true);
                    $("#date2").attr("disabled", true);
                    $("#timepicker2").attr("disabled", true);
                    getFilteredTasks();
                } else {
                    var nameA = $("#asigned").next().text();
                    notify("growl-danger", "Error", "La tarea a sido asignada a "+nameA);
                }
            }
                        
        }
    });
}

$(document).on("click", "#finishTask", function (e) {
    e.preventDefault();
    var id =$("#idTask").attr("name");
    $.ajax({
        type: "GET",
        data: {type:"finishTask", idTask:id},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    $("#addNote").attr("disabled", true);
                    $("#newNote").attr("disabled", true);
                    $("#cancelTask").attr("disabled", true);
                    $("#repTask").attr("disabled", true);
                    $("#date2").attr("disabled", true);
                    $("#timepicker2").attr("disabled", true);
                    $("#finishTask").attr("disabled", true);
                    getFilteredTasks();
                    unassigned();
                    $("#openTaskDeatilModal").click();
                    notify("growl-success", "Tarea finalizada", "La tarea se ha finalizado correctamente");
                } else {
                    notify("growl-danger", "Tarea sin finalizar", "No se ha podido finalizar la tarea");
                }
                
            }
        }
    });  
});

$(document).on("click", "#cancelTask", function (e) {
    e.preventDefault();
    var id =$("#idTask").attr("name");
    $.ajax({
        type: "GET",
        data: {type:"cancelTask", idTask:id},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    $("#addNote").attr("disabled", true);
                    $("#newNote").attr("disabled", true);
                    $("#cancelTask").attr("disabled", true);
                    $("#date2").attr("disabled", true);
                    $("#timepicker2").attr("disabled", true);
                    $("#repTask").attr("disabled", true);
                    $("#finishTask").attr("disabled", true);
                    getFilteredTasks();
                    unassigned();
                    $("#openTaskDeatilModal").click();
                    notify("growl-success", "Tarea cancelada", "La tarea se ha cancelado correctamente");
                } else {
                    notify("growl-danger", "Tarea sin cancelar", "No se ha podido cancelar la tarea");
                }
                
            }
        }
    });  
});

$(document).on("click", "#repTask", function (e) {
    e.preventDefault();
    var id =$("#idTask").attr("name");
    var date = $("#date2").val().split("/");
    var time = $("#timepicker2").val().split(":");
    var datetime = Date.UTC(date[2], parseInt(date[1])-1, date[0],parseInt(time[0])+6,time[1],0 )/1000;
    var today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),0,0,0 )/1000;
    $.ajax({
        type: "GET",
        data: {type:"repTask", idTask:id, today:today, newDate:datetime},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Tarea reprogramada", "La tarea se ha reprogramado correctamente");
                    notify("growl-error", "Tarea desasignada", "La tarea se ha desasignadao por la reprogramacion");
                    getFilteredTasks();
                    unassigned();
                    $("#openTaskDeatilModal").click();
                } else {
                    notify("growl-danger", "Tarea sin reprogramar", "No se ha podido reprogramar la tarea");
                }
            }
        }
    });
});

$(document).on("click", "#closeTask", function (e) {
    e.preventDefault();
    unassigned();
    $("#openTaskDeatilModal").click();
});

$(document).on("click", "#closeModalTask", function (e) {
    e.preventDefault();
    unassigned();
    $("#openTaskDeatilModal").click();
});

$(document).on("click", "#addNote", function (e) {
    e.preventDefault();
    var id = $("#idTask").attr("name");
    var text = $("#newNote").val();
    if (text!="") {
        $("#newNote").attr("disabled", true);
        $("#messageLoader").show();
        var today=new Date();
        today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds() )/1000;
        $.ajax({
            type: "GET",
            data: {type:"addNote", idTask:id, today:today, note:text},
            url: "./php/taskManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response.status) {
                        $("#newNote").val("");
                        // var date = new Date((today*1000)+(6*60*60*1000));
                        date = new Date((today*1000));
                        date = new Date((today*1000) + (date.getTimezoneOffset()*60*1000));
                        date = date.getDate()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
                        $("#messagesContainer").append(
                            '<div class="msg-contact" id="msg-'+ response.idNote +'" data-utc="'+ today +'">'+
                                '<div>'+
                                    '<span style="color:#428BCA">Tú</span>'+
                                    '<span style="float:right;font-size:11px">'+ date +'</span>'+
                                '</div>'+text+
                            '</div>'
                        );
                        $("#newNote").attr("disabled", false);
                        $("#messageLoader").hide();
                        notify("growl-success", "Nota agregada", "La Nota se ha agregado correctamente");
                        $('#messagesContainer').scrollTop( $('#messagesContainer').prop('scrollHeight') ); 
                        $("#cancelTask").attr("disabled", false);
                        $("#finishTask").attr("disabled", false);
                        $("#changePublic").attr("disabled", false);
                        // $("#changePublic").next().removeClass("disabled");
                    } else {
                        $("#newNote").attr("disabled", false);
                        $("#messageLoader").hide();
                        notify("growl-danger", "Nota sin agregar", "No se ha podido agregar la nota");
                    }
                }
            }
        });
    } else {
        notify("growl-danger", "Error", "Agrega texto a la nota que deseas agregar");
    }
});

$(document).on("change", "#task", function (e) {
    e.preventDefault();
    // filter();
    getFilteredTasks();
});

$(document).on("change", "#collaborator", function (e) {
    e.preventDefault();
    // filter();
    getFilteredTasks();
});

$(document).on("change", "#priority", function (e) {
    e.preventDefault();
    // filter();
    getFilteredTasks();
});

$(document).on("change", "#status", function (e) {
    e.preventDefault();
    // filter();
    getFilteredTasks();
});

$(document).on("change", "#type", function (e) {
    e.preventDefault();
    // filter();
    getFilteredTasks();
});

function filter() {
    var tempData = data;
    var task = $("#task").val();
    var collaborator = $("#collaborator").val();
    var priority = $("#priority").val();
    var status = $("#status").val();
    var type = $("#type").val();
    var tempData2 = [];
    if(task!="All"){
        tempData2 = [];
        tempData.forEach(element => {
            if (element.idTypeTask==task) {
                tempData2.push(element);
            }
        });
        tempData = tempData2;
    }
    if(collaborator!="All"){
        tempData2 = [];
        tempData.forEach(element => {
            if (element.idCollaborator==collaborator || element.idCreatedBy==collaborator) {
                tempData2.push(element);
            }
        });
        tempData = tempData2;
    }
    if(priority!="All"){
        tempData2 = [];
        tempData.forEach(element => {
            if (element.idPriority==priority) {
                tempData2.push(element);
            }
        });
        tempData = tempData2;
    }
    if(status!="All"){
        tempData2 = [];
        if (status==0) {
            tempData.forEach(element => {
                if (element.rescheduled==1&&element.idStatus==26) {
                    tempData2.push(element);
                }
            });
        } else if(status==1) {
            tempData.forEach(element => {
                if(element.idStatus==26) {
                    var taskDate = "";
                    var today=new Date();
                    if (element.rescheduled==1) {
                        taskDate = new Date((element.newDate*1000));
                        taskDate = new Date((element.newDate*1000) + (taskDate.getTimezoneOffset()*60*1000));
                    } else {
                        taskDate = new Date((element.expire*1000));
                        taskDate = new Date((element.expire*1000) + (taskDate.getTimezoneOffset()*60*1000));
                    }
                    if (taskDate < today) {
                        tempData2.push(element);
                    }

                }
            });
        } else {
            tempData.forEach(element => {
                if (element.idStatus==status) {
                    tempData2.push(element);
                }
            });
        }
        tempData = tempData2;
    }
    if(type!="All"){
        tempData2 = [];
        tempData.forEach(element => {
            if (element.itsPublic==type) {
                tempData2.push(element);
            }
        });
        tempData = tempData2;
    }
    $('#basicTable').dataTable().fnClearTable();
    tempData.forEach(element => {
        if (element.newDate=="") {
            newDate = new Date(parseInt(element.expire)*1000);
        } else {
            newDate=new Date(parseInt(element.newDate)*1000);
        }
        date=new Date(parseInt(element.expire)*1000);
        date = returnTime(date);
        order = returnTimeOrder(newDate);
        newDate = returnTime(newDate);
        // create=new Date((parseInt(element.createdAt)*1000)+(6*60*60*1000));
        create = new Date((element.createdAt*1000));
        create = new Date((element.createdAt*1000) + (create.getTimezoneOffset()*60*1000));
        create = returnTime(create);
        lastActivity = new Date((element.lastActivity*1000));
        lastActivity = new Date((element.lastActivity*1000) + (lastActivity.getTimezoneOffset()*60*1000));
        lastActivity = returnTime(lastActivity);
        $('#basicTable').dataTable().fnAddData([
            '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + element.idTask + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>',
            element.idTask,
            element.nameCreatedBy,
            create,
            date,
            newDate,
            lastActivity,
            element.nameTypeTask,
            '<div style="width: 450px;height: 15px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">'+ element.description +'</div>',
            element.idContact,
            element.nameCollaborator,
            element.namePriority,
            element.status
        ]);
    });
}

function getFilteredTasks() {
    const task = $("#task").val();
    const collaborator = $("#collaborator").val();
    const priority = $("#priority").val();
    const status = $("#status").val();
    const typeTask = $("#type").val();
    $.ajax({
        type: "GET",
        data: {type:"getFilteredTasks", task, collaborator, priority, status, typeTask},
        url: "./php/taskManagementData.php",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $('#basicTable').dataTable().fnClearTable();
                response.forEach(element => {
                    let newDate = element.newDate == null ? new Date(parseInt(element.expire)*1000) : new Date(parseInt(element.newDate)*1000);
                    let date = new Date(parseInt(element.expire)*1000);
                    date = returnTime(date);
                    let order = returnTimeOrder(newDate);
                    newDate = returnTime(newDate);
                    let create = new Date((element.createdAt*1000));
                    create = new Date((element.createdAt*1000) + (create.getTimezoneOffset()*60*1000));
                    create = returnTime(create);
                    let lastActivity = element.lastActivity == null ? element.createdAt : element.lastActivity;
                    lastActivity = new Date((lastActivity*1000) + (new Date((lastActivity*1000)).getTimezoneOffset()*60*1000));
                    lastActivity = returnTime(lastActivity);
                    $('#basicTable').dataTable().fnAddData([
                        '<button type="button" class="btn btn-sm btn-normal showDetail" name="' + element.idTask + '" title="Detalles"><i class="glyphicon glyphicon-search" style="color:#ffffff"></i></button>',
                        element.idTask,
                        element.nameCreatedBy,
                        create,
                        date,
                        newDate,
                        lastActivity,
                        element.nameTypeTask,
                        '<div style="width: 450px;height: 15px;text-overflow: ellipsis;white-space: nowrap;overflow: hidden">'+ element.description +'</div>',
                        element.idContact,
                        element.nameCollaborator,
                        element.namePriority,
                        element.status
                    ]);
                });
            }
        }
    });
}

$(document).on("change", "#date2", function (e) {
    e.preventDefault();
    $("#repTask").attr("disabled", false);
    $("#timepicker2").attr("disabled", false);
});

$(document).on("change", "#changePublic", function (e) {
    e.preventDefault();
    var id = $("#idTask").attr("name");
    var public = "1";
    if ($("#changePublic").prop("checked")) {
        public = "1";
    } else {
        public = "0";
    }
    var today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours()+6, today.getMinutes(),0 )/1000;
    $.ajax({
        type: "GET",
        data: {type:"changePublic", idTask:id, today:today, public:public},
        url: "./php/taskManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Realizado", response.message);
                    getFilteredTasks();
                    // $("#openTaskDeatilModal").click();
                } else {
                    notify("growl-danger", "Error", response.message);
                }
            }
        }
    });
});

var messageInput =  document.getElementById('newNote');
messageInput.addEventListener('keypress', (e) => {
    if (((e.keyCode == 13) || (event.code === 'Enter') || (e.which === 13)) && (!(e.shiftKey))) {
        e.preventDefault();
        $("#addNote").click();
    }
});

$(document).on("change", "#itsPublic", function (e) {
    if (!$(this).prop("checked")) {
        $("#idHubspot").attr("disabled", true);
        $("#date1").attr("disabled", false);
        $("#timepicker1").attr("disabled", false);
        $("#priority1").attr("disabled", false);
        $("#taskType1").attr("disabled", false);
        $("#description").attr("disabled", false);
        $("#addTask").attr("disabled", false);
    } else {
        if ($("#nameUserH").text()=="Aqui va en nombre del usuario de HubSpot") {
            $("#idHubspot").attr("disabled", false);
            $("#date1").attr("disabled", true);
            $("#timepicker1").attr("disabled", true);
            $("#priority1").attr("disabled", true);
            $("#taskType1").attr("disabled", true);
            $("#description").attr("disabled", true);
            $("#addTask").attr("disabled", true);
        } else {
            $("#idHubspot").attr("disabled", false);
            $("#date1").attr("disabled", false);
            $("#timepicker1").attr("disabled", false);
            $("#priority1").attr("disabled", false);
            $("#taskType1").attr("disabled", false);
            $("#description").attr("disabled", false);
            $("#addTask").attr("disabled", false);
        }
        
    }
});

$("#newNote").bind("paste", function(e){
    for (var i = 0; i < e.originalEvent.clipboardData.items.length; i++) {
        var clipboardItem = e.originalEvent.clipboardData.items[0];
        var type = clipboardItem.type;
        if (type.indexOf("image") != -1) {
            $("#imageUploadContainer").show();
            var file = clipboardItem.getAsFile();
            var fileType = file.type;
            var randomNum = Math.floor(Math.random() * 90000) + 10000;
            fileName = file.name.replace(/\s+/g, '');
            fileName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
            fileName = randomNum + '-task-' + fileName;
            var reader = new FileReader();
            reader.readAsDataURL(file); 
            reader.onloadend = function(e) {
                var containerHeight = $(".formUpload").height();
                $('#images').html('<img src="' + e.target.result + '" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                if (fileType.includes("image")) {
                    $('#images').html('<img src="' + e.target.result + '" data-filesource="' + e.target.result + '" data-filetype="image" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                    $(".images-action").click();
                } else if (fileType.includes("pdf")) {
                    $('#images').html('<img src="./images/pdfImage.png" data-filesource="' + e.target.result + '" data-filetype="document" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                    $(".images-action").click();
                } else {
                    $('#images').html('<img src="./images/docImage.png" data-filesource="' + e.target.result + '" data-filetype="document" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                    $(".images-action").click();
                }
            }
        }
    }
});

var dropzone = document.getElementById('newNote'); 
dropzone.ondrop = function(e){
    e.preventDefault();
    var droppedItem = e.dataTransfer.files;
    var file = droppedItem[0];
    var type = file.type;
    $("#imageUploadContainer").show();
    //if (type.indexOf("image") != -1) {
        var randomNum = Math.floor(Math.random() * 90000) + 10000;
        var fileType = file.type;
        fileName = file.name.replace(/\s+/g, '');
        fileName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
        fileName = randomNum + '-' + fileName;
        var reader = new FileReader();
        reader.readAsDataURL(file); 
        reader.onloadend = function(e) {
            var containerHeight = $(".formUpload").height();
            if (fileType.includes("image")) {
                $('#images').html('<img src="' + e.target.result + '" data-filesource="' + e.target.result + '" data-filetype="image" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                $(".images-action").click();
            } else if (fileType.includes("pdf")) {
                $('#images').html('<img src="./images/pdfImage.png" data-filesource="' + e.target.result + '" data-filetype="document" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                $(".images-action").click();
            } else {
                $('#images').html('<img src="./images/docImage.png" data-filesource="' + e.target.result + '" data-filetype="document" data-filename="' + fileName + '" style="height:'+containerHeight+'px" id="image2Send">');
                $(".images-action").click();
            }
        }
    //}
};
// $(document).on("click", "#sendImage", function ( e ) {
//     e.preventDefault();
//     console.log("hola");
    
// });

$(document).on("click", "#sendImage", function(e) {
    e.preventDefault();
    var fileData = $('#image2Send').attr('data-filesource');
    var fileName = $('#image2Send').attr('data-filename');
    var fileType = $('#image2Send').attr('data-filetype');
    var id = $("#idTask").attr("name");
    var today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds() )/1000;
    $('#sendImageContainer').html('<img src="images/loading.gif" style="width:24px;">');
    isPaused = true;
    $.ajax({
        type: "POST",
        data: {type:"sendImage",fileData:fileData,fileName:fileName,fileType:fileType,taskId:id,today:today},
        url: "./php/taskManagementData.php",
        success: function(response) {
            isPaused = false;
            response = $.parseJSON(response);
            console.log(response.status);
            $('#imageUploadContainer').hide();
            $('#sendImageContainer').html('<span style="font-size:24px;color:#FFB71B;cursor:pointer;" id="sendImage" class="fa fa-chevron-circle-right"></span>');
            if ( response.status ) {
                $('#images').html('<p id="initialMessage">Arrastra la imagen o da click en esta área.</p>');
                date = new Date((today*1000));
                date = new Date((today*1000) + (date.getTimezoneOffset()*60*1000));
                date = date.getDate()+"-"+(parseInt(date.getMonth())+1)+"-"+date.getFullYear()+" "+date.getHours()+":"+date.getMinutes();
                $("#messagesContainer").append(
                    '<div class="msg-contact" id="msg-'+ response.idNote +'" data-utc="'+ today +'">'+
                        '<div>'+
                            '<span style="color:#428BCA">Tú</span>'+
                            '<span style="float:right;font-size:11px">'+ date +'</span>'+
                        '</div>'+ 
                        '<a style="cursor:pointer" target="_blank" href="' + response.file + '">'+
                            '<img src="' + response.file + '" class="msg-image">'+
                        '</a>' +
                    '</div>'
                );
                notify("growl-success", "Nota agregada", "La Nota se ha agregado correctamente");
                setTimeout(() => {
                    $('#messagesContainer').scrollTop( $('#messagesContainer').prop('scrollHeight') ); 
                }, 1000);
                $("#cancelTask").attr("disabled", false);
                $("#finishTask").attr("disabled", false);
                $("#changePublic").attr("disabled", false);
            } else {
                notify("growl-danger", "Nota sin agregar", "No se ha podido agregar la nota");
            }
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("Status: " + textStatus);
            console.log("Error: " + errorThrown);
            console.log("Error: " + XMLHttpRequest);
            screenMsg();
        }
    });
});

// $(document).on("click", "#addFile", function (e) {
//     e.preventDefault();
//     $('#imageUploadContainer').show();
// })

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