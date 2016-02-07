import {TourType} from 'models';
import {moment} from '../../../../shared/utils/moment';
import {SpecialDateAction} from '../configurations';

function handleSpecialDate(specialDate) {
  switch (specialDate.action.id) {
    case SpecialDateAction.remove.id:
      return [{
        type: TourType.none.label,
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
            ]
          }
        ]
      }];
    case SpecialDateAction.add.id:
    case SpecialDateAction.replace.id:
      return specialDate.tours.map(item => {
        return {
          type: item.type.label,
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
          ]
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
  const findSpecialDate = (dateToCheck) => configuration.specialDates.find(sd => sd.date === dateToCheck);

  while (date.isBefore(end, 'day')) {
    const specialDate = findSpecialDate(date.toISOString());
    const newDateEntry = {
      date: date.toISOString(),
      tours: []
    };

    if (specialDate) {
      newDateEntry.description = specialDate.name;
      newDateEntry.tours.push.apply(newDateEntry.tours, handleSpecialDate(specialDate));
    }

    if (!specialDate || specialDate.action.id === SpecialDateAction.add.id) {
      newDateEntry.tours.push.apply(newDateEntry.tours, createTourForDate(date, eveningStart, eveningEnd));
    }

    if (newDateEntry.tours.length) {
      dates.push(newDateEntry);
    }

    date.add(1, 'd');
  }

  // TODO handle special dates outside of range
  configuration.specialDates.filter(specialDate => {
    const momentDate = moment(specialDate.date);
    const notEqualToStart = !momentDate.isSame(configuration.seasonStart, 'day');
    const notEqualtToEnd = !momentDate.isSame(configuration.seasonEnd, 'day');
    const notBetweenStartAndEnd = !momentDate.isBetween(configuration.seasonStart, configuration.seasonEnd, 'day');

    return notEqualToStart &&
      notEqualtToEnd &&
      notBetweenStartAndEnd;
  }).forEach(specialDate => {
    const newDateEntry = {
      description: specialDate.name,
      date: date.toISOString(),
      tours: handleSpecialDate(specialDate)
    };
    dates.push(newDateEntry);
  });

  return dates;
}
/*
 const createScores = (configuration, date, previousTours, usedTours) => {
 const momentDate = moment(date.date);

 const scoresByTour = tours.map(item => {
 const timeline = item.timelines.find(tl => timelineMatches(tl, momentDate));

 const scores = [
 {
 name: 'Tour-Type matching',
 score: item.types.find(type => date.type.id === type.id) ? 10 : 0,
 note: `Checking for type ${date.type.label}`
 },
 {
 name: 'Tour-Usage check',
 score: 10 - usedTours.filter(seasonTour => seasonTour === item.id).length * 3,
 note: `Counting usages for tour`
 },
 createDistanceScore(configuration, date.date, date.type, timeline.distance, timeline.elevation),
 createDifficultyScore(tours, timeline, previousTours),
 createLocationScore(tours, timeline, previousTours),
 {
 name: 'Restaurant check',
 score: 10,
 note: `Restaurant must be open`
 }
 ];
 return {
 tourId: item.id,
 totalScore: scores.reduce((sum, score) => sum + score.score, 0),
 scores: scores
 };
 }).sort((item1, item2) => item2.totalScore - item1.totalScore);
 const bestScore = scoresByTour[0].totalScore;
 const relevantScores = scoresByTour.filter(score => score.totalScore === bestScore);

 const chosenItem = Math.floor(Math.random() * relevantScores.length);
 return relevantScores.slice(chosenItem, 1);
 };
 */
