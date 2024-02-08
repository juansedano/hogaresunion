//v=1.1.1 14:30 04/Junuary/2022*/
$(document).ready(function () {
    getData();
    getFlags();
    getCollaborators();
    getCfdiUse();
    getFiscalRegimens();
    var openSale = $("#openSale").attr("name");
    if (openSale != "0") {
        $("#openSale").click();
    }

    $('#clientTable').DataTable({
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "Todos"]],
        responsive: true,
        "language": {
            "url": "//cdn.datatables.net/plug-ins/1.10.19/i18n/Spanish.json"
        }
    });
});

var today = new Date();
var todayMonth = today.getMonth() +1;
today = ((today.getDate()<10) ? "0"+today.getDate() : today.getDate()) + "/" + ((todayMonth<10) ? "0"+todayMonth : todayMonth) + "/" + today.getFullYear();

var states = [];
var localities = [];
var developers = [];
var developments = [];
var models = [];
function getData() {
    $.ajax({
        type: "GET",
        data: {type:"getData"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                var stateId = 0;
                $("#states").empty();
                var localityId = 0;
                $("#localities").empty();
                var developmentId = 0;
                $("#developments").empty();
                $("#models").empty();
                response.forEach(model => {
                    // if (stateId != model.stateId) {
                        states.push({
                            "stateId" : model.stateId,
                            "stateName" : model.stateName,
                            "developerId" : model.developerId
                        });
                        // $("#states").append(`<option value="${model.stateId}">${model.stateName}</option>`);
                        // stateId = model.stateId;
                    // }
                    if (localityId != model.localityId) {
                        localities.push({
                            "stateId" : model.stateId,
                            "localityId" : model.localityId,
                            "localityName" : model.localityName
                        });
                        $("#localities").append(`<option value="${model.localityId}">${model.localityName}</option>`);
                        localityId = model.localityId;
                    }
                    if (developmentId != model.developmentId) {
                        developments.push({
                            "stateId" : model.stateId,
                            "localityId" : model.localityId,
                            "developerId" : model.developerId,
                            "developmentId" : model.developmentId,
                            "developmentName" : model.developmentName
                        });
                        $("#developments").append(`<option value="${model.developmentId}">${model.developmentName}</option>`);
                        developmentId = model.developmentId;
                    }
                    models.push({
                        "stateId" : model.stateId,
                        "localityId" : model.localityId,
                        "developerId" : model.developerId,
                        "developmentId" : model.developmentId,
                        "developmentName" : model.developmentName,
                        "modelId" : model.modelId,
                        "modelName" : model.modelName,
                        "price" : model.price,
                        "fee" : model.fee,
                        "feePro" : model.feePro
                    });
                    $("#models").append(`<option value="${model.modelId}">${model.modelName} - ${model.developmentName}</option>`);
                });
                states = states.filter((state, index, self) =>
                    index === self.findIndex((t) => (
                        t.stateId === state.stateId && t.stateName === state.stateName && t.developerId === state.developerId
                    ))
                );
                models.push({
                    "stateId" : '0',
                    "localityId" : '0',
                    "developerId" : '0',
                    "developmentId" : '0',
                    "developmentName" : 'Desconocido',
                    "modelId" : '0',
                    "modelName" : 'Desconocido',
                    "price" : '0',
                    "fee" : '0',
                    "feePro" : '0'
                });
                $("#models").append(`<option value="0">Desconocido</option>`);
            }
        }
    });
}

var invoiceFlags = [];
var paymentFlags = [];
function getFlags() {
    $.ajax({
        type: "GET",
        data: {type:"getFlags"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                $("#epurseFlag").attr("disabled", true);
                $("#adviserPaFlag").attr("disabled", true);
                // $("#adviserRefFlag").attr("disabled", true);
                $("#adviserScFlag").attr("disabled", true);
                $("#supervisorFlag").attr("disabled", true);
                $("#appointmentStage").attr("disabled", true);
                response.epurse.forEach(element => {
                    $("#epurseFlag").append(`<option value="${element.id}">${element.label}</option>`);
                });
                response.appointment.forEach(element => {
                    $("#appointmentStage").append(`<option value="${element.id}" data-dealid=${element.dealId}>${element.label}</option>`);
                });
                response.buyingProduct.forEach(element => {
                    $("#buyingProduct").append(`<option value="${element.id}">${element.label}</option>`);
                });
                paymentFlags.push({
                    "id": 0,
                    "label": "Selecciona"
                });
                response.invoice.forEach(element => {
                    invoiceFlags.push({
                        "id": element.id,
                        "label": element.label
                    });
                    if (element.id != "46" && element.id != "53") {
                        // $("#adviserPaFlag").append(`<option value="${element.id}">${element.label}</option>`);
                        // $("#adviserRefFlag").append(`<option value="${element.id}">${element.label}</option>`);
                        // $("#adviserScFlag").append(`<option value="${element.id}">${element.label}</option>`);
                        // $("#supervisorFlag").append(`<option value="${element.id}">${element.label}</option>`);
                        paymentFlags.push({
                            "id": element.id,
                            "label": element.label
                        });
                    }
                });
                $("#epurseFlag").attr("disabled", false);
                $("#adviserPaFlag").attr("disabled", false);
                // $("#adviserRefFlag").attr("disabled", false);
                $("#adviserScFlag").attr("disabled", false);
                $("#supervisorFlag").attr("disabled", false);
                $("#appointmentStage").attr("disabled", false);
            }
        }
    });
}

var collaborators = [];
function getCollaborators() {
    $.ajax({
        type: "GET",
        data: {type:"getCollaborators"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.length > 0) {
                    collaborators = response;
                    response.forEach(element => {
                        $("#sellers").append(`<option value="${element.id}">${element.name}</option>`);
                        $("#advisers").append(`<option value="${element.id}">${element.name}</option>`);
                        $("#supervisors").append(`<option value="${element.id}">${element.name}</option>`);
                    });
                } 
            }
        }
    });
}

var cfdiUses = [];
function getCfdiUse() {
    $.ajax({
        type: "GET",
        data: {type:"getCfdiUse", company: 1},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                if (response.length > 0) {
                    response.forEach(element => {
                        $("#cfdiUseClient").append(`<option value="${element.Value}">${element.Name}</option>`);
                    });
                    cfdiUses = response;
                }
            }
        }
    });
}

var fiscalRegimens = [];
function getFiscalRegimens() {
    $.ajax({
        type: "GET",
        data: {type:"getFiscalRegimens", company: 1},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                if (response.length > 0) {
                    response.forEach(element => {
                        $("#fiscalRegimenClient").append(`<option value="${element.Value}">${element.Name}</option>`);
                    });
                    fiscalRegimens = response;
                }
            }
        }
    });
}

function formatoMoneda(stringVal) {
	if(stringVal == undefined){return "$0";}
    var decimal = "00";
    if (stringVal.indexOf(".") >= 0) {
        stringVal = stringVal.split(".");
        decimal = stringVal[1];
        stringVal = stringVal[0];
    }
	var val = "$" + stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	if (val.length === 1 && val === "$") {
		val = "";
	} else {
        val = val+"."+decimal;
    }
	return val;
}

function updateFinalPrice( ) {
    var finalPrice = $('#finalPrice').val().replace(/,/g, '');
    if (finalPrice.substring(0,1) == '$') { finalPrice = finalPrice.substring(1); }
    finalPrice = parseFloat(finalPrice);
    var feeTD = $('#feeTD').val().replace(/%/g, '');
    if(feeTD=="") { feeTD = 0; } else { feeTD = parseFloat(feeTD)/100; }
    var feePA = $('#feePA').val().replace(/%/g, '');
    if(feePA=="") { feePA = "0"; } else { feePA = parseFloat(feePA)/100; }
    $("#feeAmountTD").html(formatoMoneda((finalPrice*feeTD).toFixed(2)+""));
    $("#feeAmountPA").html(formatoMoneda((finalPrice*feePA).toFixed(2)+""));
    mountTD = 0;
    if (feeTD < 0.015) {
        mountTD = finalPrice * feeTD * 0.05; 
    } else {
        mountTD = finalPrice * 0.015 * 0.05;
    } 
    feeAdviserPA = 0.015;
    if ( finalPrice >750001 && finalPrice <= 2000000 ) {
        feeAdviserPA = 0.0175;
    } else if ( finalPrice > 2000001 && finalPrice <= 5000000 ) {
        feeAdviserPA = 0.02;
    } else if ( finalPrice >5000001 ) {
        feeAdviserPA = 0.025;
    }
    if (refPaymentId) {
        $("#amountRef").val(formatoMoneda(mountTD.toFixed(2)+""));
        // $("#amountRef").change();
    }
}

// $(document).on("click", ".invoiceBtn", function (e) {
//     e.preventDefault();
//     $("#openInvoicesModal").click();
// });

