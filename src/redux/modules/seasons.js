import {SeasonState} from 'models';
import {isLoaded as isConfigurationLoaded, load as loadConfigurations} from './configurations';
import {isLoaded as isTourLoaded, load as loadTours} from './tours';

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
      const adding = {
        ...state.adding,
        ...action.result,
        state: SeasonState.buildingList
      };

      return {
        ...state,
        data: beforeAdd,
        editing: {
          ...state.editing,
          [action.id]: false
        },
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
      console.log(currentConfiguration.dates.length);
      const addTourPromises = [];
      currentConfiguration.dates.forEach((date, idx) => {
        const newTour = {
          date: date.date,
          tour: idx,
          type: date.type.label,
          scores: [{name: 'UniqueLocations', score: idx, note: 'All locations are unique'}]
        };
        addTourPromises.push(dispatch(addTour(seasonId, newTour)));
      });

      return Promise.all(addTourPromises);
    });
  };
}

export function add(season) {
  return (dispatch) => {
    return dispatch(addSeason(season)).then((result) => dispatch(addNextTour(result.result.id)));
  };
}
