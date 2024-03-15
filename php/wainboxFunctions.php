<?php
ini_set('mysql.connect_timeout','0');   
ini_set('max_execution_time', '0'); 
date_default_timezone_set('America/Mexico_City');

function verifyContactMessages($contactId, $instance) {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Phone from tratodirecto_hu.Contact where Id = :contactId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId',$contactId);
        $sql->execute();
        $row = $sql->fetch();
        if ($row) {
            $contactPhone = $row[0];
            $string = "Select Contact_Id from tratodirecto_hu.Log_".$instance." where Contact_Id = :contactId limit 1;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId',$contactId);
            $sql->execute();
            $row = $sql->fetch();
            if ($row) {
                return 'found with messages';
            } else {
                $activeMessagesFlag = activeMessagesFlag($contactId);
                $logData = array(
                    "id" => $contactId, 
                    "instance" => $instance,
                    "phone" => $contactPhone, 
                    "type" => 'text', 
                    "message" => 'El contacto fue dado de alta el 04 de Febrero de 2024 a las 15:26 por Enrique Lara M.',
                    "providerId" => 'internal_'.$contactPhone.'@'.date("Ymdhis"),
                    "internal" => 1
                );
                $result = addMsg2Log($logData, 5);
                return 'found without messages';
            }
        } else {
            return 'none';
        }

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function activeMessagesFlag($contactId) {
	include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
		$string = "Update tratodirecto_hu.Contact set UtcModifiedAt = unix_timestamp(), WaFlag_Id = 1 where Id = :contactId";
		$sql = $db->prepare($string);
        $sql->bindParam(':contactId', $contactId);
		if ($sql->execute()) {
            $result = array(
                "result" => 'success',
                "msgId" => null
            );
		} else {
            $result = array(
                "result" => 'error',
                "msgId" => null
            );
		}

        $db->commit();
        $db = null;
		return $result;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnInstances() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Name as 'name', SUBSTRING(Phone, -10) as 'phone', Instance as 'id', Provider as 'provider' 
        from tratodirecto_hu.API where Flag_Id in (3) and Instance is not null order by Sequence;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnAdvisers() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', concat(Name, ' ', LastName) as 'name'
		from tratodirecto_hu.Collaborator where Flag_Id = 1 and Role_Id in (1,2,3) order by name, lastName;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnContactType() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.ContactType order by name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnContactOrigin() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.ContactOrigin order by name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnConversionStatus() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.ConversionStatus order by name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnState() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.State order by name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnLocality() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name', State_Id as 'stateId' from tratodirecto_hu.Locality order by State_Id, Name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnMaritalStatus() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.MaritalStatus where Id <> 0 order by name;"; 
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnProduct() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.BuyingProduct where BuyingProduct.BuyingFeatureType_Id = 1 order by Sequence;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnProductCoaccredited() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.BuyingProduct where BuyingProduct.BuyingFeatureType_Id = 2 order by Sequence;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnSocialCategory() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', NameText as 'name' from tratodirecto_hu.ContactProfile where Id <> 0 order by id;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnGender() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.Gender where Id <> 0 order by id;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnIdentificationType() {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Id as 'id', Name as 'name' from tratodirecto_hu.IdentificationType where Id <> 0 order by id;";
        $sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnContactData($activeMessagesContactId, $userSessionRole) {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));

        $string = "Select c.Id as 'id', c.ExternalId as 'external_Id', c.Name as 'name', c.LastName as 'lastName', 
        c.ShortName as 'shortName', c.Gender_Id as 'gender_Id', c.Phone as 'phone', c.OtherPhone as 'otherPhone',
        c.Email as 'email', c.ConversionStatus_Id as 'conversionStatus_Id', c.Collaborator_OwnerId as 'collaborator_OwnerId',
        c.ContactType_Id  as 'contactType_Id', c.ContactOrigin_Id  as 'contactOrigin_Id', c.ContactProfile_Id  as 'contactProfile_Id', 
        c.FacebookProfile as 'facebookProfile', c.InstagramProfile as 'instagramProfile', c.LinkedinProfile as 'linkedinProfile',  
        c.VisitedUrl as 'visitedUrl', c.InterestState_Id as 'interestState_Id', c.InterestLocality_Id as 'interestLocality_Id',
        a1.Name as 'accredited1Name', a1.LastName as 'accredited1LastName', a1.SecondLastName as 'accredited1SecondLastName', 
        a1.Email as 'accredited1Email', a1.Phone as 'accredited1Phone', a1.Gender_Id as 'accredited1Gender_Id', 
        a1.Curp as 'accredited1Curp', a1.Nss as 'accredited1Nss', a1.Rfc as 'accredited1Rfc', 
        a1.IdentificationType_Id as 'accredited1IdentificationType_Id', a1.IdentificationId as 'accredited1IdentificationId',
        a1.Company as 'accredited1Company', a1.DateOfBirth as 'accredited1dateOfBirth', a1.PlaceOfBirth as 'accredited1PlaceOfBirth', 
        a1.MaritalStatus_Id as 'accredited1MaritalStatus_Id', a1.Street as 'accredited1Street', 
        a1.Neighborhood as 'accredited1Neighborhood', a1.PostalCode as 'accredited1PostalCode', a1.State_Id  as 'accredited1State_Id',
        a1.Locality_Id as 'accredited1Locality_Id', a1.BuyingProduct_Id as 'accredited1BuyingProduct_Id', 
        a1.BuyingProductOther as 'accredited1BuyingProductOther', a1.MonthlyIncome as 'accredited1MonthlyIncome', 
        a1.MonthlyPay as 'accredited1MonthlyPay', a1.CarCredit as 'accredited1CarCredit', a1.CurrentCredit as 'accredited1CurrentCredit', 
        a1.CreditNumber as 'accredited1CreditNumber', a1.CreditAmount as 'accredited1CreditAmount', 
        a1.SubAccountAmount as 'accredited1SubAccountAmount', a1.TitlingExpenses as 'accredited1TitlingExpenses',
        a1.AvailableSavings as 'accredited1AvailableSavings', a1.HouseBudget as 'accredited1HouseBudget', a1.Taxes as 'accredited1Taxes',
        a2.Name as 'accredited2Name', a2.LastName as 'accredited2LastName', a2.SecondLastName as 'accredited2SecondLastName', 
        a2.Email as 'accredited2Email', a2.Phone as 'accredited2Phone', a2.Gender_Id as 'accredited2Gender_Id', 
        a2.Curp as 'accredited2Curp', a2.Nss as 'accredited2Nss', a2.Rfc as 'accredited2Rfc', 
        a2.IdentificationType_Id as 'accredited2IdentificationType_Id', a2.IdentificationId as 'accredited2IdentificationId',
        a2.Company as 'accredited2Company', a2.DateOfBirth as 'accredited2dateOfBirth', a2.PlaceOfBirth as 'accredited2PlaceOfBirth', 
        a2.MaritalStatus_Id as 'accredited2MaritalStatus_Id', a2.Street as 'accredited2Street', 
        a2.Neighborhood as 'accredited2Neighborhood', a2.PostalCode as 'accredited2PostalCode', a2.State_Id  as 'accredited2State_Id',
        a2.Locality_Id as 'accredited2Locality_Id', a2.BuyingProduct_Id as 'accredited2BuyingProduct_Id', 
        a2.BuyingProductOther as 'accredited2BuyingProductOther', a2.MonthlyIncome as 'accredited2MonthlyIncome', 
        a2.MonthlyPay as 'accredited2MonthlyPay', a2.CarCredit as 'accredited2CarCredit', a2.CurrentCredit as 'accredited2CurrentCredit', 
        a2.CreditNumber as 'accredited2CreditNumber', a2.CreditAmount as 'accredited2CreditAmount', 
        a2.SubAccountAmount as 'accredited2SubAccountAmount', a2.TitlingExpenses as 'accredited2TitlingExpenses',
        a2.AvailableSavings as 'accredited2AvailableSavings', a2.HouseBudget as 'accredited2HouseBudget', a2.Taxes as 'accredited2Taxes',
        co.BuyingProduct_Id as 'coacreditedBuyingProduct_Id', co.Budget as 'coacreditedBudget'
        from tratodirecto_hu.Contact c 
        left join tratodirecto_hu.Accredited1 a1 on a1.Contact_Id = c.Id
        left join tratodirecto_hu.Accredited2 a2 on a2.Contact_Id = c.Id 
        left join tratodirecto_hu.CoAccredited co on co.Contact_Id = c.Id 
        where c.Id = :contactId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId',$activeMessagesContactId);
		$sql->execute();
        $row = $sql->fetch();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function updateUserData($activeMessagesContactId, $contactId, $userDataChanges, $userId, $userSessionRole) {
    $activeMessagesContactId = 1;
	include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $flag = 0;
        foreach($userDataChanges as $key=>$value) {  
            if (substr($key, 0, 11) == "Accredited1") {
                $accredited1[$key] = $value;
            } elseif (substr($key, 0, 11) == "Accredited2") {
                $accredited2[$key] = $value;
            } elseif (substr($key, 0, 11) == "Coacredited") {
                $coacredited[$key] = $value;
            } else {
                $user[$key] = $value;
            }
        }

        if (isset($accredited1)) {
			$string = "Select Id from tratodirecto_hu.Accredited1 where Contact_Id = :contactId;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId',$activeMessagesContactId);
            $sql->execute();
            $row = $sql->fetch();
            if (!$row) {
                $string = "Insert into tratodirecto_hu.Accredited1 (Contact_Id) values (:contactId);";
                $sql = $db->prepare($string);
                $sql->bindParam(':contactId',$activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            } 

            foreach($accredited1 as $key=>$value) {
                $fieldName = substr($key, 11);
                $string = "Update tratodirecto_hu.Accredited1 set $fieldName = :value where Contact_Id = :contactId";
                $sql = $db->prepare($string);
                $sql->bindParam(':value', $value);
                $sql->bindParam(':contactId', $activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            }
        }

        if (isset($accredited2)) {
			$string = "Select Id from tratodirecto_hu.Accredited2 where Contact_Id = :contactId;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId',$activeMessagesContactId);
            $sql->execute();
            $row = $sql->fetch();
            if (!$row) {
                $string = "Insert into tratodirecto_hu.Accredited2 (Contact_Id) values (:contactId);";
                $sql = $db->prepare($string);
                $sql->bindParam(':contactId',$activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            } 

            foreach($accredited2 as $key=>$value) {
                $fieldName = substr($key, 11);
                $string = "Update tratodirecto_hu.Accredited2 set $fieldName = :value where Contact_Id = :contactId";
                $sql = $db->prepare($string);
                $sql->bindParam(':value', $value);
                $sql->bindParam(':contactId', $activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            }
        }

        if (isset($coacredited)) {
			$string = "Select Id from tratodirecto_hu.CoAccredited where Contact_Id = :contactId;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId',$activeMessagesContactId);
            $sql->execute();
            $row = $sql->fetch();
            if (!$row) {
                $string = "Insert into tratodirecto_hu.CoAccredited (Contact_Id) values (:contactId);";
                $sql = $db->prepare($string);
                $sql->bindParam(':contactId',$activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            } 

            foreach($coacredited as $key=>$value) {
                $fieldName = substr($key, 11);
                $string = "Update tratodirecto_hu.CoAccredited set $fieldName = :value where Contact_Id = :contactId";
                $sql = $db->prepare($string);
                $sql->bindParam(':value', $value);
                $sql->bindParam(':contactId', $activeMessagesContactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            }
        }

        if (isset($user)) {
            foreach($user as $key=>$value) {
                $string = "Update tratodirecto_hu.Contact set $key = :value, UtcModifiedAt = unix_timestamp() where Id = :contactId";
                $sql = $db->prepare($string);
                $sql->bindParam(':value', $value);
                $sql->bindParam(':contactId', $contactId);
                if (!$sql->execute()) {
                    $db->rollback();
                    $db = null;
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                    return $result;
                }
            }
        }

        $db->commit();
        $db = null;
        $result = array(
            "result" => 'success'
        );
		return $result;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnContacts($initializingFlag, $range, $lastMessageId, $instance, $userId, $userSessionRole) {
	include ("../bat/DBconection.php");
	try {
		//$range = 1;
		if ($range == '0') {
			$whereParams = 'and from_unixtime(ProviderUTC) >= now() - INTERVAL 1 DAY'; #últimas 24 horas
		} elseif ($range == '1') {
		 	$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 2) and adddate(current_date(), 1)'; #últimos 3 días
		} elseif ($range == '2') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 7) and subdate(current_date(), 2)'; #4 a 7
		} elseif ($range == '3') {			
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 15) and subdate(current_date(), 7)'; #8 a 15
		} elseif ($range == '4') {			
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 30) and subdate(current_date(), 15)'; #16 a 30
		} elseif ($range == '5') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 45) and subdate(current_date(), 30)'; #31 a 45
		} elseif ($range == '6') {			
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 60) and subdate(current_date(), 45)'; #46 a 60
		} elseif ($range == '7') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 75) and subdate(current_date(), 60)'; #61 a 75
		} elseif ($range == '8') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 90) and subdate(current_date(), 75)'; #76 a 90
		} elseif ($range == '9') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 105) and subdate(current_date(), 90)'; #91 a 105
		} elseif ($range == '10') {
			$whereParams = 'and from_unixtime(ProviderUTC) between subdate(current_date(), 120) and subdate(current_date(), 105)'; #106 a 120
		} else {
			$whereParams = '';
		}

        if ($initializingFlag == 1) {
            $order = 'desc';
        } else {
            $order = 'asc';
        }
        
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select distinct log.Id as 'lastMessageId', REPLACE(log.Contact_Id, ' ', '') as 'contactId', log.Instance as 'instance', log.Internal as 'isInternal', 
        DATE_FORMAT(from_unixtime(log.ProviderUTC),'%d/%m/%Y') as 'lastMessageDate', DATE_FORMAT(from_unixtime(log.ProviderUTC),'%H:%i') as 'lastMessageTime',
        trim(c.Name) as 'firstName', trim(c.LastName) as 'lastName', trim(c.ShortName) as 'shortName', trim(c.Email) as 'email', trim(c.Phone) as 'phone', ifnull(trim(tcol.Name),'Bot') as 'adviserName', 
        ifnull(trim(tcol.LastName),'HU') as 'adviserLastName', log.Flag_Id as 'msgType', c.Favorite as 'isFavorite', if(t.Id is null, 0, 1) as 'hasTask', 
        ifnull(sm.Id, 0) as 'hasScheduledMsg', if ((unix_timestamp() - log.ProviderUTC) >= 86400, 1, 0) as 'timedif'
        from tratodirecto_hu.Log_".$instance." log
        left join tratodirecto_hu.Contact c on c.Id = log.Contact_Id and c.Flag_Id != 27
        left join tratodirecto_hu.Contact_Collaborator hbc on hbc.Contact_Id = log.Contact_Id and hbc.Flag_Id = 3
        left join tratodirecto_hu.Collaborator tcol on tcol.Id = hbc.Collaborator_Id
        left join tratodirecto_hu.Task t on t.Contact_Id = log.Contact_Id and t.Flag_Id = 3
        left join tratodirecto_hu.ScheduledMessage sm on sm.Contact_Id = log.Contact_Id and sm.Flag_Id = 3
        where log.Id in (Select max(Id) from tratodirecto_hu.Log_".$instance." where Internal not in (1, 4) and Flag_Id <> 24 and Id > :lastMessageId
        and Instance is not null group by Contact_Id, Instance) and c.Phone is not null
        order by log.ProviderUTC ".$order.";";
        $sql = $db->prepare($string);
        $sql->bindParam(':lastMessageId', $lastMessageId); 
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		return null;
	}
}

