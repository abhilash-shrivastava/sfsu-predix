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
	"size": 2
}

var result =  trafficManager.listTrafficAssetsWithin("32.123:-117","32.714983:-117.158012",options);
//We can get the traffic events from any of the assets retrieved within the boundary box.
var asset =  result["assets"][0];
console.log(JSON.stringify(result));
//list the traffic events detected by this asset for the past month on the first lane,Get 10 events per page and the first page.
var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();

return asset.listTrafficFlow((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);			