/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var http = require("http");
var util = require("./util");
var oauthconfig = require("./config");

/**
  * Obtains authentication tokens according to a given client id and password , and optionally according to given a username and      password of an app.
 * against a given UAA service
 * @class TokenManager
 * @constructor
 * @param {Object} [dto]
 * @param {String} [dto.uaa] : the URL of the UAA service to use for authentication
 * optional, if not provided, defaults to oauthconfig.uaa
 * @param {String} [dto.clientId] : the clientId of the predix app (obtained using the Starter Kit for example)
 * optional, if not provided, defaults to oauthconfig.clientId
 * @param {String} [dto.clientPassword] : the password of the predix app (defined using the Starter Kit for example)
 * optional, if not provided, defaults to oauthconfig.clientPassword
 * @param {String} [dto.username] : the username of the predix app user (defined using the StarterKit for example)
 * optional
 * @param {String} [dto.userPassword] : the password of the predix app password (defined using the StarterKit for example)
 * optional
 */

function TokenManager(dto) {
 
  if (!storage.global.predix){
    storage.global.predix = {};
  }
  
  this.uaa = dto && dto.uaa ? dto.uaa : oauthconfig.uaa;
  this.clientPassword = dto && dto.clientPassword ? dto.clientPassword : oauthconfig.clientPassword;
  this.clientId = dto && dto.clientId ? dto.clientId : oauthconfig.clientId;
 
  if(dto && dto.username && dto.userPassword){
    this.user = {"username" : dto.username, "password" :dto.userPassword};
  }
  
}

/**
 * Obtain an oauth token for the current client Id and password at the specified uaa service
 * or for the given user if provided as a parameter or if provided when intanciating the TokenManager class
 * token is saved into the global storage (storage.global.predix[username] or storage.global.predix[clientId]  )
 * @method obtainToken
 * @return {String) returns the accessToken
 * @throws Exception
 */
TokenManager.prototype.getToken = function() {
  
  if(this.user){
    if(storage.global.predix[this.user.username]){
      console.log(JSON.stringify(storage.global.predix[this.user.username]));
      return storage.global.predix[this.user.username];
    }
  }else{
    if(storage.global.predix[this.clientId]){
     	return storage.global.predix[this.clientId];
    }
  }
  
  var requestParams = {
    url: this.uaa,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " +  util.Base64.encode(this.clientId + ":" +  this.clientPassword) 
    },
    params: this.user ? this._getUserParams(this.user) : this._getClientParams()
  };
  
  var response = http.request(requestParams); //return response;
  console.log(response.body);

  if (Number(response.status) < 200 || Number(response.status) >= 400) {
    throw {
      errorCode: "Authentication_Failure",
      errorDetail: "TokenManager.otbainToken - Authentication failed with the following message " +  response.body
    };
  }
  var bodyMsg = JSON.parse(response.body);
  if(!storage.global.predix){
    storage.global.predix;
  }
  if (this.user) {    
    storage.global.predix[this.user.username] = bodyMsg['access_token'];
  }else {
    storage.global.predix[this.clientId] = bodyMsg['access_token'];
  }
  console.log("storage global " + JSON.stringify(storage.global));
  return bodyMsg['access_token'];
};

/**
 * @method refreshToken
 */
TokenManager.prototype.refreshToken = function() {
  	//uaa not returning a refresh token ?. so just go get a new access token with client_credentials since the current one expired
   if(this.user){
    if(storage.global.predix[this.user.username]){
  
     	storage.global.predix[this.user.username] =null;
    }
  }else{
    if(storage.global.predix[this.clientId]){
     	storage.global.predix[this.clientId] = null;
    }
  }
  	console.log("refreshing token ");
  	this.getToken();
  
};

/**
 * Return presisted OAuth tokens for the given id
 * @method getPersistedTokens
 * @param {String} id: userame or clientId
 * @return {Object} {accessToken, refreshToken}
 * @throws Exception
 */
TokenManager.prototype.getPersistedTokens = function(id) {
  
  var accessToken = storage.global.predix[id].access_token
  var refreshToken = storage.global.predix[id].refresh_token;
  if (!accessToken) {
    
    throw {
      "errorCode": "Missing_Access_Token",
      "errorDetail": "TokenManager.getPersistedTokens - Could not find an access token or a refresh token for id: " + id
    };
  }
  
  return {
    "accessToken": accessToken,
    "refreshToken": refreshToken
  };
};

TokenManager.prototype._getUserParams = function(user) {

   return {
    
    username: user.username,
    password: user.password,
    grant_type: "password"
  }; 
};

TokenManager.prototype._getClientParams = function() {
return {
    client_id: this.clientId,
    grant_type: "client_credentials"
  };
};			