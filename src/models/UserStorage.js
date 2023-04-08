"use strict";

class UserStorge {
  static _users = {
    id: ["qwer"],
    password: ["1234"],
    name: ["하이"],
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
}

module.exports = UserStorge;
