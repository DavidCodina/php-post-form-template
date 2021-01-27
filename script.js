const form = document.getElementById('form');


/* =============================================================================
                                  Helpers
============================================================================= */


//https://levelup.gitconnected.com/different-ways-to-check-if-an-object-is-empty-in-javascript-e1252d1c0b34
function isEmpty(obj){
  for (var prop in obj){ if (obj.hasOwnProperty(prop)){ return false; } }
  return true;
}


function getKeys(obj){
  var keys = [];
  for (var key in obj){ keys.push(key); }
  return keys;
}


function renderServerError(key, errors){
  const error     = errors[key];
  const formField = document.querySelector('[name=' + key + ']');

  if (formField){
    const parent             = formField.parentElement;
    const invalidFeedbackDiv = parent.querySelector('.invalid-feedback');

    if (invalidFeedbackDiv){
      invalidFeedbackDiv.textContent = error;
      formField.setCustomValidity(error);
    }
  }
}


/* =============================================================================
                          validateFirstName()
============================================================================= */


function validateFirstName(input){
  const validityObject = input.validity;
  let invalidFeedbackMessage = '';

  if (input.value.trim().length === 0){
    invalidFeedbackMessage = "First name is required (Client)!";
    input.setCustomValidity(invalidFeedbackMessage);
  }
  else {
    input.setCustomValidity('');
    invalidFeedbackMessage = '';
  }

  input.parentElement.querySelector('.invalid-feedback').textContent = invalidFeedbackMessage;
  return validityObject.valid;
}


/* =============================================================================
                          validateLastName()
============================================================================= */


function validateLastName(input){
  const validityObject = input.validity;
  let invalidFeedbackMessage = '';

  if (input.value.trim().length === 0){
    invalidFeedbackMessage = "Last name is required (Client)!";
    input.setCustomValidity(invalidFeedbackMessage);
  }
  else {
    input.setCustomValidity('');
    invalidFeedbackMessage = '';
  }

  input.parentElement.querySelector('.invalid-feedback').textContent = invalidFeedbackMessage;
  return validityObject.valid;
}


/* =============================================================================
                           Event Listeners
============================================================================= */


form.addEventListener('submit', function(e){
  e.preventDefault();
  e.stopPropagation(); //???
  e.target.classList.add('was-validated');


  const firstNameValue = e.target['first-name-input'].value;
  const lastNameValue  = e.target['last-name-input'].value;


  validateFirstName(e.target['first-name-input']);
  validateLastName(e.target['last-name-input']);


  const formIsValid = this.checkValidity();


  if (!formIsValid){
    return console.error("Not all form fields are valid. Form submission has been halted.");
  }


  /* ===========================
        Prepare data
  =========================== */


  //Note: axios will serialize the object literal or array.
  const json = { first_name: firstNameValue, last_name: lastNameValue };
  //const json = [ { first_name: firstNameValue, last_name: lastNameValue }]; //Server response with result === "fail"

  const formData = new FormData();
  formData.append('first_name', firstNameValue);
  formData.append('last_name', lastNameValue);

  const stringData = `first_name=${firstNameValue}&last_name=${lastNameValue}`;


  /* ===========================
           Send Request
  =========================== */


  postData('process.php', stringData)
  .then(res => {
    if (res.data.hasOwnProperty('errors') && !isEmpty(res.data.errors)){
      const errors = res.data.errors;
      const keys   = getKeys(errors);
      keys.forEach(key => renderServerError(key, errors));
      return;
    }

    //Otherwise...
    e.target.reset();
    e.target.classList.remove('was-validated');

    if (res.data.result === 'success'){
      alert("The server has received and processed the data.");
      console.log(res.data);
    }

    else if (res.data.result === 'fail'){
      console.error(res.data.message);
    }
  })

  .catch(err => {
    e.target.reset();
    e.target.classList.remove('was-validated');
    console.log(err);
  });
});


form['first-name-input'].addEventListener('input', function(){ validateFirstName(this); });
form['last-name-input'].addEventListener('input', function(){ validateLastName(this); });
