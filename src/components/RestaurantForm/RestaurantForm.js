import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as restaurantActions from 'redux/modules/restaurants';
// import {ObjectSelect} from 'components';

@connect(
  state => ({
    saveError: state.restaurants.saveError
  }),
  dispatch => bindActionCreators(restaurantActions, dispatch)
)
@reduxForm({
  form: 'restaurant',
  fields: ['id', 'location', 'name', 'address', 'zipCode', 'city', 'phone', 'notes'],
  // validate: restaurantValidation
})
export default class RestaurantForm extends Component {
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
    values: PropTypes.object.isRequired,
    locations: PropTypes.array.isRequired
  };

  render() {
    const { fields: {id, name, address, zipCode, city, phone, notes, location}, locations, formKey, handleSubmit, save, invalid,
      pristine, submitting, saveError: { [formKey]: saveError }, values } = this.props;
    const handleCancel = (restaurant) => {
      if (restaurant && restaurant !== 'new') {
        const {editStop} = this.props; // eslint-disable-line no-shadow
        return () => editStop(restaurant);
      }

      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };
    const styles = require('containers/Restaurants/Restaurants.scss');
    return (
      <tr className={submitting ? styles.saving : ''}>
        <td className={styles.idCol}>{id.value}</td>
        <td className={styles.nameCol}>
          <input type="text" className="form-control" {...name} />
          {name.error && name.touched && <div className="text-danger">{name.error}</div>}
        </td>
        <td className={styles.addressCol}>
          <select
            className="form-control"
            {...location}>
            {locations.map(option => <option key={option.id} value={JSON.stringify(option.id)}>{option.name}</option>)}
          </select>
        </td>
        <td className={styles.addressCol}>
          <input type="text" className="form-control" {...address}/>
          {address.error && address.touched && <div className="text-danger">{address.error}</div>}
          <br/>
          <input type="text" className="form-control" {...zipCode}/>
          {zipCode.error && zipCode.touched && <div className="text-danger">{zipCode.error}</div>}
          <input type="text" className="form-control" {...city}/>
          {city.error && city.touched && <div className="text-danger">{city.error}</div>}
        </td>
        <td className={styles.notesCol}>
        <input type="text" className="form-control" {...phone}/>
        {phone.error && phone.touched && <div className="text-danger">{phone.error}</div>}
        <br/>
        <input type="text" className="form-control" {...notes}/>
        {notes.error && notes.touched && <div className="text-danger">{notes.error}</div>}
        </td>
        <td className={styles.businessHours}></td>
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
