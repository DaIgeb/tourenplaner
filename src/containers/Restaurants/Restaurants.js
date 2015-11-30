import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as restaurantActions from 'redux/modules/restaurants';
import {isLoaded as isLocationsLoaded, load as loadLocations} from 'redux/modules/locations';
import {isLoaded, load as loadRestaurants} from 'redux/modules/restaurants';
import {RestaurantForm, Timeline} from 'components';
import RestaurantRow from './RestaurantRow';

function fetchDataDeferred(getState, dispatch) {
  const promise = new Promise((resolve, reject) => {
    const promises = [];
    if (!isLocationsLoaded(getState())) {
      promises.push(dispatch(loadLocations()));
    }

    if (!isLoaded(getState())) {
      promises.push(dispatch(loadRestaurants()));
    }

    Promise.all(promises).then(values => resolve(values)).catch(error => reject(error));
  });

  return promise;
}

function getActions() {
  return {
    ...restaurantActions,
    loadLoc: loadLocations
  };
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    restaurants: state.restaurants.data,
    editing: state.restaurants.editing,
    error: state.restaurants.error,
    adding: state.restaurants.adding,
    loading: state.restaurants.loading,
    timelineDate: state.restaurants.currentDate,
    locations: state.locations.data
  }),
  getActions())
export default class Restaurants extends Component {
  static propTypes = {
    restaurants: PropTypes.array,
    locations: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    loadLoc: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    setTimelineDate: PropTypes.func.isRequired,
    timelineDate: PropTypes.string.isRequired
  };

  render() {
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const {restaurants, loadLoc, locations, error, editing, loading, load, adding, setTimelineDate, timelineDate} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }
    const changeTimeline = (momentDate) => {
      if (momentDate.isValid()) {
        setTimelineDate(momentDate.format());
      }
    };

    const styles = require('./Restaurants.scss');
    return (
      <div className={styles.restaurants + ' container'}>
        <h1>Restaurants
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Restaurants
        </button>
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={loadLoc}>
          <i className={refreshClassName}/> {' '} Reload Locations
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Restaurants'}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}

        <Timeline date={this.props.timelineDate} onTimelineChanged={changeTimeline}/>

        {restaurants && restaurants.length &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.addressCol}>Anschrift<br/>Koordinaten</th>
            <th className={styles.notesCol}>Telefon<br/>Notizen</th>
            <th className={styles.businessHours}>Öffnungszeiten</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
            {restaurants.map(restaurant => (<RestaurantRow key={String(restaurant.id)} restaurant={restaurant} isEditing={editing[restaurant.id]} timeline={timelineDate} locations={locations}/>))}
            {adding ?
              <RestaurantForm formKey="new" key="new" initialValues={adding}/> :
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
