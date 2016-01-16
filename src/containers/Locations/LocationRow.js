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
    save: PropTypes.func.isRequired,
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

    const {location, isEditing, save} = this.props;
    const cityLine = (location.addressCounty ? (location.addressCounty + '-') : '') + (location.postalCode ? (location.postalCode + ' ') : '') + location.city;
    return (
      isEditing ?
        <LocationForm formKey={String(location.id)} key={String(location.id)} initialValues={location} onSubmit={values => save(values)}/> :
        <tr>
          <td className={styles.idCol}>
            {location.id}
          </td>
          <td className={styles.addressCol}>
            <div className="row">
              {location.name}
            </div>
            <div className="row">
              {location.identifier}
            </div>
          </td>
          <td className={styles.addressCol}>
            <div className="row">
              {location.streetAddress}
            </div>
            <div className="row">
              {cityLine}
            </div>
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
