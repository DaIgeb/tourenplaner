import * as fs from 'fs';
import * as path from 'path';
import {IIdentifyable} from 'models/Core';
import {reviveDates} from 'utils/moment';

export class DataListHandler<T extends IIdentifyable<number>> {
    constructor(private fileName:string) {
        this.initializeDataDirectory();

        this.data = this.read();
    }

    getData():Array<T> {
        return this.data;
    }

    add(obj:T):number {
        let nextId = this.getNextId();
        obj.id = nextId;
        this.data.push(obj);

        return nextId;
    }

    update(id:number, obj:T):boolean {
        try {
        let index = this.data.findIndex(i => i.id === id);
        if (index < 0) {
            return false;
        }

        this.data[index] = obj;
        this.write();

        return true;
        } catch (err) {
            console.error(err);
        }
    }

    delete(id:number):boolean {
        let index = this.data.findIndex(i => i.id === id);
        if (index < 0) {
            return false;
        }

        this.data = this.data.splice(index);
        this.write();

        return true;
    }

    private read():Array<T> {
        let restaurants = fs.readFileSync(this.fileName, 'utf8');
        return JSON.parse(restaurants, reviveDates);
    }

    private write():void {
        fs.writeFile(this.fileName, JSON.stringify(this.data, null, 2), {encoding: 'utf8'});
    }

    private getNextId():number {
        let maxIdItem = this.data.slice(0).sort((r:T, r2:T) => r2.id - r.id)[0];
        return maxIdItem.id + 1;
    }

    private initializeDataDirectory = () => {
        let parts = this.fileName.split(path.delimiter);
        let currentPath = '';
        for (let i = 0; i < parts.length - 1; i++) {
            currentPath += parts[i] + path.delimiter;
            if (!fs.existsSync(currentPath)) {
                fs.mkdirSync(currentPath);
            }
        }

        if (!fs.existsSync(this.fileName)) {
            fs.writeFileSync(this.fileName, JSON.stringify([]));
        }
    };


    private data:T[] = null;
}