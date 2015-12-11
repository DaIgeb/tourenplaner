import React, {Component, PropTypes} from 'react';

export default class SeasonWizardPage extends Component {
  static propTypes = {
    page: PropTypes.number
  };

  render() {
    let page = this.props.page;
    if (isNaN(page) && this.props.routeParams) {
      page = this.props.routeParams.page;
    }
    if (isNaN(page)) {
      return (<div className="row">
        Invalid wizard
      </div>);
    }
    return (<div className="row">
      {page}
    </div>);
  }
}
