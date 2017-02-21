import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as tourActions from 'redux/modules/tours';
import {isLoaded, load as loadTour} from 'redux/modules/tours';
import {isLoaded as isRestaurantsLoaded, load as loadRest} from 'redux/modules/restaurants';
import {isLoaded as isLocationsLoaded, load as loadLoc} from 'redux/modules/locations';
import {Timeline, TourForm} from 'components';
import {timelineMatches} from '../../../shared/utils/timeline';
import {moment} from '../../../shared/utils/moment';
import {LinkContainer} from 'react-router-bootstrap';
import {calculateGradient} from 'redux/modules/seasons/difficultyScoreBuilder';
import {sort, renderSortDirection} from 'utils/sorting';

function fetchDataDeferred(getState, dispatch) {
  const promise = new Promise((resolve, reject) => {
    const promises = [];
    if (!isLocationsLoaded(getState())) {
      promises.push(dispatch(loadLoc()));
    }

    if (!isRestaurantsLoaded(getState())) {
      promises.push(dispatch(loadRest()));
    }

    if (!isLoaded(getState())) {
      promises.push(dispatch(loadTour()));
    }

    Promise.all(promises).then(values => resolve(values)).catch(error => reject(error));
  });

  return promise;
}

function getActions() {
  return {
    ...tourActions,
    loadRestaurants: loadRest,
    loadLocations: loadLoc
  };
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    tours: state.tours.data,
    editing: state.tours.editing,
    sorting: state.tours.sorting,
    error: state.tours.error,
    adding: state.tours.adding,
    loading: state.tours.loading,
    timelineDate: state.tours.currentDate,
    locations: state.locations.data,
    restaurants: state.restaurants.data
  }),
  getActions())
export default class Tours extends Component {
  static propTypes = {
    tours: PropTypes.array,
    sorting: PropTypes.array,
    restaurants: PropTypes.array,
    locations: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    sort: PropTypes.func.isRequired,
    loadLocations: PropTypes.func.isRequired,
    loadRestaurants: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    setTimelineDate: PropTypes.func.isRequired,
    timelineDate: PropTypes.string.isRequired
  };

  render() {
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const handleDelete = (tour) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(String(tour.id));
    };

    const {tours, locations, restaurants, loadLocations, loadRestaurants, error, loading, add, load, adding, setTimelineDate, sort: addSort, sorting} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };

    const {timelineDate} = this.props;
    const date = moment(timelineDate, moment.ISO_8601. true);

    const styles = require('./Tours.scss');
    const renderButtonCell = (tourId) => {
      return (
        <td className={styles.buttonCol}>
          <button className="btn btn-danger" onClick={handleDelete(tourId)}>
            <i className="fa fa-trash"/> Löschen
          </button>
          <LinkContainer to={'/tours/' + tourId}>
            <a className="btn btn-default">
              <i className="fa fa-trash"/> Details
            </a>
          </LinkContainer>
        </td>);
    };

    const renderTour = (tourViewModel) => {
      if (!isNaN(tourViewModel.distance)) {
        return (
          <tr key={tourViewModel.id}>
            <td className={styles.idCol}>{tourViewModel.id}</td>
            <td className={styles.nameCol}>{tourViewModel.name}</td>
            <td className={styles.typesCol}>{tourViewModel.types}</td>
            <td className={styles.difficultyCol}>{tourViewModel.difficulty}</td>
            <td className={styles.distanceCol}>{tourViewModel.distance}</td>
            <td className={styles.elevationCol}>{tourViewModel.elevation}</td>
            <td className={styles.gradientCol}>{`${(tourViewModel.gradient || 0).toFixed(2)} %`}</td>
            {renderButtonCell(tourViewModel.id)}
          </tr>);
      }

      return (
        <tr key={tourViewModel.id}>
          <td className={styles.idCol}>{tourViewModel.id}</td>
          <td className={styles.idCol}>{tourViewModel.name}</td>
          <td colSpan={5}/>
          {renderButtonCell(tourViewModel.id)}
        </tr>);
    };

    const createViewModel = (tour) => {
      const types = tour.types.map(type => type.label).join(',');
      const timeline = tour.timelines.find(time => timelineMatches(time, date));
      if (timeline) {
        return {
          id: tour.id,
          name: tour.name,
          types: types,
          difficulty: timeline.difficulty.label,
          distance: timeline.distance,
          elevation: timeline.elevation,
          gradient: calculateGradient(timeline.distance, timeline.elevation)
        };
      }

      return {
        id: tour.id,
        name: tour.name,
        types: types,
        difficulty: null,
        distance: null,
        elevation: null,
        gradient: null
      };
    };
    const renderColumnTitle = (id, name, className) => {
      return (
        <th className={className}>
          <a href="#" onClick={() => addSort(id)}>{name} {renderSortDirection(id, sorting)}</a>
        </th>
      );
    };

    const viewModels = tours ? sort(tours.map(createViewModel), sorting) : [];
    return (
      <div className={styles.restaurants + ' container'}>
        <h1>Touren
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Tours
        </button>
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={loadRestaurants}>
          <i className={refreshClassName}/> {' '} Reload Restaurants
        </button>
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={loadLocations}>
          <i className={refreshClassName}/> {' '} Reload Locations
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Touren'}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
          {' '}
          {error}
        </div>}

        <Timeline date={this.props.timelineDate} onTimelineChanged={changeTimeline}/>

        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            {renderColumnTitle('id', 'ID', styles.idCol)}
            {renderColumnTitle('name', 'Name', styles.nameCol)}
            {renderColumnTitle('types', 'Type', styles.typesCol)}
            {renderColumnTitle('difficulty', 'Schwierigkeit', styles.difficultyCol)}
            {renderColumnTitle('distance', 'Distanz', styles.distanceCol)}
            {renderColumnTitle('elevation', 'Höhenmeter', styles.elevationCol)}
            {renderColumnTitle('gradient', 'Anstieg', styles.gradientCol)}
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {viewModels.map(renderTour)}
            {adding ?
              <tr><td colSpan={5}><TourForm formKey="new" locations={locations} restaurants={restaurants} onSubmit={values => add(values)}/></td></tr> :
              <tr>
                <td colSpan={6}/>
                <td>
                  <button className="btn btn-success" onClick={handleAdd()}>
                    <i className="fa fa-plus"/> Add
                  </button>
                </td>
              </tr>
              }
          </tbody>
        </table>
      </div>
    );
  }
}
