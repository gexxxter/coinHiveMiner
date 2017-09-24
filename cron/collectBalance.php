<?php
include "../api/dbConnect.php";

$usernames = array();
$stmt = $con->prepare("SELECT username from user");
$stmt->execute();
$stmt->bind_result($username);

while ($stmt->fetch()) {
  $usernames[] = $username;
}
$stmt->close();

foreach ($usernames as $username) {
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coin-hive.com/user/balance?secret='.$coinHiveSecret.'&name='.$username
  ));
  $result = curl_exec($curl);
  $json = json_decode($result, true);
  
  $stmt = $con->prepare("UPDATE user SET balance = ? WHERE username=?");
  $stmt->bind_param("is", $json['balance'], $username);
  $stmt->execute();
  $stmt->close();

  //var_dump($result);
}

