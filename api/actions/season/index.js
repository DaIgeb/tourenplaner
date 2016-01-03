import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

const dataHandler = new DataHandler('./api/actions/season/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const season = req.body;
    const result = dataHandler.update(season);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const season = req.body;
    const result = dataHandler.add(season);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}
