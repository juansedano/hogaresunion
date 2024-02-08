<?php
ini_set('mysql.connect_timeout','0');   
ini_set('max_execution_time', '0'); 
date_default_timezone_set('America/Mexico_City');

function responseData($response) {
    $objData = new stdClass();
    $objData->result = $response;
    $json_response = json_encode($objData);
    return ($json_response);
}

/*
+1 seguido de 10 dígitos (USA y Canadá)
+52 seguido de 10 dígitos (México)
+521 o +5201 seguido de 10 dígitos puede ser válido porque así lo manda Facebook algunas veces (México) y lo reformateamos a +52 seguido de los últimos 10 dígitos
Cuando no ponen el +, solamente deberíamos aceptar 10 dígitos, si pone menos o más de 10, lo deberíamos regresar por "De nuevo teléfono" porque si 
tomamos los últimos 10 puede haber error. Y lo reformateamos como +52 seguido de los 10 dígitos
*/

function validatePhone($phone) {
	$phone = preg_replace("/[^0-9\+]/", "", trim($phone));
	$phone = str_replace(" ","",$phone);
	$phone = str_replace("-","",$phone);
	$phone = str_replace(".","",$phone);
	$phone = str_replace("(","",$phone);
	$phone = str_replace(")","",$phone);
	$status = true;
	$formattedPhone = null;
	if (is_numeric(substr($phone, -10))) {
		if (substr($phone, 0, 2) == '+1' && strlen($phone) == 12) {
			$formattedPhone = $phone;
		} elseif ((substr($phone, 0, 3) == '+52' && strlen($phone) == 13) || (substr($phone, 0, 4) == '+521' && strlen($phone) == 14) || (substr($phone, 0, 5) == '+5201' && strlen($phone) == 15)) {
			$formattedPhone = '+52'.substr($phone, -10);
		} elseif (substr($phone, 0, 1) != '+' && strlen($phone) == 10) {
			$formattedPhone = '+52'.substr($phone, -10);
		} else {
			$status = false;
			$formattedPhone = $phone;
		}
	} else {
		$status = false;
		$formattedPhone = $phone;
	}

	$result = array(
		"status" => $status,
		"phone" => $formattedPhone
	);

	return $result;
}

