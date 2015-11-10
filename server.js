'use strict';

require('./server/db/mongo');

var express = require('express');
var server = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var path = require('path');
var fs = require('fs');
var session = require('express-session');
var sassMiddleware = require('node-sass-middleware');

var modelsPath = path.join(__dirname, 'server/models');
fs.readdirSync(modelsPath).forEach(function (file) {
    require(modelsPath + '/' + file);
});

server.use(express.static(path.join(__dirname, 'client')));
server.use(bodyParser.json());
server.use(cookieParser());
server.use(bodyParser.urlencoded({extended: true}));

server.use(session({
    secret: 'aivaraSlepenaAtslega',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 864000000
    }
}));

server.use(passport.initialize());
server.use(passport.session());

server.use(sassMiddleware({
    src: __dirname + '/client',
    dest: __dirname + '/client',
    debug: true,
    outputStyle: 'compressed'
}));

server.use('/auth', require('./server/routes/account'));
server.route('/*').get(function(req, res) {
    return res.sendFile(path.join(__dirname, 'client/views/index.html'));
});

server.set('port', process.env.PORT || 3000);
server.listen(server.get('port'), function () {
  console.log('Express server listening on port %d in %s mode', server.get('port'));
});

