import * as React from 'react';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';

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
        if (this.props && !restaurantStore.isLoading()) {
            var restaurant = restaurantStore.getRestaurant(parseInt(this.props.params.id));
            if (restaurant)
                return (
                    <div>{restaurant.name}</div>
                )
        }

        return (<div>Not Found</div>);
    }
}

export default connectToStores(Restaurant);