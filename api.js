/* =============================================================================
                                GET Request
============================================================================= */


function getData(url, config){
  config = config || { timeout: 1000 * 25 };
  return axios.get(url, config);
}


/* =============================================================================
                              POST Request
============================================================================= */


function postData(url, data, config){
  config = config || { timeout: 1000 * 25 };
  return axios.post(url, data, config);
}


/* =============================================================================
                            PUT Request
============================================================================= */


function putData(url, data, config){
  config = config || { timeout: 1000 * 25 };
  return axios.put(url, data, config);
}


/* =============================================================================
                            PATCH Request
============================================================================= */


function patchData(url, data, config){
  config = config || { timeout: 1000 * 25 };
  return axios.patch(url, data, config);
}


/* =============================================================================
                              DELETE Request
============================================================================= */


function deleteData(url, config){
  config = config || { timeout: 1000 * 25 };
  return axios.delete(url, config);
}
