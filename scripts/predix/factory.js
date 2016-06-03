/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var httpclient = require("./httpclient");
var tokenmanager = require("./oauth2/tokenmanager");
var trafficmanager = require("./trafficmanager");
var parkingmanager = require("./parkingmanager");
var pedestrianmanager = require("./pedestrianmanager");


/**
 * Single entry point to predix APIs
 * @class Predix
 * @contructor
 * @param {Object} [dto]
 * @param {Object} [dto.credentials] credentials to use (clientId, password, accountId)
 */
function Predix(dto) {
  var params = null;
  
  if (dto && dto.credentials) {
    params  = dto.credentials;
  }
 
  this.tokenManager = new tokenmanager.TokenManager(params);
  this.client = new httpclient.HttpClient({tokenMgr:this.tokenManager});
}


/**
 * @method getTrafficManager
 * @return {Object} instance of TrafficManager
 */
Predix.prototype.getTrafficManager = function(){
  return new trafficmanager.TrafficManager({client:this.client});
}


/**
 * @method getParkingManager
 * @return {Object} instance of Parkingmanager
 */
Predix.prototype.getParkingManager = function(){
  return new parkingmanager.ParkingManager({client:this.client});
}

/**
 * @method getParkingManager
 * @return {Object} instance of PedestrianManager
 */
Predix.prototype.getPedestrianManager = function(){
  return new pedestrianmanager.PedestrianManager({client:this.client});
}			