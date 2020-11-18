import * as fs from 'fs';
import axios from 'axios';
import * as qs from 'qs';

//const privateKEY: any = JSON.parse(fs.readFileSync("./private.key", "utf8"));
const privateKEY = JSON.parse(process.env.PRIVATE_KEY);
import { KEYUTIL, jws } from 'jsrsasign';

const client_id = process.env.CLIENT_ID;
const audience = 'https://api.redoxengine.com/v2/auth/token';

// general 
const kid = privateKEY.kid; // key ID
const alg = privateKEY.alg; // Hashing algorithm
const kty = privateKEY.kty; // Key Type (RSA, EC, or oct)
const d = privateKEY.d; // private key for EC or RSA
const e = privateKEY.e; // exponent for RSA
const n = privateKEY.n; // modulus for RSA
// const x = privateKEY.x; // x value for EC
// const y = privateKEY.y; // y value for EC
// const crv = privateKEY.crv; // cryptographic curve used with the key
// const k = privateKEY.k; // hmac secret

const date = new Date();


const secret = KEYUTIL.getKey({ d, e, n, kty });



const header = JSON.stringify({
    "alg": alg,
    "kid": kid,
    "typ": "JWT"
});

const payload = JSON.stringify({
    "iss": client_id,
    "sub": client_id,
    "aud": audience,
    "iat": Math.floor(date.getTime() / 1000),
    "exp": Math.floor(date.getTime() / 1000) + 300,
    "jti": "redox" + new Date().getTime(),
    "scopes": []
});

const client_assertion = jws.JWS.sign(alg, header, payload, secret);

const requestObject = {
    grant_type: 'client_credentials',
    client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
    client_assertion: client_assertion,
    client_id: client_id,
    alg: 'RS384',
    kid: client_id,
    typ: 'JWT'
};

axios({
    method: 'post',
    url: `https://testapi.redoxengine.com/v2/auth/token`,
    data: qs.stringify(requestObject),
    headers: {
        "Content-Type": "application/x-www-form-urlencoded"
    }
}).then((res) => {
    try {
        const { data: { access_token } } = res;

        console.log('Updating client_assertion in .env at', new Date());
        fs.writeFileSync('.env', 
`client_assertion=${client_assertion}
access_token=${access_token}`);

    }
    catch (err) {
        console.log('caught error processing get token results');
        console.log(`err=[${err}]`);
    }
})
.catch(err => {
    console.log(`Got error=${JSON.stringify(err)}`);
});