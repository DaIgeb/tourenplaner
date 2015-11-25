import validator from 'is-my-json-valid';

import {schema} from '../../schema/index';

const {restaurant: restaurantSchema, ...ext} = schema;

export const validate = validator(restaurantSchema, {
  schemas: ext,
  verbose: true
});
