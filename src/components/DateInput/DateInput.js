import React, {Component, PropTypes} from 'react';
import {moment} from 'utils/moment';

/**
 * Serializes and deserializes complex values to and from JSON
 *
 * Disclaimer: For demo purposes only!! Using <select multiple> is very awkward.
 */
export default class DateInput extends Component {
  static propTypes = {
    displayFormat: PropTypes.string.isRequired,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.string // array or individual value
  };

  render() {
    const {displayFormat, onBlur, onChange, value, ...rest} = this.props;
    const parse = event => {
      const date = moment(event.target.value, displayFormat, true);
      if (date.isValid()) {
        return date.toISOString();
      }

      return event.target.value;
    };
    const toString = dateValue => {
      if (!dateValue) {
        return null;
      }
      const parsedDate = moment(dateValue, moment.ISO_8601, true);
      if (parsedDate.isValid()) {
        return parsedDate.format(displayFormat);
      }

      return dateValue;
    };
    return (
      <input
        className="form-control"
        type="text"
        onBlur={event => onBlur(parse(event))}
        onChange={event => onChange(parse(event))}
        value={toString(value)}
        {...rest}>
      </input>
    );
  }
}