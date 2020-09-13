const bcrypt = require("bcrypt");

let Users = function(user) {
  this.firstName = user.firstName;
  this.lastName = user.lastName;
  this.email = user.email;
  this.phoneNumber = user.phoneNumber;
  this.username = user.username;
  this.password = bcrypt.hashSync(user.password, 10);
};

Users.registerUser = function registerUser(newUser, result) {
  connection.query(`insert into users set ?`, newUser, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "User created successfully. Patient ID: " + res.insertId;
      result(null, res.insertId);
    }
  });
};

Users.updateUserByID = function updateUserByID(user, userID, result) {
  connection.query(`update users set ? where id = ` + userID, user, function(
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
    `select id, firstName, lastName,email,phoneNumber,username from users`,
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

Users.login = function login(username, password, result) {
  connection.query(
    `select * from users where username = ? or email = '` + username + "'",
    username,
    function(err, res) {
      if (err) {
        // console.log("error: ", err);
        result(err, null);
      } else {
        console.log(res);

        if (bcrypt.compareSync(password, res[0].password)) {
          delete res[0].password;
          result.message = "User logged in successfully";
          result(null, res);
        } else {
          const message = "Incorrect credentials";
          result(null, message);
        }
      }
    }
  );
};

Users.logout = function logout(userID, result) {};

module.exports = Users;
