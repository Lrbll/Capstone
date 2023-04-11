"use strict";

const fs = require("fs").promises;

class UserStorage {
  static _getUserInfo(data, id) {
    const users = JSON.parse(data);
    const idx = users.id.indexOf(id);
    const usersKeys = Object.keys(users);
    const userInfo = usersKeys.reduce((newUsers, info) => {
      newUsers[info] = users[info][idx];
      return newUsers;
    }, {});
    return userInfo;
  }

  static _getUsers(data, fields) {
    const users = JSON.parse(data);
    const newUsers = fields.reduce((newUsers, field) => {
      if (users.hasOwnProperty(field)) {
        newUsers[field] = users[field];
      }
      return newUsers;
    }, {});
    return newUsers;
  }

  static getUsers(...fields) {
    return fs
      .readFile("./src/databases/users.json")
      .then((data) => {
        return this._getUsers(data, fields);
      })
      .catch(console.error);
  }

  static getUserInfo(id) {
    return fs
      .readFile("./src/databases/users.json")
      .then((data) => {
        return this._getUserInfo(data, id);
      })
      .catch(console.error);
  }

  static async save(userInfo) {
    const users = await this.getUsers("id", "password", "name");
    console.log(users);
    fs.writeFile("./src/databases/users.json", users);
  }
}

module.exports = UserStorage;
