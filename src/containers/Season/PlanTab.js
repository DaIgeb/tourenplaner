import React, {Component, PropTypes} from 'react';
import {renderPagedContent} from 'utils/pagination';
import {moment, defaultTimeZone, defaultLocale} from '../../../shared/utils/moment';
import {timelineMatches} from '../../../shared/utils/timeline';
import {TourType} from 'models';

export class PlanTab extends Component {
  static propTypes = {
    currentPage: PropTypes.number.isRequired,
    season: PropTypes.object.isRequired,
    restaurants: PropTypes.array.isRequired,
    tours: PropTypes.array.isRequired,
    size: PropTypes.number.isRequired,
    selectPage: PropTypes.func.isRequired
  };
  constructor(props) {
    super(props);
  }

  findTour = (tourId) => {
    const {tours} = this.props; // eslint-disable-line no-shadow

    return tours.find(tourObj => tourObj.id === tourId);
  };

  checkRestaurant = (date, tour, tourObj) => {
    if (!tourObj) {
      return null;
    }
    const {restaurants} = this.props;
    const momentDate = moment(date.date);
    const tourTl = tourObj.timelines.find(tl => timelineMatches(tl, momentDate));
    const tourRestaurants = tourTl.restaurants.map(rest => restaurants.find(item => item.id === rest));
    const candidateRestaurants = tourRestaurants.map(rest => {
      return {
        ...rest,
        timeline: rest.timelines.find(tl => timelineMatches(tl, momentDate))
      };
    });
    const weekday = momentDate.locale('en-CH').format('dddd');
    moment.locale(defaultLocale);
    const relevantBusinesHour = candidateRestaurants.map(rest => {
      return {
        ...rest,
        businessHours: rest.timeline.businessHours.filter(hours => hours.weekday === weekday)
      };
    });
    if (relevantBusinesHour.filter(hour => !hour.businessHours.length).length) {
      return <span className="bg-danger">Geschlossen - {relevantBusinesHour.map(hour => hour.timeline.notes).join(' - ')}</span>;
    }

    const hasOpenBusinessHours = (businessHours, from, to) => {
      return businessHours.filter(hour => hour.until < from || hour.from > to).length > 0;
    };

    switch (tour.type.id) {
      case TourType.afternoon.id:
        if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour.businessHours, 15, 16)).length) {
          return relevantBusinesHour.map((hours, idx) => (
            <span className="bg-danger" key={idx}>
              Offen {hours.businessHours.map(hour => `von ${hour.from.hour} bis ${hour.until.hour}`).join(', ')}
            </span>));
        }
        break;
      case TourType.evening.id:
        if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour.businessHours, 18, 19)).length) {
          return relevantBusinesHour.map((hours, idx) => (
            <span className="bg-danger" key={idx}>
              Offen {hours.businessHours.map(hour => `von ${hour.from.hour} bis ${hour.until.hour}`).join(', ')}
            </span>));
        }
        break;
      case TourType.morning.id:
        if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour.businessHours, 9, 10)).length) {
          return relevantBusinesHour.map((hours, idx) => (
            <span className="bg-danger" key={idx}>
              Offen {hours.businessHours.map(hour => `von ${hour.from.hour} bis ${hour.until.hour}`).join(', ')}
            </span>));
        }
        break;
      default:
        break;
    }

    if (relevantBusinesHour.filter(hour => hour.timeline.notes).length) {
      return <span className="bg-warning">{relevantBusinesHour.map(hour => hour.timeline.notes).join(' - ')}</span>;
    }

    return relevantBusinesHour.map(hours => `Offen ${hours.businessHours.map(hour => `von ${hour.from.hour} bis ${hour.until.hour}`).join(', ')}`).join('. ');
  };

  renderTooltip = (tour) => {
    const scoreNames = tour.candidates
      .map(candidate => candidate.scores.map(score => score.name))
      .reduce((item1, item2) => item1.concat(item2), [])
      .reduce((item1, item2) => item1.indexOf(item2) < 0 ? item1.concat([item2]) : item1, []);
    const candidates = tour.candidates.map(candidate => this.findTour(candidate.tour)).map(canTour => canTour ? canTour.name : 'Unbekannte Tour');
    return {
      candidates: candidates.length,
      tooltip: (
        <span>
          <table>
            <thead>
            <tr>
              <th>Wertung</th>
              {candidates.map((candidate, canIdx) => <th key={canIdx}>{candidate}</th>)}
            </tr>
            </thead>
            <tbody>
            {scoreNames.map((score, scoreIdx) => (
              <tr key={scoreIdx}>
                <td>{score}</td>
                {tour.candidates.map((candidate, canIdx) => <td key={canIdx}>{candidate.scores.find(canScore => canScore.name === score).score}</td>)}
              </tr>))}
            </tbody>
          </table>
        </span>)
    };
  };

  renderTour = (date, tour, idx) => {
    const styles = require('./Season.scss');
    const tourObj = !isNaN(tour.tour) && tour.tour >= 0 ? this.findTour(tour.candidates[tour.tour].tour) : null;
    const restaurantCheck = this.checkRestaurant(date, tour, tourObj);
    const tooltip = this.renderTooltip(tour);
    if (idx === 0) {
      return [
        (<td key="warn">{restaurantCheck}</td>),
        (<td key="type" className={tooltip.candidates ? styles.scoretip : ''}>
          {tour.type.label}
          {tooltip.tooltip}
        </td>),
        (<td key="name">
          {tourObj ? tourObj.name : ''}
        </td>)
      ];
    }

    return [
      (<td key="warn">{restaurantCheck}</td>),
      (<td key="type" className={tooltip.candidates ? styles.scoretip : ''}>
        {tour.type.label}
        {tooltip.tooltip}
      </td>),
      (<td key="name">
        {tourObj ? tourObj.name : 'Unkown tour'}
      </td>)
    ];
  };

  renderDates = (date, idx) => {
    const momentDate = moment.tz(date.date, moment.ISO_8601, true, defaultTimeZone);
    const dateString = momentDate.isValid() ? momentDate.format('L') : '-';
    const dateAndDescription = date.description ? dateString + ` (${date.description})` : dateString;
    const rowSpan = date.tours.length;

    const result = [(
      <tr key={idx + '/0'}>
        <td rowSpan={rowSpan}>{dateAndDescription}</td>
        <td rowSpan={rowSpan}><input type="checkbox" {...date.locked} onClick={evt => evt.stopPropagation()}/></td>
        {this.renderTour(date, date.tours[0], 0)}
      </tr>)
    ];

    date.tours
      .forEach((tour, index) => {
        if (index > 0) {
          result.push((
            <tr key={idx + '/' + (index)}>
              {this.renderTour(date, tour, index)}
            </tr>)
          );
        }
      });
    return result.filter(item => item);
  };

  render() {
    const {season, currentPage, size, selectPage} = this.props;
    const lowerBound = currentPage * size;
    const upperBound = lowerBound + size;

    const datesToRender = season.dates ? season.dates.filter((date, idx) => idx >= lowerBound && idx < upperBound) : [];

    return (
      <div className="row">
        <div className="col-md-12">
          {renderPagedContent(currentPage, size, Math.ceil((season.dates ? season.dates.length : 0 ) / size), (number) => selectPage(number), () => {
            return (
              <table className="table table-striped table-hover table-condensed">
                <thead>
                <tr>
                  <td className="col-md-2">Datum</td>
                  <td className="col-md-1"/>
                  <td className="col-md-3"/>
                  <td className="col-md-2">Tourart</td>
                  <td className="col-md-4">Tour</td>
                </tr>
                </thead>
                <tbody>
                {datesToRender.map((date, idx) => this.renderDates(date, idx + lowerBound))}
                </tbody>
              </table>
            );
          })}
        </div>
      </div>);
  }
}
