import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as locationActions from 'redux/modules/locations';

@connect(
  state => ({
    saveError: state.restaurants.saveError
  }),
  dispatch => bindActionCreators(locationActions, dispatch)
)
@reduxForm({
  form: 'location',
  fields: ['id', 'name', 'streetAddress', 'addressCountry', 'postalCode', 'city', 'latitude', 'longitude']
  // validate: restaurantValidation
})
export default class LocationForm extends Component {
  static propTypes = {
    fields: PropTypes.object.isRequired,
    editStop: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    pristine: PropTypes.bool.isRequired,
    save: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const { fields: {id, name, streetAddress, addressCountry, postalCode, city, latitude, longitude}, formKey, handleSubmit, save, invalid,
      pristine, submitting, saveError: { [formKey]: saveError }, values } = this.props;
    const handleCancel = (restaurant) => {
      if (restaurant && restaurant !== 'new') {
        const {editStop} = this.props; // eslint-disable-line no-shadow
        return () => editStop(restaurant);
      }

      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };

    const styles = require('containers/Locations/Locations.scss');
    return (
      <tr className={submitting ? styles.saving : ''}>
        <td className={styles.idCol}>
          <input type="text" className="form-control" {...id} onChange={event => id.onChange(parseInt(event.target.value, 10))} placeholder="ID" readOnly/>
          {id.error && id.touched && <div className="text-danger">{id.error}</div>}
        </td>
        <td className={styles.nameCol}>
          <input type="text" className="form-control" {...name} placeholder="Bezeichnung"/>
          {name.error && name.touched && <div className="text-danger">{name.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...streetAddress} placeholder="Adresse"/>
          {streetAddress.error && streetAddress.touched && <div className="text-danger">{streetAddress.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...addressCountry} placeholder="Land" />
          {addressCountry.error && addressCountry.touched && <div className="text-danger">{addressCountry.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...postalCode} placeholder="PLZ"/>
          {postalCode.error && postalCode.touched && <div className="text-danger">{postalCode.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...city} placeholder="Ort"/>
          {city.error && city.touched && <div className="text-danger">{city.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...latitude} placeholder="Breite"/>
          {latitude.error && latitude.touched && <div className="text-danger">{latitude.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...longitude} placeholder="Länge"/>
          {longitude.error && longitude.touched && <div className="text-danger">{longitude.error}</div>}
        </td>
        <td className={styles.buttonCol}>
          <button className="btn btn-default"
                  onClick={handleCancel(formKey)}
                  disabled={submitting}>
            <i className="fa fa-ban"/> Cancel
          </button>
          <button className="btn btn-success"
                  onClick={handleSubmit(() => save(values)
                    .then(result => {
                      if (result && typeof result.error === 'object') {
                        return Promise.reject(result.error);
                      }
                    })
                  )}
                  disabled={pristine || invalid || submitting}>
            <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
          </button>
          {saveError && <div className="text-danger">{saveError}</div>}
        </td>
      </tr>
    );
  }
}
