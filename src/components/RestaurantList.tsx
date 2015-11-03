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

    static getStores(props:any) {
        return [restaurantStore];
    }

    static getPropsFromStores(props:any) {
        return restaurantStore.getState();
    }

    componentDidMount() {
        restaurantStore.fetchRestaurants();
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
                <tbody>{locations}<tr>
                    <td colSpan={4}></td>
                    <td>
                        <Button className="btn btn-success btn-sm" attributes='{aria-label="Left Align"}'
                                onClick={this.saveRestaurant}>
                            <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                        </Button>
                    </td>
                </tr>
                </tbody>
            </table>);
    }

    removeRestaurant = (restaurant:IRestaurant)=> {
        RestaurantActions.deleteRestaurant(restaurant);
    };


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
export default connectToStores(RestaurantList);