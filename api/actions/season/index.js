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

export function csv(req, params) {
  return new Promise((resolve, reject) => {
    import tmp from 'tmp';

    tmp.file(function (err, path, fd, cleanupCallback) {
      if (err) {
        reject(err);
        return;
      }

      import ejs from 'ejs';

      const getTimeline = (tourId) => {
        const tour = typeof tourId !== 'object' ? dataHandler.getData().find(item => item.id === tourId) : tourId;
        if (!tour) {
          return null;
        }

        return tour.timelines.find(item => timelineMatches(item, date));
      };

      const tour = dataHandler.getData().find(item => item.id === parseInt(params[0], 10));
      const tourTimeline = getTimeline(tour);
      if (!tourTimeline) {
        reject('No tour available');
        return;
      }
      const startRoute = getTimeline(tourTimeline.startroute);

      const locations = [
        ...(startRoute ? startRoute.locations : []),
        ...tourTimeline.locations
      ].map(loc => locationHandler.getData().find(item => item.id === loc));

      try {
        const fileContent = ejs.render(`
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name><%=name%></name>
    <Style id="sn_blu-stars5">
      <IconStyle>
        <scale>1.1</scale>
        <Icon><href>http://maps.google.com/mapfiles/kml/paddle/blu-stars.png</href></Icon>
        <hotSpot x="32" y="1" xunits="pixels" yunits="pixels"/>
      </IconStyle>
      <ListStyle>
        <ItemIcon><href>http://maps.google.com/mapfiles/kml/paddle/blu-stars-lv.png</href></ItemIcon>
      </ListStyle>
    </Style>
    <Style id="sn_blu">
      <LineStyle>
        <color>2e2efe</color>
        <colorMode>normal</colorMode>
        <width>1</width>
      </LineStyle>
    </Style><% locations.forEach(function(location){%>
    <Placemark>
      <name><%=location.name%></name>
      <styleUrl>#sn_blu-stars5</styleUrl>
      <Point>
        <coordinates><%=location.longitude%>,<%=location.latitude%></coordinates>
      </Point>
    </Placemark><% }); %>
    <Placemark>
      <name>Route</name>
      <LineString>
        <styleUrl>#sn_blu</styleUrl>
        <coordinates><% locations.forEach(function(location){%>
          <%=location.longitude%>,<%=location.latitude%>,0 <% }); %>
        </coordinates>
      </LineString>
    </Placemark>
  </Document>
</kml>`, {name: tour.name, locations: locations});

        fs.write(fd, fileContent, 'utf8', (err, written, buffer) => {
          if (err) {
            reject(err);
          } else {
            resolve(res => {
                res.download(path, `${tour.name}.kml`, (err) => {
                  // If we don't need the file anymore we could manually call the cleanupCallback
                  // But that is not necessary if we didn't pass the keep option because the library
                  // will clean after itself.
                  cleanupCallback();
                });
              }
            );
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  });
}