$(document).on("click", "#openInvoicesTd", function (e) {
    e.preventDefault();
    var typeId = $(this).attr("data-type");
    $("#newInvoiceBtn").attr("disabled", true);
    $("#invoicesTitle").text("Facturas TratoDirecto");
    $("#invoicesPa").hide();
    $("#pluginsTd").hide();
    $("#pluginsPa").hide();
    $("input[type=radio][name=type][value=invoice]").prop('checked', true);
    $("#invoicesTd").show();
    $("#cancelInvoiceBtn").hide();
    $("#cancelInvoiceForm").hide();
    $("#newInvoiceBtn").show();
    $("#invoiceForm").show();
    $("#openInvoicesModal").click();
    $.ajax({
        type: "GET",
        data: {type:"getFacturamaData", typeId: typeId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                $("#newInvoiceBtn").attr("data-sale", saleId);
                $("#newInvoiceBtn").attr("data-type", typeId);
                $("#products").empty();
                $("#products").append(`<option value="0">Selecciona</option>`);
                response.products.forEach(element => {
                    $("#products").append(`<option value="${element.Id}">${element.Name} - ${element.CodeProdServ}</option>`);
                });
                if (response.products.length == 1) {
                    $('#products').select2('data', {id: response.products[0].Id, text: response.products[0].Name + " - " + response.products[0].CodeProdServ});
                } else {
                    $('#products').select2('data', {id: "0", text: "Selecciona"});
                }
                $("#clients").empty();
                $("#clients").append(`<option value="0">Selecciona</option>`);
                response.clients.forEach(element => {
                    $("#clients").append(`<option value="${element.Id}">${element.Alias}</option>`);
                });
                $("#clients").select2('data', {id: "0", text: "Selecciona"});
                $("#paymentForm").empty();
                $("#paymentForm").append(`<option value="0">Selecciona</option>`);
                response.paymentForms.forEach(element => {
                    $("#paymentForm").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                $("#paymentForm").select2('data', {id: "0", text: "Selecciona"});
                $("#paymentMethod").empty();
                $("#paymentMethod").append(`<option value="0">Selecciona</option>`);
                response.paymentMethods.forEach(element => {
                    $("#paymentMethod").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                $("#paymentMethod").select2('data', {id: "0", text: "Selecciona"});
                $("#newInvoiceDate").select2('data', {id: "0", text: "Hoy"});
                $("#bankAcount").empty();
                $("#bankAcount").append(`<option value="0">Selecciona</option>`);
                response.bankAcounts.forEach(element => {
                    $("#bankAcount").append(`<option value="${element.IdTaxEntityBankAccounts}">${element.AccountNumber + " " + element.Name}</option>`);
                });
                if (response.bankAcounts.length == 1) {
                    $('#bankAcount').select2('data', {id: response.bankAcounts[0].IdTaxEntityBankAccounts, text: response.bankAcounts[0].AccountNumber + " " + response.bankAcounts[0].Name});
                } else {
                    $('#bankAcount').select2('data', {id: "0", text: "Selecciona"});
                }
                $("#orderNumber").val("");
                $("#newInvoicePercent").val(maxPercentTd);
                $("#newInvoicePercent").attr("max", maxPercentTd);
                $("#newInvoicePercent").change();
            }
        }
    });
    // $("#newInvoiceFolio").val('');
    // $("#newInvoiceDate").val(today);
});

$(document).on("click", "#openInvoicesPa", function (e) {
    e.preventDefault();
    var typeId = $(this).attr("data-type");
    $("#newInvoiceBtn").attr("disabled", true);
    $("#invoicesTitle").text("Facturas Promoagil");
    $("#invoicesTd").hide();
    $("#pluginsTd").hide();
    $("#pluginsPa").hide();
    $("input[type=radio][name=type][value=invoice]").prop('checked', true);
    $("#invoicesPa").show();
    $("#cancelInvoiceBtn").hide();
    $("#cancelInvoiceForm").hide();
    $("#newInvoiceBtn").show();
    $("#invoiceForm").show();
    $("#openInvoicesModal").click();
    $.ajax({
        type: "GET",
        data: {type:"getFacturamaData", typeId: typeId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                $("#newInvoiceBtn").attr("data-sale", saleId);
                $("#newInvoiceBtn").attr("data-type", typeId);
                $("#products").empty();
                $("#products").append(`<option value="0">Selecciona</option>`);
                response.products.forEach(element => {
                    $("#products").append(`<option value="${element.Id}">${element.Name} - ${element.CodeProdServ}</option>`);
                });
                if (response.products.length == 1) {
                    $('#products').select2('data', {id: response.products[0].Id, text: response.products[0].Name + " - " + response.products[0].CodeProdServ});
                } else {
                    $('#products').select2('data', {id: "0", text: "Selecciona"});
                }
                $("#clients").empty();
                $("#clients").append(`<option value="0">Selecciona</option>`);
                response.clients.forEach(element => {
                    $("#clients").append(`<option value="${element.Id}">${element.Alias}</option>`);
                });
                $("#clients").select2('data', {id: "0", text: "Selecciona"});
                $("#paymentForm").empty();
                $("#paymentForm").append(`<option value="0">Selecciona</option>`);
                response.paymentForms.forEach(element => {
                    $("#paymentForm").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                $("#paymentForm").select2('data', {id: "0", text: "Selecciona"});
                $("#paymentMethod").empty();
                $("#paymentMethod").append(`<option value="0">Selecciona</option>`);
                response.paymentMethods.forEach(element => {
                    $("#paymentMethod").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                $("#paymentMethod").select2('data', {id: "0", text: "Selecciona"});
                $("#newInvoiceDate").select2('data', {id: "0", text: "Hoy"});
                $("#bankAcount").empty();
                $("#bankAcount").append(`<option value="0">Selecciona</option>`);
                response.bankAcounts.forEach(element => {
                    $("#bankAcount").append(`<option value="${element.IdTaxEntityBankAccounts}">${element.AccountNumber + " " + element.Name}</option>`);
                });
                if (response.bankAcounts.length == 1) {
                    $('#bankAcount').select2('data', {id: response.bankAcounts[0].IdTaxEntityBankAccounts, text: response.bankAcounts[0].AccountNumber + " " + response.bankAcounts[0].Name});
                } else {
                    $('#bankAcount').select2('data', {id: "0", text: "Selecciona"});
                }
                $("#orderNumber").val("");
                $("#newInvoicePercent").val(maxPercentPa);
                $("#newInvoicePercent").attr("max", maxPercentPa);
                $("#newInvoicePercent").change();
            }
        }
    });
    // $("#newInvoiceFolio").val('');
    // $("#newInvoiceDate").val(today);
});

$(document).on("click", "#searchSale", function (e) {
    e.preventDefault();
    var text = $("#searchInput").val();
    var searchBy = $("#searchAdvancedOptionType").val();
    console.log(text, searchBy);
    if (text != '') {
        $.ajax({
            type: "GET",
            data: {type:"searchSale", text: text, searchBy: searchBy},
            url: "./php/saleManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    console.log(response.length);
                    $("#resultSearch").html("");
                    if (response.length > 0) {
                        response.forEach(element => {
                            $("#resultSearch").append(`<div class="col-md-6 spaceBottom" >
                                                            <div style="background-color: #eae9e9;padding: 8px 12px">
                                                                <label style="font-weight: bold;">${element.name}</label><br>
                                                                ${element.phone} | ${element.hubspotId} <br>
                                                                ${element.model}, ${element.development} <br>
                                                                <button class="btn btn-success saleResult" name="${element.saleId}">ver</button>
                                                            </div
                                                        </div>`);
                        });
                        $("#openSearchResultModal").click();
                    } else {
                        notify("growl-danger", "Sin coincidencias", "No se encontraron coincidencias.");
                    }
                }
            }
        });
    } else {
        notify("growl-danger", "Error", "Ingresa un texpo para buscar");
    }
});

$("#states").change(function (e) {
    e.preventDefault();
    var stateId = $(this).val();
    var developerId = $("#developers").attr("name");
    $("#localities").empty();
    localities.forEach(element => {
        if (element.stateId == stateId) {
            $("#localities").append(`<option value="${element.localityId}">${element.localityName}</option>`);
        }
    });
    $("#developments").empty();
    developments.forEach(element => {
        if (element.stateId == stateId && element.developerId == developerId) {
            $("#developments").append(`<option value="${element.developmentId}">${element.developmentName}</option>`);
        }
    });
    $("#models").empty();
    models.forEach(element => {
        if (element.stateId == stateId && element.developerId == developerId) {
            $("#models").append(`<option value="${element.modelId}">${element.modelName} - ${element.developmentName}</option>`);
        }
    });
});

$("#localities").change(function (e) {
    e.preventDefault();
    var localityId = $(this).val();
    var developerId = $("#developers").attr("name");
    $("#developments").empty();
    developments.forEach(element => {
        if (element.localityId == localityId && element.developerId == developerId) {
            $("#developments").append(`<option value="${element.developmentId}">${element.developmentName}</option>`);
        }
    });
    $("#models").empty();
    models.forEach(element => {
        if (element.localityId == localityId && element.developerId == developerId) {
            $("#models").append(`<option value="${element.modelId}">${element.modelName} - ${element.developmentName}</option>`);
        }
    });
});

$("#developments").change(function (e) {
    e.preventDefault();
    var developmentId = $(this).val();
    $("#models").empty();
    models.forEach(element => {
        if (element.developmentId == developmentId) {
            $("#models").append(`<option value="${element.modelId}">${element.modelName} - ${element.developmentName}</option>`);
        }
    });
    $("#models").append(`<option value="0">Desconocido</option>`); 
    $("#models").change();
});

// $(document).on("click", "#models", function (e) {
//     e.preventDefault();
//     $("#models").change();
// });

$("#models").change(function (e) {
    e.preventDefault();
    var modelId = $(this).val();
    models.forEach(element => {
        if (element.modelId == modelId) {
            modelSale = modelId;
            $("#finalPrice").val(formatoMoneda(element.price));
            feeTD = (parseFloat(element.fee)*100).toFixed(2);
            $("#feeTD").val(feeTD);
            feePA = (parseFloat(element.feePro)*100).toFixed(2);
            $("#feePA").val(feePA);
        }
    });
    updateFinalPrice();
    $("#updateFinalPrice").show();
});

$(document).on("change", "#finalPrice", function (e) {
    e.preventDefault();
    var finalPrice = $('#finalPrice').val().replace(/,/g, '');
    if (finalPrice.substring(0,1) == '$') { finalPrice = finalPrice.substring(1); }
    $('#finalPrice').val(formatoMoneda(finalPrice));
    updateFinalPrice();
    $("#updateFinalPrice").show();
});

$(document).on("change", "#feeTD", function (e) {
    e.preventDefault();
    // var feeTD = $('#feeTD').val().replace(/%/g, '');
    // if(feeTD=="") feeTD = "0";
    // feeTD = parseFloat(feeTD).toFixed(2);
    // $('#feeTD').val(feeTD+"%");
    updateFinalPrice();
    $("#updatefeeTD").show();
});

$(document).on("change", "#feePA", function (e) {
    e.preventDefault();
    // var feePA = $('#feePA').val().replace(/%/g, '');
    // if(feePA=="") feePA = "0";
    // feePA = parseFloat(feePA).toFixed(2);
    // $('#feePA').val(feePA+"%");
    updateFinalPrice();
    $("#updatefeePA").show();
});

$(document).on("change", "#newInvoicePercent", function (e) {
    e.preventDefault();
    var typeId = $("#newInvoiceBtn").attr("data-type");
    if (typeId == 1) {
        maxPercent = maxPercentTd;
        finalPrice = $('#feeAmountTD').html();
    } else {
        maxPercent = maxPercentPa;
        finalPrice = $('#feeAmountPA').html();
    }
    finalPrice = finalPrice.replace(/,/g, '');
    if (finalPrice.substring(0,1) == '$') { finalPrice = finalPrice.substring(1); }
    finalPrice = parseFloat(finalPrice);
    var percent = parseFloat($("#newInvoicePercent").val());
    if (percent > maxPercent) {
        $("#newInvoiceBtn").attr("disabled", true);
        notify("growl-danger", "Porcentaje no valido", "El procentaje ingresado no es valido, el maximo porcentaje es de "+maxPercent+"%");
    } else {
        percent = percent / 100;
        var newInvoiceAmount = (finalPrice * percent).toFixed(2);
        $("#newInvoiceAmount").val(formatoMoneda(newInvoiceAmount.toString()));
        var newInvoiceTax = (newInvoiceAmount * 0.16).toFixed(2);
        $("#newInvoiceTax").val(formatoMoneda(newInvoiceTax.toString()));
        $("#newInoviceRetention").attr("checked", false);
        var newInvoiceTotal = (parseFloat(newInvoiceAmount)+parseFloat(newInvoiceTax)).toFixed(2);
        $("#newInvoiceTotal").val(formatoMoneda(newInvoiceTotal.toString()));
        $("#newInvoiceBtn").attr("disabled", false);
    }
});

$(document).on("change", "#newInvoiceAmount", function (e) {
    e.preventDefault();
    var typeId = $("#newInvoiceBtn").attr("data-type");
    if (typeId == 1) {
        maxPercent = maxPercentTd;
        finalPrice = $('#feeAmountTD').html();
    } else {
        maxPercent = maxPercentPa;
        finalPrice = $('#feeAmountPA').html();
    }
    finalPrice = finalPrice.replace(/,/g, '');
    if (finalPrice.substring(0,1) == '$') { finalPrice = finalPrice.substring(1); }
    finalPrice = parseInt(finalPrice);
    var newInvoiceAmount = $("#newInvoiceAmount").val().replace(/,/g, '');
    if (newInvoiceAmount.substring(0,1) == '$') { newInvoiceAmount = newInvoiceAmount.substring(1); }
    newInvoiceAmount = parseFloat(newInvoiceAmount).toFixed(2);
    var percent = ((100*newInvoiceAmount)/finalPrice).toFixed(2);
    if (percent == 33.34 && maxPercent == 33.33) percent = 33.33;
    if (percent > maxPercent) {
        $("#newInvoiceBtn").attr("disabled", true);
        amount = finalPrice * maxPercent/100;
        notify("growl-danger", "Monto no valido", "El Monto ingresado no es valido, el maximo monto es de "+formatoMoneda(amount.toString()));
        // $("#newInvoiceAmount").val(formatoMoneda(amount.toString()));
    } else {
        $("#newInvoicePercent").val(percent);
        $("#newInvoiceAmount").val(formatoMoneda(newInvoiceAmount.toString()));
        var newInvoiceTax = (newInvoiceAmount * 0.16).toFixed(2);
        $("#newInvoiceTax").val(formatoMoneda(newInvoiceTax.toString()));
        $("#newInoviceRetention").attr("checked", false);
        var newInvoiceTotal = (parseFloat(newInvoiceAmount)+parseFloat(newInvoiceTax)).toFixed(2);
        $("#newInvoiceTotal").val(formatoMoneda(newInvoiceTotal.toString()));
        $("#newInvoiceBtn").attr("disabled", false);
    }
    
});

$(document).on("click", "#newInvoiceBtn", function (e) {
    e.preventDefault();
    $(this).attr("disabled", true);
    var saleId = $(this).attr("data-sale");
    var typeId = $(this).attr("data-type");
    var clientId = $("#clients").val();
    if (clientId == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un cliente"); return;}
    var productId = $("#products").val();
    if (productId == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un producto"); return;}
    var paymentForm = $("#paymentForm").val();
    if (paymentForm == "0") { notify("growl-danger", "Datos incompletos", "Selecciona una forma de pago"); return;}
    var paymentMethod = $("#paymentMethod").val();
    if (paymentMethod == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un método de pago"); return;}
    var dateVal = $("#newInvoiceDate").val();
    var dateInvoice = new Date();
    dateInvoice = changeTimeZone(dateInvoice, 'America/Mexico_City');
    dateInvoice.setDate( dateInvoice.getDate() - parseInt(dateVal) );
    var dateUtc = Date.UTC(dateInvoice.getFullYear(), dateInvoice.getMonth(), dateInvoice.getDate(), dateInvoice.getHours(), dateInvoice.getMinutes(), dateInvoice.getSeconds());
    var dateIso = new Date(dateUtc).toISOString();
    dateUtc = dateUtc/1000;
    var bankAccount = $("#bankAcount").val();
    // if (bankAccount == "0") { notify("growl-danger", "Datos incompletos", "Selecciona una cuenta de banco"); return;}
    var orderNumber = $("#orderNumber").val();
    var percent = parseFloat($("#newInvoicePercent").val());
    if (percent == 0) { notify("growl-danger", "Datos incompletos", "El porcentaje no es valido"); return;}
    var amountInvoice = $('#newInvoiceAmount').val().replace(/,/g, '');
    if (amountInvoice.substring(0,1) == '$') { amountInvoice = amountInvoice.substring(1); }
    amountInvoice = parseFloat(amountInvoice).toFixed(2);
    var taxInvoice = $('#newInvoiceTax').val().replace(/,/g, '');
    if (taxInvoice.substring(0,1) == '$') { taxInvoice = taxInvoice.substring(1); }
    taxInvoice = parseFloat(taxInvoice).toFixed(2);
    var totalInvoice = $('#newInvoiceTotal').val().replace(/,/g, '');
    if (totalInvoice.substring(0,1) == '$') { totalInvoice = totalInvoice.substring(1); }
    totalInvoice = parseFloat(totalInvoice).toFixed(2);
    $.ajax({
        type: "GET",
        data: {type:"createInvoiceFac", saleId: saleId, typeId: typeId, clientId: clientId, productId: productId, paymentForm: paymentForm, paymentMethod: paymentMethod, dateUtc: dateUtc, dateIso: dateIso, bankAccount: bankAccount, orderNumber: orderNumber, percent: percent, amountInvoice: amountInvoice, taxInvoice: taxInvoice, totalInvoice: totalInvoice},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    $("#openInvoicesModal").click();
                    getInvoices(saleId);
                    notify("growl-success", "Factura agregada", response.message);
                    getStageByInvoice(false);
                } else {
                    notify("growl-danger", "Error al agregar", response.message);
                }
            }
        }
    });
});

$(document).on("change", ".selectInvoice", function (e) {
    e.preventDefault();
    idInvoice = $(this).attr("name");
    $("#updateInvoice-"+idInvoice).show();
});

$(document).on("change", ".dateInvoice", function (e) {
    e.preventDefault();
    idInvoice = $(this).attr("name");
    $("#updateInvoice-"+idInvoice).show();
});

$(document).on("click", ".updateInvoice", function (e) {
    e.preventDefault();
    var saleId = $("#newInvoiceBtn").attr("data-sale");
    var idInvoice = $(this).attr("name");
    var paidDate = $("#dateInvoice-"+idInvoice).val();
    paidDate = paidDate.split("/");
    paidDate = Date.UTC(paidDate[2], paidDate[1]-1, paidDate[0], 12, 0, 0)/1000;
    var statusInvoice = $("#selectInvoice-"+idInvoice).val();
    console.log(idInvoice, paidDate, statusInvoice);
    $.ajax({
        type: "GET",
        data: {type:"updateInvoice", invoiceId: idInvoice, paidDate: paidDate, statusInvoice: statusInvoice, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado correctamente", response.message);
                    $("#updateInvoice-"+idInvoice).hide();
                    getInvoices(saleId);
                    $("#openInvoicesModal").click();
                    if (statusInvoice == 46) {
                        createPaymentInvoice(idInvoice);
                        getStageByInvoice(true);
                    }
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

var appointmentId = 0;
var leadId = 0;
var saleId = 0;
var dealId = 0;
var hubspotId = 0;
var refPaymentId = 0;
var modelSale = 0;
var purse = { code: 0, exchange: 0, status: 0 };
var referrerPaymentData = { date: 0, status: 0 };
$(document).on("click", ".saleResult",function (e) {
    e.preventDefault();
    var idSale = $(this).attr("name");
    if($("#searchResultModalBody").is(":visible")){
        $("#openSearchResultModal").click();
        $("#saleDataContainer").hide();
        $("#saveSaleBtns").hide();
        $("#stageSection").hide();
    }
    $("#saleLoader").show();
    $.ajax({
        type: "GET",
        data: {type:"getSaleData", saleId: idSale},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                appointmentId = parseInt(response.appointmentId);
                leadId = parseInt(response.hotleadId);
                saleId = parseInt(response.id);
                dealId = parseInt(response.dealId);
                hubspotId = response.userHsId;
                $("#updateFinalPrice").attr("name", response.id);
                $("#updatefeeTD").attr("name", response.id);
                $("#updatefeePA").attr("name", response.id);
                var detail = (response.leadDetail == null ) ? [] : response.leadDetail.split("|");
                $("#appointmentId").html(response.userHsId+"-"+response.hotleadId);
                $("#accredited").val(response.userName);
                $("#updateAccredited").hide();
                $("#appointmentDate").html(response.date);
                $("#appointmentTime").html(response.time+" hrs");
                if (detail.length > 0) {
                    $("#appointmentOrigin").html(detail[5]);
                    if (detail[6] == '') {
                        $("#appointmentSession").html("Sin medio");
                    } else {
                        $("#appointmentSession").html(detail[6]);
                    }
                    if (detail[7] == '') {
                        $("#appointmentCampain").html("Sin campaña");
                    } else {
                        $("#appointmentCampain").html(detail[7]);
                    }
                } else {
                    $("#appointmentOrigin").html("");
                    $("#appointmentSession").html("Sin medio");
                    $("#appointmentCampain").html("Sin campaña");
                }
                $('#buyingProduct').select2('data', {id: response.buyingProductId, text: response.buyingProductName});
                $("#appointmentStage option").each(function () { $(this).attr("disabled", false); });
                $('#appointmentStage').select2('data', {id: response.appointmentStageId, text: response.appointmentStageName});
                disableStages(response.appointmentStageId);
                $("#developers").val(response.developerName);
                $("#developers").attr("name", response.developerId);
                $("#states").empty();
                states.forEach(element => {
                    if (element.developerId == response.developerId) {
                        $("#states").append(`<option value="${element.stateId}">${element.stateName}</option>`);
                    }
                });
                if ($("#states option[value='"+response.stateId+"']").length == 0) {
                    $("#states").append(`<option value="${response.stateId}">${response.stateName}</option>`);
                }
                $('#states').select2('data', {id: response.stateId, text: response.stateName});
                $("#localities").empty();
                localities.forEach(element => {
                    if (element.stateId == response.stateId) {
                        $("#localities").append(`<option value="${element.localityId}">${element.localityName}</option>`);
                    }
                });
                if ($("#localities option[value='"+response.localityId+"']").length == 0) {
                    $("#localities").append(`<option value="${response.localityId}">${response.localityName}</option>`);
                }
                $('#localities').select2('data', {id: response.localityId, text: response.localityName});
                developments.forEach(element => {
                    if (element.localityId == response.localityId) {
                        $("#developments").append(`<option value="${element.developmentId}">${element.developmentName}</option>`);
                    }
                });
                if ($("#developments option[value='"+response.developmentId+"']").length == 0) {
                    $("#developments").append(`<option value="${response.developmentId}">${response.developmentName}</option>`);
                }
                $('#developments').select2('data', {id: response.developmentId, text: response.developmentName});
                if ($("#models option[value='"+response.modelId+"']").length == 0) {
                    $("#models").append(`<option value="${response.modelId}">${response.modelName} - ${response.developmentName}</option>`);
                }
                $('#models').select2('data', {id: response.modelId, text: response.modelName + " - " + response.developmentName});
                modelSale = response.modelId;
                $("#finalPrice").val(formatoMoneda(response.price));
                $("#updateFinalPrice").hide();
                $("#contacName").html(response.contacName);
                $("#contactPhone").html(response.contacPhone);
                $("#contactEmail").html(response.userEmail);
                $("#feeTD").val(parseFloat(response.fee)*100);
                $("#updatefeeTD").hide();
                $("#feeAmountTD").html(formatoMoneda(response.feeAmount));
                $("#feePA").val(parseFloat(response.feePro)*100);
                if (parseFloat(response.feePro)*100 == 0) {
                    $("#openInvoicesPa").attr("disabled", true);
                } else {
                    $("#openInvoicesPa").attr("disabled", false);
                }
                $("#updatefeePA").hide();
                $("#feeAmountPA").html(formatoMoneda(response.feeProAmount));
                $("#purseAmount").html(formatoMoneda(response.purseAmount));
                $("#userEmail").html(response.userEmail);
                $("#purseCode").val(response.purseCode);
                if (!(response.purseExchange == null || response.purseExchange == '')) {
                    $("#purseExchange").val(response.purseExchange);
                } else {
                    $("#purseExchange").val(today);
                }
                if (response.purseStatusId == 0) {
                    $('#epurseFlag').select2('data', {id: 0, text: "selecciona"});
                } else {
                    $('#epurseFlag').select2('data', {id: response.purseStatusId, text: response.purseStatusName});
                }
                if (parseInt(response.invoicesProCount) > 0 || parseInt(response.invoicesTdCount) > 0) {
                    console.log("tengo facturas");
                } else {
                    console.log("no tengo facturas");
                }

                if (response.lastComment == null || response.lastComment == "") {
                    $("#lastComment").html("Sin comentarios");
                } else {
                    var comment = response.lastComment;
                    if (response.lastComment.indexOf("storage.googleapis")>-1) {
                        comment = `<a style="cursor:pointer" target="_blank" href=" ${response.lastComment} ">${response.lastComment.split("https://storage.googleapis.com/tratodirecto.com/")[1]}</a>`;
                    }
                    $("#lastComment").html(comment);
                }

                if (response.saleStatus == 7) {
                    $("#closeSale").attr("disabled", false);
                } else if (response.saleStatus == 8) {
                    $("#closeSale").attr("disabled", true);
                }
                $("#saleLoader").hide();
                $("#saleDataContainer").show();
                $("#saveSaleBtns").show();
                $("#stageSection").show();
                getInvoices(response.id);
                getPlugins(response.id);
                showPayments();
                purse.code = 0;
                purse.exchange = 0;
                purse.status = 0;
                $("#updateEpurse").hide();
            }
        }
    });
});

// function testCreate() {
//     $.ajax({
//         type: "GET",
//         data: {type:"createSale", leadId: leadId},
//         url: "./php/saleManagementData.php", 
//         dataType: 'json',
//         success: function(response) {
//             if (response == 'timeout') {
//                 window.location.replace("logout.php?var=timeout");
//             } else {
//                 if (response) {
//                     notify("growl-success", "Actualizado", "Se ha actualizado correctamente");
//                 } else {
//                     notify("growl-danger", "Error al actualizar", "Ha ocurrido un problema al actualizar");
//                 }
//             }
//         }
//     });
// }

$(document).on("change", "#accredited", function (e) {
    e.preventDefault();
    var nameAccredited = $(this).val();
    if (nameAccredited != "") {
        $("#updateAccredited").show();
    } else {
        $("#updateAccredited").hide();
    }
});

$(document).on("click", "#updateAccredited", function (e) {
    e.preventDefault();
    var nameAccredited = $("#accredited").val();
    $.ajax({
        type: "GET",
        data: {type:"changeNameAccredited", saleId: saleId, nameAccredited: nameAccredited},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Nombre actualizado", "Se ha actualizado el nombre correctamente");
                } else {
                    notify("growl-danger", "Error al actualizar", "Error al actualizar el nombre");
                }
            }
        }
    });
});

var maxPercentTd = 100;
var maxPercentPa = 100;
function getInvoices(saleId) {
    $("#invoicesTdList").html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:24Px;">');
    $("#invoicesPaList").html('<img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:24Px;">');
    $.ajax({
        type: "GET",
        data: {type:"getInvoices", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                var createdAt = '';
                var paidAt = '';
                var options = '';
                var datePick = '';
                var contInvoices = 0;
                maxPercentTd = 100.00;
                $("#invoicesTdList").html("");
                if (response.invoicesTd.length == 0) {
                    $("#invoicesTdList").append('<label class="data">Sin facturas</label><br>');
                    $("#invoicesTdData").html('');
                } else {
                    $("#invoicesTdData").html('');
                    response.invoicesTd.forEach(element => {
                        createdAt = element.createdAt;
                        if (element.paidAt == null || element.paidAt == '') {
                            paidAt = today;
                        } else {
                            paidAt = element.paidAt;
                        }
                        var aFecha1 = createdAt.split('/');
                        var aFecha2 = paidAt.split('/');
                        var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
                        var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
                        var dif = fFecha2 - fFecha1;
                        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
                        var options = `<select class="selectInvoice" style="width: 160px" name=${element.id} id="selectInvoice-${element.id}"   `;
                        var datePick = `<input type="text" class="inputData datepicker dateInvoice" value="${paidAt}" style="width: 160px" name="${element.id}" id="dateInvoice-${element.id}"`;
                        if (element.flagId == "48" || element.flagId == "46") {
                            options += ` disabled`;
                            datePick += ` disabled`;
                        } 
                        if (element.flagId != "48" && element.flagId != "53") {
                            maxPercentTd = maxPercentTd - element.percent;
                            $("#invoicesTdList").append(`<label class="data">${element.folio}</label><br>`);
                            contInvoices++;
                            if (element.flagId == 46) {
                                console.log("factura cobrada");
                            }
                        }
                        options += `>`;
                        datePick += `>`;
                        invoiceFlags.forEach(invoiceFlag => {
                            if (invoiceFlag.id != 47) {
                                if (invoiceFlag.id == element.flagId) {
                                    options += `<option value="${invoiceFlag.id}" selected>${invoiceFlag.label}</option>`;
                                } else {
                                    options += `<option value="${invoiceFlag.id}">${invoiceFlag.label}</option>`;
                                }
                            }
                        });
                        deleteButton = "";
                        if (element.flagId == 45) {
                            deleteButton = `<button type="button" class="btn btn-sm btn-cancel cancelInvoice" name="${element.id}" id="" style="display: inline-block;">
                                                Cancelar
                                            </button>`;
                        }
                        options += `</select>`;
                        $("#invoicesTdData").append(`<tr>
                                                        <td><label class="downloadInvoice" name="${element.idFacturama}">${element.folio}</label></td>
                                                        <td>${createdAt}</td>
                                                        <td>${parseFloat(element.percent)}</td>
                                                        <td>${formatoMoneda(element.amount)}</td>
                                                        <td>${dias}</td>
                                                        <td>${datePick}</td>
                                                        <td>${options}</td>
                                                        <td><button class="btn btn-success actionBtn updateInvoice" name="${element.id}" id="updateInvoice-${element.id}" style="display:none">Actualizar</button></td>
                                                        <td>${deleteButton}</td>
                                                    </tr>`);
                    });
                }
                
                maxPercentPa = 100.00;
                $("#invoicesPaList").html("");
                if (response.invoicesPro.length == 0) {
                    $("#invoicesPaList").append('<label class="data">Sin facturas</label><br>');
                    $("#invoicesPaData").html('');
                } else {
                    $("#invoicesPaData").html('');
                    response.invoicesPro.forEach(element => {
                        createdAt = element.createdAt;
                        if (element.paidAt == null || element.paidAt == '') {
                            paidAt = today;
                        } else {
                            paidAt = element.paidAt;
                        }
                        var aFecha1 = createdAt.split('/');
                        var aFecha2 = paidAt.split('/');
                        var fFecha1 = Date.UTC(aFecha1[2],aFecha1[1]-1,aFecha1[0]);
                        var fFecha2 = Date.UTC(aFecha2[2],aFecha2[1]-1,aFecha2[0]);
                        var dif = fFecha2 - fFecha1;
                        var dias = Math.floor(dif / (1000 * 60 * 60 * 24));
                        var options = `<select class="selectInvoice" style="width: 160px" name=${element.id} id="selectInvoice-${element.id}"`;
                        var datePick = `<input type="text" class="inputData datepicker dateInvoice" value="${paidAt}" style="width: 160px" name="${element.id}" id="dateInvoice-${element.id}"`;
                        if (element.flagId == "48"  || element.flagId == "46") {
                            options += ` disabled`;
                            datePick += ` disabled`;
                        } 
                        if (element.flagId != "48" && element.flagId != "53") {
                            maxPercentPa = maxPercentPa - element.percent;
                            $("#invoicesPaList").append(`<label class="data">${element.folio}</label><br>`);
                            contInvoices++;
                        }
                        options += `>`;
                        datePick += `>`;
                        invoiceFlags.forEach(invoiceFlag => {
                            if (invoiceFlag.id != 47) {
                                if (invoiceFlag.id == element.flagId) {
                                    options += `<option value="${invoiceFlag.id}" selected>${invoiceFlag.label}</option>`;
                                } else {
                                    options += `<option value="${invoiceFlag.id}">${invoiceFlag.label}</option>`;
                                }
                            }
                        });
                        options += `</select>`;
                        deleteButton = "";
                        if (element.flagId == 45) {
                            deleteButton = `<button type="button" class="btn btn-sm btn-cancel cancelInvoice" name="${element.id}" id="" style="display: inline-block;">
                                                Cancelar
                                            </button>`;
                        }
                        $("#invoicesPaData").append(`<tr>
                                                        <td><label class="downloadInvoice" name="${element.idFacturama}">${element.folio}</label></td>
                                                        <td>${createdAt}</td>
                                                        <td>${parseFloat(element.percent)}</td>
                                                        <td>${formatoMoneda(element.amount)}</td>
                                                        <td>${dias}</td>
                                                        <td>${datePick}</td>
                                                        <td>${options}</td>
                                                        <td><button class="btn btn-success actionBtn updateInvoice" name="${element.id}" id="updateInvoice-${element.id}" style="display:none">Actualizar</button></td>
                                                        <td>${deleteButton}</td>
                                                    </tr>`);
                    });
                }
                if (contInvoices != 0) {
                    $("#states").attr("disabled", true);
                    $("#localities").attr("disabled", true);
                    $("#developments").attr("disabled", true);
                    $("#models").attr("disabled", true);
                    $("#finalPrice").attr("disabled", true);
                    $("#accredited").attr("disabled", true);
                    $("#feeTD").attr("disabled", true);
                    $("#feePA").attr("disabled", true);
                } else {
                    $("#states").attr("disabled", false);
                    $("#localities").attr("disabled", false);
                    $("#developments").attr("disabled", false);
                    $("#models").attr("disabled", false);
                    $("#finalPrice").attr("disabled", false);
                    $("#accredited").attr("disabled", false);
                    $("#feeTD").attr("disabled", false);
                    $("#feePA").attr("disabled", false);
                }
                $('.datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
            }
        }
    });
}

function getPlugins($saleId) {
    $.ajax({
        type: "GET",
        data: {type:"getPlugins", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $("#pluginsTd").hide();
                $("#pluginsPa").hide();
                $("#pluginsTdData").html('');
                $("#pluginsPaData").html('');
                response.pluginsTd.forEach(element => {
                    options = `<select>`;
                    if (element.flagId == 46) {
                        options += `<option value="46" selected>Cobrado</option><option value="48">Cancelado</option>`;
                    } else {
                        options += `<option value="46">Cobrado</option><option value="48" selected>Cancelado</option>`;
                    }
                    options += `</select>`;
                    $("#pluginsTdData").append(`<tr>
                        <td><label class="downloadInvoice" name="${element.idFacturama}">${element.folio}</label></td>
                        <td>${element.relatedInvoiceFolio}</td>
                        <td>${element.partiality}</td>
                        <td>${parseFloat(element.percent)}</td>
                        <td>${formatoMoneda(element.amount)}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.flagName}</td>
                    </tr>`);
                });
                response.pluginsPro.forEach(element => {
                    options = `<select>`;
                    if (element.flagId == 46) {
                        options += `<option value="46" selected>Cobrado</option><option value="48">Cancelado</option>`;
                    } else {
                        options += `<option value="46">Cobrado</option><option value="48" selected>Cancelado</option>`;
                    }
                    options += `</select>`;
                    $("#pluginsPaData").append(`<tr>
                        <td><label class="downloadInvoice" name="${element.idFacturama}">${element.folio}</label></td>
                        <td>${element.relatedInvoiceFolio}</td>
                        <td>${element.partiality}</td>
                        <td>${parseFloat(element.percent)}</td>
                        <td>${formatoMoneda(element.amount)}</td>
                        <td>${element.createdAt}</td>
                        <td>${element.flagName}</td>
                    </tr>`);
                });
            }
        }
    });
}

$(document).on("change", "input[type=radio][name=type]", function (e) {
    e.preventDefault();
    var type = this.value;
    var invoiceType = $("#newInvoiceBtn").attr('data-type');
    if (invoiceType == 1) {
        $("#invoicePa").hide();
        $("#pluginsPa").hide();
        if (type == "invoice") {
            $("#pluginsTd").hide();
            $("#invoicesTd").show();
        } else {
            $("#invoicesTd").hide();
            $("#pluginsTd").show();
        }
    } else {
        $("#invoicesTd").hide();
        $("#pluginsTd").hide();
        if (type == "invoice") {
            $("#pluginsPa").hide();
            $("#invoicesPa").show();
        } else {
            $("#invoicesPa").hide();
            $("#pluginsPa").show();
        }
    }
});

$(document).on("click", "#updateFinalPrice", function (e) {
    e.preventDefault();
    var development = $("#developments").val();
    var model = modelSale;
    var finalPrice = $("#finalPrice").val().replace(/,/g, '');
    if (finalPrice.substring(0,1) == '$') { finalPrice = finalPrice.substring(1); }
    var feeAmountTd = $("#feeAmountTD").html().replace(/,/g, '');
    if (feeAmountTd.substring(0,1) == '$') { feeAmountTd = feeAmountTd.substring(1); }
    var feeAmountPa = $("#feeAmountPA").html().replace(/,/g, '');
    if (feeAmountPa.substring(0,1) == '$') { feeAmountPa = feeAmountPa.substring(1); }
    console.log(model, finalPrice, feeAmountTd, feeAmountPa, development);
    $.ajax({
        type: "GET",
        data: {type:"updateFinalPrice", finalPrice: finalPrice, feeAmountTd: feeAmountTd, feeAmountPa: feeAmountPa, model: model, saleId: saleId, development:development},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message + ". Se actualizo el precio final y comisiones");
                    $("#updateFinalPrice").hide();
                    if ( refPaymentId != 0 ) {
                        console.log("si hay referenciado");
                        var amountRef = $("#amountRef").val().replace(/,/g, '');
                        if (amountRef.substring(0,1) == '$') { amountRef = amountRef.substring(1); }
                        updatePayment(amountRef, 100, refPaymentId);
                    }
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

function updatePayment( amount, percent, paymentId ) {
    $.ajax({
        type: "GET",
        data: {type:"updatePaymentAmount", amount: amount, paymentId: paymentId, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message + " Pago ");
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
}

$(document).on("click", "#updatefeeTD", function (e) {
    e.preventDefault();
    var feeTd = parseFloat($("#feeTD").val())/100;
    var feeAmountTd = $("#feeAmountTD").html().replace(/,/g, '');
    if (feeAmountTd.substring(0,1) == '$') { feeAmountTd = feeAmountTd.substring(1); }
    $.ajax({
        type: "GET",
        data: {type:"updateFeeTd", feeAmountTd: feeAmountTd, feeTd: feeTd, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                    $("#updatefeeTD").hide();
                    if (feeTd > 0) {
                        $("#openInvoicesTd").attr("disabled", false);
                    } else {
                        $("#openInvoicesTd").attr("disabled", true);
                    }
                    if ( refPaymentId != 0 ) {
                        console.log("si hay referenciado");
                        var amountRef = $("#amountRef").val().replace(/,/g, '');
                        if (amountRef.substring(0,1) == '$') { amountRef = amountRef.substring(1); }
                        updatePayment(amountRef, 100, refPaymentId);
                    }
                    var model = $("#models").val();
                    if (model != '0' && feeTd > 0) {
                        if (confirm("Desea actualizar la comision del modelo?")) {
                            updateModelFeeTd(model, feeTd);
                        }
                    }
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

function updateModelFeeTd(model, feeTd) {
    $.ajax({
        type: "GET",
        data: {type:"updatePropertyModelFeeTd", model: model, feeTd: feeTd},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Actualizado correctamente", "Se ha actualizado la comision del modelo");
                } else {
                    notify("growl-danger", "Error al actualizar", "No se ha actualizado la comision del modelo");
                }
            }
        }
    });
}

$(document).on("click", "#updatefeePA", function (e) {
    e.preventDefault();
    var feePa = parseFloat($("#feePA").val())/100;
    var feeAmountPa = $("#feeAmountPA").html().replace(/,/g, '');
    if (feeAmountPa.substring(0,1) == '$') { feeAmountPa = feeAmountPa.substring(1); }
    $.ajax({
        type: "GET",
        data: {type:"updateFeePa", feeAmountPa: feeAmountPa, feePa: feePa, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                    $("#updatefeePA").hide();
                    if (feePa > 0) {
                        $("#openInvoicesPa").attr("disabled", false);
                    } else {
                        $("#openInvoicesPa").attr("disabled", true);
                    }
                    var model = $("#models").val();
                    if (model != '0' && feePa > 0) {
                        if (confirm("Desea actualizar la comision del modelo?")) {
                            updateModelFeePa(model, feePa);
                        }
                    }
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

function updateModelFeePa(model, feePa) {
    $.ajax({
        type: "GET",
        data: {type:"updatePropertyModelFeePa", model: model, feePa: feePa},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response) {
                    notify("growl-success", "Actualizado correctamente", "Se ha actualizado la comision del modelo");
                } else {
                    notify("growl-danger", "Error al actualizar", "No se ha actualizado la comision del modelo");
                }
            }
        }
    });
}

$(document).on("change", "#appointmentStage", function (e) {
    e.preventDefault();
    var stageId = $(this).val();
    if (stageId == null) {
        return;
    }
    var stageHubspotId = $("#appointmentStage option:selected").attr("data-dealid");
    var closeReason = '';
    var negotationId = 0;
    // console.log(leadId, appointmentId, dealId, stageId, stageHubspotId);
    $.ajax({
        type: "GET",
        data: {type:"checkSaleStatus", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    $.ajax({
                        type: "POST",
                        data: {type:"updateStageHubSpot",leadId:leadId,appointmentId:appointmentId,dealId:dealId,stage:stageHubspotId,cancelReason:closeReason,negotationId:negotationId, hubSpotContactId:hubspotId},
                        url: "./php/messagingData.php",
                        dataType: 'json',  
                        success: function(response) {
                            if (response == 'timeout') {
                                window.location.replace("logout.php?var=timeout");
                            } else if (response == 'success') {
                                notify("growl-success", "Actualizado", "Se actualizo el estado del negocio correctamente");
                                disableStages(stageId);
                            } else {
                                notify("growl-danger", "Error al actualizar", "Error al actualizar el estado del negocio");
                            }
                        },
                        error: function(response) {
                            notify("growl-danger", "Error al actualizar", "Error al actualizar el estado del negocio");
                        }
                    });
                } else {
                    notify("growl-danger", "Error al actualizar", "La venta se encuentra cerrada");
                }
            }
        }
    });
});

$(document).on("change", "#buyingProduct", function (e) {
    e.preventDefault();
    var productId = $(this).val();
    $.ajax({
        type: "GET",
        data: {type:"updateBuyingProduct", productId: productId, leadId: leadId, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

$(document).on("change", "#amountRef", function (e) {
    e.preventDefault();
    var amount = $("#amountRef").val().replace(/,/g, '');
    if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
    $("#amountRef").val(formatoMoneda(amount));
    if (refPaymentId != 0) {
        $("#updateAmountRef").show();
    }
});

$(document).on("click", "#updateAmountRef", function (e) {
    e.preventDefault();
    var amount = $("#amountRef").val().replace(/,/g, '');
    if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
    updatePayment(amount, 100, refPaymentId);
});

$(document).on("change", "#purseCode", function (e) {
    e.preventDefault();
    var code = $(this).val();
    purse.code = code;
    $("#updateEpurse").show();
});

$(document).on("change", "#purseExchange", function (e) {
    e.preventDefault();
    var date = $(this).val();
    date = date.split("/");
    date = Date.UTC(date[2], date[1]-1, date[0], 12, 0, 0)/1000;
    purse.exchange = date;
    $("#updateEpurse").show();
});

$(document).on("change", "#epurseFlag", function (e) {
    e.preventDefault();
    var status = $(this).val();
    purse.status = status;
    $("#updateEpurse").show();
});

$(document).on("click", "#updateEpurse", function (e) {
    e.preventDefault();
    $.ajax({
        type: "GET",
        data: {type:"updateEpurse", purse: purse, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                    purse.code = 0;
                    purse.exchange = 0;
                    purse.status = 0;
                    $("#updateEpurse").hide();
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

function updatePaymentDate(paymentId, date) {
    $.ajax({
        type: "GET",
        data: {type:"updatePaymentDate", paymentId: paymentId, date: date},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Actualizado", "Se ha actualizado la fecha del pago");
                } else {
                    notify("growl-danger", "Error al actualizar", "No se ha logrado actualizar la fecha del pago, intentalo mas tarde");
                }
            }
        }
    });
}

function updatePaymentFlag(paymentId, status) {
    $.ajax({
        type: "GET",
        data: {type:"updatePaymentFlag", paymentId: paymentId, flagId: status},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    notify("growl-success", "Actualizado", "Se ha actualizado el status del pago");
                } else {
                    notify("growl-danger", "Error al actualizar", "No se ha logrado actualizar el status del pago, intentalo mas tarde");
                }
            }
        }
    });
}

$(document).on("change", "#refDate", function (e) {
    e.preventDefault();
    var date = $(this).val();
    date = date.split("/");
    date = Date.UTC(date[2], date[1]-1, date[0], 12, 0, 0)/1000;
    // referrerPaymentData.date = date;
    if (refPaymentId != 0) {
        // $("#updateReferrerData").show();
        updatePaymentDate(refPaymentId, date);
    }
});

$(document).on("change", "#adviserRefFlag", function (e) {
    e.preventDefault();
    var status = $(this).val();
    // referrerPaymentData.status = status;
    if (refPaymentId != 0) {
        // $("#updateReferrerData").show();
        updatePaymentFlag(refPaymentId, status);
    }
});

$(document).on("click", "#updateReferrerData", function (e) {
    e.preventDefault();
    updatePaymentData( referrerPaymentData, refPaymentId );
});

function updatePaymentData( paymentData, paymentId ) {
    $.ajax({
        type: "GET",
        data: {type:"updatePaymentData", paymentData: paymentData, paymentId: paymentId, saleId: saleId},
        url: "./php/saleManagementData", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                    paymentData.date = 0;
                    paymentData.status = 0;
                    $("#updateAdviserData").hide();
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
}

$(document).on("click", "#closeSale", function (e) {
    e.preventDefault();
    appointmentStage = $("#appointmentStage").val();
    $.ajax({
        type: "GET",
        data: {type:"closeSale", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message);
                    var stageHubspotId = '884328';
                    var closeReason = '';
                    var negotationId = 0;
                    if (appointmentStage != "13" && appointmentStage != "14" && appointmentStage != "24" && appointmentStage != null) {
                        $.ajax({
                            type: "POST",
                            data: {type:"updateStageHubSpot",leadId:leadId,appointmentId:appointmentId,dealId:dealId,stage:stageHubspotId,cancelReason:closeReason,negotationId:negotationId,hubSpotContactId:hubspotId},
                            url: "./php/messagingData.php",
                            dataType: 'json',  
                            success: function(response) {
                                if (response == 'timeout') {
                                    window.location.replace("logout.php?var=timeout");
                                } else if (response == 'success') {
                                    notify("growl-success", "Actualizado", "Se actualizo el estado del negocio correctamente");
                                } else {
                                    notify("growl-danger", "Error al actualizar", "Error al actualizar el estado del negocio");
                                }
                            },
                            error: function(response) {
                                notify("growl-danger", "Error al actualizar", "Error al actualizar el estado del negocio");
                            }
                        });
                        
                    }
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

// function testCreateSale(leadId, price) {
//     $.ajax({
//         type: "GET",
//         data: {type:"createSalePrice", leadId: leadId, price: price},
//         url: "./php/saleManagementData.php", 
//         dataType: 'json',
//         success: function(response) {
//             if (response == 'timeout') {
//                 window.location.replace("logout.php?var=timeout");
//             } else {
//                 if (response.status) {
//                     notify("growl-success", "Creada", response.errors);
//                     console.log("Venta creada para el lead " + leadId);
//                     return true;
//                 } else {
//                     notify("growl-danger", "Error al crear", response.errors);
//                     console.log(response.errors);
//                     return false;
//                 }
//             }
//         }
//     });
// }

function updateDataSale() {
    $.ajax({
        type: "GET",
        data: {type:"test"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
            }
        }
    });
}

// function updatePaymentExtras(texto) {
//     texto = texto.split(";");
//     texto.forEach(element => {
//         valores = element.split(":");
//         leadId = valores[0];
//         amount = parseFloat(valores[1]).toFixed(2);
//         console.log(leadId, amount);
//         $.ajax({
//             type: "GET",
//             data: {type:"updatePaymentExtra", leadId: leadId, amount:amount},
//             url: "./php/saleManagementData.php", 
//             dataType: 'json',
//             success: function(response) {
//                 if (response == 'timeout') {
//                     window.location.replace("logout.php?var=timeout");
//                 } else {
//                     console.log(response + element);
//                 }
//             }
//         });
//     });
// }

$(document).on("click", ".cancelInvoice", function (e) {
    e.preventDefault();
    var invoiceId = $(this).attr("name");
    var typeId = $("#newInvoiceBtn").attr("data-type");
    console.log(invoiceId, typeId);
    $("#cancelInvoiceBtn").attr("data-type", typeId);
    $("#cancelInvoiceBtn").attr("name", invoiceId);
    $("#invoiceForm").hide();
    $("#cancelInvoiceBtn").hide();
    $("#cancelInvoiceForm").show();
    $("#motiveCancel").select2('data', {id: "0", text: "Selecciona"});
});

$(document).on("change", "#motiveCancel", function (e) {
    e.preventDefault();
    var motive = $(this).val();
    console.log(motive);
    if (motive != "0") {
        if (motive == "01") {
            $("#newInvoiceBtn").hide();
            $("#invoiceForm").show();
            $("#cancelInvoiceBtn").show();
        } else {
            $("#invoiceForm").hide();
            $("#cancelInvoiceBtn").show();
        }        
    } else {
        $("#invoiceForm").hide();
        $("#cancelInvoiceBtn").hide();
    }
});

$(document).on("click", "#cancelInvoiceBtn", function (e) {
    e.preventDefault();
    var invoiceId = $("#cancelInvoiceBtn").attr("name");
    var motive = $("#motiveCancel").val();
    console.log(motive);
    var params = {};
    if (motive == "01") {
        var typeId = $("#cancelInvoiceBtn").attr("data-type");
        var clientId = $("#clients").val();
        if (clientId == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un cliente"); return;}
        var productId = $("#products").val();
        if (productId == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un producto"); return;}
        var paymentForm = $("#paymentForm").val();
        if (paymentForm == "0") { notify("growl-danger", "Datos incompletos", "Selecciona una forma de pago"); return;}
        var paymentMethod = $("#paymentMethod").val();
        if (paymentMethod == "0") { notify("growl-danger", "Datos incompletos", "Selecciona un método de pago"); return;}
        var dateVal = $("#newInvoiceDate").val();
        var dateInvoice = new Date();
        dateInvoice = changeTimeZone(dateInvoice, 'America/Mexico_City');
        dateInvoice.setDate( dateInvoice.getDate() - parseInt(dateVal) );
        var dateUtc = Date.UTC(dateInvoice.getFullYear(), dateInvoice.getMonth(), dateInvoice.getDate(), dateInvoice.getHours(), dateInvoice.getMinutes(), dateInvoice.getSeconds());
        var dateIso = new Date(dateUtc).toISOString();
        dateUtc = dateUtc/1000;
        var bankAccount = $("#bankAcount").val();
        if (bankAccount == "0") { notify("growl-danger", "Datos incompletos", "Selecciona una cuenta de banco"); return;}
        var orderNumber = $("#orderNumber").val();
        var percent = parseFloat($("#newInvoicePercent").val());
        if (percent == 0) { notify("growl-danger", "Datos incompletos", "El porcentaje no es valido"); return;}
        var amountInvoice = $('#newInvoiceAmount').val().replace(/,/g, '');
        if (amountInvoice.substring(0,1) == '$') { amountInvoice = amountInvoice.substring(1); }
        amountInvoice = parseFloat(amountInvoice).toFixed(2);
        var taxInvoice = $('#newInvoiceTax').val().replace(/,/g, '');
        if (taxInvoice.substring(0,1) == '$') { taxInvoice = taxInvoice.substring(1); }
        taxInvoice = parseFloat(taxInvoice).toFixed(2);
        var totalInvoice = $('#newInvoiceTotal').val().replace(/,/g, '');
        if (totalInvoice.substring(0,1) == '$') { totalInvoice = totalInvoice.substring(1); }
        totalInvoice = parseFloat(totalInvoice).toFixed(2);
        params = {type:"cancelInvoiceReplacement", invoiceId: invoiceId, motive: motive, saleId: saleId, typeId: typeId, clientId: clientId, productId: productId, paymentForm: paymentForm, paymentMethod: paymentMethod, dateUtc: dateUtc, dateIso: dateIso, bankAccount: bankAccount, orderNumber: orderNumber, percent: percent, amountInvoice: amountInvoice, taxInvoice: taxInvoice, totalInvoice: totalInvoice};
    } else {
        params = {type:"cancelInvoice", invoiceId: invoiceId, motive: motive};
    }
    console.log(params);
    $.ajax({
        type: "GET",
        data: params,
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Cancelada", response.message);
                    $("#openInvoicesModal").click();
                    getInvoices(saleId);
                } else {
                    notify("growl-danger", "No cancelada", response.message);
                }
            }
        }
    });
});

function facTest() {
    $.ajax({
        type: "GET",
        data: {type:"getFacturamaData"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                response.products.forEach(element => {
                    $("#products").append(`<option value="${element.Id}">${element.Name}</option>`);
                });
                if (response.products.length == 1) {
                    $('#products').select2('data', {id: response.products[0].Id, text: response.products[0].Name});
                } else {
                    $('#products').select2('data', {id: "0", text: "Selecciona"});
                }
                response.clients.forEach(element => {
                    $("#clients").append(`<option value="${element.Id}">${element.Alias}</option>`);
                });
                response.paymentForms.forEach(element => {
                    $("#paymentForm").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                response.paymentMethods.forEach(element => {
                    $("#paymentMethod").append(`<option value="${element.Value}">${element.Name}</option>`);
                });
                response.bankAcounts.forEach(element => {
                    $("#bankAcount").append(`<option value="${element.IdTaxEntityBankAccounts}">${element.AccountNumber + " " + element.Name}</option>`);
                });
                if (response.bankAcounts.length == 1) {
                    $('#bankAcount').select2('data', {id: response.bankAcounts[0].IdTaxEntityBankAccounts, text: response.bankAcounts[0].AccountNumber + " " + response.bankAcounts[0].Name});
                } else {
                    $('#bankAcount').select2('data', {id: "0", text: "Selecciona"});
                }
            }
        }
    });
}

$(document).on("change", "#paymentForm", function (e) {
    e.preventDefault();
    var paymentForm = $(this).val();
    if (paymentForm == "99") {
        $('#paymentMethod').select2('data', {id: "PPD", text: "Pago en parcialidades ó diferido"});
    } else {
        $('#paymentMethod').select2('data', {id: "PUE", text: "Pago en una sola exhibición"});
    }
});

$(document).on("click", "#managementClients", function (e) {
    e.preventDefault();
    getClients();
    $("#openFacturamaClientsModal").click();
});

function getClients() {
    $("#clientData").hide();
    $("#clientForm").hide();
    $("#loadingClients").show();
    $.ajax({
        type: "GET",
        data: {type:"getClientList"},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                // $("#clientList").empty();
                $('#clientTable').dataTable().fnClearTable();
                response.forEach(element => {
                    // $("#clientList").append(`<tr>
                    //     <td>${element.name}</td>
                    //     <td>${element.alias}</td>
                    //     <td>${element.rfc}</td>
                    //     <td>${element.email}</td>
                    //     <td>${element.street}, ${element.extNumber}, ${element.intNumber}, ${element.postalCode}, ${element.neighborhood}, ${element.locality}, ${element.municipality}, ${element.state}, ${element.country}</td>
                    //     <td>
                    //         <button type="button" class="btn btn-sm btn-normal editClient" style="display: inline-block;" name="${element.id}">
                    //             <i class="glyphicon glyphicon-pencil" style="color:#ffffff;position: relative;"></i>
                    //         </button>
                    //         <button type="button" class="btn btn-sm btn-cancel deleteClient" style="display: inline-block;" name="${element.id}">
                    //             <i class="glyphicon glyphicon-trash" style="color:#ffffff;position: relative;"></i>
                    //         </button>
                    //     </td>
                    // </tr>`);
                    $('#clientTable').DataTable().search("");
                    $('#clientTable').dataTable().fnAddData([
                        element.name,
                        element.alias,
                        element.rfc,
                        element.email,
                        `${element.street}, ${element.extNumber}, ${element.intNumber}, ${element.postalCode}, ${element.neighborhood}, ${element.locality}, ${element.municipality}, ${element.state}, ${element.country}`,
                        `<button type="button" class="btn btn-sm btn-normal editClient" style="display: inline-block;" name="${element.id}">
                            <i class="glyphicon glyphicon-pencil" style="color:#ffffff;position: relative;"></i>
                        </button>
                        <button type="button" class="btn btn-sm btn-cancel deleteClient" style="display: inline-block;" name="${element.id}">
                            <i class="glyphicon glyphicon-trash" style="color:#ffffff;position: relative;"></i>
                        </button>`
                    ]);
                });
                $("#loadingClients").hide();
                $("#clientData").show();
            }
        }
    });
}

$(document).on("keyup", "#nameClient", function(e) {
    e.preventDefault();
    var name = $(this).val();
    name = name.toUpperCase();
    $("#nameClient").val(name);
});

$(document).on("click", ".editClient", function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    $("#clientData").hide();
    $("#clientForm").hide();
    $("#loadingClients").show();
    $.ajax({
        type: "GET",
        data: {type:"getClient", id: id},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                $("#nameClient").val(response.name);
                $("#aliasClient").val(response.alias);
                $("#rfcClient").val(response.rfc);
                $("#emailClient").val(response.email);
                $("#accountField").hide();
                $("#streetClient").val(response.street);
                $("#numExtClient").val(response.extNumber);
                $("#numIntClient").val(response.intNumber);
                $("#postalCodeClient").val(response.postalCode);
                $("#neighborhoodClient").val(response.neighborhood);
                $("#localityClient").val(response.locality);
                $("#municipalityClient").val(response.municipality);
                $("#stateClient").val(response.state);
                $("#countryClient").val(response.country);
                $("#saveClient").attr("name", response.id);
                $("#cfdiUseClient").empty();
                $("#cfdiUseClient").append(`<option value="0">Selecciona</option>`);
                cfdiUses.forEach(element => {
                    $("#cfdiUseClient").append(`<option value="${element.Value}">${element.Name}</option>`);
                    if (element.Value == response.cfdiUse) {
                        $('#cfdiUseClient').select2('data', {id: element.Value, text: element.Name});
                    } 
                });
                $("#fiscalRegimenClient").empty();
                $("#fiscalRegimenClient").append(`<option value="0">Selecciona</option>`);
                fiscalRegimens.forEach(element => {
                    $("#fiscalRegimenClient").append(`<option value="${element.Value}">${element.Name}</option>`);
                    if (element.Value == response.fiscalRegimen) {
                        $('#fiscalRegimenClient').select2('data', {id: element.Value, text: element.Name});
                    } 
                });
                if (response.fiscalRegimen == '') {
                    $('#fiscalRegimenClient').select2('data', {id: "0", text: "Selecciona"});
                }
                $("#loadingClients").hide();
                $("#clientForm").show();
            }
        }
    });
});

$(document).on("click", "#registerClient", function (e) {
    e.preventDefault();
    $("#clientData").hide();
    $("#clientForm").show();
    $("#nameClient").val("");
    $("#aliasClient").val("");
    $("#rfcClient").val("");
    $("#emailClient").val("");
    $("#accountField").show();
    $('#accountClient').select2('data', {id: "3", text: "Ambos"});
    $("#streetClient").val("");
    $("#numExtClient").val("");
    $("#numIntClient").val("");
    $("#postalCodeClient").val("");
    $("#neighborhoodClient").val("");
    $("#localityClient").val("");
    $("#municipalityClient").val("");
    $("#stateClient").val("");
    $("#countryClient").val("MEXICO");
    $("#saveClient").attr("name", 0);
    $("#cfdiUseClient").empty();
    $("#cfdiUseClient").append(`<option value="0">Selecciona</option>`);
    cfdiUses.forEach(element => {
        $("#cfdiUseClient").append(`<option value="${element.Value}">${element.Name}</option>`);
    });
    $('#cfdiUseClient').select2('data', {id: "0", text: "Selecciona"});
    $("#fiscalRegimenClient").empty();
    $("#fiscalRegimenClient").append(`<option value="0">Selecciona</option>`);
    fiscalRegimens.forEach(element => {
        $("#fiscalRegimenClient").append(`<option value="${element.Value}">${element.Name}</option>`);
    });
    $('#fiscalRegimenClient').select2('data', {id: "0", text: "Selecciona"});
});

$(document).on("click", "#cancelClient", function (e) {
    e.preventDefault();
    $("#clientData").show();
    $("#clientForm").hide();
});

$(document).on("click", "#saveClient", function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    var name = $("#nameClient").val();
    if (name == "") {
        notify("growl-danger", "Datos incompletos", "Ingresa un nombre valido");
        return 0;
    }
    var alias = $("#aliasClient").val();
    if (alias == "") {
        notify("growl-danger", "Datos incompletos", "Ingresa un alias valido");
        return 0;
    }
    var rfc = $("#rfcClient").val();
    if (rfc == "") {
        notify("growl-danger", "Datos incompletos", "Ingresa un rfc valido");
        return 0;
    }
    var cfdiUse = $("#cfdiUseClient").val();
    if (cfdiUse == "0") {
        notify("growl-danger", "Datos incompletos", "Selecciona un uso de cfdi valido");
        return 0;
    }
    var fiscalRegimen = $("#fiscalRegimenClient").val();
    if (fiscalRegimen == "0") {
        notify("growl-danger", "Datos incompletos", "Selecciona un regimen fiscal valido");
        return 0;
    }
    var email = $("#emailClient").val();
    if (email == "") {
        notify("growl-danger", "Datos incompletos", "Ingresa un email valido");
        return 0;
    }
    var postalCode = $("#postalCodeClient").val();
    if (postalCode == "") {
        notify("growl-danger", "Datos incompletos", "Ingresa un codigo postal valido");
        return 0;
    }
    var account = $("#accountClient").val();
    var street = $("#streetClient").val();
    if (street == "") street = null;
    var extNumber = $("#numExtClient").val();
    if (extNumber == "") extNumber = null;
    var intNumber = $("#numIntClient").val();
    if (intNumber == "") intNumber = null;
    var neighborhood = $("#neighborhoodClient").val();
    if (neighborhood == "") neighborhood = null;
    var locality = $("#localityClient").val();
    if (locality == "") locality = null;
    var municipality = $("#municipalityClient").val();
    if (municipality == "") municipality = null;
    var state = $("#stateClient").val();
    if (state == "") state = null;
    var country = $("#countryClient").val();
    if (country == "") country = null;
    var type = "addClient";
    if (id != "0") {
        type = "updateClient";
    }
    $.ajax({
        type: "GET",
        data: {type: type, id: id, name: name, alias: alias, rfc: rfc, cfdiUse: cfdiUse, fiscalRegimen: fiscalRegimen, email: email, account: account, street: street, extNumber: extNumber, intNumber: intNumber, postalCode: postalCode, neighborhood: neighborhood, locality: locality, municipality: municipality, state: state, country: country},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Guardado correcto", response.message);
                    getClients();
                } else {
                    console.log(response);
                    notify("growl-danger", "Error al guardar", response.message);
                }
            }
        }
    });
});

$(document).on("click", ".deleteClient", function (e) {
    e.preventDefault();
    var id = $(this).attr("name");
    if (confirm("Seguro que deseas eliminar el cliente? No se podra restaurar posteriormente.")) {
        // console.log(id);
        $.ajax({
            type: "GET",
            data: {type: "deleteClient", id: id},
            url: "./php/saleManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response.status) {
                        notify("growl-success", "Eliminado correcto", response.message);
                        getClients();
                    } else {
                        console.log(response);
                        notify("growl-danger", "Error al eliminar", response.message);
                    }
                }
            }
        });
    }
});

$(document).on("click", ".downloadInvoice", function (e) {
    e.preventDefault();
    var idFacturama = $(this).attr("name");
    if (idFacturama == "") {
        notify("growl-danger", "Error al descargar", "No cuenta con el dato necesario para descargar");
        return;
    }
    var folio = $(this).html();
    var typeId = $("#newInvoiceBtn").attr("data-type");
    var data = "";
    // console.log(idFacturama, folio, typeId);
    $.ajax({
        type: "GET",
        data: {type: "downloadInvoice", idFacturama: idFacturama, company: typeId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    const downloadLink = document.createElement("a");
                    if (typeId == "1") {
                        folio = "TratoDirecto-Folio-"+folio;
                    } else {
                        folio = "Promoagil-Folio-"+folio;
                    }
                    downloadLink.download = folio;
                    $("#downloadBtn").attr("download", folio);
                    data = `data:application/${response.pdf.ContentType};base64,${response.pdf.Content}`;
                    downloadLink.href = data;
                    downloadLink.click();
                    data = `data:application/${response.xml.ContentType};base64,${response.xml.Content}`;
                    downloadLink.href = data;
                    downloadLink.click();
                } else {
                    notify("growl-danger", "Error al descargar", "Error al obtener los datos");
                }
            }
        }
    });
});

function createPaymentInvoice(invoiceId) {
    $.ajax({
        type: "GET",
        data: {type:"createPaymentInvoice", invoiceId: invoiceId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    if (response.adviser) {
                        notify("growl-success", "Pago creado", "Se ha creado el pago al asesor correctamente");
                    } else {
                        notify("growl-danger", "Pago no creado", "Error al crear el pago al asesor");
                    }
                    if (response.supervisor) {
                        notify("growl-success", "Pago creado", "Se ha creado el pago al supervisor correctamente");
                    } else {
                        notify("growl-danger", "Pago no creado", "Error al crear el pago al supervisor");
                    }
                    if (response.hasOwnProperty('seller')) {
                        if (response.seller) {
                            notify("growl-success", "Pago creado", "Se ha creado el pago al vendedor correctamente");
                        } else {
                            notify("growl-danger", "Pago no creado", "Error al crear el pago al vendedor");
                        }
                    }
                    showPayments();
                } else {
                    notify("growl-danger", "Error", "Error al crear los pagos");
                }
            }
        }
    });
}

function showPayments() {
    $.ajax({
        type: "GET",
        data: {type:"getPaymentsData", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (!response.adviserAmount && !response.supervisorAmount && !response.sellerAmount) {
                    $("#sellerContainer").show();
                    $("#sellers").select2('data', {id: "0", text: "Selecciona"});
                    $("#adviserContainer").show();
                    $("#advisers").select2('data', {id: "0", text: "Selecciona"});
                    $("#supervisorContainer").show();
                    $("#supervisors").select2('data', {id: "0", text: "Selecciona"});

                    $("#adviserName").html(response.adviserName);
                    $("#paymentDetailAdviser").hide();
                    $("#supervisorName").html(response.supervisorName);
                    $("#paymentDetailSupervisor").hide();
                    $("#adviserPaName").html(response.sellerName);
                    $("#paymentDetailSeller").hide();
                } else {
                    $("#sellerContainer").hide();
                    $("#adviserContainer").hide();
                    $("#supervisorContainer").hide();

                    $("#adviserName").html(response.adviserName);
                    $("#amountTD").html(formatoMoneda(response.adviserAmount+""));
                    $("#paymentDetailAdviser").show();
                    
                    $("#supervisorName").html(response.supervisorName);
                    $("#amountSupTD").html(formatoMoneda(response.supervisorAmount+""));
                    $("#paymentDetailSupervisor").show();

                    $("#adviserPaName").html(response.sellerName);
                    $("#amountAdviserPA").html(formatoMoneda(response.sellerAmount+""));
                    $("#paymentDetailSeller").show();
                }
            }
        }
    });
}

$(document).on("click", ".detailPayments", function (e) {
    e.preventDefault();
    var paymentType = $(this).attr("data-type");
    if (paymentType == 1) {
        $("#titlePayment").html("Pagos al asesor");
    } else if(paymentType == 2){
        $("#titlePayment").html("Pagos al supervisor");
    } else {
        $("#titlePayment").html("Pagos al vendedor");
    }
    $("#paymentList").empty();
    $("#loadingPayments").show();
    $("#paymentsTable").hide();
    $("#openPaymentModal").click();
    $.ajax({
        type: "GET",
        data: {type:"getPaymentsDetails", saleId: saleId, paymentType: paymentType},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                response.forEach(element => {
                    if (element.datePaid == null || element.datePaid == '') {
                        paidAt = today;
                    } else {
                        paidAt = element.datePaid;
                    }
                    var options = `<select class="selectPayment" style="width: 160px" name=${element.id}`;
                    var datePick = `<input type="text" class="inputData datepicker datePayment" value="${paidAt}" style="width: 160px" name="${element.id}" id="datePayment-${element.id}"`;
                    var amount = `<input type="text" class="inputData width50p amountPayment" value="${formatoMoneda(element.amount)}" style="width: 100px" name="${element.id}" id="amountPayment-${element.id}"`;
                    if (element.flagId == "48" || element.flagId == "47") {
                        options += ` disabled`;
                        datePick += ` disabled`;
                        amount += ` disabled`;
                    }
                    options += `>`;
                    datePick += `>`;
                    amount += `><button type="button" class="btn btn-sm btn-go updateAmountPayment" name="${element.id}" style="display: none;" id="updateAmountPayment-${element.id}"><i class="glyphicon glyphicon-ok" style="color:#ffffff;position: relative;"></i></button>`;
                    paymentFlags.forEach(paymentFlag => {
                        if (paymentFlag.id == element.flagId) {
                            options += `<option value="${paymentFlag.id}" selected>${paymentFlag.label}</option>`;
                        } else {
                            options += `<option value="${paymentFlag.id}">${paymentFlag.label}</option>`;
                        }
                    });
                    options += `</select>`;
                    $("#paymentList").append(`<tr>
                        <td>${element.name}</td>
                        <td>${amount}</td>
                        <td>${datePick}</td>
                        <td>${options}</td>
                        <td>${element.invoiceType} Folio: ${element.folio}</td>
                    </tr>`);
                });
                $('.datepicker').datepicker({ dateFormat: 'dd/mm/yy' });
                $("#loadingPayments").hide();
                $("#paymentsTable").show();
            }
        }
    });
});

