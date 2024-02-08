//v=1.0.0 11:57 17/November/2021
$(document).ready(function () {
    showRecords();

    $(window).resize(function() {
        panelAutoAdjust();
    });
});

$('#myModal2').on('shown.bs.modal', function () {
    $('#contacDataContainer').height($('.modal-content').height()-102+'px');
});
  
$('body').on('click', function (e) { 
    if (e.target.classList.contains('show-records-per-page-container')) {   
        if ($('.records-per-page').is(':visible')) {
            $('.records-per-page').hide();
        } else {
            $('.records-per-page').show();
        }
    } else {
        if ($('.records-per-page').is(':visible')) {   
            $('.records-per-page').hide();
        }
    }

    if ($('.conversion-status-filter-container').is(':visible') && (!e.target.classList.contains('search-icon')) && (!e.target.classList.contains('search-conversion-status-filter')) && (!e.target.classList.contains('conversion-status-checkbox')) && (!e.target.classList.contains('conversion-status-filter-container')) && (!e.target.classList.contains('conversion-status-checkbox-container')) && (!e.target.classList.contains('conversion-status-checkbox-label'))) {
        $('.conversion-status-filter-container').hide();
    }

    if (e.target.classList.contains('conversion-status-filter')) {
        if ($('.conversion-status-filter-container').is(':visible')) {
            $('.conversion-status-filter-container').hide();
        } else {
            $('.conversion-status-filter-container').show();
        }
    } 

    if ($('.contact-owner-filter-container').is(':visible') && (!e.target.classList.contains('search-icon')) && (!e.target.classList.contains('search-contact-owner-filter')) && (!e.target.classList.contains('contact-owner-checkbox')) && (!e.target.classList.contains('contact-owner-filter-container')) && (!e.target.classList.contains('contact-owner-checkbox-container')) && (!e.target.classList.contains('contact-owner-checkbox-label'))) {
        $('.contact-owner-filter-container').hide();
    }

    if (e.target.classList.contains('contact-owner-filter')) {
        if ($('.contact-owner-filter-container').is(':visible')) {
            $('.contact-owner-filter-container').hide();
        } else {
            $('.contact-owner-filter-container').show();
        }
    } 

    if ($('.state-filter-container').is(':visible') && (!e.target.classList.contains('search-icon')) && (!e.target.classList.contains('search-state-filter')) && (!e.target.classList.contains('state-checkbox')) && (!e.target.classList.contains('state-filter-container')) && (!e.target.classList.contains('state-checkbox-container')) && (!e.target.classList.contains('state-checkbox-label'))) {
        $('.state-filter-container').hide();
    }

    if (e.target.classList.contains('state-filter')) {
        if ($('.state-filter-container').is(':visible')) {  
            $('.state-filter-container').hide();
        } else {
            $('.state-filter-container').show();
        }
    } 

    if ($('.locality-filter-container').is(':visible') && (!e.target.classList.contains('search-icon')) && (!e.target.classList.contains('search-locality-filter')) && (!e.target.classList.contains('locality-checkbox')) && (!e.target.classList.contains('locality-filter-container')) && (!e.target.classList.contains('locality-checkbox-container')) && (!e.target.classList.contains('locality-checkbox-label'))) {
        $('.locality-filter-container').hide();
    }

    if (e.target.classList.contains('locality-filter')) {
        if ($('.locality-filter-container').is(':visible')) {
            $('.locality-filter-container').hide();
        } else {
            $('.locality-filter-container').show();
        }
    } 

    if ($('.other-options-filter-container').is(':visible') && (!e.target.classList.contains('search-icon')) && (!e.target.classList.contains('search-other-options-filter')) && (!e.target.classList.contains('other-options-checkbox')) && (!e.target.classList.contains('other-options-filter-container')) && (!e.target.classList.contains('other-options-checkbox-container')) && (!e.target.classList.contains('other-options-checkbox-label'))) {
        $('.other-options-filter-container').hide();
    }

    if (e.target.classList.contains('other-options-filter')) {
        if ($('.other-options-filter-container').is(':visible')) {
            $('.other-options-filter-container').hide();
        } else {
            $('.other-options-filter-container').show();
        }
    } 

});

