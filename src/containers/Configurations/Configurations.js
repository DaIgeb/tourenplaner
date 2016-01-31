import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as seasonConfigurationActions from 'redux/modules/configurations';
import {isLoaded, load as loadConfigurations, PageEnum} from 'redux/modules/configurations';
import {isLoaded as isTourLoaded, load as loadTours} from 'redux/modules/tours';
import {
  SeasonConfigurationForm,
  SeasonConfigurationYearForm,
  SeasonConfigurationDatesForm
} from 'components';

function fetchDataDeferred(getState, dispatch) {
  const promise = new Promise((resolve, reject) => {
    const promises = [];
    if (!isTourLoaded(getState())) {
      promises.push(dispatch(loadTours()));
    }

    if (!isLoaded(getState())) {
      promises.push(dispatch(loadConfigurations()));
    }

    Promise.all(promises).then(values => resolve(values)).catch(error => reject(error));
  });

  return promise;
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    configurations: state.configurations.data,
    error: state.configurations.error,
    adding: state.configurations.adding,
    loading: state.configurations.loading
  }),
  seasonConfigurationActions)
export default class Configurations extends Component {
  static propTypes = {
    configurations: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    addSetYear: PropTypes.func.isRequired,
    addSetPage: PropTypes.func.isRequired,
    addSetDates: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    children: PropTypes.object
  };

  render() {
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const handleStop = () => {
      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };
    const handleEdit = (season) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(season.id));
    };
    const handleDelete = (season) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(String(season.id));
    };

    const {configurations, error, loading, load, adding, children} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    const styles = require('./Configurations.scss');
    if (adding) {
      const {error: addingError} = adding;
      let wizard = null;
      switch (adding.page) {
        case PageEnum.year:
          const handleSubmitYear = (data) => {
            const {addSetYear, addSetPage} = this.props; // eslint-disable-line no-shadow
            addSetYear(data.year);
            addSetPage(PageEnum.dates);
          };

          wizard = <SeasonConfigurationYearForm initialValues={adding} onSubmit={handleSubmitYear} onCancel={handleStop()}/>;
          break;
        case PageEnum.dates:
          const handleSubmitDates = (data) => {
            const {addSetPage, addSetDates} = this.props; // eslint-disable-line no-shadow
            addSetDates(data);
            addSetPage(PageEnum.dateList);
          };
          const handleBackToYear = () => {
            const {addSetPage} = this.props; // eslint-disable-line no-shadow
            return () => addSetPage(PageEnum.year);
          };

          wizard = <SeasonConfigurationForm initialValues={adding} onSubmit={handleSubmitDates} onCancel={handleStop()} onBack={handleBackToYear()}/>;
          break;
        case PageEnum.dateList:
          const showYearPage = () => {
            const {addSetPage} = this.props; // eslint-disable-line no-shadow
            return () => addSetPage(PageEnum.year);
          };
          const handleVerifyDates = (data) => {
            const {add} = this.props; // eslint-disable-line no-shadow
            add(data);
          };

          wizard = <SeasonConfigurationDatesForm initialValues={adding} onSubmit={handleVerifyDates} onCancel={handleStop()} onBack={showYearPage()}/>;
          break;
        default:
          wizard = <div>Invalid Wizard Page</div>;
          break;
      }

      return (
        <div className={styles.seasons + ' container'}>
          <h1>Konfiguration</h1>
          <DocumentMeta title={config.app.title + ': Konfiguration'}/>

          {error && typeof(error) === 'string' &&
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
            {' '}
            {error}
          </div>}

          {addingError && typeof(addingError) === 'string' &&
          <div className="alert alert-danger" role="alert">
            <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
            {' '}
            {addingError}
          </div>}

          {wizard}
        </div>);
    }

    return (
      <div className={styles.seasons + ' container'}>
        <h1>Konfigurationen
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Konfigurationen
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Konfigurationen'}/>

        {error && typeof(error) === 'string' &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"/>
          {' '}
          {error}
        </div>}

        {configurations &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.yearCol}>Jahr</th>
            <th className={styles.versionCol}>Version</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {configurations.map(season => (<tr key={`${season.year}/${season.version}`}>
              <td className={styles.yearCol}>{season.year}</td>
              <td className={styles.versionCol}>{season.version}</td>
              <td className={styles.buttonCol}>
                <button className="btn btn-primary" onClick={handleEdit(season)}>
                  <i className="fa fa-pencil"/> Edit
                </button>
                <button className="btn btn-danger" onClick={handleDelete(season)}>
                  <i className="fa fa-trash"/> Löschen
                </button>
              </td>
            </tr>))}
            <tr key="new">
              <td colSpan={2}/>
              <td>
                <button className="btn btn-success" onClick={handleAdd()} disabled={adding}>
                  <i className="fa fa-plus"/> Add
                </button>
              </td>
            </tr>
          </tbody>
        </table>}

        {children}
      </div>
    );
  }
}
