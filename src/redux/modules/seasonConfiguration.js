import {reducer as form} from 'redux-form';
import moment from 'moment';


const LOAD = 'tourenplaner/season/configuration/LOAD';
const LOAD_SUCCESS = 'tourenplaner/season/configuration/LOAD_SUCCESS';
const LOAD_FAIL = 'tourenplaner/season/configuration/LOAD_FAIL';
const EDIT_START = 'tourenplaner/season/configuration/EDIT_START';
const EDIT_STOP = 'tourenplaner/season/configuration/EDIT_STOP';
const ADD_START = 'tourenplaner/season/configuration/ADD_START';
const ADD_STOP = 'tourenplaner/season/configuration/ADD_STOP';
const SAVE = 'tourenplaner/season/configuration/SAVE';
const SAVE_SUCCESS = 'tourenplaner/season/configuration/SAVE_SUCCESS';
const SAVE_FAIL = 'tourenplaner/season/configuration/SAVE_FAIL';
const DELETE = 'tourenplaner/season/configuration/DELETE';
const DELETE_SUCCESS = 'tourenplaner/season/configuration/DELETE_SUCCESS';
const DELETE_FAIL = 'tourenplaner/season/configuration/DELETE_FAIL';
const NEW = 'tourenplaner/season/configuration/NEW';
const NEW_SUCCESS = 'tourenplaner/season/configuration/NEW_SUCCESS';
const NEW_FAIL = 'tourenplaner/season/configuration/NEW_FAIL';

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
          year: moment().year(),
          seasonStart: moment().month(3).day(6).format('dd.mm.yyyy'),
          seasonEnd: moment().month(11).day(-2).format('dd.mm.yyyy')
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

export function addStop() {
  return { type: ADD_STOP };
}

const normalizeSeasonStart = (value, previousValue, allValues, previousAllValues) => {
  if (allValues.year !== previousAllValues.year) {
    // min changed
    if (value === undefined || moment(allValues.seasonStart).year() !== Number(allValues.year)) {
      return moment(`${allValues.year}-03-01`).day(6);
    }
  }
  return value;
};
const normalizeSeasonEnd = (value, previousValue, allValues, previousAllValues) => {
  if (allValues.year !== previousAllValues.year) {
    // min changed
    if (value === undefined || moment(allValues.seasonEnd).year() !== Number(allValues.year)) {
      return moment(`${allValues.year}-10-30`).day(-2);
    }
  }
  return value;
};

export const formNormalizer = form.normalize({
  normalizing: {
    seasonStart: normalizeSeasonStart,
    seasonEnd: normalizeSeasonEnd
  }
});
