<?php
$course = $_GET['course'];
$jsons = scandir("./{$course}");
$array = array();

foreach ($jsons as $json) {
    if (strpos($json, '.json') !== false) {
        $array[] = [
            'id' => substr($json, 0, -5),
        ];
    }
}
$json = json_encode($array, JSON_PRETTY_PRINT);

file_put_contents("assets/sources/{$course}.json", $json);

header('Content-Type: application/json');
echo $json;
?>