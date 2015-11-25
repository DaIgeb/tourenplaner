import {getLocations} from './load';
import {validate} from './validator';

export default function update(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const locations = getLocations(req);
      let location = req.body;
      let locationIdx = null;
      if (location.id) {
        locationIdx = locations.findIndex(rest => rest.id === location.id);
      }

      if (!locationIdx) {
        reject('Location does not exist');
      } else if (!validate(location)) {
        reject(validate.errors);
      } else {
        locations[locationIdx] = location;

        resolve(location);
      }
    }, 100);
  });
}
