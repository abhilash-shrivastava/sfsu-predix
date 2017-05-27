/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var predixConfig = require("./../config")


/**
 * Base class that represents locations
 * @class Location
 * @constructor Location
 * @param {Object} dto The location entity returned from predix within a json object.
 * @param {Object} client  the http client used to make authenticated http calls.
 */
function Location(dto, client,serviceType) {
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
   }
   if(client){
     this.client =client;
   }
  if(serviceType){
    this.serviceType =  serviceType;
  }
   
}
 
Location.prototype.constructor = Location;

/**
* @method getDetails
* @return {Object} returns all the available information about this location. 
**/
Location.prototype.getDetails  = function(){
  	var url = this["_links"]["self"].href.split("{")[0].replace("http","https");
  	console.log("Calling URL "  + url);
  	var zoneId = predixConfig.services[this.serviceType]["zoneId"];
  
    var request = {
      url: url,
      headers: {
        "Predix-Zone-Id": zoneId
      }
  	}
  	return this.client.callApi(request);
}

/**
* @method listAssets 
* @return returns an array of asset objects that are monitoring this location
**/

Location.prototype.listAssets  = function(dto){
  return new Promise((resolve, reject) =>{
    var url = predixConfig.services[this.serviceType]["endPoint"];
    console.log("Calling URL "  + url);
    var zoneId = predixConfig.services[this.serviceType]["zoneId"];
    var request = {
      host: url,
      path: "/v2/metadata/assets/search?q=eventTypes:" + dto.queryValue + "&bbox=" + dto.bbox,
      headers: {
        "Predix-Zone-Id": zoneId
      }
    }
    if (dto.index) {
      request.path = request.path + "&page=" + dto.index;
    }

    if (dto.size) {
      request.path = request.path + "&size=" + dto.size;
    }

    this.client.callApi(request).then((response) => {
      var assets = response.content;
      if(response["_embedded"] && response["_embedded"]["assets"]){
        assets = response["_embedded"]["assets"]
      }else {

      }
      resolve(assets);
    });
  });
};
module.exports = Location;