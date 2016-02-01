<?php
require '../../config.php';

$scanned_directory = array_diff(scandir($dbPath), array('..', '.'));

$db = new JsonDB($dbPath);

