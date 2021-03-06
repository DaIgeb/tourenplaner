import * as React from 'react';

// Bootstrapping module
import './seasons.less';
import {HistoryLocation } from 'react-router';
import * as Router2 from 'react-router';
import * as ReactDom from 'react-dom';
//import default as Router2 from 'react-router';
import routes from 'shared/routes';

var uncastedRouter:any = Router2;
var Router:React.ComponentClass<any> = uncastedRouter.Router;

ReactDom.render(<Router history={Router2.HistoryLocation}>{routes}</Router>, document.getElementById('content'));
