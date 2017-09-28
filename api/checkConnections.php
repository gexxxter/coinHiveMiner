<?php
include "config.php";
//TODO This is dirty, do it properly

//check get site stats
$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_RETURNTRANSFER => 1,
  CURLOPT_URL => 'https://api.coinhive.com/stats/site?secret='.$coinHiveSecret
));

$result = curl_exec($curl);

if($result === false){
  echo "Error while requesting site statistics\n";
  echo "Error: ".curl_error($curl);
}else{
  echo "Got site statistics!\n";
}
curl_close($curl);

//Check top miners
$curl = curl_init();
curl_setopt_array($curl, array(
    CURLOPT_RETURNTRANSFER => 1,
    CURLOPT_URL => 'https://api.coi-hive.com/user/top?secret='.$coinHiveSecret.'&count=10'
));
$result = curl_exec($curl);
if($result === false){
  echo "Error while requesting top miners\n";
  echo "Error: ".curl_error($curl);
}else{
  echo "Got top miners!\n";
}
curl_close($curl);
