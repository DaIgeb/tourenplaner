import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

export const dataHandler = new DataHandler('./api/actions/location/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const location = req.body;
    const result = dataHandler.update(location);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const location = req.body;
    const result = dataHandler.add(location);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}
