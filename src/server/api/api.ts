import * as express from 'express';
import {router as restaurantRouter} from './restaurants';
import {router as tourRouter} from './tours';

export var router = express.Router();

router.use('/restaurants', restaurantRouter);
router.use('/tours', tourRouter);