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

  static _getUsers(data, isAll, fields) {
    const users = JSON.parse(data);
    if (isAll) return users;
    const newUsers = fields.reduce((newUsers, field) => {
      if (users.hasOwnProperty(field)) {
        newUsers[field] = users[field];
      }
      return newUsers;
    }, {});
    return newUsers;
  }

  static getUsers(isAll, ...fields) {
    return fs
      .readFile("./src/databases/users.json")
      .then((data) => {
        return this._getUsers(data, isAll, fields);
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

  //회원가입 데이터 저장 메소드 ./src/databases/users.json 안에 저장됨
  static async save(userInfo) {
    const users = await this.getUsers(true);
    console.log(users);
    // 데이터 추가
    fs.writeFile("./src/databases/users.json", JSON.stringify(users));
  }
}

module.exports = UserStorage;
