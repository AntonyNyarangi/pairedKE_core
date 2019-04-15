module.exports = {
  bloodGroup: function(donorID, callback) {
    matchedPatients = [];
    connection.query(
      `select bloodType from donors where id = ?`,
      donorID,
      function(err, res) {
        if (err) throw err;
        console.log(res[0].bloodType);
        let recepientBloodGroups = getRecipientBloodGroups(res[0].bloodType);
        console.log("recipient bloodgroups", recepientBloodGroups);
        getPatientsByBloodGroup(recepientBloodGroups, function(res) {
          matchedPatients = res;
          console.log("response", matchedPatients);
          return callback(matchedPatients);
        });
      }
    );
  }
};

function getPatientsByBloodGroup(bloodGroups, callback) {
  queryParameters = `"${bloodGroups[0]}"`;
  for (i = 1, length = bloodGroups.length; i < length; i++) {
    queryParameters = queryParameters + ` or bloodType = "${bloodGroups[i]}"`;
  }
  console.log(queryParameters);
  connection.query(
    `select * from patients where bloodType = ${queryParameters}`,
    function(err, res) {
      if (err) throw err;
      return callback(res);
    }
  );
}

function getRecipientBloodGroups(donorBloodGroup) {
  switch (donorBloodGroup) {
    case "A":
      recipientBloodGroups = ["A", "AB"];
      break;
    case "B":
      recipientBloodGroups = ["B", "AB"];
      break;
    case "AB":
      recipientBloodGroups = ["AB"];
      break;
    case "O":
      recipientBloodGroups = ["A", "B", "AB", "O"];
      break;
  }
  return recipientBloodGroups;
}
