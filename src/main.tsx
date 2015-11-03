import * as React from 'react';

// Bootstrapping module
import './client/seasons.less';
import {HistoryLocation } from 'react-router';
import * as Router2 from 'react-router';
//import default as Router2 from 'react-router';
import routes from 'routes';

var uncastedRouter:any = Router2;
var Router:React.ComponentClass<any> = uncastedRouter.Router;

React.render(<Router history={Router2.HistoryLocation}>{routes}</Router>, document.getElementById('content'));
