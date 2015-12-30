export function getConfigurations(req) {
  let configurations = req.session.configurations;
  if (!configurations) {
    import intialData from './data';

    configurations = intialData;
    req.session.configurations = configurations;
  }

  return configurations;
}

export default function load(req) {
  return new Promise((resolve, reject) => {
    // TODO make async call to database
    setTimeout(() => {
      resolve(getConfigurations(req));
    }, 100);
  });
}
