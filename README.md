# Node.JS (Express) Integration

This is an integration sample written in JavaScript using the Node.JS runtime and the express web framework.

## Setup

#### Local setup

To run this project locally in your development environment, you will have to use the `localhost` or `127.0.0.1`. If you are running multiple projects, consider accessing the `hosts` file to add a new line with your project URI. For this example, we are using the `node.integration.localhost` URI. 

**Note:** When using a custom URIs for your local projects, you will have to use the `.localhost` suffix.

Our `hosts` file will look like the following:
```
# Default Settings
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost

# Custom URI Settings
127.0.0.1       node.integration.localhost
```

#### Filling the environment variables

To configure the environment you will need to make a copy of `.env.example` file, rename it to `.env` and fill all the environment variables. To have a better understanding of the variables please refer to the documentation.

###### The `LOGIN_URI` variable

This is the URI that will be used to communicate with LoginID's servers, for this example, we are using the development servers, therefore we are going to use the `https://sandbox-usw1.api.loginid.io/` URI.

```
LOGIN_URI=https://sandbox-usw1.api.loginid.io/
```

###### The `LOGIN_REDIRECT_URI` variable

When the user authenticates themselves with LoginID (similar to authenticating with Google), LoginID will need to pass back control and information back to your servers. The Callback URL is the path that will be used to accomplish this and you will need to define it.

Because we are using the custom URI our variable will look like the following:

```
LOGIN_REDIRECT_URI=http://node.integration.localhost:3000/callback
```

**Note:** Save this redirect URI, you will use it to create your client credentials later on. 

###### The `LOGIN_SCOPES` variable

You should use `openid` as the field for scopes

```
LOGIN_SCOPES=openid
```

###### The `LOGIN_APPID` and `LOGIN_APPSECRET` variables

In order to receive access to integrate LoginID, you will need to create your client credentials. This is similar to the credentials you would create with Google to use Google authentication. This allows you to use LoginID services in a secure, authenticated fashion.

To obtain the client keys you will need to perform the following steps:

**Step 1** - Using an existing account or registering a new one

 - Navigate to https://sandbox-usw1.api.loginid.io/en/register
 - Enter your username for an existing account or select the **"Register a new account"** option and create a username.
 - Hit the **"Next"** button

**Step 2** - Use your biometric capabilities

 - Your web browser will ask for permission to use your security key or another authenticator in order to proceed with account creation.
 - Please note that the native dialogues for doing so vary by browser, operating system and the type of authenticator you are using. 

**Step 3** - Enter the integration dashboard

Once you have access to the LoginID dashboard, use the navigation bar to select **"Integrations"** option or press the **"Add Integration"** button.

**Step 4** - Sign the Customer License Agreement

 - Scroll down the page and press the **"View"** button.
 - Agree to the terms and press the **"Sign"** button.

**Step 5** - Add new OIDC Integration
 
 - Press the **"Get Integrated"** button under the OIDC box.
 - Enter a name for your application, website or service.
 - Enter the callback URL for your application, website or service.
 - Press the **"Create"** button.
 - Copy the Application ID and Application Secret and use them to fill the `LOGIN_APPID` and `LOGIN_APPSECRET` variables respectively.

```
LOGIN_APPID=your.application.id
LOGIN_APPSECRET=your.application.secret
```

## Running the project

#### Installing dependencies

```
$ npm install
```

#### Execute the project

```
$ npm run start
```
Or run the project with a watcher 
```
$ npm run dev
```
