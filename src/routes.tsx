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
import Restaurants from 'components/Restaurant/Restaurants';
import RestaurantList from 'components/Restaurant/RestaurantList';
import Restaurant from 'components/Restaurant/Restaurant';
import {actions as RestaurantsActions} from "actions/RestaurantsActions";

const routes = (
    <Route path="/" component={App}>
        <Route path='restaurants' component={Restaurants}>
            <IndexRoute component={RestaurantList}/>
            <Route path=":id" component={Restaurant}/>
        </Route>
    </Route>
);

export default routes;