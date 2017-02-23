import { moment, defaultLocale } from '../../../../shared/utils/moment';
import { timelineMatches } from '../../../../shared/utils/timeline';
import { TourType } from 'models';

function checkRestaurant(restaurants, tour, tourInstance, tourToCalculate) {
  if (!tourInstance) {
    return null;
  }
  const momentDate = moment(tour.date);
  const tourRestaurants = tourToCalculate.restaurants.map(rest => restaurants.find(item => item.id === rest));
  const candidateRestaurants = tourRestaurants.map(rest => rest.timelines.find(tl => timelineMatches(tl, momentDate)) || { businessHours: [] });
  const weekday = momentDate.locale('en-CH').format('dddd');
  moment.locale(defaultLocale);
  const relevantBusinesHour = candidateRestaurants.map(rest => rest.businessHours.filter(hours => hours.weekday === weekday) || []);

  if (relevantBusinesHour.filter(hour => !hour.length).length) {
    return 'closed';
  }

  const hasOpenBusinessHours = (businessHours, from, to) => {
    const openHours = businessHours.filter(hour => hour.from.hour <= from && hour.until.hour >= to);
    return openHours.length > 0;
  };

  switch (tourInstance.type.id) {
    case TourType.afternoon.id:
      if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour, 15, 16)).length) {
        return 'open';
      }

      return 'closed';
    case TourType.evening.id:
      if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour, 18, 19)).length) {
        return 'open';
      }

      return 'closed';
    case TourType.morning.id:
      if (relevantBusinesHour.filter(hour => hasOpenBusinessHours(hour, 10, 11)).length) {
        return 'open';
      }

      return 'closed';
    default:
      break;
  }

  if (relevantBusinesHour.filter(hour => hour.notes).length) {
    return 'note';
  }

  return 'open';
}

export function createScore(restaurants, tour, tourInstance, tourToCalculate) {
  switch (checkRestaurant(restaurants, tour, tourInstance, tourToCalculate)) {
    case 'closed': {
      return {
        name: 'Restaurant check',
        score: 0,
        note: `Restaurand closed`
      };
    }
    case 'open': {
      return {
        name: 'Restaurant check',
        score: 10,
        note: `Restaurand open`
      };
    }
    default: {
      return {
        name: 'Restaurant check',
        score: 8,
        note: `Restaurand maybe open; check notes`
      };
    }
  }
}
