import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import seasonConfigurationFormValidation from './seasonConfigurationDatesFormValidation';
import * as seasonActions from 'redux/modules/seasons';
import {TourType, SpecialDateAction} from 'redux/modules/seasons';
import {ObjectSelect, DateInput} from 'components';

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
    'eveningEnd',
    'events[].from',
    'events[].to',
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
export default class SeasonConfigurationDatesForm extends Component {
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
      fields: {year, specialDates, dates},
      handleSubmit,
      resetForm,
      invalid,
      onCancel,
      onBack,
      submitting
      } = this.props;

    const styles = require('./SeasonConfigurationDatesForm.scss');
    const renderField = (field, showAsyncValidating, type, classNames, attributes = null) =>
      <div className={classNames}>
        <input type={type} className="form-control" id={field.name} {...field} {...attributes}/>
        {field.error && field.touched && <div className="text-danger">{field.error}</div>}
      </div>;
    const renderOptionField = (field, options, showAsyncValidating, type, classNames, attributes = null) =>
      <div className={classNames}>
        <ObjectSelect {...field} {...attributes} options={options}/>
        {field.error && field.touched && <div className="text-danger">{field.error}</div>}
      </div>;
    const renderInput = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        {renderField(field, showAsyncValidating, type, 'col-sm-4 ' + styles.inputGroup, attributes)}
      </div>;
    const renderOption = (field, label, options, labelClass, valueClass) => <div className={(field.error && field.touched ? ' has-error' : '')}>
      <label htmlFor={field.name} className={labelClass}>{label}</label>
      <div className={valueClass + ' ' + styles.inputGroup}>
        <ObjectSelect {...field} options={options} />
      </div>
    </div>;
    const renderDate = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={(field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-1">{label}</label>
        <div className={'col-sm-2 ' + styles.inputGroup}>
          <DateInput className="form-control" id={field.name} {...field} {...attributes} displayFormat="L"/>
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>;
    const tourTypeOptions = [
      TourType.none,
      TourType.morning,
      TourType.afternoon,
      TourType.evening,
      TourType.fullday
    ];

    const renderDateInput = (date, field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div>
        {renderDate(field, 'Datum', showAsyncValidating, type, 'col-sm-2 ' + styles.inputGroup, attributes)}
        <div className={(date.type.error && date.type.touched ? ' has-error' : '')}>
          {renderOption(date.type, 'Type', tourTypeOptions, 'col-sm-1', 'col-sm-3')}
        </div>
        <div className={(date.description.error && date.description.type.touched ? ' has-error' : '')}>
          <label htmlFor={date.description.name} className="col-sm-2">Bezeichnung</label>
          {renderField(date.description, null, 'text', 'col-sm-3 ' + styles.inputGroup)}
        </div>
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(year, 'Jahr', null, 'number', {readOnly: true})}
          <div style={{maxHeight: '500px', overflowY: 'scroll'}}>
            {dates.map((date, index) => <div key={index} className="col-xs-11">{renderDateInput(date, date.date, 'Datum')}</div>)}
          </div>
          <div style={{textAlign: 'center', margin: '10px'}}>
            <button className="btn btn-success" onClick={event => {
              event.preventDefault(); // prevent form submission
              specialDates.addField();    // pushes empty child field onto the end of the array
            }}><i className="fa fa-plus"/> Ausnahme hinzufügen
            </button>
          </div>
          {(!specialDates || !specialDates.length) && <div className="form-group"><div className="col-xs-12">Keine Ausnahmen</div></div>}
          {specialDates && specialDates.map((child, index) => <div key={index}>
            <div className="form-group">
              {renderDate(child.date, null, 'text', 'col-xs-3', {placeholder: 'Datum'})}
              {renderField(child.name, null, 'text', 'col-xs-3', {placeholder: 'Bezeichnung'})}
              <div className="col-xs-2">
                <button className="btn btn-success" onClick={event => {
                  event.preventDefault(); // prevent form submission
                  child.tours.addField();    // pushes empty child field onto the end of the array
                }}><i className="fa fa-plus"/> Tour hinzufügen
                </button>
              </div>
              {renderOptionField(child.action, [SpecialDateAction.add, SpecialDateAction.remove, SpecialDateAction.replace], null, 'text', 'col-xs-2', {placeholder: 'Action'})}
              <div className="col-xs-1">
                <button className="btn btn-danger" onClick={event => {
                  event.preventDefault();       // prevent form submission
                  specialDates.removeField(index);  // remove from index
                }}><i className="fa fa-trash"/> Löschen
                </button>
              </div>
            </div>
            {child.tours.map((tour, tourIndex) => <div key={tourIndex}>
              <div className="form-group">
                <label className="col-xs-2 col-xs-offset-1 control-label">Tour #{tourIndex + 1}</label>
                {renderOptionField(tour.type, tourTypeOptions, null, 'text', 'col-xs-2', {placeholder: 'Type'})}
                {renderField(tour.name, null, 'text', 'col-xs-5', {placeholder: 'Tour'})}
                <div className="col-xs-1">
                  <button className="btn btn-danger" onClick={event => {
                    event.preventDefault();               // prevent form submission
                    child.tours.removeField(tourIndex); // remove from awardIndex
                  }}><i className="fa fa-trash"/>
                  </button>
                </div>
              </div>
            </div>)}
          </div>)}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={invalid || submitting}>
                <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Plan erstellen
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