function saveLead($hubSpotContactId, $phone, $contactData, $emsg, $imsg, $instance) {
	include ("../bat/DBconection.php");
	$phoneQuery = '%'. substr($phone,-10) . '%';
	$currentTime = date('H:i:s');
	$lowerLimit = date('07:59:59'); 
	$upperLimit = date('22:59:59');
	$startProcessTime = date('H:i:s.v');
	$returnValue = 'success';
	$resultAdvisorId = 'bot';

	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'";',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

		$instance = getWABAInstance($instance);
		$string = "Select Id, Phone from tratodirecto_db.User where HubSpot_Id = :hubSpotContactId limit 1;";
		$sql = $db->prepare($string);
		$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
		$sql->execute();
		$row = $sql->fetch();
		if ($row) {
			$contactId = $row[0];
			if (substr($row[1],-10) != substr($phone,-10)) {
				$string = "Update tratodirecto_db.User set Phone = :phone where Id = :userId;";
				$sql = $db->prepare($string);
				$sql->bindParam(':phone',$phone);
				$sql->bindParam(':userId',$contactId);
				if (!$sql->execute()) {					
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al tratar de actualizar el teléfono en TD."; 
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);
					error_log($message);	
					$returnValue = 'error';
					return $returnValue;	
				} 

				$string = "Update tratodirecto_admin.HubspotContact set phone = :phone where hs_object_id = :hubSpotContactId;";  
				$sql = $db->prepare($string);
				$sql->bindParam(':phone',$phone);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al tratar de actualizar el teléfono en HubspotContact."; 
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);
					error_log($message);
					$returnValue = 'error';
					return $returnValue;		
				}	
			}
		} else {
			$string = "Select Id, HubSpot_Id from tratodirecto_db.User where Phone like :phone limit 1;";
			$sql = $db->prepare($string);
			$sql->bindParam(':phone',$phoneQuery);
			$sql->execute();
			$row = $sql->fetch();
			if(!$row) {
				$string = "Insert into tratodirecto_db.User (Name, LastName, MFN, Gender, Birthdate, Birthplace, Phone, Password, Email, EmailConfirmed, CVS, CVU,
				CVLastCheck, CVExpiration, Active, CreatedAt, UpdatedAt, UtcCreatedAt, UtcModifiedAt, MaritalStatus_Id, IsTemporal,
				Source_Id, EmailTemp, Flag_Id, Partner_Id, ConversionStatus_Id, HubSpot_Id) values (:contactFirstName, :contactLastName, null, null,
				null, null, :contactPhone, null, :contactMail, null, null, null, null, date_add(DATE(now()), interval 30 day), null,
				'".date('Y-m-d H:i:s')."', null, unix_timestamp(), null, 0, 1, 6, null, 7, null, 6, :hubSpotContactId);";
				$sql = $db->prepare($string);
				$sql->bindParam(':contactFirstName',$contactData["name"]);
				$sql->bindParam(':contactLastName',$contactData["lastName"]);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':contactMail',$contactData["email"]);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				if ($sql->execute()) {
					$contactId = $db->lastInsertId();
				} else {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al tratar de registrar el contacto en TD.";
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);
					error_log($message);
					$returnValue = 'error';
					return $returnValue;				
				}   
		
				$string = "Insert into tratodirecto_admin.HubspotContact (hs_object_Id, tratodirecto_id, firstname, lastname, phone, email, internalmessage_flag, followup_flag, created_at, 
				created_by, economic_profile_id) values (:hubSpotContactId, :contactId, :contactFirstName, :contactLastName, :contactPhone, :contactMail, 0, 0, unix_timestamp(), 326, null) 
				on duplicate key update tratodirecto_id = :contactIdUpdate, firstname = :contactFirstNameUpdate, lastname = :contactLastNameUpdate, phone = :contactPhoneUpdate, email = :contactMailUpdate;";
				$sql = $db->prepare($string);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				$sql->bindParam(':contactId',$contactId);
				$sql->bindParam(':contactIdUpdate',$contactId);
				$sql->bindParam(':contactFirstName',$contactData["name"]);
				$sql->bindParam(':contactFirstNameUpdate',$contactData["name"]);
				$sql->bindParam(':contactLastName',$contactData["lastName"]);
				$sql->bindParam(':contactLastNameUpdate',$contactData["lastName"]);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':contactPhoneUpdate',$phone);
				$sql->bindParam(':contactMail',$contactData["email"]);
				$sql->bindParam(':contactMailUpdate',$contactData["email"]);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al tratar de registrar el contacto en tratodirecto_admin.HubspotContact.";
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);
					error_log($message);
					$returnValue = 'error';
					return $returnValue;				
				}				
			} else {				
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."El Id ".$hubSpotContactId." tiene el mismo teléfono que el Id ".$row[1].".";
				error_log($message);
				$data = array("phoneId" => '21432', "phone" => '120363027534597960@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
				$contactId = $row[0];
				$hubSpotContactId = $row[1];
				$returnValue = 'duplicate';
			}
		}

		$assignation = getAdvidser();
		$contactOwnerFlag = 1;

		$string = "Select hc.Collaborator_Id, concat(c.Name, ' ', c.LastName), c.Phone from tratodirecto_admin.HubspotContact_Collaborator hc 
		join tratodirecto_admin.Collaborator c on c.Id = hc.Collaborator_Id	where hc.HubspotContact_Id = :hubSpotContactId and hc.Flag_Id = 7 order by hc.id desc limit 1;";
		$sql = $db->prepare($string);
		$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
		$sql->execute();
		$row = $sql->fetch();
		if ($row) {
			$string = "Select c.Id, concat(c.Name, ' ', c.LastName), c.Phone, c.CurrentlyWorking from tratodirecto_db.Collaborator c where c.Id = :collaboratorId;";
			$sql = $db->prepare($string);
			$sql->bindParam(':collaboratorId',$row[0]);
			$sql->execute();
			$row = $sql->fetch();
			if ($row[3] == 2) {
				$assignation = array(
					"result" => 'success',
					"roundRobinId" => $row[0],
					"roundRobinName" => $row[1],
					"roundRobinPhone" => $row[2]
				);	
			} 
			if ($contactData["contactOwner"] != null) {
				$contactOwnerFlag = 0;
			}
		} 

		$string = "Insert into tratodirecto_admin.HubspotContact_Collaborator (HubspotContact_Id, Collaborator_Id, Instance, Notes, CreatedAt, CreatedBy, Flag_Id)
		values (:hubSpotContactId, :adviserId, :instance, null, unix_timestamp(), 326, 7);";
		$sql = $db->prepare($string);
		$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
		$sql->bindParam(':adviserId',$assignation["roundRobinId"]);
		$sql->bindParam(':instance',$instance["instance"]);
		if (!$sql->execute()) {			
			$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."There was an error trying to insert in tratodirecto_admin.HubspotContact_Collaborator (".$phone.").";
			$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
			$result = sendMessageMT($data);
			error_log($message);
		} 
		
		$string = "Insert into tratodirecto_admin.HubspotContact_Asignment (HubspotContact_Id, Collaborator_Id, Instance, Notes, CreatedAt, CreatedBy, Flag_Id)
		values (:hubSpotContactId, :adviserId, :instance, null, unix_timestamp(), 326, 7);";
		$sql = $db->prepare($string);
		$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
		$sql->bindParam(':adviserId',$assignation["roundRobinId"]);
		$sql->bindParam(':instance',$instance["instance"]);
		if (!$sql->execute()) {
			$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."There was an error trying to asign in tratodirecto_admin.HubspotContact_Asignment (".$phone.").";
			$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
			$result = sendMessageMT($data);
			error_log($message);
		}

		if ($contactData["channel"] == 'Messenger' || $contactData["channel"] == 'Formulario') {

			$developmentData = array(
				"zoneId" => null,
				"stateId" => null,
				"localityId" => null,
				"developmentId" => null,
				"modelMinId" => null,
				"modelMinName" => null,
				"modelMinPrice" => null,
				"modelMinShortUrl" => null
			);

			if (!($contactData["intDevelopment"] == '' || $contactData["intDevelopment"] == null)) {  
				$string = "Select m.Id, m.Name, m.Price, m.ShortUrl, hd.Zone_Id, hd.Locality_Id, l.State_Id, hd.Id from tratodirecto_db.PropertyModel m
				join tratodirecto_db.HousingDevelopment hd on hd.Id = m.HousingDevelopment_Id join tratodirecto_db.Locality l on l.Id = hd.Locality_Id
				where m.HousingDevelopment_Id = :developmentId order by m.Price asc Limit 1;";
				$sql = $db->prepare($string);
				$sql->bindParam(':developmentId',$contactData["intDevelopment"]);
				$sql->execute();
				$row = $sql->fetch();
				if ($row) {
					$developmentData["zoneId"] = $row[4];	
					$developmentData["stateId"] = $row[6];		
					$developmentData["localityId"] = $row[5];
					$developmentData["developmentId"] = $row[7];
					$developmentData["modelMinId"] = $row[0];
					$developmentData["modelMinName"] = $row[1];
					$developmentData["modelMinPrice"] = $row[2];
					$developmentData["modelMinShortUrl"] = $row[3];
				}
			} 

			$firstAccessCampaign = $contactData["firstAccessCampaign"];
			$sessionCampaign = $contactData["sessionCampaign"];

			if (!($firstAccessCampaign == '' || $firstAccessCampaign == null)) { 
				$firstAccessCampaign = $sessionCampaign;
			}

			if (strtolower(substr($firstAccessCampaign, 0, 6)) == 'ad_id.') {
				$firstAccessCampaign = substr($firstAccessCampaign, 6);
			}

			if (strtolower(substr($sessionCampaign, 0, 6)) == 'ad_id.') {
				$sessionCampaign = substr($sessionCampaign, 6);
			}		

			if (!(substr(trim($sessionCampaign),0,20) == 'https://facebook.com')) { 
				$eventURL = $sessionCampaign;
			} else {
				$eventURL = null;
			}		
			
			if ((strtolower(trim($firstAccessCampaign)) == 'direct') || (strtolower(trim($firstAccessCampaign)) == 'directo') || ($firstAccessCampaign == '') || ($firstAccessCampaign == null)) {
				$firstAccessMedium = 'direct';
				$firstAccessAdName = null;
				$firstAccessCampaignName = null;
				$firstAccessAdSetName = null;
				$firstAccessCampaign = null;
			} else {
				$firstAccessMedium = 'paid';
				$string = "Select AdName, CampaignName, AdSetName from tratodirecto_db.CampaignFacebook where AdId = :campaignId limit 1;";
				$sql = $db->prepare($string);
				$sql->bindParam(':campaignId',$firstAccessCampaign);
				$sql->execute();
				$row = $sql->fetch();
				if ($row) {
					$firstAccessAdName = $row[0]; 
					$firstAccessCampaignName = $row[1]; 
					$firstAccessAdSetName = $row[2];
					$firstAccessCampaign = $firstAccessCampaign;
				} else {
					$firstAccessAdName = null;
					$firstAccessCampaignName = null;
					$firstAccessAdSetName = null;
					$firstAccessCampaign = null;
				}				
			}

			if ((strtolower(trim($sessionCampaign)) == 'direct') || (strtolower(trim($sessionCampaign)) == 'directo') || ($sessionCampaign == '') || ($sessionCampaign == null)) {  //pendoente
				$sessionMedium = 'direct';
				$lastSessionAdName = null;
				$lastSessionCampaignName = null;
				$lastSessionAdSetName = null;
				$sessionCampaign = null;
			} else if (strtolower(trim($sessionCampaign)) == 'pendiente') {
				$sessionMedium = 'pending';
				$lastSessionAdName = null;
				$lastSessionCampaignName = null;
				$lastSessionAdSetName = null;
				$sessionCampaign = null;
			} else {
				$sessionMedium = 'paid';
				$string = "Select AdName, CampaignName, AdSetName from tratodirecto_db.CampaignFacebook where AdId = :campaignId limit 1;";
				$sql = $db->prepare($string);
				$sql->bindParam(':campaignId',$sessionCampaign);
				$sql->execute();
				$row = $sql->fetch();
				if ($row) {
					$lastSessionAdName = $row[0]; 
					$lastSessionCampaignName = $row[1]; 
					$lastSessionAdSetName = $row[2]; 
					$sessionCampaign = $sessionCampaign;
				} else {
					$lastSessionAdName = null;
					$lastSessionCampaignName = null;
					$lastSessionAdSetName = null;
					$sessionCampaign = null;
				}				
			}		
			
			$hotLeadId = null;
			$string = "Insert into tratodirecto_db.HotLead (DateTime, UtcCreatedAt, CreatedBy, Name, LastName, Phone, Email, Device_Id, CurrentPrice, HousingDevelopment_Id, 
			Source_Id, CommunicationType_Id, HotLeadFlag_Id, IsTest, EventUrl, User_Id, HubSpot_Id, Channel_Id, ConversionStatus_Id, State_Id, 
			Locality_Id, Zone_Id) values (now(), unix_timestamp(), 326, :contactFirstName,
			:contactLastName, :contactPhone, ifnull(:contactMail, null), 2, ifnull(:modelMinPrice, null), ifnull(:developmentId, 0), 8,
			10, 1, 0, ifnull(:eventURL, null), :contactId, :hubSpotContactId, 3, 6, ifnull(:stateId, null), ifnull(:localityId, null),
			ifnull(:zoneId, null));";
			$sql = $db->prepare($string);
			$sql->bindParam(':contactFirstName',$contactData["name"]);
			$sql->bindParam(':contactLastName',$contactData["lastName"]);
			$sql->bindParam(':contactPhone',$phone);
			$sql->bindParam(':contactMail',$contactData["email"]);
			$sql->bindParam(':modelMinPrice',$modelMinPrice);
			$sql->bindParam(':developmentId',$developmentId);
			$sql->bindParam(':eventURL',$eventURL);
			$sql->bindParam(':contactId',$contactId);
			$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
			$sql->bindParam(':stateId',$stateId);
			$sql->bindParam(':localityId',$localityId);
			$sql->bindParam(':zoneId',$zoneId);
			if ($sql->execute()) {
				$hotLeadId = $db->lastInsertId();
			} else {
				//$db->rollBack();
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."There was an error creating the Lead.";
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);		
				error_log($message);
			}

			$string = "Insert into tratodirecto_db.HotLeadDetail (HotLead_Id, 
			FirstAccessSource, FirstAccessMedium, FirstAccessCampaign, FirstAccessHsaAd, FirstAccessUTC, FirstAccessAdSet, FirstAccessAd,
			SessionSource, SessionMedium, SessionCampaign, SessionHsaAd, SessionUTC, SessionAdSet, SessionAd, ConversionUrl) values (:hotLeadId, 
			'facebook', :firstAccessMedium, :firstAccessCampaign, :firstAccessHsaAd, unix_timestamp(), :firstAccessAdSet, :firstAccessAd,
			'facebook', :sessionMedium, :sessionCampaign, :sessionHsaAd, unix_timestamp(), :sessionAdSet, :sessionAd, :conversionUrl);";
			$sql = $db->prepare($string);
			$sql->bindParam(':hotLeadId',$hotLeadId); 
			$sql->bindParam(':firstAccessMedium',$firstAccessMedium);
			$sql->bindParam(':firstAccessCampaign',$firstAccessCampaignName);
			$sql->bindParam(':firstAccessHsaAd',$firstAccessCampaign);
			$sql->bindParam(':firstAccessAdSet',$firstAccessAdSetName);
			$sql->bindParam(':firstAccessAd',$firstAccessAdName);
			$sql->bindParam(':sessionMedium',$sessionMedium);
			$sql->bindParam(':sessionCampaign',$lastSessionCampaignName);
			$sql->bindParam(':sessionHsaAd',$sessionCampaign);
			$sql->bindParam(':sessionAdSet',$lastSessionAdSetName);
			$sql->bindParam(':sessionAd',$lastSessionAdName);
			$sql->bindParam(':conversionUrl',$contactData["fbLastVisit"]);
			if (!$sql->execute()) {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."There was an error creating the Lead detail.";
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
			}	

		}

		if ($assignation['roundRobinName'] != 'Bot') {
			$ownerId = '42290678';
			
			if ($returnValue != 'duplicate') {
				$returnValue = 'success';
			}

			$params = array(
				"param_01" => ['type' => 'text', 'text' => $contactData["name"]],
				"param_02" => ['type' => 'text', 'text' => $assignation["roundRobinName"]]
			);
			$data = array("phoneId" => $instance["instance"], "phone" => $phone, "type" => 'template', "template" => 'mensaje_kira', "bodyParams" => $params);
			$resultMsg = sendMessageWABA($data);
			if ($resultMsg['status'] == 'error') {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."El teléfono no tiene WhatsApp.";
				error_log($message);
				$data = array("phoneId" => '21432', "phone" => '120363041856837856@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
				$db->rollBack();
				$returnValue = 'invalid';
				return $returnValue;	
			} else {
				$string = "Insert into tratodirecto_admin.Log (ProviderId, ProviderUTC, Phone, ChatContact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
				Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
				values (:providerId, unix_timestamp(), :contactPhone, :hubSpotContactId, 1, 326, :message, null, unix_timestamp(),
				7, null, null, null, null, null, null, null, null, null, null, null, :defaultInstance, 0);";
				$sql = $db->prepare($string);
				$sql->bindParam(':providerId',$resultMsg['id']);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				$sql->bindParam(':message',$resultMsg['message']);
				$sql->bindParam(':defaultInstance',$instance["instance"]);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al guardar el mensaje en el Log.";
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);	
					error_log($message);			
				} 
			}
			
			$params = array(
				"param_01" => ['type' => 'text', 'text' => $assignation["roundRobinName"]],  
				"param_02" => ['type' => 'text', 'text' => 'Bot TratoDirecto.com'],
				"param_03" => ['type' => 'text', 'text' => $contactData["name"]." ".$contactData["lastName"]],
				"param_04" => ['type' => 'text', 'text' => "https://tratodirecto.com/desarrolladores/messaging.php?contact=".$hubSpotContactId],
				"param_05" => ['type' => 'text', 'text' => "https://app.hubspot.com/contacts/5913903/contact/".$hubSpotContactId],
				"param_06" => ['type' => 'text', 'text' => $instance["instanceName"]],
				"param_07" => ['type' => 'text', 'text' => "Messeger API"]
			);
			$data = array("phoneId" => '100772469353894', "phone" => $assignation['roundRobinPhone'], "type" => 'template', "template" => 'asignacion_contacto_multiproceso', "bodyParams" => $params);
			$result = sendMessageWABA($data);
			$resultAdvisorId = isset($result['id']) ? $result['id'] : 'error';
			if ($result['status'] == 'error') {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."There was an error sending the message to adviser (".$assignation['roundRobinPhone'].")."; 
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
				$parameters = json_encode($params);	
				error_log($parameters);
			}

			$assignationBotMessage = "Se asignó el siguiente contacto a ".$assignation["roundRobinName"].":".chr(10).$contactData["name"]." ".$contactData["lastName"].chr(10)."Instancia: ".$instance["instanceName"].chr(10).$hubSpotContactId;
			$data = array("phoneId" => '21432', "phone" => '120363029818191475@g.us', "type" => 'text', "message" => $assignationBotMessage);
			$result = sendMessageMT($data);	
			if ($result == 'error') {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al enviar el mensaje de asignación al grupo.";
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
			}

			if ($imsg != '') {
				$provider = $phone.'@';
				$imsg = str_replace("{nombre}",$contactData["name"],$imsg); 
				$imsg = str_replace("{asesor}",$assignation["roundRobinName"],$imsg); 
				$imsg = str_replace("{enter}",chr(10),$imsg);
				$string = "Insert into tratodirecto_admin.Log (ProviderId, ProviderUTC, Phone, ChatContact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
				Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
				values (concat(:provider, unix_timestamp()), unix_timestamp(), :contactPhone, :hubSpotContactId, 1, :userSessionId, :internalMessage, null, unix_timestamp(),
				7, null, null, null, null, null, null, null, null, null, null, null, :defaultInstance, 1);";
				$sql = $db->prepare($string);
				$sql->bindParam(':provider',$provider);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				$sql->bindParam(':userSessionId',$assignation['roundRobinId']);
				$sql->bindParam(':internalMessage',$imsg);
				$sql->bindParam(':defaultInstance',$instance["instance"]);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al guardar el mensaje interno.";	
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);		
					error_log($message);		
				}
			}

			$ownerId = getOwnerId($assignation['roundRobinId']);

		} else {
			$ownerId = '42290678';

			if ($returnValue != 'duplicate') {
				$returnValue = 'success_bot';
			} else {
				$returnValue = 'duplicate_bot';
			}

			$params = array(
				"param_01" => ['type' => 'text', 'text' => $contactData["name"]]
			); 
			$data = array("phoneId" => $instance["instance"], "phone" => $phone, "type" => 'template', "template" => 'mensaje_kira_sin_asesor', "bodyParams" => $params);
			$resultMsg = sendMessageWABA($data);
			if ($resultMsg['status'] == 'error') {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."El teléfono no tiene WhatsApp.";
				error_log($message);
				$data = array("phoneId" => '21432', "phone" => '120363041856837856@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
				$db->rollBack();
				$returnValue = 'invalid';
				return $returnValue;
			} else {
				$string = "Insert into tratodirecto_admin.Log (ProviderId, ProviderUTC, Phone, ChatContact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
				Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
				values (:providerId, unix_timestamp(), :contactPhone, :hubSpotContactId, 1, :userSessionId, :message, null, unix_timestamp(),
				7, null, null, null, null, null, null, null, null, null, null, null, :defaultInstance, 0);";
				$sql = $db->prepare($string);
				$sql->bindParam(':providerId',$resultMsg['id']);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				$sql->bindParam(':userSessionId',$assignation['roundRobinId']);
				$sql->bindParam(':message',$resultMsg['message']);
				$sql->bindParam(':defaultInstance',$instance["instance"]);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al guardar el mensaje en el Log.";
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);	
					error_log($message);			
				} 	
			}

			$assignationBotMessage = "Se asignó el siguiente contacto al bot:".chr(10).$contactData["name"]." ".$contactData["lastName"].chr(10)."Instancia: ".$instance["instanceName"].chr(10).$hubSpotContactId;
			$data = array("phoneId" => '21432', "phone" => '120363029818191475@g.us', "type" => 'text', "message" => $assignationBotMessage);
			$result = sendMessageMT($data);	
			if ($result == 'error') {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al enviar el mensaje de asignación al grupo.";
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);
			}
			
			if ($imsg != '') {
				$provider = $phone.'@';
				$imsg = str_replace("{nombre}",$contactData["name"],$imsg); 
				$imsg = str_replace("{asesor}",$assignation["roundRobinName"],$imsg); 
				$imsg = str_replace("{enter}",chr(10),$imsg);
				$string = "Insert into tratodirecto_admin.Log (ProviderId, ProviderUTC, Phone, ChatContact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
				Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
				values (concat(:provider, unix_timestamp()), unix_timestamp(), :contactPhone, :hubSpotContactId, 1, :userSessionId, :internalMessage, null, unix_timestamp(),
				7, null, null, null, null, null, null, null, null, null, null, null, :defaultInstance, 1);";
				$sql = $db->prepare($string);
				$sql->bindParam(':provider',$provider);
				$sql->bindParam(':contactPhone',$phone);
				$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
				$sql->bindParam(':userSessionId',$assignation['roundRobinId']);
				$sql->bindParam(':internalMessage',$imsg);
				$sql->bindParam(':defaultInstance',$instance["instance"]);
				if (!$sql->execute()) {
					$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al guardar el mensaje interno.";
					$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
					$result = sendMessageMT($data);			
					error_log($message);
				}
			}		
			
		}

		$resultMsgId = isset($resultMsg['id']) ? $resultMsg['id'] : null;
		$data = array(
			'td_id' => $contactId,
			'phone' => $phone,    
			'id_mensaje_inicial_wa' => $resultMsgId,  
			'instancia' => $instance["instance"], 
			'contactado_whatsapp' => "true",
			'asesor_primer_contacto' => "42290678",    
			'apc_envio_wa' => "42290678",
			'acreditado' => $contactData["name"],
			'apellidos_acreditado' => $contactData["lastName"],
			'telefono_acreditado' => $phone
		);

		if ($contactOwnerFlag == 1) {
			$data['hubspot_owner_id'] = $ownerId;
		}

		$result = updateContactHubSpot($hubSpotContactId, $data);
		if ($result != 'success') {
			$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al actualizar los datos en HubSpot.";
			$data = array("phoneId" => '21432', "phone" => '120363027534597960@g.us', "type" => 'text', "message" => $message);
			$result = sendMessageMT($data);
			error_log($message);
		}

		/*sleep(1);
		$provider = $phone.'@';
		$string = "Select Id from tratodirecto_admin.Log_Ack where Id = :resultMsgId and Status in ('sent','delivered','read','viewed') limit 1;";
		$sql = $db->prepare($string);
		$sql->bindParam(':resultMsgId',$resultMsgId);
		$sql->execute();
		$row = $sql->fetch();
		if (!$row) {
			$message = 'Mensaje no verificado.';
			$string = "Insert into tratodirecto_admin.Log (ProviderId, ProviderUTC, Phone, ChatContact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
			Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
			values (concat(:provider, unix_timestamp()), unix_timestamp(), :contactPhone, :hubSpotContactId, 1, :userSessionId, :internalMessage, null, unix_timestamp(),
			7, null, null, null, null, null, null, null, null, null, null, null, :defaultInstance, 1);";
			$sql = $db->prepare($string);
			$sql->bindParam(':provider',$provider);
			$sql->bindParam(':contactPhone',$phone);
			$sql->bindParam(':hubSpotContactId',$hubSpotContactId);
			$sql->bindParam(':userSessionId',$assignation['roundRobinId']);
			$sql->bindParam(':internalMessage',$message);
			$sql->bindParam(':defaultInstance',$instance["instance"]);
			if (!$sql->execute()) {
				$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error al guardar el mensaje interno de status.";	
				$data = array("phoneId" => '21432', "phone" => '120363042013714295@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);
				error_log($message);				
			}
		}*/

		$endProcessTime = date('H:i:s.v');
		error_log($startProcessTime.' / '.$hubSpotContactId.' / '.$phone.' / '.$resultMsgId.' / '.$returnValue.' / '.$resultAdvisorId.' / '.$endProcessTime);	

		$db->commit();
		return $returnValue;

	} catch (PDOException $e) {
		$message = "Messeger API (".$hubSpotContactId." / ".$phone.")".chr(10)."Hubo un error. ".$e;
		error_log($message);
	}		
}

