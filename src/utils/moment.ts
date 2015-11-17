export const moment = require('moment');

export const getBackendWeekdays = ():Array<string> => {
    var currentLocale = moment.locale();
    moment.locale('en');
    let weekdays = moment.weekdays();
    moment.locale(currentLocale);
    return weekdays;
};

export var reviveDates = (key:any, value:any) => {
    var match:RegExpMatchArray;

    if (typeof value === "string") {
        let date = moment(value, moment.ISO_8601, true);
        if (date.isValid()) {
            return date;
        }
    }
    return value;
};
