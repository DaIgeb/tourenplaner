import {getRestaurants} from './load';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      const restaurant = req.body;
      if (restaurant.id) {
        reject('Restaurant has an id assigned and cannot be created again.');
      }
      else if (Math.random() < 0.2) {
        reject('Oh no! Restaurant add fails 20% of the time. Try again.');
      } else {
        const restaurants = getRestaurants(req);
        restaurant.id = restaurants.slice(0).sort((left, right) => right.id - left.id)[0] + 1;
        restaurants.push(restaurant);

        resolve(restaurant);
      }
    }, 2000); // simulate async db write
  });
}
