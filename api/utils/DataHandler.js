import * as fs from 'fs';
import * as path from 'path';

export default class DataListHandler {
  constructor(fileName:string, validator) {
    this.fileName = fileName;
    this.validator = validator;
    this.initializeDataDirectory();
    this.data = this.read();
  }

  getData() {
    return this.data;
  }

  add(obj) {
    if (obj.id) {
      return {errors: ['Season has an id assigned and cannot be created again.']};
    }
    let nextId = this.getNextId();
    obj.id = nextId;
    if (!this.validator(obj)) {
      return {errors: this.validator.errors};
    }

    this.data.push(obj);
    this.write();

    return obj;
  }

  update(id, obj) {
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

  delete(id) {
    let index = this.data.findIndex(i => i.id === id);
    if (index < 0) {
      return false;
    }

    this.data = this.data.splice(index);
    this.write();

    return true;
  }

  read() {
    let restaurants = fs.readFileSync(this.fileName, 'utf8');
    return JSON.parse(restaurants);
  }

  write() {
    fs.writeFile(this.fileName, JSON.stringify(this.data, null, 2), {encoding: 'utf8'});
  }

  getNextId() {
    let maxIdItem = this.data.slice(0).sort((r, r2) => r2.id - r.id)[0];
    return maxIdItem.id + 1;
  }

  initializeDataDirectory = () => {
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

  validator;
  fileName;
  data = null;
}