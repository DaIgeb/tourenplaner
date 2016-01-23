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

    const options = locations
      .map(loc => {
        const label = (loc.city && loc.city !== loc.name ? `${loc.city} - ` : '') + loc.name + (loc.identifier ? ` (${loc.identifier})` : '');
        return { id: loc.id, label: label};
      })
      .sort((loc1, loc2) => loc1.label.localeCompare(loc2.label))
      .map(option => <option key={option.id} value={JSON.stringify(option.id)}>{option.label}</option>);
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
