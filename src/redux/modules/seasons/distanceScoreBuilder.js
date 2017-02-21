import { moment } from '../../../../shared/utils/moment';
import Difficulty from '../../../models/Difficulty';
import { TourType } from 'models';

const baseDistance = (type) => {
  switch (type.id) {
    case TourType.morning.id:
      return 75;
    case TourType.evening.id:
      return 55;
    case TourType.afternoon.id:
      return 90;
    default:
      return 100;
  }
};

const getFactor = (dayOfYear, seasonStartDate, eveningStartDate, eveningEndDate, seasonEnd) => {
  if (dayOfYear > eveningEndDate) {
    return ((seasonEnd - dayOfYear) / (seasonEnd - eveningEndDate)) / 10 + 0.9;
  }

  if (dayOfYear > eveningStartDate) {
    return 1;
  }

  return ((dayOfYear - seasonStartDate) / (eveningStartDate - seasonStartDate)) / 10 + 0.9;
};

export function createScore(configuration, date, type, distance, elevation) {
  const momentDate = moment(date);
  const seasonStartDate = moment(configuration.seasonStart).dayOfYear();
  const seasonEnd = moment(configuration.seasonEnd).dayOfYear();
  const eveningStartDate = moment(configuration.eveningStart).dayOfYear();
  const eveningEndDate = moment(configuration.eveningEnd).dayOfYear();
  const distanceFactor = getFactor(momentDate.dayOfYear(), seasonStartDate, eveningStartDate, eveningEndDate, seasonEnd);

  const effectiveDistance = distance + ((elevation ? elevation : 0) * 10 / 1000);
  const expectedDistance = distanceFactor * baseDistance(type);
  const distanceViolation = Math.round(Math.abs(expectedDistance - effectiveDistance) / 5);

  return {
    name: 'Distance check',
    score: 10 - (distanceViolation ? distanceViolation - 1 : 0),
    note: `Distance expected ${expectedDistance} got ${effectiveDistance}`
  };
}

export function createDifficultyScore(configuration, date, difficulty) {
  const dayOfYear = moment(date).dayOfYear();
  const allAllowed = moment(configuration.eveningStart).add(3, 'w');
  const allAllowedDayOfYear = allAllowed.dayOfYear();
  const seasonStartDayOfYear = moment(configuration.seasonStart).dayOfYear();

  if (dayOfYear > allAllowedDayOfYear) {
    return {
      name: 'Difficulty by date check',
      score: 10,
      note: `All difficulties allowed after ${allAllowed.format()}`
    };
  }

  if ((dayOfYear - seasonStartDayOfYear) / (allAllowedDayOfYear - seasonStartDayOfYear) > 0.5) {
    switch (difficulty.id) {
      case Difficulty.easy.id:
        return {
          name: 'Difficulty by date check',
          score: 10,
          note: `Difficulty expected ${Difficulty.easy.label} or ${Difficulty.medium.label}  got ${difficulty.label}`
        };
      case Difficulty.medium.id:
        return {
          name: 'Difficulty by date check',
          score: 5,
          note: `Difficulty expected ${Difficulty.easy.label} or ${Difficulty.medium.label}  got ${difficulty.label}`
        };
      default:
        return {
          name: 'Difficulty by date check',
          score: 0,
          note: `Difficulty expected ${Difficulty.easy.label} or ${Difficulty.medium.label}  got ${difficulty.label}`
        };
    }
  }

  return {
    name: 'Difficulty by date check',
    score: difficulty.id === Difficulty.easy.id ? 10 : 0,
    note: `Difficulty expected ${Difficulty.easy.label} got ${difficulty.label}`
  };
}

