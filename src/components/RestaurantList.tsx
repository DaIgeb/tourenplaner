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
export default RestaurantList;