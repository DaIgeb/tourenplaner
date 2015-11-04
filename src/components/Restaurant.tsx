import * as React from 'react';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantActions";
import {IRestaurant} from "models/Restaurant";

class Restaurant extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
    }

    static getStores(props:any) {
        return [restaurantStore];
    }

    static getPropsFromStores(props:any) {
        return restaurantStore.getState();
    }

    componentDidMount() {
        restaurantStore.fetchRestaurants();
    }

    render():JSX.Element {
        let restaurant:IRestaurant;
        if (this.props.params.id === "new") {
            restaurant = {
                name: undefined,
                address: undefined,
                zipCode: undefined,
                city: undefined,
                location: {long: undefined, lat: undefined},
                data: []
            };
        } else if (this.props && !restaurantStore.isLoading()) {
            restaurant = restaurantStore.getRestaurant(parseInt(this.props.params.id));
        }

        if (restaurant) {
            //this.setState({restaurant: restaurant});
            return (<form className="row" onSubmit={this.saveRestaurant}>
                <input ref="name"/>
                {restaurant.name}</form>);
        }
        return (<div>Not Found</div>);
    }


    saveRestaurant = (evt:any)=> {
        var restaurant:IRestaurant = evt.target.value;
        restaurant = {
            name: "Hirschen",
            address: "Foostreet",
            zipCode: "123",
            city: "Ossingen",
            location: {
                long: 1,
                lat: 2
            },
            data: [
                {
                    businessHours: [],
                    phone: "052 722 12 34",
                    notes: "Dienstags Ruhetag",
                    from: new Date(),
                    until: new Date()
                }
            ]
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

export default connectToStores(Restaurant);