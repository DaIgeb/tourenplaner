import * as React from 'react';
import {Route, IndexRoute} from 'react-router';

import App from 'components/App/App';
import {Tours} from 'components/Tours/Tours'
import Tour from 'components/Tours/Tour'
import TourList from 'components/Tours/TourList'
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
        <Route path='tours' component={Tours}>
            <IndexRoute component={TourList}/>
            <Route path=":id" component={Tour}/>
        </Route>
    </Route>
);

export default routes;