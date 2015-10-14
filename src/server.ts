import fs = require('fs');
import path = require('path');
import express = require('express');
import http = require('http');
import bodyParser = require('body-parser');
import utils = require('./utils');
import swaggerize = require('swaggerize-express');

var app = express();
var server = http.createServer(app);

app.set('port', (process.env.PORT || 3000));
app.set('host', (process.env.HOST || '127.0.0.1'));

app.use(bodyParser.json({receiver: utils.reviveDates}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(swaggerize({
    api: require('./api.json'),
    docspath: '/api-docs',
    handlers: './handlers'
}));

app.use('/swagger', express.static(__dirname + '/swagger'));
app.use('/client', express.static(__dirname + '/client'));

server.listen(app.get('port'), app.get('host'), function () {
    (<any>app).swagger.api.host = server.address().address + ':' + server.address().port;
    console.log('Server started: http://' + server.address().address + ':' + server.address().port + '/');
    console.log((<any>app).mountpath);
});
