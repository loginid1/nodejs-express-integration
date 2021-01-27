# End to End Testing - Transaction Confirmation

## NOTE

THESE TESTS WILL NOT WORK WITH BIOMETRIC AUTHENTICATION. IT IS CURRENTLY NOT
POSSIBLE TO DO SO WITH AUTOMATED TESTS. THESE TESTS NEED A TRADITIONAL LOGIN
AND PASSWORD TO WORK. MAKE A NEW ACCOUNT IF NEEDED.

## .env

A _.env_ file is needed to keep sensitive information private such as
username and password. The .env holds these environment variables:

```
LOGINID_USERNAME=<LOGINID_USERNAME>
LOGINID_PASSWORD=<LOGINID_PASSWORD>
```

## Set Up

1. Follow the steps from the README in the main directory but make sure it is a traditional username/password account. Make sure the account is created at LoginID's current [sandbox](https://sandbox-usw1.api.loginid.io) if you do not have one.
2. Create a .env in this current directory and fill in the appropriate variables found above.
3. If you changed the default localhost address or port number from the actual application, make sure you edit that as well in _./data/index.js_.

## Running The Tests

1. Make sure a proper .env file is created from previous section
2. From this current directory enter _npm install_
3. Run the server from the main directory (the actual application)
4. From this current directory enter _npm test_
