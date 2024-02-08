$(document).ready(function () {
    // getData();
    // console.log("hola");
});

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

function updateTotal(){
    var total = 0;
    $(".subtotalField").each(function () {
        // console.log($(this).val());
        var amount = $(this).val().replace(/,/g, '');
        if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
        amount = parseFloat(amount).toFixed(2);
        total += parseFloat(amount);
    });
    // console.log(total);
    $("#totalInvoice").val(formatoMoneda(parseFloat(total).toFixed(2)+""));
    if (total == 0) {
        $("#createInvoice").attr("disabled", true);
    } else {
        $("#createInvoice").attr("disabled", false);
    }
}

$(document).on("change", "#type", function (e) {
    e.preventDefault();
    // console.log($(this).val());
    var typeId = $(this).val();
    if (typeId != 0) {
        $("#invoiceMaker").hide();
        $("#invoiceMakerLoader").show();
        $.ajax({
            type: "GET",
            data: {type:"getFacturamaData", typeId: typeId},
            url: "./php/multiInvoiceManagementData.php", 
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else {
                    // console.log(response);
                    $("#clients").empty();
                    $("#clients").append(`<option value="0">Selecciona</option>`);
                    response.clients.forEach(element => {
                        $("#clients").append(`<option value="${element.Id}">${element.Alias}</option>`);
                    });
                    $("#clients").select2('data', {id: "0", text: "Selecciona"});
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
                    $("#orderNumber").val("");
                    $("#hotleadId").val("");
                    $("#totalInvoice").val(formatoMoneda("0"));
                    $("#saleList").empty();
                    $("#invoiceMakerLoader").hide();
                    $("#createInvoice").attr("disabled", true);
                    $("#invoiceMaker").show();
                    // console.log(response);
                }
            }
        });
    } else {
        $("#invoiceMaker").hide();
    }
});

$(document).on("change", "#paymentForm", function (e) {
    e.preventDefault();
    var paymentForm = $(this).val();
    if (paymentForm == "99") {
        $('#paymentMethod').select2('data', {id: "PPD", text: "Pago en parcialidades ó diferido"});
    } else {
        $('#paymentMethod').select2('data', {id: "PUE", text: "Pago en una sola exhibición"});
    }
});

$(document).on("click", "#findSale", function (e) {
    e.preventDefault();
    var hotleadId = $("#hotleadId").val();
    // var typeId = $("#type").val();
    $.ajax({
        type: "GET",
        data: {type:"findSale", hotleadId: hotleadId},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                if (response.length > 0) {
                    $("#resultSearch").empty();
                    response.forEach(element => {
                        $("#resultSearch").append(
                            `<div class="col-md-6 saleOption" name="${element.id}">
                                <div style="background-color: #eae9e9;padding: 8px 12px">
                                    <label style="font-weight: bold;">${element.accreditedName}</label><br>
                                    ${element.hubspotId}-${element.hotleadId} <br>
                                    Monto base: ${formatoMoneda(element.price)}<br>
                                    ${element.modelName}, ${element.developmentName} <br>
                                </div>
                            </div>`
                        );
                    });
                    $("#openSearchResultModal").click();
                } else {
                    notify("growl-danger", "Sin coincidencias", "No se encontraron ventas con el id de cita "+hotleadId);
                }
            }
        }
    });
});

$(document).on("click", ".saleOption", function (e) {
    e.preventDefault();
    var saleId = $(this).attr("name");
    var typeId = $("#type").val();
    if ($('#sale-'+saleId).length > 0) {
        notify("growl-danger", "Venta existente", "La venta ya se encuentra en la lista");
        return;
    }
    $.ajax({
        type: "GET",
        data: {type:"getSaleData", saleId: saleId, typeId: typeId},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                // console.log(response);
                if (parseFloat(response.fee) == 0 || parseFloat(response.percent) == 100) {
                    notify("growl-danger", "Venta no valida", "No se puede agregar la venta con comision $0.00 o facturado al 100%");
                    return 0;
                }
                var maxPercent = (100 - parseFloat(response.percent)).toFixed(2);
                var maxAmount = ((maxPercent * parseFloat(response.fee))/ 100).toFixed(2);
                var taxes = (maxAmount * 0.16).toFixed(2);
                var subtotal = (parseFloat(maxAmount) + parseFloat(taxes)).toFixed(2);
                $("#saleList").append(`<tr id="sale-${response.id}">
                    <td>
                        <label id="">${response.hubspotId}-${response.hotleadId}</label>
                    </td>
                    <td>
                        <input type="text" class="inputData" id="commission-${response.id}" value="${formatoMoneda(response.fee)}" disabled>
                    </td>
                    <td>
                        <input type="number" class="inputData percentField" id="percent-${response.id}" value="${maxPercent}" min="0" max="${maxPercent}">
                    </td>
                    <td>
                        <input type="text" class="inputData amountField" id="amount-${response.id}" data-max=${maxPercent} value="${formatoMoneda(maxAmount+"")}">
                    </td>
                    <td>
                        <input type="text" class="inputData" id="tax-${response.id}" value="${formatoMoneda(taxes+"")}" disabled>
                    </td>
                    <td>
                        <input type="text" class="inputData subtotalField" id="subtotal-${response.id}" value="${formatoMoneda(subtotal+"")}" disabled>
                    </td>
                    <td>
                        <button type="button" class="btn btn-sm btn-cancel removeSale" name="${response.id}">
                            <i class="glyphicon glyphicon-minus" style="color:#ffffff;position: relative;"></i>
                        </button>
                    </td>
                </tr>`);
                $("#openSearchResultModal").click();
                $("#createInvoice").attr("disabled", false);
                $("#hotleadId").val("");
                updateTotal();
            }
        }
    });
});

