import * as React from 'react';
import {IRestaurant} from "models/Restaurant";

class Restaurants extends React.Component<IRestaurantsProps, IRestaurantsState> {
    constructor(props:IRestaurantsProps) {
        super(props);
    }

    render() {
        return (<div>{this.props.children}</div>);
    }
}

export interface IRestaurantsProps extends React.Props<Restaurants> {
    restaurants?: Array<IRestaurant>;
}

export interface IRestaurantsState {
    //tours: Array<IRestaurant>;
}

export default Restaurants;