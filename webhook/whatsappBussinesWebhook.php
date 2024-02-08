<?php
include_once './whatsappBussinesWebhookFunctions.php';
$verify_token = "hello_there";
$mode = isset($_GET["hub_mode"]) ? $_GET["hub_mode"] : null;
$token = isset($_GET["hub_verify_token"]) ? $_GET["hub_verify_token"] : null;
$challenge = isset($_GET["hub_challenge"]) ? $_GET["hub_challenge"] : null;

$request = file_get_contents('php://input');
$data = print_r($request, true);
$instance = 'wa';
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

if (isset($requestDecode['entry'][0]['changes'][0]['value']['statuses'])) {
    $result = saveAck($requestDecode['entry'][0]);
} elseif (isset($requestDecode['entry'][0]['changes'][0]['value']['messages'])) {
    $result = saveMessage($requestDecode['entry'][0]);
}

if ($mode === "subscribe" && $token === $verify_token) {
    http_response_code(200);
    echo json_encode(intval($challenge));
}
?>