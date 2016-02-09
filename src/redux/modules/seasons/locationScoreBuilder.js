import {timelineMatches} from '../../../../shared/utils/timeline';

const countMatchingLocations = (locations1, locations2) => {
  if (locations2) {
    return locations1.filter(locId =>
      locId !== 14 && // Winterthur Museumsplatz / Start/Endpunkt
      locations2.indexOf(locId) >= 0).length - 1;
  }

  return 0;
};

const findTimeline = (tourToCompare, date) => {
  if (!tourToCompare) {
    return 0;
  }

  const timelineToCompare = tourToCompare.timelines.find(tl => timelineMatches(tl, date));
  if (!timelineToCompare) {
    return 0;
  }

  return timelineToCompare;
};

const getTours = (allTours, previousTours) => {
  if (!previousTours) {
    return 0;
  }

  return previousTours.tours.map(prevTour => {
    if (isNaN(prevTour.tour)) {
      console.error(prevTour);
      return null;
    }

    const relevantCandidate = prevTour.candidates[prevTour.tour];
    if (!relevantCandidate) {
      console.error(prevTour);
    }

    return allTours.find(tour => tour.id === relevantCandidate.tour);
  });
};

export function createScore(allTours, currentTourTimeline, date, previousTours) {
  const previousTourTimelines = getTours(allTours, previousTours).map(tour => findTimeline(tour, date));
  const locationComparison = previousTourTimelines.map(prevTour => countMatchingLocations(currentTourTimeline.locations, prevTour.locations));
  const maximumMatchingLocations = locationComparison.reduce((sum, newCount) => sum + newCount, 0);

  return {
    name: 'Locations check',
    score: 10 - locationComparison.reduce((sum, newCount) => sum + newCount, 0),
    note: `Locations expected 0 matches got ${maximumMatchingLocations}`
  };
}
