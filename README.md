# Predix Connector
## About Predix
  [Predix](http://www.predix.io) is the software platform that powers the Industrial Internet. Based on GE’s unparalleled expertise in brilliant machines, Predix handles big data at an industrial scale and with industrial-strength security. Predix can be deployed on machines, on site, or in the cloud.

## Purpose of the scriptr.io connector for Predix
 The purpose of the connector is to leverage the services that predix provides, starting with the Intelligent environments services. Each major service is handled by a manager. The currently supported services are traffic planning (beta), parking planning (beta) and pedestrian planning(beta). For example, you can use the traffic and parking planning services to study traffic patterns in a location to determine if new roads or better public transportation services are necessary. You can also list parking spots in a geospatial boundary to determine if there are parking spots in a location at a specific time.

    
## Components
  - `predix/factory` lists the managers for the supported services.
  - `predix/servicemanager` exposes a generic implementation to list assets and locations that are extended by the specialized managers (parking, pedestrian, traffic).
  - `predix/parkingmanager` lists parking assets, parking zones and parking spots in a geospatial boundary.
  - `predix/pedestrianmanager` lists pedestrian assets, crosswalks in a geospatial boundary.
  - `predix/trafficmanager` lists traffic assets and traffic lanes in a geospatial boundary.
  - `predix/asset` represents a generic predix asset, which could be any device.
  - `predix/parkingAsset` extends an asset and represents a device which monitors parking. Used to get parking spot information, collected as in and out events.
  - `predix/pedestrianAsset` extends an asset and represents a device which monitors pedestrians. Used to monitor pedestrian traffic as they walk in and out of crosswalks.
  - `predix/trafficAsset` extends an asset and represents a device that monitors traffic. Used to get traffic flow events.
  - `predix/locations/location` represents a location. Used to get details about a specific location and the assets that monitor it.
  - `predix/locations/parkingzone` extends location information and represents a parking zone. Used to get details about a parking zone and the parking assets that monitor it.
  - `predix/locations/parkingspot` extends location information and represents a parking spot. Used to get details about a parking spot and parking assets that monitor it.
  - `predix/locations/crosswalk` extends location information and represents a crosswalk. Used to get details about a crosswalk and pedestrian assets that monitor it.
  - `predix/locations/trafficlane` extends location information and represents a traffic lane. Used to get details about a traffic lane and traffic assets that monitor it.
  - `predix/config` is a configuration file which holds the service endpoints and zone ids of all the predix services.
  - `predix/mappings` is a file that maps all predix constants.
  - `predix/oauth2/tokenmanager` performs oauth 2 authorization using the predix uaa service and manages the access token.
  - `predix/oauth2/config` a file which contains the uaa service configuration ( clientId, clientSecret, uaa endpoint).
  - `predix/httpClient` is an http client that knows how to call the predix REST web services and interpret their       responses. Obtains a token from the token manager to authenticate requests.
  
#Predix Setup

- [Register to predix](https://www.predix.io/registration/) 
- Subscribe to [traffic planning](https://www.predix.io/services/service.html?id=1763), [pedestrian planning](https://www.predix.io/services/service.html?id=1766) and [parking planning](https://www.predix.io/services/service.html?id=1765) services with a single [uaa](https://www.predix.io/services/service.html?id=1172) service and bind them to an app.
- Go to the [predix security starter kit](https://predix-starter.run.aws-usw02-pr.ice.predix.io) to configure your uaa instance.
- Login as admin, then create a client id and secret.
- Use the following cloud foundary command to get the oauth scopes, zone ids and endpoints of all your services. 
```  
cf env <app> 
```
- Add to oauth scopes to the client oauth scopes and authorities using the security starter kit.
- Update predix/config with the zone id and end points of all your services.
- Update predix/oauth2/config with the client id and secret.

#Use the connector
- Check all the tests available under predix/test

- You can get assets and locations by using a geospatial boundary box. A geospatial boundary box would be as follows. 

```
boundary1 ex 130:-200 _______________
|                                    |
|                                    |
|                                    |
|____________________________boundary2 ex 160:200
```

- List traffic assets within a geospatial boundary and then get the events of the first one.
```
var factory = require("/modules/predix/factory");
var predix = new factory.Predix();
var trafficManager = predix.getTrafficManager();

//We get all the assets that can give us traffic data within a boundary box , 2 results per page and get the first page.
var options = {
	"page":	0,
	"size": 2
}

var result =  trafficManager.listTrafficAssetsWithin("32.123:-117","32.714983:-117.158012",options);
var asset =  result["assets"][0];
var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();
return asset.listTrafficFlow((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);

```

- List traffic lanes and then get events on lane 1 from the first asset that monitors it.
```
var factory = require("/modules/predix/factory");
var predix = new factory.Predix();
var trafficManager = predix.getTrafficManager();
var options = {
	"page":	0,
	"size": 5
}

var result =  trafficManager.listTrafficLanes("32.123:-117","32.714983:-117.158012",options);
var trafficlane =  result["locations"][0];
var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();
var assets = trafficlane.listTrafficAssets();
var asset = assets[0];///let's check out the first asset.
 options = {
  "lane" : "Lane 1"
};
return asset.listTrafficFlow((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);
```

- List parking assets and then get the events of the first one.
```
var factory = require("/modules/predix/factory");

var predix = new factory.Predix();
var parkingManager = predix.getParkingManager();
var boundary1 = "32.123:-117";
var boundary2 = "32.714983:-117.158012";


// first page , 2 result per page
var options = {
	"page":	0,
	"size": 2
}


// list all parking assets within the specified boundaries
var result =  parkingManager.listParkingInAssetsWithin(boundary1, boundary2, options);
var asset  =  result["assets"][0];

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();

var options = {
		 "size":2,
		 "page":1
}
//list Vehicules that went into a parking zone or parking spot.
return asset.listVehiculesIn((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);
```

- List parking spots and then get the events from the first asset that is monitoring it.
```
var factory = require("/modules/predix/factory");
var predix = new factory.Predix();
var parkingManager = predix.getParkingManager();
var boundary1 = "32.123:-117";
var boundary2 = "32.714983:-117.158012";

var options = {
	"page":	0,
	"size": 2
}
var result =  parkingManager.listParkingSpots(boundary1, boundary2, options);
var location  =  result["locations"][0];
var assets = location.listParkingAssets();
var asset = assets[0];

var startDate = new Date();
startDate.setMonth(startDate.getMonth() - 1);
var endDate = new Date();

var options = {
		 "size":2,
		 "page":1
}

return asset.listVehiculesIn((endDate.getTime() - (24 * 60 * 60 * 1000)),endDate.getTime(),options);
```

- List pedestrian assets and then get the events from the first asset that is monitoring it.
```
var factory = require("/modules/predix/factory");
var predix = new factory.Predix();
var pedestrianManager = predix.getPedestrianManager();
var options = {
	"page":	0,
	"size": 2
};

var result =  pedestrianManager.listPedestrianAssetsWithin("32.123:-117","32.714983:-117.158012",options);
var asset =  result["assets"][0];
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

```

- List crosswalks and then get the events from the first asset that is monitoring it.
```
var factory = require("/modules/predix/factory");
var predix = new predixlib.Predix();
var pedestrianManager = predix.getPedestrianManager();
var options = {
	"page":	0,
	"size": 2
};
// list all crosswalks within the geospatial boundaries
var crosswalks = pedestrianManager.listCrosswalks("32.123:-117","32.714983:-117.158012",options);
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
```
