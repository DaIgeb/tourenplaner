import * as React from 'react';
import {IDateRange} from "models/Core";
import {moment} from 'utils/moment'

interface IDateRangeEditProps extends React.Props<DateRangeEdit> {
    dateRange: IDateRange;
    onChange: (newValues:IDateRange)=>void;
    inputFormats?: Array<string>;
    displayFormat?: string;
    onValidate?: (range:IDateRange) => {from:EditState, until:EditState};
}

interface IDateRangeEditState {
    from:moment.Moment;
    fromEditValue: string;
    fromValidation: EditState;
    until:moment.Moment;
    untilEditValue: string;
    untilValidation: EditState;
}

enum EditState {
    Unchanged,
    Valid,
    Error
}

export class DateRangeEdit extends React.Component<IDateRangeEditProps, IDateRangeEditState> {
    constructor(props:any) {
        super(props);

        this.displayFormat = this.props.displayFormat || 'L';
        this.inputFormats = this.props.inputFormats || ['L', 'l'];

        let from = moment(this.props.dateRange.from);
        let until = moment(this.props.dateRange.until);
        let fromString = from.isValid() ? from.format(this.displayFormat) : "";
        let untilString = until.isValid() ? until.format(this.displayFormat) : "";

        this.state = {
            from: from,
            fromEditValue: fromString,
            fromValidation: EditState.Unchanged,
            until: until,
            untilEditValue: untilString,
            untilValidation: EditState.Unchanged
        };
    }

    render():JSX.Element {
        let fromClassName = "input-group col-md-6" + this.getErrorStyle(this.state.fromValidation);
        let untilClassName = "input-group col-md-6" + this.getErrorStyle(this.state.untilValidation);

        return (
            <div className="form-inline">
                <div className="form-group">
                    <div className={fromClassName}>
                        <div className="input-group-addon">Von</div>
                        <input className="form-control" type="text" value={this.state.fromEditValue}
                               onChange={this.changeFrom}/>
                    </div>
                    <div className={untilClassName}>
                        <div className="input-group-addon">Bis</div>
                        <input className="form-control" type="text" value={this.state.untilEditValue}
                               onChange={this.changeUntil.bind(this)}/>
                    </div>
                </div>
            </div>);
    };

    private getErrorStyle = (state:EditState):string => {
        switch (state) {
            case EditState.Error:
                return ' has-error';
            case EditState.Valid:
                return ' has-success';
                break;
            default:
                return '';
        }
    };

    private changeFrom = (evt:React.SyntheticInputEvent) => {
        let from = this.normalizeDate(evt.target.value);
        let state = {
            from: from,
            fromEditValue: evt.target.value,
            fromValidation: from.isValid() ? EditState.Valid : EditState.Error,
            until: this.state.until,
            untilEditValue: this.state.untilEditValue,
            untilValidation: this.state.untilValidation
        };
        this.sendNotification(state);
        this.setState(state);
    };

    private changeUntil(evt:React.SyntheticInputEvent) {
        let until = this.normalizeDate(evt.target.value);
        let state = {
            from: this.state.from,
            fromEditValue: this.state.fromEditValue,
            fromValidation: this.state.fromValidation,
            until: until,
            untilEditValue: evt.target.value,
            untilValidation: until.isValid() ? EditState.Valid : EditState.Error
        };
        this.sendNotification(state);
        this.setState(state);
    };

    private normalizeDate = (state:string):moment.Moment => {
        var untilDate = moment(state, this.inputFormats, true);
        if (this.isDateValid(untilDate, state)) {
            return untilDate;
        }

        return moment.invalid();
    };

    private isDateValid = (date:moment.Moment, value:string):boolean => {
        if (date.isValid()) {
            return this.inputFormats.findIndex(f => date.format(f) === value) >= 0;
        }
        else {
            return value === null || value === '';
        }
    };

    private sendNotification = (state:IDateRangeEditState):void => {
        var fromDate = state.from;
        var untilDate = state.until;
        if (this.isDateValid(fromDate, state.fromEditValue) && this.isDateValid(untilDate, state.untilEditValue)) {
            if (fromDate >= untilDate) {
                state.untilValidation = EditState.Error;
            } else {
                this.props.onChange({
                    until: untilDate.isValid() ? untilDate : null,
                    from: fromDate.isValid() ? fromDate : null
                });
            }
        }
    };

    private inputFormats:Array<string>;
    private displayFormat:string;
}
