import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as restaurantActions from 'redux/modules/restaurants';
import {RestaurantForm} from 'components';
import {moment} from 'utils/moment';

@connect(
  null,
  ...restaurantActions)
export default class RestaurantRow extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    restaurant: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    timeline: PropTypes.string.isRequired,
    del: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const styles = require('./Restaurants.scss');

    const handleEdit = (restaurant) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(restaurant.id));
    };
    const handleDelete = (restaurant) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(String(restaurant.id));
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

    const renderTime = (time) => {
      const hour = ('00' + time.hour);
      const minute = ('00' + time.minute);

      return `${hour.substr(hour.length - 2)}:${minute.substr(minute.length - 2)}`;
    };

    const {restaurant, timeline, isEditing, locations, save} = this.props;
    const timelineDate = moment(timeline, moment.ISO_8601, true);

    const openingHours = restaurant.timelines.find(time => timelineMatches(time, timelineDate));

    const renderLocation = () => {
      if (locations && locations.length > 0) {
        const location = locations.find(loc => loc.id === restaurant.location);
        if (location) {
          return (<td className={styles.addressCol}>
            {location.name}<br/>
            {location.streetAddress}<br/>
            {location.addressCountry ? `${location.addressCountry}-` : ''}{location.postalCode} {location.city}
          </td>);
        }

        return (<td>Location not found</td>);
      }
    };

    const renderBusinessHour = (businessHour, idx) => {
      return (
        <div className="row" key={idx}>
          <div className="col-sm-4">{businessHour.weekday}</div>
          <div className="col-sm-8">{renderTime(businessHour.from)}-{renderTime(businessHour.until)}</div>
        </div>);
    };

    const renderTimeline = () => {
      return (
        <td className={styles.notesCol}>
          {openingHours && openingHours.phone}
          <br/>
          {openingHours && openingHours.notes}
        </td>);
    };

    const renderBusinessHours = () => {
      return (
        <td className={styles.businessHours}>
          {openingHours && openingHours.businessHours && openingHours.businessHours.map((hour, idx) => renderBusinessHour(hour, idx))}
        </td>);
    };

    return (
      isEditing ?
        <RestaurantForm formKey={String(restaurant.id)} key={String(restaurant.id)} initialValues={restaurant} locations={locations} onSubmit={data => save(data)}/> :
        <tr>
          <td className={styles.idCol}>{restaurant.id}</td>
          {renderLocation()}
          {renderTimeline()}
          {renderBusinessHours()}
          <td className={styles.buttonCol}>
            <button className="btn btn-primary" onClick={handleEdit(restaurant)}>
              <i className="fa fa-pencil"/> Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete(restaurant)}>
              <i className="fa fa-trash"/> Löschen
            </button>
          </td>
        </tr>);
  }
}
