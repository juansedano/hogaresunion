<?php
date_default_timezone_set('America/Mexico_City');
function getUserData($userMail) {
    require __DIR__ . '/../bat/DBconection.php';
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select Id as id, concat(Name, ' ', LastName) as name, Email as email, Role_Id as developerRole, CurrentlyWorking as isActive, LoginTime as lastActivity 
		from tratodirecto_hu.Collaborator where Email = :userMail and SessionId = :sessionId and Flag_Id = 1 and Role_Id in (1,2,3,4) LIMIT 1;";
        $sql = $db->prepare($string);
		$sql->bindParam(':userMail',$userMail);
		$sql->bindParam(':sessionId',$_SESSION['sessionid']);
		$sql->execute();	
		$row = $sql->fetch();
        $db = null;
		return $row;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function insertSessionId($userMail, $sessionId) {
    require __DIR__ . '/../bat/DBconection.php';
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $string = "Update tratodirecto_hu.Collaborator set SessionId = :sessionId, LoginTime = unix_timestamp()
		where Email = :userMail and Flag_Id = 1 and Role_Id in (1,2,3,4);";
        $sql = $db->prepare($string);
        $sql->bindParam(':userMail',$userMail);
		$sql->bindParam(':sessionId',$sessionId);
		if ($sql->execute()) {
			$result = true;
		} else {
			$result = false;
		}
		$db->commit();
		$db = null;
		return $result;
	} catch (PDOException $e) {
		return 'error';
	}
}
?>