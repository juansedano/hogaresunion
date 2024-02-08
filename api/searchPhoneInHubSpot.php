<?php
include_once './functions/apiFunctions.php';
header("Content-Type:application/json");
if (!isset($_GET['hubspotid'])) {
    $resultData = responseData('error');
    echo $resultData;
    die();
}

if (!isset($_GET['phone'])) {
    $resultData = responseData('error');
    echo $resultData;
    die();
}

if ($_GET['phone'] == '' || $_GET['phone'] == null || $_GET['phone'] == NULL || $_GET['phone'] == 'undefined') {
    $resultData = responseData('error');
    echo $resultData;
    die();
}

//error_log($_GET['hubspotid'].' / '.$_GET['phone']);

$phoneData = validatePhone($_GET['phone']);

$data = searchPhone($phoneData['phone'],$_GET['hubspotid']);

$log = insert2Log('searchPhoneInHubSpot', $_GET['hubspotid'], $phoneData['phone'], $data);

$resultData = responseData($data);
echo $resultData;

?>