function updateContactHubSpot($hubSpotContactId, $data) {
	include ("../bat/DBconection.php");

	$url = $hubSpotBaseUrl."/crm/v3/objects/contacts/{$hubSpotContactId}";

	$headers = [
		'Content-Type: application/json',
		'Authorization: Bearer ' . $hubSpotToken
	];

	$data = array('properties' => $data);
	$post_json = json_encode($data, JSON_UNESCAPED_UNICODE);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
	curl_setopt($ch, CURLOPT_POSTFIELDS, $post_json);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	$status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
	curl_close($ch);
	if ($status_code == '200') {
		$response = 'success';
	} else {
		$response = 'error';
	}
	return $response;
}

function insert2Log($process, $hubSpotContactId, $phone, $response, $instance = null) {
	include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
		$string = "Insert into tratodirecto_admin.Log_API (Process, HubSpot_Id, Phone, Instance, Response, CreatedAt) values (:process, :hubSpotContactId, :phone, :instance, :response, unix_timestamp());";
        $sql = $db->prepare($string);
		$sql->bindParam(':process',$process);
        $sql->bindParam(':hubSpotContactId',$hubSpotContactId);
        $sql->bindParam(':phone',$phone);
		$sql->bindParam(':instance',$instance);
		$sql->bindParam(':response',$response);
        if (!($sql->execute())) {
            return false;
        }
        $db->commit();
		return true;
	} catch (PDOException $e) {
		return false;
	}
}

