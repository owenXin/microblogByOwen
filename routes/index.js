var crypto = require('crypto');
var User = require('../models/User');
var Post = require('../models/Post');

var user = require('./user');
var post = require('./post');

var that = exports;

exports.index = function(req, res) {
    Post.get(null, function(err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: '首页',
            posts: posts
        });
    });
};

exports.login = function(req, res) {
    res.render('login', {
        title: '用戶登入',
    });
};

exports.doLogin = function(req, res) {
    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/login');
        }
        if (user.password != password) {
            req.flash('error', '密码错误');
            return res.redirect('/login');
        }
        req.session.user = user;
        req.flash('success', '登录成功');
        res.redirect('/');
    });
};


exports.logout = function(req, res) {
    req.session.user = null;
    req.flash('success', '登出成功');
    res.redirect('/');
};


module.exports = function(app) {

    app.get('/', that.index);

    app.get('/login', checkNotLogin);
    app.get('/login', that.login);


    app.post('/login', checkNotLogin);
    app.post('/login', that.doLogin);


    app.get('/logout', checkLogin);
    app.get('/logout', that.logout);


    app.get('/u/:user', user.view);

    app.get('/reg', checkNotLogin);
    app.get('/reg', user.reg);

    app.post('/reg', checkNotLogin);
    app.post('/reg', user.doReg);



    app.post('/post', checkLogin);
    app.post('/post', post.doPost);

};

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.flash('error', '未登入');
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}