function returnMessages($contactLastMessageId, $contactId, $instance, $userId, $userSessionRole) {
	include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::ATTR_TIMEOUT => 5, PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));	
		$string = "Select l.Id as id, l.ProviderUTC as providerUTC, concat(c.Name, ' ', c.LastName) as 'adviser', 
		DATE_FORMAT(from_unixtime(l.ProviderUTC),'%H:%i') as 'time', DATE_FORMAT(from_unixtime(l.ProviderUTC),'%d/%m/%Y') as 'date',
		if(l.SenderName is null, 'HU', l.SenderName) as 'senderName', l.MsgFile as 'fileURL', l.Caption as 'caption', l.Internal as 'internal',
		substring(trim(l.Author), 1, 10) as 'author', l.MsgText as 'msgText', l.Type as 'fileType'
		from tratodirecto_hu.Log_".$instance." l left join tratodirecto_hu.Collaborator c on c.Id = l.Adviser_Id
		where l.Contact_Id = :contactId and l.Instance = :instance and l.Id > :contactLastMessageId order by l.ProviderUtc asc;";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId',$contactId);
		$sql->bindParam(':instance',$instance);
		$sql->bindParam(':contactLastMessageId',$contactLastMessageId);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		return null;
	}
}

function returnContactFiles($activeMessagesContactId) {
	include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::ATTR_TIMEOUT => 5, PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));	
		$string = "Select Id as 'id', FileUrl as 'url', FileName as 'name', DATE_FORMAT(from_unixtime(CreatedAt),'%d/%m/%Y') as 'date',
        DATE_FORMAT(from_unixtime(CreatedAt),'%H:%i') as 'time'
        from tratodirecto_hu.Contact_File where Contact_Id = :contactId and Flag_Id = 3 order by Id desc;";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId',$activeMessagesContactId);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		return null;
	}
}

