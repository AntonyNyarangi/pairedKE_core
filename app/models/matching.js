module.exports = {
  bloodGroup: function(donorID, callback) {
    matchedPatients = [];
    connection.query(`select * from donors where id = ?`, donorID, function(
      err,
      res
    ) {
      if (err) throw err;
      // console.log(res[0].bloodType);
      donor = res[0];
      let recepientBloodGroups = getRecipientBloodGroups(donor.bloodType);
      console.log("recipient bloodgroups", recepientBloodGroups);
      getPatientsByBloodGroup(recepientBloodGroups, function(res) {
        matchedPatients = res;
        filteredMatches = filterRecipientSet(donor, matchedPatients);
        // console.log("Response", filteredMatches);
        return callback(filteredMatches);
      });
    });
  }
};

function getPatientsByBloodGroup(bloodGroups, callback) {
  queryParameters = `"${bloodGroups[0]}"`;
  for (i = 1, length = bloodGroups.length; i < length; i++) {
    queryParameters = queryParameters + ` or bloodType = "${bloodGroups[i]}"`;
  }
  // console.log(queryParameters);
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

// using nearest neighbors algorithm to filter the recipient set i.e evaluate the best matches.
function filterRecipientSet(donor, recipientSet) {
  distances = [];
  recipientDistaceSet = [];

  // calculate distances
  for (i = 0; i < recipientSet.length; i++) {
    distances.push(calculateDistance(donor, recipientSet[i]));
  }

  // attach distance to recipient
  for (i = 0; i < recipientSet.length; i++) {
    recipientDistaceSet.push({
      recipient: recipientSet[i],
      distance: distances[i]
    });
  }

  // sort recipients set & limit number to 3
  recipientDistaceSet = sortRecipientSet(recipientDistaceSet);

  // return recipients set
  return recipientDistaceSet.slice(0, 3);
}

function calculateDistance(donor, recipient) {
  // console.log("donor", donor);
  // console.log("recipient", recipient);
  distance = Math.sqrt(
    Math.pow(donor.age - recipient.age, 2) +
      Math.pow(donor.weight - recipient.weight, 2) +
      Math.pow(donor.height - recipient.height, 2)
  );
  return distance;
}

function sortRecipientSet(recipientDistaceSet) {
  recipientDistaceSet.sort((a, b) => (a.distance > b.distance ? 1 : -1));
  return recipientDistaceSet;
}
