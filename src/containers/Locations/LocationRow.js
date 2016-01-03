import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as locationActions from 'redux/modules/locations';
import {LocationForm} from 'components';

@connect(
  null,
  ...locationActions)
export default class LocationRow extends Component {
  static propTypes = {
    location: PropTypes.object.isRequired,
    isEditing: PropTypes.bool.isRequired,
    del: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };

  render() {
    const styles = require('./Locations.scss');

    const handleEdit = (location) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(location.id));
    };
    const handleDelete = (location) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(String(location.id));
    };

    const {location, isEditing} = this.props;
    return (
      isEditing ?
        <LocationForm formKey={String(location.id)} key={String(location.id)} initialValues={location}/> :
        <tr key={location.id}>
          <td className={styles.idCol}>
            {location.id}
          </td>
          <td className={styles.addressCol}>
            {location.name}
          </td>
          <td className={styles.addressCol}>
            {location.streetAddress}
          </td>
          <td className={styles.addressCol}>
            {location.addressCountry}
          </td>
          <td className={styles.addressCol}>
            {location.postalCode}
          </td>
          <td className={styles.addressCol}>
            {location.city}
          </td>
          <td className={styles.addressCol}>
            {location.latitude}
          </td>
          <td className={styles.addressCol}>
            {location.longitude}
          </td>
          <td className={styles.buttonCol}>
            <button className="btn btn-primary" onClick={handleEdit(location)}>
              <i className="fa fa-pencil"/> Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete(location)}>
              <i className="fa fa-trash"/> Löschen
            </button>
          </td>
        </tr>);
  }
}