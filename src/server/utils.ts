import * as express from 'express';
import * as model from 'typings/model'

var regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})\.(\d{1,})(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;

export var reviveDates = (key:any, value:any) => {
    var match:RegExpMatchArray;
    if (typeof value === "string" && (match = value.match(regexIso8601))) {
        var milliseconds = Date.parse(match[0]);
        if (!isNaN(milliseconds)) {
            return new Date(milliseconds);
        }
    }
    return value;
};

export var getCallback = <T>(res:express.Response):model.IDataErrorCallback<T> => {
    return (data, err) => {
        if (err) {
            console.log(`Error during execution occurred: ${err}`);
            res.status(500).send(err);
        }
        else {
            res.header('Cache-Control', 'no-cache');
            res.json(data);
        }
    }
};

export var postCallback = (res:express.Response):model.IErrorCallback => {
    return (err:string) => {
        if (err) {
            console.log(`Error during execution occurred: ${err}`);
            res.status(500).send(err);
        }
        else {
            res.sendStatus(204);
        }
    }
};