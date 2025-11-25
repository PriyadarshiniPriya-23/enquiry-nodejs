// src/utils/jwt.js
const { SignJWT, jwtVerify } = require('jose');
const dotenv = require('dotenv');
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me';
const ALGO = process.env.JWT_ALG || 'HS256'; // jose needs an alg; HS256 is standard for HMAC
const encoder = new TextEncoder();
const secretKey = encoder.encode(SECRET);

async function signToken(payload = {}, expiresIn = '7d') {
  const now = Math.floor(Date.now() / 1000);
  let exp = now + 7 * 24 * 3600;
  if (typeof expiresIn === 'string') {
    if (expiresIn.endsWith('d')) exp = now + parseInt(expiresIn) * 24 * 3600;
    if (expiresIn.endsWith('h')) exp = now + parseInt(expiresIn) * 3600;
    if (expiresIn.endsWith('m')) exp = now + parseInt(expiresIn) * 60;
  }
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: ALGO })
    .setIssuedAt(now)
    .setExpirationTime(exp)
    .sign(secretKey);
  return jwt;
}

async function verifyToken(token) {
  const { payload } = await jwtVerify(token, secretKey, { algorithms: [ALGO] });
  console.log(payload)
  return payload;
}

module.exports = { signToken, verifyToken };
