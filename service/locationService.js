var xml2js = require('xml2js');
var https = require('https');
var mongoose = require('mongoose');
require('../model/ClientLocation.js');
var cmxClient = mongoose.model('CmxClient');
var util = require('../utils/util.js');
var logger = require("../logger");


function location2Json (clientIp, callback) {
	var options = {
		host: '64.103.26.61',
		port: 443,
		path: '/api/contextaware/v1/location/clients/'+clientIp,
		method: 'GET',
		auth:'learning:learning',
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

exports.location2Json = location2Json

// location2Json('10.10.20.238',function(data){
// 	console.log(JSON.stringify(data));
// });