$(document).on("change", ".percentField", function (e) {
    e.preventDefault();
    var percent = parseFloat($(this).val());
    var maxPercent = parseFloat($(this).attr("max"));
    var nameField = $(this).attr("id");
    var saleId = nameField.split("-")[1];
    // console.log(percent, maxPercent, nameField, saleId);
    if (percent > maxPercent || percent <= 0) {
        $("#createInvoice").attr("disabled", true);
        notify("growl-danger", "Porcentaje no valido", "El porcentaje debe ser menor a "+maxPercent+" y mayor que 0");
        $("#"+nameField).addClass("invalidData");
        $("#amount-"+saleId).addClass("invalidData");
    } else {
        var commission = $('#commission-'+saleId).val().replace(/,/g, '');
        if (commission.substring(0,1) == '$') { commission = commission.substring(1); }
        commission = parseFloat(commission).toFixed(2);
        var amount = (percent * commission / 100).toFixed(2);
        var tax = (amount * 0.16).toFixed(2);
        var subtotal = (parseFloat(amount)+parseFloat(tax)).toFixed(2);
        // console.log(commission, amount, tax, subtotal);
        $("#amount-"+saleId).val(formatoMoneda(amount+""));
        $("#tax-"+saleId).val(formatoMoneda(tax+""));
        $("#subtotal-"+saleId).val(formatoMoneda(subtotal+""));

        $("#"+nameField).removeClass("invalidData");
        $("#amount-"+saleId).removeClass("invalidData");
        $("#createInvoice").attr("disabled", false);
        updateTotal();
    }
});

$(document).on("change", ".amountField", function (e) {
    e.preventDefault();
    var amount = $(this).val().replace(/,/g, '');
    if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
    amount = parseFloat(amount).toFixed(2);
    var maxPercent = parseFloat($(this).attr("data-max"));
    var nameField = $(this).attr("id");
    var saleId = nameField.split("-")[1];
    var commission = $('#commission-'+saleId).val().replace(/,/g, '');
    if (commission.substring(0,1) == '$') { commission = commission.substring(1); }
    commission = parseFloat(commission).toFixed(2);
    var percent = ((amount / commission * 100)).toFixed(2);
    if (percent == 33.34 && maxPercent == 33.33) percent = 33.33;
    // console.log(commission, amount, maxPercent, percent, nameField, saleId);
    if (percent > maxPercent || percent <= 0) {
        $("#createInvoice").attr("disabled", true);
        notify("growl-danger", "Monto no valido", "El monto ingresado no es valido");
        $("#"+nameField).addClass("invalidData");
        $("#percent-"+saleId).addClass("invalidData");
    } else {
        var tax = (amount * 0.16).toFixed(2);
        var subtotal = (parseFloat(amount)+parseFloat(tax)).toFixed(2);
        // console.log(commission, amount, tax, subtotal);
        $("#percent-"+saleId).val(percent);
        $("#amount-"+saleId).val(formatoMoneda(amount+""));
        $("#tax-"+saleId).val(formatoMoneda(tax+""));
        $("#subtotal-"+saleId).val(formatoMoneda(subtotal+""));

        $("#"+nameField).removeClass("invalidData");
        $("#percent-"+saleId).removeClass("invalidData");
        $("#createInvoice").attr("disabled", false);
        updateTotal();
    }
});

$(document).on("click", ".removeSale", function (e) {
    e.preventDefault();
    var saleId = $(this).attr("name");
    $("#sale-"+saleId).remove();
    updateTotal();
});

