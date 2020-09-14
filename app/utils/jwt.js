const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
// const privateKey = fs.readFileSync("./private.key", "utf8");
// const publicKey = fs.readFileSync("./public.key", "utf8");
const privateKey = fs.readFileSync(
  path.join(__dirname, "../../rsa_private.key"),
  "utf8"
);
const publicKey = fs.readFileSync(path.join(__dirname, "../../rsa_public.key"), "utf8");
const options = {
  issuer: "PairedKE",
  // subject: options.subject,
  // audience: options.audience,
  expiresIn: "1h",
  algorithm: "RS256"
};

module.exports = {
  sign: payload => {
    return jwt.sign(payload, privateKey, options);
  },
  verify: token => {
    try {
      return jwt.verify(token, publicKey, options);
    } catch (err) {
      console.log(err);
      return false;
    }
  },
  decode: token => {
    return jwt.decode(token, { complete: true });
  }
};