function deleteContactFiles($activeMessagesContactId, $fileId) {
	include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
		$string = "Update tratodirecto_hu.Contact_File set Flag_Id = 4 where Id = :fileId and HubspotContact_Id = :contactId";
		$sql = $db->prepare($string);
        $sql->bindParam(':fileId', $fileId);
        $sql->bindParam(':contactId', $activeMessagesContactId);
		if ($sql->execute()) {
            $result = array(
                "result" => 'success',
                "msgId" => null
            );
		} else {
            $result = array(
                "result" => 'error',
                "msgId" => null
            );
		}

        $db->commit();
        $db = null;
		return $result;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnAdvancedSearch($serchType, $text, $instance, $userId, $userSessionRole) {
    //echo $instance.'|'.$text.'|'.$serchType;
    //die();
	include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::ATTR_TIMEOUT => 5, PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));	
        if ($serchType == 'contactId') {
            $string = "Select distinct log.Id as 'lastMessageId', REPLACE(log.Contact_Id, ' ', '') as 'contactId', log.Instance as 'instance', log.Internal as 'isInternal', 
            DATE_FORMAT(from_unixtime(log.ProviderUTC),'%d/%m/%Y') as 'lastMessageDate', DATE_FORMAT(from_unixtime(log.ProviderUTC),'%H:%i') as 'lastMessageTime',
            trim(c.Name) as 'firstName', trim(c.LastName) as 'lastName', trim(c.Email) as 'email', trim(c.Phone) as 'phone', ifnull(trim(tcol.Name),'Bot') as 'adviserName', 
            ifnull(trim(tcol.LastName),'HU') as 'adviserLastName', log.Flag_Id as 'msgType', c.Favorite as 'isFavorite', if(t.Id is null, 0, 1) as 'hasTask', 
            ifnull(sm.Id, 0) as 'hasScheduledMsg', if ((unix_timestamp() - log.ProviderUTC) >= 86400, 1, 0) 
            from tratodirecto_hu.Log_".$instance." log
            left join tratodirecto_hu.Contact c on c.Id = log.Contact_Id and c.Flag_Id != 27
            left join tratodirecto_hu.Contact_Collaborator hbc on hbc.Contact_Id = log.Contact_Id and hbc.Flag_Id = 3
            left join tratodirecto_hu.Collaborator tcol on tcol.Id = hbc.Collaborator_Id
            left join tratodirecto_hu.Task t on t.Contact_Id = log.Contact_Id and t.Flag_Id = 3
            left join tratodirecto_hu.ScheduledMessage sm on sm.Contact_Id = log.Contact_Id and sm.Flag_Id = 3            
            where log.Id in (Select max(Id) from tratodirecto_hu.Log_".$instance." where Internal not in (4) and Flag_Id <> 24 and Id > 0 and Contact_Id = :contactId
            and Instance is not null group by Contact_Id, Instance) and c.Phone is not null
            order by log.ProviderUTC asc;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId',$text);
        } elseif ($serchType == 'contactName') {
            $string = "Select distinct log.Id as 'lastMessageId', REPLACE(log.Contact_Id, ' ', '') as 'contactId', log.Instance as 'instance', log.Internal as 'isInternal', 
            DATE_FORMAT(from_unixtime(log.ProviderUTC),'%d/%m/%Y') as 'lastMessageDate', DATE_FORMAT(from_unixtime(log.ProviderUTC),'%H:%i') as 'lastMessageTime',
            trim(c.Name) as 'firstName', trim(c.LastName) as 'lastName', trim(c.Email) as 'email', trim(c.Phone) as 'phone', ifnull(trim(tcol.Name),'Bot') as 'adviserName', 
            ifnull(trim(tcol.LastName),'HU') as 'adviserLastName', log.Flag_Id as 'msgType', c.Favorite as 'isFavorite', if(t.Id is null, 0, 1) as 'hasTask', 
            ifnull(sm.Id, 0) as 'hasScheduledMsg', if ((unix_timestamp() - log.ProviderUTC) >= 86400, 1, 0) 
            from tratodirecto_hu.Log_".$instance." log
            left join tratodirecto_hu.Contact c on c.Id = log.Contact_Id and c.Flag_Id != 27
            left join tratodirecto_hu.Contact_Collaborator hbc on hbc.Contact_Id = log.Contact_Id and hbc.Flag_Id = 3
            left join tratodirecto_hu.Collaborator tcol on tcol.Id = hbc.Collaborator_Id
            left join tratodirecto_hu.Task t on t.Contact_Id = log.Contact_Id and t.Flag_Id = 3
            left join tratodirecto_hu.ScheduledMessage sm on sm.Contact_Id = log.Contact_Id and sm.Flag_Id = 3  
            where log.Id in (Select max(Id) from tratodirecto_hu.Log_".$instance." where Internal not in (4) and Flag_Id <> 24 and Id > 0
            and Instance is not null group by Contact_Id, Instance) and c.Phone is not null 
            and (lower(concat(c.Name, c.LastName)) like lower(replace('%".$text."%', ' ', '%'))
            or lower(concat(c.LastName, c.Name)) like lower(replace('%".$text."%', ' ', '%')))
            order by log.ProviderUTC asc;";
            $sql = $db->prepare($string);
        } elseif ($serchType == 'contactPhone') {
            $phone = substr(trim($text), -10);
            $string = "Select distinct log.Id as 'lastMessageId', REPLACE(log.Contact_Id, ' ', '') as 'contactId', log.Instance as 'instance', log.Internal as 'isInternal', 
            DATE_FORMAT(from_unixtime(log.ProviderUTC),'%d/%m/%Y') as 'lastMessageDate', DATE_FORMAT(from_unixtime(log.ProviderUTC),'%H:%i') as 'lastMessageTime',
            trim(c.Name) as 'firstName', trim(c.LastName) as 'lastName', trim(c.Email) as 'email', trim(c.Phone) as 'phone', ifnull(trim(tcol.Name),'Bot') as 'adviserName', 
            ifnull(trim(tcol.LastName),'HU') as 'adviserLastName', log.Flag_Id as 'msgType', c.Favorite as 'isFavorite', if(t.Id is null, 0, 1) as 'hasTask', 
            ifnull(sm.Id, 0) as 'hasScheduledMsg', if ((unix_timestamp() - log.ProviderUTC) >= 86400, 1, 0) 
            from tratodirecto_hu.Log_".$instance." log
            left join tratodirecto_hu.Contact c on c.Id = log.Contact_Id and c.Flag_Id != 27
            left join tratodirecto_hu.Contact_Collaborator hbc on hbc.Contact_Id = log.Contact_Id and hbc.Flag_Id = 3
            left join tratodirecto_hu.Collaborator tcol on tcol.Id = hbc.Collaborator_Id
            left join tratodirecto_hu.Task t on t.Contact_Id = log.Contact_Id and t.Flag_Id = 3
            left join tratodirecto_hu.ScheduledMessage sm on sm.Contact_Id = log.Contact_Id and sm.Flag_Id = 3  
            where log.Id in (Select max(Id) from tratodirecto_hu.Log_".$instance." where Internal not in (4) and Flag_Id <> 24 and Id > 0 and Phone like '%".$text."%'
            and Instance is not null group by Contact_Id, Instance) and c.Phone is not null
            order by log.ProviderUTC asc;";
            $sql = $db->prepare($string);
        }
        $sql->execute();
        $row = $sql->fetchAll();  
		$db = null;
		return $row;
	} catch (PDOException $e) {
		return null;
	}
}

