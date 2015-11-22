import {getRestaurants} from './load';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject('Oh no! Restaurant add fails 20% of the time. Try again.');
      } else {
        const restaurants = getRestaurants(req);
        const restaurant = req.body;
        restaurant.id = restaurants.slice(0).sort((left, right) => right.id - left.id)[0] + 1;
        restaurants.push(restaurant);

        resolve(restaurant);
      }
    }, 2000); // simulate async db write
  });
}
