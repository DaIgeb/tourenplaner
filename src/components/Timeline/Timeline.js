import React, {Component, PropTypes} from 'react';
import moment from 'moment';
import config from '../../config';

export default class Timeline extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    dateFormat: PropTypes.string,
    start: PropTypes.number,
    end: PropTypes.number,
    stepSize: PropTypes.number,
    onTimelineChanged: PropTypes.func.isRequired
  };

  render() {
    const changeTimeline = (evt) => {
      const message = moment.unix(parseInt(evt.target.value, 10));
      if (message.isValid()) {
        const {onTimelineChanged} = this.props;
        onTimelineChanged(message);
      }
    };

    const stepSize = this.props.stepSize || (7 * 24 * 60 * 60); // one week
    const start = this.props.start || config.app.epoch.start;
    const end = this.props.end || config.app.epoch.end;
    const value = this.props.dateFormat ? moment(this.props.date, this.props.dateFormat, true) : moment(this.props.date);
    value.locale('de');

    return (<div className="input-group">
      <span className="input-group-addon">{value.format('L')}</span>
      <input className="form-control" type="range" step={stepSize} min={moment(start).unix()} max={moment(end).unix()} value={value.unix()} onChange={changeTimeline}/>
    </div>);
  }
}
