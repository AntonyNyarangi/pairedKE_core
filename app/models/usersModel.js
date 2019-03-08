Users.registerUser = function registerUser(user, result) {
  connection.query(`insert into users set ?`, newUser, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      result(null, res.insertId);
    }
    id;
  });
};

Users.updateUserByID = function updateUserByID(user, userID, result) {
  connection.query(
    `update users set user = ? where id = ?`,
    user,
    userID,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("updated user: ", res);
        result(null, res);
      }
    }
  );
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
      result(null, res);
    }
  });
};

Users.getUserByID = function getUserByID(userID, result) {
  connection.query(`select user from users where id = ?`, userID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("user: ", res);
      result(null, res);
    }
  });
};

Users.getAllUsers = function getAllUsers(result) {
  connection.query(`select * from users`, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("users: ", res);
      result(null, res);
    }
  });
};

// Users.removeAllUsers = function removeAllUsers(result) {};
Users.login = function login(username, email, password, result) {};
Users.logout = function logout(userID, result) {};
