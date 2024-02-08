<?php
function returnStoredState() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct st.Id, st.NameText from HousingDevelopment hd, Locality loc, State st
                    where hd.Locality_Id = loc.id and loc.State_Id = st.Id order by st.NameText";
		$sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnStoredLocByState($stateId) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct loc.Id, loc.NameText from HousingDevelopment hd, Locality loc, State st
                    where hd.Locality_Id = loc.id and loc.State_Id = st.Id and st.id = :stateId order by loc.NameText;";
        $sql = $db->prepare($string);
        $sql->bindParam(':stateId',$stateId);			
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnAllFeatures() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select distinct NameText, id from Feature where FeatureType_Id in (2,3) order by NameText asc";
        $sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnStoredStateNum() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct st.Id, st.NameText, count(st.NameText) as state_availability from HousingDevelopment hd, PropertyModel pm, Locality loc, 
		State st where hd.Id = pm.HousingDevelopment_id and hd.Locality_Id = loc.id and loc.State_Id = st.Id and hd.Flag_id = 1 group by st.NameText 
		order by state_availability desc, st.NameText asc;";
        $sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnStoredLocByStateNum($stateId) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct loc.Id, loc.NameText, count(loc.NameText) as loc_availability from HousingDevelopment hd, PropertyModel pm, Locality loc
		where hd.Id = pm.HousingDevelopment_id and hd.Locality_Id = loc.id and hd.Flag_id = 1 and loc.State_Id = :stateId group by loc.NameText 
		order by loc_availability desc, loc.NameText asc;";
		$sql = $db->prepare($string);
		$sql->bindParam(':stateId',$stateId);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnFilteredRecords($stateId, $locId, $hType, $numRooms, $numBaths, $numHalfBaths, $numParkingPlace) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct hd.Name, pm.Name, pm.Price, st.NameText, loc.NameText, pt.Name, 
		(Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 61) as NumberOfRooms, 
		(Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 12) as NumberOfBaths, 
		(Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 13) as NumberOfBaths, 
		(Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 36) as NumberOfParkingSpots 
		from HousingDevelopment hd, PropertyModel pm, Locality loc, State st, PropertyType pt
		where hd.Locality_Id = loc.Id and loc.State_Id = st.Id and hd.Id = pm.HousingDevelopment_id and pm.PropertyType_Id = pt.Id 
		and hd.Flag_id = 1 and pm.Flag_id = 1";

		if ($stateId != 'null') {
			$stateFilter = " and st.Id = :stateId";
			$string = $string . $stateFilter;
		}
		if ($locId != 'null') {
			$locFilter = " and loc.Id = :locId";
			$string = $string . $locFilter;
		}
		if ($hType != 'null') {
			if ($hType == 'house') {
				$hTypeFilter = " and pt.Id in (1,3,4,5,6,7,8)";
			} else {
				$hTypeFilter = " and pt.Id = 2";
			} 
			$string = $string . $hTypeFilter;
		}
		if ($numRooms != 'null') {
			$numRooms = intval($numRooms);
			if ($numRooms > 4) {
				$numRoomsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 61) >= :numRooms";
			} else {
				$numRoomsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 61) = :numRooms";
			} 
			$string = $string . $numRoomsFilter;
		}
		if ($numBaths != 'null') {
			$numBaths = intval($numBaths);
			if ($numBaths >= 4) {
				$numBathsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 12) >= :numBaths";
			} else {
				$numBathsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 12) = :numBaths";
			} 
			$string = $string . $numBathsFilter;
		}
		if ($numHalfBaths != 'null') {
			$numHalfBaths = intval($numHalfBaths);
			if ($numHalfBaths == 0) {
				$numHalfBathsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 13) is null";
			} else {
				$numHalfBathsFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 13) is not null";
			} 
			$string = $string . $numHalfBathsFilter;
		}
		if ($numParkingPlace != 'null') {
			$numParkingPlace = intval($numParkingPlace);
			if ($numParkingPlace > 4) {
				$numParkingPlaceFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 36) >= :numParkingPlace";
			} else if ($numParkingPlace == 0) {
				$numParkingPlaceFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 36) is null";
			} else {
				$numParkingPlaceFilter = " and (Select Quantity from PropertyModel_Feature where PropertyModel_Id = pm.Id and Feature_Id = 36) = :numParkingPlace";
			} 
			$string = $string . $numParkingPlaceFilter;
		}
		/*if (($minPrice != 'null') && ($maxPrice != 'null')) {
			$priceFilter = " and pm.Price between :minPrice and :maxPrice";
			$string = $string . $priceFilter;
		}*/

		$sql = $db->prepare($string);

		if ($stateId != 'null') {
			$sql->bindParam(':stateId',$stateId);	
		}	
		if ($locId != 'null') {
			$sql->bindParam(':locId',$locId);	
		}
		if ($numRooms != 'null') {
			$sql->bindParam(':numRooms',$numRooms);	
		}
		if ($numBaths != 'null') {
			$sql->bindParam(':numBaths',$numBaths);	
		}
		if ($numParkingPlace != 'null') {
			$sql->bindParam(':numParkingPlace',$numParkingPlace);	
		}
		/*if (($minPrice != 'null') && ($maxPrice != 'null')) {
			$sql->bindParam(':minPrice',$minPrice);	
			$sql->bindParam(':maxPrice',$maxPrice);	
		}*/

		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
?>



