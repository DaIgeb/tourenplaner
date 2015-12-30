import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import seasonConfigurationFormValidation from './seasonConfigurationFormValidation';
import * as seasonActions from 'redux/modules/seasons';
import {DateInput} from 'components';

function asyncValidate(data) {
  // TODO: figure out a way to move this to the server. need an instance of ApiClient
  if (!data.email) {
    return Promise.resolve({});
  }
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const errors = {};
      let valid = true;
      if (~['bobby@gmail.com', 'timmy@microsoft.com'].indexOf(data.email)) {
        errors.email = 'Email address already used';
        valid = false;
      }
      if (valid) {
        resolve();
      } else {
        reject(errors);
      }
    }, 1000);
  });
}

@connect(
  state => ({
    saveError: state.seasons.saveError
  }),
  seasonActions
)
@reduxForm({
  form: 'seasons',
  fields: [
    'year',
    'seasonStart',
    'seasonEnd',
    'holidayStart',
    'holidayEnd',
    'eveningStart',
    'eveningEnd'
  ],
  validate: seasonConfigurationFormValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SeasonConfigurationForm extends Component {
  static propTypes = {
    active: PropTypes.string,
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    dirty: PropTypes.bool.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    save: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    pristine: PropTypes.bool.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    values: PropTypes.object.isRequired
  };

  render() {
    const {
      asyncValidating,
      fields: {year, seasonStart, seasonEnd, holidayStart, holidayEnd, eveningStart, eveningEnd},
      handleSubmit,
      resetForm,
      invalid,
      onCancel,
      onBack,
      submitting
      } = this.props;

    const styles = require('./SeasonConfigurationForm.scss');
    const renderInput = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-9 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <input type={type} className="form-control" id={field.name} {...field} {...attributes}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;
    const renderDate = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-9 ' + styles.inputGroup}>
          {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
          <DateInput className="form-control" id={field.name} {...field} {...attributes} displayFormat="L"/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(year, 'Jahr', null, 'number', {readOnly: true})}
          {renderDate(seasonStart, 'Erste Tour')}
          {renderDate(seasonEnd, 'Letzte Tour')}
          {renderDate(holidayStart, 'Ferientour Start')}
          {renderDate(holidayEnd, 'Ferientour Ende')}
          {renderDate(eveningStart, 'Abendtour Start')}
          {renderDate(eveningEnd, 'Abendtour Ende')}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={invalid || submitting}>
                <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
              </button>
              <button className="btn btn-default" onClick={resetForm} style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </button>
              <button className="btn btn-primary"
                      onClick={onBack}
                      disabled={submitting}
                      style={{marginLeft: 15}}>
                <i className="fa fa-ban"/> Zurück
              </button>
              <button className="btn btn-warning"
                      onClick={onCancel}
                      disabled={submitting}
                      style={{marginLeft: 15}}>
                <i className="fa fa-ban"/> Abbrechen
              </button>
            </div>
          </div>
        </form>
      </div>);
  }
}