function returnScheduleMessage($activeMessagesContactId, $activeMessagesInstance) {
    include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select Id as 'id', Collaborator_Id as 'adviserId', Contact_Id as 'contactId', ContactPhone as 'contactPhone', 
        Instance as 'instance', Template as 'template', Message as 'message', 
        DATE_FORMAT(from_unixtime(ScheduleUTC),'%d/%m/%Y') as 'scheduleDate', DATE_FORMAT(from_unixtime(ScheduleUTC),'%H:%i') as 'scheduleTime'
		from tratodirecto_hu.ScheduledMessage where Contact_Id = :id and Instance = :instance and Flag_Id = 3;";
		$sql = $db->prepare($string);
		$sql->bindParam(':id',$activeMessagesContactId);
		$sql->bindParam(':instance',$activeMessagesInstance);		
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function saveScheduleMessage($activeMessagesContactId, $activeMessagesInstance, $activeMessagesPhone, $activeMessagesProvider, $messageTemplate, $messageTxt, $messageUTC, $userId, $userName, $userSessionRole) {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

		$string = "Select Id from tratodirecto_hu.ScheduledMessage where Contact_Id = :id and Instance = :instance and Flag_Id = 3;";
		$sql = $db->prepare($string);
		$sql->bindParam(':id',$activeMessagesContactId);
		$sql->bindParam(':instance',$activeMessagesInstance);		
		$sql->execute();
		$row = $sql->fetch();
		if (!($row)) {
			$string = "Insert into tratodirecto_hu.ScheduledMessage (Collaborator_Id, Contact_Id, ContactPhone, Instance, Template, Message, CreatedAt, CreatedBy, ScheduleUTC, Flag_Id) 
			values (:adviser, :id, :phone, :instance, :template, :message, unix_timestamp(), :createdBy, :utc, 3);";
			$sql = $db->prepare($string);
			$sql->bindParam(':adviser',$userId);
			$sql->bindParam(':template',$messageTemplate);
			$sql->bindParam(':message',$messageTxt);
			$sql->bindParam(':id',$activeMessagesContactId);
			$sql->bindParam(':instance',$activeMessagesInstance);
			$sql->bindParam(':phone',$activeMessagesPhone);
            $sql->bindParam(':createdBy',$userId);
			$sql->bindParam(':utc',$messageUTC);
			if (!($sql->execute())) {
                $result = array(
                    "result" => 'error',
                    "msgId" => null
                );
			}

            $logData = array(
                "id" => $activeMessagesContactId, 
                "instance" => $activeMessagesInstance,
                "phone" => $activeMessagesPhone, 
                "type" => 'text', 
                "message" => $userName.' programó este mensaje para el '.getFormatedDateWithMonthName(date("Y-m-d", $messageUTC)).' a las '.date("H:i", $messageUTC).' hrs.' . chr(10) . $messageTxt,
                "providerId" => 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis"),
                "internal" => 1
            );
            $result = addMsg2Log($logData, $userId);
            if ($result != 'error') {
                $result = array(
                    "result" => 'success',
                    "msgId" => $result
                );
            } else {
                $result = array(
                    "result" => 'error',
                    "msgId" => null
                );
            }
        } else {
            $string = "Update tratodirecto_hu.ScheduledMessage set Collaborator_Id = :collaboratorId, Template = :template, Message = :message, CreatedAt = unix_timestamp(), ScheduleUTC = :utc 
			where Contact_Id = :id and Instance = :instance and Flag_Id = 3;";
			$sql = $db->prepare($string);
			$sql->bindParam(':collaboratorId',$userId);
			$sql->bindParam(':template',$messageTemplate);
			$sql->bindParam(':message',$messageTxt);
			$sql->bindParam(':utc',$messageUTC);
			$sql->bindParam(':id',$activeMessagesContactId);
			$sql->bindParam(':instance',$activeMessagesInstance);
			if (!($sql->execute())) {
                $result = array(
                    "result" => 'error',
                    "msgId" => null
                );
			} else {
                $logData = array(
                    "id" => $activeMessagesContactId, 
                    "instance" => $activeMessagesInstance,
                    "phone" => $activeMessagesPhone, 
                    "type" => 'text', 
                    "message" => $userName.' actualizó el mensaje para el '.getFormatedDateWithMonthName(date("Y-m-d", $messageUTC)).' a las '.date("H:i", $messageUTC).' hrs.' . chr(10) . $messageTxt,
                    "providerId" => 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis"),
                    "internal" => 1
                );
                $result = addMsg2Log($logData, $userId);
                if ($result != 'error') {
                    $result = array(
                        "result" => 'success',
                        "msgId" => $result
                    );
                } else {
                    $result = array(
                        "result" => 'error',
                        "msgId" => null
                    );
                }
            }
        }
        
        $db->commit();
        $db = null;
		return $result;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}        
}

function cancelScheduleMessage($activeMessagesContactId, $activeMessagesInstance, $activeMessagesPhone, $messageUTC, $userId, $userName, $userSessionRole) {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
		
		$string = "Update tratodirecto_hu.ScheduledMessage set Flag_Id = 4 where Contact_Id = :id and Instance = :instance and Flag_Id = 3;";
		$sql = $db->prepare($string);
		$sql->bindParam(':id',$activeMessagesContactId);
		$sql->bindParam(':instance',$activeMessagesInstance);
        if (!($sql->execute())) {
            $result = array(
                "result" => 'error',
                "msgId" => null
            );
        } else {
            $logData = array(
                "id" => $activeMessagesContactId, 
                "instance" => $activeMessagesInstance,
                "phone" => $activeMessagesPhone, 
                "type" => 'text', 
                "message" => $userName.' canceló el mensaje programado para el '.getFormatedDateWithMonthName(date("Y-m-d", $messageUTC)).' a las '.date("H:i", $messageUTC).' hrs.',
                "providerId" => 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis"),
                "internal" => 1
            );
            $result = addMsg2Log($logData, $userId);
            if ($result != 'error') {
                $result = array(
                    "result" => 'success',
                    "msgId" => $result
                );
            } else {
                $result = array(
                    "result" => 'error',
                    "msgId" => null
                );
            }
        }
		$db->commit();
		return $result;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function addRemoveFavorite($activeMessagesContactId, $activeMessagesInstance, $activeMessagesPhone, $activeMessagesIsFavorite, $favoriteComment, $userId, $userName, $userSessionRole) {
    include ("../bat/DBconection.php");
    try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();      

        $favorite = $activeMessagesIsFavorite == '1' ? 0 : 1; 
		$string = "Update tratodirecto_hu.Contact set UtcModifiedAt = unix_timestamp(), Favorite = :isFavorite where Id = :id;"; 
		$sql = $db->prepare($string);
		$sql->bindParam(':id',$activeMessagesContactId);
		$sql->bindParam(':isFavorite',$favorite);
		if (!$sql->execute()) {
            $result = array(
                "result" => 'error',
                "msgId" => null
            );
		} else {
            if ($activeMessagesIsFavorite == 0) {
                $message = $userName.' añadío a este contacto a favoritos.'.chr(10).'Razón: '.$favoriteComment;
            } else {
                $message = $userName.' eliminó a este contacto de favoritos.'.chr(10).'Razón: '.$favoriteComment;
            }
            $logData = array(
                "id" => $activeMessagesContactId, 
                "instance" => $activeMessagesInstance,
                "phone" => $activeMessagesPhone, 
                "type" => 'text', 
                "message" => $message,
                "providerId" => 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis"),
                "internal" => 1
            );
            $result = addMsg2Log($logData, $userId);
            if ($result != 'error') {
                $result = array(
                    "result" => 'success',
                    "msgId" => null
                );
            } else {
                $result = array(
                    "result" => 'error',
                    "msgId" => null
                );
            }
        }

        $db->commit();
        $db = null;
		return $result;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}           
    
}

