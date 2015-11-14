import * as fs from 'fs';
import {MyRequestObject} from '../model';
import * as express from 'express';
import {moment} from 'utils/moment';
import {reviveDates} from '../../utils';
import {IRestaurant} from 'models/Restaurant';

export var router = express.Router();


const filename = 'data/restaurant.json';
let restaurants = fs.readFileSync(filename, 'utf8');
const data:IRestaurant[] = JSON.parse(restaurants, reviveDates);

router.get('/', (req:express.Request, res:express.Response, next:Function):any => {
    res.json(data);
});

router.put('/:id', (req:express.Request, res:express.Response, next:Function):any => {
    console.log(req.body);
    data.splice(data.findIndex(i => i.id === req.body.id));
    data.push(req.body);
    res.json(data);
});

router.post('/', (req:express.Request, res:express.Response, next:Function):any => {
    console.log(req.body);
    data.push(req.body);
    fs.writeFile(filename, JSON.stringify(data, null, 2));
    res.json(data);
});