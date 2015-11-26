import validator from 'is-my-json-valid';

import {schema} from '../../schema/index';

const {location: locationSchema, ...ext} = schema;

export const validate = validator(locationSchema, {
  schemas: ext,
  verbose: true
});
