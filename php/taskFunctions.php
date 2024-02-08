<?php
ini_set('mysql.connect_timeout','0');   
ini_set('max_execution_time', '0'); 
date_default_timezone_set('America/Mexico_City');

function returnTaskType() : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "SELECT Id, Name from TaskType;";
		$sql = $db->prepare($string);
		$sql->execute();
		$row = $sql->fetchAll(PDO::FETCH_ASSOC);
		$db = null;
		return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function addNewTask($activeMessagesContactId, $taskType, $taskDescription, $expirationDate, $instance, $userId, $userName, $userSessionRole) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

        $string = "SELECT count(Id) as Total from Task where Contact_Id = :contactId and TaskType_Id = :typeId and Flag_Id = 3;";
        $sql = $db->prepare($string);
        $sql->bindParam(':contactId', $activeMessagesContactId);
        $sql->bindParam(':typeId', $taskType);
        $sql->execute();
        $count = $sql->fetch(PDO::FETCH_ASSOC);
        if ($count["Total"] != 0) throw new Exception("Error: TaskType already exist", 3);

        $taskDescription = htmlspecialchars($taskDescription);

        $string = "INSERT into Task (Description, ExpiresAt, CreatedAt, UpdatedAt, Collaborator_Id, Contact_Id, TaskType_Id, Flag_Id) value (:taskDescription, :expirationDate, unix_timestamp(), unix_timestamp(), :userId, :contactId, :taskType, 3);";
		$sql = $db->prepare($string);
        $sql->bindParam(':taskDescription', $taskDescription);
        $sql->bindParam(':expirationDate', $expirationDate);
        $sql->bindParam(':userId', $userId);
        $sql->bindParam(':contactId', $activeMessagesContactId);
        $sql->bindParam(':taskType', $taskType);
		if ($sql->execute()) {
            $taskId = $db->lastInsertId();
		} else {
            $db->rollBack();
            throw new Exception("Error: Cant create task", 1);
		}

        if ($taskType == 2) {
            $string = "SELECT Phone, ConversionStatus_Id FROM Contact where Id = :contactId;";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId', $activeMessagesContactId);
            $sql->execute();
            $contactInfo = $sql->fetch(PDO::FETCH_ASSOC);

            if (isset($contactInfo["ConversionStatus_Id"]) && $contactInfo["ConversionStatus_Id"] != 4) {
                $db->rollBack();
                throw new Exception("Error: Contact $activeMessagesContactId have invalid Status for this task", 4);
            }

            $phone = $contactInfo["Phone"];
            $providerId = "internal_".str_replace('+', '', $phone)."@".date('Ymdhis');
            $message = "Se envió a maduración, Realizado por: $userName, Motivo: $taskDescription, Vencimiento: ".date('d/m/Y H:i', $expirationDate);

            $string = "INSERT INTO Log (ProviderId, ProviderUTC, Phone, Contact_Id, ChatType_Id, Adviser_Id, MsgText, UTC, Flag_Id, Type, Instance, Internal, Uploaded) values (:provider, unix_timestamp(), :phone, :contact, 1, :user, :message, unix_timestamp(), 7, 'text', :instance, 1, 0);";
            $sql = $db->prepare($string);
            $sql->bindParam(':provider', $providerId);
            $sql->bindParam(':phone', $phone);
            $sql->bindParam(':contact', $activeMessagesContactId);
            $sql->bindParam(':user', $userId);
            $sql->bindParam(':message', $message);
            $sql->bindParam(':instance', $instance);
            if ($sql->execute()) {
                $logId = $db->lastInsertId();
            } else {
                $db->rollBack();
                throw new Exception("Error: Cant create Log register, $message", 1);
            }
        }

        $db->commit();
        $db = null;

        addTaskNote("Se creo la tarea", $taskId, $userId, $userName, $userSessionRole);

		return [ "status" => true, "taskId" => $taskId ];
	} catch (PDOException $e) {
        error_log($e);
        return [ "status" => false, "taskId" => 0];
	} catch (Exception $e) {
        error_log($e);
        $message = ($e->getCode() == 4) ? "No se ha actualizado el Status de la Conversión del contacto." : null;
        $message = ($e->getCode() == 3) ? "Solo se puede tener una tarea de cada tipo pendiente." : null;
        return [ "status" => false, "taskId" => 0, "message" => $message];
	}
}

