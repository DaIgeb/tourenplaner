import DataHandler from 'utils/DataHandler';
import {validate} from './validator';

const dataHandler = new DataHandler('./api/actions/season/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const season = req.body;
    const result = dataHandler.update(season);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const season = req.body;
    if (season.year) {
      const sortedSeasons = dataHandler.getData().filter(sea => sea.year === season.year).sort((seasonOne, seasonTwo) =>  seasonOne.version < seasonTwo.version);
      if (sortedSeasons.length) {
        season.version = sortedSeasons[0].version + 1;
      }
      else {
        season.version = 1;
      }
    }
    const result = dataHandler.add(season);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function addDates(req) {
  return new Promise((resolve, reject) => {
    const season = req.body.season;
    const dates = req.body.dates;
    const chosenSeason = dataHandler.getData().find(item => item.id === season);
    if (!chosenSeason) {
      reject('Season not found');
    }

    const updatedSeason = {
      ...chosenSeason,
      dates: dates
      };
    const result = dataHandler.update(updatedSeason);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}
