import * as React from 'react';
import {Link} from 'react-router';
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

    componentWillMount() {
        this.setState({readOnly: true});
    }

    public render() {
        var buttonIcon:string;
        var buttonClass: string;
        if (this.state) {
            buttonIcon = "glyphicon glyphicon-pencil";
            buttonClass= "btn btn-primary btn-sm";
        }
        else {
            buttonClass= "btn btn-success btn-sm";
            buttonIcon = "glyphicon glyphicon-ok";
        }

        return (
            <tr>
                <form onSubmit={this.submit}>
                    <td>
                        <input type="textarea" className="form-control" value={this.props.restaurant.zipCode + " " +this.props.restaurant.city}
                               readOnly/>
                    </td>
                    <td>
                        <input type="text" className="form-control" value={this.props.restaurant.name}
                               readOnly/>
                    </td>
                    <td>
                        <input type="text" className="form-control" value={this.props.restaurant.address}
                               readOnly/>
                    </td>
                    <td>
                        <input type="textarea" className="form-control" value={this.props.restaurant.location.lat + " " +this.props.restaurant.location.long}
                               readOnly/>
                    </td>
                    <td>
                        <Link className="btn btn-primary btn-sm" to={`restaurants/${this.props.restaurant.id}`} aria-label="Left Align">
                            <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                        </Link>
                        <button type="abort" className="btn btn-danger btn-sm" aria-label="Left Align"
                                onClick={this.removeRestaurant}>
                            <span className="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                    </td>
                </form>
            </tr>
        );
    }

    removeRestaurant = (evt:any)=> {
        if (confirm("Do you really want to delete the restaurant?"))
        {
            this.props.onRemove(this.props.restaurant);
        }
    };

    submit = (evt:any)=> {
        this.props.onRemove(this.props.restaurant);
    };
}

interface IRestaurantState {
}
interface IRestaurantProps extends React.Props<Restaurant> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    onRemove: (restaurant:IRestaurant) => void;
    restaurant: IRestaurant;
    key: number;
}

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
                <tbody>{restaurants}
                    <tr>
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