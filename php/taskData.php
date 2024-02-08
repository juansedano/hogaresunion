<?php
header("Content-Type: application/json");
ini_set('max_execution_time', '0');
include_once './taskFunctions.php';
include_once '../bat/sessionData.php';
if ((!$userInfo) || (!$userData)) {
	$auth0->logout();
	echo json_encode('timeout');
    die();
}
if (isset($_POST["type"])) {
 	if ($_POST["type"] == "addNewTask") {
		$result = addNewTask($_POST["activeMessagesContactId"], $_POST["taskType"], $_POST["taskDescription"], $_POST["expirationDate"],$_POST["instance"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);	
	} else if ($_POST["type"] == "getTaskType") {
		$result = returnTaskType();
		echo json_encode($result);									
	} else if ($_POST["type"] == "getTasks") {
		$result = returnTasks($_POST["contactId"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);									
	} else if ($_POST["type"] == "getTask") {
		$result = returnTask($_POST["taskid"], $userData["id"], $userData["name"], $userData["developerRole"]);
		echo json_encode($result);									
	} else if ($_POST["type"] == "addNoteText") {
		if (isActiveTask($_POST["taskId"])) {
			$result = addTaskNote($_POST["note"], $_POST["taskId"], $userData["id"], $userData["name"], $userData["developerRole"]);
		} else {
			$result = array("status" => false, "message" => "Operacion fallida, tarea concluida.");
		}
		echo json_encode($result);									
	} else if ($_POST["type"] == "addNoteFile") {
		if (isActiveTask($_POST["taskId"])) {
			$result = addTaskFile($_POST["source"], $_POST["name"], $_POST["image"], $_POST["typeFile"], $_POST["taskId"], $userData["id"], $userData["name"], $userData["developerRole"]);
		} else {
			$result = array("status" => false, "message" => "Operacion fallida, tarea concluida.");
		}
		echo json_encode($result);									
	} else if ($_POST["type"] == "updateTaskDate") {
		if (isActiveTask($_POST["taskId"])) {
			$result = updateTaskDate($_POST["utcDateTime"], $_POST["taskId"], $userData["id"], $userData["name"], $userData["developerRole"]);
		} else {
			$result = array("status" => false, "message" => "Operacion fallida, tarea concluida.");
		}
		echo json_encode($result);									
	} else if ($_POST["type"] == "finishTask") {
		if (isActiveTask($_POST["taskId"])) {
			$result = finishTask($_POST["taskId"], $userData["id"], $userData["name"], $userData["developerRole"]);
		} else {
			$result = array("status" => false, "message" => "Operacion fallida, tarea concluida.");
		}
		echo json_encode($result);									
	} else {		
		echo "Error1";
	}
} else {
	echo "Error2";
}