/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var predixconfig = require("./config.js");

/**
 * Allows you to get locations and assets related to a service
 * @class ServiceManager
 * @constructor
 * @param {Object} [dto]
 * @param {Object} [dto.client] An instance of predix/httpclient
 */
function ServiceManager(dto) {
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

/**
 * List all assets of for a given service type. Service types are defined in predix/config (services)
 * @method listAssets
 * @param {Object} [dto]
 * @param {String} [dto.zoneId]  
 * @param {String} [dto.serviceType]: the type of intelligent city service (e.g. "parking")
 * @param {String} [dto.queryType] : one of device-type, media-type, event-type
 * @param {String} [dto.queryValue] : the value that is associated to the query of type queryType
 * (check prefix/mapping for possible values per queryType). 
 * @param {String} [dto.bbox] : boundaries to seach within
 * @param {Numeric} [dto.index] : display the page n# index (optional). Starts at 0 (default)
 * @param {Numeric} [dto.size] : display a max of maxRecords items per page (optional)
 * @return {Object} an object contain an array of assets and pagination metadata.
 */
ServiceManager.prototype.listAssets = function(dto) {
  
  if (!dto || !dto.zoneId || !dto.serviceType || !dto.bbox) {
  
    throw {
      errorCode: "Invalid_Parameter",
      errorDetail: "AssetManager: dto, dto.zoneId, dto.serviceType and to.bbox cannot be null or empty"
    };
  }
  
  var url = predixconfig.services[dto.serviceType]["endPoint"];
  if (!url) {
    
    throw {
      
      errorCode: "Service_Not_Found",
      errorDetail: "Could not find a service endpoint for " +  dto.serviceType + ". Please check predix/config"
    };
  }
  
  var requestParams = {
    url: url + "/v1/assets/search",
    params: {
      bbox: dto.bbox
    },
    headers: {
      "Predix-Zone-Id": dto.zoneId
    }
  }
  
 requestParams.params["device-type"]= predixconfig.mode;

  if (dto.queryType) {
    requestParams.params.q = dto.queryType +":" + dto.queryValue;
  }
  
  if (dto.index) {
    requestParams.params.page = dto.index;
  }
  
  if (dto.maxRecords) {
    requestParams.params.size = dto.size;
  }
  return this.client.callApi(requestParams);
}



/**
 * List all locations of a given service type. Service types are defined in predix/config (services)
 * @method listLocations
 * @param {Object} [dto]
 * @param {String} [dto.zoneId]  
 * @param {String} [dto.serviceType]: the type of intelligent city service (e.g. "parking")
 * @param {String} [dto.locationType] : the location Type (e.g. PARKING_SPOT)
 * (check prefix/mapping for possible values per queryType). 
 * @param {String} [dto.bbox] : boundaries to seach within
 * @param {Numeric} [dto.index] :determins the page n# index (optional). Starts at 0 (default) (optional)
 * @param {Numeric} [dto.size] : determins max of items per page (optional)
 * @return {Object} returns an array of locations and pagination metadata.
 */
ServiceManager.prototype.listLocations = function(dto) {

  return new Promise((resolve, reject) => {
    if (!dto || !dto.zoneId || !dto.serviceType || !dto.bbox) {

      throw {
        errorCode: "Invalid_Parameter",
        errorDetail: "AssetManager: dto, dto.zoneId, dto.serviceType and to.bbox cannot be null or empty"
      };
    }

    var url = predixconfig.services[dto.serviceType]["endPoint"];
    if (!url) {

      throw {

        errorCode: "Service_Not_Found",
        errorDetail: "Could not find a service endpoint for " +  dto.serviceType + ". Please check predix/config"
      };
    }

    var requestParams = {
      host: url,
      path: "/v2/metadata/locations/search?q=location-type:" + dto.locationType + "&bbox=" + dto.bbox + "&device-type=" + predixconfig.mode,
      headers: {
        "Predix-Zone-Id": dto.zoneId
      }
    };

    if (dto.index) {
      requestParams.path = requestParams.path + "&page=" + dto.index;
    }

    if (dto.size) {
      requestParams.path = requestParams.path + "&size=" + dto.size;
    }
    this.client.callApi(requestParams).then((response) => {
      resolve(response);
    });
  })
}
module.exports = ServiceManager;