import * as React from 'react';
import {Link, History} from 'react-router';
import * as routerDefault from 'react-router';
import {restaurantsStore} from 'stores/RestaurantsStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantsActions";
import {IRestaurant,IBusinessHour, IRestaurantTimeline} from "models/Restaurant";
import {IDateRange} from "models/Core";
import {Button} from 'Bootstrap/Bootstrap';
import {moment} from 'utils/moment';

class Restaurant extends React.Component<IRestaurantProps, IRestaurantState> {
    constructor(props:IRestaurantProps) {
        super(props);
    }

    private mapBusinessHours = (hrs: IBusinessHour, index: number) : JSX.Element => {
        var content = `${hrs.weekday} ${this.pad(hrs.from.hour, 2)}:${this.pad(hrs.from.minute, 2)}-${this.pad(hrs.until.hour, 2)}:${this.pad(hrs.until.minute, 2)}`;
        let result:any = (
            [<span key={index}>{content}</span>,
                <br/>]
        );
        return result;
    };

    public render() {

        let phone:string = null;
        let notes:string = null;
        let businessHours: Array<JSX.Element> = [];
        let detailData = this
            .props
            .restaurant
            .timelines
            .find((detail:IRestaurantTimeline) => this.dateRangeMatches(detail));


        if (detailData) {
            phone = detailData.phone;
            notes = detailData.notes;
            businessHours = detailData.businessHours.map(this.mapBusinessHours);
        }
        return (
            <tr>
                <td className="col-md-1">
                    {this.props.restaurant.name}
                </td>
                <td className="col-md-2">
                    {this.props.restaurant.address}
                    <br/>
                    {this.props.restaurant.zipCode} {this.props.restaurant.city}
                    <br/>
                    {this.props.restaurant.location.lat}/{this.props.restaurant.location.long}
                </td>
                <td className="col-md-5">
                    {phone}
                    <br/>
                    {notes}
                </td>
                <td className="col-md-2">
                    {businessHours}
                </td>
                <td className="col-md-2">
                    <Link className="btn btn-primary btn-sm" to={`/restaurants/${this.props.restaurant.id}`}
                          aria-label="Right Align">
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </Link>
                    <button type="abort" className="btn btn-danger btn-sm" aria-label="Right Align"
                            onClick={this.removeRestaurant}>
                        <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                    </button>
                </td>
            </tr>
        );
    }

    private pad = (num:number, size:number):string => {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
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
    detailsDate: moment.Moment;
    key: number | string;
}

class RestaurantList extends React.Component<any, any> {
    constructor(props:any) {
        super(props);
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
        if (this.props.errorMessage) {
            return (
                <div>{this.props.errorMessage}</div>
            )
        }

        if (restaurantsStore.isLoading()) {
            return (<div>
                <img src="ajax-loader.gif"/>
            </div>);
        }

        let restaurants = this.props.restaurants.map((restaurant:IRestaurant, i:number) =>
            (<Restaurant key={i} restaurant={restaurant} onRemove={this.removeRestaurant}
                         detailsDate={moment(new Date(2012,1,1))}/>)
        );

        return (
            <table className="table table-striped table-hover table-condensed">
                <thead>
                    <tr>
                        <th className="col-md-1">Name</th>
                        <th className="col-md-2">Anschrift<br/>Koordinaten
                        </th>
                        <th className="col-md-5">Telefon<br/>Notizen
                        </th>
                        <th className="col-md-2">Öffnungszeiten</th>
                        <th className="col-md-2"/>
                    </tr>
                </thead>
                <tbody>
                    {restaurants}
                    <tr>
                        <td colSpan={4}/>
                        <td>
                            <Link className="btn btn-success btn-sm" to={`restaurants/new`}
                                  aria-label="Right Align">
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>);
    }

    removeRestaurant = (restaurant:IRestaurant)=> {
        if (confirm("Do you really want to delete the restaurant?")) {
            RestaurantActions.deleteRestaurant(restaurant);
        }
    };
}
export default connectToStores(RestaurantList);