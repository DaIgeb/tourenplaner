import * as fs from 'fs';
import {MyRequestObject} from '../model';
import * as express from 'express';
import {moment} from 'utils/moment';

import {IRestaurantDataModel} from 'models/Restaurant';
import {DataListHandler} from '../DataListHandler';

export var router = express.Router();

const handler = new DataListHandler<IRestaurantDataModel>('data/restaurant.json');

router.get('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.getData());
});

router.put('/:id', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.update(parseInt(req.params.id), req.body));
});

router.delete('/:id', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.delete(parseInt(req.params.id)));
});

router.post('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.add(<IRestaurantDataModel>req.body));
});
