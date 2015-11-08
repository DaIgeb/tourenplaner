import * as React from 'react';
import {ITime} from "models/Restaurant";

interface ITimeEditProps extends React.Props<TimeEdit> {
    time: ITime;
    onChange: (newTime:ITime) => void;
}

export class TimeEdit extends React.Component<ITimeEditProps, any> {

    render():JSX.Element {
        return (<div className="input-group">
            <input className="form-control" type="number" min={0} max={24} value={this.props.time.hour.toString()}
                   onChange={this.changeHour}/>
            <div className="input-group-addon">:</div>
            <input className="form-control" type="number" min={0} max={60} value={this.props.time.minute.toString()}
                   onChange={this.changeMinute}/>
        </div>);
    }

    private changeHour = (evt:any) => {
        this.props.onChange({
            hour: evt.target.value,
            minute: this.props.time.minute
        })
    };

    private changeMinute = (evt:any) => {
        this.props.onChange({
            minute: evt.target.value,
            hour: this.props.time.hour
        })
    };
}