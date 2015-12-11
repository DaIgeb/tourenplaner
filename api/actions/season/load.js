export function getSeasons(req) {
  let seasons = req.session.seasons;
  if (!seasons) {
    import intialData from './data';

    seasons = intialData;
    req.session.seasons = seasons;
  }

  return seasons;
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // TODO make async call to database
    setTimeout(() => {
      resolve(getSeasons(req));
    }, 100);
  });
}
