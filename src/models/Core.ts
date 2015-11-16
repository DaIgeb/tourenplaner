export interface ITime {
    hour: number;
    minute: number
}

export interface IDateRange {
    from: moment.Moment;
    until: moment.Moment;
}
export interface ILocation {
    lat: number;
    long: number;
}

export interface IIdentifyable<T> {
    id: T;
}