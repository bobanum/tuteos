<?php
session_start();
if (isset($_SESSION['github_token'])) {
    echo "ok";
    exit;
}
$client_id = '62a90ec591b4dc316cb3';
$client_secret = 'f2ff134a030563c524d0c60bc87dca1b464be5ef';
$redirect_uri = 'http://localhost:8000/login.php';
if (!isset($_GET['code'])) {
    header("location:https://github.com/login/oauth/authorize?client_id={$client_id}");
    die;
} else {
    if ($_GET['code'] === "") {
        echo "Vas chier";
        die;
    }
    $code = $_GET['code'];

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://github.com/login/oauth/access_token");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept:application/json']);

    curl_setopt($ch, CURLOPT_POSTFIELDS, array(
        'code' => $code,
        'client_id' => $client_id,
        'client_secret' => $client_secret,
        'redirect_uri' => $redirect_uri,
        'grant_type' => 'authorization_code'
    ));

    $data = curl_exec($ch);
    $data = json_decode($data);
    $token = $data->access_token;

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.github.com/user");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization:token $token",
        "user-agent: Some cool app",
    ));


    $data = curl_exec($ch);
    var_dump($data);
    $data = json_decode($data);
    var_dump($data);
}