function returnHubSpotUserData($hubSpotContactId) {
	include ("../bat/DBconection.php");

	$data = array(
		"properties" => "firstname,lastname,phone,email,canal,campana_fb_ultima_visita,campana_fb_1a_visita,post_fb_ultima_visita,desarrollo_de_interes,hubspot_owner_id"
	);

	$url = $hubSpotBaseUrl."/crm/v3/objects/contacts/{$hubSpotContactId}?" . http_build_query($data);

	$headers = [
		'Content-Type: application/json',
		'Authorization: Bearer ' . $hubSpotToken
	];

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	curl_close($ch);
    $obj = json_decode($result);

	$data = array();
	$data['name'] = isset($obj->properties->firstname) ? $obj->properties->firstname : null;
	$data['lastName'] = isset($obj->properties->lastname) ? $obj->properties->lastname : null;
	$data['phone'] = isset($obj->properties->phone) ? $obj->properties->phone : null;
	$data['email'] = isset($obj->properties->email) ? $obj->properties->email : null;
	$data['channel'] = isset($obj->properties->canal) ? $obj->properties->canal : null;
	$data['sessionCampaign'] = isset($obj->properties->campana_fb_ultima_visita) ? $obj->properties->campana_fb_ultima_visita : null;
	$data['firstAccessCampaign'] = isset($obj->properties->campana_fb_1a_visita) ? $obj->properties->campana_fb_1a_visita : null;
	$data['fbLastVisit'] = isset($obj->properties->post_fb_ultima_visita) ? $obj->properties->post_fb_ultima_visita : null;
	$data['intDevelopment'] = isset($obj->properties->desarrollo_de_interes) ? $obj->properties->desarrollo_de_interes : null;
	$data['contactOwner'] = isset($obj->properties->hubspot_owner_id) ? $obj->properties->hubspot_owner_id : null;
    
    return $data;
}

