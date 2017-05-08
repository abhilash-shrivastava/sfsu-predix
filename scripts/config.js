/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
 
 // configuration file for different services
// you can get the configuration by using cloud foundary 
// > cf env <appname>
module.exports = {
  services: {
    parking:{
      endPoint:"https://ic-event-service.run.aws-usw02-pr.ice.predix.io/v2",
      zoneId: "SDSIM-IE-PARKING"
    },
    traffic:{
      endPoint:"https://ie-traffic.run.aws-usw02-pr.ice.predix.io",
      zoneId:"454d0f55-7fc2-419e-9762-f7accc7cef40"
    },
    pedestrian:{
      endPoint:"https://ie-pedestrian.run.aws-usw02-pr.ice.predix.io",
      zoneId:"d1098c35-50ab-4702-9fba-fda4e486618d"
    }
  },



// Possible modes when running your application
  modes: {
    SIMDATA: "SIMDATA",
    PRODUCTION: "NODE"
  },

// Modify the below to modes.PRODUCTION if you want production data
  mode: "SIMDATA"

}