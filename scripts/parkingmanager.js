/** Script ACLs do not delete
 read=nobody
write=nobody
execute=authenticated
  **/

 var predixconfig = require("./config.js");
var mappings = require("./mappings.js");
var servicemanager = require("./servicemanager.js");
var parkingasset = require("./parkingasset.js");
var parkingzone = require("./locations/parkingzone.js");
var parkingspot = require("./locations/parkingspot.js");


/**
 * Extends the ServiceManager and allows you to get Parking assets using the predix traffic API.
 * @class ParkingManager
 * @constructor
 * @param {Object} [dto]
 * @param {Object} [dto.client] An instance of predix/httpclient
 */
function ParkingManager(dto) {
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

ParkingManager.prototype = new servicemanager();
ParkingManager.prototype.constructor = ParkingManager;

/**
* @method listParkingInAssetsWithin
* Gets all the assets that provide parking in events within a GPS boundary.
* On a map boundary 1 and boundary 2 would create a boundary box as follows
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
* @return {Object} returns an object that contains an array of  ParkingAsset objects and pagination metadata.
**/

ParkingManager.prototype.listParkingInAssetsWithin = function(boundary1,boundary2,options){
	options['queryValue'] = mappings.eventTypes.PKIN;
	return this.listParkingAssetsWithin(boundary1,boundary2,options);
}


/**
* @method listParkingOutAssetsWithin
* Gets all the assets that provide parking events within a GPS boundary.
* On a map boundary 1 and boundary 2 would create a boundary box as follows
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
* @return {Object} returns an object that contains an array of  ParkingAsset objects and pagination metadata.
**/

ParkingManager.prototype.listParkingOutAssetsWithin = function(boundary1,boundary2,options){
	options['queryValue'] = mappings.eventTypes.PKOUT;
	return this.listParkingAssetsWithin(boundary1,boundary2,options);
}


/**
* @method listParkingAssetsWithin
* Gets all the assets that provide parking in events within a GPS boundary.
* On a map boundary 1 and boundary 2 would create a boundary box as follows
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
* @return {Object} returns an object that contains an array of  ParkingAsset objects and pagination metadata.
**/
ParkingManager.prototype.listParkingAssetsWithin = function(boundary1,boundary2,options){

  if(!boundary1){
  	throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary1 is required"};
  }

  if(!boundary2){
    throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary2 is required"};
  }

  var boundary = boundary1 + "," + boundary2;
  options['queryType'] = 'event-type';
  options['serviceType'] = "parking";
  options['bbox'] = boundary;
  options['zoneId'] = predixconfig.services["parking"].zoneId;

  if(!options['queryValue']  || options['queryValue'] == ""){
	  options['queryValue'] = mappings.eventTypes.PKIN;
	  //+ "," + mappings.eventTypes.PKIN;
  }

  this.listAssets(options, function (response) {
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
      var asset = new parkingasset.ParkingAsset(assets[i], this.client);
      parsedAssets.push(asset);
    }

    return {
      "assets":parsedAssets,
      "page":page
    }
  });
}

/**
* @method listParkingZones
* Gets all the assets that provide parking in events within a GPS boundary.
* On a map boundary 1 and boundary 2 would create a boundary box as follows
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
* @return {Object} returns an object that contains an array of  ParkingAsset objects and pagination metadata.
**/

ParkingManager.prototype.listParkingZones = function(boundary1,boundary2,options){

  if(!boundary1){
  	throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary1 is required."};
  }

  if(!boundary2){
    throw {"errorCode" :"PARAMETER_REQUIRED" ,"errorDetail":"Boundary Box boundary2 is required."};
  }

  if(options == null){
    options = {};
  }
  var page = options.page;
  var size = options.size;

  var boundary = boundary1 + "," + boundary2;

  var params = {

    'serviceType':"parking",
    'locationType':mappings.locationTypes.PARKING_ZONE,
    'bbox':boundary,
    'zoneId':predixconfig.services["parking"].zoneId
  };
  if(size != null && size != undefined){
    if(isNaN(size)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"size must be a numeric value."};
    }
    params["size"] = size;
  }

  if(page != null && page != undefined){
    if(isNaN(page)){
      throw {"errorCode":"INVALID_PARAMETER_VALUE" , "errorDetail":"page must be a numeric value."};
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
    var location = new parkingzone.ParkingZone(locations[i], this.client);
    parsedLocations.push(location);
  }

  return {
    "locations":parsedLocations,
     "page":page
  }

}

/**
* @method listParkingSpots
* Gets all the assets that provide parking in events within a GPS boundary.
* On a map boundary 1 and boundary 2 would create a boundary box as follows
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
* @return {Object} returns an object that contains an array of  ParkingAsset objects and pagination metadata.
**/
ParkingManager.prototype.listParkingSpots = function(boundary1,boundary2,options){
  return new Promise((resolve, reject) => {

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

      'serviceType':"parking",
      'locationType':mappings.locationTypes.PARKING_SPOT,
      'bbox':boundary,
      'zoneId':predixconfig.services["parking"].zoneId
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


    this.listLocations(params).then((response) => {
      var page;
      var locations;
      if(response["_embedded"]){
        page = response["_embedded"]["page"];
        locations = response["_embedded"]["locations"];
      }else{
        locations = response["content"];
      }

      var parsedLocations = [];
      console.log("locations " + JSON.stringify(locations));
      for(var i=0; i < locations.length;i++){
        var location = new parkingspot(locations[i], this.client);
        parsedLocations.push(location);
      }

      resolve({
        "locations":parsedLocations,
        "page":page
      })

    });
  })
}
module.exports = ParkingManager;