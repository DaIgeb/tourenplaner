import React, {Component, PropTypes} from 'react';
import {timelineMatches} from '../../../shared/utils/timeline';
import {TourType} from 'models';
import {moment} from '../../../shared/utils/moment';

export class PrintTab extends Component {
  static propTypes = {
    season: PropTypes.object.isRequired,
    configuration: PropTypes.object.isRequired,
    tours: PropTypes.array.isRequired,
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
    const {tours, season, configuration} = this.props;
    const datesByMonth = [];
    const usedTours = [];
    const startRoutes = [];
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
          let mappedTour = usedTours.find(ut => ut.id === candidate.tour);
          if (!mappedTour) {
            mappedTour = this.createRouteViewModel(candidate, parsedDate);
            if (mappedTour) {
              const startRoute = startRoutes.find(item => item.name === mappedTour.startroute);
              if (!startRoute && mappedTour.startroute) {
                const tourObj = tours.find(st => st.name === mappedTour.startroute);
                startRoutes.push(this.createTourViewModel(tourObj, parsedDate));
              }

              usedTours.push(mappedTour);
            }
          }

          return {
            tour: mappedTour ? this.getTourName(mappedTour, parsedDate, tour.type) : null,
            tourId: mappedTour && mappedTour.distance > 0 ? mappedTour.id : null,
            description: date.description,
            points: tour.points ? tour.points : this.getPointsByType(tour.type),
            date: idx === 0 ? `${parsedDate.format('dd')} ${parsedDate.format('L')}` : null,
            day: idx === 0 ? parsedDate.format('dd') : null
          };
        });

        month.dates = month.dates.concat(tourViewModels);
      });

    usedTours.sort((item1, item2) => item1.name.localeCompare(item2.name));
    startRoutes.sort((item1, item2) => item1.id - item2.id);
    const eveningStart = moment(configuration.eveningStart).format('D. MMMM');
    const eveningEnd = moment(configuration.eveningEnd).format('D. MMMM');
    const logo = require('./RVW-Logo.png');
    const renderTourName = (tour) => {
      if (tour.tour) {
        if (tour.tourId) {
          return <a href={`#tour-${tour.tourId}`}>{tour.tour}</a>;
        }

        return tour.tour;
      }

      if (tour.points) {
        return tour.description;
      }

      return `${tour.description} (Keine Tour)`;
    };
    const mapEevent = (event) => {
      return {
        ...event,
        from: moment(event.from),
        to: moment(event.to)
      };
    };
    const renderEvent = (event, idx) => {
      const dateFrom = event.from.format('L');
      const dateTo = event.to.isValid() && !event.from.isSame(event.to, 'day') ? event.to.format('L') : null;

      return (
        <div key={idx} className="row">
          <div className="col-xs-6">{event.name} in {event.location}</div>
          <div className="col-xs-6">{dateFrom} {dateTo ? (<span>&mdash; {dateTo}</span>) : ''}</div>
        </div>
      );
    };

    const mappedEvents = configuration.events.map(mapEevent).sort((evt1, evt2) => {
      const diff = evt1.from.diff(evt2.from, 'days');
      if (diff === 0) {
        const evt1Length = evt1.from.diff(evt1.to, 'days');
        const evt2Length = evt2.from.diff(evt2.to, 'days');

        return evt2Length - evt1Length;
      }

      return diff;
    });

    const styles = require('./PrintTab.scss');
    return (
      <div className={styles.print + ' container' }>
        <div className="row">
          <h1>RVW Tourenplan {season.year} <img src={logo} className={styles.logo}/></h1>
          <h2> Events</h2>
          {mappedEvents.map(renderEvent)}
          <h2> Touren</h2>
          {datesByMonth.map(month => (
            <div className={'col-xs-12 ' + styles.noPageBreak}>
              <div className="row">
                <div className="col-xs-12">
                  <h3>{month.monthName}</h3>
                </div>
              </div>
              <div className={styles.list}>
                {month.dates.map(date => (
                  <div className={styles.listItem + ' row ' + (date.points === 40 ? styles.fullday : '')}>
                    <div className="col-xs-3">{date.date}&nbsp;</div>
                    <div className={styles.tourNameCol + ' col-xs-8'}>{renderTourName(date)}&nbsp;</div>
                    <div className="col-xs-1">{date.points}&nbsp;</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
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
          </div>
        </div>
        <div className={styles.description}>
          <h1>RVW Tourenbeschrieb {season.year} <img src={logo} className={styles.logo}/></h1>
          {usedTours.filter(tour => tour.distance > 0).map((tour, idx) => (
            <div className="row" key={idx} id={`tour-${tour.id}`}>
              <div className="col-xs-2">
                <b>{tour.name}</b><br/>
                ca {tour.distance} km<br />
                ca {tour.elevation} hm
              </div>
              <div className="col-xs-2">
                <a href={`#start-route-${tour.startrouteId}`}>{tour.startroute}</a>
              </div>
              <div className="col-xs-8">
                {tour.locations.map((loc, locIdx) => (
                  <span key={locIdx}>{locIdx ? ' - ' : ''}
                    <a href={loc.maps}>
                      {loc.restaurant ? <b>{loc.name}</b> : loc.name}
                    </a>
                  </span>))}
              </div>
            </div>))}
        </div>
        <div className={styles.description}>
          <h2>Start-Routen</h2>
          {startRoutes.map((tour, idx) => (
            <div className="row" key={idx} id={`start-route-${tour.id}`}>
              <div className="col-xs-3">
                <b>{tour.name}</b>
              </div>
              <div className="col-xs-9">
                {tour.locations.map((loc, locIdx) => (
                  <span key={locIdx}>{locIdx ? ' - ' : ''}
                    <a href={loc.maps}>{loc.name}</a>
                  </span>))}
              </div>
            </div>))}
        </div>
      </div>);
  }
}
