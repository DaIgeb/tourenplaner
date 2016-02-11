import {moment} from '../../../shared/utils/moment';

const LOAD = 'tourenplaner/tours/LOAD';
const LOAD_SUCCESS = 'tourenplaner/tours/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/tours/LOAD_FAIL';
const EDIT_START = 'tourenplaner/tours/EDIT_START';
const EDIT_STOP = 'tourenplaner/tours/EDIT_STOP';
const SAVE = 'tourenplaner/tours/SAVE';
const SAVE_SUCCESS = 'tourenplaner/tours/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/tours/SAVE_FAIL';
const SET_TIMELINE_DATE = 'tourenplaner/tours/SET_TIMELINE_DATE';
const ADD_START = 'tourenplaner/tours/ADD_START';
const ADD_STOP = 'tourenplaner/tours/ADD_STOP';
const ADD = 'tourenplaner/tours/ADD';
const ADD_SUCCESS = 'tourenplaner/tours/ADD_SUCCESS';
const ADD_FAIL = 'tourenplaner/tours/ADD_FAIL';
const DELETE = 'tourenplaner/tours/DELETE';
const DELETE_SUCCESS = 'tourenplaner/tours/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/tours/DELETE_FAIL';
const ADD_SORT = 'tourenplaner/tours/ADD_SORT';


const initialState = {
  loaded: false,
  sorting: [{ column: 'name', ascending: true}],
  editing: {},
  saveError: {},
  currentDate: moment().format()
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case ADD_SORT:
      const previousState = state.sorting.find(sortOption => sortOption.column === action.column);
      return {
        ...state,
        sorting: [
          ...state.sorting.filter(sortOption => sortOption.column !== action.column),
          {
            column: action.column,
            ascending: previousState ? !previousState.ascending : true
          }
        ]
      };
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
        }
      };
    case ADD_STOP:
      return {
        ...state,
        adding: null
      };
    case ADD:
      return state; // 'saving' flag handled by redux-form
    case ADD_SUCCESS:
      const currentData = [...state.data];
      currentData.push(action.result);
      return {
        ...state,
        data: currentData,
        saveError: {
          ...state.saveError,
          ['new']: null
        },
        adding: null
      };
    case ADD_FAIL:
      switch (typeof action.error) {
        case 'string':
          return {
            ...state,
            saveError: {
              ...state.saveError,
              ['new']: action.error
            }
          };
        case 'object':
          return {
            ...state,
            saveError: {
              ...state.saveError,
              ['new']: JSON.stringify(action.error, null, 2)
            }
          };
        default:
          return state;
      }
      break;
    case SAVE:
      return state; // 'saving' flag handled by redux-form
    case SAVE_SUCCESS:
      const data = [...state.data];
      data[action.result.id - 1] = action.result;
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
      const errorType = typeof action.error;
      switch (errorType) {
        case 'string':
          return {
            ...state,
            saveError: {
              ...state.saveError,
              [action.id]: action.error
            }
          };
        case 'object':
          return {
            ...state,
            saveError: {
              ...state.saveError,
              [action.id]: JSON.stringify(action.error, null, 2)
            }
          };
        default:
          return state;
      }
      break;
    case SET_TIMELINE_DATE:
      const dateString = typeof action.date === 'string' ? action.date : action.date.format();
      return {
        ...state,
        currentDate: dateString
      };
    case DELETE:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      const beforeDelete = [...state.data];
      beforeDelete.splice(beforeDelete.findIndex(tour => tour.id === action.result.id));
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
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.tours && globalState.tours.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/tour/load')
  };
}

export function save(tour) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: tour.id,
    promise: (client) => client.post('/tour/update', {
      data: tour
    })
  };
}

export function add(tour) {
  return {
    types: [ADD, ADD_SUCCESS, ADD_FAIL],
    promise: (client) => client.post('/tour/add', {
      data: tour
    })
  };
}

export function editStart(id) {
  return { type: EDIT_START, id };
}

export function editStop(id) {
  return { type: EDIT_STOP, id };
}

export function setTimelineDate(date) {
  return {
    type: SET_TIMELINE_DATE,
    date: date
  };
}

export function addStart() {
  return { type: ADD_START };
}

export function addStop() {
  return { type: ADD_STOP };
}

export function del(tour) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id: tour,
    promise: (client) => client.del('/tour/del', {
      data: tour
    })
  };
}

export function sort(column) {
  return {
    type: ADD_SORT,
    column: column
  };
}
