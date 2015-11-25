import {getRestaurants} from './load';
import {validator} from './validator';

export default function update(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const restaurants = getRestaurants(req);
      const restaurant = req.body;

      let restaurantIdx = null;
      if (restaurant.id) {
        restaurantIdx = restaurants.findIndex(rest => rest.id === restaurant.id);
      }

      if (!restaurantIdx) {
        reject('Restaurant does not exist');
      } else if (!validate(restaurant)) {
        reject(validate.errors);
      } else {
        restaurants[restaurantIdx] = restaurant;

        resolve(restaurant);
      }
    }, 100);
  });
}
