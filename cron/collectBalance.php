<?php
include "../api/dbConnect.php";

$stmt = $con->prepare("SELECT username from user");

if (!$stmt) die();

$stmt->execute();
$result = $stmt->get_result();
$usernames = $result->fetch_assoc();
$stmt->close();

foreach ($usernames as $username) {
  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coin-hive.com/user/balance?secret='.$coinHiveSecret.'&name='.$username
  ));
  $result = curl_exec($curl);
  $json = json_decode($result);
  $stmt2 = $con->prepare("UPDATE user SET balance = ? WHERE username=?");
  
  if ($stmt2) {
    $stmt2->bind_param("is", intval($json['balance']), $username);
    $stmt2->execute();
    $stmt2->close();
  }

  //var_dump($result);
}

