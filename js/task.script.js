var taskTypeData = [];

function viewContactTaskContainer() { 
    if (activeMessagesName == '' || activeMessagesPhone == '') {
        screenMsg('Ups!', 'Debes seleccionar un contacto.', '2000', 'growl-danger');
        return false;
    }
    if (taskTypeData.length == 0) {
        getTaskType();
    }
    $('.contact-task-name').html(activeMessagesName+' '+activeMessagesLastName);
    $('.contact-task-phone').html('('+activeMessagesPhone+')');
    $('#contactTaskDescription').val('')
    $("#contactTaskPriority").prop("selectedIndex", 0);
    $("#contactTaskType").prop("selectedIndex", 0);
    $('#contactTaskDate').val(currentDate());
    $('#contactTaskSave').prop('disabled', false);
    $('#contactTaskClose').prop('disabled', false);
    $('.contact-task-container-loader').hide();
    $("#openContactTaskModel").click();
    getTaskList();
    return false;
}

function getTaskType() {
    $.ajax({
        type: "POST",
        data: {type:"getTaskType"},
        url: "./php/taskData.php?var=getTaskType",
        dataType: 'json',
        success: function(response) {
            taskTypeData = {...response}
            $.each(response, function(index, type) {
                $("#contactTaskType").append("<option value='"+type.Id+"'>"+type.Name+"</option>");
            });     
        }
    });
    return false;
}

$(document).on("click", "#contactTaskSave", function (e) {
    e.preventDefault();
    var dateArray = $('#contactTaskDate').val().split("/");
    var utcDateTime = new Date(dateArray[2]+'-'+dateArray[1]+'-'+dateArray[0]+' '+$('#contactTaskTime').val()+':00')/1000;
    var expirationDateUtc = moment.utc(utcDateTime).valueOf();
    var currentUtc = ((moment.utc().valueOf())/1000).toFixed(0);
    if ($('#contactTaskType').val() == "0") {
        return screenMsg('Ups!', 'Debes seleccionar la actividad.', '4000', 'growl-danger');  
    }
    if ($('#contactTaskDescription').val() == "") {
        return screenMsg('Ups!', 'Debes ingresar la descripción.', '4000', 'growl-danger');  
    }
    if (expirationDateUtc < parseInt(currentUtc) || $('#contactTaskDate').val() == "" || $('#contactTaskTime').val() == "") {
        return screenMsg('Ups!', 'La fecha de la tarea no puede ser menor a la fecha y hora actual.', '4000', 'growl-danger');
    } 

    $('#contactTaskSave').prop('disabled', true);
    $('#contactTaskClose').prop('disabled', true);
    $('.contact-task-container-loader').show();

    // activeMessagesContactId
    $.ajax({
        type: "POST",
        data: {type:"addNewTask",activeMessagesContactId: activeMessagesContactId,taskType:$('#contactTaskType').val(),taskDescription:$('#contactTaskDescription').val(),expirationDate:expirationDateUtc,instance:activeMessagesInstance},
        url: "./php/taskData.php?var=addNewTask",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else if (response.status) {
                $('#contactTaskModal').modal('hide');
                return screenMsg('Excelente!', 'La tarea fue programada con éxito.', '4000', 'growl-success');
            } else {
                $('#contactTaskModal').modal('hide');
                response.message ??= 'Hubo un error.';
                return screenMsg('Ups!', response.message, '4000', 'growl-danger');
            }
        },
        error: function(response) {
            screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
            $('#contactTaskModal').modal('hide');
        }
    });
});

function getTaskList() {
    
    $("#linkListTask").click();
    $("#noTaskSelected").show();
    $("#taskSelected").hide();
    $("#taskLoader").hide();
    
    $("#taskList").empty();
    $("#taskList").append(`<tr style="text-align: center;"><td colspan="6"><img src="./images/loader.gif" style="width: 48px;"></td></tr>`)

    // activeMessagesContactId
    $.ajax({
        type: "POST",
        data: {type:"getTasks", contactId: activeMessagesContactId},
        url: "./php/taskData.php?var=getTasks",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#taskList").empty();
            if (response.length === 0) {
                $("#taskList").append(`<tr style="text-align: center;"><td colspan="6"><p>No se han registrado tareas</p></td></tr>`);
            } else {
                response.forEach(task => {
                    $("#taskList").append(`<tr><td>${task.Id}</td><td>${task.Type}</td><td>${task.ExpiresAt}</td><td>${task.UpdatedAt}</td><td>${task.Status}</td><td class="table-action"><a href="" data-toggle="tooltip" title="Edit" class="tooltips loadDetailTask" data-taskid="${task.Id}"><i class="glyphicon glyphicon-eye-open"></i></a></td></tr>`);
                });
            }
        },
        error: function(response) {
            screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
            $('#contactTaskModal').modal('hide');
        }
    });
};

