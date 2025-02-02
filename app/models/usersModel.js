const bcrypt = require("bcrypt");
const passport = require("passport");
const transporter = require("./../utils/mail").transporter();


let Users = function(user) {
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.phoneNumber = user.phoneNumber;
  this.username = user.username;
  this.healthFacilityID = user.healthFacilityID;
  this.password = bcrypt.hashSync(user.password, 10);
  this.isAdmin = user.isAdmin || false;
  this.isEnabled = false;
  this.isVerified = false;
};

Users.registerUser = function registerUser(newUser, result) {
  connection.query(`insert into users set ?`, newUser, async function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "User created successfully. User ID: " + res.insertId;

      var mailOptions = {
        from: process.env.SMTP_USER,
        to: newUser.email,
        subject: "Account Created Successfully",
        text: `Hello ${newUser.firstName} ${newUser.lastName} we have successfully created your account on Paired Kidney Exchange.`,
        template: "new_account",
        context: {
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email:newUser.email
        },
      };
      result(null, {message:res.message, id:res.insertId});
    }
  });
};

Users.updateUserByID = function updateUserByID(user, userID, result) {
  console.log(user)
  connection.query(`update users set ? where id = ${userID}`, user, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("updated user: ", res);
      result(null, res);
    }
  });
};

Users.removeUserByID = function removeUserByID(userID, result) {
  connection.query(`delete from users where id = ?`, userID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("user has been deleted");
      res.message = "User record has been removed";
      result(null, res);
    }
  });
};

Users.getUserByID = function getUserByID(userID, result) {
  connection.query(
    `select id, firstName, lastName,email,phoneNumber,username from users where id = ?`,
    userID,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("user: ", res);
        result(null, res);
      }
    }
  );
};

Users.getAllUsers = function getAllUsers(result) {
  connection.query(
    `select users.id, users.firstName, users.lastName,users.email,users.phoneNumber,users.username, users.isAdmin, users.isEnabled,health_facilities.officialName as healthFacility from users join health_facilities on users.healthFacilityID=health_facilities.id order by users.id`,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("users: ", res);
        result(null, res);
      }
    }
  );
};

Users.logout = function logout(userID, result) {};

module.exports = Users;
