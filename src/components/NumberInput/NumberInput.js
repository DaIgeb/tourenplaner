import React, {Component, PropTypes} from 'react';

function formatNumber(number) {
  return number ? number.toString() : '';
}

function parseNumber(number) {
  return parseFloat(number);
}

export default class NumberInput extends Component {
  static propTypes = {
    value: PropTypes.number,
    placeholder: PropTypes.string,

    format: PropTypes.string,
    // parse: PropTypes.func.isRequired,
    culture: PropTypes.string,

    min: PropTypes.number,
    disabled: PropTypes.bool,
    readOnly: PropTypes.bool,

    onChange: PropTypes.func.isRequired,
    onKeyDown: PropTypes.func
  };
  static defaultProps = {
    value: null,
    editing: false,
    min: 0
  };

  constructor(props) {
    super(props);

    this.state = this.getDefaultState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.getDefaultState(nextProps));
  }

  getDefaultState(props) {
    let value = props.editing
      ? props.value
      : formatNumber(props.value);

    if (value === null || isNaN(props.value)) {
      value = '';
    }

    return { stringValue: '' + value };
  }


  // this intermediate state is for when one runs into the decimal or are typing the number
  current(val) {
    this.setState({stringValue: val});
  }

  isValid(num) {
    if (typeof num !== 'number' || isNaN(num)) {
      return false;
    }

    return num >= (this.props.min || 0);
  }

  isAtDelimiter(num, str) {
    if (str.length <= 1) {
      return false;
    }

    const next = parseNumber(str.substr(0, str.length - 1));

    return typeof next === 'number' && !isNaN(next) && next === num;
  }

  _finish() {
    const str = this.state.stringValue;
    const number = parseNumber(str);

    // if number is below the min
    // we need to flush low values and decimal stops, onBlur means i'm done inputing
    if (!isNaN(number)) {
      if (number < this.props.min || this.isAtDelimiter(number, str)) {
        this.props.onChange(number);
      }
    }
  }

  _change(evt) {
    const val = evt.target.value;
    const number = parseNumber(evt.target.value);
    const valid = this.isValid(number);

    if (val === null || val.trim() === '' || val.trim() === '-') {
      return this.props.onChange(null);
    }

    if (valid && number !== this.props.value && !this.isAtDelimiter(number, val)) {
      return this.props.onChange(number);
    }

    if (!isNaN(number) || this.isAtDelimiter(number, val)) {
      this.current(evt.target.value);
    }
  }

  render() {
    const value = this.state.stringValue;

    return (
      <input
        type="text"
        className="form-control"
        {...this.props}
        onChange={this._change.bind(this)}
        onBlur={this._finish.bind(this)}
        aria-disabled={this.props.disabled}
        aria-readonly={this.props.readOnly}
        disabled={this.props.disabled}
        readOnly={this.props.readOnly}
        placeholder={this.props.placeholder}
        value={value}/>
    );
  }
}