function startConversation($startConversationData, $userId, $userSessionRole) {
    $userPhone = '+52'.substr($startConversationData['phone'],-10);
    $userMail = $startConversationData['email'] == '' ? null : $startConversationData['email'];
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', 
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

        $string = "Insert into tratodirecto_hu.Contact (Name, LastName, Phone, Email, UtcCreatedAt, UtcModifiedAt, WaFlag_Id, Flag_Id) values 
        (:contactFirstName, :contactLastName, :contactPhone, :contactMail, unix_timestamp(), unix_timestamp(), 1, 1);";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactFirstName',$startConversationData['name']);
        $sql->bindParam(':contactLastName',$startConversationData['lastName']);
        $sql->bindParam(':contactPhone',$userPhone);
        $sql->bindParam(':contactMail',$userMail,PDO::PARAM_STR);  
        if ($sql->execute()) {
            $contactId = $db->lastInsertId();
        } else {
            $output = array(
                "result" => 'error',
                "msg" => 'Hubo un error.'
            );
            return $output;	
        } 
        /**********************************************************************************************************************************************************/
        if (!userAssignation($contactId, $startConversationData['adviser'], $startConversationData['instance'], $userId)) {
            $db->rollBack();
            $output = array(
                "result" => 'error',
                "msg" => 'Hubo un error al asignar un asesor.'
            );
            return $output;				   
        }
        /**********************************************************************************************************************************************************/
        $data = array("phoneId" => $startConversationData['instance'], "phone" => $userPhone, "type" => 'text', "message" => $startConversationData['message']); 
        if ($startConversationData['messageFlag'] == 1) {
            $result = sendMessageMT($data);
        } else {
            $result['id'] = 'internal_'.$userPhone.'@'.date("Ymdhis"); 
            $result['status'] = 'success';
        }
        if ($result['status'] == 'success') {
            $logData = array(
                "id" => $contactId, 
                "instance" => $startConversationData['instance'],
                "phone" => $userPhone, 
                "type" => 'text', 
                "message" => $startConversationData['message'],
                "providerId" => $result['id'],
                "internal" => 0
            );
            $result = addMsg2Log($logData, $userId);
            $lastMessageId = $result;   
            if ($result == 'error') {
                $output = array(
                    "result" => 'error',
                    "msgId" => 'Hubo un error al insertar el mensaje en el log.'
                );
                return $output;	
            }
        } else {
            $db->rollBack();
            $output = array(
                "result" => 'error',
                "msgId" => 'Hubo un error al enviar el mensaje.'
            );
            return $output;	
        }
        /**********************************************************************************************************************************************************/
        $logData = array(
            "id" => $contactId, 
            "instance" => $startConversationData['instance'],
            "phone" => $userPhone, 
            "type" => 'text', 
            "message" => $startConversationData['internalMessage'],
            "providerId" => 'internal_'.$userPhone.'@'.date("Ymdhis"),
            "internal" => 1
        );
        
        $result = addMsg2Log($logData, $userId);
        if ($result == 'error') {
            $output = array(
                "result" => 'error',
                "msgId" => 'Hubo un error al insertar el mensaje interno.'
            );
            return $output;	
        }
        /**********************************************************************************************************************************************************/        

        $db->commit();
        $db = null;
        $output = array(
            "result" => 'success',
            "msg" => $lastMessageId
        );
		return $output;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function addContact($startConversationData, $userId, $userName, $userSessionRole) {
    $userPhone = '+52'.substr($startConversationData['phone'],-10);
    $userMail = $startConversationData['email'] == '' ? null : $startConversationData['email'];
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', 
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

        $string = "Insert into tratodirecto_hu.Contact (Name, LastName, Phone, Email, UtcCreatedAt, UtcModifiedAt, WaFlag_Id, Flag_Id) values 
        (:contactFirstName, :contactLastName, :contactPhone, :contactMail, unix_timestamp(), unix_timestamp(), 1, 1);";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactFirstName',$startConversationData['name']);
        $sql->bindParam(':contactLastName',$startConversationData['lastName']);
        $sql->bindParam(':contactPhone',$userPhone);
        $sql->bindParam(':contactMail',$userMail,PDO::PARAM_STR);  
        if ($sql->execute()) {
            $contactId = $db->lastInsertId();
        } else {
            $output = array(
                "result" => 'error',
                "msg" => 'Hubo un error.'
            );
            return $output;	
        } 
        /**********************************************************************************************************************************************************/
        if (!userAssignation($contactId, $startConversationData['adviser'], $startConversationData['instance'], $userId)) {
            $db->rollBack();
            $output = array(
                "result" => 'error',
                "msg" => 'Hubo un error al asignar un asesor.'
            );
            return $output;				   
        }
        /**********************************************************************************************************************************************************/
            $logData = array(
            "id" => $contactId, 
            "instance" => $startConversationData['instance'],
            "phone" => $userPhone, 
            "type" => 'text', 
            "message" => 'El contacto fue dado de alta el '.getFormatedDateWithMonthName(date("Y-m-d")).' a las '.date("H:i").' por '.$userName.'.',
            "providerId" => 'internal_'.$userPhone.'@'.date("Ymdhis"),
            "internal" => 1
        );
        
        $result = addMsg2Log($logData, $userId);
        if ($result == 'error') {
            $output = array(
                "result" => 'error',
                "msgId" => 'Hubo un error al insertar el mensaje interno.'
            );
            return $output;	
        }
        /**********************************************************************************************************************************************************/        

        $db->commit();
        $db = null;
        $output = array(
            "result" => 'success',
            "msg" => 'none'
        );
		return $output;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function userAssignation($contactId, $adviser, $instance, $userId) {
    include ("../bat/DBconection.php");
	try {
		$dbA = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', 
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$dbA->beginTransaction();

        $string = "Update tratodirecto_hu.Contact_Collaborator set Flag_Id = 4 where Contact_Id = :contactId";
		$sql = $dbA->prepare($string);
		$sql->bindParam(':contactId',$contactId);
        if (!$sql->execute()) {
            return false;				
        }

        $string = "Insert into tratodirecto_hu.Contact_Collaborator (Contact_Id, Collaborator_Id, Instance, CreatedAt, CreatedBy, Flag_Id)
		values (:contactId, :userSessionId, :defaultInstance, unix_timestamp(), :createdBy, 3);";
		$sql = $dbA->prepare($string);
		$sql->bindParam(':contactId',$contactId);
		$sql->bindParam(':userSessionId',$adviser);
		$sql->bindParam(':defaultInstance',$instance);
        $sql->bindParam(':createdBy',$userId);
        if (!$sql->execute()) {
            $dbA->rollBack();
            return false;				
        }

        $dbA->commit();
        $dbA = null;
		return true;

	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function sendMessage($activeMessagesContactId, $activeMessagesInstance, $activeMessagesPhone, $activeMessagesProvider, $isInternalMessage, $message, $userId, $userSessionRole) {
	$data = array("phoneId" => $activeMessagesInstance, "phone" => $activeMessagesPhone, "type" => 'text', "message" => $message);
    if ($isInternalMessage == '0') {
        if ($activeMessagesProvider == 'waba') {
            $result = sendMessageWABA($data);
        } else {
            $result = sendMessageMT($data);
        }
    } else {
        $result['id'] = 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis");
        $result['status'] = 'success';
    }
	if ($result['status'] == 'success') {
        $logData = array(
            "id" => $activeMessagesContactId, 
            "instance" => $activeMessagesInstance,
            "phone" => $activeMessagesPhone, 
            "type" => 'text', 
            "message" => $message,
            "providerId" => $result['id'],
            "internal" => $isInternalMessage
        );
		$result = addMsg2Log($logData, $userId);
		if ($result != 'error') {
			$result = array(
				"result" => 'success',
				"msgId" => $result
			);
		} else {
			$result = array(
				"result" => 'error',
				"msgId" => null
			);
		}
		return $result;
	} else {
        $result = array(
            "result" => 'error',
            "msgId" => null
        );
        return $result;
	}
}

function sendImage($activeMessagesContactId, $activeMessagesInstance, $activeMessagesPhone, $activeMessagesProvider, $isInternalMessage, $fileData, $userId, $userSessionRole) {
    $fileArray = explode(';', $fileData['data']);
    if (str_contains($fileArray[0], 'image')) { 
        $type = 'image';
    } else if (str_contains($fileArray[0], 'video')) {
        $type = 'video';
    } else {
        $type = 'document';
    }
	$fileBase64 = explode(',', $fileArray[1]);
    $filePath = '../uploadedFiles/';
    $resultFilePutContents = file_put_contents($filePath.$fileData['name'], base64_decode($fileBase64[1]));
    $fileURL = send2Storage($filePath, $fileData['name']);
    if ($isInternalMessage == '0') {
        if ($activeMessagesProvider == 'waba') {
            $data = array("phoneId" => $activeMessagesInstance, "phone" => $activeMessagesPhone, "type" => $fileData['type'], "message" => $fileData['comment'], "media" => $fileURL);
            $result = sendMessageWABA($data);
        } else {
            $data = array("phoneId" => $activeMessagesInstance, "phone" => $activeMessagesPhone, "type" => "media", "message" => $fileData['comment'], "media" => $fileURL);
            $result = sendMessageMT($data);
        }        
    } else {
        $result['id'] = 'internal_'.$activeMessagesPhone.'@'.date("Ymdhis");
        $result['status'] = 'success';
    }
	if ($result['status'] == 'success') {
        $logData = array(
            "id" => $activeMessagesContactId, 
            "instance" => $activeMessagesInstance,
            "phone" => $activeMessagesPhone, 
            "type" => $type, 
            "providerId" => $result['id'],
            "fileURL" => $fileURL,
            "caption" => $fileData['comment'],
            "internal" => $isInternalMessage
        );
		$result = addMsg2Log($logData, $userId);        
		if ($result != 'error') {
			$result = array(
				"result" => 'success',
				"msgId" => $result
			);
		} else {
			$result = array(
				"result" => 'error',
				"msgId" => null
			);
		}
		return $result;
	} else {
        $result = array(
            "result" => 'error',
            "msgId" => null
        );
        return $result;
	}
}

function saveContactFile($activeMessagesContactId, $fileData, $userId, $userSessionRole) {
	include ("../bat/DBconection.php");
	try {
        $fileArray = explode(';', $fileData['data']);
        if (str_contains($fileArray[0], 'image')) { 
            $type = 'image';
        } else if (str_contains($fileArray[0], 'video')) {
            $type = 'video';
        } else {
            $type = 'document';
        }
        $fileTypeArray = explode(':', $fileArray[0]);
        $fileType = $fileTypeArray[1];;
        $fileBase64 = explode(',', $fileArray[1]);
        $filePath = '../uploadedFiles/';
        $resultFilePutContents = file_put_contents($filePath.$fileData['name'], base64_decode($fileBase64[1]));
        $fileURL = send2Storage($filePath, $fileData['name']);

		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
		$string = "Insert into tratodirecto_hu.Contact_File (Contact_Id, FileUrl, FileName, MimeType, CreatedAt, CreatedBy, Flag_Id) values 
        (:contactId, :url, :fileName, :mimeType, unix_timestamp(), :userId, 3);";
		$sql = $db->prepare($string);
        $sql->bindParam(':contactId', $activeMessagesContactId);
        $sql->bindParam(':url', $fileURL);
        $sql->bindParam(':fileName', $fileData['name']);
        $sql->bindParam(':mimeType', $fileType);
        $sql->bindParam(':userId', $userId);
		if ($sql->execute()) {
            $fileId = $db->lastInsertId();
            $result = array(
                "result" => 'success',
                "id" => $fileId,
                "name" => $fileData['name'],
                "url" => $fileURL,
            );
		} else {
            $result = array(
                "result" => 'error',
            );
		}

        $db->commit();
        $db = null;
		return $result;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}

}

function send2Storage($filePath, $fileName) {
    include './cloudStorage.php';
	$file_name = $filePath.$fileName;
	$uploadResult = upload_object('tratodirecto.com', 'hogares-union/'.$fileName, $file_name, true); 
	if ($uploadResult) {
		$msgFileName = 'https://storage.googleapis.com/tratodirecto.com/hogares-union/'.$fileName; 
	} else {
		$msgFileName = 'https://hu.tratodirecto.com/uploadedFiles/'.$fileName;
	}
    return $msgFileName;
}

function addMsg2Log($data, $userSessionId) {
	include ("../bat/DBconection.php");
    $id = isset($data["id"]) ? $data["id"] : null;
    $phone = isset($data["phone"]) ? $data["phone"] : null;
    $instance = isset($data["instance"]) ? $data["instance"] : null;
    $providerId = isset($data["providerId"]) ? $data["providerId"] : null;
    $type = isset($data["type"]) ? $data["type"] : null;
    $internal = isset($data["internal"]) ? $data["internal"] : null;
    $message = isset($data["message"]) ? $data["message"] : null;
    $fileURL = isset($data["fileURL"]) ? $data["fileURL"] : null;
    $caption = isset($data["caption"]) ? $data["caption"] : null;
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $string = "Insert into tratodirecto_hu.Log_".$instance." (ProviderId, ProviderUTC, Phone, Contact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
        Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
        values (:providerId, unix_timestamp(), :contactPhone, :hubSpotContactId, 1, :userSessionId, :message, :fileURL, unix_timestamp(),
        7, null, null, null, null, null, null, :type, null, :caption, null, null, :instance, :internal);";
        $sql = $db->prepare($string);
        $sql->bindParam(':providerId',$providerId);
        $sql->bindParam(':contactPhone',$phone);
        $sql->bindParam(':hubSpotContactId',$id);
        $sql->bindParam(':userSessionId',$userSessionId);
        $sql->bindParam(':message',$message);
        $sql->bindParam(':fileURL',$fileURL);
        $sql->bindParam(':type',$type);
        $sql->bindParam(':caption',$caption);
        $sql->bindParam(':instance',$instance);
        $sql->bindParam(':internal',$internal);
		if ($sql->execute()) {
			$result = $db->lastInsertId();
		} else {
			$result = 'error';
		}
		$db->commit();
		$db = null;
		return $result;
	} catch (PDOException $e) {
		return 'error';
	}
}

function sendMessageWABA($data) {
	include ("../bat/instanceConnection.php");

    $phoneId = isset($data["phoneId"]) ? $data["phoneId"] : null;
    $waId = isset($data["waId"]) ? $data["waId"] : null;
    $phone = isset($data["phone"]) ? $data["phone"] : null;
    $type = isset($data["type"]) ? $data["type"] : null;
    $message = isset($data["message"]) ? $data["message"] : null;
    $media = isset($data["media"]) ? $data["media"] : null;
    $template = isset($data["template"]) ? $data["template"] : null;
    $bodyParams = isset($data["bodyParams"]) ? $data["bodyParams"] : null;
    $buttonParams = isset($data["buttonParams"]) ? $data["buttonParams"] : null;

	if (strpos($phone, '@')) {
		if ($type == 'text') {
			$data = array("phoneId" => '21432', "phone" => $phone, "type" => 'text', "message" => $message);
		} elseif ($type == 'media') {
			$data = array("phoneId" => '21432', "phone" => $phone, "type" => 'media', "message" => $message, "media" => $media);
		} elseif ($type == 'template') {
			$data = array("phoneId" => '21432', "phone" => $phone, "type" => 'template', "template" => $template, "bodyParams" => $bodyParams, "wabaPhoneId" => $phoneId);
		}

		$result = sendMessageMT($data);
		return $result;
	}

    $latlong = '?q=20.620279,-87.104161';
    $x = 0;
    $y = 1;

    //url
    $url = "https://graph.facebook.com/v13.0/".$phoneId."/messages";

    if ($type == 'text') {

        $data = array(    
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $phone,
            'type' => 'text',
            'text' => ['preview_url' => false, 'body' => $message]
        );

    } elseif ($type == 'media') {

        $data = array(    
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $phone,
            'type' => 'image',
            'image' => ['link' => $media, 'caption' => $message]
        );

    } elseif ($type == 'document') {

        $data = array(    
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $phone,
            'type' => 'document',
            'document' => ['link' => $media, 'caption' => $message]
        );		

    } elseif ($type == 'template') {

        $templateData = getTemplateDataWABA($template, $phoneId);
        $message = isset($templateData['textBody']) ? $templateData['textBody'] : null;

        if ($templateData['status'] != 'success') {
            $result = array(
                "status" => 'error',
                "message" => 'No existe el Template.'
            );
            return $result;
        }

        if ($templateData['paramsNum'] != count($bodyParams)) {
            $result = array(
                "status" => 'error',
                "message" => 'Error en la parametrización del Template.'
            );
            return $result;
        }

        $data = array(    
            'messaging_product' => 'whatsapp',
            'recipient_type' => 'individual',
            'to' => $phone,
            'type' => 'template',
            'template' => ['name' => $template,'language' => ['code' =>$templateData['language']],'components' => []]
        );  

        if ($templateData['hasHeader']) {
            $data['template']['components'][0] = ['type' => 'header','parameters' => [['type' => 'image', 'image' => ['link' => $templateData['headerUrl']]]]];
        }

        $a = count($data['template']['components']);
        $data['template']['components'][$a] = ['type' => 'body','parameters' => []];
        foreach($bodyParams as $array) {
            $data['template']['components'][$a]['parameters'][$x] = $array;
            $message = str_replace('{{'.$y.'}}',$array['text'],$message);  
            $x++;
            $y++;
        }

        if ($templateData['hasButton01']) {       
            $b = count($data['template']['components']);
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 0, 'parameters' => [['type' => 'text', 'text' => $latlong]]];
        }

        if ($templateData['hasButton02']) {       
            $b = count($data['template']['components']);
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 1, 'parameters' => [['type' => 'text', 'text' => $latlong]]];
        }

        if ($templateData['hasButton03']) {       
            $b = count($data['template']['components']);
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 2, 'parameters' => [['type' => 'text', 'text' => $latlong]]];
        }

    }

    $request_headers = array();
	if ($phoneId == '103999962366159') {
		$request_headers[] = 'Authorization: Bearer '.$wabaTokenCA;
    } else if ($phoneId == '185519967971331') {
            $request_headers[] = 'Authorization: Bearer '.$wabaTokenMsg360;
    } else {
		$request_headers[] = 'Authorization: Bearer '.$wabaToken;
	}
    $request_headers[] = 'Content-Type: application/json';

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $result = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $obj = json_decode($result); 

    if ($httpcode == '200') {
        $result = array(
            "status" => 'success',
            "id" => $obj->messages[0]->id,
            "message" => $message 
        );
        return $result;
    } else {
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / WABA / '.$phone.' / '.$result);
        $message = isset($obj->error->error_user_msg) ? isset($obj->error->error_user_msg) : 'Hubo un error';
        $result = array(
            "status" => 'error',
            "message" => $message 
        );
        return $result;
    }
}

