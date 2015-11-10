'use strict';

import * as fs from 'fs';
import * as path from 'path';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as utils from './utils';
import {MyRequestObject} from 'model';
import {router as apiRouter} from './api/api';
//import {router as restaurantsRouter} from './api/restaurants';

var app = (<any>express).default();
var server = http.createServer(app);

app.set('port', (process.env.PORT || 3000));
app.set('host', (process.env.HOST || '127.0.0.1'));

app.use((<any>logger).default('dev'));
app.use(bodyParser.json({receiver: utils.reviveDates}));
app.use(bodyParser.urlencoded({extended: true}));

app.use(function (req:MyRequestObject, res:express.Response, next:Function) {
    // Set global available params
    // http://cwbuecheler.com/web/tutorials/2014/restful-web-app-node-express-mongodb/
    req.db = "foobar";

    next();
});
//app.use('/restaurants', restaurantsRouter);
app.use('/api', apiRouter);
app.use('/public', express.static(path.join('.', 'public')));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err:any, req:express.Request, res:express.Response, next:Function) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err:any, req:express.Request, res:express.Response, next:Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), app.get('host'), function () {
    let serverAddress = server.address().address + ':' + server.address().port;
    console.log('Server started: http://' + server.address().address + ':' + server.address().port + '/');
    console.log((<any>app).mountpath);
});
