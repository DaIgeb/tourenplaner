import * as React from 'react';
import flux from 'control';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantActions";
import {IRestaurant} from "models/Restaurant";
import Restaurant from "Restaurant/Restaurant"
import Button from 'Button/Button';


class RestaurantList extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
    }

    render(): JSX.Element {
        if (this.props.errorMessage) {
            return (
                <div>{this.props.errorMessage}</div>
            )
        }

        if (restaurantStore.isLoading()) {
            return (<div><img src="ajax-loader.gif"/></div>);
        }

        let locations = this.props.restaurants.map((restaurant:IRestaurant, i:number) =>
            (<Restaurant key={i} restaurant={restaurant} onRemove={this.removeRestaurant}/>)
        );

        return (<tbody>{locations}</tbody>);
    }

    removeRestaurant = (restaurant:IRestaurant)=> {
        RestaurantActions.deleteRestaurant(restaurant);
    };
}

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
        let restaurants : JSX.Element[];
        if (this.props && !restaurantStore.isLoading()) {
            restaurants = this.props.restaurants.map((restaurant:IRestaurant, i:number) =>
                (<Restaurant key={i} restaurant={restaurant} onRemove={this.removeRestaurant}/>)
            );
        }

        return (
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th className="col-md-2">Ortschaft</th>
                        <th className="col-md-2">Name</th>
                        <th className="col-md-2">Telefonnummer</th>
                        <th className="col-md-4">Bemerkungen</th>
                        <th className="col-md-1"></th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants}
                    <tr>
                        <td colSpan={4}></td>
                        <td>
                            <Button className="btn btn-success btn-sm" attributes='{aria-label="Left Align"}'
                                    onClick={this.saveRestaurant}>
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        );
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

export default connectToStores(Restaurants);