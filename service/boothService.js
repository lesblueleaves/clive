var mongojs = require('mongojs');
var uuid = require('node-uuid');

var logger = require("../logger");

var boothdb = mongojs('mongodb://localhost:27017/cmxapp', ['booth']);

boothService = {};
boothService.getBoothByLoc = getBoothByLoc
boothService.saveBooth = saveBooth

function getBoothByLoc(loc,callback){
	var x = loc.x;
  	var y = loc.y;
	boothdb.booth.findOne({
			$and:[
				{$and: [{dx:{$gt:Number(x)}},{x:{$lt:Number(x)}}]},
				{$and: [{dy:{$gt:Number(y)}},{y:{$lt:Number(y)}}]}
			]
		}, function(err, data){
			callback(data);
	});
}

function saveBooth(boParam,callback){
	var booth = {};
	booth.id = uuid.v1();
	booth.name = boParam.name;
	booth.x = Number(boParam.boothx);
	booth.y = Number(boParam.boothy);
	booth.offsetX = Number(boParam.offsetx);
	booth.offsetY = Number(boParam.offsety);
	booth.dx = Number(boParam.boothx) + Number(boParam.offsetx);
	booth.dy = Number(boParam.boothy) + Number(boParam.offsety);

	boothdb.booth.save(booth,function(err,doc){
		if(err) {
			logger.error(err);
			callback("save failed!");
		}else{
			callback("saved successfully!");
		}
	});
}

module.exports=boothService;
