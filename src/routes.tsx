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
import {Route, IndexRoute} from 'react-router';

import App from 'components/App/App';
import Example from 'components/Example';
import Restaurants from 'components/Restaurants';
import RestaurantList from 'components/RestaurantList';
import Restaurant from 'components/Restaurant';

const routes = (
    <Route path="/" component={App}>
        <Route path='about' component={Example}/>
        <Route path='contact' component={Restaurants}/>
        <Route path='restaurants' component={Restaurants}>
            <IndexRoute component={RestaurantList}/>
            <Route path=":id" component={Restaurant} />
        </Route>
    </Route>
);

export default routes;