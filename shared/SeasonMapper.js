import {TourType} from './';
import {moment} from './utils/moment';
import {timelineMatches} from './utils/timeline';

export class SeasonMapper {
  constructor(configurations, tours, restaurants, locations) {
    this.configurations = configurations;
    this.restaurants = restaurants;
    this.locations = locations;
    this.tours = tours;
  }

  map = (season) => {
    const configration = this.configurations.find(conf => conf.id === season.configuration);
    const usedTours = [];
    const startRoutes = [];
    const tours = season.dates.map(date => this.mapDate(date, usedTours, startRoutes)).reduce((item1, item2) => item1.concat(item2));
    return {
      events: configration.events.map(this.mapEvents).sort((evt1, evt2) => {
        const diff = evt1.from.diff(evt2.from, 'days');
        if (diff === 0) {
          const evt1Length = evt1.from.diff(evt1.to, 'days');
          const evt2Length = evt2.from.diff(evt2.to, 'days');

          return evt2Length - evt1Length;
        }

        return diff;
      }),
      tours: tours,
      routes: usedTours.sort((item1, item2) => item1.name.localeCompare(item2.name)).filter(tour => tour.distance > 0),
      starts: startRoutes.sort((item1, item2) => item1.id - item2.id)
    };
  };

  mapEvents = (event) => {
    return {
      ...event,
      from: moment(event.from),
      to: moment(event.to)
    };
  };

  mapDate = (dateObj, usedTours, startRoutes) => {
    const date = moment(dateObj.date, moment.ISO_8601, true);

    return dateObj.tours.map(tour => this.mapTour(dateObj, date, tour, usedTours, startRoutes));
  };

  mapTour = (dateObj, date, tour, usedTours, startRoutes) => {
    const candidate = tour.candidates[tour.tour];
    let mappedTour = usedTours.find(ut => ut.id === candidate.tour);
    if (!mappedTour) {
      mappedTour = this.createRouteViewModel(candidate, date);
      if (mappedTour) {
        if (mappedTour.startroute) {
          const startRoute = startRoutes.find(item => item.id === mappedTour.startroute.id);
          if (!startRoute) {
            startRoutes.push(mappedTour.startroute);
          }
        }

        usedTours.push(mappedTour);
      }
    }

    return {
      id: mappedTour && mappedTour.distance > 0 ? mappedTour.id : null,
      date: date,
      tour: mappedTour ? this.getTourName(mappedTour, date, tour.type) : null,
      description: dateObj.description,
      points: tour.points ? tour.points : this.getPointsByType(tour.type)
    };
  };

  createRouteViewModel = (candidate, date) => {
    const {tours} = this;
    const tour = tours.find(item => item.id === candidate.tour);

    if (tour) {
      return this.createTourViewModel(tour, date);
    }

    return null;
  };

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

  createTourViewModel = (tour, date) => {
    const {tours, locations, restaurants} = this;
    const timeline = tour.timelines.find(tl => timelineMatches(tl, date));
    if (!timeline) {
      console.log('No timeline', tour, date);
    }
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
      id: tour.id,
      name: `${tour.name}${foreignCountry ? ' (ID)' : ''}`,
      startroute: startRoute ? this.createTourViewModel(startRoute, date) : null,
      locations: locationsInTour.map(loc => this.mapLocation(loc, restaurantsInTour)),
      distance: timeline.distance,
      elevation: timeline.elevation
    };
  };

  mapLocation = (location, possibleRestaurants) => {
    const restaurant = possibleRestaurants.find(rest => rest.location === location.id);
    if (restaurant) {
      const name = `${restaurant.nameForTour ? restaurant.nameForTour : location.city} (${location.name}/${restaurant.phone})`;
      return {
        restaurant: true,
        name: name,
        maps: `http://www.google.com/maps/place/${location.latitude},${location.longitude}`
      };
    }

    return {
      restaurant: false,
      name: location.name,
      maps: `http://www.google.com/maps/place/${location.latitude},${location.longitude}`
    };
  }
}