$(document).on("click", "#createInvoice", function (e) {
    e.preventDefault();
    var sales = [];
    if ($(".invalidData").length) {
        notify("growl-danger", "Ventas con errores", "Hay ventas con datos no validos, corrigelos y vuelve a intentar");
        return;
    }
    if (!$("#saleList tr").length) {
        notify("growl-danger", "Sin ventas", "No se han registrado ventas para facturar");
        return;
    }
    var typeId = $("#type").val();
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
    var orderNumber = $("#orderNumber").val();
    $("#saleList tr").each( function () {
        // console.log($(this).attr("id"));
        var nameRow = $(this).attr("id");
        var saleId = nameRow.split("-")[1];
        var percent = $("#percent-"+saleId).val();
        var amount = $("#amount-"+saleId).val().replace(/,/g, '');
        if (amount.substring(0,1) == '$') { amount = amount.substring(1); }
        amount = parseFloat(amount).toFixed(2);
        var tax = $("#tax-"+saleId).val().replace(/,/g, '');
        if (tax.substring(0,1) == '$') { tax = tax.substring(1); }
        tax = parseFloat(tax).toFixed(2);
        var subtotal = $("#subtotal-"+saleId).val().replace(/,/g, '');
        if (subtotal.substring(0,1) == '$') { subtotal = subtotal.substring(1); }
        subtotal = parseFloat(subtotal).toFixed(2);
        // console.log(saleId, percent, amount, tax, subtotal);
        sales.push({
            "id": saleId,
            "percent": percent,
            "amount": amount,
            "tax": tax,
            "subtotal": subtotal
        });
    });
    // console.log(sales);
    var total = $("#totalInvoice").val().replace(/,/g, '');
    if (total.substring(0,1) == '$') { total = total.substring(1); }
    total = parseFloat(total).toFixed(2);
    // console.log(typeId, clientId, productId, paymentForm, paymentMethod, dateUtc, dateIso, orderNumber, sales, total);
    $("#invoiceMaker").hide();
    $("#invoiceMakerLoader").show();
    $.ajax({
        type: "GET",
        data: {type:"createMultiInvoice", typeId: typeId, clientId: clientId, productId: productId, paymentForm: paymentForm, paymentMethod: paymentMethod, dateUtc: dateUtc, dateIso: dateIso, orderNumber: orderNumber, sales: sales, total: total},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.status) {
                    notify("growl-success", "Factura agregada", response.message + " Se agregaron las facturas "+ response.idInvoice);
                    // notify("growl-success", "Factura agregada", "");
                    $("#invoiceMakerLoader").hide();
                    $("#type").select2('data', {id: "0", text: "Selecciona"});
                    $("#type").change();
                    if (confirm("La factura es remplazo de otra?")) {
                        replaceInvoice(response.fiscalFolio, typeId, clientId);
                    }
                    getDataToUpdateStage(sales);
                } else {
                    notify("growl-danger", "Error al agregar", response.message);
                    // notify("growl-danger", "Error al agregar", "");
                    $("#invoiceMakerLoader").hide();
                    $("#invoiceMaker").show();
                }
            }
        }
    });
});

function replaceInvoice(fiscalFolio, typeId, clientId) {
    $("#findInvoice").attr("data-client", clientId);
    $("#findInvoice").attr("data-type", typeId);
    $("#replaceData").attr("data-fiscal", fiscalFolio);
    $("#invoiceId").val("");
    $("#invoicesResult").hide();
    $("#openReplaceInvoceModal").click();
}

$(document).on("click", "#findInvoice", function (e) {
    e.preventDefault();
    $("#findLoader").show();
    $("#invoicesResult").empty();
    var typeId = $("#findInvoice").attr("data-type");
    var clientId = $("#findInvoice").attr("data-client");
    var folioInvoice = $("#invoiceFolio").val();
    $.ajax({
        type: "GET",
        data: {type:"findInvoice", typeId: typeId, clientId: clientId, folioInvoice: folioInvoice},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.length > 0 && response[0][0] != null) {
                    response.forEach(element => {
                        $("#invoicesResult").append(
                            `<div class="col-md-12" style="margin-top: 10px;">
                                <div style="background-color: #eae9e9;padding: 8px 12px">
                                        Folio: ${folioInvoice} Monto de la factura: ${formatoMoneda(element[1])} \t
                                        <button class="btn btn-danger cancelInvoice" style="height: 18px;line-height: normal;padding: 1px 10px;" name="${element[0]}">Cancelar</button>
                                </div>
                            </div>`
                        );
                    });
                    $("#findLoader").hide();
                    $("#invoicesResult").show();
                } else {
                    $("#findLoader").hide();
                    $("#invoicesResult").hide();
                    notify("growl-danger", "Sin resultados", "No se encontrado resultados");
                }
            }
        }
    });
});

$(document).on("click", "#cancelInvoice", function (e) {
    e.preventDefault();
    var invoiceId = $(this).attr("name");
    var fiscalFolio = $("#replaceData").attr("data-fiscal");
    $.ajax({
        type: "GET",
        data: {type:"replaceInvoice", invoiceId: invoiceId, fiscalFolio: fiscalFolio},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
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

function getDataToUpdateStage(salesData) {
    const closeReason = '';
    const negotationId = 0;
    $.ajax({
        type: "GET",
        data: {type:"getDataToUpdateStage", salesData: salesData},
        url: "./php/multiInvoiceManagementData.php", 
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                console.log(response);
                if (response.length > 0) {
                    response.forEach(element => {
                        $.ajax({
                            type: "POST",
                            data: {type:"updateStageHubSpot", leadId:element.hotleadId, appointmentId:element.appointmentId, dealId:element.dealId, stage:element.hubspotStageId,cancelReason:closeReason, negotationId:negotationId, hubSpotContactId:element.hubspotId},
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
                    });
                } else {
                    notify("growl-danger", "Sin cambios", "No se nesecito actualizar los Estado del Negocio");
                }
            }
        }
    });
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

// $(document).on("change", "#type", (e) => {
//     e.preventDefault();
//     console.log($(e.currentTarget).val());
// });