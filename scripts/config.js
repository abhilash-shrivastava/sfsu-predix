/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 // configuration file for different services
// you can get the configuration by using cloud foundary 
// > cf env <appname>

var services = {
  parking:{
    endPoint:"https://ie-parking.run.aws-usw02-pr.ice.predix.io",
    zoneId: "b8b58068-8f28-407a-9ad3-e8ebe46ad816"
  },
  traffic:{
    endPoint:"https://ie-traffic.run.aws-usw02-pr.ice.predix.io",
    zoneId:"454d0f55-7fc2-419e-9762-f7accc7cef40"
  },
  pedestrian:{
    endPoint:"https://ie-pedestrian.run.aws-usw02-pr.ice.predix.io",
    zoneId:"d1098c35-50ab-4702-9fba-fda4e486618d"
  }
}



// Possible modes when running your application
var modes = {
  SIMDATA: "SIMDATA",
  PRODUCTION: "NODE" 
};

// Modify the below to modes.PRODUCTION if you want production data
var mode = modes.SIMDATA;			
