export interface IRepository {
    getSeasons: (cb:IDataErrorCallback<Array<ISeason>>) => void;
    getSeason: (year:number, version:number, callback:IDataErrorCallback<Array<ISeason>>)=>void;
    addSeason: (season:ISeason, cb:IErrorCallback) => void;
    getHolidays: (year:number, version:number, cb:IDataErrorCallback<Array<IHoliday>>) => void;
    addHoliday: (year:number, version:number, holiday:IHoliday, cb:IErrorCallback) => void;
}

export interface ISeason {
    year: number;
    version: number;
}

export interface IHoliday {
    name: string;
    date: Date;
}

export interface IErrorCallback {
    (err:string): void
}

export interface IDataErrorCallback<T> {
    (data:T, err:string): void
}