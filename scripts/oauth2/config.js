/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/
module.exports = {
  // The URL of the default UAA authentiction service
  uaa: "890407d7-e617-4d70-985f-01792d693387.predix-uaa.run.aws-usw02-pr.ice.predix.io",

// The clientId of the predix application
  clientId: "hackathon",

// The password of the prefix application
  clientPassword: "@hackathon"
};







			