$(document).on("click", ".loadDetailTask", function (e) {
    e.preventDefault();
    const {taskid} = $(this).data();
    $("#noTaskSelected").hide();
    $("#taskSelected").hide();
    $("#taskLoader").show();
    $("#linkDetailTask").click();
    $.ajax({
        type: "POST",
        data: {type:"getTask", taskid},
        url: "./php/taskData.php?var=getTask",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $("#updateTaskDate").hide().attr("disabled", true).attr("name", taskid);
            $("#rescheduleTask").show();
            $("#taskType").html(response.Type);
            $("#taskDescription").html(response.Description);
            $("#taskDate").val(response.Date).attr("disabled", true);
            $("#taskTime").val(response.Time).attr("disabled", true);
            $('#taskTime').timepicker({showMeridian: false});
            $("#taskNotes").empty();
            response.Notes.forEach(note => {
                const content = (!(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(note.Text))) ? note.Text : `<a href="${note.Text}" target="_blank"><img src="${note.Text}" style="max-height: 220px;max-width: 100%;"></a>`; 
                $("#taskNotes").append(`<div class="outer"><div class="lbubble"><div><span style="color:#428BCA;padding-right:20px;">${note.CreatedBy}</span><span style="float:right;font-size:11px">${note.CreatedAt}</span></div><div style="white-space:pre-wrap;">${content}</div></div></div>`);
            });
            setTimeout(() => $('#taskNotes').scrollTop($('#taskNotes').prop('scrollHeight')), 1000);
            $("#taskUploaderContainer").hide();
            $("#notesContainer").show();
            $("#noteText").val("");
            $("#noteText").attr("name", taskid);
            $("#taskLoader").hide();
            $("#taskSelected").show();
            $("#rescheduleTask").attr("disabled", false);
            $("#finishTask").attr("disabled", true).attr("name", taskid);
            $("#addTaskUploader").attr("name", taskid);
        }
    });
});

$(document).on("click", "#rescheduleTask", function (e) {
    e.preventDefault();
    $(this).hide();
    $("#updateTaskDate").show().attr("disabled", false);
    $("#taskDate").attr("disabled", false);
    $("#taskTime").attr("disabled", false);
});

$(document).on("click", "#updateTaskDate", function (e) {
    e.preventDefault();
    const taskId = $(this).attr("name");
    const dateArray = $('#taskDate').val().split("/");
    const utcDateTime = moment.utc(new Date(`${dateArray[2]}-${dateArray[1]}-${dateArray[0]} ${$('#taskTime').val()}:00`)/1000).valueOf();
    $("#taskLoader").show();
    $.ajax({
        type: "POST",
        data: {type:"updateTaskDate", utcDateTime, taskId},
        url: "./php/taskData.php?var=updateTaskDate",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') window.location.replace("logout.php?var=timeout");

            $("#taskLoader").hide();
            if (response.status) {
                $("#taskNotes").append(`<div class="outer"><div class="lbubble"><div><span style="color:#428BCA;padding-right:20px;">${response.CreatedBy}</span><span style="float:right;font-size:11px">${response.CreatedAt}</span></div><div style="white-space:pre-wrap;">${response.Text}</div></div></div>`);
                setTimeout(() => $('#taskNotes').scrollTop($('#taskNotes').prop('scrollHeight')), 1000);
                
                $("#rescheduleTask").show();
                $("#updateTaskDate").hide().attr("disabled", true);
                $("#taskDate").attr("disabled", true);
                $("#taskTime").attr("disabled", true);
            } else {
                response.message ??= "Hubo un problema, intentalo mas tarde.";
                screenMsg('Ups!', response.message, '4000', 'growl-danger');
            }     
        }
    });
});

$(document).on("keyup", "#noteText", function (e) {
    e.preventDefault();
    if(e.which !== 13 || e.key != 'Enter' || e.shiftKey) return;
    const note = $(this).val().trim();
    if (note === "") return;
    const taskId = $(this).attr("name");
    $("#noteText").val("");
    $("#taskLoader").show();
    $.ajax({
        type: "POST",
        data: {type:"addNoteText", note, taskId},
        url: "./php/taskData.php?var=addNoteText",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') window.location.replace("logout.php?var=timeout");

            $("#taskLoader").hide();
            if (response.status) {
                $("#taskNotes").append(`<div class="outer"><div class="lbubble"><div><span style="color:#428BCA;padding-right:20px;">${response.CreatedBy}</span><span style="float:right;font-size:11px">${response.CreatedAt}</span></div><div style="white-space:pre-wrap;">${response.Text}</div></div></div>`);
                setTimeout(() => $('#taskNotes').scrollTop($('#taskNotes').prop('scrollHeight')), 1000);
                $("#finishTask").attr("disabled", false);
            } else {
                response.message ??= "Hubo un problema, intentalo mas tarde.";
                screenMsg('Ups!', response.message, '4000', 'growl-danger');
            }
        }
    });
});

