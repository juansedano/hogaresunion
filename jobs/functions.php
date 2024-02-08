<?php
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

    if (strlen($phoneId) < 8) {
        $data = array("phoneId" => $phoneId, "phone" => $phone, "type" => 'template', "template" => $template, "bodyParams" => $bodyParams, "wabaPhoneId" => '110713365010724');
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
    error_log('1/'.$phone.'/'.$result); 
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
            "message" => $message 
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

    if ($template == 'text') {
        $type = 'text';
        $message = $bodyParams['param_02']['text'];
    }

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

function updateScheduleMessage($id) {
	include ("../bat/DBconection.php");
	$flag = 0;
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $string = "Update tratodirecto_hu.ScheduledMessage set Flag_Id = 4 where Id = :id and Flag_Id = 3;";
        $sql = $db->prepare($string);
        $sql->bindParam(':id',$id);
        if (!($sql->execute())) {
            return false;
        }
        $db->commit();
        $db = null;
		return true;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}

function sendData2Log($contactId, $providerId, $contactPhone, $adviserId, $message, $instance, $flag) {
	include ("../bat/DBconection.php");
	$flag = 0;
	try {
		$db = new PDO('mysql:host='.$servername.';dbname='.$dbname,$username,$password,array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8, time_zone = "'.$timezonediff.'"',
		PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
		$db->beginTransaction();
        $string = "Insert into tratodirecto_hu.Log_".$instance." (ProviderId, ProviderUTC, Phone, Contact_Id, ChatType_Id, Adviser_Id, MsgText, MsgFile, UTC, Flag_Id, FromMe,
        Self, IsForwarded, Author, ChatId, MessageNumber, Type, SenderName, Caption, QuotedMsgBody, ChatName, Instance, Internal)
        values (:providerId, unix_timestamp(), :contactPhone, :contactId, 1, :adviserId, :message, null, unix_timestamp(),
        7, null, null, null, null, null, null, null, null, null, null, null, :instance, :flag);";
        $sql = $db->prepare($string);
        $sql->bindParam(':providerId',$providerId);
        $sql->bindParam(':contactPhone',$contactPhone);
        $sql->bindParam(':contactId',$contactId);
        $sql->bindParam(':adviserId',$adviserId); 
        $sql->bindParam(':message',$message);
        $sql->bindParam(':instance',$instance);
        $sql->bindParam(':flag',$flag);
        if (!($sql->execute())) {
            return false;
        }
        $db->commit();
        $db = null;
		return true;
	} catch (PDOException $e) {
		print "Error!: " . $e->getMessage() . "<br/>";
	}
}
?>