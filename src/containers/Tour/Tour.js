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

    if (!tours) {
      return <div>Loading</div>;
    }
    const idNumber = parseInt(id, 10);
    const tour = tours.find(item => item.id === idNumber);
    if (!tour) {
      return <div>Invalid tour</div>;
    }

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

    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };

    const timelineMatches = (timeline, date) => {
      const fromDate = moment(timeline.from, moment.ISO_8601, true);
      const untilDate = moment(timeline.until, moment.ISO_8601, true);

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
    const restaurantsInTour = timeline.restaurants.map(rest => restaurants.find(item => item.id === rest));
    const renderLocation = (location, idx) => {
      const restaurant = restaurantsInTour.find(item => item.location === location.id);
      let primaryResult;
      if (restaurant) {
        const restTimeline = restaurant.timelines.find(tl => timelineMatches(tl, date));
        primaryResult = <b key={idx}>{location.city} ({location.name}/{restTimeline && restTimeline.phone})</b>;
      } else {
        primaryResult = <span key={idx}>{location.name}</span>;
      }

      const mapsUrl = `http://www.google.com/maps/place/${location.latitude},${location.longitude}`;
      primaryResult = <a href={mapsUrl} target="_blank">{primaryResult}</a>;
      if (idx === timeline.locations.length - 1) {
        return primaryResult;
      }

      return [primaryResult, <span> - </span>];
    };
    const locationsInTour = timeline.locations.map(loc => locations.find(item => item.id === loc));
    const foreignCountry = locationsInTour.find(loc => loc.addressCountry && loc.addressCountry !== 'CH');
    const startRoute = tours.find(item => item.id === timeline.startroute);
    const startRouteLocations = startRoute ? startRoute.timelines.find(tl => timelineMatches(tl, date)).locations.map(loc => locations.find(item => item.id === loc)) : [];
    const mapsUrl = `http://osm.quelltextlich.at/viewer-js.html?kml_url==http://rvw-tourenplaner.herokuapp.com/api/tour/kml/${tour.id}`;
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

        <div className="row">
          <div className="col-xs-4">{tour.types.map(type => type.label).join(', ')}</div>
          <div className="col-xs-4">{moment(timeline.from, moment.ISO_8601. true).format('L')}</div>
          <div className="col-xs-4">{moment(timeline.until, moment.ISO_8601. true).format('L')}</div>
          {startRoute && <div className="col-xs-4">{startRoute.name}</div>}
          <div className="col-xs-4">{timeline.restaurants.map((rest, idx) => <span key={idx}>{locations.find(loc => loc.id === restaurants.find(item => item.id === rest).location).name}</span>)}</div>
          <div className="col-xs-4">{timeline.elevation}</div>
          <div className="col-xs-4">{timeline.difficulty.label}</div>
        </div>
        <div className="row">
          <h4>Tourenbeschrieb</h4>
        </div>
        <div className="row">
          <div className="col-xs-1">
            <b>{tour.name} {foreignCountry && '(ID)'}</b><br/>
            ca {timeline.distance} km<br />
            ca {timeline.elevation} hm</div>
          {startRoute && <div className="col-xs-2">{startRoute.name}</div>}
          <div className="col-xs-9">
            {startRouteLocations.map(renderLocation)}<br/>
            {locationsInTour.map(renderLocation)}</div>
        </div>
        <div className="row">
          <a className="btn btn-primary" href={mapsUrl}>AAuf Google MAPS anschaun</a>
          <button className="btn btn-primary" onClick={handleEditStart(id)}>
            <i className="fa fa-pencil"/> Edit
          </button>
        </div>
      </div>
    );
  }
}
