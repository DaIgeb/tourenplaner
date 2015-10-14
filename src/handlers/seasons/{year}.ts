'use strict';

import express = require('express');
import utils = require('../../utils');
import Repository = require('../../Repository/FileRepository');
var repository = new Repository();

//noinspection JSUnusedGlobalSymbols
export var get = function (req:express.Request, res:express.Response) {
    repository.getSeason(req.params['year'], req.params['version'], utils.getCallback(res));
};
//noinspection JSUnusedGlobalSymbols
export var post = function (req:express.Request, res:express.Response) {
    repository.addSeason(req.body, utils.postCallback(res));
};
