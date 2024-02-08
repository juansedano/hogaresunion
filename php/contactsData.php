<?php
header("Content-Type: application/json");
ini_set('max_execution_time', '0');
include_once './contactsFunctions.php';
include_once './wainboxFunctions.php';
include_once '../bat/sessionData.php';
if ((!$userInfo) || (!$userData)) {
	$auth0->logout();
	echo json_encode('timeout');
    die();
}
if (isset($_POST["type"])) {
 	if ($_POST["type"] == "getContacts") {
        $contacts = [
			"data"  => returnContactsList($_POST["qOffset"], $_POST["qLimit"], $_POST["filters"], $_POST["searchString"], $_POST["order"]), 
            "count" => returnContactsListCount($_POST["filters"], $_POST["searchString"])
        ];
		echo json_encode($contacts);	
	} elseif ($_POST["type"] == "mainDataInitialization") {
		$data = [
			"instances"  => returnInstances(),
			"collaborators"  => returnAdvisers(),
			"conversionStatus"  => returnConversionStatus(),
			"state"  => returnState(),
			"locality"  => returnLocality()
		];
		echo json_encode($data);
	} elseif ($_POST["type"] == "dataInitialization") {
		$data = [
			"contactType"  => returnContactType(),
			"contactOrigin"  => returnContactOrigin(),
			"maritalStatus"  => returnMaritalStatus(),
			"product" => returnProduct(),
			"productCoaccredited" => returnProductCoaccredited(),
			"gender" => returnGender(),
			"socialCategory" => returnSocialCategory(),
			"identificationType" => returnIdentificationType()			
		];
		echo json_encode($data);		
	} else {				
		echo "Error";
	}
} else {
	echo "Error";
}
?>