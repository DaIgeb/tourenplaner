import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import seasonConfigurationFormValidation from './seasonConfigurationYearFormValidation';
import * as seasonActions from 'redux/modules/seasons';

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
    'year'
  ],
  validate: seasonConfigurationFormValidation,
  asyncValidate,
  asyncBlurFields: ['email']
})
export default class SeasonConfigurationYearForm extends Component {
  static propTypes = {
    asyncValidating: PropTypes.bool.isRequired,
    fields: PropTypes.object.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    resetForm: PropTypes.func.isRequired,
    invalid: PropTypes.bool.isRequired,
    saveError: PropTypes.object,
    save: PropTypes.func.isRequired,
    addSetYear: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    valid: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  render() {
    const {
      asyncValidating,
      fields: {year},
      handleSubmit,
      resetForm,
      invalid,
      onCancel,
      submitting,
      } = this.props;

    const styles = require('./SeasonConfigurationYearForm.scss');
    const renderField = (field, showAsyncValidating, type, classNames, attributes = null) =>
      <div className={classNames}>
        {showAsyncValidating && asyncValidating && <i className={'fa fa-cog fa-spin ' + styles.cog}/>}
        <input type={type} className="form-control" id={field.name} {...field} {...attributes}/>
        {field.error && field.touched && <div className="text-danger">{field.error}</div>}
        <div className={styles.flags}>
          {field.dirty && <span className={styles.dirty} title="Dirty">D</span>}
          {field.active && <span className={styles.active} title="Active">A</span>}
          {field.visited && <span className={styles.visited} title="Visited">V</span>}
          {field.touched && <span className={styles.touched} title="Touched">T</span>}
        </div>
      </div>;
    const renderInput = (field, label, showAsyncValidating, type = 'text', attributes = null) =>
      <div className={'form-group' + (field.error && field.touched ? ' has-error' : '')}>
        <label htmlFor={field.name} className="col-sm-2">{label}</label>
        {renderField(field, showAsyncValidating, type, 'col-sm-9 ' + styles.inputGroup, attributes)}
      </div>;

    return (
      <div>
        <form className="form-horizontal" onSubmit={handleSubmit}>
          {renderInput(year, 'Jahr', null, 'number')}
          <div className="form-group">
            <div className="col-sm-offset-2 col-sm-10">
              <button className="btn btn-success"
                      onClick={handleSubmit}
                      disabled={invalid || submitting}>
                <i className={'fa ' + (submitting ? 'fa-cog fa-spin' : 'fa-cloud')}/> Weiter
              </button>
              <button className="btn btn-default" onClick={resetForm} style={{marginLeft: 15}}>
                <i className="fa fa-undo"/> Reset
              </button>
              <button className="btn btn-default"
                      onClick={onCancel}
                      disabled={submitting}
                      style={{marginLeft: 15}}>
                <i className="fa fa-ban"/> Cancel
              </button>
            </div>
          </div>
        </form>
      </div>);
  }
}
