const util = require("util");
const query = util.promisify(connection.query).bind(connection);

var donorPool;
var patientPool;

module.exports = {
  ke_chain: async function (callback) {
    try {
      // step 1. get all donors from DB (donor pool)
      donorPool = JSON.parse(
        JSON.stringify(await query(`select * from donors`))
      );

      // step 2. get all patients from DB (patient pool)
      patientPool = JSON.parse(
        JSON.stringify(await query(`select * from patients`))
      );

      // get all directed pairs
      var directedMatches = await directedPairExchange();

      // get all closed chains
      var closedChain = await createClosedChain();

      // get all domino chains
      var dominoChain = [];

      return callback({
        directedMatches: directedMatches,
        closedChain: closedChain,
        dominoChain: dominoChain,
      });
    } catch (err) {
      console.log(err);
    }

    //     return callback(filteredMatches);
  },
};

async function directedPairExchange() {
  var directedMatches = [];
  // loop through the pool and find matching pairs
  for (const donor of donorPool) {
    // get best match
    var bestMatch = getDonorRecipient(donor);
    if (bestMatch) {
      // check if the donor and patient belong to the same case
      const donorCaseResults = JSON.parse(
        JSON.stringify(
          await query(`select * from cases where cases.donorID=${donor.id}`)
        )
      );
      const donorCase = donorCaseResults[0];

      if (donorCase.patientID === bestMatch.recipient.id) {
        directedMatches.push({
          donor: donor,
          patient: bestMatch.recipient,
          donorCase: donorCase,
          patientCase: donorCase,
        });

        // remove the donor from pool
        donorPool = donorPool.filter((donor) => {
          return donor.id !== donor.id;
        });

        // remove patient from pool
        patientPool = patientPool.filter((patient) => {
          return patient.id !== bestMatch.recipient.id;
        });
      }
    }
  }
  return directedMatches;
}

function getDonorRecipient(donor) {
  const recipientBloodGroups = getRecipientBloodGroups(donor.bloodType);
  const matchedPatients = getPatientsByBloodGroup(recipientBloodGroups);
  const bestMatchArr = filterRecipientSet(donor, matchedPatients);
  if (bestMatchArr.length > 0) {
    return bestMatchArr[0];
  } else return false;
}

async function createClosedChain() {
  var closedChain = [];
  // for each donor in the pool, get best match
  for (const donor of donorPool) {
    // extract donor case
    const donorCaseResults = JSON.parse(
      JSON.stringify(
        await query(`select * from cases where cases.donorID=${donor.id}`)
      )
    );
    if (donorCaseResults.length > 0) {
      const donorCase = donorCaseResults[0];
      // get best match
      var bestMatch = getDonorRecipient(donor);
      if (bestMatch) {
        // extract patient case
        const bestMatchCase = JSON.parse(
          JSON.stringify(
            await query(
              `select * from cases where cases.patientID=${bestMatch.recipient.id}`
            )
          )
        );
        const patientCase = bestMatchCase[0];

        // add to chain
        closedChain.push({
          donor: donor,
          patient: bestMatch.recipient,
          donorCase: donorCase,
          patientCase: patientCase,
        });

        // remove the donor from pool
        donorPool = donorPool.filter((donor) => {
          return donor.id !== donor.id;
        });
        // remove patient from pool
        patientPool = patientPool.filter((patient) => {
          return patient.id !== bestMatch.recipient.id;
        });
      }
    }
  }
  return closedChain;
}

async function createOpenChain() {}

function getPatientsByBloodGroup(bloodGroups) {
  return patientPool.filter((patient) => {
    for (bloodGroup of bloodGroups) {
      return patient.bloodType === bloodGroup;
    }
  });
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
      distance: distances[i],
    });
  }

  // sort recipients set & limit number to 3
  recipientDistaceSet = sortRecipientSet(recipientDistaceSet);

  // return recipients set
  return recipientDistaceSet.slice(0, 1);
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
