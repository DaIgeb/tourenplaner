import json2csv from 'json2csv';
import DataHandler from 'utils/DataHandler';
import {validate} from './validator';
import * as location from '../location/index';
const locationHandler = location.dataHandler;
import * as restaurant from '../restaurant/index';
const restaurantHandler = restaurant.dataHandler;
import * as tour from '../tour/index';
const tourHandler = tour.dataHandler;
import * as configuration from '../configuration/index';
const configurationHandler = configuration.dataHandler;
import {SeasonMapper} from '../../../shared';

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
      const sortedSeasons = dataHandler.getData().filter(sea => sea.year === season.year).sort((seasonOne, seasonTwo) => seasonOne.version < seasonTwo.version);
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
const writeEvents = (mappedSeason, zipFile) => {
  const fields = [{
    label: 'Von',
    value: row => row.from.format('L')
  }, {
    label: 'Bis',
    value: row => row.from.isSame(row.to, 'day') ? '' : row.to.format('L')
  }, {
    label: 'Bezeichnung',
    value: 'name'
  }, {
    label: 'Ort',
    value: 'location'
  }, {
    label: 'Organisator',
    value: 'organizer'
  }];

  return new Promise((resolve, reject) => {
    json2csv({data: mappedSeason.events, fields: fields}, function (err, csv) {
      if (err) {
        reject(err);
      } else {
        zipFile.file('events.csv', csv);
        resolve(true);
      }
    });
  });
};
const writeTours = (mappedSeason, zipFile) => {
  const fields = [{
    label: 'Datum',
    value: row => row.date.format('L'),
    defaultValue: ''
  }, {
    label: 'Tour',
    value: row => row.tour ? row.tour : row.description
  }, {
    label: 'Punkte',
    value: 'points',
    defaultValue: '0'
  }];

  return new Promise((resolve, reject) => {
    json2csv({data: mappedSeason.tours, fields: fields}, function (err, csv) {
      if (err) {
        reject(err);
      } else {
        zipFile.file('tours.csv', csv);
        resolve(true);
      }
    });
  });
};
const writeRoutes = (mappedSeason, zipFile) => {
  const fields = [{
    label: 'Bezeichnung',
    value: 'name'
  }, {
    label: 'Start',
    value: 'startroute.name'
  }, {
    label: 'Ortschaften',
    value: row => row.locations.map(loc => loc.name).join(' - ')
  }, {
    label: 'Distanz',
    value: 'distance'
  }, {
    label: 'Höhenmeter',
    value: 'elevation'
  }];

  return new Promise((resolve, reject) => {
    json2csv({data: mappedSeason.routes, fields: fields}, function (err, csv) {
      if (err) {
        reject(err);
      } else {
        zipFile.file('routes.csv', csv);
        resolve(true);
      }
    });
  });
};
const writeStartRoutes = (mappedSeason, zipFile) => {
  const fields = [{
    label: 'Bezeichnung',
    value: 'name'
  }, {
    label: 'Ortschaften',
    value: row => row.locations.map(loc => loc.name).join(' - ')
  }];

  return new Promise((resolve, reject) => {
    json2csv({data: mappedSeason.starts, fields: fields}, function (err, csv) {
      if (err) {
        reject(err);
      } else {
        zipFile.file('starts.csv', csv);
        resolve(true);
      }
    });
  });
};

export function csv(req, params) {
  return new Promise((resolve, reject) => {
    import tmp from 'tmp';

    tmp.file(function (err, path, fd, cleanupCallback) {
      if (err) {
        reject(err);
        return;
      }

      const season = dataHandler.getData().find(item => item.id === parseInt(params[0], 10));
      if (!season) {
        reject('No season available');
        return;
      }
      try {
        const seasonMapper = new SeasonMapper(configurationHandler.getData(), tourHandler.getData(), restaurantHandler.getData(), locationHandler.getData());
        const mappedSeason = seasonMapper.map(season);
        var Zip = require('node-zip');
        var zip = new Zip();
        try {
          Promise.all([
            writeEvents(mappedSeason, zip),
            writeTours(mappedSeason, zip),
            writeRoutes(mappedSeason, zip),
            writeStartRoutes(mappedSeason, zip)
          ]).then(data => {
            try {
              const options = {base64: false, compression: 'DEFLATE'};
              import fs from 'fs';
              fs.writeFile(path, zip.generate(options), 'binary', function (error) {
                if (error) {
                  reject(error);
                } else {
                  resolve(res => {
                    res.download(path, `season.zip`, (err) => {
                      // If we don't need the file anymore we could manually call the cleanupCallback
                      // But that is not necessary if we didn't pass the keep option because the library
                      // will clean after itself.
                      cleanupCallback();
                    });
                  });
                }
              });
            } catch (err) {
              reject(err);
            }
          }).catch(err => reject(err));
        } catch (err) {
          reject(err);
        }
      } catch (err) {
        reject(err);
      }
    });
  });
}