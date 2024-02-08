//v=1.1 03/08/2020

jQuery(document).ready(function() {
    $(window).resize(function(){
        $('#imageModalBody').css('max-height', (window.innerHeight)-120+'px');
    });
});

function getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName) {
    return `<div class="closeContainer">
                <a href="#" class="closeImageContainer">
                    <span class="badge badge-danger">x</span>
                </a>
            </div>
            <div class="thmb-prev draggable2" id="img-${divNumber}">
                <img src="${sourceImgSrc}" class="img-responsive" alt="${altName}" data-name="${sourceImgName}" data-size="${sourceImgSize}" data-id="${imgId}">
            </div>
            <h5 class="fm-title">${sourceImgTxt}</h5>`;
}

function recortaNombre(nombre) {
    if ( nombre.length <36 ) {
        return nombre;
    } else {
        nombre = nombre.substring(0, 36);
        nombre = nombre+"...";
        return nombre;
    }
}

$(document).on("click", "#devOpenImageModalButton", function(e) {
    e.preventDefault();
    var developmentId = $(this).attr("name");
    $('#imagesShow').empty();$('#section-1').empty();$('#section-2').empty();$('#section-3').empty();$('#section-4').empty();
    $('#titleSec2').text("Amenidades");
    $('#imageModalBody').css('max-height', (window.innerHeight)-120+'px');
    $("#moreSpace").hide();
    $("#saveImages").hide();
    $("#saveImages").attr('disabled', true);
    $("#saveImages").attr("name", "hd-"+developmentId);
    $("#loadImg").show();
    $('#openUploadImagesModal').click();
    $("#imgInput").attr("disabled", true);
    $.ajax({
        type: "GET",
        data: {type:"getImageDevelopment",developmentId:developmentId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                try {
                    $("#loadImg").hide();
                    if (response.hd) {
                        var noUrl = 0;
                        var idNoUrl = [];
                        response.hd.pictures.forEach(element => {
                            // console.log(element);
                            var divNumber = parseInt($('.draggable').length)+1;
                            var tamArray = element.pictures.length-1;
                            var type = element.pictures[tamArray].typeId;
                            var sourceImgSrc = element.pictures[tamArray].url;
                            if (sourceImgSrc == null) {
                                noUrl ++;
                                idNoUrl.push(element.id);
                                return;
                            }
                            var sourceImgName = element.pictures[tamArray].url.split("/")[4];
                            var altName = sourceImgName;
                            sourceImgName = recortaNombre(sourceImgName);
                            var sourceImgSize = ""; 
                            var sourceImgTxt = sourceImgName + " " + sourceImgSize;
                            var imgId = element.id;
                            if (type==9) {
                                $("#section-1").append(`<div class="col-md-12">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}" style="">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            } else if(type==3){
                                $("#section-2").append(`<div class="col-md-3">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            }
                        });
                        moveImages();
                        changeInternalId();
                        if (noUrl > 0) {
                            console.log(idNoUrl);
                            deleteNoUrls(noUrl, idNoUrl);
                        }
                    } else {
                        notify("growl-success", "Sin imagenes", "Aun no se han agregado imagenes al desarrollo. "+response.message);   
                    }
                    $("#imgInput").attr("disabled", false);
                } catch (error) {
                    console.error(error);
                    notify("growl-danger", "Error", "Ocurrio un error al cargar las imagenes. "+error); 
                    $('#openUploadImagesModal').click();
                }
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", "Error en peticion.");         
        }
    });
});

$(document).on("click", ".modOpenImageModal", function(e) {
    e.preventDefault();
    var modelId = $(this).attr("name");
    $('#imagesShow').empty();$('#section-1').empty();$('#section-2').empty();$('#section-3').empty();$('#section-4').empty();
    $('#titleSec2').text("Exterior");
    $('#imageModalBody').css('max-height', (window.innerHeight)-120+'px');
    $("#moreSpace").show();
    $("#saveImages").hide();
    $("#saveImages").attr('disabled', true);
    $("#saveImages").attr("name", "pm-"+modelId);
    $("#loadImg").show();
    $('#openUploadImagesModal').click();
    $("#imgInput").attr("disabled", true);
    $.ajax({
        type: "GET",
        data: {type:"getImageModel",modelId:modelId},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                try {
                    $("#loadImg").hide();
                    if (response.pm) {
                        var noUrl = 0;
                        var idNoUrl = [];
                        response.pm.pictures.forEach(element => {
                            // console.log(element);
                            var divNumber = parseInt($('.draggable').length)+1;
                            var type = element.pictures[0].typeId;
                            var sourceImgSrc = element.pictures[0].url;
                            if (sourceImgSrc == null) {
                                noUrl ++;
                                idNoUrl.push(element.id);
                                return;
                            }
                            var sourceImgName = element.pictures[0].url.split("/")[4];
                            var altName = sourceImgName;
                            sourceImgName = recortaNombre(sourceImgName);
                            var sourceImgSize = "";
                            var sourceImgTxt = sourceImgName + " " + sourceImgSize;
                            var imgId = element.id;
                            if (type==10) {
                                $("#section-1").append(`<div class="col-md-12">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}" style="">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            } else if (type==19) {
                                $("#section-2").append(`<div class="col-md-3">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}" style="">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            } else if (type==18 || type ==6) {
                                $("#section-3").append(`<div class="col-md-4">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}" style="">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            } else if (type==7) {
                                $("#section-4").append(`<div class="col-md-4">
                                                            <div class="thmb draggable droppable2" id="div-${divNumber}" style="">
                                                                ${getSrcShow(divNumber,sourceImgSrc,sourceImgName,sourceImgSize,imgId,sourceImgTxt,altName)}
                                                            </div>
                                                        </div>`);
                            }
                        });
                        moveImages();
                        changeInternalId();
                        if (noUrl > 0) {
                            console.log(idNoUrl);
                            deleteNoUrls(noUrl, idNoUrl);
                        }
                    } else {
                        notify("growl-success", "Sin imagenes", "Aun no se han agregado imagenes al modelo. " + response.message); 
                    }
                    $("#imgInput").attr("disabled", false);
                } catch (error) {
                    console.error(error);
                    notify("growl-danger", "Error", "Ocurrio un error al cargar las imagenes. "+error); 
                    $('#openUploadImagesModal').click();
                }
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", "Error en peticion.");         
        }
    });
});

function on_element_drop(event, ui) {
    var targetDiv = $(this).attr('id');
    var sourceDiv = ui.draggable.attr('id');
	var sourceImgSrc = ui.draggable.find("div.thmb-prev").children().attr("src");
	var sourceImgName = ui.draggable.find("div.thmb-prev").children().attr("data-name");
	var sourceImgSize = ui.draggable.find("div.thmb-prev").children().attr("data-size");
	var sourceImgId = ui.draggable.find("div.thmb-prev").children().attr("data-id");
    var sourceImgTxt = ui.draggable.find("div.thmb-prev").next().text();
    var source = parseInt(sourceDiv.split('-')[1]);
    if (targetDiv == "section-1") {
        if ($("#section-1").children().length===0) {
            $("#"+sourceDiv).parent().remove();
            $("#section-1").append(`<div class="col-md-12">
                                <div class="thmb draggable droppable2" id="div-${source}" style="">
                                    ${getSrcShow(source,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt)}
                                </div>
                            </div>`);
            moveImages();
        } else {
            var section = $("#"+sourceDiv).parent().parent().attr("id");
            var size = "col-md-12";
            if (section == "section-2") {
                size = "col-md-3";
            } else {
                size = "col-md-4";
            }
            var targetDivId = $(this).children().children().attr("id");
            var targetImgSrc = $("#"+targetDivId).find("div.thmb-prev").children().attr("src");
            var targetImgName = $("#"+targetDivId).find("div.thmb-prev").children().attr("data-name");
            var targetImgSize = $("#"+targetDivId).find("div.thmb-prev").children().attr("data-size");
            var targetImgId = $("#"+targetDivId).find("div.thmb-prev").children().attr("data-id");
            var targetImgTxt = $("#"+targetDivId).find("div.thmb-prev").next().html();
            var target = parseInt(targetDivId.split('-')[1]);
            $("#"+targetDivId).parent().remove();
            $("#"+sourceDiv).parent().remove();
            if (section != "section-1") {
                $("#"+section).append(`<div class="${size}">
                                    <div class="thmb draggable droppable2" id="div-${target}" style="">
                                        ${getSrcShow(target,targetImgSrc,targetImgName,targetImgSize,targetImgId,targetImgTxt)}
                                    </div>
                                </div>`);
            }
            $("#section-1").append(`<div class="col-md-12">
                                    <div class="thmb draggable droppable2" id="div-${source}" style="">
                                        ${getSrcShow(source,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt)}
                                    </div>
                                </div>`);
            moveImages();
        }
    } else if(targetDiv == "section-2") {
        $("#"+sourceDiv).parent().remove();
        $("#section-2").append(`<div class="col-md-3">
                                <div class="thmb draggable droppable2" id="div-${source}">
                                    ${getSrcShow(source,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt)}
                                </div>
                            </div>`);
        moveImages();
    } else {
        $("#"+sourceDiv).parent().remove();
        $("#"+targetDiv).append(`<div class="col-md-4">
                                <div class="thmb draggable droppable2" id="div-${source}">
                                    ${getSrcShow(source,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt)}
                                </div>
                            </div>`);
        moveImages();
    }
    moveImages();
    verifyImages();
    changeInternalId();

}

function changeInternalId() {
    var cont = 1;
    var sectionData = "";
    for (let numSec = 1; numSec < 5; numSec++) {
        sectionData = $("#section-"+numSec).find("div.thmb-prev");
        for (let index = 0; index < sectionData.length; index++) {
            const element = sectionData[index];
            $(element).parent().attr("id", "div-"+cont);
            cont++;
        }
    }
    for (let numSec = 1; numSec < 5; numSec++) {
        sectionData = $("#section-"+numSec).find("div.thmb-prev");
        for (let index = 0; index < sectionData.length; index++) {
            const element = sectionData[index];
            $(element).attr("id", "img-sec"+numSec+"-"+index);
        }
    }
}

function on_element_drop2(event, ui) {
    var sourceDiv = ui.draggable.parent().attr('id');
    var sourceDivId = ui.draggable.attr("id");
    var sourceExt = sourceDiv.split("-")[1];
    sourceExt = parseInt(sourceExt);
    var sourceSec = sourceDivId.split("-")[1];
    var sourceImgSrc = ui.draggable.children().attr("src");
	var sourceImgName = ui.draggable.children().attr("data-name");
	var sourceImgSize = ui.draggable.children().attr("data-size");
	var sourceImgId = ui.draggable.children().attr("data-id");
    var sourceImgTxt = ui.draggable.next().text();
    var targetDiv = $(this).attr('id');
    var targetDivId = $(this).find('div.draggable2').attr("id");
    var targetExt = targetDiv.split("-")[1];
    targetExt = parseInt(targetExt);
    var target = targetDivId.split("-")[2];
    var targetSec = targetDivId.split("-")[1];
    var tempDivId, tempDiv, tempImgSrc, tempImgName, tempImgSize, tempImgId, tempImgTxt;
    if (targetSec == sourceSec){
        if(targetExt!=sourceExt){
            if (sourceExt<targetExt) {
                tempDivId = "#img-"+sourceSec+"-"+target;
                tempDiv = $(tempDivId).parent().attr("id");
                tempImgSrc = $(tempDivId).children().attr("src");
                tempImgName = $(tempDivId).children().attr("data-name");
                tempImgSize = $(tempDivId).children().attr("data-size");
                tempImgId = $(tempDivId).children().attr("data-id");
                tempImgTxt = $(tempDivId).next().text();
                for (let index = targetExt; index >= sourceExt; index--){
                    $("#div-"+index).html(getSrcShow(index,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt));
                    sourceImgSrc = tempImgSrc;
                    sourceImgName = tempImgName;
                    sourceImgSize = tempImgSize;
                    sourceImgId = tempImgId;
                    sourceImgTxt = tempImgTxt;
                    target--;
                    tempDivId = "#img-"+sourceSec+"-"+target;
                    tempImgSrc = $(tempDivId).children().attr("src");
                    tempImgName = $(tempDivId).children().attr("data-name");
                    tempImgSize = $(tempDivId).children().attr("data-size");
                    tempImgId = $(tempDivId).children().attr("data-id");
                    tempImgTxt = $(tempDivId).next().text();
                }
            } else if (sourceExt>targetExt) {
                tempDivId = "#img-"+sourceSec+"-"+target;
                tempDiv = $(tempDivId).parent().attr("id");
                tempImgSrc = $(tempDivId).children().attr("src");
                tempImgName = $(tempDivId).children().attr("data-name");
                tempImgSize = $(tempDivId).children().attr("data-size");
                tempImgId = $(tempDivId).children().attr("data-id");
                tempImgTxt = $(tempDivId).next().text();
                for (let index = targetExt; index <= sourceExt; index++) {
                    $("#div-"+index).html(getSrcShow(index,sourceImgSrc,sourceImgName,sourceImgSize,sourceImgId,sourceImgTxt));
                    sourceImgSrc = tempImgSrc;
                    sourceImgName = tempImgName;
                    sourceImgSize = tempImgSize;
                    sourceImgId = tempImgId;
                    sourceImgTxt = tempImgTxt;
                    target++;
                    tempDivId = "#img-"+sourceSec+"-"+target;
                    tempImgSrc = $(tempDivId).children().attr("src");
                    tempImgName = $(tempDivId).children().attr("data-name");
                    tempImgSize = $(tempDivId).children().attr("data-size");
                    tempImgId = $(tempDivId).children().attr("data-id");
                    tempImgTxt = $(tempDivId).next().text();
                }
            }
        }
        verifyImages();
    }
    moveImages();
    changeInternalId();
}

function moveImages() {
    $('.droppable').droppable({
        accept: '.draggable',
        tolerance: 'fit',
        drop: on_element_drop
    });
    $('.draggable').draggable({
        // containment: ".media-manager",
        scroll: false,
        revert: 'invalid',
        zIndex: 300,
    });
    $('.draggable').droppable({
        greedy: true,
        tolerance: 'fit',
    });
    $('.droppable2').droppable({
        accept: '.draggable2',
        tolerance: 'fit',
        drop: on_element_drop2
    });
    $('.draggable2').draggable({
        // containment: ".spaceImage",
        scroll: false,
        revert: 'invalid',
        zIndex: 300,
    });
    $('.draggable2').droppable({
        greedy: true,
        tolerance: 'fit',
    });
}

$(document).on("change", "#imgInput", function(e) {
	e.preventDefault();
    readURL(this);
});

function readURL(input) {
    var divNumber = 0;
    var i = 0;
    var j = 0;
    var fileNameCounter = [];
	var fileSizeCounter = [];
    var fileTypeCounter = [];
    var filesIn = Object.values(input.files);
    if (input.files && input.files[0]) {
        filesIn.forEach(element => {
            if (verifyFiles(element.name) == 0) {
                if (element.type.substring(0,5) == "image") {
                    fileNameCounter[j] = element.name;
                    fileTypeCounter[j] = element.type;
                    var sizeImg = parseInt(element.size) / 1000;
					sizeImg = sizeImg.toFixed(2);
                    fileSizeCounter[j] = sizeImg + ' Kb.';
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        divNumber = $('.draggable').length+1;
                        imageFile = `<div class="col-md-6">
                                        <div class="thmb draggable" id="div-${divNumber}">
                                            ${getSrcShow(divNumber,e.target.result,fileNameCounter[i],fileSizeCounter[i],"", fileNameCounter[i] + "<br>" + fileSizeCounter[i],fileNameCounter[i])}
                                        </div>
                                    </div>`;
                        $('#imagesShow').append(imageFile);
                        moveImages();
                        verifyImages();
                        changeInternalId();
                        i++;
                    };
                    reader.readAsDataURL(element);
                    j++;
                    $("#moveRemaining").show();
                } else {
                    notify("growl-danger", "Error", "Solo se admiten imágenes.");
                }
            } else {
                notify("growl-danger", "Error", "La imagen "+ element.name + " ya existe, no se volvio a cargar.");
            }
        });
        event.target.value = null;
    }
}

function verifyFiles(name) {
	var flag = 0;
	$('.img-responsive').each(function(i, image) {
		if (name == $(image).attr('data-name')) {
			// console.log(name, $(image).attr('data-name'));
			flag++;
		}
	});
	if (flag != 0) {
	    return 1;
	} else {
		return 0;
	}
}

function verifyImages() {
    if ($("#imagesShow").children().length == 0) {
        if ($("#section-1").children().length==1) {
            $("#saveImages").show();
            $("#moveRemaining").hide();
            $("#saveImages").attr('disabled', false);
        } else {
            $("#saveImages").hide();
        }
    } else {
        $("#saveImages").hide();
    }
}

$(document).on("click", ".closeImageContainer", function (e) {
    e.preventDefault();
    if (confirm("Deseas borrar la imagen?\nLa imagen no se podra recuperar posteriormente.")) {
        // console.log($(this).parents()[2]);
        var parentId = $(this).parents()[1].id;
        var targetDivId = $("#"+parentId).find('div.draggable2').attr("id");
        var targetImgId = $("#"+targetDivId).children().attr("data-id");
        // console.log(targetImgId);
        if (targetImgId!="") {
            deleteImage(targetImgId);
        }
        $(this).parents()[2].remove();
        changeInternalId();
    }
    verifyImages();
});

function testConexion() {
    $.ajax({
        type: "GET",
        data: {type:"testConexion"},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                return true;
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;   
        }
    });
}

function getImages(elementId, elementType) {
    var data = {};
    if (elementType=="hd") {
        data = {type:"getImageDevelopment", developmentId:elementId};
    } else {
        data = {type:"getImageModel", modelId:elementId};
    }
    $.ajax({
        type: "GET",
        data: data,
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
        }
    });
}

function getImagesCount(elementId, elementType, place) {
    var data = {};
	var textCount = "";
    if (elementType=="hd") {
        data = {type:"getImageCountDev", developmentId:elementId};
    } else {
        data = {type:"getImageCountMod", modelId:elementId};
    }
    $.ajax({
        type: "GET",
        data: data,
        url: "./php/adminData.php", 
		dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                if (response.picCount) {
                    textCount = response.picCount+" imagenes subidas";
                }
                if (response.message || response.picCount == 0) {
                    textCount = "Sin imagenes";
                }
                $("#"+place).text(textCount);
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
        }
	});
}

var listId = [];
var listType = [];
var listSeq = [];
var contImages = 1;
$(document).on("click", "#saveImages", function (e) {
    e.preventDefault();
    var principalId = 9;
    var secondId = 3;
    $("#saveImages").attr('disabled', true);
    listId = [];
    listType = [];
    listSeq = [];
    contImages = 1;
    var elementType = $(this).attr("name").split("-")[0];
    var elementId = $(this).attr("name").split("-")[1];
    if (elementType=="pm") { 
        principalId = 10;
        secondId = 19;
    }
    getSectionData("section-1",elementId, elementType, principalId);
    getSectionData("section-2",elementId, elementType, secondId);
    getSectionData("section-3",elementId, elementType, 18);
    getSectionData("section-4",elementId, elementType, 7);
    // console.log(listId,listSeq,listType);
    if (listId.length>0) {
        $.ajax({
            type: "GET",
            data: {type:"setTypes", listId:listId, listType:listType,listSeq:listSeq,elementType:elementType},
            url: "./php/adminData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    console.log(response);
                    notify("growl-success", "Procesando", "La(s) imagene(s) y cambio(s) se estan procesando");
                    $('#openUploadImagesModal').click();
                    if (response.status) {
                        notify("growl-success", "Actualizado", "La(s) imagene(s) y cambio(s) se actualizaron correctamente");
                    } else {
                        notify("growl-danger", "Error al actualizar", response.message);
                    }
                    return true;
                }
            },
            error: function(response) {
                notify("growl-danger", "Error", response.responseText);
                return false;
            }
        });
    } else {
        $('#openUploadImagesModal').click();
        notify("growl-success", "Procesando", "La(s) imagene(s) y cambio(s) se estan procesando");
        return true;
    }
});

function getSectionData(section, elementId, elementType, picId) {
    var sectionData = $("#"+section).find("div.thmb-prev");
    var dataImg = "";
    var typeImg = "";
    var srcImg = "";
    var nameImg = "";
    var myblob = "";
    for (let index = 0; index < sectionData.length; index++) {
        const element = sectionData[index];
        divImg = $(element).attr("id");
        idImg = $("#"+divImg).children().attr("data-id");
        if (idImg=="") {
            dataImg = $("#"+divImg).children().attr("src").split(";");
            typeImg = dataImg[0].split(":")[1];
            srcImg = dataImg[1].split(",")[1];
            nameImg = $("#"+divImg).children().attr("data-name");
            myblob = b64toBlob(srcImg, typeImg);
            uploadResponse = uploadImage(elementId, elementType, picId, contImages, nameImg, myblob);
            // idImg = uploadResponse.id;
            contImages++;
        } else {
            listId.push(idImg);listSeq.push(contImages);listType.push(picId);
            contImages++;
        }
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

function uploadImage(elementId, elementType, picType, picSeq, nameImg, myblob) {
    var data = new FormData();
    data.append("type", "uploadImage");
    data.append("elementId", elementId);
    data.append("elementType", elementType);
    data.append("picType", picType);
    data.append("picSeq", picSeq);
    data.append("nameImage", nameImg);
    data.append("myfile", myblob, nameImg);
    notify('growl-info', 'Procesando imagen', 'La imagen se esta procesando, el proceso puede tomar tiempo dependiendo del tamaño de la imagen.');
    $.ajax({
        type: "POST",
        data: data,
        url: "./php/adminData.php", 
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.id) {
                    console.log(response);
                    notify("growl-success", "Imagen Subida", response.temporaryFileName+" se ha subido correctamente");
                    return response;
                } else {
                    notify("growl-danger", "Error", response);
                    return "";
                }
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);  
        }
    });
}

function deleteNoUrls(count, ids) {
    console.log(count, ids);
    var deleteNoUrl = confirm(`Se encontraron ${count} foto(s) sin urls ¿desea eliminarlas?`);
    if (deleteNoUrl) {
        ids.forEach(element => {
            deleteImage(element);
        });
    }
}

function deleteImage(idImage) {
    $.ajax({
        type: "GET",
        data: {type:"deleteImage", idImage:idImage},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    notify("growl-success", "Imagen eliminada", "La imagen " + idImage + "se ha eliminado correctamente");
                } else {
                    notify("growl-danger", "Error al eliminar", response.message);
                }
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;
        }
    });
}

function setImagesData(listId, listType, listSeq, elementType) {
    $.ajax({
        type: "GET",
        data: {type:"setTypes", listId:listId, listType:listType,listSeq:listSeq,elementType:elementType},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log("true", response);
                return true;
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;
        }
    });
}

$(document).on("click", "#devOpenImageSelect", function (e) {
    e.preventDefault();
    var idDev = $(this).attr("name");
    var prevValImg = $("#imgSelect").html();
    var selector = `<form class="form-inline" style="padding-bottom:6px;">
                        <input type="hidden" name="${prevValImg}" id="prevValImg">
                        <div class="form-group">
                            <select name="" id="optionImg" class="form-control input-sm">
                                <option value="1">Viejas</option>
                                <option value="0">Nuevas</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-sm btn-cancel cancelImgChange" value="${idDev}" name="0">
                                <i class="glyphicon glyphicon-remove"></i>
                            </button>
                            &nbsp;&nbsp;
                            <button type="button" class="btn btn-sm btn-go updateImgChange" value="${idDev}" name="0">
                                <i class="glyphicon glyphicon-ok"></i>
                            </button>
                        </div>
                    </form>`;
    $("#imgSelect").html(selector);
    $("#devOpenImageSelect").hide();
});

$(document).on("click", ".cancelImgChange", function (e) {
    e.preventDefault();
    var valSelect = $("#prevValImg").attr("name");
    $("#imgSelect").html(valSelect);
    $("#devOpenImageSelect").show();
});

$(document).on("click", ".updateImgChange", function (e) {
    e.preventDefault();
    var idDev = $(this).val();
    var apiVersion = $("#optionImg").val();
    console.log(idDev, apiVersion);
    $.ajax({
        type: "GET",
        data: {type:"chageMediaApi", apiVersion:apiVersion, idDev:idDev},
        url: "./php/adminData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else if(response.result){
                console.log("true", response.message);
                notify("growl-success", "Actualizado", response.message+'<br>Por favor actualiza');
                var valSelect = '';
                if (apiVersion==0) {
                    valSelect = 'Nuevas';
                } else {
                    valSelect = 'Viejas';
                }
                $("#imgSelect").html(valSelect);
                $("#devOpenImageSelect").show();
            }
        },
        error: function(response) {
            notify("growl-danger", "Error", response.responseText);
            return false;
        }
    });
});

$(document).on("click", "#moveRemaining", function (e) {
    e.preventDefault();
    var type = $("#saveImages").attr('name').split('-')[0];
    var divTam = '';
    var section = '';
    if (type == 'hd') {
        divTam = 'col-md-3';
        section = '#section-2';
    } else {
        divTam = 'col-md-4';
        section = '#section-3';
    }
    $("#imagesShow .col-md-6 .thmb").each(function(i, imageData) {
        var divId = $(imageData).attr('id').split('-')[1];
        var divText = $(imageData).find("h5").html();
        var imgAlt = $(imageData).find("img").attr('alt');
        var imgName = $(imageData).find("img").attr('data-name');
        var imgSize = $(imageData).find("img").attr('data-size');
        var imgId = $(imageData).find("img").attr('data-id');
        var imgSrc = $(imageData).find("img").attr('src');
        // console.log(divId, divText, imgAlt, imgName, imgSize, imgId);
        // console.log(imgSrc);
        $("#div-"+divId).parent().remove();
        $(section).append(`<div class="${divTam}">
            <div class="thmb draggable droppable2" id="div-${divId}">
                ${getSrcShow(divId,imgSrc,imgName,imgSize,imgId,divText,imgAlt)}
            </div>
        </div>`);
        moveImages();
    });
    moveImages();
    changeInternalId();
    verifyImages();
});

$(document).on('click', '#devOpenImageCover', function(e) {
    e.preventDefault();
    const hdId = $(this).attr('name');
    $("#housingDev").html(hdId).attr('name', hdId).attr('data-currentcover', $("#devOpenImageCover").data("currentcover"));;
    $('#coverPreview').empty();
    $("#uploadNewCover").attr("disabled", true);
    $("#openCoverUploadModal").click();
});

$(document).on("change", "#coverInput", function(e) {
	e.preventDefault();
    $('#coverPreview').empty();
    readURLCover(this);
});

function readURLCover(input) {
    var filesIn = Object.values(input.files);
    if (input.files && input.files[0]) {
        filesIn.forEach(element => {
            if (element.type.substring(0,5) == "image") {
                const randomNum = Math.floor(Math.random() * 90000) + 10000;
                var fileName = element.name.replace(/\s+/g, '');
                fileName = fileName.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
                fileName = randomNum + '-' + fileName;
                var reader = new FileReader();
                reader.readAsDataURL(element); 
                reader.onloadend = function(e) {
                    $('#coverPreview').append(`<img src="${e.target.result}" data-filesource="${e.target.result}" data-filetype="image" data-filename="${fileName}" style="width:100%" id="cover2upload">`);
                    $("#uploadNewCover").attr("disabled", false);
                }
            } else {
                notify("growl-danger", "Error", "Solo se admiten imágenes.");
            }
        });
    }
}

$(document).on("click", "#uploadNewCover", (e) => {
    e.preventDefault();
    $("#uploadNewCover").attr("disabled", true);
    const hdId = $("#housingDev").attr('name');
    const currentCover = $("#housingDev").data("currentcover");
    if (hdId == undefined) { notify("growl-danger", "Llena los datos", "Seleciona un desarrollo");return;}
    const img = $("#cover2upload");
    if ( img.length != 1) { notify("growl-danger", "Llena los datos", "Agrega una imagen");return;}
    const dataImg = img.data("filesource").split(";");
    const typeImg = dataImg[0].split(":")[1];
    const srcImg = dataImg[1].split(",")[1];
    const nameImg = img.data("filename");
    const myblob = b64toBlob(srcImg, typeImg);
    if (currentCover != 0) {
        deleteImage(currentCover);
    }
    const uploadResponse = uploadImage(hdId, 'hd', 20, 1, nameImg, myblob);
    $("#openCoverUploadModal").click();
    // if (uploadResponse == "") return;
    // $("#currentCover").html(`<a href="${uploadResponse.updateBucketOk[0]}" target="_blank">Ver cover</a>`);
});