function sendMessageMT($data) {
	include ("../bat/instanceConnection.php");

    $phoneId = isset($data["phoneId"]) ? $data["phoneId"] : null;
    $phone = isset($data["phone"]) ? $data["phone"] : null;
    $type = isset($data["type"]) ? $data["type"] : null;
    $message = isset($data["message"]) ? $data["message"] : null;
    $media = isset($data["media"]) ? $data["media"] : null;
    $template = isset($data["template"]) ? $data["template"] : null;
    $bodyParams = isset($data["bodyParams"]) ? $data["bodyParams"] : null;
    $wabaPhoneId = isset($data["wabaPhoneId"]) ? $data["wabaPhoneId"] : null;

	if (!strpos($phone, '@')) {
		if (!(substr($phone, 0, 2) == '+1' || substr($phone, 0, 3) == '+33' || substr($phone, 0, 3) == '+51' || substr($phone, 0, 3) == '+50'))  {
			$phone = '+521'.substr($phone, -10);
		}
	}

    if ($phoneId == '32808'){
        $productIdMT = $productIdMT2;
        $tokenMT = $tokenMT2;
    }

    $url = 'https://api.maytapi.com/api/'.$productIdMT.'/'.$phoneId.'/sendMessage';
  
    $request_headers = array();
    $request_headers[] = 'Content-Type: application/json';
    $request_headers[] = 'x-maytapi-key: '.$tokenMT;
    $x = 0;
    $y = 1;


    if ($type == 'text') {

        $data = array(    
            'to_number' => $phone,
            'type' => 'text',
            'message' => $message
        );

    } elseif ($type == 'media') {

        $data = array(    
            'to_number' => $phone,
            'type' => 'media',
            'message' => $media,
            'text' => $message
        );

    } elseif ($type == 'template') {

        $templateData = getTemplateDataWABA($template, $wabaPhoneId);
        $message = isset($templateData['textBody']) ? $templateData['textBody'] : null;

        if ($templateData['status'] != 'success') {
            $result = array(
                "status" => 'error',
                "message" => 'No existe el Template.'
            );
            return $result;
        }

        if ($templateData['paramsNum'] != count($bodyParams)) {
            $result = array(
                "status" => 'error',
                "message" => 'Error en la parametrización del Template.'
            );
            return $result;
        }

        foreach($bodyParams as $array) {
            $message = str_replace('{{'.$y.'}}',$array['text'],$message);  
            $x++;
            $y++;
        }

        $data = array(    
            'to_number' => $phone,
            'type' => 'text',
            'message' => $message
        );
    
    }

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
    curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    $result = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $obj = json_decode($result); 
    if ($httpcode == '200') {
        $result = array(
            "status" => 'success',
            "id" => $obj->data->msgId,
            "message" => $message 
        );
        return $result;
    } else {
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / MT 0002 / '.$phone.' / '.$result);
        $result = array(
            "status" => 'error',
            "message" => 'Hubo un error'
        );
        return $result;
    }
}

