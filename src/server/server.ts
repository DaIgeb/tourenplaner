'use strict';

import * as fs from 'fs';
import * as path from 'path';
import {Response, Request} from "express";
//import * as express from 'express';
import {createServer} from 'http';
import {json, urlencoded} from 'body-parser';
import {reviveDates} from './utils';
import {MyRequestObject} from 'model';
import {router as apiRouter} from './api/api';
var express = require('express');
var logger = require('morgan');

var app = express();
var server = createServer(app);

app.set('port', (process.env.PORT || 3000));
app.set('host', (process.env.HOST || '127.0.0.1'));

app.use(logger('dev'));
app.use(json({receiver: reviveDates}));
app.use(urlencoded({extended: true}));

app.use(function (req:MyRequestObject, res:Response, next:Function) {
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
    app.use(function (err:any, req:Request, res:Response, next:Function) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err:any, req:Request, res:Response, next:Function) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

server.listen(app.get('port'), app.get('host'), function () {
    console.log('Server started: http://' + server.address().address + ':' + server.address().port + '/');
    console.log((<any>app).mountpath);
});
