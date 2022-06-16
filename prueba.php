<?php
$jsons = scandir("./{$_GET['course']}");
$array = array();

foreach ($jsons as $json) {
    if (strpos($json, '.json') !== false) {
        $array[] = [
            'id' => substr($json, 0, -5),
        ];
    }
}
echo json_encode($array);
?>