import React, {Component, PropTypes} from 'react';
import {isLoaded, load} from 'redux/modules/tours';
import {connect} from 'react-redux';
import connectData from 'helpers/connectData';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(load());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    tours: state.tours.data
  }))
export default class TourInput extends Component {
  static propTypes = {
    tours: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    filter: PropTypes.func,
    allowNull: PropTypes.boolean
  };

  render() {
    const {onBlur, onChange, filter, allowNull} = this.props;
    const bluring = onBlur || onChange;

    let tours = this.props.tours;
    if (!tours) {
      return <p>Loading</p>;
    }


    if (filter) {
      tours = tours.filter(filter);
    }
    const options = tours.map(option => <option key={option.id} value={JSON.stringify(option.id)}>{option.name}</option>);

    return (
    <select
      {...this.props}
      className="form-control"
      onBlur={evt => bluring(parseInt(evt.target.value, 10))}
      onChange={evt => onChange(parseInt(evt.target.value, 10))}>
      {allowNull && (<option value={undefined}>Keine</option>)}
      {options}
    </select>
    );
  }
}
