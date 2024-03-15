<?php
ini_set('mysql.connect_timeout','0');   
ini_set('max_execution_time', '0'); 
date_default_timezone_set('America/Mexico_City');

function saveMessage($message) {
    include ("../bat/DBconection.php");

    $newContactFlag = true;
    $phone = $message['changes'][0]['value']['messages'][0]['from'];
    if (!(strpos($phone, '-'))) {
        /*if (substr($phone, 0, 1) != '1') {
            $phone = '+52'.substr($phone, -10);
        } else {
            $phone = '+'.$phone;
        }*/
        if (substr($phone, 0, 1) != '+') {
            $phone = '+'.$phone;
        }

        if (substr($phone, 0, 4) == '+521') {
            $phone = '+52'.substr($phone, -10);
        }
    } //else {
    //    $phone = $phone;
    //}

    $senderName = $message['changes'][0]['value']['contacts'][0]['profile']['name'];
    $firstName =  $senderName;
    $author = $message['changes'][0]['value']['messages'][0]['from'];
    $providerId = $message['changes'][0]['value']['messages'][0]['id'];
    $utc = $message['changes'][0]['value']['messages'][0]['timestamp'];
    $type = $message['changes'][0]['value']['messages'][0]['type'];
    $instance = $message['changes'][0]['value']['metadata']['phone_number_id'];
    if ($instance == '100772469353894') {
        return true;
    }
    $chatId = $message['id'];
    $self = 0;
    $isForwarded = 'false';
    $replyFrom = null;
    $msgText = null;
    $msgFile = null;
    $messageNumber = null;
    $quotedMsgBody = null; //Reply or Forward Message
    $caption = null;
    $facebookAd = 0;
    if (isset($message['changes'][0]['value']['messages'][0]['context']['id'])) {
        $replyMsgId = $message['changes'][0]['value']['messages'][0]['context']['id'];
        $msgData = returnMsgInfo($replyMsgId, $instance);
        //$quotedMsgBody = $replyMsgId.'/'.$msgData['type'].'/'.$msgData['info'];
        if ($msgData['type'] == 'text') {
            $quotedMsgBody = $msgData['info'];
        } elseif ($msgData['type'] == 'image') {
            $result = replyImg($msgData['info']);
            if ($result) {
                $quotedMsgBody = $result;
            }
        }
    }

    if ($type  == 'image') {
        $mimeType = $message['changes'][0]['value']['messages'][0]['image']['mime_type'];
        $mediaId = $message['changes'][0]['value']['messages'][0]['image']['id'];
        $msgFile = getMediaURL($mediaId, $instance);
        if (isset($message['changes'][0]['value']['messages'][0]['image']['caption'])) {
            $caption = $message['changes'][0]['value']['messages'][0]['image']['caption'];
        }    
    } elseif ($type == 'text') {
        if (isset($message['changes'][0]['value']['messages'][0]['referral'])) {
            $mediaUrl = $message['changes'][0]['value']['messages'][0]['referral']['image_url'];
            $mediaUrl = $message['changes'][0]['value']['messages'][0]['referral']['image_url'];
            $msgFile = saveImageFromURL($mediaUrl);
            $caption = $message['changes'][0]['value']['messages'][0]['text']['body'];
            $sourceUrl = $message['changes'][0]['value']['messages'][0]['referral']['source_url'];
            $sourceId = $message['changes'][0]['value']['messages'][0]['referral']['source_id'];
            $caption = $message['changes'][0]['value']['messages'][0]['text']['body'].' | '.$sourceUrl.' | '.$sourceId;
            $type = 'image';
            $facebookAd = 1;
        } else {
            $msgText = $message['changes'][0]['value']['messages'][0]['text']['body'];
        }
    } elseif ($type  == 'button') {
        $msgText = $message['changes'][0]['value']['messages'][0]['button']['text'];        
    } elseif ($type  == 'video') {
        $mimeType = $message['changes'][0]['value']['messages'][0]['video']['mime_type'];
        $mediaId = $message['changes'][0]['value']['messages'][0]['video']['id'];
        $msgFile = getMediaURL($mediaId, $instance);
        if (isset($message['changes'][0]['value']['messages'][0]['video']['caption'])) {
            $caption = $message['changes'][0]['value']['messages'][0]['video']['caption'];
        }        
    } elseif ($type == 'document') {
        $mimeType = $message['changes'][0]['value']['messages'][0]['document']['mime_type'];
        $mediaId = $message['changes'][0]['value']['messages'][0]['document']['id'];
        $msgFile = getMediaURL($mediaId, $instance);
        if (isset($message['changes'][0]['value']['messages'][0]['document']['caption'])) {
            $caption = $message['changes'][0]['value']['messages'][0]['document']['caption'];
        }
    } elseif ($type == 'audio') {
        $mimeType = $message['changes'][0]['value']['messages'][0]['audio']['mime_type'];
        $mediaId = $message['changes'][0]['value']['messages'][0]['audio']['id'];
        $msgFile = getMediaURL($mediaId, $instance);
        if (isset($message['changes'][0]['value']['messages'][0]['audio']['caption'])) {
            $caption = $message['changes'][0]['value']['messages'][0]['audio']['caption'];
        }
    } elseif ($type == 'location') {
        $latitude = $message['changes'][0]['value']['messages'][0]['location']['latitude'];
        $longitude = $message['changes'][0]['value']['messages'][0]['location']['longitude'];
        $msgText = $latitude.':'.$longitude;
        if (isset($message['changes'][0]['value']['messages'][0]['location']['caption'])) {
            $caption = $message['changes'][0]['value']['messages'][0]['location']['caption'];
        }
    } elseif ($type == 'unsupported') {
        $msgText = $message['changes'][0]['value']['messages'][0]['errors'][0]['title'];      
    } elseif ($type == 'contacts') {
        $first_name_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['first_name']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['first_name'] : null;
        $last_name_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['last_name']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['last_name'] : null;
        $formatted_name_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['formatted_name']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['name']['formatted_name'] : null;
        $phone_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['phone']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['phone'] : null;
        $type_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['type']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['type'] : null;
        $wa_id_msgText = isset($message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['wa_id']) ? $message['changes'][0]['value']['messages'][0]['contacts'][0]['phones'][0]['wa_id'] : null;
        $msgText = 'Nombre: '.$first_name_msgText.chr(10);
        $msgText .= 'Apellido: '.$last_name_msgText.chr(10);
        $msgText .= 'Nombre completo: '.$formatted_name_msgText.chr(10);
        $msgText .= 'Teléfono: '.$phone_msgText.chr(10);
        $msgText .= 'Tipo: '.$type_msgText.chr(10);
        $msgText .= 'Whatsapp Id: '.$wa_id_msgText.chr(10);
    } else {
        $msgText = $message['changes'][0]['value']['messages'][0];
    }

    try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
        PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $db->beginTransaction();

		$string = "Select Contact_Id from tratodirecto_hu.Log_".$instance." where right(trim(Phone),10) = right(trim(:phone),10) order by id desc limit 1;";
        $sql = $db->prepare($string);
        $sql->bindParam(':phone',$phone);
		$sql->execute();
		$row = $sql->fetch();
		if ($row) {
            $contactId = $row[0];
            $newContactFlag = false;
        } else {
            $string = "Insert into tratodirecto_hu.Contact (Name, Phone, UtcCreatedAt, UtcModifiedAt, Flag_Id) values 
            (:contactFirstName, :contactPhone, unix_timestamp(), unix_timestamp(), 1);";
            $sql = $db->prepare($string);
            $sql->bindParam(':contactFirstName',$firstName);
            $sql->bindParam(':contactPhone',$phone);
            if ($sql->execute()) {
                $contactId = $db->lastInsertId();
            } else {
                $db->rollback();
                error_log('There was an error trying to create the contact ('.$phone.').');
                return false;
            }  
            
            $string = "Insert into tratodirecto_hu.Contact_Collaborator (Contact_Id, Collaborator_Id, Instance, CreatedAt, CreatedBy, Flag_Id)
            values (:contactId, 3, :defaultInstance, unix_timestamp(), 1, 3);";
            $sql = $dbA->prepare($string);
            $sql->bindParam(':contactId',$contactId);
            $sql->bindParam(':defaultInstance',$instance);
            if (!$sql->execute()) {
                $dbA->rollBack();
                error_log('There was an error trying to assing the contact ('.$phone.').');
                return false;				
            }          
        }

        if (is_array($msgText)) {
            $msgText = 'Messaging no puede leer este mensaje';
            error_log('WABA Webhook / Msg is an array ('.$phone.') / '.$providerId.'.'); 
        }

        $adviserId = 5;
        $string = "Insert into tratodirecto_hu.Log_".$instance." (ProviderId, ProviderUTC, Phone, Contact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC,
        Flag_Id, FromMe, Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, 
        Internal, Uploaded) values (:providerId, :time, :phone, :id, 1, :adviserId, :msgText, :msgFile, unix_timestamp(),
        8, 0, :self, :isForwarded, :author, :chatId, :messageNumber, :type, :senderName, :caption, :quotedMsgBody, :chatName, :instance, 0, 0);";
        $sql = $db->prepare($string);
        $sql->bindParam(':providerId',$providerId);
        $sql->bindParam(':time',$utc);
        $sql->bindParam(':phone',$phone);
        $sql->bindParam(':id',$contactId);
        $sql->bindParam(':adviserId',$adviserId);
        $sql->bindParam(':msgText',$msgText);
        $sql->bindParam(':msgFile',$msgFile);
        $sql->bindParam(':self',$self);
        $sql->bindParam(':isForwarded',$isForwarded);
        $sql->bindParam(':author',$author);
        $sql->bindParam(':chatId',$chatId);
        $sql->bindParam(':messageNumber',$messageNumber);
        $sql->bindParam(':type',$type);
        $sql->bindParam(':senderName',$senderName);
        $sql->bindParam(':caption',$caption);
        $sql->bindParam(':quotedMsgBody',$quotedMsgBody);
        $sql->bindParam(':chatName',$author);
        $sql->bindParam(':instance',$instance);
        if (!$sql->execute()) {
            $db->rollback();
            error_log('There was an error inserting in the Log ('.$phone.').');   
            return false;	
        }

        $db->commit();
        $db = null;

        if ($newContactFlag) {
			$params = array();
			$data = array("phoneId" => $instance, "phone" => $phone, "type" => 'template', "template" => 'gracias_por_contactat', "bodyParams" => $params);
            $fileUrl = "https://storage.googleapis.com/tratodirecto.com/hogares-union/94144autoresponseImage.jpg";
            $result = sendMessageWABA($data);
            if ($result['status'] == 'success') {
                $logData = array(
                    "id" => $contactId, 
                    "instance" => $instance,
                    "phone" => $phone, 
                    "type" => 'image', 
                    "providerId" => $result['id'],
                    "fileURL" => $fileUrl,
                    "caption" => $result['message'],
                    "internal" => 0
                );
                $result = addMsg2Log($logData, 5);
            }  
        }

        if (strpos(strtolower($msgText), 'muy molesto') !== false && $type == 'text') {
            $contactData = getContactData($contactId); 
            $adviserData = getAdviserData($adviserId);
            $messageResponse = 'Nombre del cliente: '.$contactData['name'].chr(10).'Celular del cliente: '.$phone.chr(10).'Asesor: '.$adviserData['name'].chr(10).'Teléfono Asesor: '.$adviserData['phone'].chr(10).'Aparece la expresión *muy molesto* el '.date("d/m/Y").' a las '.date("H:i").'.';
            $data = array("phoneId" => '38520', "phone" => '525548559025', "type" => 'text', "message" => $messageResponse);
            $result = sendMessageMT($data);
            if ($result['status'] == 'success') {
                $logData = array(
                    "id" => 66, 
                    "instance" => '38520',
                    "phone" => '525548559025', 
                    "type" => 'text', 
                    "message" => $messageResponse,  
                    "providerId" => $result['id'],
                    "internal" => 0
                );
                $result = addMsg2Log($logData, 5);
            }
        }
        
        return "success";

    } catch (PDOException $e) {
		//return $e->getMessage();
        error_log('WABA Webhook / ' . $e->getMessage()); 
	}
}

