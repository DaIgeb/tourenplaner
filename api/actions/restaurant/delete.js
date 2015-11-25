import {getRestaurants} from './load';

export default function del(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const restaurants = getRestaurants(req);
      const restaurant = req.body;
      let restaurantIdx = null;
      if (restaurant) {
        restaurantIdx = restaurants.findIndex(rest => rest.id === restaurant);
      }

      if (!restaurantIdx) {
        reject('Restaurant does not exist');
      } else {
        restaurants.splice(restaurantIdx);

        resolve(restaurant);
      }
    }, 10); // simulate async db write
  });
}
