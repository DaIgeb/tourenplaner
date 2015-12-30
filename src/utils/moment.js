import momentTz from 'moment-timezone';

export const defaultTimeZone = 'Europe/Zurich';
export const defaultLocale = 'de-CH';
momentTz.locale(defaultLocale);
export const moment = momentTz;
export default momentTz;