$(document).on("change", ".selectPayment", function (e) {
    e.preventDefault();
    var paymentId = $(this).attr("name");
    var flagId = $(this).val();
    var date = 0;
    // console.log(paymentId, flagId);
    if (flagId != "0") {
        if (flagId == "47") {
            date = $("#datePayment-"+paymentId).val();
            date = date.split("/");
            date = Date.UTC(date[2], date[1]-1, date[0], 12, 0, 0)/1000;
            // console.log(date);
        }
        $.ajax({
            type: "GET",
            data: {type:"updatePaymentFlag", paymentId: paymentId, flagId: flagId, date: date},
            url: "./php/saleManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    if (response) {
                        notify("growl-success", "Actualizado", "Se ha actualizado el pago");
                        $("#openPaymentModal").click();
                        showPayments();
                    } else {
                        notify("growl-danger", "Error al actualizar", "No se ha logrado actualizar el pago, intentalo mas tarde");
                    }
                }
            }
        });
    }
});

$(document).on("change", ".amountPayment", function (e) {
    e.preventDefault();
    var paymentId = $(this).attr("name");
    var amount = $(this).val().replace(/,/g, '');
    if (amount != '') {
        if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
        $("#amountPayment-"+paymentId).val(formatoMoneda(amount));
        $("#updateAmountPayment-"+paymentId).show();
    } else {
        $("#updateAmountPayment-"+paymentId).hide();
    }
});

