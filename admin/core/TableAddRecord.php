<?php
require "Core.php";

$tableName = $_POST['tableName'];
$data = json_decode($_POST['data']);

$db->insert("table", $data, $create = FALSE);

$db->updateAll($tableName, $data);
