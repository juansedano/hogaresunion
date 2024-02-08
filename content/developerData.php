<?php
include_once './businesslogic/developerFunctions.php';
if (isset($_POST["type"])) {
	if ($_POST["type"] == "getDeveloperName") {
		$developerName = returnDeveloperName();
		foreach ($developerName as $developerNameData) {	
			$output[] = array (utf8_encode($developerNameData[0]), utf8_encode($developerNameData[1]));
		}		
		echo json_encode($output);
	} else if ($_POST["type"] == "getDevelopmentName") {
		$development = returnDevelopmentInfo($_POST["id"]);
		foreach ($development as $developmentData) {	
			$output[] = array (utf8_encode($developmentData[0]), utf8_encode($developmentData[1]));
		}		
		echo json_encode($output);
	} else if ($_POST["type"] == "getDeveloperInfo") {
		$developerInfo = returnDeveloperInfo($_POST["id"]);
		foreach ($developerInfo as $developerInfoData) {	
			$output[] = array ($developerInfoData[0], utf8_encode($developerInfoData[1]),$developerInfoData[2],$developerInfoData[3],$developerInfoData[4],$developerInfoData[5]);
		}		
		echo json_encode($output);
	} else if ($_POST["type"] == "getFlags") {
		$developersFlags = returnFlags();
		foreach ($developersFlags as $developersFlagsData) {	
			$output[] = array ($developersFlagsData[0], utf8_encode($developersFlagsData[1]));
		}		
		echo json_encode($output);
	} else if ($_POST["type"] == "getAttributes") {
		$attributes_arr=array();
		$attributes_arr["records"]=array();
		$devAttributes = returnAttributes();
		foreach ($devAttributes as $devAttributesData) {
			$attribute_item=array(
				"id" => $devAttributesData[1],
				"description" => utf8_encode($devAttributesData[0])
			);
			array_push($attributes_arr["records"], $attribute_item);
		}
		echo json_encode($attributes_arr);
	} else if ($_POST["type"] == "getAddressInfo") {
		$output = [];
		$devAddressInfo = returnAddressInfo($_POST["postalCode"]);
		foreach ($devAddressInfo as $devAddressInfoData) {	
			$output[] = array (utf8_encode($devAddressInfoData[0]), utf8_encode($devAddressInfoData[1]), utf8_encode($devAddressInfoData[2]), $devAddressInfoData[3]);
		}		
		if (empty($output)) {
			echo json_encode(null);
		} else {
			echo json_encode($output);
		}
	} else {	
		echo "Error";
	}
} else {
	echo "Error";
}
?>