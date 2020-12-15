require('dotenv').config();
const path = require('path');
const base64url = require('base64url');
const express = require('express');
const session = require('express-session');
const cookie = require('cookie-parser');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const axios = require('axios');
const morgan = require('morgan');


/**
 * 
 */
const app = express();
const port = process.env.PORT || 8080;

/**
 * 
 */
const options = {
    clientID: process.env.LOGIN_APPID,
    clientSecret: process.env.LOGIN_APPSECRET,
    callbackURL: process.env.LOGIN_REDIRECT_URI,
    authorizationURL: process.env.LOGIN_URI + '/oauth2/auth',
    tokenURL: process.env.LOGIN_URI + '/oauth2/token',
    scope: process.env.LOGIN_SCOPES,
    state: base64url(JSON.stringify({ state: process.env.LOGIN_APPID })),
};

const optionsTx = {
    clientID: process.env.LOGIN_APPID,
    clientSecret: process.env.LOGIN_APPSECRET,
    callbackURL: process.env.LOGIN_REDIRECT_URI_TX,
    authorizationURL: process.env.LOGIN_URI + '/oauth2/auth',
    tokenURL: process.env.LOGIN_URI + '/oauth2/token',
    scope: process.env.LOGIN_SCOPES,
    state: base64url(JSON.stringify({ state: process.env.LOGIN_APPID })),
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
const transactionStrategy = new OAuth2Strategy(optionsTx, verify)


/**
 * Define strategy to obtain user profile
 */
oauth2Strategy.userProfile = async (accessToken, cb) => {
    try {
        const { data: user } = await axios.get(`${process.env.LOGIN_URI}/userinfo`, {
            headers: {
                authorization: `Bearer ${accessToken}`
            }
        })
        cb(null, user);
    } catch (err) {
        cb(err);
    }

}
app.use(morgan('combined'));
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
passport.use('transaction', transactionStrategy);

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

app.use('/tx', express.static('vue/dist'));


app.get('/login', passport.authenticate('oauth2', { scope: ['openid', 'tx.*'] }));

app.post('/validate', async (req, res, next) => {
    try {
        const { data: tx } = await axios.post('https://poc1.awstest.loginid.io/api/oidc/tx', req.body);
        passport.authenticate('transaction', { scope: [`tx.${tx.id}`] })(req, res, next);
    } catch (err) {
        console.log(err);
    }
});

app.get('/tx-success', async (req, res) => {
    let txId = req.query?.tx;
    if (req.query?.scope) {
        txId = req.query?.scope.startsWith("tx") ? req.query?.scope.substring(3) : undefined;
    }

    let tx = {};
    if (txId) {
        ({ data: tx } = await axios.get(`https://poc1.awstest.loginid.io/api/oidc/tx/${txId}`));
    }
    res.render('tx-success', { tx });
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
