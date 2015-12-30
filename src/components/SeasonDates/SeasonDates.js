import React, {Component, PropTypes} from 'react';

export default class SeasonDates extends Component {
  static propTypes = {
    season: PropTypes.object.isRequired
  };

  render() {
    return (<div>Dates</div>);
  }
}
