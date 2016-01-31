import {moment} from '../../../shared/utils/moment';
import {TourType} from 'models';

const LOAD = 'tourenplaner/configurations/LOAD';
const LOAD_SUCCESS = 'tourenplaner/configurations/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/configurations/LOAD_FAIL';
const EDIT_START = 'tourenplaner/configurations/EDIT_START';
const EDIT_STOP = 'tourenplaner/configurations/EDIT_STOP';
const ADD_START = 'tourenplaner/configurations/ADD_START';
const ADD_SET_PAGE = 'tourenplaner/configurations/ADD_SET_PAGE';
const ADD_SET_YEAR = 'tourenplaner/configurations/ADD_SET_YEAR';
const ADD_SET_DATES = 'tourenplaner/configurations/ADD_SET_DATES';
const ADD_STOP = 'tourenplaner/configurations/ADD_STOP';
const SAVE = 'tourenplaner/configurations/SAVE';
const SAVE_SUCCESS = 'tourenplaner/configurations/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/configurations/SAVE_FAIL';
const DELETE = 'tourenplaner/configurations/DELETE';
const DELETE_SUCCESS = 'tourenplaner/configurations/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/configurations/DELETE_FAIL';
const NEW = 'tourenplaner/configurations/NEW';
const NEW_SUCCESS = 'tourenplaner/configurations/NEW_SUCCESS';
const NEW_FAIL = 'tourenplaner/configurations/NEW_FAIL';

export const PageEnum = Object.freeze({
  year: Object.freeze({}),
  dates: Object.freeze({}),
  dateList: Object.freeze({})
});

export const SpecialDateAction = Object.freeze({
  remove: Object.freeze({id: 1, label: 'Tour entfernen' }),
  add: Object.freeze({id: 2, label: 'Tour hinzufügen' }),
  replace: Object.freeze({id: 3, label: 'Tour ersetzen' })
});

const initialState = {
  loaded: false,
  editing: {},
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
        editing: {
          ...state.editing,
          [action.id]: true
        }
      };
    case EDIT_STOP:
      return {
        ...state,
        editing: {
          ...state.editing,
          [action.id]: false
        }
      };
    case ADD_START:
      return {
        ...state,
        adding: {
          page: PageEnum.year,
          events: [],
          specialDates: [],
          dates: []
        }
      };
    case ADD_SET_PAGE:
      return {
        ...state,
        adding: {
          ...state.adding,
          page: action.page
        }
      };
    case ADD_SET_YEAR:
      const year = action.year;
      if (year && year.length === 4) {
        const marchFirst = moment([year, 2, 1]);
        const firstSaturdayInMarch = marchFirst.day(marchFirst.day() === 0 ? -1 : 6);

        const octoberLast = moment([year, 9, 30]);
        const lasFridayInOctober = octoberLast.day(octoberLast.day() === 5 ? 5 : -2);
        let dstStartDate = moment([year, 4, 1]);
        while (!dstStartDate.isDST()) {
          dstStartDate = dstStartDate.add(7, 'd');
        }
        return {
          ...state,
          adding: {
            ...state.adding,
            year: year,
            seasonStart: firstSaturdayInMarch.toISOString(),
            seasonEnd: lasFridayInOctober.toISOString(),
            eveningStart: dstStartDate.day(dstStartDate.day() >= 2 ? -5 : 2).toISOString(),
            eveningEnd: moment([year, 8, 13]).day(4).toISOString()
          }
        };
      }

      return {
        ...state,
        adding: {
          ...state.adding,
          year: year
        }
      };
    case ADD_SET_DATES: {
      const date = moment(action.data.seasonStart, moment.ISO_8601);
      const end = moment(action.data.seasonEnd, moment.ISO_8601);
      const eveningStart = moment(action.data.eveningStart, moment.ISO_8601).subtract(1, 'd');
      const eveningEnd = moment(action.data.eveningEnd, moment.ISO_8601).add(1, 'd');
      const dates = [
        {
          date: date.toISOString(),
          type: TourType.afternoon
        }];
      while (date.isBefore(end, 'day')) {
        date.add(1, 'd');
        switch (date.day()) {
          case 0:
            dates.push({
              date: date.toISOString(),
              type: TourType.morning
            });
            break;
          case 6:
            dates.push({
              date: date.toISOString(),
              type: TourType.afternoon
            });
            break;
          case 2:
          case 4:
            if (date.isBetween(eveningStart, eveningEnd, 'day')) {
              dates.push({
                date: date.toISOString(),
                type: TourType.evening
              });
              break;
            }
            break;
          default:
            break;
        }
      }
      return {
        ...state,
        adding: {
          ...state.adding,
          ...action.data,
          dates: dates,
          specialDates: []
        }
      };
    }
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
        editing: {
          ...state.editing,
          [action.id]: false
        },
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
    case DELETE:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      const beforeDelete = [...state.data];
      beforeDelete.splice(beforeDelete.findIndex(season => season.id === action.result.id));
      return {
        ...state,
        data: beforeDelete,
        editing: {
          ...state.editing,
          [action.id]: false
        },
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
      return {
        ...state,
        data: beforeAdd,
        adding: null
      };
    case NEW_FAIL:
      const errorType = typeof action.error;
      switch (errorType) {
        case 'string':
          return {
            ...state,
            adding: {
              ...state.adding,
              error: action.error
            }
          };
        case 'object':
          return {
            ...state,
            adding: {
              ...state.adding,
              error: JSON.stringify(action.error.map(err => {return {field: err.field, message: err.message};}), null, 2)
            }
          };
        default:
          return state;
      }
      break;
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.configurations && globalState.configurations.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/configuration/load') // params not used, just shown as demonstration
  };
}

export function save(season) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: season.id,
    promise: (client) => client.post('/configuration/update', {
      data: season
    })
  };
}

export function del(seasonId) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id: seasonId,
    promise: (client) => client.del('/configuration/del', {
      data: seasonId
    })
  };
}

export function add(configuration) {
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/configuration/add', {
      data: configuration
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

export function addSetPage(page) {
  return { type: ADD_SET_PAGE, page: page };
}

export function addSetYear(year) {
  return { type: ADD_SET_YEAR, year: year };
}

export function addSetDates(data) {
  return { type: ADD_SET_DATES, data: data };
}

export function addStop() {
  return { type: ADD_STOP };
}
