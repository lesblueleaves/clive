var restify = require('restify')

var server = restify.createServer({ name: 'clive' })

server.use(restify.acceptParser(server.acceptable));
server.use(restify.queryParser());
server.use(restify.bodyParser());

server.get('/regisiter/guest', function (req, res, next) {
  res.send(req.connection.remoteAddress);
  return next();
});

server.get('/echo/:name', function (req, res, next) {
  res.send(req.params);
  return next();
});
 
server.listen(9797, function () {
  console.log('%s listening at %s', server.name, server.url)
})