<?php
include_once './businesslogic/surveyFunctions.php';
if (isset($_GET["type"])) {
	if ($_GET["type"] == "getStoredStates") {
		$states_arr = array();
		$states_arr["states"] = array();
		$states = returnStoredState();
		foreach ($states as $statesData) {
			$state_item = array(
				"id" => $statesData[0],
				"name" => utf8_encode($statesData[1])
			);
			array_push($states_arr["states"], $state_item);
		}
        echo json_encode($states_arr);
    } else if ($_GET["type"] == "getStoredLocByState") {
        $loc_arr = array();
        $loc_arr["locations"] = array();
        $stateId = $_GET["stateId"];
        $locs = returnStoredLocByState($stateId);
        foreach ($locs as $locsData) {
            $loc_item = array(
                "id" => $locsData[0],
                "name" => utf8_encode($locsData[1])
            );
            array_push($loc_arr["locations"], $loc_item);
        }
        echo json_encode($loc_arr);
	} else if ($_GET["type"] == "getFeatures") {
		$features_arr=array();
		$features_arr["features"] = array();
		$features = returnAllFeatures();
		foreach ($features as $featuresData) {
			$feature_item=array(
				"id" => $featuresData[1],
				"name" => utf8_encode($featuresData[0])
			);
			array_push($features_arr["features"], $feature_item);
		}
		echo json_encode($features_arr);
	} else if ($_GET["type"] == "getStoredStatesNum") {
		$states_arr = array();
		$states_arr["states"] = array();
		$states = returnStoredStateNum();
		foreach ($states as $statesData) {
			$state_item = array(
				"id" => $statesData[0],
				"name" => utf8_encode($statesData[1]),
				"qty" => utf8_encode($statesData[2])
			);
			array_push($states_arr["states"], $state_item);
		}
		echo json_encode($states_arr);
    } else if ($_GET["type"] == "getStoredLocByStateNum") {
        $loc_arr = array();
        $loc_arr["localities"] = array();
        $stateId = $_GET["stateId"];
        $locs = returnStoredLocByStateNum($stateId);
        foreach ($locs as $locsData) {
            $loc_item = array(
                "id" => $locsData[0],
				"name" => utf8_encode($locsData[1]),
				"qty" => utf8_encode($locsData[2])
            );
            array_push($loc_arr["localities"], $loc_item);
        }
		echo json_encode($loc_arr);
    } else if ($_GET["type"] == "getFilteredRecords") {
        $records_arr = array();
        $records_arr["records"] = array();
        $records = returnFilteredRecords($_GET["stateId"],$_GET["locId"],$_GET["hType"],$_GET["numRooms"],$_GET["numBaths"],$_GET["numHalfBaths"],$_GET["numParkingPlace"]);
        foreach ($records as $recordsData) {
            $records_item = array(
                "Development_Name" => utf8_encode($recordsData[0]),
				"Model_Name" => utf8_encode($recordsData[1]),
				"Price" => $recordsData[2],
                "State" => utf8_encode($recordsData[3]),
				"Locality" => utf8_encode($recordsData[4]),
				"Type" => utf8_encode($recordsData[5]),
                "Rooms" => $recordsData[6],
				"Bathrooms" => $recordsData[7],
				"Half_Bathrooms" => $recordsData[8],
				"Parking_Spot" => $recordsData[9]
            );
            array_push($records_arr["records"], $records_item);
        }
        echo json_encode($records_arr);
	} else {	
		echo "Error";
	}
} else {
	echo "Error";
}
?>