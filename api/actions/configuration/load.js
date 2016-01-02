import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

export const dataHandler = new DataHandler('./api/actions/configuration/data.json', validate);

export function getConfigurations() {
  return dataHandler.getData();
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // TODO make async call to database
    setTimeout(() => {
      resolve(getConfigurations(req));
    }, 100);
  });
}
