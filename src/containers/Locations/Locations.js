import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as locationActions from 'redux/modules/locations';
import {isLoaded, load as loadLocations} from 'redux/modules/locations';
import {LocationForm} from 'components';
import LocationRow from './LocationRow';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadLocations());
  }
}

function getActions() {
  return {
    ...locationActions
  };
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    locations: state.locations.data,
    editing: state.locations.editing,
    error: state.locations.error,
    adding: state.locations.adding,
    loading: state.locations.loading
  }),
  getActions())
export default class Locations extends Component {
  static propTypes = {
    locations: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired
  };

  render() {
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const {locations, error, editing, loading, load, add, adding} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    const styles = require('./Locations.scss');
    return (
      <div className={styles.locations + ' container'}>
        <h1>Locations
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Locations
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Locations'}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
          {' '}
          {error}
        </div>}

        {locations && locations.length &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.nameCol}>Bezeichnung</th>
            <th className={styles.addressCol}>Adresse/Land/PLZ/Ort</th>
            <th className={styles.coordsCol}>Breite</th>
            <th className={styles.coordsCol}>Länge</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {locations.map(location => <LocationRow key={String(location.id)} location={location} isEditing={editing[location.id] ? true : false}/>)}
            {adding ?
              <LocationForm formKey="new" key="new" initialValues={adding} onSubmit={values => {add(values);}}/> :
              <tr key="new">
                <td colSpan={8}/>
                <td>
                  <button className="btn btn-success" onClick={handleAdd()}>
                    <i className="fa fa-plus"/> Add
                  </button>
                </td>
              </tr>
              }
          </tbody>
        </table>}
      </div>
    );
  }
}
