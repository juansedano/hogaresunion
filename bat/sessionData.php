<?php
require __DIR__ . './../vendor/autoload.php';
require __DIR__ . '/authConection.php';
require __DIR__ . '/../php/loginFunctions.php';

use Auth0\SDK\Auth0;

try {
    $auth0 = new Auth0([
        'domain' => $domain,
        'client_id' => $client_id ,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'audience' => $audience,
        'scope' => 'openid profile',
        'persist_id_token' => false,
        'persist_access_token' => false,
        'persist_refresh_token' => false,
    ]);
    $userInfo = $auth0->getUser();
    $userData = getUserData($userInfo['name']);
} catch (Exception $e) {
    $auth0->login();
}  
?>