function getAdvidser() {
    include ("../bat/DBconection.php");
    $currentTime = date('H:i:s');
	$lowerLimit = date('00:00:01');
	$upperLimit = date('04:59:59');
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        if ($currentTime >= $lowerLimit && $currentTime <= $upperLimit) {
            $string = "Select cp.Id, cp.Collaborator_Id, c.Name, c.LastName, c.Phone, cp.Position, from_unixtime(cp.UTC), c.CurrentlyWorking
            from CollaboratorPosition cp
            join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and c.CurrentlyWorking = 2 and cp.Position = 
            (Select if(
            (Select cp.Position
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and cp.Collaborator_Id = (Select Collaborator_Id from tratodirecto_admin.HubspotContact_Asignment order by Id desc limit 1)) = (Select max(cp.Position)
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id  and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and c.CurrentlyWorking = 2),
            (Select min(cp.Position)
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.Id not in (1, 2, 3, 89)  and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and c.CurrentlyWorking = 2),
            (select min(cp1.Position) from CollaboratorPosition cp1 join Collaborator c1 on c1.Id = cp1.Collaborator_Id and c1.Id not in (1, 2, 3, 89) and c1.MessagingAccount_Id = 1
            where cp1.Id > (Select cp.Id from CollaboratorPosition cp 
            join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and cp.Collaborator_Id = (Select Collaborator_Id from tratodirecto_admin.HubspotContact_Asignment order by Id desc limit 1))
            and cp1.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
            and c1.CurrentlyWorking = 2)) as 'nextPosition');";
            $sql = $db->prepare($string);
            $sql->execute();
            $row = $sql->fetch();
            if($row) {
                $roundRobinId = $row[1];
                $roundRobinName = $row[2] . ' ' . $row[3];
                $roundRobinPhone = $row[4];
            } else {
                $string = "Select cp.Id, cp.Collaborator_Id, c.Name, c.LastName, c.Phone, cp.Position, from_unixtime(cp.UTC), c.CurrentlyWorking
                from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
                where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
                and c.CurrentlyWorking = 2 and cp.Position = (Select min(cp.Position)
                from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
                where cp.UTC between unix_timestamp(CONCAT(CURDATE() - INTERVAL 1 DAY, ' 05:00:00')) and unix_timestamp(CONCAT(CURDATE(), ' 04:59:59'))
                and c.CurrentlyWorking = 2);";
                $sql = $db->prepare($string);
                $sql->execute();
                $row = $sql->fetch();
                if($row) {
                    $roundRobinId = $row[1];
                    $roundRobinName = $row[2] . ' ' . $row[3];
                    $roundRobinPhone = $row[4];
                } else {
                    $roundRobinId = '326';
                    $roundRobinName = 'Bot';
                    $roundRobinPhone = '5215548559025-1589153688@g.us';						
                } 				
            }  				
        } else {
            $string = "Select cp.Id, cp.Collaborator_Id, c.Name, c.LastName, c.Phone, cp.Position, from_unixtime(cp.UTC), c.CurrentlyWorking
            from CollaboratorPosition cp
            join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and c.CurrentlyWorking = 2 and cp.Position = 
            (Select if(
            (Select cp.Position
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1 
            where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and cp.Collaborator_Id = (Select Collaborator_Id from tratodirecto_admin.HubspotContact_Asignment order by Id desc limit 1)) = (Select max(cp.Position)
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and c.CurrentlyWorking = 2),
            (Select min(cp.Position)
            from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.Id not in (1, 2, 3, 89) and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and c.CurrentlyWorking = 2),
            (select min(cp1.Position) from CollaboratorPosition cp1 join Collaborator c1 on c1.Id = cp1.Collaborator_Id and c1.Id not in (1, 2, 3, 89) and c1.MessagingAccount_Id = 1
            where cp1.Id > (Select cp.Id from CollaboratorPosition cp 
            join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
            where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and cp.Collaborator_Id = (Select Collaborator_Id from tratodirecto_admin.HubspotContact_Asignment order by Id desc limit 1))
            and cp1.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
            and c1.CurrentlyWorking = 2)) as 'nextPosition');";
            $sql = $db->prepare($string);
            $sql->execute();
            $row = $sql->fetch();
            if($row) {
                $roundRobinId = $row[1];
                $roundRobinName = $row[2] . ' ' . $row[3];
                $roundRobinPhone = $row[4];
            } else {
                $string = "Select cp.Id, cp.Collaborator_Id, c.Name, c.LastName, c.Phone, cp.Position, from_unixtime(cp.UTC), c.CurrentlyWorking
                from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
                where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
                and c.CurrentlyWorking = 2 and cp.Position = (Select min(cp.Position)
                from CollaboratorPosition cp join Collaborator c on c.Id = cp.Collaborator_Id and c.MessagingAccount_Id = 1
                where cp.UTC between unix_timestamp(CONCAT(CURDATE(), ' 05:00:00')) and unix_timestamp(CONCAT(DATE_ADD(CURDATE(), INTERVAL 1 day), ' 04:59:59'))
                and c.CurrentlyWorking = 2);";
                $sql = $db->prepare($string);
                $sql->execute();
                $row = $sql->fetch();
                if($row) {
                    $roundRobinId = $row[1];
                    $roundRobinName = $row[2] . ' ' . $row[3];
                    $roundRobinPhone = $row[4];
                } else {
                    $roundRobinId = '326';
                    $roundRobinName = 'Bot';
                    $roundRobinPhone = '5215548559025-1589153688@g.us';			
                }  				
            }  				
        }
        $result = array(
            "result" => 'success',
            "roundRobinId" => $roundRobinId,
            "roundRobinName" => $roundRobinName,
            "roundRobinPhone" => $roundRobinPhone
        );
        return $result;	
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}     
}

