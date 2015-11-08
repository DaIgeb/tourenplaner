import * as React from 'react';
import {IDateRange, IRestaurantTimeline} from "models/Restaurant";
import Button from 'Button/Button';
import {RestaurantBusinessHours} from './RestaurantBusinessHours'
import {DateRangeEdit} from 'DateRangeEdit/DateRangeEdit';
import {moment} from 'utils/moment'

interface IRestaurantTimelineProps extends React.Props<RestaurantTimeline> {
    timelines: IRestaurantTimeline[];
    addTimeline: (evt:any) => void;
}

export class RestaurantTimeline extends React.Component<IRestaurantTimelineProps, any> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        var timelines = this.props.timelines.map((t:IRestaurantTimeline, index:number) => {
            return [(<tr key={index}>
                <td>
                    <DateRangeEdit dateRange={t} onChange={this.changeRange.bind(this, t)}/>
                </td>
                <td>
                    <input type="text" className="form-control" value={t.phone} onChange={this.changePhone.bind(this, t)}/>
                </td>
                <td rowSpan={2}>
                    <RestaurantBusinessHours businessHours={t.businessHours}/>
                </td>
            </tr>), (<tr>
                <td colSpan={2}>
                    <textarea className="form-control" defaultValue={t.notes}></textarea>
                </td>
            </tr>)]
        });
        return (
            <table>
                <thead>
                    <tr>
                        <th className="col-md-5">Gültig Von-Bis</th>
                        <th className="col-md-2">Telefon</th>
                        <th className="col-md-5">Öffnungszeiten</th>
                    </tr>
                </thead>
                <tbody>
                    {timelines}
                    <tr>
                        <td colSpan={3}/>
                        <td>
                            <Button className="btn btn-success" type="button" onClick={this.props.addTimeline}>Add
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }

    private changePhone = (t:IRestaurantTimeline, evt:any) => {
        t.phone = evt.target.value;
    };

    private changeRange = (t:IRestaurantTimeline, newRange:IDateRange) => {
        t.from = newRange.from;
        t.until = newRange.until;
    };
}
