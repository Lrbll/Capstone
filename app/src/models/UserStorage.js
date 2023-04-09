"use strict";

class UserStorage {
  static _users = {
    id: ["qwer", "asdf"],
    password: ["1234", "4321"],
    name: ["하이", "안녕"],
  };

  static getUsers(...fields) {
    const users = this._users;
    const newUsers = fields.reduce((newUsers, field) => {
      if (users.hasOwnProperty(field)) {
        newUsers[field] = users[field];
      }
      return newUsers;
    }, {});
    return newUsers;
  }

  static getUserInfo(id) {
    const users = this._users;
    const idx = users.id.indexOf(id);
    const usersKeys = Object.keys(users);
    const userInfo = usersKeys.reduce((newUsers, info) => {
      newUsers[info] = users[info][idx];
      return newUsers;
    }, {});

    return userInfo;
  }

  static save(userInfo) {
    const users = this._users;
    users.id.push(userInfo.id);
    users.name.push(userInfo.name);
    users.password.push(userInfo.password);
    return { success: true };
  }
}

module.exports = UserStorage;
