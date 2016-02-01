<?php
require "Core.php";

$tableName = $_POST['tableName'];

if ($db->createTable($tableName)) {
	echo json_encode(array("success" => TRUE));
}
