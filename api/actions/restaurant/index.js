import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

const dataHandler = new DataHandler('./api/actions/restaurant/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const restaurant = req.body;
    const result = dataHandler.update(restaurant);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const restaurant = req.body;
    const result = dataHandler.add(restaurant);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function del(req) {
  return new Promise((resolve, reject) => {
    const restaurant = req.body;
    const result = dataHandler.delete(restaurant);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}
