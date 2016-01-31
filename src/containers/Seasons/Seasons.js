import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {isLoaded, load as loadSeasons} from 'redux/modules/seasons';
import {isLoaded as isConfigLoaded, load as loadConfigs} from 'redux/modules/configurations';
import {isLoaded as isTourLoaded, load as loadTours} from 'redux/modules/tours';
import {SeasonForm} from 'components';
import {SeasonState} from 'models';

function fetchDataDeferred(getState, dispatch) {
  const loadPromise = new Promise((resolve, reject) => {
    const promises = [];
    if (!isLoaded(getState())) {
      promises.push(dispatch(loadSeasons()));
    }

    if (!isConfigLoaded(getState())) {
      promises.push(dispatch(loadConfigs()));
    }

    if (!isTourLoaded(getState())) {
      promises.push(dispatch(loadTours()));
    }

    Promise.all(promises).then(values => resolve(values)).catch(error => reject(error));
  });

  return loadPromise;
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    seasons: state.seasons.data,
    configs: state.configurations.data,
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading,
    editing: state.seasons.editing
  }),
  seasonActions)
export default class Seasons extends Component {
  static propTypes = {
    seasons: PropTypes.array,
    configs: PropTypes.array,
    editing: PropTypes.number,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const handleEdit = (season) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(season.id);
    };
    const handleDelete = (season) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(season.id);
    };

    const {seasons, configs, error, loading, load, editing, adding, save, add} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    const findConfiguration = id => {
      if (configs) {
        const configuration = configs.find(item => item.id === id);
        if (configuration) {
          return <div>{configuration.year}</div>;
        }
      }

      return <div>Config not found</div>;
    };

    const styles = require('./Seasons.scss');
    const renderBody = () => {
      if (adding) {
        return <div><SeasonForm formKey="new" initialValues={adding} onSubmit={(values) => add(values)}/></div>;
      }
      if (editing) {
        return (<div><SeasonForm formKey="new" initialValues={{
          ...seasons.find(season => season.id === editing),
          state: SeasonState.confirm
        }} onSubmit={(values) => save(values)}/></div>);
      }

      return (seasons && <table className="table table-striped table-hover table-condensed">
        <thead>
        <tr>
          <th className={styles.yearCol}>ID</th>
          <th className={styles.yearCol}>Bezeichnung</th>
          <th className={styles.versionCol}>Version</th>
          <th className={styles.configCol}>Konfiguration</th>
          <th className={styles.buttonCol}/>
        </tr>
        </thead>
        <tbody>
        {seasons.map(season => (<tr key={`${season.year}/${season.version}`}>
          <td className={styles.yearCol}>{season.id}</td>
          <td className={styles.yearCol}>{season.year}</td>
          <td className={styles.versionCol}>{season.version}</td>
          <td className={styles.configCol}>{findConfiguration(season.configuration)}</td>
          <td className={styles.buttonCol}>
            <button className="btn btn-primary" onClick={handleEdit(season)}>
              <i className="fa fa-pencil"/> Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete(season)}>
              <i className="fa fa-trash"/> Löschen
            </button>
          </td>
        </tr>))}
        <tr>
          <td colSpan={2}/>
          <td>
            <button className="btn btn-success" onClick={handleAdd()} disabled={adding}>
              <i className="fa fa-plus"/> Add
            </button>
          </td>
        </tr>
        </tbody>
      </table>);
    };

    return (
      <div className={styles.seasons + ' container'}>
        <h1>Seasons
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Seasons
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Tourenpläne'}/>

        {error && typeof(error) === 'string' &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
          {' '}
          {error}
        </div>}

        {renderBody()}
      </div>
    );
  }
}
