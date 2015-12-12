import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {pushState} from 'redux-router';
import {SeasonWizardDatePage} from 'components';

@connect(
  state => ({
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading
  }),
  {...seasonActions, pushState})
export default class SeasonWizard extends Component {
  static propTypes = {
    children: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    routeParams: PropTypes.object.isRequired
  };

  render() {
    const {routeParams, error} = this.props;
    const page = routeParams.page;
    const nextPage = () => {
      const {pushState} = this.props; // eslint-disable-line no-shadow
      return () => pushState(null, `/seasons/new/${page}2`);
    };
    const close = () => {
      const {pushState} = this.props; // eslint-disable-line no-shadow
      return () => pushState(null, `/seasons`);
    };

    const styles = require('./SeasonWizard.scss');
    return (
      <div>
        <div className="modal-backdrop fade in" onClick={close()}></div>
        <div className={styles.seasons + ' modal fade in'} tabIndex={-1} role="dialog" style={{display: 'block'}}>
          <DocumentMeta title={config.app.title + ': Neuer Tourenplan'}/>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" aria-label="Close" onClick={close()}><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Neue Saison</h4>
              </div>
              <div className="modal-body">

                {error && typeof(error) === 'string' &&
                <div className="alert alert-danger" role="alert">
                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
                  {' '}
                  {error}
                </div>}
                {page && page === 'dates' && (<SeasonWizardDatePage />)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default" onClick={close()}>Close</button>
                <button type="button" className="btn btn-primary" onClick={nextPage()}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
