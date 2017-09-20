<?php
include "dbConnect.php";

  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coin-hive.com/stats/site?secret='.$coinHiveSecret
  ));
  $result = curl_exec($curl);
  echo $result;
