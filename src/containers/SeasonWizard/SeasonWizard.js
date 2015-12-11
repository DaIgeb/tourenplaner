import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {SeasonWizardPage} from 'components';
/* eslint no-shadow: [2, { "allow": ["pushState"]}] */
import {pushState} from 'redux-router';

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
    editStart: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  routerHandler() {
    const {pushState} = this.props;
    // TODO read the page number from the state
    pushState(null, `./new/2`);
  }

  render() {
    const {children, error} = this.props;
    const styles = require('./SeasonWizard.scss');
    return (
      <div>
        <div className="modal-backdrop fade in"/>
        <div className={styles.seasons + ' modal fade in'} tabIndex={-1} role="dialog" style={{display: 'block'}}>
          <DocumentMeta title={config.app.title + ': Neuer Tourenplan'}/>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" aria-label="Close"><span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title">Neue Saison</h4>
              </div>
              <div className="modal-body">

                {error && typeof(error) === 'string' &&
                <div className="alert alert-danger" role="alert">
                  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                  {' '}
                  {error}
                </div>}

                {children ? children : (<SeasonWizardPage page={0}/>)}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-default">Close</button>
                <button type="button" className="btn btn-primary" onClick={this.routerHandler.bind(this)}>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}
