import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

export const dataHandler = new DataHandler('./api/actions/configuration/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const configuration = req.body;
    const result = dataHandler.update(configuration);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const configuration = req.body;
    const result = dataHandler.add(configuration);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}