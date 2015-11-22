import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as restaurantActions from 'redux/modules/restaurants';
import {isLoaded, load as loadRestaurants} from 'redux/modules/restaurants';
import {RestaurantForm} from 'components';

function fetchDataDeferred(getState, dispatch) {
  if (!isLoaded(getState())) {
    return dispatch(loadRestaurants());
  }
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    restaurants: state.restaurants.data,
    editing: state.restaurants.editing,
    error: state.restaurants.error,
    adding: state.restaurants.adding,
    loading: state.restaurants.loading
  }),
  {...restaurantActions })
export default class Restaurants extends Component {
  static propTypes = {
    restaurants: PropTypes.array,
    error: PropTypes.string,
    loading: PropTypes.bool,
    editing: PropTypes.object.isRequired,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired
  };

  render() {
    const handleEdit = (restaurant) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(String(restaurant.id));
    };
    const handleAdd = () => {
      const {addStart} = this.props; // eslint-disable-line no-shadow
      return () => addStart();
    };
    const handleDelete = (restaurant) => {
      const {del} = this.props; // eslint-disable-line no-shadow
      return () => del(String(restaurant.id));
    };
    const {restaurants, error, editing, loading, load, adding} = this.props;
    let refreshClassName = 'fa fa-refresh';
    if (loading) {
      refreshClassName += ' fa-spin';
    }

    const styles = require('./Restaurants.scss');
    return (
      <div className={styles.restaurants + ' container'}>
        <h1>Restaurants
        <button className={styles.refreshBtn + ' btn btn-success'} onClick={load}>
          <i className={refreshClassName}/> {' '} Reload Restaurants
        </button>
        </h1>
        <DocumentMeta title={config.app.title + ': Restaurants'}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
          {' '}
          {error}
        </div>}

        {restaurants && restaurants.length &&
        <table className="table table-striped table-hover table-condensed">
          <thead>
          <tr>
            <th className={styles.idCol}>ID</th>
            <th className={styles.nameCol}>Name</th>
            <th className={styles.addressCol}>Anschrift<br/>Koordinaten</th>
            <th className={styles.notesCol}>Telefon<br/>Notizen</th>
            <th className={styles.businessHours}>Öffnungszeiten</th>
            <th className={styles.buttonCol} />
          </tr>
          </thead>
          <tbody>
          {
            restaurants.map(restaurant => editing[restaurant.id] ?
              <RestaurantForm formKey={String(restaurant.id)} key={String(restaurant.id)} initialValues={restaurant}/> :
              <tr key={restaurant.id}>
                <td className={styles.idCol}>{restaurant.id}</td>
                <td className={styles.nameCol}>{restaurant.name}</td>
                <td className={styles.addressCol}>{restaurant.address}
                    <br/>
                    {restaurant.zipCode} {restaurant.city}
                    <br/>
                    {restaurant.location.lat}/{restaurant.location.long}</td>
                <td className={styles.notesCol}>{restaurant.phone}
                    <br/>
                    {restaurant.notes}</td>
                <td className={styles.businessHours}>Öffnungszeiten</td>
                <td className={styles.buttonCol}>
                  <button className="btn btn-primary" onClick={handleEdit(restaurant)}>
                    <i className="fa fa-pencil"/> Edit
                  </button>
                  <button className="btn btn-danger" onClick={handleDelete(restaurant)}>
                    <i className="fa fa-trash"/> Löschen
                  </button>
                </td>
              </tr>)
          }

            {adding ?
              <RestaurantForm formKey="new" key="new" initialValues={adding}/> :
              <tr key="new">
                <td colSpan={5}/>
                <td>
                  <button className="btn btn-success" onClick={handleAdd()}>
                    <i className="fa fa-plus"/> Add
                  </button>
                </td>
              </tr>
              }
          </tbody>
        </table>}
      </div>
    );
  }
}
