import {getConfigurations, dataHandler} from './load';
import {validate} from './validator';

export default function add(req) {
  return new Promise((resolve, reject) => {
    const configuration = req.body;
    const result = dataHandler.add(configuration);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}
