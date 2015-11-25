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
      resolve(getRestaurants(req));
    }, 10); // simulate async load
  });
}
