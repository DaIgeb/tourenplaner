import * as React from 'react';
import flux from 'control';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantActions";
import {IRestaurant} from "models/Restaurant";
import Restaurant from "Restaurant/Restaurant"
import Button from 'Button/Button';

//@connectToStores
class Restaurants extends React.Component<IRestaurantsProps, IRestaurantsState> {
    constructor(props:IRestaurantsProps) {
        super(props);
    }

    static getStores(props:IRestaurantsProps) {
        return [restaurantStore];
    }

    static getPropsFromStores(props:IRestaurantsProps) {
        return restaurantStore.getState();
    }

    componentDidMount() {
        restaurantStore.fetchRestaurants();
    }

    removeRestaurant = (restaurant:IRestaurant)=> {
        RestaurantActions.deleteRestaurant(restaurant);
    };

    render() {
        return (<div>{this.props.children}</div>);
    }

    saveRestaurant = (evt:any)=> {
        var restaurant:IRestaurant = evt.target.value;
        restaurant = {
            key: 4,
            location: "Ossingen",
            name: "Hirschen",
            phone: "052 722 12 34",
            notes: "Dienstags Ruhetag"
        };
        if (!this.state) {
            //this.setState({restaurants: [restaurant]});
        }
        else {
            //this.state.restaurants.push(restaurant);
        }
        RestaurantActions.add(restaurant);
        evt.preventDefault();
    };
}

export interface IRestaurantsProps extends React.Props<Restaurants> {
    restaurants?: Array<IRestaurant>;
}

export interface IRestaurantsState {
    //restaurants: Array<IRestaurant>;
}

export default Restaurants;