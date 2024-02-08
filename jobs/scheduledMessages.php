<?php
include '../bat/DBconection.php';
include './functions.php';
try {
    $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
    $string = "Select m.Id  as 'msgId', m.Collaborator_Id  as 'adviserId', m.Contact_Id as 'contactId', m.ContactPhone as 'phone', m.Instance as 'instance', 
    m.Message as 'message', m.CreatedBy as 'createdBy', m.Template as 'template', if(c.ShortName is null or c.ShortName = '',c.Name, c.ShortName) as 'name',
    m.CreatedAt as 'createdAt'
    from tratodirecto_hu.ScheduledMessage m join tratodirecto_hu.Contact c on c.Id = m.Contact_Id
    where m.Flag_Id = 3 and c.Flag_Id = 1 and DATEDIFF(DATE_FORMAT(from_unixtime(m.ScheduleUTC),'%Y/%m/%d'), DATE_FORMAT(now(),'%Y/%m/%d')) = 0 and
    TIME_TO_SEC(TIMEDIFF(DATE_FORMAT(from_unixtime(m.ScheduleUTC),'%H:%i:%s'), DATE_FORMAT(now(),'%H:%i:%s'))) between '-180' and '180';"; 
    $sql = $db->prepare($string);
    $sql->execute();
    $row = $sql->fetchAll();
    foreach($row as $rowData) {
        $string = "Select count(*) from tratodirecto_hu.Log_".$rowData['instance']." 
        where Contact_Id = :contactId and ProviderUTC > :createdAt and Internal = 0 order by ProviderUTC desc"; 
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId',$rowData['contactId']);
        $sql->bindParam(':createdAt',$rowData['createdAt']);
        $sql->execute();
        $row2 = $sql->fetch();
        if ($row2[0] == 0) {
            $params = array(
                "param_01" => ['type' => 'text', 'text' => $rowData['name']],
                "param_02" => ['type' => 'text', 'text' => $rowData['message']]
            ); 
            $data = array("phoneId" => $rowData['instance'], "phone" => $rowData['phone'], "type" => 'template', "template" => $rowData['template'], "bodyParams" => $params);
            $result = sendMessageWABA($data);
            if ($result['status'] != 'error') {
                $sendData2Log = sendData2Log($rowData['contactId'], $result['id'], $rowData['phone'], $rowData['adviserId'], $result['message'], $rowData['instance'], '2');
                if (!$sendData2Log) {
                    echo 'Hubo un error al guardar el mensaje programado en el log con Id ' .$rowData['msgId'].chr(10);
                } else {
                    $updateScheduleMessage = updateScheduleMessage($rowData['msgId']);
                    if (!$updateScheduleMessage) {
                        echo 'Hubo un error al actualizar el status del mensaje programado ' .$rowData['msgId'].chr(10);
                    } else {
                        echo 'El mensaje programado con Id '.$rowData['msgId'].' fue enviado con éxito.'.chr(10);
                    }
                }
            } else {
                echo 'Hubo un error al enviar el mensaje programado con Id ' .$rowData['msgId'].chr(10);
            }
        }      
    }
    $db = null;
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage();
}
?>