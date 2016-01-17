import React, {Component, PropTypes} from 'react';
import {moment} from 'utils/moment';

export default class WeekdayInput extends Component {
  static propTypes = {
    locations: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func
  };

  render() {
    const currentLocale = moment.locale();
    moment.locale('en');
    const englishWeekDays = moment.weekdays();
    moment.locale(currentLocale);
    const currentWeekDays = moment.weekdays();

    const options = currentWeekDays.map((weekday, idx) => <option key={idx} value={englishWeekDays[idx]}>{weekday}</option>);

    return (
      <select
        default={englishWeekDays[0]}
        {...this.props}>
        {options}
      </select>);
  }
}