$(document).on("click", ".updateAmountPayment", function (e) {
    e.preventDefault();
    var paymentId = $(this).attr("name");
    var amount = $("#amountPayment-"+paymentId).val().replace(/,/g, '');
    if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
    // console.log(paymentId, amount);
    $.ajax({
        type: "GET",
        data: {type:"updatePaymentAmount", amount: amount, paymentId: paymentId, saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response.status) {
                    notify("growl-success", "Actualizado", response.message + " Pago ");
                    $("#openPaymentModal").click();
                    showPayments();
                } else {
                    notify("growl-danger", "Error al actualizar", response.message);
                }
            }
        }
    });
});

$(document).on("click", "#showComments", function (e) {
    e.preventDefault();
    $("#loadingComments").show();
    $("#commentDiv").hide();
    $("#openCommentsModal").click();
    $("#commentsContainer").empty();
    $("#imageUploadContainer").hide();
    $.ajax({
        type: "GET",
        data: {type:"getComments", saleId: saleId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.length > 0) {
                    response.forEach(element => {
                        var comment = element.comment;
                        if (element.comment.indexOf("storage.googleapis")>-1) {
                            const reg_exImg = /.*(png|jpg|jpeg|gif)/g;
                            comment = '<a style="cursor:pointer" target="_blank" href="' + element.comment + '">';
                            if (element.comment.match(reg_exImg)) {
                                comment += '<img src="' + element.comment + '" class="comment-image">';
                            } else {
                                comment += element.comment.split("https://storage.googleapis.com/tratodirecto.com/")[1];
                            }
                            comment += '</a>';
                        }
                        $("#commentsContainer").append(
                            `<div class="comment" id="comment-${element.id}" data-utc="0">
                                <div>
                                    <span style="color:#428BCA">Sistema</span>
                                    <span style="float:right;font-size:11px">${element.date}</span>
                                </div>
                                ${comment}
                            </div>`
                        );
                    });
                    setTimeout(() => {
                        $('#commentsContainer').scrollTop( $('#commentsContainer').prop('scrollHeight') ); 
                    }, 1000);
                } else {
                    $("#commentsContainer").append(
                        `<div class="comment" id="comment-0" data-utc="0">
                            <div>
                                <span style="color:#428BCA">Sistema</span>
                                <span style="float:right;font-size:11px">Hoy</span>
                            </div>Aun no hay comentarios en esta venta
                        </div>`
                    );
                }
                $("#loadingComments").hide();
                $("#commentDiv").show();
            }
        }
    });
    // if (true) {
    //     $("#loadingComments").hide();
    //     $("#commentDiv").show();
    // }
});

