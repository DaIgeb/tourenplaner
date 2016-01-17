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
import {moment} from 'utils/moment';
import { LinkContainer } from 'react-router-bootstrap';

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
    loadLocations: PropTypes.func.isRequired,
    loadRestaurants: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    setTimelineDate: PropTypes.func.isRequired,
    timelineDate: PropTypes.string.isRequired,
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

    const {tours, locations, restaurants, loadLocations, loadRestaurants, error, loading, add, load, adding, setTimelineDate} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };

    const timelineMatches = (timeline, date) => {
      const fromDate = moment(timeline.from, moment.ISO_8601, true);
      const untilDate = moment(timeline.to, moment.ISO_8601, true);

      if (!date.isValid()) {
        return false;
      }

      if (!fromDate.isValid() && timeline.from) {
        return false;
      }
      if (!untilDate.isValid() && timeline.until) {
        return false;
      }

      if (fromDate.isValid() && fromDate > date) {
        return false;
      }

      if (untilDate.isValid() && untilDate < date) {
        return false;
      }

      return true;
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

    const renderTour = (tour) => {
      const timeline = tour.timelines.find(time => timelineMatches(time, date));
      if (timeline) {
        const types = tour.types.map(type => type.label).join(',');
        return (
          <tr key={tour.id}>
            <td className={styles.idCol}>{tour.id}</td>
            <td className={styles.nameCol}>{tour.name}</td>
            <td className={styles.typesCol}>{types}</td>
            <td className={styles.difficultyCol}>{timeline.difficulty.label}</td>
            <td className={styles.distanceCol}>{timeline.distance}</td>
            <td className={styles.elevationCol}>{timeline.elevation}</td>
            {renderButtonCell(tour.id)}
          </tr>);
      }

      return (
        <tr key={tour.id}>
          <td className={styles.idCol}>{tour.id}</td>
          <td className={styles.idCol}>{tour.name}</td>
          <td colSpan={4}/>
          {renderButtonCell(tour.id)}
        </tr>);
    };

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
            <th className={styles.idCol}>ID</th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.typesCol}>Type</th>
            <th className={styles.difficultyCol}>Schwierigkeit</th>
            <th className={styles.distanceCol}>Distanz</th>
            <th className={styles.elevationCol}>Höhenmeter</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {tours && tours.map(tour => renderTour(tour))}
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
