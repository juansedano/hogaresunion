//v=1.0.0 11:57 17/November/2021
$(document).ready(function () {
    //createPagination();

});

$(document).on('change', '#searchOption', function(e) {
    e.preventDefault(); 
    var option = $(this).val();
    var source = $('#sourceOption').val();
    if (option != 0 && source != 0) {
        $('#searchGo').prop('disabled', false);
    } else {
        $('#searchGo').prop('disabled', true);
    }
});

$(document).on('change', '#sourceOption', function(e) {
    e.preventDefault(); 
    var source = $(this).val();
    var option = $('#searchOption').val();
    if (source != 0 && option != 0) {
        $('#searchGo').prop('disabled', false);
    } else {
        $('#searchGo').prop('disabled', true);
    }
});

var qLimit = 20;
var qOffset = 0;
var page = 1;
var size = 0;
var sourceOption = 0;
var searchOption = 0;
var searchInput = 0;
var searchState = 0;
var affiliateData = [];

$(document).on('click', '#searchGo', function(e) {
    e.preventDefault(); 
    var getSize = 1;
    qLimit = 20;
    qOffset = 0;
    page = 1;
    sourceOption = $('#sourceOption').val();
    searchOption = $('#searchOption').val();
    searchInput = $('#searchInput').val();
    searchState = $('#searchState').val();
    searchInput = normalizeString(searchInput);
    $('#searchInput').val(searchInput);
    $("#affiliatesResultSize").css("display", "none");
    $("#affiliatesResultPages").css("display", "none");
    if (searchInput == '' || searchInput.length < 5) {
        screenMsgGlobal('Ups!', 'Debes ingresar un valor de más de 5 caractéres.', '4000', 'growl-danger');
    } else {
        result = showRecords(sourceOption, searchOption, searchInput, searchState, page, getSize);
    }    
});

function showRecords(sourceOption, searchOption, searchInput, searchState, page, getSize) {
    var string = '';
    var dataIndex = 0;
    affiliateData = [];
    $("#affiliatesResult").html('<tr><td colspan="9" style="background-color: #F7F7F7;padding-top:10px;"><div><img src="images/loading.gif" class="img-responsive" style="margin: 0 auto; width:48Px;"></div></td><tr>');
    $.ajax({
        type: "POST",
        data: {type:"getAffiliates", sourceOption:sourceOption, searchOption:searchOption, searchInput:searchInput, searchState:searchState, qLimit:qLimit, qOffset:qOffset, getSize:getSize},
        url: "./php/affiliatesData.php?var=getAffiliates",
        dataType: 'json',
        success: function(response) {
            var len = response.data.length;
            if (getSize == 1) {
                size = response.size;
            }
            if (len == 0) {
                $("#affiliatesResult").html('<tr><td colspan="9" style="background-color: #F7F7F7;padding-top:10px;">No se encontraron coincidencias</td><tr>');
            } else {
                $.each(response.data, function(index, affiliate) {
                    if (sourceOption == 2) {
                        affiliateData.push({
                            "id": dataIndex,
                            "NSS": affiliate[0],
                            "CURP": affiliate[1],
                            "RFC": affiliate[2],
                            "Name": affiliate[3],
                            "CreditNo": affiliate[4],
                            "NRP": affiliate[5],
                            "Locality": affiliate[6],
                            "State": affiliate[7],
                            "employerName": affiliate[8],
                            "employerType": affiliate[9],
                            "employerRFC": affiliate[10],
                            "employerAddress": affiliate[11],
                            "employerLocality": affiliate[12],
                            "employerPostalCode": affiliate[12]
                        });
                    } 
                    string += '<tr>';
                    string += '<td style="text-align:center">'+returnBlank(affiliate[0])+'</td>';
                    string += '<td style="text-align:center">'+returnBlank(affiliate[1])+'</td>';
                    string += '<td style="text-align:center">'+returnBlank(affiliate[2])+'</td>';
                    string += '<td style="text-align:left">'+returnBlank(affiliate[3])+'</td>';
                    string += '<td style="text-align:center">'+returnBlank(affiliate[4])+'</td>';
                    string += '<td style="text-align:center">'+returnBlank(affiliate[5])+'</td>';
                    string += '<td style="text-align:left">'+returnBlank(affiliate[6])+'</td>';
                    string += '<td style="text-align:left">'+returnBlank(affiliate[7])+'</td>';
                    if (sourceOption == 1) {
                        string += '<td style="text-align:center"><span class="fa fa-plus-square" style="color:#bbbbbb"></span></td>';
                    } else {
                        string += '<td style="text-align:center"><a href="#" data-affiliate="'+dataIndex+'" class="show-detail"><span class="fa fa-plus-square" style="color:#FFB71B"></span></a></td>';
                    }
                    string += '</tr>';
                    dataIndex++;
                    if (index === (len - 1)) {
                        $("#affiliatesResult").html(string);
                        $("#affiliatesResultSize").css("display", "block");
                        $("#affiliatesResultPages").css("display", "block");
                        if (size == 1) {
                            $("#affiliatesResultSize").html('Se encontró solo un resgistro.');
                        } else {
                            $("#affiliatesResultSize").html('Se encontraron '+size+' registros.');
                        }
                        result = createPagination();
                    }         
                });
            }
        },
        error: function() {
            screenMsgGlobal('Ups!', 'Hubo un error, por favor intentalo nuevamente.', '4000', 'growl-danger');
            $("#affiliatesResult").html('<tr><td colspan="9" style="background-color: #F7F7F7;padding-top:10px;">Nada que mostrar en este momento.</td><tr>');
        }
    });
    return false;
}

