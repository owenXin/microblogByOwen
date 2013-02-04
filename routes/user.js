var crypto = require('crypto');
var User = require('../models/User');
var Post = require('../models/Post');

exports.view = function(req, res) {
    User.get(req.params.user, function(err, user) {
        if (!user) {
            req.flash('error', '用户不存在');
            return res.redirect('/');
        }
        Post.get(user.name, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
            });
        });
    });
};



exports.reg = function(req, res) {
    res.render('reg', {
        title: '用户注册',
    });
};

exports.doReg = function(req, res) {
    //檢驗用戶兩次輸入的口令是否一致
    if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error', '两次输入的密码不一致');
        return res.redirect('/reg');
    }

    //生成口令的散列值
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    var newUser = new User({
        name: req.body.username,
        password: password,
    });

    //檢查用戶名是否已經存在
    User.get(newUser.name, function(err, user) {
        if (user) err = 'Username already exists.';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }
        //如果不存在則新增用戶
        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
};
