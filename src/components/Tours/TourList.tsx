import * as React from 'react';
import {Link, History} from 'react-router';
import * as routerDefault from 'react-router';
import {restaurantsStore} from 'stores/RestaurantsStore';
import connectToStores from 'alt/utils/connectToStores';
import {actions as RestaurantActions} from "actions/RestaurantsActions";
import {ITourViewModel, IPoint, ITourTimelineViewModel} from "models/Tour";
import {IDateRange} from "models/Core";
import {Button} from 'Bootstrap/Bootstrap';
import {moment} from 'utils/moment';

class Tour extends React.Component<ITourProps, ITourState> {
    constructor(props:ITourProps) {
        super(props);
    }

    public render() {
        var detailData = this
            .props
            .tour
            .timelines
            .find((detail:ITourTimelineViewModel) => this.dateRangeMatches(detail));
        return (
            <tr>
                <td className="col-md-1">
                    {this.props.tour.name}
                </td>
                <td className="col-md-2">
                    {this.props.tour.name}
                </td>
                <td className="col-md-5">
                    {detailData.difficulty}
                    <br/>
                    {detailData.distance}
                </td>
                <td className="col-md-2">
                    <ul>{detailData.tourTypes.forEach(t => (<li>{t}</li>))}</ul>
                </td>
                <td className="col-md-2">
                    <ul>{detailData.points.forEach( (t:IPoint) => (<li>{t.name}</li>))}</ul>
                </td>
                <td className="col-md-2">
                    <Link className="btn btn-primary btn-sm" to={`/tours/${this.props.tour.id}`}
                          aria-label="Right Align">
                        <span className="glyphicon glyphicon-pencil" aria-hidden="true"></span>
                    </Link>
                    <button type="abort" className="btn btn-danger btn-sm" aria-label="Right Align"
                            onClick={this.removeTour}>
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

    removeTour = (evt:any)=> {
        this.props.onRemove(this.props.tour);
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

interface ITourState {
}
interface ITourProps extends React.Props<Tour> {
    // children: React.ReactNode; //cannot be required currently see https://github.com/Microsoft/TypeScript/issues/4833
    onRemove: (tour:ITourViewModel) => void;
    tour: ITourViewModel;
    detailsDate: moment.Moment;
    key: number | string;
}

interface ITourListProps extends React.Props<TourList> {
    tours: ITourViewModel[];
    errorMessage: string;
}

class TourList extends React.Component<ITourListProps, any> {
    constructor(props:ITourListProps) {
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

        let tours = this.props.tours.map((tour:ITourViewModel, i:number) =>
            (<div>Tour</div>)
            /*(<Tour key={i} tour={tour} onRemove={this.removeRestaurant}
                         detailsDate={moment(new Date(2012,1,1))}/>)*/
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
                    {tours}
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

    removeRestaurant = (tour:ITourViewModel)=> {
        if (confirm("Do you really want to delete the tour?")) {
            // TODO RestaurantActions.deleteRestaurant(tour);
        }
    };
}
export default connectToStores(TourList);