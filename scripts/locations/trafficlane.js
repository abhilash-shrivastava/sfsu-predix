/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var location = require("./location.js");
var mappings = require("../mappings.js");
var trafficasset = require("../trafficasset.js");

/**
 * Class that represents parking assets entities.
 * @class TrafficLane
 * @constructor TrafficLane
 * @param {Object} dto The  traffic lane location entity returned from predix within a json object.
 * @param {Object} client  the http client used to make authenticated http calls.
 */

function TrafficLane(dto,client){
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
      console.log("device-id - "  + this["device-id"]);
   }
   this.client = client;
   this.serviceType = "traffic";
}
TrafficLane.prototype = new location();

/**
* @method listTrafficAssets 
* @return {Object} an array of TrafficAsset objects that monitor the current lane.
**/
TrafficLane.prototype.listTrafficAssets = function(){
  var assets = this.listAssets();
  var parsedAssets = [];
  for(var i=0;i < assets.length ;i++){
    parsedAssets.push(new trafficasset.TrafficAsset(assets[i],this.client));
  }
  return parsedAssets;
}			