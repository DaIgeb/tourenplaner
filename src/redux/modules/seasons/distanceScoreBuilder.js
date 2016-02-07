import {moment} from '../../../../shared/utils/moment';
import {TourType} from 'models';

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

const getFactor = (momentDate, eveningStartDate, seasonStartDate) => {
  if (momentDate.dayOfYear() > eveningStartDate) {
    return 1;
  }
  return ((momentDate.dayOfYear() - seasonStartDate) / eveningStartDate - seasonStartDate) / 10 + 0.9;
};

export function createScore(configuration, date, type, distance, elevation) {
  const momentDate = moment(date);
  const seasonStartDate = moment(configuration.seasonStart).dayOfYear();
  const eveningStartDate = moment(configuration.eveningStart).dayOfYear();
  const distanceFactor = getFactor(momentDate, seasonStartDate, eveningStartDate);

  const effectiveDistance = distance + ((elevation ? elevation : 0) * 10 / 1000);
  const expectedDistance = distanceFactor * baseDistance(type);
  const distanceViolation = Math.round(Math.abs(expectedDistance - effectiveDistance) / 5);

  return {
    name: 'Distance check',
    score: 10 - (distanceViolation ? distanceViolation - 1 : 0),
    note: `Distance expected ${expectedDistance} got ${effectiveDistance}`
  };
}
