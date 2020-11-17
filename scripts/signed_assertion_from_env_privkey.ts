const fs = require('fs');
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
const x = privateKEY.x; // x value for EC
const y = privateKEY.y; // y value for EC
const crv = privateKEY.crv; // cryptographic curve used with the key
const k = privateKEY.k; // hmac secret

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

const signed_assertion = jws.JWS.sign(alg, header, payload, secret);


fs.writeFileSync('./signed_assertion', signed_assertion);

const settingsContents = fs.readFileSync('./.vscode/settings.json');
const settings = JSON.parse(settingsContents);
settings["rest-client.environmentVariables"].$shared.client_assertion = signed_assertion;
console.log(JSON.stringify(settings, null, 2));
fs.writeFileSync('./.vscode/settings.json', JSON.stringify(settings, null, 2));