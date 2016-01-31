import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as seasonActions from 'redux/modules/seasons';
import {ConfigurationInput, NumberInput} from 'components';
import {moment, defaultTimeZone} from '../../../shared/utils/moment';
import {SeasonState} from 'models';

@connect(
  state => ({
    saveError: state.seasons.saveError,
    tours: state.tours.data,
    configurations: state.configurations.data
  }),
  dispatch => bindActionCreators(seasonActions, dispatch)
)
@reduxForm({
  form: 'season',
  fields: [
    'id',
    'year',
    'version',
    'state',
    'configuration',
    'tours[].date',
    'tours[].type',
    'tours[].tour',
    'tours[].scores[].name',
    'tours[].scores[].score',
    'tours[].scores[].note'
  ],
  // validate: restaurantValidation
})
export default class SeasonForm extends Component {
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
    tours: PropTypes.array.isRequired,
    configurations: PropTypes.array.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      details: []
    };
  }

  toggleDetails(idx) {
    const currentValue = this.state.details[idx] ? true : false;
    this.setState({
      ...this.state,
      details: {
        ...this.state.details,
        [idx]: !currentValue
      }
    });
  }

  render() {
    const { fields: {id, configuration, state, version, year, tours}, formKey, handleSubmit, invalid,
      submitting, saveError: { [formKey]: saveError } } = this.props;

    const handleCancel = (seasonId) => {
      if (seasonId && seasonId !== 'new') {
        const {editStop} = this.props; // eslint-disable-line no-shadow
        return () => editStop(seasonId);
      }

      const {addStop} = this.props; // eslint-disable-line no-shadow
      return () => addStop();
    };

    const styles = require('./SeasonForm.scss');
    const renderInputControl = (field, type = 'text', attributes = null) => {
      return (<input type={type} className="form-control" id={field.name} {...field} {...attributes}/>);
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

    const findTour = (tourId) => {
      const {tours} = this.props; // eslint-disable-line no-shadow

      return tours.find(tourObj => tourObj.id === tourId);
    };

    const renderScore = (score, idx) => {
      return (
        <tr key={idx}>
          <td>{score.name.value}</td>
          <td>{score.score.value}</td>
          <td>{score.note.value}</td>
        </tr>);
    };

    const renderTour = (tour, idx) => {
      const scores = tour.scores;
      const tourObj = findTour(tour.tour.value);
      const date = moment.tz(tour.date.value, moment.ISO_8601, true, defaultTimeZone);
      const dateString = date.isValid() ? date.format('L') : '-';
      const result = [(
        <tr key={idx + '/tour'} onClick={() => this.toggleDetails(idx)}>
          <td>{dateString}</td>
          <td>{tour.type.value}</td>
          <td>{tourObj ? tourObj.name : 'Unkown tour'}</td>
        </tr>)];
      if (this.state.details[idx]) {
        result.push((
          <tr key={idx + '/score'}>
            <td colSpan={3}>{scores && scores.length && <table className="table table-striped table-hover table-condensed"><thead><tr><td>Bezeichnung</td><td>Score</td><td>Notiz</td></tr></thead><tbody>{tour.scores.map(renderScore)}</tbody></table>}</td>
          </tr>)
        );
      }

      return result;
    };

    switch (state.value) {
      case SeasonState.confirm:
        return (
          <div>
            {saveError && <div className="text-danger">{saveError}</div>}

            <form className="form-horizontal" onSubmit={handleSubmit}>
              {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
              {renderInput(year, 'Jahr', <NumberInput className="form-control" {...year} readOnly/>)}
              {renderInput(version, 'Version', <NumberInput className="form-control" {...version} readOnly type="hidden"/>)}
              {renderInput(configuration, 'Konfiguration', <ConfigurationInput {...configuration} readOnly/>)}
              {tours && tours.length && <table className="table table-striped table-hover table-condensed"><thead><tr><td>Datum</td><td>Tourart</td><td>Tour</td></tr></thead><tbody>{tours.map(renderTour)}</tbody></table>}

              <div style={{textAlign: 'center', margin: '10px'}}>
                <button className="btn btn-default"
                        onClick={handleCancel(formKey)}
                        disabled>
                  <i className="fa fa-ban"/> Cancel
                </button>
                <button className="btn btn-success"
                        onClick={handleSubmit}
                        disabled>
                  <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
                </button>
              </div>
            </form>
          </div>
        );
      case SeasonState.buildingList:
        return (
          <div>
            {saveError && <div className="text-danger">{saveError}</div>}

            <form className="form-horizontal" onSubmit={handleSubmit}>
              {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
              {renderInput(year, 'Jahr', <NumberInput className="form-control" {...year} readOnly/>)}
              {renderInput(version, 'Version', <NumberInput className="form-control" {...version} readOnly type="hidden"/>)}
              {renderInput(configuration, 'Konfiguration', <ConfigurationInput {...configuration} readOnly/>)}
              <button className={styles.refreshBtn + ' btn btn-success'}>
                <i className="fa fa-refresh fa-spin"/> {' '} Building Season
              </button>
              {tours && tours.length && <table className="table table-striped table-hover table-condensed"><thead><tr><td>Datum</td><td>Tourart</td><td>Tour</td></tr></thead><tbody>{tours.map(renderTour)}</tbody></table>}

              <div style={{textAlign: 'center', margin: '10px'}}>
                <button className="btn btn-default"
                        onClick={handleCancel(formKey)}
                        disabled>
                  <i className="fa fa-ban"/> Cancel
                </button>
                <button className="btn btn-success"
                        onClick={handleSubmit}
                        disabled>
                  <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Save
                </button>
              </div>
            </form>
          </div>
        );
      case SeasonState.setup:
      default:
        return (
          <div>
            {saveError && <div className="text-danger">{saveError}</div>}

            <form className="form-horizontal" onSubmit={handleSubmit}>
              {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
              {renderInput(year, 'Jahr', <NumberInput className="form-control" {...year}/>)}
              {renderInput(version, 'Version', <NumberInput className="form-control" {...version} type="hidden"/>)}
              {renderInput(configuration, 'Konfiguration', <ConfigurationInput {...configuration}/>)}
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

    return (
      <div>
        {saveError && <div className="text-danger">{saveError}</div>}

        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
          {renderInput(name, 'Name', renderInputControl(name))}
          {renderInput(configuration, 'Konfiguration', <ConfigurationInput {...configuration}/>)}
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
