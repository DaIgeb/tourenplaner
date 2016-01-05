import React, {Component, PropTypes} from 'react';

/**
 * Serializes and deserializes complex values to and from JSON
 *
 * Disclaimer: For demo purposes only!! Using <select multiple> is very awkward.
 */
export default class NumberInput extends Component {
  static propTypes = {
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.number, // array or individual value
    decimalPlaces: PropTypes.number
  };

  render() {
    const {onBlur, onChange, decimalPlaces, value, ...rest} = this.props;
    const parse = event => {
      if (decimalPlaces) {
        return parseFloat(event.target.value, 10);
      }

      return parseInt(event.target.value, 10);
    };
    const toString = number => {
      if (number) {
        return number.toFixed(decimalPlaces || 0);
      }

      return null;
    };

    return (
      <input
        className="form-control"
        type="number"
        onBlur={event => onBlur(parse(event))}
        onChange={event => onChange(parse(event))}
        value={toString(value)}
        {...rest}>
      </input>
    );
  }
}
