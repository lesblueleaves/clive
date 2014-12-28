var xml2js = require('xml2js')
	,https = require('https')
	,mongojs = require('mongojs')
	,moment = require('moment');

var util = require('../utils/util.js')
	,logger = require("../logger")
	,cfg = require('../config');

var locationdb = mongojs('mongodb://localhost:27017/cmxapp', ['cmxclient']);

var locationService = {};
locationService.location2Json =location2Json;
locationService.getLocationByDate =getLocationByDate;

locationService.capureLocs = capureLocs;

function location2Json (clientIp, callback) {
	// var options = {
	// 	host: '64.103.26.61',
	// 	port: 443,
	// 	path: '/api/contextaware/v1/location/clients/'+clientIp,
	// 	method: 'GET',
	// 	auth:'learning:learning',
	// 	rejectUnauthorized: false
	// };

	var options = {
		host: cfg.cmx.host,
		port: cfg.cmx.port,
		path: cfg.cmx.path + clientIp,
		method: 'GET',
		auth: cfg.cmx.acct,
		rejectUnauthorized: false
	};

	var parser = new xml2js.Parser();
	var req = https.request(options, function(res) {
		logger.info("Parse Location statusCode: " + res.statusCode +" with clientIp: " + clientIp);
		if(res.statusCode != 200) return;	
 		 var str;
		res.on('data', function(data) {
			parser.parseString(data, function (err, result) {
		        str += data;
		     });
		});

		res.on('end', function () {
			str = str || '';
			str = str.replace('undefined','');
		
			parser.parseString(str, function (err, result) {
				var cl={};  
				if (result){
					cl = util.parseALocation(result);
					callback(cl);
			} 
		});		 
	});
});
	req.end();
	req.on('error', function(e) {
		logger.error('err',e);	
	});

}

function getLocationByDate(ts,callback){
	var m = moment(Number(ts));
	var ms = moment(m);
	ms.subtract(2,"seconds");
	// logger.info(day);
	console.log(m.toDate());
	console.log(ms.toDate());

	locationdb.cmxclient.find(
		{
			statistics:{
				$elemMatch: {
					$and:[
						{lastLocatedTime:{$lte:m.toDate()}},
						{lastLocatedTime:{$gte:ms.toDate()}}
					]
				}
			}
		}, function(err, data){
			var rtnlocs=[];
			data.forEach(function(d){
				var loc={};
				rtnlocs.push(loc);
				loc.x= d.mapCoordinate[0].x;
				loc.y= d.mapCoordinate[0].y;
				loc.boothId = d.boothId;
				loc.boothName = d.boothName;
				loc.macAddress = d.macAddress;
			});
			callback(rtnlocs);
		});
}

 function capureLocs(){
 	// console.log("sstt");
 }

 module.exports = locationService;


