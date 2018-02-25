import { SeasonState } from 'models';
import { isLoaded as isConfigurationLoaded, load as loadConfigurations } from './configurations';
import { isLoaded as isTourLoaded, load as loadTours } from './tours';
import { isLoaded as isRestaurantLoaded, load as loadRestaurants } from './restaurants';
// import {TourType} from 'models';
import { moment } from '../../../shared/utils/moment';
import { timelineMatches } from '../../../shared/utils/timeline';
import { createScore as createRestaurantScore } from './seasons/restaurantScoreBuilder';
import { createScore as createDifficultyScore } from './seasons/difficultyScoreBuilder';
import { createScore as createLocationScore } from './seasons/locationScoreBuilder';
import { createScore as createDistanceScore, createDifficultyScore as createDateBasedDifficultyScore } from './seasons/distanceScoreBuilder';
import { createDates } from './seasons/dates';

const LOAD = 'tourenplaner/seasons/LOAD';
const LOAD_SUCCESS = 'tourenplaner/seasons/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/seasons/LOAD_FAIL';
const EDIT_START = 'tourenplaner/seasons/EDIT_START';
const EDIT_STOP = 'tourenplaner/seasons/EDIT_STOP';
const ADD_START = 'tourenplaner/seasons/ADD_START';
const ADD_STOP = 'tourenplaner/seasons/ADD_STOP';
const SAVE = 'tourenplaner/seasons/SAVE';
const SAVE_SUCCESS = 'tourenplaner/seasons/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/seasons/SAVE_FAIL';
const DELETE = 'tourenplaner/seasons/DELETE';
const DELETE_SUCCESS = 'tourenplaner/seasons/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/seasons/DELETE_FAIL';
const NEW = 'tourenplaner/seasons/NEW';
const NEW_SUCCESS = 'tourenplaner/seasons/NEW_SUCCESS';
const NEW_FAIL = 'tourenplaner/seasons/NEW_FAIL';
const ADD_TOUR_LIST = 'tourenplaner/seasons/ADD_TOUR_LIST';
const ADD_TOUR_LIST_SUCCCESS = 'tourenplaner/seasons/ADD_TOUR_LIST_DONE';
const ADD_TOUR_LIST_FAIL = 'tourenplaner/seasons/ADD_TOUR_LIST_FAIL';

const initialState = {
  loaded: false,
  editing: null,
  adding: null,
  saveError: {}
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      };
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.result,
        error: null
      };
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        data: null,
        error: action.error
      };
    case EDIT_START:
      return {
        ...state,
        editing: action.id
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: null
      };
    case ADD_START:
      return {
        ...state,
        adding: {
          state: SeasonState.setup
        }
      };
    case ADD_STOP:
      return {
        ...state,
        adding: null
      };
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[data.findIndex(rest => rest.id === action.result.id)] = action.result;
      return {
        ...state,
        data: data,
        editing: null,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case SAVE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    case ADD_TOUR_LIST:
      return state;
    case ADD_TOUR_LIST_SUCCCESS:
      return {
        ...state,
        data: {
          ...state.data,
          [state.data.findIndex(item => item.id === action.result.id)]: action.result
        },
        adding: {
          ...state.adding,
          ...action.result,
          state: SeasonState.confirm
        }
      };
    case ADD_TOUR_LIST_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        addding: {
          ...state.adding,
          saveError: action.error
        }
      } : state;
    case DELETE:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      const beforeDelete = [...state.data];
      beforeDelete.splice(beforeDelete.findIndex(season => season.id === action.result.id));
      return {
        ...state,
        data: beforeDelete,
        editing: null,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case DELETE_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    case NEW:
      return state; // 'saving' flag handled by redux-form
    case NEW_SUCCESS:
      const beforeAdd = [...state.data];
      beforeAdd.push(action.result);
      const adding = {
        ...state.adding,
        ...action.result,
        state: SeasonState.buildingList
      };

      return {
        ...state,
        data: beforeAdd,
        adding: adding,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case NEW_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
        }
      } : state;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.seasons && globalState.seasons.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/season/load') // params not used, just shown as demonstration
  };
}

export function save(season) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: season.id,
    promise: (client) => client.post('/season/update', {
      data: season
    })
  };
}

export function del(seasonId) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id: seasonId,
    promise: (client) => client.del('/season/del', {
      data: seasonId
    })
  };
}

function addSeason(season) {
  console.log('Adding season');
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/season/add', {
      data: season
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}

export function addStart() {
  return { type: ADD_START };
}

export function addStop() {
  return { type: ADD_STOP };
}

