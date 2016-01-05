import validator from 'is-my-json-valid';

import {schema} from '../../schema/index';

const {tour: currentSchema, ...ext} = schema;

export const validate = validator(currentSchema, {
  schemas: ext,
  verbose: true
});
