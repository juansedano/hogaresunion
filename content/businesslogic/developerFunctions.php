<?php
function returnDeveloperName() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Distinct Id, NameText from HousingDeveloper order by NameText";
		$sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
function returnDevelopmentInfo($developerId) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select Id, Name from HousingDevelopment where HousingDeveloper_id = :developerName";
		$sql = $db->prepare($string);	
		$sql->bindParam(':developerName',$developerId);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
function returnDeveloperInfo($developerId) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select dev.Id, dev.NameText, dev.Flag_Id, f.Name, dev.Media_Id, m.FileName, m.Path
		from HousingDeveloper dev, Flag f, Media m where dev.Id = :developerId and dev.Flag_Id = f.Id and 
		dev.Media_Id = m.Id";
		$sql = $db->prepare($string);	
		$sql->bindParam(':developerId',$developerId);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
function returnFlags() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select * from Flag where id <> 0";
		$sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnAttributes() {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select distinct NameText, id from Feature order by NameText asc";
		$sql = $db->prepare($string);		
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnAddressInfo($postalcode) {
	include ("businesslogic/dbconnection/cfg.php");
	try {
		$db = new PDO('mysql:host='.$server.';dbname='.$db,$db_user,$db_password);
		$string = "Select state, location, neighborhood, Id from PostalCodes where postalCode = :postalcode order by neighborhood asc";
		$sql = $db->prepare($string);
		$sql->bindParam(':postalcode',$postalcode);			
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
?>