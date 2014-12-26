var WebSocketServer = require('websocket').server;
var http = require('http');
var restify = require('restify');
var mongojs = require('mongojs');
var mongoose = require('mongoose');
var map = require('./model/Map.js');
var Map = mongoose.model('CmxMap');
var locService = require('./service/locationService.js');

var logger = require("./logger");

// var server = http.createServer(function(request, response){
// 	console.log(new Date() + ' Received request for ' + request.url);
// 	response.writeHead(404);
// 	response.end();
// });

var mapdb = mongojs('mongodb://localhost:27017/cmxapp', ['cmxmap']);
var locationdb = mongojs('mongodb://localhost:27017/cmxapp', ['cmxclient']);

var server = restify.createServer({name: 'clive'});

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.listen(9696, function(){
	 console.log((new Date()) + ' Server is listening on port 9696');
});

server.get('/location/getme', function(req, res, next){
  var myIp = req.connection.remoteAddress;
  logger.info('myIp: '+ myIp);

  var cmxloc =[];

  locationdb.cmxclient.find({ipAddress:myIp}, function(err, data){
      // myIp = "10.10.20.181";
      if(!data || data.length ==0){
          cmxloc = locService.location2Json(myIp);
          if(!!cmxloc){
            logger.info('got cmx data from db: '+ cmxloc);
            res.send(cmxloc);
          }else{
            console.log("no cmx data found, search default one instead");
            var defaultIp = "10.10.20.181";
            var defaultMac = "00:00:2a:01:00:16";
            locationdb.cmxclient.findOne({ipAddress:defaultIp, macAddress: defaultMac}, function(err, data){
              if (!! data) {
                res.send(data);
                logger.info("got default location from db");
              }else{
                  locService.location2Json(defaultIp, function(cmxloc){
                  logger.info("got default location from cmx");
                  res.send(cmxloc);
                  locationdb.cmxclient.save(cmxloc, function(err, result){
                    logger.info("saved default data from cmx: "+ result);
                });
              });
              }
            });  
          }              
      }
  });
  next();
});

server.get('/maps', function(req, res, next){
  mapdb.cmxmap.find(function(err, data){
    // console.log(data);
    res.send(data);
    return next();
  });
});


server.get('/maps/:campus/:building', function(req, res, next){
  var buildings =[];
  var floors=[];
  var campusParam = req.params.campus;
  var buildingParam = req.params.building;

  mapdb.cmxmap.find({name:{ $regex: new RegExp("^" + campusParam, "i") }}, function(err,data){
    for (var i = 0; i<data.length; i++) {
      buildings = buildings.concat(data[i].building);
    };

    for (var j = 0; j<buildings.length; j++) {
      var bu = buildings[j];
      if (buildingParam.toUpperCase() === bu.name.toUpperCase()) {
        floors =floors.concat(buildings[j].floor);
      };
    };
    res.send(floors);
    return next();
  }); 
});

server.get(/.*/, restify.serveStatic({
    'directory': 'public',
    'default': 'index.html'
 }));


// server.get('/regisiter/guest', function (req, res, next) {
//   res.send(req.connection.remoteAddress);
//   return next();
// });

// var wsServer = new WebSocketServer({
// 	httpServer: server,
// 	autoAcceptConnections: false
// });

// function originIsAllowed(origin) {
//   // put logic here to detect whether the specified origin is allowed.
//   return true;
// }

// wsServer.on('request', function(request){
// 	 if (!originIsAllowed(request.origin)) {
//       // Make sure we only accept requests from an allowed origin
//       request.reject();
//       console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
//       return;
//     }

//      var connection = request.accept('echo-protocol', request.origin);
//      console.log((new Date()) + ' Connection accepted.');
//      connection.on('message', function(message){
//      	if (message.type === 'utf8') {
//             console.log('Received Message: ' + message.utf8Data);
//             connection.sendUTF(message.utf8Data);
//         }
//         else if (message.type === 'binary') {
//             console.log('Received Binary Message of ' + message.binaryData.length + ' bytes');
//             connection.sendBytes(message.binaryData);
//         }	
//      });
//      connection.on('close', function(reasonCode, description) {
//         console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
//     });

// });
