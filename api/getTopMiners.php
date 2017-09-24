<?php
include "dbConnect.php";
$stmt      = $con->prepare("SELECT username from user");
$stmt->execute();
$stmt->bind_result($username);
$response = array();
while ($stmt->fetch()) {
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coin-hive.com/user/balance?secret='.$coinHiveSecret.'&name='.$username
  ));
  $result = curl_exec($curl);
  $json = json_decode($result,true);
  if(isset($json['balance'])){
    $response[$username] = $json['balance'];
  }else{
    $response[$username] = 0;
  }
}
$stmt->close();
echo json_encode($response);
