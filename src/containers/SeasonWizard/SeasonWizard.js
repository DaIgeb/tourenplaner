import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {SeasonWizardPage} from 'components';

@connect(
  state => ({
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading,
  }),
  ...seasonActions)
export default class SeasonWizard extends Component {
  static propTypes = {
    children: PropTypes.object,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const {children, error} = this.props;
    const styles = require('./SeasonWizard.scss');
    return (
      <div className={styles.seasons + ' container'}>
        <h1>Neue Saison</h1>
        <DocumentMeta title={config.app.title + ': Neuer Tourenplan'}/>

        {error && typeof(error) === 'string' &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}

        {children ? children : (<SeasonWizardPage page={0} />)}
      </div>
    );
  }
}
