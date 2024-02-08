<?php
  require __DIR__ . '/vendor/autoload.php';
  include_once 'bat/authConection.php';

use Auth0\SDK\Auth0;

$auth0 = new Auth0([
  'domain' => $domain,
  'client_id' => $client_id ,
  'client_secret' => $client_secret,
  'redirect_uri' => $redirect_uri,
  'audience' => $audience,
  'scope' => 'openid profile',
  'persist_id_token' => true,
  'persist_access_token' => true,
  'persist_refresh_token' => true,
]);

if($audience == ''){
    $audience = 'https://' . $domain . '/userinfo';
}

$auth0->logout();
$return_to = 'https://localhost/smarto/tratodirecto/dev/hogaresunion/logout.html';
$logout_url = sprintf('http://%s/v2/logout?client_id=%s&returnTo=%s', $domain, $client_id, $return_to);
header('Location: ' . $logout_url);
die();