function addNextTour(seasonId) {
  return (dispatch, getState) => {
    console.log('Add Next Tour');
    const globalState = getState();
    const loadPromises = [];
    if (!isLoaded(globalState)) {
      loadPromises.push(dispatch(load()));
    }
    if (!isConfigurationLoaded(globalState)) {
      loadPromises.push(dispatch(loadConfigurations()));
    }
    if (!isTourLoaded(globalState)) {
      loadPromises.push(dispatch(loadTours()));
    }
    if (!isRestaurantLoaded(globalState)) {
      loadPromises.push(dispatch(loadRestaurants()));
    }

    return Promise.all(loadPromises).then(() => {
      const {seasons: {data: seasons}, configurations: {data: configurations}, tours: {data: tours}, restaurants: { data: restaurants}} = getState();

      if (!seasons || !tours || !configurations || !restaurants) {

        // You don’t have to return Promises, but it’s a handy convention
        // so the caller can always call .then() on async dispatch result.

        return Promise.reject({ error: 'dependent data is missing' });
      }
      const currentSeason = seasons.find(item => item.id === seasonId);
      if (!currentSeason) {
        return Promise.reject('Season not found');
      }
      const currentConfiguration = configurations.find(item => item.id === currentSeason.configuration);

      const createScores = (configuration, tour, tourInstance, previousTour, usedTours) => {
        const momentDate = moment(tour.date);

        const scoresByTour = tours.map(item => {
          const timeline = item.timelines.find(tl => timelineMatches(tl, momentDate));
          if (!timeline) {
            console.warn('No timeline found:', momentDate, item);
            return {
              tour: item.id,
              totalScore: 0,
              scores: []
            };
          }

          const getUsagePoints = (usages) => {
            switch (usages) {
              case 0:
                return 15;
              case 1:
                return 10;
              case 2:
                return 1;
              case 3:
                return 0;
              default:
                return -5;
            }
          };

          const scores = [
            {
              name: 'Tour-Type matching',
              score: item.types.find(type => tourInstance.type.id === type.id) ? 10 : 0,
              note: `Checking for type ${tourInstance.type.label}`
            },
            {
              name: 'Tour-Usage check',
              score: getUsagePoints(usedTours.filter(seasonTour => seasonTour === item.id).length),
              note: `Counting usages for tour`
            }
          ];
          scores.push(createDistanceScore(configuration, tour.date, tourInstance.type, timeline.distance, timeline.elevation));
          scores.push(createDifficultyScore(tours, timeline, previousTour));
          scores.push(createLocationScore(tours, timeline, momentDate, previousTour));
          scores.push(createDateBasedDifficultyScore(configuration, tour.date, timeline.difficulty));
          scores.push(createRestaurantScore(restaurants, tour, tourInstance, timeline));

          return {
            tour: item.id,
            totalScore: scores.reduce((sum, score) => sum + score.score, 0),
            scores: scores
          };
        }).sort((item1, item2) => item2.totalScore - item1.totalScore);

        return scoresByTour;
      };

      const assignedTours = [];
      const datesForTours = createDates(currentConfiguration);
      datesForTours.forEach(tourDate => {
        if (tourDate.tours && tourDate.tours.length) {
          tourDate.tours.forEach(tour => {
            if (tour.tour !== null) {
              const candidate = tour.candidates[tour.tour];
              if (candidate.tour !== null) {
                assignedTours.push(candidate.tour);
              }
            }
          });
        }
      });
      datesForTours.forEach((tourDate, idx) => {
        const previousTour = idx ? datesForTours[idx - 1] : null;
        if (tourDate.tours && tourDate.tours.length) {
          tourDate.tours.forEach(tour => {
            if (tour.tour === null) {
              const scores = createScores(currentConfiguration, tourDate, tour, previousTour, assignedTours);

              const bestScore = scores[0].totalScore;
              const relevantScores = scores.filter(score => score.totalScore === bestScore);

              const chosenItem = Math.floor(Math.random() * Math.min(relevantScores.length, 5));
              const candidates = scores.slice(0, 5);
              tour.candidates.push.apply(tour.candidates, candidates);
              const tourIndex = tour.candidates.indexOf(relevantScores[chosenItem]);
              assignedTours.push(relevantScores[chosenItem].tour);
              if (tourIndex < 0) {
                console.error('No tour found');
              }
              tour.tour = tourIndex;
            }
          });
        }
      });
      dispatch({
        types: [ADD_TOUR_LIST, ADD_TOUR_LIST_SUCCCESS, ADD_TOUR_LIST_FAIL],
        promise: (client) => client.put('/season/addDates', {
          data: {
            season: seasonId,
            dates: datesForTours
          }
        })
      });
    });
  };
}

export function add(season) {
  return (dispatch) => {
    return dispatch(addSeason(season))
      .then(result =>
        dispatch(addNextTour(result.result.id)
        )
      );
  };
}
