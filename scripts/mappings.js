/** Script ACLs do not delete 
 read=nobody 
write=nobody
execute=authenticated 
  **/ 
module.exports = {
  nodeTypes: {

    NODE: " NODE", // Parent asset
    CAMERA: "CAMERA",
    TRAFFIC:"TRAFFIC",
    MIC: "MIC", // audio devices + sensors
    ENVIRONMENTAL: "ENV", // environmental sensors
    OTHERS: "OTHERS"
  },
  mediaTypes: {

  IMAGE: "IMAGE", // JPG, PNG, or GIF formats
  VIDEO: "VIDEO", // MP4 format
  AUDIO: "AUDIO", // MP3 or WAV format
  OTHERS: "OTHERS" // non-standard formats.
  },
  eventTypes: {

  PKIN: "PKIN", // vehicles entering parking areas within the boundaries
  PKOUT: "PKOUT", // vehicles exiting parking areas within the boundaries
  SFIN: "SFIN", //pedestrians entering monitored areas within the boundaries
  SFOUT: "SFOUT", //pedestrians exiting monitored areas within the boundaries
  TFEVT: "TFEVT", // traffic flow data
  ENCHG: "ENCHG", // Changed environmental conditions, such as temperature
  LIGHT_LEVEL: "LIGHT_LEVEL", // assets that report illuminance sensor events
  OCCUPANCY: "OCCUPANCY", // assets that report occupancy sensor events
  TEMP: "TEMP" //  assets that report temperature sensor events w
  },
  locationTypes: {
  TRAFFIC_LANE :"TRAFFIC_LANE",
  CROSSWALK :"CROSSWALK",
  PARKING_ZONE :"PARKING_ZONE",
  PARKING_SPOT :"PARKING_SPOT"
  }
}