function isActiveTask($taskId) : bool {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));

        $stringDate = "SELECT Flag_Id from Task where Id = :taskId;";
        $sql = $db->prepare($stringDate);
        $sql->bindParam(':taskId', $taskId);
		$sql->execute();
		$flagTask = $sql->fetch(PDO::FETCH_ASSOC);

        $db = null;

        return $flagTask["Flag_Id"] == 3;
    } catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
        return false;
	}
}

function addTaskNote($note, $taskId, $userId, $userName, $userSessionRole, $fromFile = false ) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();

        if (!$fromFile) $note = htmlspecialchars($note);

        $string = "INSERT into TaskNote (Text, CreatedAt, Collaborator_Id, Task_Id) value (:note, unix_timestamp(), :userId, :taskId);";
		$sql = $db->prepare($string);
        $sql->bindParam(':note', $note);
        $sql->bindParam(':userId', $userId);
        $sql->bindParam(':taskId', $taskId);
		if ($sql->execute()) {
            $taskNoteId = $db->lastInsertId();
		} else {
            $db->rollBack();
            throw new Exception("Error: Cant create note \"$note\" on taskId \"$taskId\"", 1);
		}

        $string = "UPDATE Task set UpdatedAt = unix_timestamp() where Id = :taskId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':taskId', $taskId);
        if(!$sql->execute()) {
			$db->rollBack();
			throw new Exception("Error: cant update ExpiresAt", 1);
		}

        $db->commit();
        $db = null;

		return array(
            "status" => true,
            "Text" => $note,
            "CreatedBy" => $userName,
            "CreatedAt" => date('d/m/Y H:i')
        );
	} catch (Exception $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
        return array("status" => false);
	}
}

function addTaskFile($source, $name, $isImage, $type, $taskId, $userId, $userName, $userSessionRole) : array {
    include ("../bat/DBconection.php");
    include './cloudStorage.php';
	try {
        $filePath = '../uploadedFiles/';
        $name = strtotime('now')."-".$name;
        $fileArray = explode(';', $source);
        $fileString = explode(',', $fileArray[1]);
        $saved = file_put_contents($filePath.$name, base64_decode($fileString[1]));
        if (!$saved) throw new Exception("Error: cant save file", 1);
        // $fileURL = send2Storage($filePath, $name);
	    $uploadResult = upload_object('tratodirecto.com', 'hogares-union/'.$name, $filePath.$name, true);
        $fileURL = (($uploadResult) ? "https://storage.googleapis.com/tratodirecto.com/hogares-union/" : "https://hu.tratodirecto.com/uploadedFiles/" ) + $name;
        // if (strpos($fileURL, "https://hu.tratodirecto.com")) unlink($filePath . $name);
        if ($uploadResult) unlink($filePath . $name);
        
        $note = $fileURL;
        if ($isImage != "true") {
            $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		    $db->beginTransaction();

            $string = "SELECT Contact_Id from Task where Id = :taskId ;";
            $sql = $db->prepare($string);
            $sql->bindParam(':taskId', $taskId);
            $sql->execute();
            $task = $sql->fetch(PDO::FETCH_ASSOC);
            $contactId = $task["Contact_Id"];

            $string = "INSERT into Contact_File (Contact_Id, FileUrl, FileName, MimeType, CreatedAt, CreatedBy, Flag_Id) value (:contactId, :fileUrl, :fileName, :type, unix_timestamp(), :createdBy, 3);";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactId', $contactId);
            $sql->bindParam(':fileUrl', $fileURL);
            $sql->bindParam(':fileName', $name);
            $sql->bindParam(':type', $type);
            $sql->bindParam(':createdBy', $userId);
            if ($sql->execute()) {
                $fileId = $db->lastInsertId();
            } else {
                $db->rollBack();
                throw new Exception("Error: Cant register File $fileURL", 1);
            }

            $db->commit();
            $db = null;
            $note = "Se agrego a la biblioteca el archivo <a href=\"$fileURL\" target=\"_blank\">{$name}</a>";
        }

        addTaskNote($note, $taskId, $userId, $userName, $userSessionRole, true);

        return array(
            "status" => true,
            "Text" => $note,
            "CreatedBy" => $userName,
            "CreatedAt" => date('d/m/Y H:i')
        );
    } catch (Exception $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
        return array("status" => false);
	}
}