function getWABAInstance($instance) {
	include '../bat/DBconection.php';
    try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select Instance, Name from tratodirecto_admin.API where Instance = :instance;";
        $sql = $db->prepare($string);
        $sql->bindParam(':instance',$instance);
        $sql->execute();
        $row = $sql->fetch();
        $db = null;
        if ($row) {
			$resultData = array(
				"instance" => $row[0],
				"instanceName" => $row[1]
			);				
			return $resultData;
		} else {
			$resultData = array(
				"instance" => '110713365010724',
				"instanceName" => 'WABA Oficial'
			);
			return $resultData;
		}

    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage();
    }
}


function getOwnerId($collaboratorId) {
    include '../bat/DBconection.php';
    try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
        $string = "Select HubSpotOwner_Id from tratodirecto_db.Collaborator where Id = :collaboratorId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':collaboratorId',$collaboratorId);
        $sql->execute();
        $row = $sql->fetch();
        $db = null;
        if ($row) {
			return $row[0];
		} else {
			return '42290678';	
		}

    } catch (PDOException $e) {
        print "Error!: " . $e->getMessage();
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
    $buttonsParams = isset($data["buttonsParams"]) ? $data["buttonsParams"] : null;

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
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 0, 'parameters' => [['type' => 'text', 'text' => $buttonsParams]]];
        }

        if ($templateData['hasButton02']) {       
            $b = count($data['template']['components']);
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 1, 'parameters' => [['type' => 'text', 'text' => $buttonsParams]]];
        }

        if ($templateData['hasButton03']) {       
            $b = count($data['template']['components']);
            $data['template']['components'][$b] = ['type' => 'button', 'sub_type' => 'url', 'index' => 2, 'parameters' => [['type' => 'text', 'text' => $buttonsParams]]];
        }

    }

    $request_headers = array();
	if ($phoneId == '103999962366159') {
		$request_headers[] = 'Authorization: Bearer '.$wabaTokenCA;
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
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / WABA (Success) / '.$phone.' / '.$result);
        $result_waba = array(
            "status" => 'success',
            "id" => $obj->messages[0]->id,
            "message" => $message 
        );
        return $result_waba;
    } else {
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / WABA (Error) / '.$phone.' / '.$result);
        $message = isset($obj->error->error_user_msg) ? isset($obj->error->error_user_msg) : 'Hubo un error';
        $result_waba = array(
            "status" => 'error',
            "message" => $message 
        );
        return $result_waba;
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
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / MT (Success) / '.$phone.' / '.$result);
        $result = array(
            "status" => 'success',
            "id" => $obj->data->msgId,
            "message" => $message 
        );
        return $result;
    } else {
		$currentDate = date("Y-m-d H:i:s");
		error_log('['.$currentDate.'] / MT (Error) / '.$phone.' / '.$result);
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
        from WABAtemplates where Name = :template and WABAPhoneId = :phoneId limit 1";
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

function getAdvidserCordinator() {
	$currentTime = date('H:i:s');
	$lowerLimit = date('00:00:00');
	$upperLimit = date('15:30:00');

	if ($currentTime >= $lowerLimit && $currentTime <= $upperLimit) {
		$result = array(
			"result" => 'success',
			"id" => '1573',
			"name" => 'Melissa Morales',
			"phone" => '+525586557252'
		);		
	} else {
		$result = array(
			"result" => 'success',
			"id" => '1607',
			"name" => 'Areli Alvarez',
			"phone" => '+525534034116'
		);
	}

    return $result;
}

function searchPhoneInHubSpot($phone) {
	include ("../bat/DBconection.php");

	$data = '{
		"filterGroups":[
			{"filters":[{"propertyName": "phone","operator": "EQ","value": "*'.$phone.'"}]}
		],
		"properties": [ 
			"firstname", "lastname", "phone", "email"
		]
	}';

	$url = $hubSpotBaseUrl."/crm/v3/objects/contacts/search"; 

	$headers = [
		'Content-Type: application/json',
		'Authorization: Bearer ' . $hubSpotToken
	];

	$post_json = json_encode($data, JSON_UNESCAPED_UNICODE);
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_POST, true);
	curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$result = curl_exec($ch);
	curl_close($ch);
	$obj = json_decode($result); 
	return $obj;
}