var messageInput = document.getElementById('newComment');
messageInput.addEventListener('keypress', (e) => {
    if (((e.keyCode == 13) || (event.code === 'Enter') || (e.which === 13)) && (!(e.shiftKey))) {
        e.preventDefault();
        $("#addComment").click();
    }
});

$(document).on("click", "#addComment", function (e) {
    e.preventDefault();
    var comment = $("#newComment").val();
    if (comment == "") {
        notify("growl-danger", "Comentario invalido", "El comentario que ingresaste no es valido");
        return;
    }
    // console.log(comment);
    $("#commentLoader").show();
    $.ajax({
        type: "GET",
        data: {type:"addComment", saleId: saleId, comment: comment},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    $("#lastComment").html(comment);
                    $("#openCommentsModal").click();
                    $("#commentLoader").hide();
                    notify("growl-success", "Comentario agregado", "El comentario se ha agregado correctamente");
                } else {
                    notify("growl-danger", "Error al agregar el comentario", "No se pudo agregar el comentario, intentalo mas tarde");
                }
            }
        }
    });
});

$("#newComment").bind("paste", function(e){
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

var dropzone = document.getElementById('newComment'); 
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

$(document).on("click", "#sendImage", function (e) {
    e.preventDefault();
    var fileData = $('#image2Send').attr('data-filesource');
    var fileName = $('#image2Send').attr('data-filename');
    var fileType = $('#image2Send').attr('data-filetype');
    var today=new Date();
    today=Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(),today.getHours(),today.getMinutes(),today.getSeconds() )/1000;
    fileName = today+"-"+fileName;
    // console.log(fileData, fileName, fileType);
    $.ajax({
        type: "POST",
        data: {type:"addFileComment", saleId: saleId, fileData: fileData, fileName: fileName, fileType: fileType},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    $("#lastComment").html(fileName);
                    $("#openCommentsModal").click();
                    $("#imageUploadContainer").hide();
                    $("#commentLoader").hide();
                    notify("growl-success", "Comentario agregado", "El comentario se ha agregado correctamente");
                } else {
                    notify("growl-danger", "Error al agregar el comentario", "No se pudo agregar el comentario, intentalo mas tarde");
                }
            }
        }
    });
});

