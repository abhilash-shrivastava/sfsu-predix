/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var predixConfig = require("./config.js")


/**
 * Base class that represents assets, assets are devices that monitor traffic / pedestrian movement/ parking.
 * @class Asset
 * @constructor Asset
 * @param {Object} dto The asset entity returned from predix within a json object.
 */
function Asset(dto, client) {
  if(dto){
    var keys = Object.keys(dto);
   	for (var i=0; i< keys.length; i++) {
         this[keys[i]] = dto[keys[i]];
      }
   }
   this.client =client;
}
 
Asset.prototype.constructor = Asset;
/**
* @method getEvents
* @param {Object} [dto] 
* @param {String} [dto.eventType] The type of events we want to pick from the asset. It could be any of the events declared in   * mappings
* @param {Integer}[dto.startTime] limits the results to all the events that took place after this time in epoch.
* @param {Integer}[dto.endTime] limits the results too all the events that took place before this time in epoch.
* @param {String} [dto.serviceType] determins what service is being called to retrieve the events. It could be traffic, parking, environment.
* @param {String} [dto.page] determins what page to retrieve. Starts at 0 (default).
* @param {String} [dto.size] determins how many events to retrieve per page. (Optional)
* @return events (ex. vehicules passing through a lane) of eventType picked up from this asset within a time interval
**/

Asset.prototype.getEvents = function(dto){
  return new Promise((resolve, reject) => {
    var eventType = dto.eventType;
    var startTime = dto.startTime;
    var endTime = dto.endTime;
    var serviceParams = dto.serviceParams;
    var serviceType = dto.serviceType;
    var size = dto.size;
    var page = dto.page;

    if(eventType == null || eventType == ""){
      throw "eventName is required";
    }
    if(startTime == null || startTime == 0){
      throw "startTime is required";
    }
    if(endTime == null || endTime == 0){
      throw "endTime is required";
    }
    if(serviceType == null || serviceType.trim() == ''){
      throw "serviceType is required";
    }

    var params = {
      "event-types":eventType,
      "start-ts":startTime,
      "end-ts":endTime,
    };

    if(size != null){
      params["size"] = size;
    }

    if(page != null){
      params['page'] = page;
    }

    if(serviceParams != null){
      var keys = Object.keys(serviceParams);
      for (var i=0; i< keys.length; i++) {
        params[keys[i]] = serviceParams[keys[i]];
      }
    }
    var url = predixConfig.services[serviceType]["endPoint"];
    var zoneId = predixConfig.services[serviceType]["zoneId"];

    var request = {
      host: 'ic-event-service.run.aws-usw02-pr.ice.predix.io',
      path: "/v2/assets/" + this.assetUid + "/events?eventType=" + eventType + "&startTime=" + startTime + "&endTime=" + endTime,
      headers: {
        "Predix-Zone-Id": zoneId
      }
    };
    this.client.callApi(request).then((response) =>{
      resolve(response);
    });
  })
};
module.exports = Asset;