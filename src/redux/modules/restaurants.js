import moment from 'moment';

const LOAD = 'tourenplaner/restaurants/LOAD';
const LOAD_SUCCESS = 'tourenplaner/restaurants/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/restaurants/LOAD_FAIL';
const EDIT_START = 'tourenplaner/restaurants/EDIT_START';
const EDIT_STOP = 'tourenplaner/restaurants/EDIT_STOP';
const ADD_START = 'tourenplaner/restaurants/ADD_START';
const ADD_STOP = 'tourenplaner/restaurants/ADD_STOP';
const SAVE = 'tourenplaner/restaurants/SAVE';
const SAVE_SUCCESS = 'tourenplaner/restaurants/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/restaurants/SAVE_FAIL';
const DELETE = 'tourenplaner/restaurants/DELETE';
const DELETE_SUCCESS = 'tourenplaner/restaurants/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/restaurants/DELETE_FAIL';
const NEW = 'tourenplaner/restaurants/NEW';
const NEW_SUCCESS = 'tourenplaner/restaurants/NEW_SUCCESS';
const NEW_FAIL = 'tourenplaner/restaurants/NEW_FAIL';
const SET_TIMELINE_DATE = 'tourenplaner/restaurants/SET_TIMELINE_DATE';

const initialState = {
  loaded: false,
  editing: {},
  adding: null,
  currentDate: moment().format(),
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
          name: null
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
            adding: {
              ...state.adding,
              [action.id]: action.error
            }
          };
        case 'object':
          return {
            ...state,
            saveError: {
              ...state.saveError,
              [action.id]: JSON.stringify(action.error.map(err => {return {field: err.field, message: err.message};}), null, 2)
            }
          };
        default:
          return state;
      }
      break;
    case DELETE:
      return state; // 'saving' flag handled by redux-form
    case DELETE_SUCCESS:
      const beforeDelete = [...state.data];
      beforeDelete.splice(beforeDelete.findIndex(restaurant => restaurant.id === action.result.id));
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
    case SET_TIMELINE_DATE:
      const dateString = typeof action.date === 'string' ? action.date : action.date.format();
      return {
        ...state,
        currentDate: dateString
      };
    default:
      return state;
  }
}

export function isLoaded(globalState) {
  return globalState.restaurants && globalState.restaurants.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/restaurant/load') // params not used, just shown as demonstration
  };
}

export function save(restaurant) {
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: restaurant.id,
    promise: (client) => client.post('/restaurant/update', {
      data: restaurant
    })
  };
}

export function del(restaurant) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id: restaurant,
    promise: (client) => client.del('/restaurant/del', {
      data: restaurant
    })
  };
}

export function add(restaurant) {
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/restaurant/add', {
      data: restaurant
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

export function setTimelineDate(date) {
  return {
    type: SET_TIMELINE_DATE,
    date: date
  };
}
