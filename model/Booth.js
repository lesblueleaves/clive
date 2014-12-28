'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var BoothSchema = new Schema({
	id: String,
	name: String,
	x:Number,
	y:Number,
	offsetX:Number,
	offsetY:Number
});

mongoose.model('Booth', BoothSchema);
