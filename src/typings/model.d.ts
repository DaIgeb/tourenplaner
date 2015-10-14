/**
 * Created by user on 01.10.2015.
 */
declare module model {
    interface IRepository {
        getSeasons: (cb:IDataErrorCallback<Array<ISeason>>) => void;
        getSeason: (year:number, version:number, callback:model.IDataErrorCallback<Array<model.ISeason>>)=>void;
        addSeason: (season:ISeason, cb:IErrorCallback) => void;
        getHolidays: (year:number, version:number, cb:IDataErrorCallback<Array<IHoliday>>) => void;
        addHoliday: (year:number, version:number, holiday:IHoliday, cb:IErrorCallback) => void;
    }

    interface ISeason {
        year: number;
        version: number;
    }

    interface IHoliday {
        name: string;
        date: Date;
    }

    interface IErrorCallback {
        (err:string): void
    }

    interface IDataErrorCallback<T> {
        (data:T, err:string): void
    }
}