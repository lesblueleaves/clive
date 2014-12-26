'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var dimension = require('./Dimension.js');
var Dimension = mongoose.model('Dimension');
var accessPoint = require('./AccessPoint.js');
var AccessPoint = mongoose.model('AccessPoint');

var CampusSchema = new Schema({
  name: String,
  version: {
    type: String,
    default:"6"
  },
  dimensionOfCampus:[Dimension],
  building:[{
    name: String,
    version: {
      type: String,
      default:"5"
    },
    dimensionOfBuilding: [Dimension],
    floor:[{
      version: {
        type: String,
        default:"4"
      },
      name:String,
      isOutdoor:Boolean,
      floorNumber:Number,
      dimensionOfFloor: [Dimension],
      image:[{
        imageName:String
      }],
      accessPoint:[AccessPoint],
      locationFilterRegion:[{
        regionType:String,
        mapCoordinate:[{
          x:String,
          y:String,
          unit:{
            type: String,
            default:"FEET"
          }
        }
    ],
      }]
    }],
  }],

});

mongoose.model('CmxMap', CampusSchema);