function getContactData($contactId) {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "Select Id as 'id', concat(COALESCE(trim(Name),''), ' ', COALESCE(trim(LastName),'')) as 'name' from tratodirecto_hu.Contact where Id = :contactId";
		$sql = $db->prepare($string);		
		$sql->bindParam(':contactId',$contactId);
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
        return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function getAdviserData($adviserId) {
    include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"', PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
        $string = "Select Id as 'id', concat(COALESCE(trim(Name),''), ' ', COALESCE(trim(LastName),'')) as 'name', Phone as 'phone' from tratodirecto_hu.Collaborator where Id = :adviserId";
		$sql = $db->prepare($string);		
		$sql->bindParam(':adviserId',$adviserId);
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
        return $row;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function saveAck($ack) {
	include ("../bat/DBconection.php");
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $conversationId = null;
        $errorCode = null;
        $errorTitle = null;
        if (isset($ack['changes'][0]['value']['statuses'][0]['errors'])) {
            $errorCode = trim($ack['changes'][0]['value']['statuses'][0]['errors'][0]['code']);    
            $errorTitle = $ack['changes'][0]['value']['statuses'][0]['errors'][0]['title'];  
        } else {
            if (isset($ack['changes'][0]['value']['statuses'][0]['conversation']['id'])) {
                $conversationId = $ack['changes'][0]['value']['statuses'][0]['conversation']['id'];
            }
        }

        /*if ($errorCode == '131042' || strpos($errorTitle, 'payment')) {
            $instanceName = getInstanceName($ack['changes'][0]['value']['metadata']['phone_number_id']);
            //$message = "WABA Webhook (".$ack['changes'][0]['value']['statuses'][0]['recipient_id'].", ".$instanceName.")".chr(10).$errorTitle;
            $message = "WABA Webhook (".$instanceName.")".chr(10).$errorTitle;
            $data = array("phoneId" => '21432', "phone" => '120363159956021167@g.us', "type" => 'text', "message" => $message);
            $result = sendMessageMT($data);
        }*/

        $string = "Insert into tratodirecto_hu.Log_Ack (ProviderId, QueueNumber, ChatId, Status, Instance, Phone, errorCode, errorTitle, CreatedAt, Flag) values 
        (:providerId, null, :chatId, :status, :instance, :phone, :errorCode, :errorTitle, unix_timestamp(), 1);";
        $sql = $db->prepare($string);
        $sql->bindParam(':providerId',$ack['changes'][0]['value']['statuses'][0]['id']);
        $sql->bindParam(':chatId',$conversationId);
        $sql->bindParam(':status',$ack['changes'][0]['value']['statuses'][0]['status']);
        $sql->bindParam(':instance',$ack['changes'][0]['value']['metadata']['phone_number_id']);
        $sql->bindParam(':phone',$ack['changes'][0]['value']['statuses'][0]['recipient_id']);
        $sql->bindParam(':errorCode',$errorCode);
        $sql->bindParam(':errorTitle',$errorTitle);
        if (!$sql->execute()) {
            error_log('There was an error inserting in the Log_Ack ('.$ack['changes'][0]['value']['statuses'][0]['id'].').');   
            return false;	
        }
        $db->commit();
        $db = null;
        return true;
	} catch (PDOException $e) {
		return $e->getMessage();
	}
}

function getMediaURL($mediaId, $instance) {
    include ("../bat/instanceConnection.php");

    $url = "https://graph.facebook.com/v13.0/".$mediaId;

    if ($instance == '103999962366159') {
		$wabaToken = $wabaTokenCA;
	} else if ($instance == '185519967971331') {
        $wabaToken = $wabaTokenMsg360;
    }

    $request_headers = array();
    $request_headers[] = 'Authorization: Bearer '.$wabaToken;

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); 
    curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers); 
    $result = curl_exec($ch); 
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch); 
    $obj = json_decode($result); 
    if ($httpcode == '200') {
        $result = downloadMedia($wabaToken, $obj->url, $obj->mime_type);
        return $result;
    } else {
        return 'Error de procesamiento.';
    }
}

