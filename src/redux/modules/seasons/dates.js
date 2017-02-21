import { TourType } from 'models';
import { moment } from '../../../../shared/utils/moment';
import { SpecialDateAction } from '../configurations';

function handleSpecialDate(specialDate) {
  switch (specialDate.action.id) {
    case SpecialDateAction.remove.id:
      return [{
        type: TourType.none,
        tour: 0,
        candidates: [
          {
            tour: null,
            scores: [
              {
                name: 'Special date override',
                score: 0,
                note: specialDate.name
              }
            ],
            points: specialDate.points
          }
        ]
      }];
    case SpecialDateAction.add.id:
    case SpecialDateAction.replace.id:
      return specialDate.tours.map(item => {
        return {
          type: item.type,
          tour: 0,
          candidates: [
            {
              tour: item.id,
              scores: [
                {
                  name: 'Special date override',
                  score: 0,
                  note: specialDate.name
                }
              ]
            }
          ],
          points: specialDate.points
        };
      });
    default:
      console.error('Invalid special-date action');
      return [];
  }
}

function createTourForDate(date, eveningStart, eveningEnd) {
  switch (date.day()) {
    case 0:
      return [{
        type: TourType.morning,
        tour: null,
        candidates: []
      }];
    case 6:
      return [{
        type: TourType.afternoon,
        tour: null,
        candidates: []
      }];
    case 2:
    case 4:
      if (date.isBetween(eveningStart, eveningEnd, 'day')) {
        return [{
          type: TourType.evening,
          tour: null,
          candidates: []
        }];
      }
      break;
    default:
      break;
  }
  return [];
}

export function createDates(configuration) {
  const date = moment(configuration.seasonStart, moment.ISO_8601);
  const end = moment(configuration.seasonEnd, moment.ISO_8601);
  const eveningStart = moment(configuration.eveningStart, moment.ISO_8601).subtract(1, 'd');
  const eveningEnd = moment(configuration.eveningEnd, moment.ISO_8601).add(1, 'd');
  const dates = [];
  const findSpecialDate = (dateToCheck) => {
    const specialDates = configuration.specialDates.filter(sd => sd.date === dateToCheck);
    switch (specialDates.length) {
      case 0:
        return undefined;
      case 1:
        return specialDates[0];
      default: {
        console.warn('Multiple special-dates defined', dateToCheck, specialDates);
        return specialDates[0];
      }
    }
  };

  while (date.isBefore(end, 'day') || date.isSame(end, 'day')) {
    const newDateEntry = {
      date: date.toISOString(),
      tours: []
    };

    const specialDate = findSpecialDate(date.toISOString());
    if (specialDate) {
      newDateEntry.description = specialDate.name;
      newDateEntry.tours.push.apply(newDateEntry.tours, handleSpecialDate(specialDate));
    }

    if (!specialDate || specialDate.action.id === SpecialDateAction.add.id) {
      newDateEntry.tours.push.apply(newDateEntry.tours, createTourForDate(date, eveningStart, eveningEnd));
    }

    if (newDateEntry.tours.length || specialDate) {
      dates.push(newDateEntry);
    }

    date.add(1, 'd');
  }

  // TODO handle special dates outside of range
  configuration.specialDates.filter(specialDate => {
    const momentDate = moment(specialDate.date);
    const notEqualToStart = momentDate.isSame(configuration.seasonStart, 'day');
    const notEqualtToEnd = momentDate.isSame(configuration.seasonEnd, 'day');
    const notBetweenStartAndEnd = !momentDate.isBetween(configuration.seasonStart, configuration.seasonEnd, 'day');

    return notEqualToStart &&
      notEqualtToEnd &&
      notBetweenStartAndEnd;
  }).forEach(specialDate => {
    const newDateEntry = {
      description: specialDate.name,
      date: specialDate.date,
      tours: handleSpecialDate(specialDate)
    };
    const existingEntries = dates.find((entry) => entry.date === newDateEntry.date);
    if (existingEntries.length > 0) {
      console.warn('Duplicate entries for date', newDateEntry.date, existingEntries);
    }
    dates.push(newDateEntry);
  });

  return dates;
}
