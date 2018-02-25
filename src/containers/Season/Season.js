import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import DocumentMeta from 'react-document-meta';
import connectData from 'helpers/connectData';
import config from '../../config';
import * as seasonActions from 'redux/modules/seasons';
import {isLoaded, load as loadSeasons} from 'redux/modules/seasons';
import {isLoaded as isConfigLoaded, load as loadConfigs} from 'redux/modules/configurations';
import {isLoaded as isTourLoaded, load as loadTours} from 'redux/modules/tours';
import {isLoaded as isLocLoaded, load as loadLocs} from 'redux/modules/locations';
import {isLoaded as isRestLoaded, load as loadRests} from 'redux/modules/restaurants';
import {SeasonForm} from 'components';
import {moment} from '../../../shared/utils/moment';
import {LinkContainer} from 'react-router-bootstrap';
import {renderPagedContent} from 'utils/pagination';
import {sort, renderSortDirection} from 'utils/sorting';
import {PrintTab} from './PrintTab';
import {PlanTab} from './PlanTab';

function fetchDataDeferred(getState, dispatch) {
  const loadPromise = new Promise((resolve, reject) => {
    const promises = [];
    if (!isLoaded(getState())) {
      promises.push(dispatch(loadSeasons()));
    }

    if (!isConfigLoaded(getState())) {
      promises.push(dispatch(loadConfigs()));
    }

    if (!isTourLoaded(getState())) {
      promises.push(dispatch(loadTours()));
    }

    if (!isLocLoaded(getState())) {
      promises.push(dispatch(loadLocs()));
    }

    if (!isRestLoaded(getState())) {
      promises.push(dispatch(loadRests()));
    }

    Promise.all(promises).then(values => resolve(values)).catch(error => reject(error));
  });

  return loadPromise;
}

function getActions() {
  return {
    ...seasonActions
  };
}

@connectData(null, fetchDataDeferred)
@connect(
  state => ({
    id: state.router.params.id,
    tab: state.router.params.tab,
    seasons: state.seasons.data,
    tours: state.tours.data,
    locations: state.locations.data,
    restaurants: state.restaurants.data,
    configs: state.configurations.data,
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading,
    editing: state.seasons.editing
  }),
  getActions())
