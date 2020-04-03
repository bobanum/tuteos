<?php
session_start();
if (isset($_SESSION['github_token'])) {
    echo "'{$_SESSION['github_token']}'";
    exit;
}
$redirect_uri = 'http://localhost:8000/api/login.php';
$client_id = '62a90ec591b4dc316cb3';    //8000
$client_secret = 'f2ff134a030563c524d0c60bc87dca1b464be5ef'; //8000
$redirect_uri = 'http://localhost:8080/login';
$client_id = 'a49b4169cd6217289afb';    //8080
$client_secret = 'd43ac3fdb71ab1b1d79b830add03e54faa97194e'; //8080
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
    if (isset($data->error)) {
        header("content-type: application/json");
        echo "'{$data->error}'";
        die;
    }
    $token = $data->access_token;
    $_SESSION['github_token'] = strtolower(md5($code.$token));

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, "https://api.github.com/user");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Authorization:token $token",
        "user-agent: Some cool app",
    ));

    $data = curl_exec($ch);
    // var_dump($data);
    $data = json_decode($data);
    $output['token'] = $_SESSION['github_token'];
    $output['avatar_url'] = $data->avatar_url;
    $output['html_url'] = $data->html_url;
    $output['url'] = $data->url;
    $output['login'] = $data->login;
    $output['name'] = $data->name;
    header("Access-Control-Allow-Origin: *");
    header("content-type: application/json");
    echo json_encode($output);
}