function downloadMedia($wabaToken, $url, $mimeType) {  
    $request_headers = array();
    $request_headers[] = 'Authorization: Bearer '.$wabaToken;
    
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_USERAGENT, 'Chrome/23.0.1271.1');
    curl_setopt($ch, CURLOPT_HEADER, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
    curl_setopt($ch, CURLOPT_VERBOSE,true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, $request_headers); 
    $data = curl_exec($ch);
    $error = curl_error($ch);
    
    $headers = array();
    $file_array = explode("\n\r", $data, 2);
    $header_array = explode("\n", $file_array[0]);
    foreach($header_array as $header_value) {
        $header_pieces = explode(': ', $header_value);
        if(count($header_pieces) == 2) {
            $headers[$header_pieces[0]] = trim($header_pieces[1]);
        }
    }
    $mediaData = 'data:'.$headers['content-type'].';base64,'.base64_encode(substr($file_array[1], 1));
    $fileName = date("YmdHisu").'.'.mime2ext($mimeType);
    $result = base64ToImage($mediaData, $fileName);
    return $result;
}

function base64ToImage($base64_string, $output_file) {
    $file = fopen('./files/'.$output_file, "wb");
    $data = explode(',', $base64_string);
    fwrite($file, base64_decode($data[1]));
    fclose($file);
    $result = send2Storage('./files/'.$output_file);
    return $result;
}

