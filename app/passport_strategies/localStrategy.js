const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local").Strategy;

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async function (username, password, done) {
      username = username.trim();
      try {
        connection.query(
          `select * from users where username = ? or email = '` +
            username +
            "'" +
            "limit 1",
          username,
          function (err, res) {
            // console.log(res);
            if (err) {
              console.log("error: ", err);
              return done(null, null, { message: "an error occured" });
            } else if (res.length > 0) {
              var user = JSON.parse(JSON.stringify(res[0]));
              if (bcrypt.compareSync(password, user.password)) {
                done(null, user, { message: "logged in successfully" });
              } else {
                done(null, null, { message: "Incorrect Password" });
              }
            } else {
              return done(null, null, { message: "user does not exist" });
            }
          }
        );
      } catch (err) {
        return done(err, null, { message: "an unknown error occured" });
      }
    })
  );
};
