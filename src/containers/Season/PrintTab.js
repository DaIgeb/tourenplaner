import React, {Component, PropTypes} from 'react';
import {timelineMatches} from '../../../shared/utils/timeline';
import {TourType, SeasonMapper} from 'models';
import {moment} from '../../../shared/utils/moment';

export class PrintTab extends Component {
  static propTypes = {
    season: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    tours: PropTypes.array.isRequired,
    configurations: PropTypes.array.isRequired,
    locations: PropTypes.array.isRequired,
    restaurants: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);
  }

  getPointsByType = (type) => {
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

  getTourName = (tour, date, type) => {
    if (!tour) {
      return null;
    }

    const tourName = tour.name;

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

  createRouteViewModel = (candidate, date) => {
    const {tours} = this.props;
    const tourObj = tours.find(item => item.id === candidate.tour);

    if (tourObj) {
      return this.createTourViewModel(tourObj, date);
    }

    return null;
  };

  createTourViewModel = (tourObj, date) => {
    const {tours, locations, restaurants} = this.props;
    const timeline = tourObj.timelines.find(tl => timelineMatches(tl, date));
    const startRoute = tours.find(to => to.id === timeline.startroute);
    const locationsInTour = timeline.locations.map(loc => locations.find(item => item.id === loc));
    const restaurantsInTour = timeline.restaurants.map(rest => {
      const restaurant = restaurants.find(re => re.id === rest);
      const restTl = restaurant.timelines.find(tl => timelineMatches(tl, date));
      return {
        location: restaurant.location,
        nameForTour: restaurant.nameForTour,
        ...restTl
      };
    });
    const foreignCountry = locationsInTour.find(loc => loc.addressCountry && loc.addressCountry !== 'CH');

    return {
      id: tourObj.id,
      name: `${tourObj.name}${foreignCountry ? ' (ID)' : ''}`,
      startrouteId: startRoute ? startRoute.id : null,
      startroute: startRoute ? startRoute.name : null,
      locations: locationsInTour.map(loc => {
        const restaurant = restaurantsInTour.find(rest => rest.location === loc.id);
        if (restaurant) {
          const name = `${restaurant.nameForTour ? restaurant.nameForTour : loc.city} (${loc.name}/${restaurant.phone})`;
          return {
            restaurant: true,
            name: name,
            maps: `http://www.google.com/maps/place/${loc.latitude},${loc.longitude}`
          };
        }

        return {
          restaurant: false,
          name: loc.name,
          maps: `http://www.google.com/maps/place/${loc.latitude},${loc.longitude}`
        };
      }),
      distance: timeline.distance,
      elevation: timeline.elevation
    };
  };

  render() {
    const {tours, season, configuration, configurations, restaurants, locations} = this.props;
    const mapper = new SeasonMapper(configurations, tours, restaurants, locations);
    const mappedSeason = mapper.map(season);
    const datesByMonth = [];
    mappedSeason.tours.forEach(tour => {
      const monthId = tour.date.month();
      let month = datesByMonth.find(mon => mon.month === monthId);
      if (!month) {
        month = {
          month: monthId,
          monthName: tour.date.format('MMMM'),
          dates: []
        };

        datesByMonth.push(month);
      }
      const formattedDate = `${tour.date.format('dd')} ${tour.date.format('L')}`;
      const lastEntryDate = month.dates.length ? month.dates[month.dates.length - 1].date : null;
      month.dates.push({
        ...tour,
        date: lastEntryDate === formattedDate ? null : formattedDate
      });
    });

    const eveningStart = moment(configuration.eveningStart).format('D. MMMM');
    const eveningEnd = moment(configuration.eveningEnd).format('D. MMMM');
    const logo = require('./RVW-Logo.png');
    const renderTourName = (tour) => {
      if (tour.tour) {
        if (tour.id) {
          return <a href={`#tour-${tour.id}`}>{tour.tour}</a>;
        }

        return tour.tour;
      }

      if (tour.points) {
        return tour.description;
      }

      return `${tour.description} (Keine Tour)`;
    };
    const renderEvent = (event, idx) => {
      const dateFrom = event.from.format('L');
      const dateTo = event.to.isValid() && !event.from.isSame(event.to, 'day') ? event.to.format('L') : null;
      const description = `${event.name} in ${event.location}${event.organizer ? ` (${event.organizer})` : ''}`;

      return (
        <div key={idx} className="row">
          <div className="col-xs-6">{description}</div>
          <div className="col-xs-6">{dateFrom} {dateTo ? (<span>&mdash; {dateTo}</span>) : ''}</div>
        </div>
      );
    };
    const styles = require('./PrintTab.scss');
    const renderInfo = () => {
      return (
        <div className={'col-xs-12 ' + styles.noPageBreak}>
          <div className="row">
            <div className="col-xs-12"><strong>Treffpunkt <a
              href="https://goo.gl/maps/wJMuPAPSpTn">Museumsplatz</a></strong></div>
          </div>
          <div className="row">
            <div className="col-xs-5"><strong>Blüemli - Gruppe</strong></div>
            <div className="col-xs-6 col-xs-offset-1">gemütliches Tempo / Einsteigergruppe</div>

            <div className="col-xs-3 col-xs-offset-1">Abendtouren:</div>
            <div className="col-xs-2">17:50 Uhr</div>
            <div className="col-xs-6">Durchschnitt 22 -26 km/h</div>

            <div className="col-xs-3 col-xs-offset-1">Samstagstouren:</div>
            <div className="col-xs-8">13:20 Uhr</div>

            <div className="col-xs-3 col-xs-offset-1">Sonntagstouren:</div>
            <div className="col-xs-2">08:20 Uhr</div>
            <div className="col-xs-6">(bis {eveningStart} und ab {eveningEnd} 08.50 Uhr)</div>

            <div className="col-xs-3 col-xs-offset-1">Tagestouren:</div>
            <div className="col-xs-8">07:45 Uhr</div>
          </div>
          <div className="row">
            <div className="col-xs-5"><strong>Fitness - Gruppe</strong></div>
            <div className="col-xs-6 col-xs-offset-1">flottes Tempo / Routinierte Fahrer</div>

            <div className="col-xs-3 col-xs-offset-1">Abendtouren:</div>
            <div className="col-xs-2">18:00 Uhr</div>
            <div className="col-xs-6">Durchschnitt 24 -28 km/h</div>

            <div className="col-xs-3 col-xs-offset-1">Samstagstouren:</div>
            <div className="col-xs-8">13:30 Uhr</div>

            <div className="col-xs-3 col-xs-offset-1">Sonntagstouren:</div>
            <div className="col-xs-2">08:30 Uhr</div>
            <div className="col-xs-6">(bis {eveningStart} und ab {eveningEnd} 09.00 Uhr)</div>

            <div className="col-xs-3 col-xs-offset-1">Tagestouren:</div>
            <div className="col-xs-8">08:00 Uhr</div>
          </div>
          <div className="row">
            <div className="col-xs-6"><strong>Speed - Gruppe ab {eveningStart}</strong></div>
            <div className="col-xs-6">zügiges Tempo / gut trainierte Fahrer</div>

            <div className="col-xs-3 col-xs-offset-1">Abendtouren:</div>
            <div className="col-xs-2">18:10 Uhr</div>
            <div className="col-xs-6">Durchschnitt 26 -30 km/h</div>

            <div className="col-xs-3 col-xs-offset-1">Samstagstouren:</div>
            <div className="col-xs-8">13:40 Uhr</div>

            <div className="col-xs-3 col-xs-offset-1">Sonntagstouren:</div>
            <div className="col-xs-8">08:40 Uhr</div>

            <div className="col-xs-3 col-xs-offset-1">Tagestouren:</div>
            <div className="col-xs-8">08:15 Uhr</div>
          </div>
        </div>);
    };
    const renderLocation = (location, idx) => {
      return (
        <span key={idx}>{idx ? ' - ' : ''}
          <a href={location.maps}>
            {location.restaurant ? <b>{location.name}</b> : location.name}
          </a>
        </span>);
    };
    const renderDescription = (tour, idx) => {
      return [(
        <div className={styles.row} key={idx} >
          <div className={styles.cell2}>
            <h3 id={`tour-${tour.id}`}>{tour.name}</h3>
            ca {tour.distance} km<br />
            ca {tour.elevation} hm
          </div>
          <div className={styles.cell2}>
            <a href={`#start-route-${tour.startroute.id}`}>{tour.startroute.name}</a>
          </div>
          <div className={styles.cell7}>
            {tour.locations.map(renderLocation)}
          </div>
        </div>),
        <div className={styles.row} key={`${idx}/pagebreak`}></div>];
    };
    const renderStartRoute = (tour, idx) => {
      return [(
        <div className={styles.row} key={idx}>
          <div className={styles.cell2}>
            <h3 id={`start-route-${tour.id}`}>{tour.name}</h3>
          </div>
          <div className={styles.cell7}>
            {tour.locations.map(renderLocation)}
          </div>
        </div>),
        <div className={styles.row} key={`${idx}/pagebreak`}></div>];
    };

    return (
      <div className={styles.print + ' container' }>
        <div className="row">
          <h1>RVW Tourenplan {season.year} <img src={logo} className={styles.logo}/></h1>
          <h2> Events</h2>
          {mappedSeason.events.map(renderEvent)}
          <h2> Touren</h2>
          {datesByMonth.map((month, idx) => (
            <div key={idx} className={'col-xs-12 ' + styles.noPageBreak}>
              <div className="row">
                <div className="col-xs-12">
                  <h3>{month.monthName}</h3>
                </div>
              </div>
              <div className={styles.list}>
                {month.dates.map((date, dateIdx) => (
                  <div key={dateIdx} className={styles.listItem + ' row ' + (date.points >= 40 ? styles.fullday : '')}>
                    <div className="col-xs-3">{date.date}&nbsp;</div>
                    <div className={styles.tourNameCol + ' col-xs-7'}>{renderTourName(date)}&nbsp;</div>
                    <div className="col-xs-1">&nbsp;</div>
                    <div className="col-xs-1">{date.points}&nbsp;</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {renderInfo()}
        </div>
        <div className={styles.table}>
          <h1>RVW Tourenbeschrieb {season.year} <img src={logo} className={styles.logo}/></h1>
          <h2>Touren</h2>
          {mappedSeason.routes.map(renderDescription)}
        </div>
        <div className={styles.table}>
          <h2>Start-Routen</h2>
          {mappedSeason.starts.map(renderStartRoute)}
        </div>
      </div>);
  }
}
