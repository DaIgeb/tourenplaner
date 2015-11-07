import * as React from 'react';
import {Link} from 'react-router';
import {restaurantsStore } from 'stores/RestaurantsStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantsActions} from "actions/RestaurantsActions";
import {IRestaurant} from "models/Restaurant";
import Button from 'Button/Button';

function getState():{restaurant: IRestaurant} {
    return {
        restaurant: restaurantsStore.getState().selectedRestaurant
    }
}

class Restaurant extends React.Component<any, {restaurant: IRestaurant, restaurants?: Array<IRestaurant>}> {
    state:{restaurant: IRestaurant, restaurants?: Array<IRestaurant>} = {restaurant: null};
    private currentId:number = null;

    constructor(props:any) {
        super(props);

        this.state = getState();

        let id = props.params.id === "new" ? -1 : parseInt(props.params.id);
        RestaurantsActions.restaurantSelected(id);
    }

    static getStores(props:any) {
        return [restaurantsStore];
    }

    static getPropsFromStores(props:any) {
        return restaurantsStore.getState();
    }

    componentDidMount() {
        restaurantsStore.fetchRestaurants();
    }

    render():JSX.Element {
        let id = this.props.params.id === "new" ? -1 : parseInt(this.props.params.id);
        {
        }
        if (this.currentId !== id) {
            this.currentId = id;
            RestaurantsActions.restaurantSelected(id);
        }

        let restaurant = getState().restaurant;
        if (restaurant) {
            return (<form className="row" onSubmit={this.saveRestaurant}>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" className="form-control" ref="name" value={restaurant.name}
                           onChange={this.updateName}/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Adresse</label>
                    <input id="address" type="text" className="form-control" ref="address" value={restaurant.address}
                           onChange={this.updateAddress}/>
                </div>
                <div className="form-group">
                    <label htmlFor="city">Ortschaft</label>
                    <input id="city" type="text" className="form-control" ref="city" value={restaurant.city}
                           onChange={this.updateCity}/>
                </div>
                <Button type="submit" className="btn btn-default">Speichern</Button>
            </form>);
        }
        return (<div>Not Found</div>);
    }

    updateName = (evt:any):void  => {
        var name = evt.target.value;
        getState().restaurant.name = name;
        this.setState(getState());
    };

    updateAddress = (evt:any):void => {
        var name = evt.target.value;
        getState().restaurant.address = name;
        this.setState(getState());
    };

    updateCity = (evt:any):void => {
        var name = evt.target.value;
        getState().restaurant.city = name;
        this.setState(getState());
    };

    saveRestaurant = (evt:any)=> {
        RestaurantsActions.add(getState().restaurant);
        evt.preventDefault();
    };
}

export default connectToStores(Restaurant);