import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as restaurantActions from 'redux/modules/restaurants';
import {LocationInput, DateInput, WeekdayInput, NumberInput} from 'components';

@connect(
  state => ({
    saveError: state.restaurants.saveError
  }),
  dispatch => bindActionCreators(restaurantActions, dispatch)
)
@reduxForm({
  form: 'restaurant',
  fields: [
    'id',
    'location',
    'timelines[].from',
    'timelines[].until',
    'timelines[].notes',
    'timelines[].phone',
    'timelines[].businessHours[].weekday',
    'timelines[].businessHours[].from',
    'timelines[].businessHours[].until'
  ],
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
    submitting: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    formKey: PropTypes.string.isRequired,
    locations: PropTypes.array.isRequired
  };

  render() {
    const { fields: {id, location, timelines}, formKey, handleSubmit, invalid,
      pristine, submitting, saveError: { [formKey]: saveError } } = this.props;
    const handleCancel = (restaurant) => {
      if (restaurant && restaurant !== 'new') {
        const {editStop} = this.props; // eslint-disable-line no-shadow
        return () => editStop(restaurant);
      }

      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };
    const styles = require('containers/Restaurants/Restaurants.scss');

    const renderTime = time => {
      let minute = 0;
      let hour = 0;
      if (time.value) {
        hour = time.value.hour;
        minute = time.value.minute;
      }

      return (<div className="row">
        <div className="col-xs-5">
          <NumberInput className="form-control" value={hour} onChange={newHour => time.onChange({hour: newHour, minute: minute})}/>
        </div>
        <div className="col-xs-1">:</div>
        <div className="col-xs-5">
          <NumberInput className="form-control" value={minute} onChange={newMinute => time.onChange({hour: hour, minute: newMinute})}/>
        </div>
      </div>);
    };
    const renderBusinessHour = (businessHour, idx) => {
      return [(
        <tr key={idx + '/from'}>
          <td className="col-xs-4"><WeekdayInput className="form-control" {...businessHour.weekday}/></td>
          <td className="col-xs-8">{renderTime(businessHour.from)}</td>
        </tr>),
        (<tr key={idx + '/until'}>
          <td/>
          <td>{renderTime(businessHour.until)}</td>
        </tr>)];
    };
    const renderTimeline = (timeline, idx) => {
      const {phone, notes, from, until, businessHours} = timeline;
      return [(
        <tr key={idx + '/timeline'}>
            <td className="col-xs-4">
              <DateInput className="form-control" displayFormat="L" {...from} placeholder="Von"/>
            </td>
            <td className="col-xs-4">
              <DateInput className="form-control" displayFormat="L" {...until} placeholder="Bis"/>
            </td>
            <td className="col-xs-4" />
          </tr>),
        (<tr key={idx + '/data'} >
        <td className={styles.notesCol}>
          <input type="text" className="form-control" {...phone} placeholder="Telefon"/>
          {phone.error && phone.touched && <div className="text-danger">{phone.error}</div>}
        </td>
        <td colSpan={2}>
          <textarea rows={4} className="form-control" {...notes} placeholder="Notiz"/>
          {notes.error && notes.touched && <div className="text-danger">{notes.error}</div>}
        </td>
      </tr>),
        (<tr key={idx + '/businessHours'} >
          <td colSpan={3}>
              <table className="table table-condensed">
                <tbody>
                {businessHours && businessHours.map(renderBusinessHour)}
                <tr>
                  <td colSpan={2} />
                  <td>
                    <button className="btn btn-success" onClick={() => businessHours.addField()}>
                      <i className="fa fa-plus"/> Add Business Hour
                    </button>
                  </td>
                </tr>
                </tbody>
              </table>
          </td>
        </tr>)];
    };
    return (
      <tr className={submitting ? styles.saving : ''}>
        <td className={styles.idCol}>{id.value}</td>
        <td className={styles.addressCol}>
          <LocationInput className="form-control" {...location} />
        </td>
        <td className={styles.notesCol} colSpan={2}>
          {timelines && timelines.length && <table className="table table-condensed"><tbody>{timelines.map(renderTimeline)}</tbody></table>}
        </td>
        <td className={styles.buttonCol}>
          <button className="btn btn-default"
                  onClick={handleCancel(formKey)}
                  disabled={submitting}>
            <i className="fa fa-ban"/> Cancel
          </button>
          <button className="btn btn-success" onClick={() => timelines.addField()}>
            <i className="fa fa-plus"/> Add Timeline
          </button>
          <button className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={(pristine && formKey !== 'new') || invalid || submitting}>
            <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
          </button>
          {saveError && <div className="text-danger">{saveError}</div>}
        </td>
      </tr>
    );
  }
}