$(document).on("click", "#finishTask",function (e) {
    e.preventDefault();
    if (!confirm("Una vez concluida la tarea no se podrá reprogramar o agregar notas, seguro que deseas concluir la tarea?")) return;
    const taskId = $(this).attr("name");
    $("#taskLoader").show();
    $.ajax({
        type: "POST",
        data: {type:"finishTask", taskId},
        url: "./php/taskData.php?var=finishTask",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') window.location.replace("logout.php?var=timeout");

            $("#taskLoader").hide();
            if (response.status) {
                getTaskList();
            } else {
                response.message ??= "Hubo un problema, intentalo mas tarde.";
                screenMsg('Ups!', response.message, '4000', 'growl-danger');
            } 
        }
    });
});

$(document).on("paste", "#noteText", function (event) {
    event.preventDefault();
    if (event.originalEvent.clipboardData.getData('text')) return $(this).val(event.originalEvent.clipboardData.getData('text'));
    if (event.originalEvent.clipboardData.items.length == 0) return;
    const file = event.originalEvent.clipboardData.items[0].getAsFile();
    uploader(file);
});

$(document).on("drop", "#noteText", function (event) {
    event.preventDefault();
    if (event.originalEvent.dataTransfer.files.length == 0) return;
    const file = event.originalEvent.dataTransfer.files[0];
    uploader(file);
});

function uploader(file) {
    if (file == null || file == undefined) return;
    if (file.size > 25000000) return screenMsg('Ups!', 'El tamaño maximo es de 25MB.', '4000', 'growl-danger'); 
    const type = file.type;
    if (!(/(application\/pdf|application\/vnd.ms-excel|officedocument\/*|image\/*)/gm.test(type))) return;
    const fileName = file.name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (result) => {
        const image = (/image\/*/gm.test(type)) ? result.currentTarget.result : "././images/docImage.png";
        $("#notesContainer").hide();
        $("#taskUploaderContainer").show();
        $("#uploaderTask").empty();
        $("#uploaderTask").append(`<img src="${image}" data-source="${result.currentTarget.result}" data-name="${fileName}" data-image="${/image\/*/gm.test(type)}" data-type=${type} style="max-height: 220px;max-width: 100%;"><br>${fileName}`);
    }
}

$(document).on("click", "#cancelTaskUploader", function (e) {
    e.preventDefault();
    $("#uploaderTask").empty();
    $("#taskUploaderContainer").hide();
    $("#notesContainer").show();
});

$(document).on("click", "#addTaskUploader", function (e) {
    e.preventDefault();
    const {source, name, image, type} = $("#uploaderTask img")?.data();
    const taskId = $(this).attr("name");
    $("#uploaderTask").empty();
    $("#taskUploaderContainer").hide();
    $("#notesContainer").show();
    $("#taskLoader").show();
    $.ajax({
        type: "POST",
        data: {type:"addNoteFile", source, name, image, typeFile: type, taskId},
        url: "./php/taskData.php?var=addNoteFile",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') window.location.replace("logout.php?var=timeout");

            $("#taskLoader").hide();
            if (response.status) {
                const content = (!image) ? response.Text : `<a href="${response.Text}" target="_blank"><img src="${response.Text}" style="max-height: 220px;max-width: 100%;"></a>`; 
                $("#taskNotes").append(`<div class="outer"><div class="lbubble"><div><span style="color:#428BCA;padding-right:20px;">${response.CreatedBy}</span><span style="float:right;font-size:11px">${response.CreatedAt}</span></div><div style="white-space:pre-wrap;">${content}</div></div></div>`);
                setTimeout(() => $('#taskNotes').scrollTop($('#taskNotes').prop('scrollHeight')), 1000);
                $("#finishTask").attr("disabled", false);
            } else {
                response.message ??= "Hubo un problema, intentalo mas tarde.";
                screenMsg('Ups!', response.message, '4000', 'growl-danger');
            }
        }
    });
});

const maturation = () => {
    viewContactTaskContainer();
    $("#linkNewTask").click();
    screenMsg('Agrega la tarea', "Registra tarea de maduración", '4000', 'growl-success');
    return setTimeout(() => $("#contactTaskType option[value='2']").prop("selected", true), 1500);
};