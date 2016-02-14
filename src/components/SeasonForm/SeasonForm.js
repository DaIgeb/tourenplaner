import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reduxForm} from 'redux-form';
// import restaurantValidation from './restaurantValidation';
import * as seasonActions from 'redux/modules/seasons';
import {ConfigurationInput, NumberInput} from 'components';
import {moment, defaultTimeZone} from '../../../shared/utils/moment';
import {SeasonState} from 'models';
import {renderPagedContent} from 'utils/pagination';

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
    'dates[].date',
    'dates[].description',
    'dates[].locked',
    'dates[].tours[]',
    'dates[].tours[].tour',
    'dates[].tours[].type',
    'dates[].tours[].candidates[].tour',
    'dates[].tours[].candidates[].scores[].name',
    'dates[].tours[].candidates[].scores[].score',
    'dates[].tours[].candidates[].scores[].note'
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
      details: [],
      page: {
        size: 10,
        current: 0
      }
    };
  }

  toggleDetails(dateIdx, tourIdx) {
    const dateValues = this.state.details[dateIdx];
    const currentValue = dateValues && dateValues[tourIdx] ? true : false;
    this.setState({
      ...this.state,
      details: {
        ...this.state.details,
        [dateIdx]: {
          ...this.state.details[dateIdx],
          [tourIdx]: !currentValue
        }
      }
    });
  }

  selectPage(pageNumber) {
    this.setState({
      ...this.state,
      page: {
        ...this.state.page,
        current: pageNumber
      }
    });
  }

  render() {
    const { fields: {id, configuration, state, version, year, dates}, formKey, handleSubmit, invalid,
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

/*
    const renderScore = (score, idx) => {
      return (
        <tr key={idx}>
          <td>{score.name.value}</td>
          <td>{score.score.value}</td>
          <td>{score.note.value}</td>
        </tr>);
    };*/

    const renderTour = (tour, idx) => {
      const tourObj = !isNaN(tour.tour.value) && tour.tour.value >= 0 ? findTour(tour.candidates[tour.tour.value].tour.value) : null;
      // TODO render candidates
      // TODO render scores
      if (idx === 0) {
        return [
          <td key="type">{tour.type.value.label}</td>,
          <td key="name">{tourObj ? tourObj.name : ''}</td>
        ];
      }

      return [
        <td>{tour.type.value.label}</td>,
        <td>{tourObj ? tourObj.name : 'Unkown tour'}</td>
      ];
    };

    const renderDetails = (dateIdx, tourIdx, seasonTour) => {
      if (this.state.details[dateIdx] && this.state.details[dateIdx][tourIdx]) {
        return (<tr>
          <td colSpan={2}>
            <table className="table table-striped table-hover table-condensed">
              <thead>
              <tr>
                <td className="col-md-8">Bezeichnung</td>
                <td className="col-md-4">Punkte</td>
              </tr>
              </thead>
              <tbody>
                {seasonTour.candidates.map((candidate, idx) => {
                  const tour = findTour(candidate.tour.value);

                  return (<tr key={idx}>
                    <td>{tour ? tour.name : ''}</td>
                    <td>{candidate.scores.reduce((sum, score) => sum + score.score.value, 0)}</td>
                  </tr>);
                })}
              </tbody>
            </table>
          </td>
        </tr>);
        // NOP
        /*
         result.push((
         <tr key={idx + '/score'}>
         <td colSpan={3}>{scores && scores.length && <table className="table table-striped table-hover table-condensed"><thead><tr><td>Bezeichnung</td><td>Score</td><td>Notiz</td></tr></thead><tbody>{date.scores.map(renderScore)}</tbody></table>}</td>
         </tr>)
         );
         */
      }

      return null;
    };

    const renderDates = (date, idx) => {
      const momentDate = moment.tz(date.date.value, moment.ISO_8601, true, defaultTimeZone);
      const dateString = momentDate.isValid() ? momentDate.format('L') : '-';
      const dateAndDescription = date.description.value ? dateString + ` (${date.description.value})` : dateString;
      const dateDetails = this.state.details[idx];
      const rowSpan = date.tours.length + (dateDetails ? Object.keys(dateDetails).reduce((sum, value) => {
        if (dateDetails.hasOwnProperty(value) && dateDetails[value]) {
          return sum + 1;
        }

        return sum;
      }, 0) : 0);
      const result = [(
        <tr key={idx + '/0'} onClick={() => this.toggleDetails(idx, 0)}>
          <td rowSpan={rowSpan}>{dateAndDescription}</td>
          <td rowSpan={rowSpan}><input type="checkbox" {...date.locked} onClick={evt => evt.stopPropagation()}/></td>
          {renderTour(date.tours[0], 0)}
        </tr>),
        renderDetails(idx, 0, date.tours[0])
      ];

      date.tours
        .forEach((tour, index) => {
          if (index > 0) {
            result.push((
              <tr key={idx + '/' + (index)} onClick={() => this.toggleDetails(idx, index)}>
                {renderTour(tour, index)}
              </tr>)
            );
            result.push(renderDetails(idx, index, tour));
          }
        });
      return result.filter(item => item);
    };

    switch (state.value) {
      case SeasonState.confirm:
        const {current, size} = this.state.page;
        const lowerBound = current * size;
        const upperBound = lowerBound + size;

        const datesToRender = dates ? dates.filter((date, idx) => idx >= lowerBound && idx < upperBound) : [];
        return (
          <div>
            {saveError && <div className="text-danger">{saveError}</div>}

            <form className="form-horizontal" onSubmit={handleSubmit}>
              {renderInput(id, 'ID', renderInputControl(id, 'number', {readOnly: true}))}
              {renderInput(year, 'Jahr', <NumberInput className="form-control" {...year} readOnly/>)}
              {renderInput(version, 'Version', <NumberInput className="form-control" {...version} readOnly type="hidden"/>)}
              {renderInput(configuration, 'Konfiguration', <ConfigurationInput {...configuration} readOnly/>)}
              {renderPagedContent(current, size, Math.ceil((dates ? dates.length : 0 ) / size), (number) => this.selectPage(number), () => {
                return (
                  <table className="table table-striped table-hover table-condensed">
                    <thead>
                    <tr>
                      <td className="col-md-2">Datum</td>
                      <td className="col-md-1"/>
                      <td className="col-md-4">Tourart</td>
                      <td className="col-md-4">Tour</td>
                    </tr>
                    </thead>
                    <tbody>
                    {datesToRender.map((date, idx) => renderDates(date, idx + lowerBound))}
                    </tbody>
                  </table>
                );
              })}
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