function getTemplateDataWABA($template, $phoneId) {
	include ("../bat/DBconection.php");
	$hasHeader = false;
    $hasButton01 = false;
    $hasButton02 = false;
    $hasButton03 = false;
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select Language, HeaderType, HeaderUrl, Body, BodyVariables, Button1parameter, Button2parameter, Button3parameter 
        from tratodirecto_hu.WABAtemplates where Name = :template and WABAPhoneId = :phoneId limit 1";
		$sql = $db->prepare($string);
		$sql->bindParam(':template',$template);
        $sql->bindParam(':phoneId',$phoneId);
		$sql->execute();
		$row = $sql->fetch();
		if ($row) {
            if (!($row[1] == null || $row[1] == '')) { $hasHeader = true; }
            if (!($row[5] == null || $row[5] == '')) { $hasButton01 = true; }
            if (!($row[6] == null || $row[6] == '')) { $hasButton02 = true; }
            if (!($row[7] == null || $row[7] == '')) { $hasButton03 = true; }
            $result = array(
                "status" => 'success',
                "language" => $row[0],
                "hasHeader" => $hasHeader,
                "headerType" => $row[1],
                "headerUrl" => $row[2],
                "textBody" => $row[3],
                "paramsNum" => $row[4],
                "hasButton01" => $hasButton01,
                "buttonType01" => $row[5], 
                "hasButton02" => $hasButton02,
                "buttonType02" => $row[6], 
                "hasButton03" => $hasButton03,
                "buttonType03" => $row[7]                              
            );
		} else {
            $result = array(
                "status" => 'error',
                "message" => 'El tamplate no existe'
            );
		}
        return $result;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}  

