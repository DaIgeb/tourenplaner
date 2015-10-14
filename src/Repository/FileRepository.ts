/**
 * Created by user on 01.10.2015.
 */
///<reference path="../typings/model.d.ts"/>
import fs = require('fs');
import path = require('path');
import utils = require('../Utils');

class FileRepository implements model.IRepository {
    constructor() {
        this.initializeDataDirectory();
    }

    getSeasons = (callback:model.IDataErrorCallback<Array<model.ISeason>>):void => {
        this.readData(this.seasonsPath, callback);
    };

    getSeason = (year:number, version:number, callback:model.IDataErrorCallback<Array<model.ISeason>>):void => {
        this.readData(this.seasonsPath, (data:Array<model.ISeason>, err:string) => {
            if (data) {
                var seasons:model.ISeason[] = data.filter(s => s.year === year && (!version || s.version === version));
                callback(seasons, err);
            }
            else
                callback(data, err);
        });
    };

    addSeason = (season:model.ISeason, callback:model.IErrorCallback):void => {
        this.getSeasons((seasons, err) => {
            if (!err) {
                seasons.push(season);
                this.writeData(this.seasonsPath, seasons, callback);
                this.createSeason(season);
            }
            else {
                callback(err);
            }
        });
    };
    getHolidays = (year:number, version:number, callback:model.IDataErrorCallback<Array<model.IHoliday>>):void=> {
        var holidayFile = `${this.basePath}${path.sep}${year}${path.sep}${version}${path.sep}${this.holidayFilename}`;
        this.readData(holidayFile, callback);
    };
    addHoliday = (year:number, version:number, holiday:model.IHoliday, callback:model.IErrorCallback):void => {
        this.getHolidays(year, version, (holidays, err) => {
            if (!err) {
                var holidayFile = `${this.basePath}${path.sep}${year}${path.sep}${version}${path.sep}${this.holidayFilename}`;
                holidays.push(holiday);
                this.writeData(holidayFile, holidays, callback);
            }
            else {
                callback(err);
            }
        });
    };

    private readData = <T>(file:string, callback:model.IDataErrorCallback<Array<T>>) => {
        fs.exists(file, (exists) => {
            if (exists) {
                fs.readFile(file, 'utf8', (err:NodeJS.ErrnoException, data:string) => {
                    if (err) {
                        callback(undefined, err.message)
                    }
                    else {
                        var holidays = JSON.parse(data, utils.reviveDates);
                        callback(holidays, undefined);
                    }
                });
            }
            else {
                callback([], undefined);
            }
        });
    };

    private writeData = (file:string, data:any, callback:model.IErrorCallback) => {
        let subPath = "";
        path.dirname(file).split(path.sep).forEach(function (element) {
            subPath += element + path.sep;
            if (!fs.existsSync(subPath)) {
                fs.mkdirSync(subPath);
            }
        });

        fs.writeFile(file, JSON.stringify(data), (err:NodeJS.ErrnoException) => {
            if (err) {
                callback(err.message);
            }
            else {
                callback(undefined);
            }
        });
    };

    private createSeason = (season:model.ISeason) => {
        var seasonPath = `${this.basePath}/${season.year}/${season.version}`;
        if (!fs.existsSync(seasonPath)) {
            fs.mkdirSync(seasonPath);
        }

        var holidayFile = `${seasonPath}/${this.holidayFilename}`;
        if (!fs.existsSync(holidayFile)) {
            fs.writeFileSync(holidayFile, JSON.stringify([]));
        }
    };

    private initializeDataDirectory = () => {
        if (!fs.existsSync(this.basePath)) {
            fs.mkdirSync(this.basePath);
        }

        if (!fs.existsSync(this.seasonsPath)) {
            fs.writeFileSync(this.seasonsPath, JSON.stringify([]));
        }
    };

    private basePath = 'data';
    private seasonsPath = `${this.basePath}${path.sep}seasons.json`;
    private holidayFilename = `holidays.json`;
}

export = FileRepository;
