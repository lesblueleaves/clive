var assert = require('assert');
var restify = require('restify');
var WebSocketClient = require('websocket').client;

var client = restify.createJsonClient({
  url: 'http://localhost:9797',
  version: '~1.0'
});

client.get('/echo/mark', function (err, req, res, obj) {
  assert.ifError(err);
  console.log('Server returned: %j', obj);
});

var clientWs = new WebSocketClient();

clientWs.on('connectFailed', function(error){
	console.log('Connect Error: ' + error.toString());
});

clientWs.on('connect', function(connection){
	console.log('WebSocket Client Connected');
	connection.on('error', function(error){
		console.log("Connection Error: " + error.toString());
	});
	connection.on('close', function(){
		console.log('echo-protocol Connection Closed');
	});
	connection.on('message', function(message){
		if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
	});

	function sendNumber(){
		if(connection.connected){
			var number = Math.round(Math.random() * 0xFFFFFF);
            connection.sendUTF(number.toString());
            setTimeout(sendNumber, 1000);
		}
	}
	sendNumber();
});

clientWs.connect('ws://localhost:9696/', 'echo-protocol');