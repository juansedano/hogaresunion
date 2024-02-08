<?php
include '../bat/DBconection.php';
include 'functions.php';
try {
    $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
    $string = "SELECT t.Id, t.Description, 
    concat(c.Name, ' ', c.LastName), c.Phone, c.Flag_Id,
    c.Id, concat(ct.Name, ' ', ct.LastName), ct.phone
    from Task t 
    join Collaborator c on c.Id = t.Collaborator_Id 
    join Contact ct on ct.Id = t.Contact_Id
    where t.Flag_Id = 3 and DATE_FORMAT(from_unixtime(t.ExpiresAt),'%Y-%m-%d') = current_date();";
    $sql = $db->prepare($string);
    $sql->execute();
    $row = $sql->fetchAll();
    $db = null;
    foreach($row as $rowData) { 
        $phone = $rowData[3]; 
        $phoneId = '100772469353894'; 
        $template = 'vencimiento_tarea';
        $params = array(
            "param_01" => ['type' => 'text', 'text' => $rowData[2]],
            "param_02" => ['type' => 'text', 'text' => $rowData[6]],
            "param_03" => ['type' => 'text', 'text' => $rowData[5]],
            "param_04" => ['type' => 'text', 'text' => $rowData[1]]
        );

        $data = array("phoneId" => $phoneId, "phone" => $phone, "type" => 'template', "template" => $template, "bodyParams" => $params);
        $result = sendMessageWABA($data);
        echo $rowData[2] . " | " . $rowData[6] . " | " . $rowData[5] . " | " . $rowData[1] . " | " . $result['status']  . chr(10);
    }
} catch (PDOException $e) {
    print "Error!: " . $e->getMessage();
}
?>