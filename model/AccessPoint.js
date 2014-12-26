'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var AccessPointSchema = new Schema({
    name: String,
    radioMacAddress: String,
    ethMacAddress:String,
    ipAddress:String,
    numOfSlots:Number,
    apMode:String,
    mapCoordinate:[{
      x:String,
      y:String,
      unit:{
        type: String,
        default:"FEET"
      }
    }
    ],
    ApInterface:[{
      band: String,
      slotNumber: String,
      channelAssignment:String,
      channelNumber:String,
      txPowerLevel:String,
      antennaPattern:String,
      antennaAngle:String,
      antennaElevAngle:String,
      antennaGain:String
    }]
  }
);

mongoose.model('AccessPoint', AccessPointSchema);