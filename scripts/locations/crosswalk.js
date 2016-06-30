/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var location = require("./location.js");
var mappings = require("../mappings.js");
var pedestrianasset = require("../pedestrianasset.js");

/**
 * Class that represents parking Crosswalk entities.
 * @class Crosswalk
 * @constructor Crosswalk
 * @param {Object} dto The  crosswalk location entity returned from predix within a json object.
 * @param {Object} client  the http client used to make authenticated http calls.
 */

function Crosswalk(dto,client){
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
   }
   this.client = client;
   this.serviceType = "pedestrian";
}
Crosswalk.prototype = new location.Location();


/**
* @method listCrosswalkAssets
* @return {Array} an array of PedestrianAssets that are monitoring that crosswalk.
*/
Crosswalk.prototype.listCrosswalkAssets = function(){
  var assets = this.listAssets();
  
  console.log("List crosswalk assets " + JSON.stringify(assets));
  var parsedAssets = [];;
  for(var i=0;i < assets.length ;i++){
    parsedAssets.push(new pedestrianasset.PedestrianAsset(assets[i],this.client));
  }
  return parsedAssets;
}			