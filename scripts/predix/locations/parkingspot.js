/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var asset = require("./location");
var mappings = require("../mappings");
var parkingasset = require("../parkingasset");

/**
 * Class that represents parking spots
 * @class ParkingSpot
 * @constructor ParkingSpot
 * @param {Object} dto the parking spot location entity returned from predix within a json object.
 * @param {Object} client the http client used to make authenticated http calls.
 */

function ParkingSpot(dto,client){
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
ParkingSpot.prototype = new asset.Location();

/**
* @method listParkingAssets
* @return returns all the parking assets that are monitoring this parking spot.
*/

ParkingSpot.prototype.listParkingAssets = function(){
  var assets = this.listAssets();
  var parsedAssets = [];
  for(var i=0;i < assets.length ;i++){
    parsedAssets.push(new parkingasset.ParkingAsset(assets[i],this.client));
  }
  return parsedAssets;
}			