function getStageByInvoice(paid) {
    var flagId = 45;
    if (paid) {
        flagId = 46;
    }
    $.ajax({
        type: "GET",
        data: {type:"getStageByInvoice", saleId:saleId, flagId:flagId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    $("#appointmentStage option").each(function () { $(this).attr("disabled", false); });
                    $('#appointmentStage').select2('data', {id: response.newStageId, text: response.newStageName});
                    $('#appointmentStage').change();
                } else {
                    notify("growl-danger", "Sin cambios", "No se nesecito actualizar los Estado del Negocio");
                }
            }
        }
    });
}

function disableStages(stage) {
    $("#appointmentStage").attr("disabled", false);
    $("#appointmentStage option").each(function () { $(this).attr("disabled", true); });
    switch (stage) {
        case "18":
        case "30":
            $("#appointmentStage").attr("disabled", true);
            break;
        case "17":
        case "29":
            $("#appointmentStage option[value=24]").attr("disabled", false);
            break;
        default:
            $("#appointmentStage option[value=13]").attr("disabled", false);
            $("#appointmentStage option[value=14]").attr("disabled", false);
            $("#appointmentStage option[value=22]").attr("disabled", false);
            $("#appointmentStage option[value=24]").attr("disabled", false);
            break;
    }
    
}

