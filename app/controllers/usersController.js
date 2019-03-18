let Users = require("../models/usersModel");

exports.getAllUsers = function(req, res) {
  Users.getAllUsers(function(err, users) {
    if (err) {
      res.send(err);
      console.log("res: ", err);
    }
    res.send(users);
  });
};

exports.registerUser = function(req, res) {
  let newUser = new Users(req.body);
  Users.registerUser(newUser, function(err, user) {
    if (err) {
      res.send(err);
      console.log("res: ", user);
    }
    res.json(user);
  });
};

exports.getUserByID = function(req, res) {
  Users.getUserByID(req.params.userID, function(err, user) {
    if (err) {
      res.send(err);
      console.log("res: ", user);
    }
    res.json(user);
  });
};

exports.updateUserByID = function(req, res) {
  Users.updateUserByID(new Users(req.body), req.params.userID, function(
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

exports.removeUserByID = function(req, res) {
  Users.removeUserByID(req.params.userID, function(err, user) {
    if (err) {
      res.send(err);
      console.log(user);
    }
    res.json(user);
  });
};

exports.login = function(req, res) {
  console.log("login cred: ",req.query);
  Users.login(req.query.username, req.query.password, function(err, user) {
    if (err) {
      res.send(err);
      console.log(user);
    }
    res.json(user);
  });
};

exports.logout = function(req, res) {
  Users.logout(req.b.userID, function(err, user) {
    if (err) {
      res.send(err);
      console.log(user);
    }
    res.json(user);
  });
};
