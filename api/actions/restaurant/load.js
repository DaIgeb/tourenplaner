import initialRestaurants from './data';

export function getRestaurants(req) {
  let restaurants = req.session.restaurants;
  if (!restaurants) {
    restaurants = initialRestaurants;
    req.session.restaurants = restaurants;
  }

  return restaurants;
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // make async call to database
    setTimeout(() => {
      if (Math.random() < 0.10) {
        reject('Restaurant load fails 10% of the time. You were unlucky.');
      } else {
        resolve(getRestaurants(req));
      }
    }, 1000); // simulate async load
  });
}
