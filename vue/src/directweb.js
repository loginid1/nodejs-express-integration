// const server = 'https://apis.blockidentity.org';

var LoginidApi_baseURL = "https://direct.native.loginid.io";
var LoginidApi_clientId;
// APIs to call from GUI layer button clicks
export default class LoginidApi {

    //static baseURL="https://direct.native.loginid.io";
    //static clientId;
    static initialize(api) {
        LoginidApi_clientId = api;
    }

    static initializeWithBaseURL(api, baseURL) {
        LoginidApi_clientId = api;
        LoginidApi_baseURL = baseURL;
    }

    static detectSupportAgent() {
        if (!window.PublicKeyCredential || !window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
            return false;
        }
        return true;
    }

    static async register(username) {

        let finalResponse = {
            success: false,
            username: '',
            jwt: '',
            errorMessage: ''
        }

        if (!LoginidApi.detectSupportAgent()) {
            finalResponse.errorMessage = "Browser Agent doesn't support fido2";
            return finalResponse;
        }

        try {
            // server start

            let requestPayload = {
                clientId: LoginidApi_clientId,
                udata: username
            }
            console.log("register request ", LoginidApi_baseURL, requestPayload);
            let responseJSON = await sendPayloadToServer(LoginidApi_baseURL, '/registerRequest', requestPayload);

            console.log("register request response", responseJSON);
            let uid = responseJSON.uid;
            //let challenge=base64url.decode(responseJSON.challenge);
            let challenge = responseJSON.challenge;

            // change challenge from base64url to array buffer
            responseJSON.challenge = LoginidApi.convertBase64ToBuffer(challenge);
            // change user id from base64url to array buffer
            responseJSON.user.id = LoginidApi.convertBase64ToBuffer(responseJSON.user.id);

            let publicKey = { publicKey: responseJSON };
            let credential = await navigator.credentials.create(publicKey);
            //let newCredResponse = makeRequest(credential);
            let attestPayload = {
                clientId: LoginidApi_clientId,
                uid: uid,
                challenge: challenge,
                udata: username,
                keyHandle: LoginidApi.convertStringToBase64(credential.rawId),
                clientData: LoginidApi.convertStringToBase64(credential.response.clientDataJSON),
                attestData: LoginidApi.convertStringToBase64(credential.response.attestationObject),
            };

            // server end
            responseJSON = await sendPayloadToServer(LoginidApi_baseURL, '/registerAttest', attestPayload);

            finalResponse.username = username;
            finalResponse.jwt = responseJSON.jwt;
            finalResponse.success = true;
            localStorage.setItem("credId_" + username, uid);
            localStorage.setItem("username", username);
            return finalResponse;

        }
        catch (e) {
            console.log("register error", e);
            finalResponse.errorMessage = e;
            return finalResponse;
        }
    }

    static getLastUserAccount() {
        let username = localStorage.getItem("username");
        if (username && localStorage.getItem("credId_" + username)) {
            return username;
        }
        return null;
    }

    static async login(username) {

        let finalResponse = {
            success: false,
            username: '',
            jwt: '',
            errorMessage: ''
        }

        if (!LoginidApi.detectSupportAgent()) {
            finalResponse.errorMessage = "Browser Agent doesn't support fido2";
            return finalResponse;
        }
        try {
            let uid = localStorage.getItem("credId_" + username);

            let requestPayload;

            if (uid == null) {

                requestPayload = {
                    clientId: LoginidApi_clientId,
                    username: username
                };
            } else {
                requestPayload = {
                    clientId: LoginidApi_clientId,
                    uid: uid
                };
            }
            // server start
            let responseJSON = await sendPayloadToServer(LoginidApi_baseURL, '/verifyRequest', requestPayload);

            //let uid=responseJSON.uid;
            //let challenge=base64url.decode(responseJSON.challenge);
            let challenge = responseJSON.challenge;

            // change challenge from base64url to array buffer
            responseJSON.challenge = LoginidApi.convertBase64ToBuffer(challenge);
            // change user id from base64url to array buffer
            //responseJSON.user.id=LoginidApi.convertBase64ToBuffer(responseJSON.user.id);
            if (responseJSON.allowCredentials) {
                for (let cred of responseJSON.allowCredentials) {
                    cred.id = LoginidApi.convertBase64ToBuffer(cred.id);
                }
            }

            let publicKey = { publicKey: responseJSON };
            let credential = await navigator.credentials.get(publicKey)

            let assertPayload;

            if (uid == null) {

                assertPayload = {
                    clientId: LoginidApi_clientId,
                    username: username,
                    challenge: challenge,
                    udata: username,
                    keyHandle: LoginidApi.convertStringToBase64(credential.rawId),
                    clientData: LoginidApi.convertStringToBase64(credential.response.clientDataJSON),
                    authData: LoginidApi.convertStringToBase64(credential.response.authenticatorData),
                    signData: LoginidApi.convertStringToBase64(credential.response.signature),
                };
            } else {
                assertPayload = {
                    clientId: LoginidApi_clientId,
                    uid: uid,
                    challenge: challenge,
                    udata: username,
                    keyHandle: LoginidApi.convertStringToBase64(credential.rawId),
                    clientData: LoginidApi.convertStringToBase64(credential.response.clientDataJSON),
                    authData: LoginidApi.convertStringToBase64(credential.response.authenticatorData),
                    signData: LoginidApi.convertStringToBase64(credential.response.signature),
                };
            }


            // server end
            responseJSON = await sendPayloadToServer(LoginidApi_baseURL, '/verifySign', assertPayload);

            finalResponse.username = username;
            finalResponse.jwt = responseJSON.jwt;
            finalResponse.success = true;

            return finalResponse;
        }
        catch (e) {
            console.log("verity error", e);
            finalResponse.errorMessage = e;
            return finalResponse;
        }

    }

