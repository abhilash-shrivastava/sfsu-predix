/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
var factory = require("../factory.js");

var predix = new factory.Predix();
var pedestrianManager = predix.getPedestrianManager();
var options = {
	"page":	0,
	"size": 2
};
// list all crosswalks within the geospatial boundaries

var crosswalks = pedestrianManager.listCrosswalks("32.123:-117","32.714983:-117.158012",options);
console.log(JSON.stringify(crosswalks));

var crosswalk = crosswalks["locations"][0];
var result = crosswalk.listCrosswalkAssets();
var asset =  result[0];

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();
//get all the pedestrians that went into a crosswalk
var pedIn = asset.listPedestrianIn((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),null,options);
//get all the pedestrians that went out of a crosswalk
var pedOut = asset.listPedestrianOut((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),null,options);

return {
  "in": pedIn,
   "out":pedOut
}			
