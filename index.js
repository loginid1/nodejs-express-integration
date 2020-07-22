require('dotenv').config();
const path = require('path');
const base64url = require('base64url');
const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');


/**
 * 
 */
const app = express();
const port = process.env.PORT || 8081;

/**
 * 
 */
const options = {
    clientID: process.env.LOGINID_APPID,
    clientSecret: process.env.LOGINID_APPSECRET,
    callbackURL: process.env.LOGINID_REDIRECT_URI,
    authorizationURL: process.env.LOGINID_URI + '/hydra/oauth2/auth',
    tokenURL: process.env.LOGINID_URI + '/hydra/oauth2/token',
    scope: process.env.LOGINID_SCOPES,
    state: base64url(JSON.stringify({ state: process.env.LOGINID_APPID })),
};

/**
 * 
 */
const verify = async (accessToken, refreshToken, params, profile, cb) => {
    if (!profile) {
        return cb(null, false);
    }
    return cb(null, profile);
}


const oauth2Strategy = new OAuth2Strategy(options, verify)


/**
 * Define strategy to obtain user profile
 */
oauth2Strategy.userProfile = async (accessToken, cb) => {
    try {
        const { data: user } = await axios.get(`${process.env.LOGINID_URI}/hydra/userinfo`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
        cb(null, user);
    } catch (err) {
        cb(err);
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
app.use(express.urlencoded({
    extended: true
}))
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname + '/views'))

/**
 * 
 */
passport.use('oauth2', oauth2Strategy);
passport.serializeUser(function (user, done) {
    done(null, user);
});
passport.deserializeUser(function (user, done) {
    done(null, user);
});

/**
 * 
 */
app.get('/', (req, res) => {
    res.render('index', { user: req.user ? req.user.sub : null });
});
app.get('/tx', (req, res) => {
    res.render('tx');
});

app.get('/tx-success', (req, res) => {
    res.render('tx-success');
});
app.get('/login', passport.authenticate('oauth2', { scope: ['openid', 'tx.ldOFmDSekNSIf7YMoOj1'] }));
app.post('/validate', async (req, res, next) => {
    try {
        const { data: tx } = await axios.post('http://localhost:8080/api/oidc/tx', req.body);
        passport.authenticate('oauth2', { scope: ['openid', `tx.${tx.id}`] }, (err, user, info) => {
            if (err) { return next(err); }
            if (!user) { return res.redirect('/login'); }
            req.logIn(user, (err) => {
                if (err) { return next(err); }
                return res.redirect('/tx-success');
            });
        })(req, res, next);
    } catch (err) {
        console.log(err);
    }
});
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});
app.get('/callback', passport.authenticate('oauth2', { failureRedirect: '/login' }), async (req, res) => {
    res.redirect('/');
});

/**
 * 
 */
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
