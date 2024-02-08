<?php
include_once 'facebookAdsWebhookFunctions.php';

$verifyToken = "$2y$12$4CVppRCMNCTizgWLjpL7uO028YuZmezpDyDEw4lK3vVPKCZp.gwIK";

$mode = isset($_GET["hub_mode"]) ? $_GET["hub_mode"] : null;
$token = isset($_GET["hub_verify_token"]) ? $_GET["hub_verify_token"] : null;
$challenge = isset($_GET["hub_challenge"]) ? $_GET["hub_challenge"] : null;

$logFile = "log/log_fa_".date("YmdH").".log";

if (!empty($_POST)) file_put_contents($logFile, "\n".json_encode($_POST), FILE_APPEND);
if (!empty($_GET)) file_put_contents($logFile, "\n".json_encode($_GET), FILE_APPEND);

if ($mode === "subscribe" && $token === $verifyToken) {
    http_response_code(200);
    echo json_encode(intval($challenge));
    die();
}

$request = file_get_contents('php://input');
file_put_contents($logFile, "\n".$request, FILE_APPEND);
$requestDecode = json_decode($request, true);

$data = $requestDecode["entry"][0];

if (isset($data["changes"])) saveLeadForm($data["changes"], $logFile);

if (isset($data["messaging"])) file_put_contents($logFile, "\n".json_encode($data["messaging"]), FILE_APPEND);

?>