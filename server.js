
var express = require('express');
var ejs = require('ejs');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(express);
var settings = require('./settings');
var routes = require('./routes');

var app = express();
app.configure(function() {
    console.log(__dirname);
    app.set('views', __dirname + '/views');
    // app.set('view engine', 'ejs');
    app.engine('.html', ejs.__express);
    app.set('view engine', 'html');
    app.use(express.bodyParser());
    app.use(flash());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: settings.cookieSecret,
        store: new MongoStore({
            db: settings.db
        })
    }));

    app.use(function(req, res, next) {
        res.locals.error = req.flash('error').toString();
        res.locals.success = req.flash('success').toString();
        res.locals.user = req.session ? req.session.user : null;
        next();
    });

    app.use(app.router);
    routes(app);
    app.use(express.static(__dirname + '/web'));
});


app.configure('development', function() {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
});

app.configure('production', function() {
    app.use(express.errorHandler());
});


exports.start = function() {
    app.listen(settings.port);

    console.log("Express server listening on port %d in %s mode", settings.port, app.settings.env);
}
