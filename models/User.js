function User(user) {
    this.name = user.name;
    this.password = user.password;
};
module.exports = User;



var UserDao = require('../daos/UserDao');

User.prototype.save = function save(callback) {
    // 存入 Mongodb 的文檔
    var user = {
        name: this.name,
        password: this.password,
    };

    UserDao.save(user, callback);
};

User.get = function get(username, callback) {
    UserDao.get(username, callback);
};
