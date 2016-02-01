import {SeasonState} from 'models';
import {isLoaded as isConfigurationLoaded, load as loadConfigurations, SpecialDateAction} from './configurations';
import {isLoaded as isTourLoaded, load as loadTours} from './tours';
import {TourType} from 'models';
import {moment} from '../../../shared/utils/moment';
import {timelineMatches} from '../../../shared/utils/timeline';

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
const ADD_ADD_TOUR = 'tourenplaner/seasons/ADD_ADD_TOUR';
const ADD_ADD_TOUR_SUCCESS = 'tourenplaner/seasons/ADD_ADD_TOUR_SUCCESS';
const ADD_ADD_TOUR_FAIL = 'tourenplaner/seasons/ADD_ADD_TOUR_FAIL';
const ADD_TOUR_LIST_DONE = 'tourenplaner/seasons/ADD_TOUR_LIST_DONE';

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
    case ADD_TOUR_LIST_DONE:
      return {
        ...state,
        adding: {
          ...state.adding,
          state: SeasonState.confirm
        }
      };
    case ADD_ADD_TOUR:
      return state; // 'saving' flag handled by redux-form
    case ADD_ADD_TOUR_SUCCESS:
      const items = [...state.data];
      items[items.findIndex(rest => rest.id === action.result.id)] = action.result;
      return {
        ...state,
        data: items,
        editing: {
          ...state.editing,
          [action.id]: false
        },
        adding: {
          ...state.adding,
          ...action.result,
          state: state.adding.state
        },
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
      };
    case ADD_ADD_TOUR_FAIL:
      return typeof action.error === 'string' ? {
        ...state,
        saveError: {
          ...state.saveError,
          [action.id]: action.error
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
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/season/add', {
      data: season
    })
  };
}

export function editStart(id) {
  return {type: EDIT_START, id};
}

export function editStop(id) {
  return {type: EDIT_STOP, id};
}

export function addStart() {
  return {type: ADD_START};
}

export function addStop() {
  return {type: ADD_STOP};
}

function addTour(season, tour) {
  return {
    types: [ADD_ADD_TOUR, ADD_ADD_TOUR_SUCCESS, ADD_ADD_TOUR_FAIL],
    promise: (client) => client.put('/season/addTour', {
      data: {
        season: season,
        tour: tour
      }
    })
  };
}

