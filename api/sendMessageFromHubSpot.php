<?php
include_once './functions/apiFunctions.php';
header("Content-Type:application/json");

$var1 = isset($_GET['var1']) ? $_GET['var1'] : null;
$var2 = isset($_GET['var2']) ? $_GET['var2'] : null;
$var3 = isset($_GET['var3']) ? $_GET['var3'] : null;
$var4 = isset($_GET['var4']) ? $_GET['var4'] : null;
$var5 = isset($_GET['var5']) ? $_GET['var5'] : null;
$var6 = isset($_GET['var6']) ? $_GET['var6'] : null;
$var7 = isset($_GET['var7']) ? $_GET['var7'] : null;
$var8 = isset($_GET['var8']) ? $_GET['var8'] : null;

$imgUrl = isset($_GET['imgUrl']) ? $_GET['imgUrl'] : null;

/*if (!(isset($_GET['groupId']) && isset($_GET['msg']))) {
    $resultData = responseData('error');
    echo $resultData;
    die();
}*/

$message = '';
$message = str_replace('[enter]', chr(10), $_GET['msg']);
$message = str_replace('[var1]', $var1, $message);
$message = str_replace('[var2]', $var2, $message);
$message = str_replace('[var3]', $var3, $message);
$message = str_replace('[var4]', $var4, $message);
$message = str_replace('[var5]', $var5, $message);
$message = str_replace('[var6]', $var6, $message);
$message = str_replace('[var7]', $var7, $message);
$message = str_replace('[var8]', $var8, $message);

//$log = insert2Log('sendMessageFromHubSpot', '8574965', '5560307251', $message);

if ($imgUrl != null) {
    $data = array("phoneId" => '21432', "phone" => $_GET['groupId'], "type" => 'media', "message" => $message, "media" => $imgUrl);
} else {
    $data = array("phoneId" => '21432', "phone" => $_GET['groupId'], "type" => 'text', "message" => $message);
}

$result = sendMessageMT($data);	

if ($result['status']  == 'error') {
    $resultData = responseData('error');
    echo $resultData;
} else {
    $resultData = responseData('success');
    echo $resultData;
}

?>