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

$log = insert2Log($_GET['hubspotid'], $phoneData['phone'], $phoneData['status']);

if ($phoneData['status']) {
    $data = saveLead($_GET['hubspotid'], $phoneData['phone'], $contactData, $emsg, $imsg, $instance);
    if ($data) {
        $resultData = responseData($data);
        echo $resultData;
    }
} else {
    $resultData = responseData('wrong_formatted');
    echo $resultData;
}
?>