function addNextTour(seasonId) {
  return (dispatch, getState) => {
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
    return Promise.all(loadPromises).then(() => {
      const {seasons: {data: seasons}, configurations: {data: configurations}, tours: {data: tours}} = getState();

      if (!seasons || !tours || !configurations) {

        // You don’t have to return Promises, but it’s a handy convention
        // so the caller can always call .then() on async dispatch result.

        return Promise.reject({error: 'dependent data is missing'});
      }
      const currentSeason = seasons.find(item => item.id === seasonId);
      if (!currentSeason) {
        return Promise.reject('Season not found');
      }
      const currentConfiguration = configurations.find(item => item.id === currentSeason.configuration);
      const addTourPromises = [];

      const handleSpecialDate = (specialDate, assignedTours) => {
        const newTours = [];
        if (specialDate) {
          switch (specialDate.action.id) {
            case SpecialDateAction.remove.id:
              addTourPromises.push(dispatch(addTour(seasonId, {
                date: specialDate.date,
                description: specialDate.name,
                type: TourType.none.label,
                scores: [{name: 'Special date override', score: 0, note: specialDate.name}]
              })));
              break;
            case SpecialDateAction.add.id:
            case SpecialDateAction.replace.id:
              specialDate.tours.forEach(item => {
                assignedTours.push(item.id);
                const newTour = {
                  date: specialDate.date,
                  description: specialDate.name,
                  tour: item.id,
                  type: item.type.label,
                  scores: [{name: 'Special date override', score: 0, note: specialDate.name}]
                };
                newTours.push(newTour);
                addTourPromises.push(dispatch(addTour(seasonId, newTour)));
              });
              break;
            default:
              console.error('Invalid special-date action');
              break;
          }
        }

        return newTours;
      };

      const createScores = (configuration, date, previousTours, usedTours) => {
        const momentDate = moment(date.date);
        const seasonStartDate = moment(configuration.seasonStart).dayOfYear();
        const eveningStartDate = moment(configuration.eveningStart).dayOfYear();
        const distance = eveningStartDate - seasonStartDate;
        const distanceFactor = momentDate.dayOfYear() > eveningStartDate ? 1 : (((momentDate.dayOfYear() - seasonStartDate) / distance) / 10 + 0.9);
        const baseDistance = (() => {
          switch (date.type.id) {
            case TourType.morning.id:
              return 75;
            case TourType.evening.id:
              return 55;
            case TourType.afternoon.id:
              return 90;
            default:
              return 100;
          }
        })();
        const countMatchingLocations = (timeline, tourId) => {
          if (!tourId) {
            return 0;
          }
          const tourToCompare = tours.find(item => item.id === tourId);
          if (!tourToCompare) {
            return 0;
          }

          const timelineToCompare = tourToCompare.timelines.find(tl => timelineMatches(tl, momentDate));
          if (!timelineToCompare) {
            return 0;
          }

          return timeline.locations.filter(locId => timelineToCompare.locations.find(item => item === locId)).length - 1; // Winterthur is always matching once
        };

        const expectedDistance = distanceFactor * baseDistance;
        const scoresByTour = tours.map(item => {
          const timeline = item.timelines.find(tl => timelineMatches(tl, momentDate));
          const locationComparison = previousTours.map(prevTour => countMatchingLocations(timeline, prevTour.tour));
          const maximumMatchingLocations = locationComparison.reduce((sum, newCount) => sum + newCount, 0);
          const distanceViolation = Math.round(Math.abs(expectedDistance - timeline.distance) / 5);
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
            {
              name: 'Distance check',
              score: 10 - (distanceViolation ? distanceViolation - 1 : 0),
              note: `Distance expected ${expectedDistance} got ${timeline.distance}`
            },
            {
              name: 'Difficulty check',
              score: 10,
              note: `Elevation got ${timeline.elevation}`
            },
            {
              name: 'Locations check',
              score: 10 - locationComparison.reduce((sum, newCount) => sum + newCount, 0),
              note: `Locations expected 0 matches got ${maximumMatchingLocations}`
            },
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
        });
        return scoresByTour.sort((item1, item2) => item2.totalScore - item1.totalScore).slice(0, 1);
      };

      let action = () => {
        return Promise.resolve([]);
      };

      const createAction = (date, previousAction, assignedTours) => {
        return () => {
          return new Promise((resolve, reject) => {
            const previousTourPromise = previousAction();
            previousTourPromise
              .then(previousTours => {
                const specialDate = currentConfiguration.specialDates.find(item => item.date === date.date);
                const newTours = handleSpecialDate(specialDate, assignedTours);
                if (!specialDate || specialDate.action.id === SpecialDateAction.add.id) {
                  const bestTours = createScores(currentConfiguration, date, previousTours, assignedTours);
                  bestTours.forEach(bestTour => {
                    assignedTours.push(bestTour.tourId);
                    const newTour = {
                      date: date.date,
                      tour: bestTour.tourId,
                      type: date.type.label,
                      scores: bestTour.scores
                    };
                    newTours.push(newTour);
                    addTourPromises.push(dispatch(addTour(seasonId, newTour)));
                  });
                }

                resolve(newTours);
              })
              .catch(err => reject(err));
          });
        };
      };

      // TODO rewrite to make it a: more readable and b: iterate instead of using promises
      const assignedTours = [];
      currentConfiguration.dates.forEach(date => {
        const currentAction = action;
        const currentDate = date;
        const currentAssignedTours = assignedTours;
        action = createAction(currentDate, currentAction, currentAssignedTours);
      });

      action();

      currentConfiguration.specialDates.filter(date => {
        const momentDate = moment(date.date);
        const notEqualToStart = !momentDate.isSame(currentConfiguration.seasonStart, 'day');
        const notEqualtToEnd = !momentDate.isSame(currentConfiguration.seasonEnd, 'day');
        const notBetweenStartAndEnd = !momentDate.isBetween(currentConfiguration.seasonStart, currentConfiguration.seasonEnd, 'day');

        return notEqualToStart &&
          notEqualtToEnd &&
          notBetweenStartAndEnd;
      }).forEach(specialDate => {
        handleSpecialDate(specialDate);
      });
      return Promise.all(addTourPromises)
        .then(result => dispatch({
          type: ADD_TOUR_LIST_DONE,
          data: result
        }));
    });
  };
}

export function add(season) {
  return (dispatch) => {
    return dispatch(addSeason(season)).then((result) => dispatch(addNextTour(result.result.id)));
  };
}
