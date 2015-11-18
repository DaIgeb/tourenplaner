import * as React from 'react';
import {IRestaurantTimeline} from "models/Restaurant";
import {IDateRange} from "models/Core";
import {RestaurantBusinessHours} from './RestaurantBusinessHours'
import {DateRangeEdit} from 'DateRangeEdit/DateRangeEdit';
import {moment} from 'utils/moment';
import {Panel, Button, Row, Column} from 'Bootstrap/Bootstrap';

interface IRestaurantTimelineProps extends React.Props<RestaurantTimeline> {
    timelines: IRestaurantTimeline[];
    addTimeline: (evt:any) => void;
}

export class RestaurantTimeline extends React.Component<IRestaurantTimelineProps, any> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        var timelines = this.props.timelines.map((t:IRestaurantTimeline, index:number) => (
            <TimelinePanel key={index} timeline={t}/>));
        return (
            <Panel title="Öffnungszeiten">
                {timelines}
                <Row>
                    <Column size={11}>
                    </Column>
                    <Column size={1}>
                        <Button className="btn btn-success" type="button" onClick={this.props.addTimeline}>Add
                        </Button>
                    </Column>
                </Row>
            </Panel>
        )
    };
}

interface ITimelinePanelProps extends React.Props<TimelinePanel> {
    timeline:IRestaurantTimeline;
}

class TimelinePanel extends React.Component<ITimelinePanelProps, any> {
    constructor(props:any) {
        super(props);
    }

    render():JSX.Element {
        let isPanelCollapsed = this.props.timeline.until !== undefined && this.props.timeline.until !== null;

        return (
            <Panel title={this.getPanelHeader(this.props.timeline)} initialIsCollapsed={isPanelCollapsed}>
                <Row>
                    <Column size={6}>
                        <DateRangeEdit dateRange={this.props.timeline} onChange={this.changeRange.bind(this, this.props.timeline)}/>
                    </Column>
                    <Column size={6} classNames="input-group">
                        <div className="input-group-addon">Telefon</div>
                        <input type="text" className="form-control" value={this.props.timeline.phone}
                               onChange={this.changePhone.bind(this, this.props.timeline)}/>
                    </Column >
                </Row>
                <Row>
                    <Column size={12}>
                        <textarea className="form-control" defaultValue={this.props.timeline.notes}/>
                    </Column>
                </Row>
                <Row>
                    <Column size={12}>
                        <Panel title="Öffnungszeiten" initialIsCollapsed={true}>
                            <RestaurantBusinessHours businessHours={this.props.timeline.businessHours}/>
                        </Panel>
                    </Column>
                </Row>
            </Panel>)
    }

    private changeRange = (t:IRestaurantTimeline, newRange:IDateRange) => {
        t.from = newRange.from;
        t.until = newRange.until;
    };

    private changePhone = (t:IRestaurantTimeline, evt:any) => {
        t.phone = evt.target.value;
    };

    private getPanelHeader(t:IRestaurantTimeline):string {
        let from = "";
        let until = "";
        let fromDate = t.from;
        let untilDate = t.until;
        if (fromDate && fromDate.isValid())
            from = fromDate.format('L');
        if (untilDate && untilDate.isValid())
            until = fromDate.format('L');
        return `${from}-${until}`;
    }
}
