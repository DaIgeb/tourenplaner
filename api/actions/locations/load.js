import initialLocations from './data';

export function getLocations(req) {
  let locations = req.session.locations;
  if (!locations) {
    locations = initialLocations;
    req.session.locations = locations;
  }

  return locations;
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // TODO make async call to database
    setTimeout(() => {
      resolve(getLocations(req));
    }, 100);
  });
}
