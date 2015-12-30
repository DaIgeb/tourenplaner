import {getConfigurations} from './load';
import {validate} from './validator';

export default function update(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const seasons = getConfigurations(req);
      let season = req.body;
      let seasonIdx = null;
      if (season.id) {
        seasonIdx = seasons.findIndex(seas => seas.id === season.id);
      }

      if (!seasonIdx) {
        reject('Location does not exist');
      } else if (!validate(season)) {
        reject(validate.errors);
      } else {
        seasons[seasonIdx] = season;

        resolve(season);
      }
    }, 100);
  });
}
