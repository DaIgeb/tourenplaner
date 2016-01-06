import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as tourActions from 'redux/modules/tours';
import {DateInput, NumberInput, ObjectSelect} from 'components';
import {TourType, Difficulty} from 'models';

@connect(
  state => ({
    saveError: state.tours.saveError
  }),
  dispatch => bindActionCreators(tourActions, dispatch)
)
@reduxForm({
  form: 'tour',
  fields: [
    'id',
    'name',
    'timelines[].from',
    'timelines[].to',
    'timelines[].types',
    'timelines[].difficulty',
    'timelines[].distance',
    'timelines[].elevation',
    'timelines[].restaurant',
    'timelines[].locations[]'
  ],
  // validate: restaurantValidation
})
export default class TourForm extends Component {
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
    locations: PropTypes.array.isRequired,
    restaurants: PropTypes.array.isRequired
  };

  render() {
    const { fields: {id, name, timelines}, restaurants, locations, formKey, handleSubmit, invalid,
      submitting, saveError: { [formKey]: saveError } } = this.props;

    const tourTypeOptions = [
      TourType.none,
      TourType.morning,
      TourType.afternoon,
      TourType.evening,
      TourType.fullday
    ];

    const difficultyOptions = [
      Difficulty.easy,
      Difficulty.medium,
      Difficulty.difficult
    ];

    const handleCancel = (tourId) => {
      if (tourId && tourId !== 'new') {
        const {editStop} = this.props; // eslint-disable-line no-shadow
        return () => editStop(tourId);
      }

      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };

    const styles = require('./TourForm.scss');
    const renderInputControl = (field, type = 'text', attributes = null) => {
      return (<input type={type} className="form-control" id={field.name} {...field} {...attributes}/>);
    };
    const renderDateControl = (field, attributes = null) => {
      return (<DateInput className="form-control" id={field.name} {...field} {...attributes} displayFormat="L"/>);
    };
    const renderNumberControl = (field, attributes = null) => {
      return (<NumberInput className="form-control" id={field.name} {...field} {...attributes}/>);
    };
    const renderObjectSelectControl = (field, options, attributes = null) => {
      return <ObjectSelect {...field} {...attributes} options={options}/>;
    };
    const renderInput = (field, label, control) => {
      return (<div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        <div className={'col-sm-9 ' + styles.inputGroup}>
          {control}
          {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        </div>
      </div>);
    };

    const renderDate = (field, label, attributes = null) => renderInput(field, label, renderDateControl(field, attributes));

    const findLocation = (locationId) => locations.find(loc => loc.id === locationId);

    return (
      <div>
        {saveError && <div className="text-danger">{saveError}</div>}

        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
          {renderInput(name, 'Name', renderInputControl(name))}
          <div style={{textAlign: 'center', margin: '10px'}}>
            <button className="btn btn-success" onClick={event => {
              event.preventDefault(); // prevent form submission
              timelines.addField();    // pushes empty child field onto the end of the array
            }}><i className="fa fa-plus"/> Version hinzufügen
            </button>
          </div>
          {(!timelines.length) && <div className="form-group"><div className="col-xs-12">Keine Version</div></div>}
          {timelines.map((timeline, idx) => (
            <div key={idx} className="form-group">
              <div className="col-xs-7">
                {renderDate(timeline.from, 'Gültig Von')}
                {renderDate(timeline.to, 'Gültig Bis')}
                {renderInput(timeline.restaurant, 'Restaurant', <select className="form-control"
                  {...timeline.restaurant}
                  onBlur={evt => timeline.restaurant.onBlur(parseInt(evt.target.value, 10))}
                  onChange={evt => timeline.restaurant.onChange(parseInt(evt.target.value, 10))}>
                  {restaurants.map(option => {
                    const loc = findLocation(option.location);
                    return <option key={option.id} value={JSON.stringify(option.id)}>{loc.city} - {loc.name}</option>;
                  })}
                </select>)}
                {renderInput(timeline.types, 'Typen', renderObjectSelectControl(timeline.types, tourTypeOptions, {multiple: true}))}
                {renderInput(timeline.difficulty, 'Schwierigkeit', renderObjectSelectControl(timeline.difficulty, difficultyOptions))}
                {renderInput(timeline.distance, 'Distanz', <div className="input-group">{renderNumberControl(timeline.distance, {min: 0, step: 0.1, decimalPlaces: 1})}<span className="input-group-addon">km</span></div>)}
                {renderInput(timeline.elevation, 'Höhenmeter', <div className="input-group">{renderNumberControl(timeline.elevation, {min: 0, step: 25})}<span className="input-group-addon">m</span></div>)}
              </div>
              <div className="col-xs-5">
                <h4>Ortschaften</h4>
                {timeline.locations && timeline.locations.map((location, locIdx)=> (<div key={locIdx} className="form-group"><select
                  className="form-control"
                  {...location}
                  onBlur={evt => location.onBlur(parseInt(evt.target.value, 10))}
                  onChange={evt => location.onChange(parseInt(evt.target.value, 10))}>
                  {locations.map(option => <option key={option.id} value={JSON.stringify(option.id)}>{option.city} - {option.name}</option>)}
                </select></div>))}
                <div style={{textAlign: 'center', margin: '10px'}}>
                  <button className="btn btn-success" onClick={event => {
                    event.preventDefault(); // prevent form submission
                    timeline.locations.addField();    // pushes empty child field onto the end of the array
                  }}><i className="fa fa-plus"/> Ort hinzufügen
                  </button>
                </div>
              </div>
            </div>))}

          <div style={{textAlign: 'center', margin: '10px'}}>
          <button className="btn btn-default"
                  onClick={handleCancel(formKey)}
                  disabled={submitting}>
            <i className="fa fa-ban"/> Cancel
          </button>
          <button className="btn btn-success"
                  onClick={handleSubmit}
                  disabled={invalid || submitting}>
            <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
          </button>
          </div>
        </form>
      </div>
    );
  }
}
