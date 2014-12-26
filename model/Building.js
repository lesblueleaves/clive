'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var BuildingSchema = new Schema({
  name: String,
  version: {
    type: String,
    default:"5"
  },
  dimension: {
    length: Number,
    width: Number,
    height:Number,
    offsetX:Number,
    offsetY:Number,
    unit:{
      type: String,
      default:"FEET"
    }
  },
  floor:[{
    version: {
      type: String,
      default:"4"
    },
    name:String,
    isOutdoor:Boolean,
    floorNumber:Number
  }],
    dimensionOfFloor: {
      length: Number,
      width: Number,
      height:Number,
      offsetX:Number,
      offsetY:Number,
      unit:{
        type: String,
        default:"FEET"
      }
    }
});

mongoose.model('Building', BuildingSchema);