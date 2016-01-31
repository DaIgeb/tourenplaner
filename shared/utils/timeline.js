import {moment} from './moment';

export function timelineMatches(timeline, date) {
  const fromDate = moment(timeline.from, moment.ISO_8601, true);
  const untilDate = moment(timeline.until, moment.ISO_8601, true);

  if (!date.isValid()) {
    return false;
  }

  if (!fromDate.isValid() && timeline.from) {
    return false;
  }
  if (!untilDate.isValid() && timeline.until) {
    return false;
  }

  if (fromDate.isValid() && fromDate > date) {
    return false;
  }

  if (untilDate.isValid() && untilDate < date) {
    return false;
  }

  return true;
}
