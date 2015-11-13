export const moment = require('moment');

export const getBackendWeekdays = ():Array<string> => {
    var currentLocale = moment.locale();
    moment.locale('en');
    let weekdays = moment.weekdays();
    moment.locale(currentLocale);
    return weekdays;
};

export function getMoment(locale: string = 'de'): moment.MomentStatic {
    moment.locale(locale);

    return moment;
}

