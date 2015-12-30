import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
// import DocumentMeta from 'react-document-meta';
// import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {pushState} from 'redux-router';
import {initialize} from 'redux-form';
import {Dialog} from 'components';

@connect(
  state => ({
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading
  }),
  {...seasonActions, pushState, initialize})
export default class SeasonWizard extends Component {
  static propTypes = {
    children: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    initialize: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  handleSubmit = (data) => {
    window.alert('Data submitted! ' + JSON.stringify(data));
    this.props.initialize('season-configuration', {});
  };

  render() {
    const {routeParams, error, children} = this.props;
    const page = routeParams.page;
    const nextPage = () => {
      const {pushState} = this.props; // eslint-disable-line no-shadow
      return () => pushState(null, `/seasons/new/${page}2`);
    };
    const close = () => {
      const {pushState, addStop} = this.props; // eslint-disable-line no-shadow
      addStop();
      return () => pushState(null, `/seasons`);
    };

    // const styles = require('./SeasonWizard.scss');
    return (<Dialog onCancel={close} onOk={nextPage} title="Neue Saison" footer={<div></div>}>
      {error && typeof(error) === 'string' &&
      <div className="alert alert-danger" role="alert">
        <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
        {' '}
        {error}
      </div>}

      {children}
    </Dialog>);
  }
}
