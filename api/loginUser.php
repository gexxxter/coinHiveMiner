<?php
include "dbConnect.php";
$username  = $_GET['username'];
$timeStamp = time();
$stmt      = $con->prepare("SELECT * from user WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$stmt->store_result();
$count = $stmt->num_rows();
$stmt->close();
if ($count == 1) {
    $stmt = $con->prepare("UPDATE user SET lastloggedin = $timeStamp WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
} else {
    $stmt = $con->prepare("INSERT INTO user (username,lastloggedin) VALUES (?,?)");
    $stmt->bind_param("si", $username, $timeStamp);
    $stmt->execute();
}

$stmt->close();
