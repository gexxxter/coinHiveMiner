<?php
include "config.php";

  $curl = curl_init();
  curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coinhive.com/stats/site?secret='.$coinHiveSecret,
    CURLOPT_CONNECTTIMEOUT => 3,
    CURLOPT_TIMEOUT => 5
  ));
  $result = curl_exec($curl);
  echo $result;
  curl_close($curl);
