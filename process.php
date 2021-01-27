<?php
/* =============================================================================

============================================================================= */


function get_content_type(){
  $content_type = $_SERVER["CONTENT_TYPE"] ?? '';
  if ($content_type){ $content_type = explode(';', $content_type)[0]; }
  return $content_type;
}

$content_type = get_content_type();


/* =============================================================================

============================================================================= */


function populate_POST_array($arr){
  foreach ($arr as $key => $value){
    $_POST[$key] = $value;
  }
}


/* =============================================================================
                             validate_data()
============================================================================= */
//Customize as needed...


function validate_data(){
  $errors     = [];
  $first_name = $_POST['first_name'] ?? '';
  $last_name  = $_POST['last_name']  ?? '';


  if (strlen($first_name) === 0){
    $errors['first_name'] = "First name is required!";
  }

  else if ($first_name === 'David' || $first_name === 'Holly'){
    $errors['first_name'] = "That's a dumb name. Try again!";
  }

  else if ($first_name === 'Muffy' || $first_name === 'Gingerbread' || $first_name === 'Punkin'){
    $errors['first_name'] = "No cats allowed!";
  }


  if (strlen($last_name) === 0){
    $errors['last_name'] = "Last name is required!";
  }

  return $errors;
}


/* =============================================================================
                               process_data()
============================================================================= */


function process_data(){
  //Interact with database, then send response back...

  http_response_code(201);

  $response = array(
    'result'  => 'success',
    'message' => 'The form data is valid, and the database has been updated accordingly.',
    'data'    => $_POST, // demo only
    'errors'  => []      // or just don't send anything.
  );

  $response = json_encode($response);
  echo $response;
}


/* =============================================================================
                                   POST
============================================================================= */


if ($_SERVER['REQUEST_METHOD'] === 'POST'){


  /* ==========================
  If JSON object, then add to $_POST
  ========================== */
  // As an alternative to handling a JSON object literal in an entirely distinct
  // manner, we can simply convert it to an associative array, and add each
  // key/value pair to $_POST.


  if ($content_type === "application/json"){
    $json          = json_decode(file_get_contents("php://input"));
    $json_is_array = is_array($json);

    if (!$json_is_array){
      // If the JSON is not already an array, then convert it to an associative
      // array with: true. Moving forward, this allows us to access the data,
      // as we normally would from $_POST.
      $json = json_decode(file_get_contents("php://input"), true);
      populate_POST_array($json);
    }

    // If JSON is an array, then send back a message indicating that
    // only JSON as an object is accepted.
    else {
      $response = array(
        'result'  => 'fail',
        'message' => 'JSON data must be sent as an object literal -not an array.'
      );
      $response = json_encode($response);
      echo $response;
    }
  }


  /* ==========================

  ========================== */


  $errors = validate_data();


  if ($errors){
    $response = array(
      'result'  => 'fail',
      'message' => 'The data sent is invalid.',
      'errors'  => $errors
    );

    $response = json_encode($response);
    echo $response;

  } else {
    process_data();
  }

} //if ($_SERVER['REQUEST_METHOD'] === 'POST'){ ... }
?>
