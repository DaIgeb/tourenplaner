import {getRestaurants} from './load';

export default function update(req) {
  return new Promise((resolve, reject) => {
    // write to database
    setTimeout(() => {
      if (Math.random() < 0.2) {
        reject('Oh no! Restaurant save fails 20% of the time. Try again.');
      } else {
        const restaurants = getRestaurants(req);
        const restaurant = req.body;
        if (restaurant.color === 'Green') {
          reject({
            color: 'We do not accept green restaurants' // example server-side validation error
          });
        }
        let restaurantIdx = null;
        if (restaurant.id) {
          restaurantIdx = restaurants.findIndex(rest => rest.id === restaurant.id);
        }

        if (!restaurantIdx) {
          reject('Restaurant does not exist');
        }

        restaurants[restaurantIdx] = restaurant;

        resolve(restaurant);
      }
    }, 2000); // simulate async db write
  });
}
