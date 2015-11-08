import * as React from 'react';
import {Link} from 'react-router';
import {restaurantsStore } from 'stores/RestaurantsStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantsActions} from "actions/RestaurantsActions";
import {IRestaurant, IRestaurantTimeline, IBusinessHour} from "models/Restaurant";
import Button from 'Button/Button';
import {RestaurantTimeline} from './RestaurantTimeline'

interface IState {
    restaurant: IRestaurant;
}

function getState():IState {
    return {
        restaurant: restaurantsStore.getState().selectedRestaurant
    }
}

class Restaurant extends React.Component<any, IState> {
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
        if (this.currentId !== id) {
            this.currentId = id;
            RestaurantsActions.restaurantSelected(id);
        }
        let restaurant = getState().restaurant;

        if (restaurant) {
            let location = restaurant.location;
            let longStr = location.long ? location.long.toFixed(6) : "0.000000";
            let latStr = location.lat ? location.lat.toFixed(6) : "0.000000";
            return (<div className="row">
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
                    <div className="row">
                        <div className="col-md-2">
                            <label htmlFor="zipCode">Postleitzahl</label>
                            <input id="zipCode" type="text" className="form-control" ref="zipCode"
                                   value={restaurant.zipCode}
                                   onChange={this.updateZipCode}/>
                        </div>
                        <div className="col-md-10">
                            <label htmlFor="city">Ortschaft</label>
                            <input id="city" type="text" className="form-control" ref="city" value={restaurant.city}
                                   onChange={this.updateCity}/>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="city">Position</label>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-addon">Breite</span>
                                <input id="city" type="number" className="form-control" ref="city" step="0.000001"
                                       value={latStr}
                                       onChange={this.updateLocationLat}/>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-addon">Länge</span>
                                <input id="city" type="number" className="form-control" ref="city" step="0.000001"
                                       value={longStr}
                                       onChange={this.updateLocationLong}/>
                            </div>
                        </div>
                    </div>
                </div>
                <RestaurantTimeline timelines={restaurant.data} addTimeline={this.addTimeline}/>

                <Button type="submit" className="btn btn-default" onClick={this.saveRestaurant}>Speichern</Button>
            </div>);
        }
        return (<div>Not Found</div>);
    }

    addTimeline = (evt:any):void  => {
        let restaurant = getState().restaurant;
        let timelines: Array<IRestaurantTimeline> = restaurant.data;
        let timeline: IRestaurantTimeline = timelines[timelines.length - 1];
        let businessHours : Array<IBusinessHour>= timeline.businessHours.slice(0);

        timelines.push({
            phone: timeline.phone,
            notes: timeline.notes,
            from: new Date(),
            until: null,
            businessHours: businessHours
        });
        this.setState(getState());
    };
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

    updateZipCode = (evt:any):void => {
        var name = evt.target.value;
        getState().restaurant.zipCode = name;
        this.setState(getState());
    };

    updateLocationLat = (evt:any):void => {
        var name = evt.target.value;
        getState().restaurant.location.lat = parseFloat(name);
        this.setState(getState());
    };

    updateLocationLong = (evt:any):void => {
        var name = evt.target.value;
        getState().restaurant.location.long = parseFloat(name);
        this.setState(getState());
    };

    saveRestaurant = (evt:any)=> {
        RestaurantsActions.add(getState().restaurant);
        evt.preventDefault();
    };

    private currentId:number = null;
}

export default connectToStores(Restaurant);