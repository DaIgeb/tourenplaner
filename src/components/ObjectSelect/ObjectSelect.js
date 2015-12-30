import React, {Component, PropTypes} from 'react';

/**
 * Serializes and deserializes complex values to and from JSON
 *
 * Disclaimer: For demo purposes only!! Using <select multiple> is very awkward.
 */
export default class ObjectSelect extends Component {
  static propTypes = {
    multiple: PropTypes.bool,
    onBlur: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    options: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      label: PropTypes.string.isRequired
    })),
    initialValue: PropTypes.any, // array or individual value
    defaultValue: PropTypes.any, // array or individual value
    value: PropTypes.any // array or individual value
  };

  render() {
    const {multiple, onBlur, onChange, options, value, initialValue, defaultValue, ...rest} = this.props;
    const parse = event => {
      if (multiple) {
        const result = [];
        // event.target.selectedOptions is a NodeList, not an array. Gross.
        for (let index = 0; index < event.target.selectedOptions.length; index++) {
          result.push(JSON.parse(event.target.selectedOptions[index].value));
        }
        return result;
      }
      return JSON.parse(event.target.value);
    };
    return (
      <select
        className="form-control"
        multiple={multiple}
        onBlur={event => onBlur(parse(event))}
        onChange={event => onChange(parse(event))}
        value={multiple ? value.map(JSON.stringify) : JSON.stringify(value)}
        initialValue={multiple ? initialValue.map(JSON.stringify) : JSON.stringify(initialValue)}
        defaultValue={multiple ? defaultValue.map(JSON.stringify) : JSON.stringify(defaultValue)}
        {...rest}>
        {options.map(option =>
          <option key={option.id} value={JSON.stringify(option)}>{option.label}</option>)}
      </select>
    );
  }
}