function searchPhone($phone, $hubspotid) {
	$phone = substr(trim($phone), -10);
	$obj = searchPhoneInHubSpot($phone);
	$x = 0;
	$hubSpotData = '';
	
	if (isset($obj->total)) {
		$recordsFound = $obj->total;
		if ($obj->total > 1) {
			foreach ($obj->results as $data) {  
				if ($data->id != $hubspotid) {
					if ($x == $recordsFound-1) {
						$hubSpotData .= ' y ';
					} else if ($x != 0) {
						$hubSpotData .= ', ';
					}
					$hubSpotData .= $data->id;
					$x++;
				}
			}
			if ($x == 1) {
				$message = 'HubSpot Search Phone API ('.$hubspotid.' / '.$phone.')'.chr(10).'El número de teléfono ya se encuentra registrado al contacto con HubSpot Id: '.$hubSpotData.'.';
				$data = array("phoneId" => '21432', "phone" => '120363027534597960@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);		
				error_log($message);
				$response =  'duplicated';
			} else {
				$message = 'HubSpot Search Phone API ('.$hubspotid.' / '.$phone.')'.chr(10).'El número de teléfono ya se encuentra registrado en los contactos con HubSpot Id: '.$hubSpotData.'.';
				$data = array("phoneId" => '21432', "phone" => '120363027534597960@g.us', "type" => 'text', "message" => $message);
				$result = sendMessageMT($data);		
				error_log($message);
				$response =  'duplicated';
			}
		} else {
			$message =  'No records found';
			$response =  'no_duplicated';
		}
	} else {
		$response =  'error';
		error_log(json_encode($obj));
	}

	return $response;
}

?>