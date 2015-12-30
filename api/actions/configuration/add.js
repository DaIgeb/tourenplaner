import {getConfigurations} from './load';
import {validate} from './validator';

export default function add(req) {
  return new Promise((resolve, reject) => {
    // TODO write to database
    setTimeout(() => {
      const configuration = req.body;
      if (configuration.id) {
        reject('Season has an id assigned and cannot be created again.');
      } else {
        const configurations = getConfigurations(req);

        if (!configurations.length) {
          configuration.id = 1;
        } else {
          const maxId = configurations.slice(0).sort((left, right) => right.id - left.id);
          configuration.id = maxId[0].id + 1;
        }
        if (!validate(configuration)) {
          reject(validate.errors);
        } else {
          configurations.push(configuration);

          resolve(configuration);
        }
      }
    }, 100); // simulate async db write
  });
}
