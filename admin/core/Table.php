<?php
require "Core.php";

$table = $db->selectAll($_POST['tableName']);

if(sizeof($table)) {
	echo json_encode(array(
		"success" => TRUE,
		"data" => $table,
	));
} else {
	echo json_encode(array(
		"success" => FALSE,
		"message" => "Таблица пустая",
	));
}
