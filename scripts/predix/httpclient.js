/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var http = require("http");
var config = require("./oauth2/config");
var tokenMgr = require("./oauth2/tokenmanager");

/**
 * A generic http client that handles the communication with remote APIs
 * All subsequent operations made using the current instance are done on behalf of the user
 * @class Client
 * @constructor
 * @param {Object} [dto] : needed parameters
 * @param {String} [dto.tokenMgr]: An instance of predix/oauth2/tokenmanager. This is used to retrieve the access token.
 */
function HttpClient(dto) {
  
  if (!dto || !dto.tokenMgr ) {
    
    throw {
      erroCode: "Invalid_Parameter",
      errorDetail: " dto.tokenMgr is required."
    };
  }
 
  this.tokenMgr = dto.tokenMgr;
  this.accessToken = this.tokenMgr.getToken();;
}

/**
 * Invoke a given API. If response status is 401, the method will try to obtain a new access token using the 
 * current user's refresh token and retry the invocation of the target API.
 * This method can throw exceptions
 * @method callApi
 * @param {Object} params : the parameters of the http call to issue
 * 	{String} params.endpoint : the url of the targeted API
 *	{String} params.method : (optional) the http method to use when invoking the API
 *	{Object} params.headers: (optional) the http headers to send to the API
 *	{Object} params.params: (optional) the parameters that are expected by the API
 */
HttpClient.prototype.callApi = function(params) {
  
  var paramsClone = JSON.parse(JSON.stringify(params));

   var response = this._callApi(paramsClone);
  	console.log("response is " + JSON.stringify(response));
     if (parseInt(response.status) >= 200 && parseInt(response.status) < 300) {
		return JSON.parse(response.body);
     }else{
       console.log("response status was " + response.status + " : " + (response.status == "401"))
      if (response.status == "401") {
		  this._refreshToken();      
          response = this._callApi(params);
          if (parseInt(response.status) >= 200 && parseInt(response.status) < 300) {
            return JSON.parse(response.body);	
          }else{
             this._handleError(response);  
          }
      }else {
        this._handleError(response);
      }   
    }
};

HttpClient.prototype._callApi = function(params) {
  
  if (params.params && (!params.method || params.method == "GET")) {
    params.params = this._paramsToString(params.params);
  }
  
  if (params.params && params.method == "POST") {
    
    params.bodyString = JSON.stringify(params.params);
    delete params.params;
  }
  
  params["headers"] = params["headers"]  ? params["headers"] :{};
  params["headers"]["Authorization"] = "Bearer " + this.accessToken;
  //console.log("calling : " + params.url);
  //console.log("request: " + JSON.stringify(params));
  var response = http.request(params);
  console.log("response was " + JSON.stringify(response));
  return response;
};
  
HttpClient.prototype._handleError = function(response) {
   
  var errorObj = "";
  try {
    
    errorObj = JSON.parse(response.body);
  }catch(e) {
    
    try {
      errorObj = JSON.parse(response);
    }catch(e) {
      errorObj = response;
    }
  };

  throw {
    "errorCode": "Invocation_Error",
    "errorDetail": JSON.stringify(errorObj)
  };
};

HttpClient.prototype._refreshToken = function() {
 
  console.log("Refreshing token for " +  this.id);
  this.tokenMgr.refreshToken();
  this.accessToken = this.tokenMgr.getToken();
};

/*
 * Transform all Numeric and boolean parameters to string so they can be passed to http.callApi
 * (shallow only)
 */
HttpClient.prototype._paramsToString = function(params) {
  
  var newParams = {};
  for (var p in params) {
    
    if (typeof(params[p]) != "object") {
    	newParams[p] = "" +  params[p];
    }else {
      newParams[p] = JSON.stringify(params[p]);
    }
  }
  
  return newParams;
};			