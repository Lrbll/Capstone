"use strict";

class UserStorge {
  static _users = {
    id: ["qwer"],
    password: ["1234"],
    name: ["하이"],
  };

  static getUsers() {
    return this._users;
  }
}

module.exports = UserStorge;
