var fs = require('fs'),
	mongojs = require('mongojs'),
    xml2js = require('xml2js');

var https = require('https');
var util = require('./utils/util.js');

var options = {
	host: '64.103.26.61',
	port: 443,
	path: '/api/contextaware/v1/location/clients/',
	method: 'GET',
	auth:'learning:learning',
	rejectUnauthorized: false
};

var db = mongojs('mongodb://localhost:27017/cmxapp', ['cmxclient']);

var parser = new xml2js.Parser();

var outputFilename = 'client.json';
var req = https.request(options, function(res) {
  console.log("statusCode: ", res.statusCode);
  if(res.statusCode != 200) return; 
  var str;

  res.on('data', function(data) {
      parser.parseString(data, function (err, result) {
        str += data;
     });
  });

   res.on('end', function () {
    parser.parseString(str, function (err, result) {
        var wirelessLocations = result.Locations.WirelessClientLocation;
        var cls = [];       
        cls = util.parseLocations(wirelessLocations);
        db.cmxclient.insert(cls, function(err,data){
            console.log(data);
         });

    // fs.writeFile("cxml1", JSON.stringify(str,null, 2), function (err) {
    //    if (err) throw err;
    //     console.log('It\'s saved!');
    // });

       // fs.writeFile(outputFilename, JSON.stringify(result,null, 2), function (err) {
       // if (err) throw err;
       //  console.log('It\'s saved!');
    // });
 });
      	 
});
});

req.end();

req.on('error', function(e) {
	console.error('err');
  console.error(e);
});