export default class Season extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    tab: PropTypes.string,
    seasons: PropTypes.array,
    tours: PropTypes.array,
    locations: PropTypes.array,
    restaurants: PropTypes.array,
    configs: PropTypes.array,
    editing: PropTypes.number,
    error: PropTypes.string,
    loading: PropTypes.bool,
    adding: PropTypes.object,
    load: PropTypes.func.isRequired,
    del: PropTypes.func.isRequired,
    add: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    addStart: PropTypes.func.isRequired,
    addStop: PropTypes.func.isRequired,
    editStart: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);

    this.state = {
      details: [],
      plan: {
        page: {
          size: 10,
          current: 0
        }
      },
      tours: {
        page: {
          size: 20,
          current: 0
        },
        sorting: []
      },
      tab: props.tab || 'plan'
    };
  }

  selectPlanPage = (pageNumber) => {
    this.setState({
      ...this.state,
      plan: {
        ...this.state.plan,
        page: {
          ...this.state.plan.page,
          current: pageNumber
        }
      }
    });
  };

  selectToursPage(pageNumber) {
    this.setState({
      ...this.state,
      tours: {
        ...this.state.tours,
        page: {
          ...this.state.tours.page,
          current: pageNumber
        }
      }
    });
  }

  selectTab(tab) {
    this.setState({
      ...this.state,
      tab: tab
    });
  }

  addSort(column) {
    const previousState = this.state.tours.sorting.find(sortOption => sortOption.column === column);
    this.setState({
      ...this.state,
      tours: {
        ...this.state.tours,
        sorting: [
          ...this.state.tours.sorting.filter(sortOption => sortOption.column !== column),
          {
            column: column,
            ascending: previousState ? !previousState.ascending : true
          }
        ]
      }
    });
  }

  render() {
    const handleEditStart = (id) => {
      const {editStart} = this.props; // eslint-disable-line no-shadow
      return () => editStart(id);
    };
    const {id, seasons, tours, configs, save, error, editing /* , restaurants, locations, timelineDate, setTimelineDate */ } = this.props;

    if (!tours) {
      return <div>Loading</div>;
    }
    const idNumber = parseInt(id, 10);
    const season = seasons.find(item => item.id === idNumber);
    if (!season) {
      return <div>Invalid season</div>;
    }

    const styles = require('./Season.scss');
    if (editing === id) {
      return (
        <div className={styles.restaurants + ' container'}>
        <h1>Tour: {season.name}</h1>
        <DocumentMeta title={config.app.title + ': Tour ' + season.name}/>

        <SeasonForm formKey="new" initialValues={season} onSubmit={(values) => save(values)}/>

        {error &&
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true" />
          {' '}
          {error}
        </div>}
      </div>);
    }

    const renderTab = (tabId, name) => {
      const currentTab = this.state.tab;
      return (
        <li key={tabId} role="presentation" className={currentTab === tabId ? 'active' : ''}>
          <a href="#" onClick={() => this.selectTab(tabId)}>{name}</a>
        </li>);
    };

    const renderToursTabContent = () => {
      const {page: {current, size}, sorting} = this.state.tours;
      const lowerBound = current * size;
      const upperBound = lowerBound + size;

      const usedCandidates = season.dates.map(date =>
        date.tours.map(tour => {
          const candidate = tour.candidates[tour.tour];
          return {
            tour: candidate.tour,
            type: tour.type ? tour.type.label : null,
            score: candidate.totalScore,
            date: date.date
          };
        })
      ).reduce((item1, item2) => item1.concat(item2));

      const viewModels = tours
        .map(tour => {
          return {
            name: tour.name,
            occurences: usedCandidates.filter(candidate => candidate.tour === tour.id)
          };
        });
      const toursToDisplay = sort(viewModels, sorting)
        .filter((tour, idx) => idx >= lowerBound && idx < upperBound);

      const renderColumnTitle = (columnId, name, className) => {
        return (
          <th className={className}>
            <a href="#" onClick={() => this.addSort(columnId)}>{name} {renderSortDirection(columnId, sorting)}</a>
          </th>
        );
      };
      return (
        <div className="row">
          <div className="col-md-12">
            {renderPagedContent(current, size, Math.ceil((tours ? tours.length : 0 ) / size), (number) => this.selectToursPage(number), () => {
              return (
                <table className="table table-striped table-hover table-condensed">
                  <thead>
                  <tr>
                    {renderColumnTitle('name', 'Tour', 'col-md-4')}
                    {renderColumnTitle('occurences', 'Anzahl Ausfahrten', 'col-md-2')}
                  </tr>
                  </thead>
                  <tbody>
                  {toursToDisplay.map((tour, idx) =>
                    (<tr key={`${idx}/main`}>
                      <td>
                        {tour.name}
                      </td>
                      <td className={tour.occurences.length ? styles.tooltip : ''}>
                        {tour.occurences.length}
                        {tour.occurences.length > 0 && (
                          <span>
                            {tour.occurences.map((occ, occIdx) => (
                              <div key={`${idx}/${occIdx}`}>
                                {`${moment(occ.date).format('L')} ${occ.type}`}
                              </div>))}
                          </span>
                        )}
                      </td>
                    </tr>))}
                  </tbody>
                </table>
              );
            })}
          </div>
        </div>);
    };
    const renderTabContent = (tabId, render) => {
      const currentTab = this.state.tab;
      return (
        <div key={tabId} role="tabpanel" className={'tab-pane ' + (currentTab === tabId ? 'active' : '')} id={tabId}>
          {currentTab === tabId ? render() : undefined}
        </div>
      );
    };

    const configuration = configs.find(item => item.id === season.configuration);

    const renderTabs = () => {
      const tabs = [
        {
          id: 'plan',
          name: 'Plan',
          render: () => <PlanTab season={season} currentPage={this.state.plan.page.current} tours={tours} size={this.state.plan.page.size} restaurants={this.props.restaurants} selectPage={this.selectPlanPage}/>
        },
        {
          id: 'tours',
          name: 'Touren',
          render: renderToursTabContent
        },
        {
          id: 'print',
          name: 'Druck',
          render: () => <PrintTab season={season} configuration={configuration} configurations={configs} tours={tours} locations={this.props.locations} restaurants={this.props.restaurants}/>
        }
      ];

      return (
        <div>
          <ul className="nav nav-tabs hidden-print">
            {tabs.map(tab => renderTab(tab.id, tab.name))}
          </ul>
          <div className="tab-content">
            {tabs.map(tab => renderTabContent(tab.id, tab.render))}
          </div>
        </div>
      );
    };

    return (
      <div className={styles.restaurants + ' container'}>
        <h1 className="hidden-print">Saison: {season.year}
          <LinkContainer to="/seasons">
            <button className="btn btn-primary">
              <i className="fa fa-pencil"/> Zurück
            </button>
          </LinkContainer>
        </h1>
        <DocumentMeta title={config.app.title + ': Saison ' + season.year}/>

        {error && <div className="text-danger">{error}</div>}

        {renderTabs()}

        <div className="row hidden-print">
          <button className="btn btn-primary" onClick={handleEditStart(id)}>
            <i className="fa fa-pencil"/> Edit
          </button>
          <a className="btn btn-success" href={`/api/season/csv/${season.id}`}>
            <i className="fa fa-download"/> Download
          </a>
        </div>
      </div>
    );
  }
}
