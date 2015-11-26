import {getLocations} from './load';
import {validate} from './validator';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const location = req.body;
      if (location.id) {
        reject('Restaurant has an id assigned and cannot be created again.');
      } else {
        const locations = getLocations(req);
        location.id = locations.slice(0).sort((left, right) => right.id - left.id)[0] + 1;
        if (!validate(location)) {
          reject(validate.errors);
        } else {
          locations.push(location);

          resolve(location);
        }
      }
    }, 100); // simulate async db write
  });
}
