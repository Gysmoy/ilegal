<?php

/*
if ($_POST['status'] == "200") {
    $res = [];
    $res['status'] = '200';
    $res['message'] = 'NTS';
    // $res['data'] = [];
    $courses = $_POST['courses'];

    $res['data'] = new ArrayObject();
   
    foreach ($courses as $course) {

        if ($course['tests'] != '') {
            foreach ($course['tests'] as $test) {
                if($test['attemps'] != ''){
                    foreach($test['attemps'] as $attemp){
                        if($attemp['questions'] != ''){
                            foreach($attemp['questions'] as $questions){
                                foreach($questions as $question){
                                    $res['data']->append($question);
                                }
                            }
                        }

                    }
                }
                
            }
        } else {
            continue;
        }
    }
    require_once 'database.php';

    $db = new Database();

}else{
    $res['status'] = $_POST['status'];
    $res['message'] = 'Falla al guardar datos';
    
}
*/
$res = [];
$res['status'] = $_POST['status'];
$res['message'] = $_POST['courses'];

header('Content-Type: json ]');
echo json_encode($res);
