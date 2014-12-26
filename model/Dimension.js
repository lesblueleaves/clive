'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var DimensionSchema = new Schema({
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
);

mongoose.model('Dimension', DimensionSchema);