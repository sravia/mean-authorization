var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    ObjectId = mongoose.Types.ObjectId;

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ _id: id }, function (err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, {
                    'errors': {
                        'email': { type: 'Email is not registered.' }
                    }
                });
            }
            if (!user.authenticate(password)) {
                return done(null, false, {
                    'errors': {
                        'password': { type: 'Password is incorrect.' }
                    }
                });
            }
            return done(null, user);
        });
    }
));

router.route('/users').post(function(req, res) {
    var newUser = new User(req.body);
    newUser.provider = 'local';

    newUser.save(function(err) {
        if (err) {
            return res.status(400).json(err);
        }

        req.logIn(newUser, function(err) {
            if (err) return next(err);
            return res.json(newUser.user_info);
        });
    });
});

router.route('/users/:userId').get(function(req, res) {
    var userId = req.params.userId;

    User.findById(ObjectId(userId), function (err, user) {
        if (err) {
            return next(new Error('Failed to load User'));
        }
        if (user) {
            res.send({username: user.username, profile: user.profile });
        } else {
            res.send(404, 'USER_NOT_FOUND')
        }
    });
});

router.route('/check_email/:email').get(function(req, res) {
    var email = req.params.email;
    User.findOne({ email : email }, function (err, user) {
        if (err) {
            return next(new Error('Failed to load email ' + email));
        }

        if(user) {
            res.json({exists: true});
        } else {
            res.json({exists: false});
        }
    });
});

router.route('/session').post(function(req, res) {
    passport.authenticate('local', function(err, user, info) {
        if (info) {
            return res.status(400).json(info);
        }
        req.logIn(user, function(err) {
            if (err) { return res.send(err); }
            res.json(req.user.user_info);
        });
    })(req, res);
});

router.route('/session').get(function(req, res) {
    if(req.isAuthenticated()){
        res.json(req.user.user_info);
    }
});

router.route('/session').delete(function(req, res) {
    if(req.user) {
        req.logout();
        res.sendStatus(200);
    } else {
        res.sendStatus(400, "Not logged in");
    }
});

module.exports = router;
