import * as React from 'react';
import {Link} from 'react-router';
import {restaurantsStore } from 'stores/RestaurantsStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantsActions} from "actions/RestaurantsActions";
import {IRestaurant, IRestaurantTimeline, IBusinessHour} from "models/Restaurant";
import {ILocation} from "models/Core";
import {Button, Row, Column} from 'Bootstrap/Bootstrap';
import {RestaurantTimeline} from './RestaurantTimeline'
import {moment} from 'utils/moment';

interface IRestaurantProps extends React.Props<Restaurant> {
    restaurants: IRestaurant[];
    params: {id: string}
}

interface IInputProps<TValue> extends React.Props<any> {
    value: TValue;
    parse: (value:string) => TValue;
    toString: (value:TValue) => string;
    state: InputValueState;
}
enum InputValueState {
    Unchanged,
    Warning,
    Error,
    Success
}

class StringInputValue implements IInputProps<string> {
    constructor(public value:string, public state:InputValueState) {
    }

    parse = (value:string)=> {
        return value
    };

    toString(value:string) {
        return value;
    }
}

interface IState {
    loading: boolean;
    invalidId: boolean;
    name: IInputProps<string>;
    address: string;
    zipCode: string;
    city: string;
    location: ILocation,
    timelines: IRestaurantTimeline[]
}

class Restaurant extends React.Component<IRestaurantProps, IState> {
    constructor(props:any) {
        super(props);
        this.state = {
            loading: true,
            invalidId: true,
            name: null,
            address: null,
            zipCode: null,
            city: null,
            location: null,
            timelines: []
        };

        this.state = this.loadRestaurant(props);
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

    componentWillReceiveProps(nextProps:IRestaurantProps, nextContext:any) {
        let state = this.loadRestaurant(nextProps);
        this.setState(state);
    }

    render():JSX.Element {
        let state = this.state;
        if (state.loading) {
            return (<div>Loading</div>);
        } else if (state.invalidId) {
            return (<div>Not Found</div>);
        } else {
            let location = state.location;
            let longStr = location.long ? location.long.toFixed(6) : "0.000000";
            let latStr = location.lat ? location.lat.toFixed(6) : "0.000000";
            return (<Row>
                <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" type="text" className="form-control" ref="name"
                           value={state.name.toString(state.name.value)}
                           onChange={this.updateName}/>
                </div>
                <div className="form-group">
                    <label htmlFor="address">Adresse</label>
                    <input id="address" type="text" className="form-control" ref="address" value={state.address}
                           onChange={this.updateAddress}/>
                </div>
                <div className="form-group">
                    <Row>
                        <Column size={2}>
                            <label htmlFor="zipCode">Postleitzahl</label>
                            <input id="zipCode" type="text" className="form-control" ref="zipCode"
                                   value={state.zipCode}
                                   onChange={this.updateZipCode}/>
                        </Column>
                        <Column size={10}>
                            <label htmlFor="city">Ortschaft</label>
                            <input id="city" type="text" className="form-control" ref="city" value={state.city}
                                   onChange={this.updateCity}/>
                        </Column>
                    </Row>
                </div>
                <div className="form-group">
                    <label htmlFor="city">Position</label>
                    <Row>
                        <Column size={6}>
                            <div className="input-group">
                                <span className="input-group-addon">Breite</span>
                                <input id="city" type="number" className="form-control" ref="city" step="0.000001"
                                       value={latStr}
                                       onChange={this.updateLocationLat}/>
                            </div>
                        </Column>
                        <Column size={6}>
                            <div className="input-group">
                                <span className="input-group-addon">Länge</span>
                                <input id="city" type="number" className="form-control" ref="city" step="0.000001"
                                       value={longStr}
                                       onChange={this.updateLocationLong}/>
                            </div>
                        </Column>
                    </Row>
                </div>
                <RestaurantTimeline timelines={state.timelines} addTimeline={this.addTimeline}/>

                <Button type="submit" className="btn btn-default" onClick={this.saveRestaurant}>
                    Speichern
                </Button>
            </Row>);
        }
    }

    private loadRestaurant = (newProps:IRestaurantProps):IState => {
        let stateUpdateNeeded = false;

        if (this.currentIdParam !== newProps.params.id) {
            stateUpdateNeeded = true;
            this.isNew = newProps.params.id === "new";
            this.Id = this.isNew ? -1 : parseInt(newProps.params.id);
        }

        let state = this.state;
        if (stateUpdateNeeded) {
            state.loading = true;
            state.invalidId = true;
            state.name = new StringInputValue(null, InputValueState.Unchanged);
            state.address = null;
            state.zipCode = null;
            state.city = null;
            state.location = {lat: null, long: null};
            state.timelines = [];

            if (this.isNew) {
                state.loading = false;
                state.invalidId = false;
            } else if (newProps.restaurants) {
                state.loading = false;
                let restaurant = newProps.restaurants.find(r => r.id === this.Id);
                if (restaurant) {
                    state.invalidId = false;
                    state.name.value = state.name.parse(restaurant.name);
                    state.address = restaurant.address;
                    state.zipCode = restaurant.zipCode;
                    state.city = restaurant.city;
                    state.location = restaurant.location;
                    state.timelines = restaurant.timelines;
                }
            }
        }

        return state;
    };

    private addTimeline = (evt:any):void  => {
        let timelines:Array<IRestaurantTimeline> = this.state.timelines;
        if (timelines.length > 0) {
            let timeline:IRestaurantTimeline = timelines[timelines.length - 1];
            let businessHours:Array<IBusinessHour> = timeline.businessHours.slice(0);
            timelines.push({
                phone: timeline.phone,
                notes: timeline.notes,
                from: moment(),
                until: null,
                businessHours: businessHours
            });
            timeline.until = moment();
        }
        else {
            timelines.push({
                phone: null,
                notes: null,
                from: moment(),
                until: null,
                businessHours: []
            });
        }
        this.setState(this.state);
    };

    private updateName = (evt:any):void  => {
        this.state.name.value = this.state.name.parse(evt.target.value);
        this.state.name.state = InputValueState.Success;
        this.setState(this.state);
    };

    private updateAddress = (evt:any):void => {
        var name = evt.target.value;
        this.state.address = name;
        this.setState(this.state);
    };

    private updateCity = (evt:any):void => {
        var name = evt.target.value;
        this.state.city = name;
        this.setState(this.state);
    };

    private updateZipCode = (evt:any):void => {
        var name = evt.target.value;
        this.state.zipCode = name;
        this.setState(this.state);
    };

    private updateLocationLat = (evt:any):void => {
        var name = evt.target.value;
        this.state.location.lat = parseFloat(name);
        this.setState(this.state);
    };

    private updateLocationLong = (evt:any):void => {
        var name = evt.target.value;
        this.state.location.long = parseFloat(name);
        this.setState(this.state);
    };

    private saveRestaurant = (evt:any)=> {
        // TODO apply state
        let restaurant:IRestaurant = {
            id: this.Id,
            name: this.state.name.value,
            address: this.state.address,
            city: this.state.city,
            zipCode: this.state.zipCode,
            location: this.state.location,
            timelines: this.state.timelines
        };
        if (this.isNew) {
            RestaurantsActions.add(restaurant);
        } else {
            RestaurantsActions.saveRestaurant(restaurant);
        }
        evt.preventDefault();
    };

    private currentIdParam:string = null;
    private Id:number;
    private isNew:boolean;
}

export default connectToStores(Restaurant);