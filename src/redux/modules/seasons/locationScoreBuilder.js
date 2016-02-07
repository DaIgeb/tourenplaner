import {timelineMatches} from '../../../../shared/utils/timeline';

const countMatchingLocations = (locations1, locations2) => {
  if (locations2) {
    return locations1.filter(locId =>
      locId !== 14 && // Winterthur Museumsplatz / Start/Endpunkt
      locations2.indexOf(locId) >= 0).length - 1;
  }

  return 0;
};

const findTimeline = (tourObject, tours) => {
  const tourId = tourObject.tourId;
  if (!tourId) {
    return 0;
  }
  const tourToCompare = tours.find(item => item.id === tourId);
  if (!tourToCompare) {
    return 0;
  }

  const timelineToCompare = tourToCompare.timelines.find(tl => timelineMatches(tl, tourObject.date));
  if (!timelineToCompare) {
    return 0;
  }

  return timelineToCompare;
};

export function createScore(allTours, currentTourTimeline, previousTours) {
  const previousTourTimelines = previousTours.map(tour => findTimeline(tour, allTours));
  const locationComparison = previousTourTimelines.map(prevTour => countMatchingLocations(currentTourTimeline.locations, prevTour.locations));
  const maximumMatchingLocations = locationComparison.reduce((sum, newCount) => sum + newCount, 0);

  return {
    name: 'Locations check',
    score: 10 - locationComparison.reduce((sum, newCount) => sum + newCount, 0),
    note: `Locations expected 0 matches got ${maximumMatchingLocations}`
  };
}
