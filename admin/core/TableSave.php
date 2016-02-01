<?php
require "Core.php";

$tableName = $_POST['tableName'];
$data = json_decode($_POST['data']);

if ($db->updateAll($tableName, $data)) {
	echo json_encode(array("success" => TRUE));
}
