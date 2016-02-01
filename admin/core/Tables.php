<?php
require "Core.php";

$tables = array();


foreach ($scanned_directory as $table) {
    $tables[] = substr($table, 0, -5);
}

echo json_encode($tables);
