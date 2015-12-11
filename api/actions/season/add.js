import {getSeasons} from './load';
import {validate} from './validator';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const season = req.body;
      if (season.id) {
        reject('Season has an id assigned and cannot be created again.');
      } else {
        const seasons = getSeasons(req);
        season.id = seasons.slice(0).sort((left, right) => right.id - left.id)[0] + 1;
        if (!validate(season)) {
          reject(validate.errors);
        } else {
          seasons.push(season);

          resolve(season);
        }
      }
    }, 100); // simulate async db write
  });
}
