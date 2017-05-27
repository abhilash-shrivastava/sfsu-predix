/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var asset = require("./location.js");
var mappings = require("../mappings.js");
var parkingasset = require("../parkingasset.js");
var predixconfig = require("./../config.js");
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
ParkingSpot.prototype = new asset();

/**
* @method listParkingAssets
* @return returns all the parking assets that are monitoring this parking spot.
*/

ParkingSpot.prototype.listParkingAssets = function(boundary1, boundary2, options){
  return new Promise((resolve, reject) => {
    var boundary = boundary1 + "," + boundary2;
    options['queryType'] = 'eventType';
    options['serviceType'] = "parking";
    options['bbox'] = boundary;
    options['zoneId'] = predixconfig.services["parking"].zoneId;

    if(!options['queryValue']  || options['queryValue'] == ""){
      options['queryValue'] = mappings.eventTypes.PKIN;
      //+ "," + mappings.eventTypes.PKIN;
    }
    this.listAssets(options).then((assets) => {
      var parsedAssets = [];
      for(var i=0;i < assets.length ;i++){
        parsedAssets.push(new parkingasset(assets[i],this.client));
      }
      resolve(parsedAssets);
    })
  });
};
module.exports =  ParkingSpot;