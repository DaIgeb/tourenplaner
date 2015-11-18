import * as React from 'react';
import {Link, History} from 'react-router';
import * as routerDefault from 'react-router';
import {tourStore} from 'stores/TourStore';
import connectToStores from 'alt/utils/connectToStores';
import {ITourViewModel, IPoint, ITourTimelineViewModel} from "models/Tour";
import {IDateRange} from "models/Core";
import {Button} from 'Bootstrap/Bootstrap';
import {moment} from 'utils/moment';

interface ITourListProps extends React.Props<TourList> {
    tours: ITourViewModel[];
    errorMessage: string;
}

class TourList extends React.Component<ITourListProps, any> {
    constructor(props:ITourListProps) {
        super(props);
    }

    static getStores(props:any) {
        return [tourStore];
    }

    static getPropsFromStores(props:any) {
        return tourStore.getState();
    }

    componentDidMount() {
        tourStore.fetchTours();
    }

    render():JSX.Element {
        if (this.props.errorMessage) {
            return (<div>{this.props.errorMessage}</div>);
        }

        if (tourStore.isLoading()) {
            return (<div><img src="ajax-loader.gif"/></div>);
        }

        let tours = this.props.tours.map((tour:ITourViewModel, i:number) =>
            (<tr key={i}>
                <td>{tour.name}</td>
                <td>{tour.timelines[0].difficulty}</td>
                <td>{tour.timelines[0].tourTypes}</td>
                <td>{tour.timelines[0].distance}</td>
            </tr>)
        );

        return (
            <table className="table table-striped table-hover table-condensed">
                <thead>
                    <tr>
                        <th className="col-md-2">Name</th>
                        <th className="col-md-2">Schwierigkeit</th>
                        <th className="col-md-2">Art</th>
                        <th className="col-md-2">Distanz</th>
                    </tr>
                </thead>
                <tbody>
                    {tours}
                    <tr>
                        <td colSpan={3}/>
                        <td>
                            <Link className="btn btn-success btn-sm" to={`tours/new`}
                                  aria-label="Right Align">
                                <span className="glyphicon glyphicon-plus" aria-hidden="true"></span>
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>);
    }
}
export default connectToStores(TourList);