require("dotenv").config();
const base64url = require("base64url");
const express = require("express");
const path = require("path");
const session = require("express-session");
const cookie = require("cookie-parser");
const passport = require("passport");
const OAuth2Strategy = require("passport-oauth2");
const { ensureLoggedOut, ensureLoggedIn } = require("connect-ensure-login");

/**
 *
 */
const app = express();
const port = process.env.PORT || 3000;

/**
 * Making sure that the required environment variables are filled out
 */
const requiredEnvParams = [
  "LOGIN_APPID",
  "LOGIN_APPSECRET",
  "LOGIN_REDIRECT_URI",
  "LOGIN_URI",
  "LOGIN_SCOPES",
];
for (const param of requiredEnvParams) {
  if (!process.env[param]) {
    console.log(
      `WARNING: Parameter ${param} is undefined, unexpected behaviour may occur, check your environment file`
    );
  }
}

/**
 * defining options for Oauth2Strategy
 */
const options = {
  clientID: process.env.LOGIN_APPID,
  clientSecret: process.env.LOGIN_APPSECRET,
  callbackURL: process.env.LOGIN_REDIRECT_URI,
  authorizationURL: `${process.env.LOGIN_URI}hydra/oauth2/auth`,
  tokenURL: `${process.env.LOGIN_URI}hydra/oauth2/token`,
  scope: process.env.LOGIN_SCOPES,
  state: base64url(JSON.stringify({ state: process.env.LOGIN_APPID })),
  passReqToCallback: true, // this is important, so you can obtain the bearer token in the verify() function
};

/**
 *
 */
const verify = (req, accessToken, refreshToken, params, profile, done) => {
  console.log(`Access token is:  ${accessToken}`);
  console.log(`Refresh token is: ${refreshToken}`);
  console.log("Params: ", params["token_type"], params["id_token"]);
  console.log("Profile:", profile); // note due to the way passport works, profile would always be {}

  if (profile) {
    // TODO; do something here validate the token's signature.
    user = profile;
    return done(null, user);
  }
  return done(null, false);
};

/**
 *
 */
app.use(cookie());
app.use(
  session({
    secret: "keyboard cat", // change the secret when in production
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

/**
 *
 */
passport.use(new OAuth2Strategy(options, verify));
passport.serializeUser((user, done) => {
  // note that the user param is whatever you passed into the done() function 
  // in the verify function you defined earlier
  done(null, user);
});
passport.deserializeUser((user, done) => {
  // the user param here is what you have stored in the session
  done(null, user);
});

/**
 * Site root
 * here we use ensureLoggedOut for this route so that we only allow this route to be accessed while user is logged out
 * Learn More: https://github.com/jaredhanson/connect-ensure-login/blob/master/lib/ensureLoggedOut.js
 */
app.get("/", ensureLoggedOut("/dashboard"), (req, res) => {
  res.sendFile(path.join(`${__dirname}/src/index.html`));
});

/**
 * Login route, we call this to initiate the oauth2 login
 */
app.get("/login", passport.authenticate("oauth2"));

/**
 * Callback route, the route that the api will redirect the user after logging in
 */
app.get(
  "/callback",
  passport.authenticate("oauth2", {
    session: true,
    successReturnToOrRedirect: "/dashboard",
  })
);

/**
 * Dashboard for the user once they have logged in.
 * This is a protected route by ensureLoggedIn
 * Learn More: https://github.com/jaredhanson/connect-ensure-login/blob/master/lib/ensureLoggedIn.js
 */
app.get("/dashboard", ensureLoggedIn("/login"), (req, res) => {
  res.sendFile(path.join(`${__dirname}/src/dashboard.html`));
});

/**
 * Logout route
 * Ends passport session.
 */
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
  // alternatively, you could do the following
  // req.session.destroy(() => res.redirect('/'));
});

/**
 *
 */
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