function changeTimeZone(date, timeZone) {
    if (typeof date === 'string') {
      return new Date(
        new Date(date).toLocaleString('en-US', {
          timeZone,
        }),
      );
    }
  
    return new Date(
      date.toLocaleString('en-US', {
        timeZone,
      }),
    );
}

$(document).on("change", ".collaboratorSelect", function (e) {
    e.preventDefault();
    const role = $(this).attr('id');
    const collaboratorId = $(this).val();
    if (collaboratorId == 0) {
        $(`.updateCollaborator[name='${role}']`).hide();
    } else {
        $(`.updateCollaborator[name='${role}']`).show();
    }
});

$(document).on("click", ".updateCollaborator", function (e) {
    e.preventDefault();
    const role = $(this).attr("name");
    const collaboratorId = $(`#${role}`).val();
    if (collaboratorId == 0) {(`.updateCollaborator[name='${role}']`).hide();return;}
    $.ajax({
        type: "GET",
        data: {type:"updateCollaborator", saleId, role, collaboratorId},
        url: "./php/saleManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                if (response) {
                    $(`.updateCollaborator[name='${role}']`).hide();
                    notify("growl-success", "Actualizado", "Se actualizo el colaborador");
                    showPayments("");
                } else {
                    notify("growl-danger", "Sin cambios", "No se actualizo correctamente");
                }
            }
        }
    });
})

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

