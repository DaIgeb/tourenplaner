'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as utils from './utils';

console.log('Hello');
var app = (<any>express).default();
var server = http.createServer(app);

app.set('port', (process.env.PORT || 3000));
app.set('host', (process.env.HOST || '127.0.0.1'));

app.use(bodyParser.json({receiver: utils.reviveDates}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function(req: MyRequestObject, res: express.Response, next: Function){
    // Set global available params
    // http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/
    req.db = "foobar";
    next();
});
//app.use('/', routes);
//app.use('/users', users);
app.use('/public', express.static(__dirname + '/public'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err:any, req: express.Request, res: express.Response, next: Function) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err:any, req: express.Request, res: express.Response, next: Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), app.get('host'), function () {
    (<any>app).swagger.api.host = server.address().address + ':' + server.address().port;
    console.log('Server started: http://' + server.address().address + ':' + server.address().port + '/');
    console.log((<any>app).mountpath);
});

interface MyRequestObject extends express.Request{
    db: any;
}