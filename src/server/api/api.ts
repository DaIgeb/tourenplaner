import {MyRequestObject} from '../model';
import * as express from 'express';
import {router as restaurantRouter} from './restaurants';

export var router = express.Router();

router.use('/restaurants', restaurantRouter);