function searchPhone($phone) {
    include ("../bat/DBconection.php");
    $phone = '%'.$phone.'%';
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "Select Id from tratodirecto_hu.Contact where Phone like :phone and Flag_Id = 1";
		$sql = $db->prepare($string);		
		$sql->bindParam(':phone',$phone);
		$sql->execute();
		$row = $sql->fetchAll();
		$db = null;
        if ($row) {
            return true;
        } else {
            return false;
        }
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function mime2ext($mime) {  
    $mime_map = [
        'video/3gpp2' => '3g2',
        'video/3gp' => '3gp',
        'video/3gpp' => '3gp',
        'application/x-compressed' => '7zip',
        'audio/x-acc' => 'aac',
        'audio/ac3' => 'ac3',
        'application/postscript' => 'ai',
        'audio/x-aiff' => 'aif',
        'audio/aiff' => 'aif',
        'audio/x-au' => 'au',
        'video/x-msvideo' => 'avi',
        'video/msvideo' => 'avi',
        'video/avi' => 'avi',
        'application/x-troff-msvideo' => 'avi',
        'application/macbinary' => 'bin',
        'application/mac-binary' => 'bin',
        'application/x-binary' => 'bin',
        'application/x-macbinary' => 'bin',
        'image/bmp' => 'bmp',
        'image/x-bmp' => 'bmp',
        'image/x-bitmap' => 'bmp',
        'image/x-xbitmap' => 'bmp',
        'image/x-win-bitmap' => 'bmp',
        'image/x-windows-bmp' => 'bmp',
        'image/ms-bmp' => 'bmp',
        'image/x-ms-bmp' => 'bmp',
        'application/bmp' => 'bmp',
        'application/x-bmp' => 'bmp',
        'application/x-win-bitmap' => 'bmp',
        'application/cdr' => 'cdr',
        'application/coreldraw' => 'cdr',
        'application/x-cdr' => 'cdr',
        'application/x-coreldraw' => 'cdr',
        'image/cdr' => 'cdr',
        'image/x-cdr' => 'cdr',
        'zz-application/zz-winassoc-cdr' => 'cdr',
        'application/mac-compactpro' => 'cpt',
        'application/pkix-crl' => 'crl',
        'application/pkcs-crl' => 'crl',
        'application/x-x509-ca-cert' => 'crt',
        'application/pkix-cert' => 'crt',
        'text/css' => 'css',
        'text/x-comma-separated-values' => 'csv',
        'text/comma-separated-values' => 'csv',
        'application/vnd.msexcel' => 'csv',
        'application/x-director' => 'dcr',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
        'application/x-dvi' => 'dvi',
        'message/rfc822' => 'eml',
        'application/x-msdownload' => 'exe',
        'video/x-f4v' => 'f4v',
        'audio/x-flac' => 'flac',
        'video/x-flv' => 'flv',
        'image/gif' => 'gif',
        'application/gpg-keys' => 'gpg',
        'application/x-gtar' => 'gtar',
        'application/x-gzip' => 'gzip',
        'application/mac-binhex40' => 'hqx',
        'application/mac-binhex' => 'hqx',
        'application/x-binhex40' => 'hqx',
        'application/x-mac-binhex40' => 'hqx',
        'text/html' => 'html',
        'image/x-icon' => 'ico',
        'image/x-ico' => 'ico',
        'image/vnd.microsoft.icon' => 'ico',
        'text/calendar' => 'ics',
        'application/java-archive' => 'jar',
        'application/x-java-application' => 'jar',
        'application/x-jar' => 'jar',
        'image/jp2' => 'jp2',
        'video/mj2' => 'jp2',
        'image/jpx' => 'jp2',
        'image/jpm' => 'jp2',
        'image/jpeg' => 'jpeg',
        'image/pjpeg' => 'jpeg',
        'application/x-javascript' => 'js',
        'application/json' => 'json',
        'text/json' => 'json',
        'application/vnd.google-earth.kml+xml' => 'kml',
        'application/vnd.google-earth.kmz' => 'kmz',
        'text/x-log' => 'log',
        'audio/x-m4a' => 'm4a',
        'application/vnd.mpegurl' => 'm4u',
        'audio/midi' => 'mid',
        'application/vnd.mif' => 'mif',
        'video/quicktime' => 'mov',
        'video/x-sgi-movie' => 'movie',
        'audio/mpeg' => 'mp3',
        'audio/mpg' => 'mp3',
        'audio/mpeg3' => 'mp3',
        'audio/mp3' => 'mp3',
        'video/mp4' => 'mp4',
        'video/mpeg' => 'mpeg',
        'application/oda' => 'oda',
        'audio/ogg' => 'ogg',
        'video/ogg' => 'ogg',
        'application/ogg' => 'ogg',
        'application/x-pkcs10' => 'p10',
        'application/pkcs10' => 'p10',
        'application/x-pkcs12' => 'p12',
        'application/x-pkcs7-signature' => 'p7a',
        'application/pkcs7-mime' => 'p7c',
        'application/x-pkcs7-mime' => 'p7c',
        'application/x-pkcs7-certreqresp' => 'p7r',
        'application/pkcs7-signature' => 'p7s',
        'application/pdf' => 'pdf',
        'application/octet-stream' => 'pdf',
        'application/x-x509-user-cert' => 'pem',
        'application/x-pem-file' => 'pem',
        'application/pgp' => 'pgp',
        'application/x-httpd-php' => 'php',
        'application/php' => 'php',
        'application/x-php' => 'php',
        'text/php' => 'php',
        'text/x-php' => 'php',
        'application/x-httpd-php-source' => 'php',
        'image/png' => 'png',
        'image/x-png' => 'png',
        'application/powerpoint' => 'ppt',
        'application/vnd.ms-powerpoint' => 'ppt',
        'application/vnd.ms-office' => 'ppt',
        'application/msword' => 'doc',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation' => 'pptx',
        'application/x-photoshop' => 'psd',
        'image/vnd.adobe.photoshop' => 'psd',
        'audio/x-realaudio' => 'ra',
        'audio/x-pn-realaudio' => 'ram',
        'application/x-rar' => 'rar',
        'application/rar' => 'rar',
        'application/x-rar-compressed' => 'rar',
        'audio/x-pn-realaudio-plugin' => 'rpm',
        'application/x-pkcs7' => 'rsa',
        'text/rtf' => 'rtf',
        'text/richtext' => 'rtx',
        'video/vnd.rn-realvideo' => 'rv',
        'application/x-stuffit' => 'sit',
        'application/smil' => 'smil',
        'text/srt' => 'srt',
        'image/svg+xml' => 'svg',
        'application/x-shockwave-flash' => 'swf',
        'application/x-tar' => 'tar',
        'application/x-gzip-compressed' => 'tgz',
        'image/tiff' => 'tiff',
        'text/plain' => 'txt',
        'text/x-vcard' => 'vcf',
        'application/videolan' => 'vlc',
        'text/vtt' => 'vtt',
        'audio/x-wav' => 'wav',
        'audio/wave' => 'wav',
        'audio/wav' => 'wav',
        'application/wbxml' => 'wbxml',
        'video/webm' => 'webm',
        'audio/x-ms-wma' => 'wma',
        'application/wmlc' => 'wmlc',
        'video/x-ms-wmv' => 'wmv',
        'video/x-ms-asf' => 'wmv',
        'application/xhtml+xml' => 'xhtml',
        'application/excel' => 'xl',
        'application/msexcel' => 'xls',
        'application/x-msexcel' => 'xls',
        'application/x-ms-excel' => 'xls',
        'application/x-excel' => 'xls',
        'application/x-dos_ms_excel' => 'xls',
        'application/xls' => 'xls',
        'application/x-xls' => 'xls',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
        'application/vnd.ms-excel' => 'xlsx',
        'application/xml' => 'xml',
        'text/xml' => 'xml',
        'text/xsl' => 'xsl',
        'application/xspf+xml' => 'xspf',
        'application/x-compress' => 'z',
        'application/x-zip' => 'zip',
        'application/zip' => 'zip',
        'application/x-zip-compressed' => 'zip',
        'application/s-compressed' => 'zip',
        'multipart/x-zip' => 'zip',
        'text/x-scriptzsh' => 'zsh',
    ];

    return isset($mime_map[$mime]) === true ? $mime_map[$mime] : false;
}

function getFormatedDateWithMonthName($appointmentDate) {
	$appointmentDateArray = explode("-",$appointmentDate);
	switch ($appointmentDateArray[1]) {
		case '01':
			$appointmentMonthName = 'Enero';
			break;
		case '02':
			$appointmentMonthName = 'Febrero';
			break;
		case '03':
			$appointmentMonthName = 'Marzo';
			break;
		case '04':
			$appointmentMonthName = 'Abril';
			break;
		case '05':
			$appointmentMonthName = 'Mayo';
			break;
		case '06':
			$appointmentMonthName = 'Junio';
			break;
		case '07':
			$appointmentMonthName = 'Julio';
			break;
		case '08':
			$appointmentMonthName = 'Agosto';
			break;
		case '09':
			$appointmentMonthName = 'Septiembre';
			break;
		case '10':
			$appointmentMonthName = 'Octubre';
			break;
		case '11':
			$appointmentMonthName = 'Noviembre';
			break;
		case '12':
			$appointmentMonthName = 'Diciembre';
			break;
		default:
			$appointmentMonthName = 'NA';
	}
	$string = $appointmentDateArray[2] . ' de ' . $appointmentMonthName . ' de ' . $appointmentDateArray[0];
	return $string;
}
?>