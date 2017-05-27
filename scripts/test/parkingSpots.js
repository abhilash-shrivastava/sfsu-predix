/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
var factory = require("../factory.js");

var predix = new factory.Predix();
var parkingManager = predix.getParkingManager();
var boundary1 = "32.123:-117";
var boundary2 = "32.714983:-117.158012";

// first page , 2 result per page
var options = {
	"page":	0,
	"size": 2
}
///get all the parking spots within a geospatial boundary box 
var result =  parkingManager.listParkingSpots(boundary1, boundary2, options);
var location  =  result["locations"][0];
// we can get the available details about the parking spots.
console.log(JSON.stringify(location.getDetails()));
//we can get all the parking assets that are monitoring the location
var assets = location.listParkingAssets();
var asset = assets[0];

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();

var options = {
		 "size":2,
		 "page":1
}
//we can find all the events that were detected by one of the assets
return asset.listVehiculesIn((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);			