import * as React from 'react';
import {IBusinessHour} from "models/Restaurant";
import {ITime} from "models/Core";
import {getBackendWeekdays, moment} from 'utils/moment';
import {TimeEdit} from 'TimeEdit/TimeEdit';
import {Row, Column, Button} from 'Bootstrap/Bootstrap';

interface IRestaurantBusinessHoursProps extends React.Props<RestaurantBusinessHours> {
    businessHours: IBusinessHour[]
}

export class RestaurantBusinessHours extends React.Component<IRestaurantBusinessHoursProps, any> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        var businessHours = this.props.businessHours.map((t:IBusinessHour, i:number) => {
            return (<RestaurantBusinessHoursRow key={i} businessHour={t} addBusinessHour={this.addBusinessHour}/>)
        });
        return (
            <table className="table table-striped table-condensed">
                <thead>
                    <tr>
                        <th className="col-md-3">Wochentag</th>
                        <th className="col-md-4">Von</th>
                        <th className="col-md-4">Bis</th>
                        <th className="col-md-1"/>
                    </tr>
                </thead>
                <tbody>
                    {businessHours}
                </tbody>
            </table>
        )
    }

    private addBusinessHour = (businessHour: IBusinessHour) => {
        this.props.businessHours.push(businessHour);
        this.setState({s: "foo"});
    }
}

interface IRestaurantBusinessHoursRowProps extends React.Props<RestaurantBusinessHoursRow> {
    businessHour: IBusinessHour
    addBusinessHour: (businessHour: IBusinessHour) => void;
}

class RestaurantBusinessHoursRow extends React.Component<IRestaurantBusinessHoursRowProps, IBusinessHour> {
    constructor(props:any) {
        super(props);

        this.state = this.props.businessHour;
    }

    render():JSX.Element {
        let businessHour = this.state || this.props.businessHour;
        let weekdays = moment.weekdays().map((s:string, index:number) => (
            <option key={index} value={this.backEndWeekdays[index]}>{s}</option>));

        return (<tr>
            <td>
                <select className="form-control" value={businessHour.weekday} onChange={this.changeWeekday}>
                    {weekdays}
                </select>
            </td>
            <td>
                <TimeEdit time={businessHour.from} onChange={this.fromChanged}/>
            </td>
            <td>
                <TimeEdit time={businessHour.until} onChange={this.untilChanged}/>
            </td>
            <td>
                <Button className="btn btn-success" type="button" onClick={this.addBusinessHour}>Add
                </Button>
            </td>
        </tr>)
    }

    private changeWeekday = (evt:any) => {
        this.state.weekday = evt.target.value;
        this.setState(this.state);
    };

    private fromChanged = (time:ITime) => {
        this.state.from = time;
        this.setState(this.state);
    };

    private untilChanged = (time:ITime) => {
        this.state.until = time;
        this.setState(this.state);
    };

    private addBusinessHour = (evt:any) => {
        this.props.addBusinessHour({
            weekday: this.props.businessHour.weekday,
            from: {
                hour: this.props.businessHour.until.hour,
                minute: this.props.businessHour.until.minute
            },
            until: {
                hour: 23,
                minute: 59
            }
        });
    };

    private backEndWeekdays = getBackendWeekdays();
}