/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var asset = require("./asset.js");
var mappings = require("./mappings.js");

/**
 * Class that represents pedestrian assets entities.
 * @class PedestrianAsset
 * @constructor PedestrianAsset
 * @param {Object} dto The asset entity returned from predix within a json object.
 */
function PedestrianAsset(dto,client){
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
      console.log("device-id - "  + this["device-id"]);
   }
   this.client =client;
}
PedestrianAsset.prototype = new asset();

/**
*@Method listPedestrianIn
* Retrieves all the pedestrian that came into the area of the asset between start_ts and end_ts. 
* @param {Integer}[startTime] limits the results to all the events that took place after this time in epoch.
* @param {Integer}[endTime] limits the results to all the events that took place before this time in epoch.
* @param {Object} options
* @param {Integer}[options.lane] (optional) filter by lane number ( Lane1, Lane2 ,... ) . Starts with Lane1 being the closest lane to the asset. 
* @param {String} [options.size] (optional) determins how many events to retrieve per page.
* @param {String} [options.page] (optional) determins what page to retrieve. Defaults to 0.
* @returns {Object} returns an object containing all the traffic events that got picked up by this asset, along with the 
* pagination metadata.
*
**/
PedestrianAsset.prototype.listPedestrianIn = function(startTime,endTime,options){
  if(options == null){
  	 options = {};
  }
  var page = options.page;
  var size = options.size;
  
  var params = {
    "serviceType":"pedestrian",
    "eventType":mappings.eventTypes.SFIN,
    "startTime" :startTime,
    "endTime":endTime
  };
  
  if(size != null){
    params["size"] = size;
  }
  if(page != null){
    params["page"] = page;
  }
  return this.getEvents(params);
};


/**
*@Method listPedestrianOut
* Retrieves all the pedestrian that came into the area of the asset between start_ts and end_ts. 
* @param {Integer}[startTime] limits the results to all the events that took place after this time in epoch.
* @param {Integer}[endTime] limits the results to all the events that took place before this time in epoch.
* @param {Object} options
* @param {Integer}[options.lane] (optional) filter by lane number ( Lane1, Lane2 ,... ) . Starts with Lane1 being the closest 
* lane to the asset. 
* @param {String} [options.size] (optional) determins how many events to retrieve per page.
* @param {String} [options.page] (optional) determins what page to retrieve. Defaults to 0.
* @returns {Object} returns an object containing all the pedestrian events that got picked up by this asset, along with the 
* pagination metadata.
*
**/

PedestrianAsset.prototype.listPedestrianOut = function(startTime,endTime,options){
 if(options == null){
  	 options = {};
  }
  
  var page = options.page;
  var size = options.size;
  
  var params = {
    "serviceType":"pedestrian",
    "eventType":mappings.eventTypes.SFOUT,
    "startTime" :startTime,
    "endTime":endTime
  };
  
  if(size != null){
    params["size"] = size;
  }
  if(page != null){
    params["page"] = page;
  }
  return this.getEvents(params);
};			