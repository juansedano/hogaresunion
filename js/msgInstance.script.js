//v=1.0 16 Marzo 2021 16:01
$(document).ready(function () {
    getInstancesStatus();
    setInterval(function() {
         console.log('InstancesStatus');
         getInstancesStatus();
     }, 240000); //4 min.
});

function getInstancesStatus() {
    var string = '';
    var flag = 1;
    $('.instance-status').removeClass('fa-circle');
    $('.instance-status').addClass('fa-spinner');
    $('.instance-status').addClass('fa-pulse');
    $.ajax({
        type: "POST",
        data: {type:"getInstancesStatus"},
        url: "./php/msgInstanceData.php?var=getInstancesStatus",
        success: function(response) {
            var obj = JSON.parse(response);
            obj = JSON.parse(obj[0]);
            console.log(obj.data);
            var len = obj.data.length;
            $.each(obj.data, function(index, data) { 
                if (data.status == 1) {
                    flagColor = '#5cb85c';
                } else if (data.status == 2) {
                    flagColor = '#f0ad4e';
                } else {
                    flagColor = '#ff0000';  
                }
                string += '<div class="col-sm-6 col-md-4 col-lg-4"><span style="font-size:11px;white-space: nowrap;"><i class="fa fa-circle instance-status" style="color: ' + flagColor + ';" title="' + data.description + '"></i> ' + data.name + '</span></div>';
                if (index === (len - 1)) {                            
                    $('#instancesStatusContainer').html(string); 
                }                 
            });
        }    
    });
}