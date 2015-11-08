import * as React from 'react';
import {IDateRange} from "models/Restaurant";
import {moment} from 'utils/moment'

interface IDateRangeEditProps extends React.Props<DateRangeEdit> {
    dateRange: IDateRange;
    onChange: (newValues:IDateRange)=>void;
    inputFormats?: Array<string>;
    displayFormat?: string;
}

interface IDateRangeEditState {
    from:string;
    fromValidation: EditState;
    until:string;
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
            from: fromString,
            fromValidation: EditState.Unchanged,
            until: untilString,
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
                        <input className="form-control" type="text" value={this.state.from}
                               onChange={this.changeFrom}/>
                    </div>
                    <div className={untilClassName}>
                        <div className="input-group-addon">Bis</div>
                        <input className="form-control" type="text" value={this.state.until}
                               onChange={this.changeUntil}/>
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

    private changeFrom = (evt:any) => {
        let from = this.normalizeDate(evt.target.value);
        let state = {
            from: from.value,
            fromValidation: from.isValid ? EditState.Valid : EditState.Error,
            until: this.state.until,
            untilValidation: this.state.untilValidation
        };
        this.sendNotification(state);
        this.setState(state);
    };

    private changeUntil = (evt:any) => {
        let until = this.normalizeDate(evt.target.value);
        let state = {
            from: this.state.from,
            fromValidation: this.state.fromValidation,
            until: until.value,
            untilValidation: until.isValid ? EditState.Valid : EditState.Error
        };
        this.sendNotification(state);
        this.setState(state);
    };

    private normalizeDate = (state:string):{ isValid: boolean,value: string }=> {
        var untilDate = moment(state, this.inputFormats, true);
        if (this.isDateValid(untilDate, state)) {
            var formatted = untilDate.format(this.displayFormat);
            return {isValid: true, value: formatted};
        }

        return {isValid: false, value: state};
    };

    private isDateValid = (date:moment.Moment, value:string):boolean => {
        if (date.isValid()) {
            return this.inputFormats.findIndex(f => date.format(f) === value) >= 0;
        }

        return false;
    };

    private sendNotification = (state:IDateRangeEditState):void => {
        var fromDate = moment(state.from, this.inputFormats);
        var untilDate = moment(state.until, this.inputFormats);
        if (this.isDateValid(fromDate, state.from) && this.isDateValid(untilDate, state.until)) {
            this.props.onChange({
                until: untilDate.toDate(),
                from: fromDate.toDate()
            });
        }
    };

    private inputFormats:Array<string>;
    private displayFormat:string;
}
