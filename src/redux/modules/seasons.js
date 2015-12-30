import {moment, defaultTimeZone} from 'utils/moment';

const LOAD = 'tourenplaner/seasons/LOAD';
const LOAD_SUCCESS = 'tourenplaner/seasons/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/seasons/LOAD_FAIL';
const EDIT_START = 'tourenplaner/seasons/EDIT_START';
const EDIT_STOP = 'tourenplaner/seasons/EDIT_STOP';
const ADD_START = 'tourenplaner/seasons/ADD_START';
const ADD_SET_PAGE = 'tourenplaner/seasons/ADD_SET_PAGE';
const ADD_SET_YEAR = 'tourenplaner/seasons/ADD_SET_YEAR';
const ADD_SET_DATES = 'tourenplaner/seasons/ADD_SET_DATES';
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

export const PageEnum = Object.freeze({
  year: Object.freeze({}),
  dates: Object.freeze({}),
  dateList: Object.freeze({})
});

export const TourType = Object.freeze({
  none: Object.freeze({id: 1, label: 'Keine' }),
  morning: Object.freeze({id: 2, label: 'Morgentour' }),
  afternoon: Object.freeze({id: 3, label: 'Nachmittagstour' }),
  evening: Object.freeze({id: 4, label: 'Abendtour' }),
  fullday: Object.freeze({id: 5, label: 'Tagestour' })
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
          page: PageEnum.year
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
        const marchFirst = moment.tz([year, 2, 1], defaultTimeZone);
        const firstSaturdayInMarch = marchFirst.day(marchFirst.day() === 0 ? -1 : 6);

        const octoberLast = moment.tz([year, 9, 30], defaultTimeZone);
        const lasFridayInOctober = octoberLast.day(octoberLast.day() === 5 ? 5 : -2);
        let dstStartDate = moment.tz([year, 4, 1], defaultTimeZone);
        while (!dstStartDate.isDST()) {
          dstStartDate = dstStartDate.add(7, 'd');
        }
        return {
          ...state,
          adding: {
            ...state.adding,
            year: year,
            seasonStart: firstSaturdayInMarch.format('L'),
            seasonEnd: lasFridayInOctober.format('L'),
            eveningStart: dstStartDate.day(dstStartDate.day() >= 2 ? -5 : 2).format('L'),
            eveningEnd: moment.tz([year, 8, 13], defaultTimeZone).day(4).format('L')
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
      const date = moment.tz(action.data.seasonStart, 'L', defaultTimeZone);
      const end = moment.tz(action.data.seasonEnd, 'L', defaultTimeZone);
      const eveningStart = moment.tz(action.data.eveningStart, 'L', defaultTimeZone).subtract(1, 'd');
      const eveningEnd = moment.tz(action.data.eveningEnd, 'L', defaultTimeZone).add(1, 'd');
      const dates = [
        {
          date: date.format('L'),
          type: TourType.afternoon
        }];
      while (date.isBefore(end, 'day')) {
        date.add(1, 'd');
        switch (date.day()) {
          case 0:
            dates.push({
              date: date.format('L'),
              type: TourType.morning
            });
            break;
          case 6:
            dates.push({
              date: date.format('L'),
              type: TourType.afternoon
            });
            break;
          case 2:
          case 4:
            if (date.isBetween(eveningStart, eveningEnd, 'day')) {
              dates.push({
                date: date.format('L'),
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
          dates: dates
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
        editing: {
          ...state.editing,
          [action.id]: false
        },
        adding: false,
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

export function add(season) {
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/season/new', {
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
