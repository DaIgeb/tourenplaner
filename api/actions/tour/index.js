import fs from 'fs';
import DataHandler from 'utils/DataHandler';
import {validate} from './validator';
import {timelineMatches} from '../../../shared/utils/timeline';
import {moment} from '../../../shared/utils/moment';
import * as location from '../location/index';
const locationHandler = location.dataHandler;
const dataHandler = new DataHandler('./api/actions/tour/data.json', validate);

export function load() {
  return new Promise((resolve) => {
    resolve(dataHandler.getData(true));
  });
}

export function update(req) {
  return new Promise((resolve, reject) => {
    const configuration = req.body;
    const result = dataHandler.update(configuration);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function add(req) {
  return new Promise((resolve, reject) => {
    const configuration = req.body;
    const result = dataHandler.add(configuration);
    if (result.errors) {
      reject(result.errors)
    }

    resolve(result);
  });
}

export function kml(req, params) {
  return new Promise((resolve, reject) => {
    import tmp from 'tmp';

    tmp.file(function (err, path, fd, cleanupCallback) {
      if (err) {
        reject(err);
        return;
      }

      import ejs from 'ejs';

      const getDate = () => {
        if (params.length > 1) {
          const paramDate = moment(params[0]);
          if (paramDate.isValid()){
            return paramDate;
          }
        }

        return moment();
      };
      const date = getDate();
      const getTimeline = (tourId) => {
        const tour = dataHandler.getData().find(item => item.id === tourId);
        if (!tour) {
          return [];
        }

        return tour.timelines.find(item => timelineMatches(item, date));
      };

      const id = parseInt(params[0], 10);
      const tour = getTimeline(id);
      if (!tour) {
        reject('No tour available');
        return;
      }
      const startRoute = getTimeline(tour.startroute);
      if (!tour) {
        reject('No start-route available');
        return;
      }

      const locations = [
        ...startRoute.locations,
        ...tour.locations
      ].map(loc => locationHandler.getData().find(item => item.id === loc));
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
            <% locations.forEach(function(location){%>
              <Placemark>
                <name><%=location.name%></name>
                <styleUrl>#sn_blu-stars5</styleUrl>
                <Point>
                  <coordinates><%=location.longitude%>,<%=location.latitude%></coordinates>
                </Point>
              </Placemark>
            <% }); %>
            <Placemark>
              <name>Route</name>
              <LineString>
              <coordinates>
                <% locations.forEach(function(location){%>
                  <%=location.longitude%>,<%=location.latitude%>\n
                <% }); %>
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
    });
  });
}