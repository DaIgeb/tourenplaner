import momentTz from 'moment-timezone';

export const defaultTimeZone = 'Europe/Zurich';
export const defaultLocale = 'de-CH';
momentTz.locale(defaultLocale);
momentTz.tz.setDefault(defaultTimeZone);
export const moment = momentTz;
export default momentTz;
