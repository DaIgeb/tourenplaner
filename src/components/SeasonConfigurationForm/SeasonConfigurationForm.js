import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import seasonConfigurationFormValidation from './seasonConfigurationFormValidation';
import * as seasonActions from 'redux/modules/seasons';
import {DateInput} from 'components';

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
    'eveningStart',
    'eveningEnd',
    'events[].from',
    'events[].to',
    'events[].name',
    'dates[].date',
    'dates[].type',
    'dates[].description',
    'specialDates[].date',
    'specialDates[].name',
    'specialDates[].action',
    'specialDates[].tours[].name',
    'specialDates[].tours[].type'
  ],
  validate: seasonConfigurationFormValidation
})
export default class SeasonConfigurationForm extends Component {
  static propTypes = {
    active: PropTypes.string,
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
      fields: {year, seasonStart, seasonEnd, eveningStart, events, eveningEnd},
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
          <input type={type} className="form-control" id={field.name} {...field} {...attributes}/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;
    const renderDate = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-9 ' + styles.inputGroup}>
          <DateInput className="form-control" id={field.name} {...field} {...attributes} displayFormat="L"/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(year, 'Jahr', null, 'number', {readOnly: true})}
          {renderDate(seasonStart, 'Erste Tour', 'text', {autoFocus: true})}
          {renderDate(seasonEnd, 'Letzte Tour')}
          {renderDate(eveningStart, 'Abendtour Start')}
          {renderDate(eveningEnd, 'Abendtour Ende')}
          <div style={{textAlign: 'center', margin: '10px'}}>
            <button className="btn btn-success" onClick={event => {
              event.preventDefault(); // prevent form submission
              events.addField();    // pushes empty child field onto the end of the array
            }}><i className="fa fa-plus"/> Event hinzufügen
            </button>
          </div>
          {(!events || !events.length) && <div className="form-group"><div className="col-xs-12">Keine Events</div></div>}
          {events && events.map((child, index) => <div key={index}>
            <div className="form-group">
              {renderDate(child.from, null, 'text', 'col-xs-3', {placeholder: 'Von'})}
              {renderDate(child.to, null, 'text', 'col-xs-3', {placeholder: 'Bis'})}
              {renderInput(child.name, null, 'text', 'col-xs-3', {placeholder: 'Name'})}
              <div className="col-xs-1">
                <button className="btn btn-danger" onClick={event => {
                  event.preventDefault();       // prevent form submission
                  events.removeField(index);  // remove from index
                }}><i className="fa fa-trash"/> Löschen
                </button>
              </div>
            </div>
          </div>)}
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
