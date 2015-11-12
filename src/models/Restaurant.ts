export interface IRestaurant {
    id?: number;
    name: string;
    address: string;
    zipCode: string;
    city: string;
    location: ILocation,
    data: IRestaurantTimeline[]
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