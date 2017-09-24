
<?php
include "dbConnect.php";
$username  = $_GET['username'];
$timeStamp = time();
$stmt      = $con->prepare("SELECT id from user WHERE username=? LIMIT 1");
$stmt->bind_param("s", $username);
$response = array();
$stmt->execute();
$stmt->bind_result($userId);
$stmt->fetch();
$stmt->close();
if ($userId) {
    $stmt = $con->prepare("UPDATE user SET lastloggedin = $timeStamp WHERE username=?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $response['userId'] = $userId;
    $stmt->close();
} else {
    $stmt = $con->prepare("INSERT INTO user (username,lastloggedin) VALUES (?,?)");
    $stmt->bind_param("si", $username, $timeStamp);
    $userId = mysqli_stmt_insert_id ($stmt);
    $stmt->execute();
    $response['userId'] = $stmt->insert_id;
    $stmt->close();
}

echo json_encode($response);