function returnTasks($contactId, $userId, $userName, $userSessionRole ) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "SELECT t.Id, tt.Name as Type, if(t.Flag_Id = 3, 'Pendiente', 'Concluida') as Status,
        DATE_FORMAT(from_unixtime(t.ExpiresAt),'%d/%m/%Y %H:%i') as ExpiresAt,
        DATE_FORMAT(from_unixtime(t.UpdatedAt),'%d/%m/%Y %H:%i') as UpdatedAt
        from Task t
        join TaskType tt on tt.Id = t.TaskType_Id
        where Contact_Id = :contactId;";
		$sql = $db->prepare($string);
        $sql->bindParam(':contactId', $contactId);
		$sql->execute();
		$rows = $sql->fetchAll(PDO::FETCH_ASSOC);
		$db = null;
		return $rows;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function returnTask($taskId, $userId, $userName, $userSessionRole) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "SELECT t.Id, tt.Name as Type, t.Description,
        DATE_FORMAT(from_unixtime(t.ExpiresAt),'%d/%m/%Y') as Date,
        DATE_FORMAT(from_unixtime(t.ExpiresAt),'%H:%i') as Time
        from Task t
        join TaskType tt on tt.Id = t.TaskType_Id
        where t.Id = :taskId;";
		$sql = $db->prepare($string);
        $sql->bindParam(':taskId', $taskId);
		$sql->execute();
		$task = $sql->fetch(PDO::FETCH_ASSOC);

        $string = "SELECT tn.Text, concat(c.Name, ' ', c.LastName) CreatedBy,
        DATE_FORMAT(from_unixtime(tn.CreatedAt),'%d/%m/%Y %H:%i') as CreatedAt
        from TaskNote tn
        join Collaborator c on c.Id = tn.Collaborator_Id
        where tn.Task_Id = :taskId;";
		$sql = $db->prepare($string);
        $sql->bindParam(':taskId', $taskId);
		$sql->execute();
		$notes = $sql->fetchAll(PDO::FETCH_ASSOC);

        $task["Notes"] = $notes;

		$db = null;
		return $task;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function updateTaskDate($newDate, $taskId, $userId, $userName, $userSessionRole ) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $db->beginTransaction();

        $stringDate = "SELECT ExpiresAt from Task where Id = :taskId;";
        $sql = $db->prepare($stringDate);
        $sql->bindParam(':taskId', $taskId);
		$sql->execute();
		$dateTask = $sql->fetch(PDO::FETCH_ASSOC);

        if (intval($newDate) <= intval($dateTask["ExpiresAt"])) throw new Exception("Error: Date invalid", 1);

        $string = "UPDATE Task set ExpiresAt = :newDate where Id = :taskId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':newDate', $newDate);
        $sql->bindParam(':taskId', $taskId);
        if(!$sql->execute()) {
			$db->rollBack();
			throw new Exception("Error: cant update ExpiresAt", 1);
		}
		$db->commit();
        $db = null;

        $note = "Se actualizo la fecha de la tarea, Anterior: ".date('d/m/Y H:i', $dateTask['ExpiresAt']).", Nueva: ".date('d/m/Y H:i', $newDate);
        addTaskNote($note, $taskId, $userId, $userName, $userSessionRole);

        return array(
            "status" => true,
            "Text" => $note,
            "CreatedBy" => $userName,
            "CreatedAt" => date('d/m/Y H:i')
        );
    } catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
        return array("status" => false);
	}
}

function finishTask($taskId, $userId, $userName, $userSessionRole ) : array {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $db->beginTransaction();

        $note = "Se concluyó la tarea";
        addTaskNote($note, $taskId, $userId, $userName, $userSessionRole);

        $string = "UPDATE Task set Flag_Id = 4 where Id = :taskId;";
        $sql = $db->prepare($string);
        $sql->bindParam(':taskId', $taskId);
        if(!$sql->execute()) {
			$db->rollBack();
			throw new Exception("Error: cant finish task", 1);
		}
		$db->commit();
        $db = null;
        return array("status" => true);
    } catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
        return array("status" => false);
	}
}