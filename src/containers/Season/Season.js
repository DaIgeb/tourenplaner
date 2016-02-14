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
import {SeasonForm} from 'components';
import {moment, defaultTimeZone} from '../../../shared/utils/moment';
import {LinkContainer} from 'react-router-bootstrap';
import {renderPagedContent} from 'utils/pagination';
import {sort, renderSortDirection} from 'utils/sorting';
import {TourType} from 'models';
import {timelineMatches} from '../../../shared/utils/timeline';

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
    seasons: state.seasons.data,
    tours: state.tours.data,
    locations: state.locations.data,
    configs: state.configurations.data,
    error: state.seasons.error,
    adding: state.seasons.adding,
    loading: state.seasons.loading,
    editing: state.seasons.editinga
  }),
  getActions())
export default class Season extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    seasons: PropTypes.array,
    tours: PropTypes.array,
    locations: PropTypes.array,
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
      tab: 'plan'
    };
  }

  selectPlanPage(pageNumber) {
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
  }

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

    const findTour = (tourId) => {
      const {tours} = this.props; // eslint-disable-line no-shadow

      return tours.find(tourObj => tourObj.id === tourId);
    };

    const renderTour = (tour, idx) => {
      const tourObj = !isNaN(tour.tour) && tour.tour >= 0 ? findTour(tour.candidates[tour.tour].tour) : null;
      // TODO render candidates
      // TODO render scores
      if (idx === 0) {
        return [
          <td key="type">{tour.type.label}</td>,
          <td key="name">{tourObj ? tourObj.name : ''}</td>
        ];
      }

      return [
        <td>{tour.type.label}</td>,
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
                const tour = findTour(candidate.tour);

                return (<tr key={idx}>
                  <td>{tour ? tour.name : ''}</td>
                  <td>{candidate.scores.reduce((sum, score) => sum + score.score, 0)}</td>
                </tr>);
              })}
              </tbody>
            </table>
          </td>
        </tr>);
      }

      return null;
    };
    const renderDates = (date, idx) => {
      const momentDate = moment.tz(date.date, moment.ISO_8601, true, defaultTimeZone);
      const dateString = momentDate.isValid() ? momentDate.format('L') : '-';
      const dateAndDescription = date.description ? dateString + ` (${date.description})` : dateString;
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

    const renderTab = (tabId, name) => {
      const currentTab = this.state.tab;
      return (
        <li role="presentation" className={currentTab === tabId ? 'active' : ''}>
          <a href="#" onClick={() => this.selectTab(tabId)}>{name}</a>
        </li>);
    };

    const renderPlanTabConent = () => {
      const {current, size} = this.state.plan.page;
      const lowerBound = current * size;
      const upperBound = lowerBound + size;

      const datesToRender = season.dates ? season.dates.filter((date, idx) => idx >= lowerBound && idx < upperBound) : [];

      return (
        <div className="row">
          <div className="col-md-3">{season.year} ({season.version})</div>
          <div className="col-md-2">{configs.find(item => item.id === season.configuration).year}</div>
          <div className="col-md-12">
            {renderPagedContent(current, size, Math.ceil((season.dates ? season.dates.length : 0 ) / size), (number) => this.selectPlanPage(number), () => {
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
          </div>
        </div>);
    };
    const getPointsByType = (type) => {
      switch (type ? type.id : null) {
        case TourType.fullday.id:
          return 40;
        case TourType.morning.id:
        case TourType.afternoon.id:
          return 20;
        case TourType.evening.id:
          return 15;
        default:
          return 0;
      }
    };

    const getTourName = (tour, date, type) => {
      if (!tour) {
        return null;
      }

      let tourName = tour.name;
      const locations = this.props.locations;
      const timeline = tour.timelines.find(tl => timelineMatches(tl, date));
      const locationsInTour = timeline.locations.map(loc => locations.find(item => item.id === loc));
      const foreignCountry = locationsInTour.find(loc => loc.addressCountry && loc.addressCountry !== 'CH');

      if (foreignCountry) {
        tourName += ' (ID)';
      }

      if (type.id !== TourType.fullday.id) {
        switch (date.day()) {
          case 0: // Sunday
            if (type.id !== TourType.morning.id) {
              return tourName + ` (${type.label})`;
            }
            break;
          case 2:
          case 4:
            if (type.id !== TourType.evening.id) {
              return tourName + ` (${type.label})`;
            }
            break;
          case 6:
            if (type.id !== TourType.afternoon.id && type.id !== TourType.fullday.id) {
              return tourName + ` (${type.label})`;
            }
            break;
          default:
            return tourName + ` (${type.label})`;
        }
      }

      return tourName;
    };

    const renderPrintTabContent = () => {
      const datesByMonth = [];
      season.dates
        .forEach(date => {
          const parsedDate = moment(date.date);
          const monthId = parsedDate.month();
          let month = datesByMonth.find(mon => mon.month === monthId);
          if (!month) {
            month = {
              month: monthId,
              monthName: parsedDate.format('MMMM'),
              dates: []
            };

            datesByMonth.push(month);
          }

          const tourViewModels = date.tours.map((tour, idx) => {
            const candidate = tour.candidates[tour.tour];
            const tourObj = tours.find(item => item.id === candidate.tour);

            return {
              tour: tourObj ? getTourName(tourObj, parsedDate, tour.type) : null,
              description: date.description,
              points: getPointsByType(tour.type),
              date: idx === 0 ? parsedDate.format('L') : null,
              day: idx === 0 ? parsedDate.format('dd') : null
            };
          });

          month.dates = month.dates.concat(tourViewModels);
        });
      const eveningStart = '4. April';
      const eveningEnd = '15. September';

      return (
        <div className={styles.print + ' container'}>
          {datesByMonth.map(month => (
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-12">
                  <h3>{month.monthName}</h3>
                </div>
              </div>
              <div className={styles.list}>
                {month.dates.map(date => (
                  <div className={styles.listItem + ' row ' + (date.points === 40 ? styles.fullday : '')}>
                    <div className="col-md-1">{date.day}&nbsp;</div>
                    <div className="col-md-2">{date.date}&nbsp;</div>
                    <div className={styles.tourNameCol + ' col-md-8'}>{date.tour ? date.tour : `${date.description} (Keine Tour)`}&nbsp;</div>
                    <div className="col-md-1">{date.points}&nbsp;</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="col-md-12">
            <div className="row">
              <div className="col-md-12"><h3>Treffpunkt Museumsplatz</h3></div>
              <div className="col-md-5 col-md-offset-1"><strong>Abfahrtszeiten: "Blüemli - Gruppe"</strong></div>
              <div className="col-md-5 col-md-offset-1">gemütliches Tempo / Einsteigergruppe</div>

              <div className="col-md-3 col-md-offset-1">Abendtouren:</div>
              <div className="col-md-2">17:50 Uhr</div>
              <div className="col-md-5 col-md-offset-1">Durchschnitt 22 -26 km/h</div>

              <div className="col-md-3 col-md-offset-1">Samstagstouren:</div>
              <div className="col-md-8">13:20 Uhr</div>

              <div className="col-md-3 col-md-offset-1">Sonntagstouren:</div>
              <div className="col-md-3">08:20 Uhr</div>
              <div className="col-md-5">(bis {eveningStart} und ab {eveningEnd} 08.50 Uhr)</div>

              <div className="col-md-3 col-md-offset-1">Tagestouren:</div>
              <div className="col-md-8">07:45 Uhr</div>
            </div>
            <div className="row">
              <div className="col-md-5 col-md-offset-1"><strong>Abfahrtszeiten: "Fitness - Gruppe"</strong></div>
              <div className="col-md-5 col-md-offset-1">flottes Tempo / Routinierte Fahrer</div>

              <div className="col-md-3 col-md-offset-1">Abendtouren:</div>
              <div className="col-md-2">18:00 Uhr</div>
              <div className="col-md-5 col-md-offset-1">Durchschnitt 24 -28 km/h</div>

              <div className="col-md-3 col-md-offset-1">Samstagstouren:</div>
              <div className="col-md-8">13:30 Uhr</div>

              <div className="col-md-3 col-md-offset-1">Sonntagstouren:</div>
              <div className="col-md-3">08:30 Uhr</div>
              <div className="col-md-5">(bis {eveningStart} und ab {eveningEnd} 09.00 Uhr)</div>

              <div className="col-md-3 col-md-offset-1">Tagestouren:</div>
              <div className="col-md-8">08:00 Uhr</div>
            </div>
            <div className="row">
              <div className="col-md-4 col-md-offset-1"><strong>Abfahrtszeiten: "Fitness - Gruppe"</strong></div>
              <div className="col-md-2">ab {eveningStart}</div>
              <div className="col-md-5">zügiges Tempo / gut trainierte Fahrer</div>

              <div className="col-md-3 col-md-offset-1">Abendtouren:</div>
              <div className="col-md-2">18:10 Uhr</div>
              <div className="col-md-5 col-md-offset-1">Durchschnitt 24 -28 km/h</div>

              <div className="col-md-3 col-md-offset-1">Samstagstouren:</div>
              <div className="col-md-8">13:40 Uhr</div>

              <div className="col-md-3 col-md-offset-1">Sonntagstouren:</div>
              <div className="col-md-8">08:40 Uhr</div>

              <div className="col-md-3 col-md-offset-1">Tagestouren:</div>
              <div className="col-md-8">08:15 Uhr</div>
            </div>
          </div>
        </div>);
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
            type: candidate.type,
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
                    (<tr key={`${idx}/main`}><td>
                      {tour.name}
                    </td><td className={tour.occurences.length ? styles.tooltip : ''}>
                      {tour.occurences.length}
                      {tour.occurences.length > 0 && (
                        <span>
                          {tour.occurences.map((occ, occIdx) => (
                            <div key={`${idx}/${occIdx}`}>
                              {`${moment(occ.date).format('L')} ${occ.type}`}
                            </div>))}
                        </span>
                      )}
                    </td></tr>))}
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
        <div role="tabpanel" className={'tab-pane ' + (currentTab === tabId ? 'active' : '')} id={tabId}>
          {render()}
        </div>
      );
    };

    const renderTabs = () => {
      const tabs = [
        {
          id: 'plan',
          name: 'Plan',
          render: renderPlanTabConent
        },
        {
          id: 'tours',
          name: 'Touren',
          render: renderToursTabContent
        },
        {
          id: 'print',
          name: 'Druck',
          render: renderPrintTabContent
        }
      ];

      return (
        <div>
          <ul className="nav nav-tabs">
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
        <h1>Tour: {season.year}
          <LinkContainer to="/seasons">
            <button className="btn btn-primary">
              <i className="fa fa-pencil"/> Zurück
            </button>
          </LinkContainer>
        </h1>
        <DocumentMeta title={config.app.title + ': Tour ' + season.year}/>

        {error && <div className="text-danger">{error}</div>}

        {renderTabs()}

        <div className="row">
          <button className="btn btn-primary" onClick={handleEditStart(id)}>
            <i className="fa fa-pencil"/> Edit
          </button>
        </div>
      </div>
    );
  }
}
