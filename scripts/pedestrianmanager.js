/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var predixconfig = require("./config.js");
var mappings = require("./mappings.js");
var servicemanager = require("./servicemanager.js");
var pedestrianasset = require("./pedestrianasset.js");
var crosswalk = require("./locations/crosswalk.js");

/**
 * @class PedestrianManager
 * Extends the ServiceManager and allows you to list pedestrian assets using the predix pedestrian API.
 * @constructor
 * @param {Object} [dto]
 * @param {Object} [dto.client] An instance of predix/httpclient
 */
function PedestrianManager(dto) {
  if(dto){
    if (!dto.client) {

      throw {
        errorCode: "Invalid_Parameter",
        errorDetail: "AssetManager: dto, and dto.client cannot be null or empty"
      };
    }
  
  	this.client = dto.client;
  }
};

PedestrianManager.prototype = new servicemanager.ServiceManager();
PedestrianManager.prototype.constructor = PedestrianManager;

/**
* @method listPedestrianAssetsWithin
* Gets all the assets that provide pedestrians events within a GPS boundary.
* on a Map boundary 1 and boundary 2 would be as follow  
* boundary1 --------------
* |                       |
* |	    			 	  |	  	
* |						  |
*  -------------------boundary2
*
* @param {String} boundary1 the boundary box first geospatial point boundary x:y ex 32.711637:-117.157330
* @param {String} boundary2 the boundary box GPS second geospatial boundary x:y ex 32.709443:-117.153821
* @param {Object} options
* @param {String} options.size  the amount of records returned by page
* @param {String} options.page the page to return.
* @return {Object} returns an object that contains an array of  PedestrianAsset objects and pagination metadata.
*
**/
PedestrianManager.prototype.listPedestrianAssetsWithin = function(boundary1,boundary2,options){
  
  if(!boundary1){
  	throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary1 is required"};  
  }
  
  if(!boundary2){
    throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary2 is required"};  
  }
  if(options == null){
    options = {};
  }
  var page = options.page;
  var size = options.size;
  
  var boundary = boundary1 + "," + boundary2;
  
  var params = {
    'queryType':'event-type',
    'serviceType':"pedestrian",
    'queryValue':mappings.eventTypes.SFIN,
    'bbox':boundary,
    'zoneId':predixconfig.services["pedestrian"].zoneId
  };
  if(size != null && size != undefined){
    if(isNaN(size)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"size must be a numeric value"};
    }
    params["size"] = size;
  }
  
  if(page != null && page != undefined){
    if(isNaN(page)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"page must be a numeric value"};
    }
    params["index"] = page;
  }
  
  
  var response = this.listAssets(params);
  var page;
  var assets;
  if(response["_embedded"]){
  	 page = response["_embedded"]["page"];
     assets = response["_embedded"]["assets"];
  }else{
    page = response["page"];
    assets = [];
  }
  
  var parsedAssets = [];
  console.log("assets " + JSON.stringify(assets));
  for(var i=0; i < assets.length;i++){
    var asset = new pedestrianasset.PedestrianAsset(assets[i], this.client);
    parsedAssets.push(asset);
  }
   
  return {
    "assets":parsedAssets,
     "page":page
  }
}


/**
* @method listCrosswalks
* Gets all the crosswalks events within a GPS boundary.
* on a Map boundary 1 and boundary 2 would be as follow  
* boundary1 --------------
* |                       |
* |	    			 	  |	  	
* |						  |
*  -------------------boundary2
*
* @param {String} boundary1 the boundary box first geospatial point boundary x:y ex 32.711637:-117.157330
* @param {String} boundary2 the boundary box GPS second geospatial boundary x:y ex 32.709443:-117.153821
* @param {Object} options
* @param {String} options.size , the amount of records returned by page
* @param {String} options.page, the page to return.
* @return {Object} returns an object that contains an array of Crosswalk objects and pagination metadata.
*
**/

PedestrianManager.prototype.listCrosswalks = function(boundary1,boundary2,options){
  
  if(!boundary1){
  	throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary1 is required"};  
  }
  
  if(!boundary2){
    throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary2 is required"};  
  }
  
  if(options == null){
    options = {};
  }
  var page = options.page;
  var size = options.size;
  
  var boundary = boundary1 + "," + boundary2;
  
  var params = {
    
    'serviceType':"pedestrian",
    'locationType':mappings.locationTypes.CROSSWALK,
    'bbox':boundary,
    'zoneId':predixconfig.services["pedestrian"].zoneId
  };
  if(size != null && size != undefined){
    if(isNaN(size)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"size must be a numeric value"};
    }
    params["size"] = size;
  }
  
  if(page != null && page != undefined){
    if(isNaN(page)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"page must be a numeric value"};
    }
    params["index"] = page;
  }
  
  
  var response = this.listLocations(params);
  var page;
  var locations;
  if(response["_embedded"]){
  	 page = response["_embedded"]["page"];
     locations = response["_embedded"]["locations"];
  }else{
    page = response["page"];
    locations = [];
  }
  
  var parsedLocations = [];
  console.log("locations " + JSON.stringify(locations));
  for(var i=0; i < locations.length;i++){
    var location = new crosswalk.Crosswalk(locations[i], this.client);
    parsedLocations.push(location);
  }
   
  return {
    "locations":parsedLocations,
     "page":page
  }
  
}			