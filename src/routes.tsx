/*
 import './seasons.less';
 import * as React from 'react';
 import * as rDom from 'react-dom';
 import {default as App, IAppState} from './client/components/App/App';

 var index = '<!DOCTYPE html><html><head></head><body>{{component}}</body></html>';

 var appState : IAppState = {
 applicationName: "Tourenplaner Server",
 fluid: true,
 currentTabId: "Foobar"
 };
 var app;

 app.get('/', function (req, res) {
 var componentHtml = React.renderToString(App({state: appState}));
 var html = index.replace('{{component}}', componentHtml);
 res.type('html');
 res.send(html);
 });*/

import * as React from 'react';
import {Route} from 'react-router';

import Main from 'components/Main';
import Example from 'components/Example';

const routes = (
    <Route handler={Main}>
        <Route name='example' handler={Example}/>
    </Route>
);

export default routes;