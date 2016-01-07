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
    ...tourActions
  };
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    id: state.router.params.id,
    editing: state.tours.editing,
    error: state.tours.error,
    adding: state.tours.adding,
    loading: state.tours.loading,
    timelineDate: state.tours.currentDate,
    tours: state.tours.data,
    locations: state.locations.data,
    restaurants: state.restaurants.data
  }),
  getActions())
export default class Tour extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    tours: PropTypes.array,
    restaurants: PropTypes.array,
    locations: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    adding: PropTypes.object,
    save: PropTypes.func.isRequired,
    load: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    setTimelineDate: PropTypes.func.isRequired,
    timelineDate: PropTypes.string.isRequired
  };

  render() {
    const handleEditStart = (id) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(id);
    };
    const {id, tours, save, error, editing, restaurants, locations, timelineDate, setTimelineDate} = this.props;

    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };
    if (!tours) {
      return <div>Loading</div>;
    }
    const idNumber = parseInt(id, 10);
    const tour = tours.find(item => item.id === idNumber);
    if (!tour) {
      return <div>Invalid tour</div>;
    }
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
    const date = moment(timelineDate, moment.ISO_8601. true);
    const timeline = tour.timelines ? tour.timelines.find(tl => timelineMatches(tl, date)) : null;

    const styles = require('./Tour.scss');
    if (editing[id]) {
      return (
        <div className={styles.restaurants + ' container'}>
        <h1>Tour: {tour.name}</h1>
        <DocumentMeta title={config.app.title + ': Tour ' + tour.name}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
          {' '}
          {error}
        </div>}

        <TourForm formKey={id} initialValues={tour} locations={locations} restaurants={restaurants} onSubmit={values => save(values)}/>
      </div>);
    }

    return (
      <div className={styles.restaurants + ' container'}>
        <h1>Tour: {tour.name}
          <LinkContainer to="/tours">
            <button className="btn btn-primary">
              <i className="fa fa-pencil"/> Zurück
            </button>
          </LinkContainer>
        </h1>
        <DocumentMeta title={config.app.title + ': Tour ' + tour.name}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
          {' '}
          {error}
        </div>}

        <Timeline date={this.props.timelineDate} onTimelineChanged={changeTimeline}/>

        <div>
          {!timeline && <div>No Timeline available</div>}
          {timeline && <div>{timeline.from}</div>}
          {tour.name}
          <button className="btn btn-primary" onClick={handleEditStart(id)}>
            <i className="fa fa-pencil"/> Edit
          </button>
        </div>
      </div>
    );
  }
}
