import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as locationActions from 'redux/modules/locations';
import {NumberInput} from 'components';

@connect(
  state => ({
    saveError: state.restaurants.saveError
  }),
  dispatch => bindActionCreators(locationActions, dispatch)
)
@reduxForm({
  form: 'location',
  fields: ['id', 'name', 'identifier', 'streetAddress', 'addressCountry', 'postalCode', 'city', 'latitude', 'longitude']
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
    const { fields: {id, name, identifier, streetAddress, addressCountry, postalCode, city, latitude, longitude}, formKey, handleSubmit, invalid,
      submitting, saveError: { [formKey]: saveError }} = this.props;
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
          <input type="text" className="form-control" value={id.value} placeholder="ID" readOnly/>
          {id.error && id.touched && <div className="text-danger">{id.error}</div>}
        </td>
        <td className={styles.nameCol}>
          <div>
            <input type="text" className="form-control" {...name} placeholder="Bezeichnung"/>
            {name.error && name.touched && <div className="text-danger">{name.error}</div>}
          </div>
          <div>
            <input type="text" className="form-control" {...identifier} placeholder="Zusatz"/>
            {identifier.error && identifier.touched && <div className="text-danger">{identifier.error}</div>}
          </div>
        </td>
        <td className={styles.addressCol}>
          <div className="row">
            <div className="col-xs-12">
              <input type="text" className="form-control" {...streetAddress} placeholder="Adresse"/>
              {streetAddress.error && streetAddress.touched && <div className="text-danger">{streetAddress.error}</div>}
            </div>
          </div>
          <div className="row">
            <div className="col-xs-3">
              <input type="text" className="form-control" {...addressCountry} placeholder="Land" />
              {addressCountry.error && addressCountry.touched && <div className="text-danger">{addressCountry.error}</div>}
            </div>
            <div className="col-xs-3">
              <input type="text" className="form-control" {...postalCode} placeholder="PLZ"/>
              {postalCode.error && postalCode.touched && <div className="text-danger">{postalCode.error}</div>}
            </div>
            <div className="col-xs-6">
              <input type="text" className="form-control" {...city} placeholder="Ort"/>
              {city.error && city.touched && <div className="text-danger">{city.error}</div>}
            </div>
          </div>
        </td>
        <td className={styles.addressCol}>
          <NumberInput className="form-control" {...latitude} placeholder="Breite"/>
          {latitude.error && latitude.touched && <div className="text-danger">{latitude.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <NumberInput className="form-control" {...longitude} placeholder="Länge"/>
          {longitude.error && longitude.touched && <div className="text-danger">{longitude.error}</div>}
        </td>
        <td className={styles.buttonCol}>
          <button className="btn btn-default"
                  onClick={handleCancel(formKey)}
                  disabled={submitting}>
            <i className="fa fa-ban"/> Cancel
          </button>
          <button className="btn btn-success" onClick={handleSubmit} disabled={invalid || submitting}>
            <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
          </button>
          {saveError && <div className="text-danger">{saveError}</div>}
        </td>
      </tr>
    );
  }
}
