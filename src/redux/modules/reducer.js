import { combineReducers } from 'redux';
import multireducer from 'multireducer';
import { routerStateReducer } from 'redux-router';

import auth from './auth';
import counter from './counter';
import {reducer as form} from 'redux-form';
import info from './info';
import widgets from './widgets';
import restaurants from './restaurants';
import seasons from './seasons';
import locations from './locations';
import configurations from './configurations';
import tours from './tours';

export default combineReducers({
  router: routerStateReducer,
  auth,
  form,
  configurations,
  tours,
  multireducer: multireducer({
    counter1: counter,
    counter2: counter,
    counter3: counter
  }),
  info,
  widgets,
  restaurants,
  locations,
  seasons
});