function mainDataInitialization() {
    $.ajax({
        type: "POST",
        data: {type:"mainDataInitialization"},
        url: "./php/contactsData.php?var=mainDataInitialization",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            dataInitialization();
            $.each(response.instances, function(index, data) {
                $("#startConversationInstance").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });
            $.each(response.collaborators, function(index, data) {
                $(".contact-owner-filter-container").append('<div class="checkbox block contact-owner-checkbox-container" name="'+data.name+'"><label class="contact-owner-checkbox-label"><input type="checkbox" class="contact-owner-checkbox" data-value="'+data.id+'"> '+data.name+'</label></div>');
                $(".sync_owner").append("<option value='"+data.id+"'>"+data.name+"</option>");
                $("#startConversationAdviser").append("<option value='"+data.id+"'>"+data.name+"</option>");               
            });  
            $.each(response.conversionStatus, function(index, data) {
                $(".conversion-status-filter-container").append('<div class="checkbox block conversion-status-checkbox-container" name="'+data.name+'"><label class="conversion-status-checkbox-label"><input type="checkbox" class="conversion-status-checkbox" data-value="'+data.id+'"> '+data.name+'</label></div>');
                $(".sync_conversationStatus").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });         
            $.each(response.state, function(index, data) {
                $(".state-filter-container").append('<div class="checkbox block state-checkbox-container" name="'+data.name+'"><label class="state-checkbox-label"><input type="checkbox" class="state-checkbox" data-value="'+data.id+'"> '+data.name+'</label></div>');
                $(".sync_state").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });     
            $.each(response.locality, function(index, data) {
                $(".locality-filter-container").append('<div class="checkbox block locality-checkbox-container" name="'+data.name+'"><label class="locality-checkbox-label"><input type="checkbox" class="locality-checkbox" data-value="'+data.id+'"> '+data.name+'</label></div>');
                $(".sync_locality").append("<option value='"+data.id+"' data-stateid='"+data.stateId+"'>"+data.name+"</option>");
            });                                                                                        
        }
    });
}

function dataInitialization() {
    $.ajax({
        type: "POST",
        data: {type:"dataInitialization"},
        url: "./php/contactsData.php?var=dataInitialization",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            $.each(response.contactType, function(index, data) {
                $(".sync_contactType").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });  
            $.each(response.contactOrigin, function(index, data) {
                $(".sync_origin").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });                             
             $.each(response.maritalStatus, function(index, data) {
                $(".sync_maritalStatus").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });  
            $.each(response.product, function(index, data) {
                $(".sync_product").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });           
            $.each(response.productCoaccredited, function(index, data) {
                $(".sync_productCoaccredited").append("<option value='"+data.id+"'>"+data.name+"</option>");
            }); 
            $.each(response.socialCategory, function(index, data) {
                $(".sync_profile").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });      
            $.each(response.gender, function(index, data) {
                $(".sync_gender").append("<option value='"+data.id+"'>"+data.name+"</option>");
            }); 
            $.each(response.identificationType, function(index, data) {
                $(".sync_identificationType").append("<option value='"+data.id+"'>"+data.name+"</option>");
            });                                                                                                                                            
        }
    });
}

function panelAutoAdjust() {
    $('#contactsContainer').height(window.innerHeight-296+'px');
    $('#contacDataContainer').height($('.modal-content').height()-102+'px');
}

