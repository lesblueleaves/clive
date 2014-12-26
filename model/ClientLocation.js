'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;
var dimension = require('./Dimension.js');
var Dimension = mongoose.model('Dimension');

var ClientSchema = new Schema({
	ipAddress: String,
	userName: String,
	ssId: String,
	band: String,
	apMacAddress: String,
	isGuestUser:Boolean,
	dot11Status:String,
	macAddress:String,
	confidenceFactor:Number,
	mapInfo:[{
		mapHierarchyString:String,
		floorRefId:String,
		dimension:[Dimension],
	}],
	mapCoordinate:{
		x:Number,
		y:Number,
		unit:{
			type: String,
      		default:"FEET"
		}
	},
	statistics:{
		currentServerTime:Date,
		firstLocatedTime:Date,
		lastLocatedTime:Date
	},
	created:{
		type:Date,
		default:Date.now
	}
});

mongoose.model('CmxClient', ClientSchema);