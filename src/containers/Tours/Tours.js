import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as tourActions from 'redux/modules/tours';
import {isLoaded, load as loadTour} from 'redux/modules/tours';
import {isLoaded as isRestaurantsLoaded, load as loadRest} from 'redux/modules/restaurants';
import {isLoaded as isLocationsLoaded, load as loadLoc} from 'redux/modules/locations';
import {Timeline} from 'components';

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
    const {tours, loadLocations, loadRestaurants, error, loading, load, adding, setTimelineDate} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };
    console.log(tours);

    const styles = require('./Tours.scss');
    return (
      <div className={styles.restaurants + ' container'}>
        <h1>Restaurants
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

        {tours && tours.length &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.addressCol}>Name</th>
            <th className={styles.notesCol}>Type</th>
            <th className={styles.notesCol}>Schwierigkeit</th>
            <th className={styles.notesCol}>Distanz</th>
            <th className={styles.notesCol}>Höhenmeter</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {tours.map(tour => (<div key={tour.id}>{tour.name}</div>))}
            {adding ?
              <div>Form</div> :
              <tr key="new">
                <td colSpan={5}/>
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
