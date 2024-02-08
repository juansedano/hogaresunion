$(document).ready(function(){     
    $("#findInteraction").keypress(function(e) {
      if(e.which == 13) {
        findInteraction();
      }
    });
    $(window).resize(function(){
        var iniTop = ($('#interactionModalBody').offset().top)+50;
        $('#interactionModalBody').css('height', (window.innerHeight)-iniTop+'px');
    });
});

function findInteraction() {
    var find = $("#findInteraction").val();
    $("#interactionModalBody").html('');
    $.ajax({
        type: "GET",
        data: {type:"findInteraction", text:find},
        url: "./php/mapData.php", 
        dataType: 'json',
        success: function (data) {
            var result = data;
            if (result.length>0) {
                var resultInteraction="<table class='table table-striped'><tbody>";
                result.forEach(element => {
                    var text1 = element["text"].split(",.").join("<br>");
                    var text2 = element["text"].split(",.").join("\n");
                    var row = "<tr><td>"+ element["label"] +"</td><td><button class='btn btn-primary copyText' name='"+ text2 +"' id='copy"+ element["id"] +"'>copiar</button></td>"+
                    "<td style='width:100%;word-break: break-word;', id='t"+ element["id"] +"'>"+text1+"</td></tr>";
                    resultInteraction+=row;
                });
                resultInteraction+="</tbody></table>";
                $("#interactionModalBody").append(resultInteraction);
                var iniTop = ($('#interactionModalBody').offset().top)+120;
                $('#interactionModalBody').css('height', (window.innerHeight)-iniTop+'px');
                $("#openInteractionModal").click();
            } else {
                notify('growl-danger', 'Sin resultados', 'No se han encontrados interacciones con la palabra '+ find); 
            }
        } 
    });
    
}


$(document).on("click", ".copyText", function (e) {
    e.preventDefault();
    var text=$(this).attr('name');
    $("#closei").click();
    $("#message").val(text);
    $("#message").focus();
    $("#findInteraction").val("");
});


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

