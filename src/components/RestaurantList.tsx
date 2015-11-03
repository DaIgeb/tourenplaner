import * as React from 'react';
import {Link, History} from 'react-router';
import * as routerDefault from 'react-router';
import flux from 'control';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantActions";
import {IRestaurant} from "models/Restaurant";
import Button from 'Button/Button';

class Restaurant extends React.Component<IRestaurantProps, IRestaurantState> {
    constructor(props:IRestaurantProps) {
        super(props);
    }

    public render() {
        if (this.props.restaurant.id) {
            return (
                <div className="row">
                    <fieldset className="col-md-2">
                        <input className="form-control" type="text" id="city" value={this.props.restaurant.zipCode + " " +this.props.restaurant.city} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <input className="form-control" type="text" id="name" value={this.props.restaurant.name} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <input className="form-control" type="text" id="address" value={this.props.restaurant.address} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <input className="form-control" type="text" id="location" value={this.props.restaurant.location.lat + "/" +this.props.restaurant.location.long} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <Link className="btn btn-primary btn-sm" to={`restaurants/${this.props.restaurant.id}`} aria-label="Left Align">
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </Link>
                        <button type="abort" className="btn btn-danger btn-sm" aria-label="Left Align"
                                onClick={this.removeRestaurant}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                    </fieldset>
                </div>
            );
        } else {
            return (
                <form className="row" onSubmit={this.createNewRestaurant}>
                    <fieldset className="col-md-2">
                        <label htmlFor="city">Ortschaft</label>
                        <input className="form-control" type="text" ref="city" value={this.props.restaurant.zipCode + " " +this.props.restaurant.city} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" type="text" ref="name" value={this.props.restaurant.name} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <label htmlFor="address">Adresse</label>
                        <input className="form-control" type="text" ref="address" value={this.props.restaurant.address} readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <label htmlFor="location">Koordinaten</label>
                        <input className="form-control" type="text" ref="location" value="" readOnly/>
                    </fieldset>
                    <fieldset className="col-md-2">
                        <button type="submit" >Save</button>
                        <Link className="btn btn-primary btn-sm" to={`restaurants/${this.props.restaurant.id}`} aria-label="Left Align" >
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </Link>
                        <button type="abort" className="btn btn-danger btn-sm" aria-label="Left Align"
                                onClick={this.removeRestaurant}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                    </fieldset>
                </form>
            );
        }
    }

    createNewRestaurant = (evt:any)=> {
alert("new");
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

        window.history.pushState(undefined, 'Restaurant', `restaurants/${restaurant.id}`);
    };

    removeRestaurant = (evt:any)=> {
        this.props.onRemove(this.props.restaurant);
    };
}

interface IRestaurantState {
}
interface IRestaurantProps extends React.Props<Restaurant> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    onRemove: (restaurant:IRestaurant) => void;
    restaurant: IRestaurant;
    key: number | string;
}

const emptyRestaurant:IRestaurant = {
    name: undefined,
    address: undefined,
    zipCode: undefined,
    city: undefined,
    location: undefined,
    data: []
};

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

    render():JSX.Element {
        if (this.props.errorMessage) {
            return (
                <div>{this.props.errorMessage}</div>
            )
        }

        if (restaurantStore.isLoading()) {
            return (<div>
                <img src="ajax-loader.gif"/>
            </div>);
        }

        let restaurants = this.props.restaurants.map((restaurant:IRestaurant, i:number) =>
            (<Restaurant key={i} restaurant={restaurant} onRemove={this.removeRestaurant}/>)
        );

        return (
            <div className="table table-striped table-hover">
                <div className="row">
                    <h3 className="col-md-2">Ortschaft</h3>
                    <h3 className="col-md-2">Telefonnummer</h3>
                    <h3 className="col-md-2">Name</h3>
                    <h3 className="col-md-4">Bemerkungen</h3>
                    <h3 className="col-md-1"></h3>
                </div>
                {restaurants}
                <Restaurant key="new" restaurant={emptyRestaurant} onRemove={undefined}/>
            </div>);
    }

    removeRestaurant = (restaurant:IRestaurant)=> {
        if (confirm("Do you really want to delete the restaurant?")) {
            RestaurantActions.deleteRestaurant(restaurant);
        }
    };

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
export default connectToStores(RestaurantList);