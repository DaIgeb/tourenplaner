import {moment} from '../../../../shared/utils/moment';
import {timelineMatches} from '../../../../shared/utils/timeline';

export const calculateGradient = (distance, elevation) => {
  if (!distance) {
    return 0;
  }

  return elevation / distance / 10;
};

const getPoints = (previousTourDifficulty, currentDifficulty)=>{
  if (previousTourDifficulty < 1.1) {
    // was easy prioritize a difficult tour
    if (currentDifficulty < 1.1) {
      return 5;
    }
    if (currentDifficulty < 1.3) {
      return 8;
    }

    return 10;
  } else if (previousTourDifficulty < 1.3) {
    // was medium
    if (currentDifficulty < 1.1) {
      return 8;
    }

    if (currentDifficulty < 1.3) {
      return 10;
    }

    return 8;
  }

  // was hard
  if (currentDifficulty < 1.1) {
    return 10;
  }
  if (currentDifficulty < 1.3) {
    return 8;
  }

  return 5;
};

const getMaximalDifficulty = (allTours, tourId, tourDate)=>{
  const tour = allTours.find(to => to.id === tourId);
  if (!tour) {
    return 0;
  }
  const timeline = tour.timelines.find(tl => timelineMatches(tl, moment(tourDate)));

  return calculateGradient(timeline.distance, timeline.elevation);
};

const getMaxDifficulty = (allTours, previousTours) => {
  if (!previousTours) {
    return 0;
  }

  return previousTours.tours.map(prevTour => {
    if (isNaN(prevTour.tour)) {
      return 0;
    }

    const relevantCandidate = prevTour.candidates[prevTour.tour];
    if (!relevantCandidate) {
      console.error(prevTour);
    }

    return getMaximalDifficulty(allTours, relevantCandidate.tour, previousTours.date);
  }).sort().reverse();
};

export function createScore(allTours, currentTourTimeline, previousTours) {
  const previousTourDifficulties = getMaxDifficulty(allTours, previousTours);
  const previousTourDifficulty = previousTourDifficulties[0];

  const currentDifficulty = calculateGradient(currentTourTimeline.distance, currentTourTimeline.elevation);
  const difficultyPoints = getPoints(previousTourDifficulty, currentDifficulty);

  return {
    name: 'Difficulty check',
    score: difficultyPoints,
    note: `Elevation is ${currentDifficulty} %, previous tour had ${previousTourDifficulties.join('/')} %`
  };
}