var qLimit = 25;
var qOffset = 0;
var getSize = 1;
var page = 1;
var size = 0;
var screenHeight = 0;
var filters = {};
var searchString = '';
var order = 'none';
var dataInitializationFlag = true;
var monthShortName = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
var monthName = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
var dateT = 0;
var dateY = 0;
function showRecords() {
    $('#affiliatesTable').addClass('loading');
    var today = new Date();
    dateT = prependZero(today.getDate())+'/'+prependZero(today.getMonth()+1)+'/'+today.getFullYear();
    var yesterday = new Date(Date.now() - 86400000);
    dateY = prependZero(yesterday.getDate())+'/'+prependZero(yesterday.getMonth()+1)+'/'+yesterday.getFullYear();    
    $.ajax({
        type: "POST",
        data: {type:"getContacts",qOffset:qOffset,qLimit:qLimit,filters:JSON.stringify(filters),searchString:searchString,order:order},
        url: "./php/contactsData.php?var=getContacts",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            }
            if (dataInitializationFlag) {
                mainDataInitialization();
                dataInitializationFlag = false;
            }
            $('.contacts-loader').remove(); 
            var string = '';
            var len = response.data.length;
            if (getSize == 1) {
                size = response.count[0];
                getSize = 0;
            }
            if (len == 0) {
                $("#affiliatesResult").html('<tr><td colspan="11" style="text-align:center">No se encontraron registros.</td></tr>');
                $('#contactsContainer').height('68px');
                $("#contactsResultSize").html('No se encontraron registros');
                $('#affiliatesTable').removeClass('loading');
                result = createPagination();   
            } else {
                $.each(response.data, function(index, contact) {
                    $waIconColor = contact[11] == 1 ? '#31b645' : '#b8bec5';
                    string += '<tr>'; 
                    string += '<td style="text-align:center;padding:2px;font-size:19px;"><a href="wainbox.php?contact='+btoa(contact[0])+'" target="_blank" title="Mensajes"><i class="fa fa-whatsapp" style="color:'+$waIconColor+'"></i></a></td>';
                    string += '<td class="show-contact-details" data-id="'+returnBlank(contact[0])+'" style="text-align:left;padding:6px;font-size:13px" data-toggle="modal" data-target="#myModal2"  title="Detalles">'+returnBlank(contact[2])+'</td>';                
                    string += '<td style="text-align:center;padding:6px;font-size:13px">'+returnBlank(contact[1])+'</td>';
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[3])+'</td>';
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[4])+'</td>';
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[5])+'</td>';     
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[6])+'</td>';    
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[7])+'</td>';  
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+returnBlank(contact[8])+'</td>';
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+getDateFormat(contact[9], 0)+'</td>';
                    string += '<td style="text-align:left;padding:6px;font-size:13px">'+getDateFormat(contact[10], 0)+'</td>';                                                                                                                
                    string += '</tr>';
                    if (index === (len - 1)) {
                        $("#affiliatesResult").html(string);
                        if ($(window).height()-296 < $("#affiliatesResult").height()) {
                            $('#contactsContainer').height(window.innerHeight-296+'px');
                        } else {
                            $('#contactsContainer').height($('#affiliatesTable').height()+10+'px');
                        }
                        if (size == 0) {
                            $("#contactsResultSize").html('No se encontraron registros');
                        } else if (size == 1) {
                            $("#contactsResultSize").html('Se encontró solo un resgistro.');
                        } else {
                            $("#contactsResultSize").html('Se encontraron '+numberWithCommas(size)+' registros.');
                        }  
                        $('#affiliatesResultPages').css("display", "block"); 
                        $('#affiliatesTable').removeClass('loading');
                        result = createPagination();               
                    }
                });
            }
        },
        error: function(response) {
            if (response.responseText.substring(0,15) == '<!DOCTYPE html>') {
                screenMsg('Ups!', 'Tu sesión expiró.', '4000', 'growl-danger');  
                window.location.replace("logout.php?var=timeout");
            } else {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
            }
        }
    });
}

