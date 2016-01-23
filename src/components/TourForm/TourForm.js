import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as tourActions from 'redux/modules/tours';
import {DateInput, NumberInput, ObjectSelect, LocationInput, TourInput} from 'components';
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
    'types',
    'timelines[].from',
    'timelines[].until',
    'timelines[].startroute',
    'timelines[].difficulty',
    'timelines[].distance',
    'timelines[].elevation',
    'timelines[].restaurants[]',
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
    const { fields: {id, name, types, timelines}, restaurants, locations, formKey, handleSubmit, invalid,
      submitting, saveError: { [formKey]: saveError } } = this.props;

    const tourTypeOptions = [
      TourType.none,
      TourType.morning,
      TourType.afternoon,
      TourType.evening,
      TourType.fullday,
      TourType.startroute
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

    const renderRestaurant = (restaurantsField, restaurant, restIdx) => {
      const findLocation = (locationId) => locations.find(loc => loc.id === locationId);

      const restaurantOptions = restaurants.map(rest => {
        const loc = findLocation(rest.location);
        return { id: rest.id, label: `${loc.city} - ${loc.name}`};
      }).sort((option1, option2) => option1.label.localeCompare(option2.label))
        .map(option => <option key={option.id} value={JSON.stringify(option.id)}>{option.label}</option>);

      return (
        <div key={restIdx} className="form-group">
          <div className="col-xs-10">
            <select className="form-control"
              {...restaurant}
              onBlur={evt => restaurant.onBlur(parseInt(evt.target.value, 10))}
              onChange={evt => restaurant.onChange(parseInt(evt.target.value, 10))}>
              {restaurantOptions}
            </select>
          </div>
          <div className="col-xs-2">
            <button className="btn btn-danger" onClick={event => {
              event.preventDefault();       // prevent form submission
              restaurantsField.removeField(restIdx);  // remove from index
            }}><i className="fa fa-trash"/>
            </button>
          </div>
        </div>);
    };

    return (
      <div>
        {saveError && <div className="text-danger">{saveError}</div>}

        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
          {renderInput(name, 'Name', renderInputControl(name))}
          {renderInput(types, 'Typen', renderObjectSelectControl(types, tourTypeOptions, {multiple: true}))}
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
                {renderDate(timeline.until, 'Gültig Bis')}
                {renderInput(timeline.startroute, 'Start Route', <TourInput className="form-control"
                                                                            allowNull
                                                                            default={undefined}
                                                                            filter={item => item.types.findIndex(type => type.id === TourType.startroute.id) >= 0}
                  {...timeline.startroute} />)}
                {renderInput(timeline.difficulty, 'Schwierigkeit', renderObjectSelectControl(timeline.difficulty, difficultyOptions))}
                {renderInput(timeline.distance, 'Distanz', <div className="input-group">{renderNumberControl(timeline.distance, {min: 0, step: 0.1, decimalPlaces: 1})}<span className="input-group-addon">km</span></div>)}
                {renderInput(timeline.elevation, 'Höhenmeter', <div className="input-group">{renderNumberControl(timeline.elevation, {min: 0, step: 25})}<span className="input-group-addon">m</span></div>)}

                <h4>Restaurants</h4>
                {timeline.restaurants && timeline.restaurants.map((rest, restIdx) => renderRestaurant(timeline.restaurants, rest, restIdx))}
                <div style={{textAlign: 'center', margin: '10px'}}>
                  <button className="btn btn-success" onClick={event => {
                    event.preventDefault(); // prevent form submission
                    timeline.restaurants.addField();    // pushes empty child field onto the end of the array
                  }}><i className="fa fa-plus"/> Restaurant hinzufügen
                  </button>
                </div>
              </div>
              <div className="col-xs-5">
                <h4>Ortschaften</h4>
                {timeline.locations && timeline.locations.map((location, locIdx)=> (
                  <div key={locIdx} className="form-group">
                    <div className="col-xs-10">
                      <LocationInput className="form-control" {...location}/>
                    </div>
                    <div className="col-xs-2">
                      <button className="btn btn-danger" onClick={event => {
                        event.preventDefault();       // prevent form submission
                        timeline.locations.removeField(locIdx);  // remove from index
                      }}><i className="fa fa-trash"/>
                      </button>
                    </div>
                  </div>))}
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
