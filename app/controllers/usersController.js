const passport = require("passport");
let Users = require("../models/usersModel");
const jwt = require("../utils/jwt");

exports.getAllUsers = function (req, res) {
  Users.getAllUsers(function (err, users) {
    if (err) {
      res.send(err);
      console.log("res: ", err);
    }
    res.send(users);
  });
};

exports.registerUser = function (req, res) {
  let newUser = new Users(req.body);
  Users.registerUser(newUser, function (err, user) {
    if (err) {
      res.send(err);
      console.log("res: ", user);
    }
    res.json(user);
  });
};

exports.getUserByID = function (req, res) {
  Users.getUserByID(req.params.userID, function (err, user) {
    if (err) {
      res.send(err);
      console.log("res: ", user);
    }
    res.json(user);
  });
};

exports.updateUserByID = function (req, res) {
  console.log(req.params.userID)
  var userDetails = req.body.userDetails;
  delete userDetails.id;
  Users.updateUserByID(userDetails, req.params.userID, function (
    err,
    user
  ) {
    if (err) {
      res.send(err);
      console.log("res: ", user);
    }
    res.json(user);
  });
};

exports.removeUserByID = function (req, res) {
  Users.removeUserByID(req.params.userID, function (err, user) {
    if (err) {
      res.send(err);
      console.log(user);
    }
    res.json(user);
  });
};

exports.login = async (req, res, next) => {
  // console.log("login cred: ", req.body);
  try {
    await passport.authenticate(
      "local",
      { failureRedirect: "/login" },
      (err, user, info) => {
        var message = info.message;
        if (!message) {
          res.status(401).send();
        }
        if (!user) {
          res.status(401).send({ message, user });
        } else {
          connection.query(
            `select officialName as healthFacility_officialName, facilityType, county, constituency, subCounty, ward, locationLat, locationLng, mflCode from health_facilities where health_facilities.id=${user.healthFacilityID}`,
            function (err, facilities) {
              if (err) {
                console.log(err);
              } else {
                console.log(facilities);
                var healthFacility = JSON.parse(JSON.stringify(facilities[0]));
                delete user.password;
                user.healthFacility = healthFacility;
                var token = jwt.sign(user);
                console.log(jwt.verify(token));
                res.status(200).send({ message, token });
              }
            }
          );
        }
      }
    )(req, res, next);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
  // Users.login(req.query.username, req.query.password, function(err, user) {
  //   if (err) {
  //     res.status(401).send(err);
  //     console.log(user);
  //   }
  //   res.status(200).json(user);
  // });
};

exports.logout = function (req, res) {
  Users.logout(req.body.userID, function (err, user) {
    if (err) {
      res.send(err);
      console.log(user);
    }
    res.json(user);
  });
};
