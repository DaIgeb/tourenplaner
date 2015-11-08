var defaultMoment = require('moment');
defaultMoment.locale("de");

export const getBackendWeekdays = ():Array<string> => {
    var currentLocale = defaultMoment.locale();
    defaultMoment.locale('en');
    let weekdays = defaultMoment.weekdays();
    defaultMoment.locale(currentLocale);
    return weekdays;
};

export const moment = defaultMoment;

