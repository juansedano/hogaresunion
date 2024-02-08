<?php
header("Content-Type: application/json");
ini_set('max_execution_time', '0');
include_once './wainboxFunctions.php';
include_once '../bat/sessionData.php';
if ((!$userInfo) || (!$userData)) {
	$auth0->logout();
	echo json_encode('timeout');
    die();
}
if (isset($_POST["type"])) {
 	if ($_POST["type"] == "dataInitialization") {
		$data = [
			"instances"  => returnInstances(),
			"advisers"  => returnAdvisers(),
			"contactType"  => returnContactType(),
			"contactOrigin"  => returnContactOrigin(),
			"conversionStatus"  => returnConversionStatus(),
			"state"  => returnState(),
			"locality"  => returnLocality(),
			"maritalStatus"  => returnMaritalStatus(),
			"product" => returnProduct(),
			"productCoaccredited" => returnProductCoaccredited(),
			"gender" => returnGender(),
			"socialCategory" => returnSocialCategory(),
			"identificationType" => returnIdentificationType()
		];
		echo json_encode($data);
	} else if ($_POST["type"] == "verifyContactMessages") { 
		$result = verifyContactMessages($_POST["contactId"],$_POST["instance"]);
		echo json_encode($result);			
	} else if ($_POST["type"] == "getContacts") {
		$range = isset($_POST["range"]) ? $_POST["range"] : 0; 
        $lastMessageId = isset($_POST["lastMessageId"]) ? $_POST["lastMessageId"] : 0;
        $initializingFlag = isset($_POST["initializingFlag"]) ? $_POST["initializingFlag"] : 1;
		$instance = isset($_POST["instance"]) ? $_POST["instance"] : 0;
		$result = returnContacts($initializingFlag, $range, $lastMessageId, $instance, $userData["id"], $userData["developerRole"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "getMessages") {
		$contactLastMessageId = isset($_POST["contactLastMessageId"]) ? $_POST["contactLastMessageId"] : 0;
		$contactId = isset($_POST["contactId"]) ? $_POST["contactId"] : 0;
		$instance = isset($_POST["instance"]) ? $_POST["instance"] : 0;
		$result = returnMessages($contactLastMessageId, $contactId, $instance, $userData["id"], $userData["developerRole"]);
		echo json_encode($result);
	} else if ($_POST["type"] == "sendMessage") {
		$result = sendMessage($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"], $_POST["activeMessagesPhone"], $_POST["activeMessagesProvider"], $_POST["isInternalMessage"], $_POST["message"], $userData["id"], $userData["developerRole"]);
		echo json_encode($result);
	} else if ($_POST["type"] == "getAdvancedSearch") {
		$result = returnAdvancedSearch($_POST["serchType"], $_POST["text"], $_POST["instance"], $userData["id"], $userData["developerRole"]);
		echo json_encode($result);			
	} else if ($_POST["type"] == "sendImage") {
		$result = sendImage($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"], $_POST["activeMessagesPhone"], $_POST["activeMessagesProvider"], $_POST["isInternalMessage"], $_POST["fileData"], $userData["id"], $userData["developerRole"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "getScheduleMessage") {
		$result = returnScheduleMessage($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"]); 
		echo json_encode($result);			
	} else if ($_POST["type"] == "saveScheduleMessage") {
		$result = saveScheduleMessage($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"], $_POST["activeMessagesPhone"], $_POST["activeMessagesProvider"], $_POST["messageTemplate"], $_POST["messageTxt"], $_POST["messageUTC"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "cancelScheduleMessage") {
		$result = cancelScheduleMessage($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"], $_POST["activeMessagesPhone"], $_POST["messageUTC"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);		
	} else if ($_POST["type"] == "getContactFiles") {
		$result = returnContactFiles($_POST["activeMessagesContactId"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "saveContactFile") {
		$result = saveContactFile($_POST["activeMessagesContactId"], $_POST["fileData"], $userData["id"], $userData["developerRole"]);
		echo json_encode($result);				
	} else if ($_POST["type"] == "deleteContactFiles") {
		$result = deleteContactFiles($_POST["activeMessagesContactId"], $_POST["fileId"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "addRemoveFavorite") {
		$result = addRemoveFavorite($_POST["activeMessagesContactId"], $_POST["activeMessagesInstance"], $_POST["activeMessagesPhone"], $_POST["activeMessagesIsFavorite"], $_POST["favoriteComment"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);		
	} else if ($_POST["type"] == "updateUserData") { 
		$result = updateUserData($_POST["activeMessagesContactId"], $_POST["contactId"], $_POST["userDataChanges"], $userData["id"], $userData["developerRole"]);
		echo json_encode($result);			
	} else if ($_POST["type"] == "getContactData") { 
		$result = returnContactData($_POST["activeMessagesContactId"], $userData["developerRole"]);
		echo json_encode($result);								
	} else if ($_POST["type"] == "startConversationGo") {  
		if (searchPhone(substr(trim($_POST["startConversationData"]["phone"]), -10))) {
            $result = array(
                "result" => 'duplicate',
                "msgId" => null
            );
		} else {
			$result = startConversation($_POST["startConversationData"], $userData["id"], $userData["developerRole"]);
		}
		echo json_encode($result);			
	} else if ($_POST["type"] == "addContact") {  
		if (searchPhone(substr(trim($_POST["contactData"]["phone"]), -10))) {
            $result = array(
                "result" => 'duplicate',
                "msgId" => null
            );
		} else {
			$result = addContact($_POST["contactData"], $userData["id"], $userData["name"], $userData["developerRole"]);
		}
		echo json_encode($result);			
	} else {		
		echo "Error1";
	}
} else {
	echo "Error2";
}
?>