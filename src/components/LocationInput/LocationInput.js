import React, {Component, PropTypes} from 'react';
import {isLoaded, load as loadLocations} from 'redux/modules/locations';
import {connect} from 'react-redux';
import connectData from 'helpers/connectData';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadLocations());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    locations: state.locations.data
  }))
export default class LocationInput extends Component {
  static propTypes = {
    locations: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func
  };

  render() {
    const {locations, onBlur, onChange} = this.props;
    const bluring = onBlur || onChange;
    const compareValue = (str1, str2) => {
      if (str1 < str2) {
        return -1;
      }
      if (str1 > str2) {
        return 1;
      }

      return 0;
    };
    const options = locations
      .sort((loc1, loc2) => {
        if (loc1.name !== loc2.name) {
          return compareValue(loc1.name, loc2.name);
        }
        if (loc1.city !== loc2.city) {
          return compareValue(loc1.city, loc2.city);
        }

        return compareValue(loc1.identifier, loc2.identifier);
      })
      .map(option => {
        const label = option.name + (option.identifier ? ` (${option.identifier})` : '') + (option.city ? ` - ${option.city}` : '');
        return <option key={option.id} value={JSON.stringify(option.id)}>{label}</option>;
      });
    return (
    <select
      {...this.props}
      className="form-control"
      onBlur={evt => bluring(parseInt(evt.target.value, 10))}
      onChange={evt => onChange(parseInt(evt.target.value, 10))}>
      {options}
    </select>
    );
  }
}
