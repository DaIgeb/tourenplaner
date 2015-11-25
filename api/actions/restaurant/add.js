import {getRestaurants} from './load';
import {validator} from './validator';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const restaurant = req.body;
      if (restaurant.id) {
        reject('Restaurant has an id assigned and cannot be created again.');
      } else {
        const restaurants = getRestaurants(req);
        restaurant.id = restaurants.slice(0).sort((left, right) => right.id - left.id)[0] + 1;

        if (!validator(restaurant)) {
          reject(validator.errors);
        }
        else {
          restaurants.push(restaurant);

          resolve(restaurant);
        }
      }
    }, 20);
  });
}
