import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as restaurantActions from 'redux/modules/restaurants';
import {RestaurantForm} from 'components';
import moment from 'moment';

@connect(
  null,
  ...restaurantActions)
export default class Restaurants extends Component {
  static propTypes = {
    locations: PropTypes.array.isRequired,
    restaurant: PropTypes.object.isRequired,
    timeline: PropTypes.string.isRequired,
    isEditing: PropTypes.bool.isRequired,
    del: PropTypes.func.isRequired,
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

    const renderLocation = (restaurant) => {
      const {locations} = this.props;
      if (locations && locations.length > 0) {
        const location = locations.find(loc => loc.id === restaurant.location);
        if (location) {
          return (<td className={styles.addressCol}>{location.address}
            <br/>
            {location.postalCode} {location.city}
            <br/>
            {location.latitude}/{location.longitude}
          </td>);
        }

        return (<td>Location not found</td>);
      }
    };

    const timelineHit = (timeline, date) => {
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

    const renderBuisnessHours = (businessHour) => {
      return (
        <div className="row">
          <div className="col-sm-4">{businessHour.weekday}</div>
          <div className="col-sm-8">{renderTime(businessHour.from)}-{renderTime(businessHour.until)}</div>
        </div>);
    };

    const renderTimeline = (restaurant) => {
      const {timeline} = this.props;
      const timelineDate = moment(timeline, moment.ISO_8601, true);

      const openingHours = restaurant.timelines.find(time => timelineHit(time, timelineDate));

      return [(<td className={styles.notesCol}>{openingHours && openingHours.phone}
        <br/>
        {openingHours && openingHours.notes}</td>),
        (<td className={styles.businessHours}>{openingHours && openingHours.businessHours && openingHours.businessHours.map(hour => renderBuisnessHours(hour))}
      </td>)];
    };

    const {restaurant, isEditing} = this.props;

    return (
      isEditing ?
        <RestaurantForm formKey={String(restaurant.id)} key={String(restaurant.id)} initialValues={restaurant}/> :
        <tr key={restaurant.id}>
          <td className={styles.idCol}>{restaurant.id}</td>
          <td className={styles.nameCol}>{restaurant.name}</td>
          {renderLocation(restaurant)}
          {renderTimeline(restaurant)}
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
