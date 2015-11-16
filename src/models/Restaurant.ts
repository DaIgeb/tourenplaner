import {IIdentifyable} from './Core';

interface IRestaurantBase {
    name: string;
    address: string;
    zipCode: string;
    city: string;
    location: ILocation,
    timelines: IRestaurantTimeline[]
}

export interface IRestaurantDataModel extends IRestaurantBase, IIdentifyable<number> {
    id: number;
}

export interface IRestaurant extends IRestaurantBase {
    id?: number;
}

export interface IRestaurantTimeline extends IDateRange {
    id?: number;
    businessHours: Array<IBusinessHour>;
    phone: string;
    notes: string;
}

export interface IBusinessHour {
    weekday: string;
    from: ITime;
    until: ITime;
}
export interface IDateRange {
    from: moment.Moment;
    until: moment.Moment;
}

export interface ITime {
    hour: number;
    minute: number
}

export interface ILocation {
    lat: number;
    long: number;
}