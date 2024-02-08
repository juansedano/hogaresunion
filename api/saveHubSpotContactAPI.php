<?php
include_once './functions/apiFunctions.php';
header("Content-Type:application/json");
if (!isset($_GET['hubspotid'])) {
    $resultData = responseData('error');
    echo $resultData;
    die();
}

$emsg = isset($_GET['emsg']) ? $_GET['emsg'] : null;
$imsg = isset($_GET['imsg']) ? $_GET['imsg'] : null;
$instance = isset($_GET['instance']) ? trim($_GET['instance']) : '110713365010724';

$contactData = returnHubSpotUserData($_GET['hubspotid']);

$phoneData = validatePhone($contactData["phone"]);

if ($phoneData['status']) {
    $data = saveLead($_GET['hubspotid'], $phoneData['phone'], $contactData, $emsg, $imsg, $instance);
    $log = insert2Log('saveHubSpotContactAPI', $_GET['hubspotid'], $phoneData['phone'], $data, $instance);
    $resultData = responseData($data);
    echo $resultData;
} else {
    $log = insert2Log('saveHubSpotContactAPI', $_GET['hubspotid'], $phoneData['phone'], 'wrong_formatted', $instance);
    $resultData = responseData('wrong_formatted');
    echo $resultData;
}
?>