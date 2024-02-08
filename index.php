<?php
include_once 'bat/sessionData.php';

if (!$userInfo) {
    header("Location: ./index.html");
    die();
}

$sessionId = md5($_GET['code'].date("YmdHisu"));
if (insertSessionId($userInfo['name'], $sessionId)) {
    session_regenerate_id();
    $_SESSION['loggedin'] = TRUE;
    $_SESSION['sessionid'] = $sessionId;
    header("Location: ./wainbox.php");
} else {
    $auth0->logout();
    header("Location: ./index.html");
}