$(document).on('change', '.conversion-status-checkbox', function(e) {
    var conversationStatus = [];
    var len = $('.conversion-status-checkbox').length;
    var flag = 0;
    $('.conversion-status-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            conversationStatus.push($(this).attr('data-value'));
            flag++;
        }
        if (index === (len - 1)) {
            if (flag == 0) {
                $('.conversion-status-filter').removeClass('contacts-filters-active');
                $('.remove-conversion-status-filter').hide();
            } else {
                $('.conversion-status-filter').addClass('contacts-filters-active');
                $('.remove-conversion-status-filter').show();
            }
            filters['conversationStatus'] = conversationStatus;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('change', '.contact-owner-checkbox', function(e) {
    var contactOwner = [];
    var len = $('.contact-owner-checkbox').length;
    var flag = 0;
    $('.contact-owner-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            contactOwner.push($(this).attr('data-value'));
            flag++;
        }
        if (index === (len - 1)) {
            if (flag == 0) {
                $('.contact-owner-filter').removeClass('contacts-filters-active');
                $('.remove-contact-owner-filter').hide();
            } else {
                $('.contact-owner-filter').addClass('contacts-filters-active');
                $('.remove-contact-owner-filter').show();
            }
            filters['contactOwner'] = contactOwner;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('change', '.state-checkbox', function(e) {
    var state = [];
    var len = $('.state-checkbox').length;
    var flag = 0;
    $('.state-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            state.push($(this).attr('data-value'));
            flag++;
        }
        if (index === (len - 1)) {
            if (flag == 0) {
                $('.state-filter').removeClass('contacts-filters-active');
                $('.remove-state-filter').hide();
            } else {
                $('.state-filter').addClass('contacts-filters-active');
                $('.remove-state-filter').show();
            }
            filters['state'] = state;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('change', '.locality-checkbox', function(e) {
    var locality = [];
    var len = $('.locality-checkbox').length;
    var flag = 0;
    $('.locality-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            locality.push($(this).attr('data-value'));
            flag++;
        }
        if (index === (len - 1)) {
            if (flag == 0) {
                $('.locality-filter').removeClass('contacts-filters-active');
                $('.remove-locality-filter').hide();
            } else {
                $('.locality-filter').addClass('contacts-filters-active');
                $('.remove-locality-filter').show();
            }
            filters['locality'] = locality;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('change', '.other-options-checkbox', function(e) {
    var otherOptions = [];
    var len = $('.other-options-checkbox').length;
    var flag = 0;
    $('.other-options-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            otherOptions.push($(this).attr('data-value'));
            flag++;
        }
        if (index === (len - 1)) {
            if (flag == 0) {
                $('.other-options-filter').removeClass('contacts-filters-active');
                $('.remove-other-options-filter').hide();
            } else {
                $('.other-options-filter').addClass('contacts-filters-active');
                $('.remove-other-options-filter').show();
            }
            filters['otherOptions'] = otherOptions;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('click', '.remove-conversion-status-filter', function(e) {
    var conversationStatus = [];
    var len = $('.conversion-status-checkbox').length;
    $('.conversion-status-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
        if (index === (len - 1)) {
            $('.conversion-status-filter').removeClass('contacts-filters-active');
            $('.remove-conversion-status-filter').hide();
            $('.search-conversion-status-filter').val('');
            filters['conversationStatus'] = conversationStatus;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('click', '.remove-contact-owner-filter', function(e) {
    var contactOwner = [];
    var len = $('.contact-owner-checkbox').length;
    $('.contact-owner-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
        if (index === (len - 1)) {
            $('.contact-owner-filter').removeClass('contacts-filters-active');
            $('.remove-contact-owner-filter').hide();
            $('.search-contact-owner-filter').val('');
            filters['contactOwner'] = contactOwner;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('click', '.remove-state-filter', function(e) {
    var state = [];
    var len = $('.state-checkbox').length;
    $('.state-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
        if (index === (len - 1)) {
            $('.state-filter').removeClass('contacts-filters-active');
            $('.remove-state-filter').hide();
            $('.search-state-filter').val('');
            filters['state'] = state;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('click', '.remove-locality-filter', function(e) {
    var locality = [];
    var len = $('.locality-checkbox').length;
    $('.locality-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
        if (index === (len - 1)) {
            $('.locality-filter').removeClass('contacts-filters-active');
            $('.remove-locality-filter').hide();
            $('.search-locality-filter').val('');
            filters['locality'] = locality;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$(document).on('click', '.remove-other-options-filter', function(e) {
    var otherOptions = [];
    var len = $('.other-options-checkbox').length;
    $('.other-options-checkbox').each(function(index) {
        if ($(this).is(':checked')) {
            $(this).removeAttr('checked');
        }
        if (index === (len - 1)) {
            $('.other-options-filter').removeClass('contacts-filters-active');
            $('.remove-other-options-filter').hide();
            $('.search-other-options-filter').val('');
            filters['otherOptions'] = otherOptions;
            qOffset = 0;
            getSize = 1;
            page = 1;
            showRecords();
        }
    });
});

$('.search-conversion-status-filter').on('input', function() {
    var txt = $(this).val();
    $('.conversion-status-checkbox-container').each(function(index) {
        if ($(this).attr('name').toLowerCase().indexOf(txt) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$('.search-contact-owner-filter').on('input', function() {
    var txt = $(this).val();
    $('.contact-owner-checkbox-container').each(function(index) {
        if ($(this).attr('name').toLowerCase().indexOf(txt) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$('.search-state-filter').on('input', function() {
    var txt = $(this).val();
    $('.state-checkbox-container').each(function(index) {
        if ($(this).attr('name').toLowerCase().indexOf(txt) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$('.search-locality-filter').on('input', function() {
    var txt = $(this).val();
    $('.locality-checkbox-container').each(function(index) {
        if ($(this).attr('name').toLowerCase().indexOf(txt) >= 0) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
});

$(document).on('click', '.search-icon-txt', function(e) {
    e.preventDefault();
    var string = $('#searchStringInput').val();
    searchString = string;
    qOffset = 0;
    getSize = 1;
    page = 1;
    showRecords();
});

$(document).on('click', '.sort-arrow', function(e) {
    e.preventDefault();
    order = $(this).attr('data-field');
    qOffset = 0;
    getSize = 1;
    page = 1;
    showRecords();
});

$(document).on('click', '.records-per-page-container', function(e) {
    e.preventDefault(); 
    $('.show-records-per-page-container').html($(this).html());
    if ($(this).attr('data-size') != qLimit) {
        qLimit = parseInt($(this).attr('data-size'));
        //qOffset = (page - 1) * qLimit;
        showRecords();
    }
});    

function createPagination() {
    var paginationSize  = Math.ceil(parseInt(size) / parseInt(qLimit));
    var pagesString = '';
    if (parseInt(size) <= qLimit) {
        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-left"></span></span>';
        pagesString += '<span class="activePagination goToPage">1</span>';
        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-right"></span></span>';
        $("#affiliatesResultPages").html(pagesString);
    } else {
        if (paginationSize <= 7) {
            for (x = 1; x <= paginationSize; x++) {
                if (x == 1) {
                    if (page == 1) {
                        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-left"></span></span>';
                        pagesString += '<span class="activePagination">'+x+'</span>';
                    } else {
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(page, 1)+'"><span class="fa fa-angle-left"></span></a>';
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+x+'">'+x+'</a>';
                    }
                } else if (x != paginationSize && x != 1) {
                    if (page == x) {
                        pagesString += '<span class="activePagination" data-page="'+x+'">'+x+'</span>';
                    } else {
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+x+'">'+x+'</a>';
                    }
                } else {
                    if (page >= x) {
                        pagesString += '<span class="activePagination" data-page="'+x+'">'+x+'</span>';
                        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-right"></span></span>';
                    } else {
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+x+'">'+x+'</a>';
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+increaseVal(page, 1)+'"><span class="fa fa-angle-right"></span></a>';
                    }
                    $("#affiliatesResultPages").html(pagesString);
                }
            }
        } else {
            for (x = 1; x <= 7; x++) {
                if (x == 1) {
                    if (page == 1) {
                        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-left"></span></span>';
                        pagesString += '<span class="activePagination" data-page="1">1</span>';
                    } else {
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(page, 1)+'"><span class="fa fa-angle-left"></span></a>';
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="1">1</a>';
                    }
                }

                if(x == 2) {
                    if (page <= 4) {
                        if (page == 2) {
                            pagesString += '<span class="activePagination" data-page="2">2</span>';
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="2">2</a>';
                        }
                    } else {
                        pagesString += '<span "dotsPagination">...</span>';
                    }
                }

                if( x == 3) {
                    if (page <= 4) {
                        if (page == 3) {
                            pagesString += '<span class="activePagination">3</span>';
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="3">3</a>';
                        }
                    } else {
                        if (page >= paginationSize-3) {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(paginationSize, 4)+'">'+decreaseVal(paginationSize, 4)+'</a>';
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(page, 1)+'">'+decreaseVal(page, 1)+'</a>';
                        }
                    }
                }

                if (x == 4) {
                    if (page <= 4) {
                        if (page == 4) {
                            pagesString += '<span class="activePagination">4</span>';
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="4">4</a>';
                        }
                    } else {
                        if (page >= paginationSize-3) {
                            if (page == paginationSize - 3) {
                                pagesString += '<a href="#" class="activePagination">'+decreaseVal(paginationSize, 3)+'</a>';                                
                            } else {
                                pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(paginationSize, 3)+'">'+decreaseVal(paginationSize, 3)+'</a>';
                            }
                        } else {
                            pagesString += '<a href="#" class="activePagination">'+page+'</a>';
                        }
                    }
                }

                if(x == 5) {
                    if (page <= 4) {
                        if (page == 5) {
                            pagesString += '<span class="activePagination">5</span>';
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="5">5</a>';
                        }
                    } else {
                        if (page >= paginationSize - 3) {
                            if (page == paginationSize - 2) {
                                pagesString += '<a href="#" class="activePagination">'+decreaseVal(paginationSize, 2)+'</a>';                                
                            } else {
                                pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(paginationSize, 2)+'">'+decreaseVal(paginationSize, 2)+'</a>';
                            }                    
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+increaseVal(page, 1)+'">'+increaseVal(page, 1)+'</a>';  
                        }   
                    }
                }

                if(x == 6) {
                    if (page >= paginationSize - 3) {
                        if (page == paginationSize - 1) {
                            pagesString += '<a href="#" class="activePagination">'+decreaseVal(paginationSize, 1)+'</a>'; 
                        } else {
                            pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+decreaseVal(paginationSize, 1)+'">'+decreaseVal(paginationSize, 1)+'</a>'; 
                        }                       
                    } else {
                        pagesString += '<span class="dotsPagination">...</span>';
                    }                    
                }                

                if (x == 7) {
                    if (page == paginationSize) {
                        pagesString += '<span class="activePagination" data-page="'+paginationSize+'">'+paginationSize+'</span>';
                        pagesString += '<span class="pasivePaginationArrow"><span class="fa fa-angle-right"></span></span>';
                    } else {
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+paginationSize+'">'+paginationSize+'</a>';
                        pagesString += '<a href="#" class="pasivePagination goToPage" data-page="'+increaseVal(page, 1)+'"><span class="fa fa-angle-right"></span></a>';
                    }
                    $("#affiliatesResultPages").html(pagesString);
                }
            }        
        }
    }
    return false;
}

function increaseVal(page, val) {
   return page + val;
}

function decreaseVal(page, val) {
    return page - val;
 }

$(document).on('click', '.goToPage', function(e) {   
    e.preventDefault(); 
    page = parseInt($(this).attr('data-page'));
    qOffset = (page - 1) * qLimit;
    //result = createPagination();
    //$("#affiliatesResultPages").css("display", "none");
    result = showRecords();
});

var preventeventFlag = false;
$(document).on("click", ".show-contact-details", function(e) {
    e.preventDefault(); 
    var id = $(this).attr('data-id');
    preventeventFlag = true;
    $("#syncContact").prop('disabled', true);
    $('.property-changes').html('');
    $.ajax({
        type: "POST",
        data: {type:"getContactData",activeMessagesContactId:id},
        url: "./php/wainboxData.php?var=getContactData",
        dataType: 'json',
        success: function(response) {
            if (response == 'timeout') {
                window.location.replace("logout.php?var=timeout");
            } else {
                var len = $('[id^="sync_"]').length;
                $('[id^="sync_"]').each(function(i, input) {
                    idValue = $(input).attr('id').substring(5);
                    idName = $(input).attr('id');
                    if ($("#"+idName).is('select')) {
                        response[idValue] == null || response[idValue]== '' ? $("#"+idName).val('').change() : $("#"+idName).val(response[idValue]).change();
                        response[idValue] == null || response[idValue] == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', response[idValue]);
                        //console.log(idValue, idName, 'select', response[idValue]);
                    }

                    if ($("#"+idName).is('input')) {
                        if ($("#"+idName).hasClass('input-money-data')) {
                            response[idValue] == null || response[idValue] == '' ? $("#"+idName).val('') : $("#"+idName).val(moneyFormat(response[idValue])); 
                            response[idValue] == null || response[idValue] == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', moneyFormat(response[idValue]));
                        } else {
                            response[idValue] == null || response[idValue] == '' ? $("#"+idName).val('') : $("#"+idName).val(response[idValue]); 
                            response[idValue] == null || response[idValue] == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', response[idValue]);
                        }
                        //console.log(idValue, idName, 'input', response[idValue]);
                    }

                    if (i === (len - 1)) {
                        $('.contacts-data-loader-style').hide();
                        if (!(response['interestState_Id'] == null || response['interestState_Id'] == '')) { 
                            $("#sync_interestLocality_Id> option").each(function() {
                                if ($(this).attr("data-stateid") != response['interestState_Id']) {
                                    $(this).hide();
                                }
                            });                                
                        }
                        preventeventFlag = false;
                    }
                });
            }
        },
        error: function(response) {
            if (response.responseText.substring(0,15) == '<!DOCTYPE html>') {
                screenMsg('Ups!', 'Tu sesión expiró.', '4000', 'growl-danger');  
                window.location.replace("logout.php?var=timeout");
            } else {
                screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
            }
        }
    });
});

$(document).on("keyup", ".sync-data-container input", function(e) {
    e.preventDefault();
    if (!preventeventFlag) {
        hubspotChanges();
    }
});

$(document).on("change", ".sync-data-container select", function(e) {
    e.preventDefault();
    if (!preventeventFlag) {
        hubspotChanges();
    }
});

var userDataChanges = {};
function hubspotChanges() {   
    var flag = 0;
    userDataChanges = {};
    var len = $('[id^="sync_"]').length;
    $('[id^="sync_"]').each(function(i, input) {
        idValue = $(input).attr('id').substring(5);  
        newValue = $(input).val() == '' || $(input).val() == null ? null : $(input).val();
        currentValue = $(input).attr('data-value') ? $(input).attr('data-value') : null;
        if (newValue != currentValue) {
            userDataChanges[capitalizeFirstLetter(idValue)] = newValue;
            flag++;
        }
        if (i === (len - 1)) {
            if (flag == 1) {
                $("#syncContact").prop('disabled', false);
                $('.property-changes').html('Cambiaste 1 propiedad.');
            } else if (flag > 1) {
                $("#syncContact").prop('disabled', false);
                $('.property-changes').html('Cambiaste ' + flag + ' propiedades.');              
            } else {
                $("#syncContact").prop('disabled', true);
                $('.property-changes').html('');
            }                  
        }  
    });
}

$(document).on("click", "#syncContact", function(e) {
    e.preventDefault(); 
    $("#syncContact").prop('disabled', true);

    $.each(userDataChanges, function(key, value) {
        idName = 'sync_'+lowerCaseFirstLetter(key);
        if ($("#sync_"+lowerCaseFirstLetter(key)).is('input')) {
            if ($("#"+idName).hasClass('input-money-data')) {
                userDataChanges[key] = moneyFormat(value);
            }
        }
    });

    $.ajax({
        type: "POST",
        data: {type:"updateUserData",activeMessagesContactId:$('#sync_id').val(),contactId:$('#sync_id').val(),userDataChanges:userDataChanges},
        url: "./php/wainboxData.php?var=updateUserData",
        dataType: 'json',
        success: function(response) {
            if (response.result == 'success') {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                }
                screenMsg('Excelente!', 'El contacto fue actualizado con éxito.', '2000', 'growl-success');
                //if (userDataChanges.ConversionStatus_Id && userDataChanges.ConversionStatus_Id == 4) maturation();
            } else {
                screenMsg('Ups!', 'Hubo un error, por favor intentalo más tarde.', '2000', 'growl-danger');
            }
            $('.property-changes').html('');
            $.each(userDataChanges, function(key, value) {
                idName = 'sync_'+lowerCaseFirstLetter(key);
                if ($("#sync_"+lowerCaseFirstLetter(key)).is('select')) {
                    value == null || value == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', value);
                }
        
                if ($("#sync_"+lowerCaseFirstLetter(key)).is('input')) {
                    if ($("#"+idName).hasClass('input-money-data')) {
                        value == null || value == '' ? $("#"+idName).val('') : $("#"+idName).val(moneyFormat(value)); 
                        value == null || value == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', moneyFormat(value));
                    } else {
                        value == null || value == '' ? $("#"+idName).attr('data-value', '') : $("#"+idName).attr('data-value', value);
                    }
                }
            });
        },
        error: function(response) {
            if (response.responseText.substring(0,15) == '<!DOCTYPE html>') {
                screenMsg('Ups!', 'Tu sesión expiró.', '4000', 'growl-danger');  
                window.location.replace("logout.php?var=timeout");
            } else {
                screenMsg('Ups!', 'Hubo un error, por favor intentalo más tarde.', '2000', 'growl-danger');
                $('.property-changes').html('');
            }
        }
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

function normalizeString(string) {
    if (string != null) {
        string = string.replace(/ñ/g, 'thisisacow');
        string = string.replace(/Ñ/g, 'thisisacow');
        string = string.normalize('NFD').replace(/[\u0300-\u036f]/g,"").toUpperCase();
    } else {
        string = string;
    }
    string = string.replace(/[^\w\s]/gi, '').replace(/\s\s+/g, ' ');
    string = string.replace(/THISISACOW/g, 'Ñ');
    return string.trim();
}

function screenMsg(textTitle, textMsg, time, className) {
    jQuery.gritter.add({
        title: textTitle,
        text: textMsg,
        class_name: className,
        sticky: false,
        time: time
    });
    return false;
}

function returnBlank(string) {
    if (string == null || string == '' || string == 'null' || string == 'NULL' || string == ' ') {
        return '';
    } else {
        return string;
    }
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function moneyFormat(stringVal) {
	if(stringVal == undefined){return "$0";}
	stringVal = stringVal.indexOf(".") >= 0 ? stringVal.split(".")[0] : stringVal;
    var val = stringVal.replace(/,/g, "").replace(/\$/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",").replace(/[^0-9, \, , \$]/g, '');
	return val;
}

$(document).on("click", "#addContact", function(e) {
    e.preventDefault(); 
    resetStartConversationForm();
    $("#openNewContactModal").click(); 
    return false;
});

$(document).on("click", "#startConversationGo", function(e) {
    e.preventDefault();
    var flag = 0;
    var regString = /^([a-zA-Z0-9 _-áéíóúÁÉÍÓÚÜüÑñ]+)$/;
    var regPhone = /^[\+](\d{12})$|^(\d{10})$|^(\d{12})$/;
    var regMail = /^(\s*|(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})))$/; 

    if ($('#startConversationName').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el nombre.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regString.test($('#startConversationName').val()))) {
            screenMsg('Ups!', 'El nombre no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if ($('#startConversationLastName').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el apellido.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regString.test($('#startConversationLastName').val()))) {
            screenMsg('Ups!', 'El apellido no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if ($('#startConversationPhone').val() == "") {
        screenMsg('Ups!', 'Debes ingresar el teléfono.', '4000', 'growl-danger');
        flag++;
    } else {
        if (!(regPhone.test($('#startConversationPhone').val()))) {
            screenMsg('Ups!', 'El número de teléfono no es válido.', '4000', 'growl-danger');
            flag++;
        }
    }

    if (!(regMail.test($('#startConversationMail').val()))) {
        screenMsg('Ups!', 'El email no es válido.', '4000', 'growl-danger');
        flag++;
    }

    if ($('#startConversationInstance').val() == 0) {
        screenMsg('Ups!', 'Debes seleccionar una instancia.', '4000', 'growl-danger');
        flag++;
    }

    if ($('#startConversationAdviser').val() == 0) {
        screenMsg('Ups!', 'Debes seleccionar una instancia.', '4000', 'growl-danger');
        flag++;
    }    

    var contactData = {
        name:$('#startConversationName').val(), 
        lastName:$('#startConversationLastName').val(), 
        phone:$('#startConversationPhone').val(),
        email:$('#startConversationMail').val(),
        instance:$('#startConversationInstance').val(),
        adviser:$('#startConversationAdviser').val(),
        };

    if (flag == 0) {
        $('#startConversationGo').prop('disabled', true);
        $('#startConversationCancel').prop('disabled', true);
        $('.new-contact-container-loader').show();
        $.ajax({
            type: "POST",
            data: {type:"addContact",contactData:contactData},
            url: "./php/wainboxData.php?var=addContact",
            dataType: 'json',
            success: function(response) {
                if (response == 'timeout') {
                    window.location.replace("logout.php?var=timeout");
                } else if (response.result == 'success') {
                    screenMsg('Excelente!', 'El contacto fue dado de alta con éxito.', '4000', 'growl-success');
                    $('#newContactModal').modal('hide');
                    showRecords();
                } else if (response.result == 'duplicate') {
                    screenMsg('El teléfono ya existe.!', 'Verifica en búsqueda avanzada.', '4000', 'growl-warning');
                    $('#newContactModal').modal('hide');
                } else {
                    screenMsg('Ups!', response.msgId, '4000', 'growl-danger');   
                    $('#newContactModal').modal('hide');
                }
            },
            error: function(response) {
                if (response.responseText.substring(0,15) == '<!DOCTYPE html>') {
                    screenMsg('Ups!', 'Tu sesión expiró.', '4000', 'growl-danger');  
                    window.location.replace("logout.php?var=timeout");
                } else {
                    screenMsg('Ups!', 'Hubo un error.', '4000', 'growl-danger');   
                    $('#startConversationModal').modal('hide');
                }
            }
        });
    }
});

function resetStartConversationForm() {
    $('#startConversationName').val('');
    $('#startConversationLastName').val('');
    $('#startConversationPhone').val('');
    $('#startConversationMail').val('');
    $('#startConversationInstance').select2('data', { id:0, text:'Selecciona una Instancia *'});
    $('#startConversationAdviser').select2('data', { id:0, text:'Selecciona un Asesor *'});
    $('#startConversationCancel').prop('disabled', false);
    $('#startConversationGo').prop('disabled', false);
    $('.new-contact-container-loader').hide();
    return false;
}

function getDateFormat(date, flag = 0) { 
    if (date == dateT) {
        if (flag == 1) {
            return 'Se añadió hoy';
        } else {
            return 'Hoy';
        }
    } else if (date == dateY) { 
        if (flag == 1) {
            return 'Se añadió ayer';
        } else {
            return 'Ayer';
        }
    } else {
        if (flag == 1) {
            return 'Se añadió el '+date.substr(0,2)+" de "+monthName[parseInt(date.substr(3,2))-1]+" de "+date.substr(-4);
        } else {
            return date.substr(0,2)+"/"+monthShortName[parseInt(date.substr(3,2))-1]+"/"+date.substr(-2);
        }        
    }
}

function prependZero(number) {
    if (number < 10)
        return "0" + number;
    else
        return number;
}