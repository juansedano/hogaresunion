<?php
require __DIR__ . '/vendor/autoload.php';
include_once 'bat/authConection.php';

use Auth0\SDK\Auth0;

try {
    $auth0 = new Auth0([
      'domain' => $domain,
      'client_id' => $client_id ,
      'client_secret' => $client_secret,
      'redirect_uri' => $redirect_uri,
      'audience' => $audience,
      'scope' => 'openid profile',
      'persist_id_token' => true,
      'persist_access_token' => true
    ]);

    $auth0->login();
} catch (Exception $e) {
    $auth0->login();
}      
?>