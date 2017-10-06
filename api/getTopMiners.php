<?php
include "config.php";
$response = array();
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coinhive.com/user/top?secret=Put ur Secret Key'
));
$result = curl_exec($curl);
$json = json_decode($result,true);
foreach($json['users'] as $i => $values){
  $username = htmlentities($values['name']);
  $response[$values['name']] = htmlentities($values['total']);
}
echo json_encode($response);
curl_close($curl);