$(document).on('click', '.show-detail', function(e) {   
    var id = $(this).attr('data-affiliate');
    $('#openDetailModal').click();
    string = '<table class="table table-striped detailTable" style="width:90%;font-size:12px" align="center">';
    string += '<tr><td style="text-align:right;font-weight:bold;width:42%">NSS</td><td>' + returnBlank(affiliateData[id].NSS) + '</td></tr>';
    string += '<tr><td style="text-align:right;font-weight:bold">CURP</td><td>' + returnBlank(affiliateData[id].CURP) + '</td></tr>';  
    string += '<tr><td style="text-align:right;font-weight:bold">RFC</td><td>' + returnBlank(affiliateData[id].RFC) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Nombre</td><td>' + returnBlank(affiliateData[id].Name) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Crédito</td><td>' + returnBlank(affiliateData[id].CreditNo) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">NRP</td><td>' + returnBlank(affiliateData[id].NRP) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Localidad</td><td>' + returnBlank(affiliateData[id].Locality) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Estado</td><td>' + returnBlank(affiliateData[id].State) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Razón Social</td><td>' + returnBlank(affiliateData[id].employerName) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Desc Giro</td><td>' + returnBlank(affiliateData[id].employerType) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">RFC Patronal</td><td>' + returnBlank(affiliateData[id].employerRFC) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Dirección Patronal</td><td>' + returnBlank(affiliateData[id].employerAddress) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">Localidad Patronal</td><td>' + returnBlank(affiliateData[id].employerLocality) + '</td></tr>'; 
    string += '<tr><td style="text-align:right;font-weight:bold">CP Patronal</td><td>' + returnBlank(affiliateData[id].employerPostalCode) + '</td></tr>';          
    string += '</table>';
    $('#detailModalBody').html(string); 
});  

function createPagination() {
    var paginationSize  = Math.ceil(size / 20);
    var pagesString = '';
    if (size <= qLimit) {
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
    var getSize = 0;
    page = parseInt($(this).attr('data-page'));
    qOffset = (page - 1) * qLimit;
    //result = createPagination();
    $("#affiliatesResultPages").css("display", "none");
    result = showRecords(sourceOption, searchOption, searchInput, searchState, page, getSize);
});

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

function screenMsgGlobal(textTitle, textMsg, time, className) {
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