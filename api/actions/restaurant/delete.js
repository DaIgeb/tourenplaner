import {getRestaurants} from './load';

export default function del(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject('Oh no! Restaurant delete fails 20% of the time. Try again.');
      } else {
        const restaurants = getRestaurants(req);
        const restaurant = req.body;
        let restaurantIdx = null;
        if (restaurant) {
          restaurantIdx = restaurants.findIndex(rest => rest.id === restaurant);
        }

        if (!restaurantIdx) {
          reject('Restaurant does not exist');
        }

        restaurants.splice(restaurantIdx);

        resolve(restaurant);
      }
    }, 2000); // simulate async db write
  });
}
