<?php
ini_set('mysql.connect_timeout','0');   
ini_set('max_execution_time', '0'); 
date_default_timezone_set('America/Mexico_City');

function returnContactsList($qOffset, $qLimit, $filters, $searchString, $order) {
	//print_r($filters);
	//die();
    include ("../bat/DBconection.php");
	try {
		$fields = array("c.Id", "c.ExternalId", "concat(trim(c.Name), ' ', trim(c.LastName))", "c.Phone", "c.Email", "cs.Name", "concat(trim(col.Name), ' ', trim(col.LastName))", "st.Name", "loc.Name", "c.UtcCreatedAt", "c.UtcModifiedAt");
		$filters = json_decode($filters, true);

		$conversationStatus = null;
		if (isset($filters['conversationStatus']) && count($filters['conversationStatus']) > 0) {
			$conversationStatus = 'and c.ConversionStatus_Id in (';
			for ($i=0; $i<count($filters['conversationStatus']); $i++) {
				$conversationStatus .= $filters['conversationStatus'][$i].',';
			}
			$conversationStatus = substr($conversationStatus, 0, -1);
			$conversationStatus .= ')';
		}

		$contactOwner = null;
		if (isset($filters['contactOwner']) && count($filters['contactOwner']) > 0) {
			$contactOwner = 'and c.Collaborator_OwnerId in (';
			for ($i=0; $i<count($filters['contactOwner']); $i++) {
				$contactOwner .= $filters['contactOwner'][$i].',';
			}
			$contactOwner = substr($contactOwner, 0, -1);
			$contactOwner .= ')';
		}

		$state = null;
		if (isset($filters['state']) && count($filters['state']) > 0) {
			$state = 'and c.InterestState_Id in (';
			for ($i=0; $i<count($filters['state']); $i++) {
				$state .= $filters['state'][$i].',';
			}
			$state = substr($state, 0, -1);
			$state .= ')';
		}

		$locality = null;
		if (isset($filters['locality']) && count($filters['locality']) > 0) {
			$locality = 'and c.InterestLocality_Id in (';
			for ($i=0; $i<count($filters['locality']); $i++) {
				$locality .= $filters['locality'][$i].',';
			}
			$locality = substr($locality, 0, -1);
			$locality .= ')';
		}

		$favorite = null;
		if (isset($filters['otherOptions']) && count($filters['otherOptions']) > 0) {
			for ($i=0; $i<count($filters['otherOptions']); $i++) {
				if ($filters['otherOptions'][$i] == 'favorite') {
					$favorite = 'and Favorite = 1';
				}
			}
		}

		if ($order == 'none') {
			$data = "UtcModifiedAt desc";
		} else {
			$dataArray = explode("-",$order);
			$data = $fields[$dataArray[0]].' '.$dataArray[1]; 
		}

        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select c.Id, c.ExternalId, concat(COALESCE(trim(c.Name),''), ' ', COALESCE(trim(c.LastName),'')), c.Phone, c.Email, cs.Name, 
		concat(trim(col.Name), ' ', trim(col.LastName)), st.Name, loc.Name, DATE_FORMAT(from_unixtime(c.UtcCreatedAt),'%d/%m/%Y'), 
		DATE_FORMAT(from_unixtime(c.UtcModifiedAt),'%d/%m/%Y'), WaFlag_Id
		from tratodirecto_hu.Contact c 
		left join tratodirecto_hu.ConversionStatus cs on cs.Id = c.ConversionStatus_Id
		left join tratodirecto_hu.Collaborator col on col.Id = c.Collaborator_OwnerId
		left join tratodirecto_hu.State st on st.Id = c.InterestState_Id
		left join tratodirecto_hu.Locality loc on loc.Id = c.InterestLocality_Id 
		where ((lower(concat(c.Name, c.LastName)) like lower(replace('%$searchString%', ' ', '%'))
		or lower(concat(c.LastName, c.Name)) like lower(replace('%$searchString%', ' ', '%')))
		or lower(concat(c.Phone)) like lower(replace('%$searchString%', ' ', '%')))
		$conversationStatus $contactOwner $state $locality $favorite
		order by $data limit $qOffset,$qLimit;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnContactsListCount($filters, $searchString) {
    include ("../bat/DBconection.php");
	try {
		$filters = json_decode($filters, true);
		
		$conversationStatus = null;
		if (isset($filters['conversationStatus']) && count($filters['conversationStatus']) > 0) {
			$conversationStatus = 'and c.ConversionStatus_Id in (';
			for ($i=0; $i<count($filters['conversationStatus']); $i++) {
				$conversationStatus .= $filters['conversationStatus'][$i].',';
			}
			$conversationStatus = substr($conversationStatus, 0, -1);
			$conversationStatus .= ')';
		}

		$conversationStatus = null;
		if (isset($filters['conversationStatus']) && count($filters['conversationStatus']) > 0) {
			$conversationStatus = 'and c.ConversionStatus_Id in (';
			for ($i=0; $i<count($filters['conversationStatus']); $i++) {
				$conversationStatus .= $filters['conversationStatus'][$i].',';
			}
			$conversationStatus = substr($conversationStatus, 0, -1);
			$conversationStatus .= ')';
		}

		$contactOwner = null;
		if (isset($filters['contactOwner']) && count($filters['contactOwner']) > 0) {
			$contactOwner = 'and c.Collaborator_OwnerId in (';
			for ($i=0; $i<count($filters['contactOwner']); $i++) {
				$contactOwner .= $filters['contactOwner'][$i].',';
			}
			$contactOwner = substr($contactOwner, 0, -1);
			$contactOwner .= ')';
		}

		$state = null;
		if (isset($filters['state']) && count($filters['state']) > 0) {
			$state = 'and c.InterestState_Id in (';
			for ($i=0; $i<count($filters['state']); $i++) {
				$state .= $filters['state'][$i].',';
			}
			$state = substr($state, 0, -1);
			$state .= ')';
		}

		$locality = null;
		if (isset($filters['locality']) && count($filters['locality']) > 0) {
			$locality = 'and c.InterestLocality_Id in (';
			for ($i=0; $i<count($filters['locality']); $i++) {
				$locality .= $filters['locality'][$i].',';
			}
			$locality = substr($locality, 0, -1);
			$locality .= ')';
		}

		$favorite = null;
		if (isset($filters['otherOptions']) && count($filters['otherOptions']) > 0) {
			for ($i=0; $i<count($filters['otherOptions']); $i++) {
				if ($filters['otherOptions'][$i] == 'favorite') {
					$favorite = 'and Favorite = 1';
				}
			}
		}

        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select count(c.Id) 
		from tratodirecto_hu.Contact c 
		left join tratodirecto_hu.ConversionStatus cs on cs.Id = c.ConversionStatus_Id
		left join tratodirecto_hu.Collaborator col on col.Id = c.Collaborator_OwnerId
		left join tratodirecto_hu.State st on st.Id = c.InterestState_Id
		left join tratodirecto_hu.Locality loc on loc.Id = c.InterestLocality_Id 
		where ((lower(concat(c.Name, c.LastName)) like lower(replace('%$searchString%', ' ', '%'))
		or lower(concat(c.LastName, c.Name)) like lower(replace('%$searchString%', ' ', '%')))
		or lower(concat(c.Phone)) like lower(replace('%$searchString%', ' ', '%')))
		$conversationStatus $contactOwner $state $locality $favorite";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
?>