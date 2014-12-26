var fs = require('fs'),
	mongojs = require('mongojs'),
    xml2js = require('xml2js');

var https = require('https');

var mongoose = require('mongoose');
var map = require('./model/Map.js');
var Map = mongoose.model('CmxMap');

var options = {
	host: '64.103.26.61',
	port: 443,
	path: '/api/contextaware/v1/maps',
	method: 'GET',
	auth:'learning:learning',
	rejectUnauthorized: false
	// requestCert: true
	// agent: false
};


var mapdb = mongojs('mongodb://localhost:27017/cmxapp', ['cmxmap']);

var outputFilename = 'map.json';
var parser = new xml2js.Parser();
var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  // console.log("headers: ", res.headers);

  res.on('data', function(data) {
    // process.stdout.write(d);
    parser.parseString(data, function (err, result) {
    	
    	for (var i = 0; i < result.Maps.Campus.length ; i++) {
    		var campus = result.Maps.Campus[i];
    		var campusModel = {};

    		campusModel.name=campus.$.name;
			campusModel.version=campus.$.objectVersion;
    		campusModel.dimensionOfCampus = [];
    		campusModel.building = [];
    		

    		setDimension(campus.Dimension, campusModel.dimensionOfCampus);

    		var buildings = campus.Building;
    		for (var j = 0; j < buildings.length ; j++) {
    			var bu = buildings[j];
    			var buModel = {};
    			campusModel.building.push(buModel);

    			buModel.dimensionOfBuilding = [];
    			buModel.floor = [];

    			buModel.name = bu.$.name;
    			buModel.version = bu.$.objectVersion;
    			setDimension(bu.Dimension, buModel.dimensionOfBuilding);


    			for (var k = 0; k < bu.Floor.length ; k++) {
    				var floor = bu.Floor[k];
    				var buFloor ={};
    				buModel.floor.push(buFloor);

    				buFloor.dimensionOfFloor=[];
    				buFloor.Image = [];
    				buFloor.accessPoint=[];
    				buFloor.LocationFilterRegion=[];

					buFloor.name = floor.$.name;
					buFloor.version = floor.$.objectVersion;
					buFloor.isOutdoor = floor.$.isOutdoor;
					buFloor.floorNumber = floor.$.floorNumber;
					
					for (var l = 0; l < floor.Image.length ; l++) {
						buFloor.Image.push({"imageName":floor.Image[l].$.imageName});
					};

					setDimension(floor.Dimension, buFloor.dimensionOfFloor);

					//AccessPoint
					for (var m = 0; m < floor.AccessPoint.length ; m++) {
						var accessPoint = floor.AccessPoint[m];
						var apModel = {};
						apModel.mapCoordinate=[];
						apModel.ApInterface=[];
						buFloor.accessPoint.push(apModel);

						apModel.name = accessPoint.$.name;
						apModel.radioMacAddress = accessPoint.$.radioMacAddress;
						apModel.ethMacAddress = accessPoint.$.ethMacAddress;
						apModel.ipAddress = accessPoint.$.ipAddress;
						apModel.numOfSlots = accessPoint.$.numOfSlots;
						apModel.apMode = accessPoint.$.apMode;

						for (var n = 0; n < accessPoint.MapCoordinate.length ; n++) {
							var mc = accessPoint.MapCoordinate[n];
							apModel.mapCoordinate.push({"x":mc.$.x,"y":mc.$.y,"unit":mc.$.unit});
						};

						for (var p = 0; p < accessPoint.ApInterface.length ; p++) {
							var ap = accessPoint.ApInterface[p];
							var apEntry={};
							apModel.ApInterface.push(apEntry);
							apEntry.band= ap.$.band;
							apEntry.slotNumber= ap.$.slotNumber;
							apEntry.channelAssignment= ap.$.channelAssignment;
							apEntry.channelNumber= ap.$.channelNumber;
							apEntry.txPowerLevel= ap.$.txPowerLevel;
							apEntry.antennaPattern= ap.$.antennaPattern;
							apEntry.antennaAngle= ap.$.antennaAngle;
							apEntry.antennaElevAngle= ap.$.antennaElevAngle;
							apEntry.antennaGain= ap.$.antennaGain;
						};
					};

					for (var s = 0; s < floor.LocationFilterRegion.length ; s++) {
						var lfg = floor.LocationFilterRegion[s];
						var lfgModel = {};
						buFloor.LocationFilterRegion.push(lfgModel);
						lfgModel.regionType=lfg.$.regionType;	
						lfgModel.mapCoordinate=[];				
						for (var t = 0; t < lfg.MapCoordinate.length ; t++) {
							var mc = lfg.MapCoordinate[t];
							lfgModel.mapCoordinate.push({"x":mc.$.x,"y":mc.$.y,"unit":mc.$.unit});
						};
					};

    			};

    		};
    		
			mapdb.cmxmap.save(campusModel, function (err, data) {
				console.log(data);
			});		
    	};

	});
	});
});
req.end();

req.on('error', function(e) {
  console.error(e);
});


function setDimension(dimensionArray, dimensionOfModel){
	for (var k = 0; k < dimensionArray.length ; k++) {
		var cDimension = dimensionArray[k];
		var cd = {};

		cd.length = cDimension.$.length;
		cd.width = cDimension.$.width;
		cd.height = cDimension.$.height;
		cd.offsetX = cDimension.$.offsetX;
		cd.offsetY = cDimension.$.offsetY;
		cd.unit = cDimension.$.unit;
		dimensionOfModel.push(cd);
    }
}