function send2Storage($path) {
    include '../php/cloudStorage.php';
    $file_name = time().'-'.basename($path); 
    $result = file_put_contents('./files/'.$file_name,file_get_contents($path));
    if (($result === false) || ($result == -1)) {
        $msgFileName = $path;
    } else {
        $fileType = pathinfo('./files/'.$file_name, PATHINFO_EXTENSION);
        $fileName = time() . '.' . $fileType;
        $uploadResult = upload_object('tratodirecto.com', 'messaging/'.$fileName, './files/'.$file_name, true); 
        if ($uploadResult) {
            $msgFileName = 'https://storage.googleapis.com/tratodirecto.com/messaging/'.$fileName;
        } else {
            $msgFileName = 'https://wmessaging.com/tratodirecto/desarrolladores/webhook/files/'.$file_name;
        }
    }
    return $msgFileName;
}

function returnMsgInfo($id, $instance) {
	include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select if(MsgText is not null,MsgText,MsgFile), if(MsgText is not null,'text','image') from tratodirecto_hu.Log_".$instance." where ProviderId = :id limit 1;";
		$sql = $db->prepare($string);
		$sql->bindParam(':id',$id);
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
		if (!$row) {
			$data = array(
				"info" => null,
				"type" => null,
			);
		} else {
			$data = array(
				"info" => $row[0],
				"type" => $row[1]
			);
		}
		return $data;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function compress($source, $destination, $quality) {

    $info = getimagesize($source);

    if ($info['mime'] == 'image/jpeg') {
        $image = imagecreatefromjpeg($source);
        $ext = 'jpg';
    } elseif ($info['mime'] == 'image/gif') {
        $image = imagecreatefromgif($source);
        $ext = 'gif';
    } elseif ($info['mime'] == 'image/png') {
        $image = imagecreatefrompng($source);
        $ext = 'png';
    } else {
        return false;
    }

    $result = imagejpeg($image, $destination.'.'.$ext, $quality);

    if ($result) {
        return $destination.'.'.$ext;
    } else {
        return false;
    }

}

function resize($newWidth, $targetFile, $originalFile) {

    $info = getimagesize($originalFile);
    $mime = $info['mime'];

    switch ($mime) {
            case 'image/jpeg':
                    $image_create_func = 'imagecreatefromjpeg';
                    $image_save_func = 'imagejpeg';
                    $new_image_ext = 'jpg';
                    break;

            case 'image/png':
                    $image_create_func = 'imagecreatefrompng';
                    $image_save_func = 'imagepng';
                    $new_image_ext = 'png';
                    break;

            case 'image/gif':
                    $image_create_func = 'imagecreatefromgif';
                    $image_save_func = 'imagegif';
                    $new_image_ext = 'gif';
                    break;

            default: 
                    throw new Exception('Unknown image type.');
    }

    $img = $image_create_func($originalFile);
    list($width, $height) = getimagesize($originalFile);

    $newHeight = ($height / $width) * $newWidth;
    $tmp = imagecreatetruecolor($newWidth, $newHeight);
    
    $result = imagecopyresampled($tmp, $img, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);

    if (file_exists($targetFile)) {
        unlink($targetFile);
    }
    $image_save_func($tmp, $targetFile.'.'.$new_image_ext);

    if ($result) {
    return $targetFile.'.'.$new_image_ext;
    } else {
        return false;
    }
}

function replyImg($source_img) {
    $sufix = date("YmdHisu");
    $destination_img = './files/'.$sufix.'_tempFile';
    $image = compress($source_img, $destination_img, 25);
    if ($image) {
        $imageResize = resize(100, './files/'.$sufix.'_tempFileResized', $image);
        if ($imageResize) {
            $type = pathinfo($imageResize, PATHINFO_EXTENSION);
            $data = file_get_contents($imageResize);
            $base64 = base64_encode($data);
            return $base64;
        } else {
            return false;
        }
    } else {
        echo false;
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
        $message = isset($obj->error->error_user_msg) ? isset($obj->error->error_user_msg) : 'Hubo un error';
        $result = array(
            "status" => 'error',
            "message" => $result
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

function getAdvidserCordinator() {
	$currentTime = date('H:i:s');
	$lowerLimit = date('00:00:00');
	$upperLimit = date('15:30:00');

	if ($currentTime >= $lowerLimit && $currentTime <= $upperLimit) {
		$result = array(
			"result" => 'success',
			"id" => '1573',
			"name" => 'Melissa Morales',
			"phone" => '+5215586557252'
		);		
	} else {
		$result = array(
			"result" => 'success',
			"id" => '1607',
			"name" => 'Areli Alvarez',
			"phone" => '+5215534034116'
		);
	}

    return $result;
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

function saveImageFromURL($url) {
    $url1 = explode("?",$url);
    $url2 = explode(".",$url1[0]);
    $lastElement = count($url2)-1;
    $ext = $url2[$lastElement];
    $file_name = time().'directimage.'.$ext;
    $data = file_get_contents($url);
    $base64_string = 'data:image/' . $ext . ';base64,' . base64_encode($data);
    $result = base64ToImage($base64_string, $file_name);
    return $result;
}

function leadCreation($sourceId,$sourceUrl,$utc,$hubSpotContactId,$phone,$contactId,$firstName) {
	include ("../bat/DBconection.php");
	try {

		$db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));

        //$firstAccessSource = 'whatsapp';
        $firstAccessUTC = $utc;
		//$firstAccessMedium = 'paid'; 
		$firstAccessHsaAd = $sourceId; 

        //$sessionSource = 'whatsapp';
        $sessionUTC = $utc;
		//$sessionMedium = 'paid';
		$sessionHsaAd = $sourceId;

		$string = "Select AdName, CampaignName, AdSetName from tratodirecto_db.CampaignFacebook where AdId = :campaignId limit 1;";
		$sql = $db->prepare($string);
		$sql->bindParam(':campaignId',$sourceId);
		$sql->execute();
		$row = $sql->fetch();
		if ($row) {
			$firstAccessAdName = $row[0];
			$firstAccessCampaignName = $row[1];
			$firstAccessAdSetName = $row[2];
			$lastSessionAdName = $row[0]; 
			$lastSessionCampaignName = $row[1]; 
			$lastSessionAdSetName = $row[2]; 
		} else {
			$firstAccessAdName = null; 
			$firstAccessCampaignName = 'pending';
			$firstAccessAdSetName = null; 
			$lastSessionAdName = null; 
			$lastSessionCampaignName = 'pending';
			$lastSessionAdSetName = null; 
			$message = 'WABA Webhook.' . chr(10) . 'No se encontraron datos para el SourceId: '.$sourceId.'.' . chr(10) . 'Phone: ' . $phone . chr(10) . 'HubSpot Id: ' . $hubSpotContactId;
			$data = array("phoneId" => '21432', "phone" => '120363024249706646@g.us', "type" => 'text', "message" => $message);
			$result = sendMessageMT($data);
		}	

        $string = "Insert into tratodirecto_db.HotLead (DateTime, UtcCreatedAt, CreatedBy, Name, LastName, Phone, Email, Device_Id, CurrentPrice, HousingDevelopment_Id, 
		Source_Id, CommunicationType_Id, HotLeadFlag_Id, IsTest, EventUrl, User_Id, HubSpot_Id, Channel_Id, ConversionStatus_Id, State_Id, Locality_Id, Zone_Id) values 
		(now(), unix_timestamp(), 326, :contactFirstName, null, :contactPhone, null, 2, null, 0, 8, 10, 1, 0, ifnull(:eventURL, null), 
		:contactId, :hubSpotContactId, 3, 6, null, null, null);";
		$sql = $db->prepare($string);
		$sql->bindParam(':contactFirstName',$firstname);
		$sql->bindParam(':contactPhone',$phone);
		$sql->bindParam(':eventURL',$sourceUrl);
		$sql->bindParam(':contactId',$contactId);
		$sql->bindParam(':hubSpotContactId',$hubSpotContactId); 
		if ($sql->execute()) {
			$hotLeadId = $db->lastInsertId();
		} else {	
			error_log('WABA Webhook / Hubo un error al crear el Lead ('.$hubSpotContactId.').'); 
		}		

        $string = "Insert into tratodirecto_db.HotLeadDetail (HotLead_Id, 
		FirstAccessSource, FirstAccessMedium, FirstAccessCampaign, FirstAccessHsaAd, FirstAccessUTC, FirstAccessAdSet, FirstAccessAd,
		SessionSource, SessionMedium, SessionCampaign, SessionHsaAd, SessionUTC, SessionAdSet, SessionAd, ConversionUrl) values (:hotLeadId, 
		'whatsapp', 'paid', :firstAccessCampaign, :firstAccessHsaAd, :firstAccessUTC, :firstAccessAdSet, :firstAccessAd,
		'whatsapp', 'paid', :sessionCampaign, :sessionHsaAd, :sessionUTC, :sessionAdSet, :sessionAd, :conversionUrl);";
		$sql = $db->prepare($string);
		$sql->bindParam(':hotLeadId',$hotLeadId);
		//$sql->bindParam(':firstAccessMedium',$firstAccessMedium);
		$sql->bindParam(':firstAccessCampaign',$firstAccessCampaignName);
		$sql->bindParam(':firstAccessHsaAd',$firstAccessHsaAd);
        $sql->bindParam(':firstAccessUTC',$firstAccessUTC);
		$sql->bindParam(':firstAccessAdSet',$firstAccessAdSetName);
		$sql->bindParam(':firstAccessAd',$firstAccessAdName);
		//$sql->bindParam(':sessionMedium',$sessionMedium);
		$sql->bindParam(':sessionCampaign',$lastSessionCampaignName);
		$sql->bindParam(':sessionHsaAd',$sessionHsaAd);
        $sql->bindParam(':sessionUTC',$sessionUTC);
		$sql->bindParam(':sessionAdSet',$lastSessionAdSetName);
		$sql->bindParam(':sessionAd',$lastSessionAdName);
		$sql->bindParam(':conversionUrl',$sourceUrl);
		if (!$sql->execute()) {	
			error_log('WABA Webhook / Hubo un error al crear el Detalle del Lead ('.$hubSpotContactId.').'); 
			return false;							
		}

		$db->commit();
		return true;
        
	} catch (PDOException $e) {
		return $e->getMessage();
	}
}

function getInstanceName($instance) {
	include ("../bat/DBconection.php");
	try {
        $db = new PDO('mysql:host='.$servername.';dbname='.$dbnameChat,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"'));
		$string = "Select Name from tratodirecto_admin.API where Instance = :instance;";
		$sql = $db->prepare($string);
		$sql->bindParam(':instance',$instance);
		$sql->execute();
		$row = $sql->fetch();
		$db = null;
		return $row[0];
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
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
?>