    static async createTx(tx, username) {
        if (!LoginidApi.detectSupportAgent()) {
            return {
                errorMessage: "Browser Agent doesn't support fido2"
            };
        }
        try {
            let uid = localStorage.getItem("credId_" + username);

            let requestPayload;

            if (uid == null) {
                requestPayload = {
                    clientId: LoginidApi_clientId,
                    username: username
                };
            } else {
                requestPayload = {
                    clientId: LoginidApi_clientId,
                    uid: uid
                };
            }

            requestPayload.tx = tx;

            // server start
            return await sendPayloadToServer(LoginidApi_baseURL, '/verifyRequest', requestPayload);
        } catch (e) {
            console.log("create tx error", e);
            return {
                success: false,
                errorMessage: e
            }
        }
    }

    static async validateTx(createTxResponse, txId, username) {
        try {
            //let uid=responseJSON.uid;
            //let challenge=base64url.decode(responseJSON.challenge);
            let challenge = createTxResponse.challenge;

            // change challenge from base64url to array buffer
            createTxResponse.challenge = LoginidApi.convertBase64ToBuffer(challenge);
            // change user id from base64url to array buffer
            //responseJSON.user.id=LoginidApi.convertBase64ToBuffer(responseJSON.user.id);
            if (createTxResponse.allowCredentials) {
                for (let cred of createTxResponse.allowCredentials) {
                    cred.id = LoginidApi.convertBase64ToBuffer(cred.id);
                }
            }

            let publicKey = { publicKey: createTxResponse };
            let credential = await navigator.credentials.get(publicKey)

            let assertPayload;
            let uid = localStorage.getItem("credId_" + username);

            if (uid == null) {

                assertPayload = {
                    clientId: LoginidApi_clientId,
                    username: username,
                    challenge: challenge,
                    udata: username,
                    keyHandle: LoginidApi.convertStringToBase64(credential.rawId),
                    clientData: LoginidApi.convertStringToBase64(credential.response.clientDataJSON),
                    authData: LoginidApi.convertStringToBase64(credential.response.authenticatorData),
                    signData: LoginidApi.convertStringToBase64(credential.response.signature),
                };
            } else {
                assertPayload = {
                    clientId: LoginidApi_clientId,
                    uid: uid,
                    challenge: challenge,
                    udata: username,
                    keyHandle: LoginidApi.convertStringToBase64(credential.rawId),
                    clientData: LoginidApi.convertStringToBase64(credential.response.clientDataJSON),
                    authData: LoginidApi.convertStringToBase64(credential.response.authenticatorData),
                    signData: LoginidApi.convertStringToBase64(credential.response.signature),
                };
            }

            assertPayload.txId = txId;

            // server end
            const validateTxResponse = await sendPayloadToServer(LoginidApi_baseURL, '/verifySign', assertPayload);

            return {
                username,
                jwt: validateTxResponse.jwt,
                txId: validateTxResponse.txId,
                success: true
            }
        }
        catch (e) {
            console.log("validate tx error", e);
            return {
                success: false,
                errorMessage: e
            }
        }

    }

    //convert string data to base64
    static convertStringToBase64(data) {
        const base64 = Buffer.from(data).toString('base64');
        //const base64url=base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
        const base64url = Base64EncodeUrl(base64);
        return base64url;
    }
    // convert base64dataToBuffer
    static convertBase64ToBuffer(data) {
        const buffer = Buffer.from(data, 'base64');
        return buffer;
    }

}
function Base64EncodeUrl(str) {
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

const sendPayloadToServer = async (server, endpoint, payload) => {
    let payloadJSON = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    };

    let response = await fetch(server + endpoint, payloadJSON);
    console.log("response", response);
    let responseJSON = await response.json();

    if (response.ok) {
        return responseJSON;
    } else {
        console.log("server payload error: ", responseJSON);
        throw new Error(`Server responed with error: ${responseJSON.errorMessage}`);
    }

}