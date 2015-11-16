import * as fs from 'fs';
import {MyRequestObject} from '../model';
import * as express from 'express';
import {moment} from 'utils/moment';
import {router as tourStartRouter} from './tourstarts';

import {ITourDataModel} from 'models/Tour';
import {DataListHandler} from '../DataListHandler';

export var router = express.Router();

const handler = new DataListHandler<ITourDataModel>('data/tour.json');

router.use('/starts', tourStartRouter);

router.get('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.getData());
});

router.put('/:id', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.update(req.params.id, req.body));
});

router.delete('/:id', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.delete(req.params.id));
});

router.post('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(handler.add(<ITourDataModel>req.body));
});
