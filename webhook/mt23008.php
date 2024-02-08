<?php
include_once './mtFunctions.php';

$request = file_get_contents('php://input');
$data = print_r($request, true);
$instance = '23008';
$logFile = "log/log_".$instance."_".date("YmdH").".log";
if (file_exists($logFile)) {
    $contents = file_get_contents($logFile);
} else {
    file_put_contents($logFile, '');
    $contents = '';
}
$contents .= $data . "\n";
$fp = file_put_contents($logFile, $contents);

$requestDecode = json_decode($request, true);

if ($requestDecode['type'] == 'ack') {
    $result = saveAck($requestDecode);
} else {
    $result = saveMessage($requestDecode);
}

?>