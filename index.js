require('dotenv').config();
const base64url = require('base64url');
const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');


/**
 * 
 */
const app  = express();
const port = process.env.PORT || 5000;

/**
 * 
 */
const options = {
    clientID:           process.env.LOGINID_APPID,
    clientSecret:       process.env.LOGINID_APPSECRET,
    callbackURL:        process.env.LOGINID_REDIRECT_URI,
    authorizationURL:   process.env.LOGINID_URI + '/hydra/oauth2/auth',
    tokenURL:           process.env.LOGINID_URI + '/hydra/oauth2/token',
    scope:              process.env.LOGINID_SCOPES ,
    state:              base64url(JSON.stringify({state: process.env.LOGINID_APPID})),
};

/**
 * 
 */
const verify = function (accessToken, refreshToken, profile, cb) {
    console.log(`Access token is:  ${ accessToken  }`);
    console.log(`Refresh token is: ${ refreshToken }`);

    if (profile) {
        user = profile;
        return cb(null, user);
    } else {
        return cb(null, false);
    }
}

/**
 * 
 */
app.use(cookie());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

/**
 * 
 */
passport.use(new OAuth2Strategy(options, verify));
passport.serializeUser(function(user, done) {
    done(null, user);
}); 
passport.deserializeUser(function(user, done) {
    done(null, user);
});

/**
 * 
 */
app.get('/', (req, res) => {
    res.send('Node.JS / express (^4.17.1)');
});
app.get('/login', passport.authenticate('oauth2'));
app.get('/callback', passport.authenticate('oauth2'), (req, res) => {
    res.send('Check terminal logs');
});

/**
 * 
 */
app.listen(port, () => {
    console.log(`listening on port ${ port }`);
});
