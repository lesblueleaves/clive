var fs = require('fs'),
	mongojs = require('mongojs'),
    xml2js = require('xml2js');

var https = require('https');
var uuid = require('node-uuid');

var util = require('./utils/util.js');
var boothService = require('./service/boothService');
var logger = require("./logger");

var clientdb = mongojs('mongodb://localhost:27017/cmxapp', ['cmxclient']);


var infile = "client.json";
var obj;
fs.readFile(infile, 'utf8', function (err, data) {
  if (err) throw err;
  obj = JSON.parse(data);
  var locations = util.parseLocations(obj.Locations.WirelessClientLocation);
  var i=0;
  locations.forEach(function(loc){
  		boothService.getBoothByLoc(loc.mapCoordinate[0],function(booth){
  			if(!!booth){
	  			loc.boothId=booth.id;
	  			loc.boothName = booth.name; 
  			}
  		});
  	// }
 });

  clientdb.cmxclient.insert(locations, function(err,data){
	   if(err){
	   		logger.error(err);
	   }
	});
});


	// console.log(booth);
	// boothdb.booth.save(booth);