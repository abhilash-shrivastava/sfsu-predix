/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var asset = require("./location.js");
var mappings = require("../mappings.js");
var parkingasset = require("../parkingasset.js");

/**
 * Class that represents parking assets entities.
 * @class ParkingZone
 * @constructor ParkingZone
 * @param {Object} dto the parking zone location entity returned from predix within a json object.
 * @param {Object} client the http client used to make authenticated http calls.
 */

function ParkingZone(dto,client){
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
      console.log("device-id - "  + this["device-id"]);
   }
   this.client = client;
   this.serviceType = "parking";
}
ParkingZone.prototype = new asset();


ParkingZone.prototype.listParkingAssets = function(){
  var assets = this.listAssets();
  var parsedAssets = [];
  for(var i=0;i < assets.length ;i++){
    parsedAssets.push(new parkingasset.ParkingAsset(assets[i],this.client));
  }
  return parsedAssets;
}			