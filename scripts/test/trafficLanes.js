/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 var factory = require("../factory.js");

var predix = new factory.Predix();
var trafficManager = predix.getTrafficManager();

//We get all the assets that can give us traffic data within a boundary box , 2 results per page and get the first page.
var options = {
	"page":	0,
	"size": 5
}

var result =  trafficManager.listTrafficLanes("32.123:-117","32.714983:-117.158012",options);
console.log(JSON.stringify(result));
//We can get the traffic lanes within the boundary box.
var trafficlane =  result["locations"][0];

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();

console.log(trafficlane.getDetails());
//we can get all the assets that monitor one of the traffic lanes
var assets = trafficlane.listTrafficAssets();
var asset = assets[0];///let's check out the first asset.
  
options = {
  "lane" : "Lane 1"
};

//list the traffic events detected by this asset for the past month on the first lane,Get 10 events per page and the first page.
return asset.listTrafficFlow((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);			