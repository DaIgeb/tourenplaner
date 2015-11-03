import * as React from 'react';
import {Link, History} from 'react-router';
import * as routerDefault from 'react-router';
import flux from 'control';
import {restaurantStore} from 'stores/RestaurantStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantActions";
import {IRestaurant, IRestaurantTimeline, IDateRange} from "models/Restaurant";
import Button from 'Button/Button';
import {IBusinessHour} from "../models/Restaurant";

class Restaurant extends React.Component<IRestaurantProps, IRestaurantState> {
    constructor(props:IRestaurantProps) {
        super(props);
    }

    public render() {

        var detailData = this
            .props
            .restaurant
            .data
            .find((detail:IRestaurantTimeline) => this.dateRangeMatches(detail));
        var businessHours = detailData.businessHours.map((hrs:IBusinessHour, index:number) => {
            var content = `${hrs.weekday} ${this.pad(hrs.from.hour, 2)}:${this.pad(hrs.from.minute, 2)}-${this.pad(hrs.until.hour, 2)}:${this.pad(hrs.until.minute, 2)}`;
            return (
                [<span key={index}>{content}</span>,
                <br/>]
            );
        });
        return (
            <div className="row">
                <span className="col-md-1">
                    {this.props.restaurant.name}
                </span>
                <span className="col-md-2">
                    {this.props.restaurant.address}
                    <br/>
                    {this.props.restaurant.zipCode} {this.props.restaurant.city}
                    <br/>
                    {this.props.restaurant.location.lat}/{this.props.restaurant.location.long}
                </span>
                <span className="col-md-5">
                    {detailData.phone}
                    <br/>
                    {detailData.notes}
                </span>
                <span className="col-md-2">
                    {businessHours}
                </span>
                <span className="col-md-2">
                    <Link className="btn btn-primary btn-sm" to={`restaurants/${this.props.restaurant.id}`}
                          aria-label="Right Align">
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </Link>
                    <button type="abort" className="btn btn-danger btn-sm" aria-label="Right Align"
                            onClick={this.removeRestaurant}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </span>
            </div>
        );
    }

    private pad = (num: number, size: number) : string => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
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

        window.location.hash = `restaurants/${restaurant.id}`;
    };

    removeRestaurant = (evt:any)=> {
        this.props.onRemove(this.props.restaurant);
    };

    private dateRangeMatches = (range:IDateRange):boolean => {
        if (!range.from || range.from <= this.props.detailsDate) {
            if (!range.until || range.until >= this.props.detailsDate) {
                return true;
            }
        }

        return false;
    }
}

interface IRestaurantState {
}
interface IRestaurantProps extends React.Props<Restaurant> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    onRemove: (restaurant:IRestaurant) => void;
    restaurant: IRestaurant;
    detailsDate: Date;
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
            (<Restaurant key={i} restaurant={restaurant} onRemove={this.removeRestaurant}
                         detailsDate={new Date(2012,1,1)}/>)
        );

        //var newRestaurant = (<Restaurant key="new" restaurant={emptyRestaurant} onRemove={undefined} detailsDate={new Date(2012,1,1)}/>);
        return (
            <div className="table table-striped table-hover">
                <div className="row">
                    <h4 className="col-md-1">Name</h4>
                    <h4 className="col-md-2">Anschrift<br/>Koordinaten</h4>
                    <h4 className="col-md-5">Telefon<br/>Notizen</h4>
                    <h4 className="col-md-2">Öffnungszeiten</h4>
                </div>
                {restaurants}
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