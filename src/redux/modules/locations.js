import moment from 'moment';

const LOAD = 'tourenplaner/location/LOAD';
const LOAD_SUCCESS = 'tourenplaner/location/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/location/LOAD_FAIL';
const EDIT_START = 'tourenplaner/location/EDIT_START';
const EDIT_STOP = 'tourenplaner/location/EDIT_STOP';
const ADD_START = 'tourenplaner/location/ADD_START';
const ADD_STOP = 'tourenplaner/location/ADD_STOP';
const SAVE = 'tourenplaner/location/SAVE';
const SAVE_SUCCESS = 'tourenplaner/location/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/location/SAVE_FAIL';
const DELETE = 'tourenplaner/location/DELETE';
const DELETE_SUCCESS = 'tourenplaner/location/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/location/DELETE_FAIL';
const NEW = 'tourenplaner/location/NEW';
const NEW_SUCCESS = 'tourenplaner/location/NEW_SUCCESS';
const NEW_FAIL = 'tourenplaner/location/NEW_FAIL';

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
        adding: null,
        saveError: {
          ...state.saveError,
          [action.id]: null
        }
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
          console.log(action.error);
          return {
            ...state,
            adding: {
              ...state.adding,
              error: JSON.stringify(action.error, null, 2)
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
  return globalState.locations && globalState.locations.loaded;
}

export function load() {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/location/load') // params not used, just shown as demonstration
  };
}

export function save(location) {
  console.log(location);
  return {
    types: [SAVE, SAVE_SUCCESS, SAVE_FAIL],
    id: location.id,
    promise: (client) => client.post('/location/update', {
      data: location
    })
  };
}

export function del(location) {
  return {
    types: [DELETE, DELETE_SUCCESS, DELETE_FAIL],
    id: location,
    promise: (client) => client.del('/location/del', {
      data: location
    })
  };
}

export function add(location) {
  return {
    types: [NEW, NEW_SUCCESS, NEW_FAIL],
    promise: (client) => client.put('/location/add', {
      data: location
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
