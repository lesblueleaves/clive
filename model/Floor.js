'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Meeting Schema
 */
var FloorSchema = new Schema({
  name: {
    type: String
  },
   version: {
    type: String,
    default:"5"
  },
  dimension: {  
    type: String,
    trim: true
  },
});

mongoose.model('Floor', FloorSchema);