import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {isLoaded, load as loadSeasons, PageEnum} from 'redux/modules/seasons';
import {
  SeasonConfigurationForm,
  SeasonConfigurationYearForm,
  SeasonConfigurationDatesForm
} from 'components';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadSeasons());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    seasons: state.seasons.data,
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading
  }),
  seasonActions)
export default class Seasons extends Component {
  static propTypes = {
    seasons: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
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

    const {seasons, error, loading, load, adding, children} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    const styles = require('./Seasons.scss');
    if (adding) {
      let wizard = null;
      switch (adding.page) {
        case PageEnum.year:
          const handleSubmitYear = (data) => {
            const {addSetYear, addSetPage} = this.props; // eslint-disable-line no-shadow
            addSetYear(data.year);
            addSetPage(PageEnum.dates);
          };

          wizard = [(<SeasonConfigurationYearForm initialValues={adding} onSubmit={handleSubmitYear} onCancel={handleStop()}/>)];
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
            window.alert(JSON.stringify(data, null, 2));
            handleStop()();
          };

          wizard = <SeasonConfigurationDatesForm initialValues={adding} onSubmit={handleVerifyDates} onCancel={handleStop()} onBack={showYearPage()}/>;
          break;
        default:
          wizard = <div>Invalid Wizard Page</div>;
          break;
      }

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

          {wizard}
        </div>);
    }

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

        {seasons && seasons.length &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.yearCol}>Jahr</th>
            <th className={styles.versionCol}>Version</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {seasons.map(season => (<tr key={`${season.year}/${season.version}`}>
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
