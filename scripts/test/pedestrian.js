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

//We get all the assets that can give us traffic data within a boundary box , 2 results per page and get the first page.

var result =  pedestrianManager.listPedestrianAssetsWithin("32.123:-117","32.714983:-117.158012",options);
//We can get the traffic events from any of the assets retrieved within the boundary box.
var asset =  result["assets"][0];

//list the traffic events detected by this asset for the past month on the first lane,Get 10 events per page and the first page.
var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();
// list all the pedestrians that went into the crosswalk 
var pedIn = asset.listPedestrianIn((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),null,options);

//list all the pedestrians that went out of the crosswalk
var pedOut = asset.listPedestrianOut((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),null,options);

return {
  "in": pedIn,
   "out":pedOut
}			