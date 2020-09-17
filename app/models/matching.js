const { close } = require("inspector");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

var donorPool;
var patientPool;
var closedChain = [];
var closedChains = [];
var dominoChain = [];
var dominoChains = [];
var altruisticDonorPool = [];

module.exports = {
  ke_chain: async function (callback) {
    console.log(new Date().toISOString());
    try {
      // step 1. get all donors from DB (donor pool)
      donorPool = JSON.parse(
        JSON.stringify(await query(`select * from donors where isAltruistic=0`))
      );

      // step 2. get all patients from DB (patient pool)
      patientPool = JSON.parse(
        JSON.stringify(await query(`select * from patients`))
      );

      altruisticDonorPool = JSON.parse(
        JSON.stringify(await query(`select * from donors where isAltruistic=1`))
      );

      console.log(
        donorPool.length,
        patientPool.length,
        altruisticDonorPool.length,
        "initial pools size"
      );

      // get all directed pairs
      var directedMatches = await directedPairExchange();

      console.log(directedMatches.length, "directed matches");

      for (const donorPair of directedMatches) {
        // remove the donor from pool
        donorPool = donorPool.filter((poolDonor) => {
          return poolDonor.id !== donorPair.donor.id;
        });

        // remove patient from pool
        patientPool = patientPool.filter((poolPatient) => {
          return poolPatient.id !== donorPair.patient.id;
        });
      }
      console.log(
        donorPool.length,
        patientPool.length,
        altruisticDonorPool.length,
        "pools size after directed matching"
      );

      // get longest closed chain
      for (const donor of donorPool) {
        await createClosedChain(donor, donorPool, patientPool);
      }

      var longestClosedChain = [];
      for (const chain of closedChains) {
        if (chain.length > longestClosedChain.length) {
          longestClosedChain = chain;
        }
      }
      for (const donorPair of longestClosedChain) {
        // remove the donor from pool
        donorPool = donorPool.filter((poolDonor) => {
          return poolDonor.id !== donorPair.donor.id;
        });

        // remove patient from pool
        patientPool = patientPool.filter((poolPatient) => {
          return poolPatient.id !== donorPair.patient.id;
        });
      }

      console.log(longestClosedChain.length, "longest closed chain");
      console.log(
        donorPool.length,
        patientPool.length,
        altruisticDonorPool.length,
        "pools size after closed chaining"
      );

      // get all domino chains

      // get altruistic donors from db
      // step 2. get all patients from DB (patient pool)

      var longestDominoChain = [];
      for (const donor of altruisticDonorPool) {
        await createDominoChain(donor, donorPool, patientPool);
      }

      for (chain of dominoChains) {
        if (chain.length > longestDominoChain.length) {
          longestDominoChain = chain;
        }
      }

      if (longestDominoChain.length > 0) {
        // remove the altruistic donor from pool
        altruisticDonorPool = altruisticDonorPool.filter((poolDonor) => {
          return poolDonor.id !== longestDominoChain[0].donor.id;
        });
        // remove donors and patients from respective pools
        for (let i = 0; i < longestDominoChain.length; i++) {
          // remove the donor from pool
          donorPool = donorPool.filter((poolDonor) => {
            return poolDonor.id !== longestDominoChain[i].donor.id;
          });

          // remove patient from pool
          patientPool = patientPool.filter((poolPatient) => {
            return poolPatient.id !== longestDominoChain[i].patient.id;
          });
        }
      }

      console.log(longestDominoChain.length, "longest domino chain");
      console.log(
        donorPool.length,
        patientPool.length,
        altruisticDonorPool.length,
        "pools size after domino chaining"
      );

      console.log(new Date().toISOString());
      
      return callback({
        directedMatches: directedMatches,
        closedChain: longestClosedChain,
        dominoChain: longestDominoChain,
      });
    } catch (err) {
      console.log(err);
    }

    //     return callback(filteredMatches);
  },
};

async function directedPairExchange() {
  try {
    var directedMatches = [];
    // loop through the pool and find matching pairs
    for (const donor of donorPool) {
      // get best match
      var bestMatch = await getDonorRecipient(donor, patientPool);
      if (bestMatch) {
        // check if the donor and patient belong to the same case
        const donorCaseResults = JSON.parse(
          JSON.stringify(
            await query(`select * from cases where cases.donorID=${donor.id}`)
          )
        );
        if (donorCaseResults.length > 0) {
          const donorCase = donorCaseResults[0];

          if (donorCase.patientID === bestMatch.recipient.id) {
            directedMatches.push({
              donor: donor,
              patient: bestMatch.recipient,
              donorCase: donorCase,
              patientCase: donorCase,
            });

            // remove the donor from pool
            donorPool = donorPool.filter((poolDonor) => {
              return poolDonor.id !== donor.id;
            });

            // remove patient from pool
            patientPool = patientPool.filter((poolPatient) => {
              return poolPatient.id !== bestMatch.recipient.id;
            });
          }
        }
      }
    }
    return directedMatches;
  } catch (err) {
    console.log(err);
  }
}

async function getDonorRecipient(donor, poolP) {
  const recipientBloodGroups = await getRecipientBloodGroups(donor.bloodType);
  const matchedPatients = await getPatientsByBloodGroup(
    recipientBloodGroups,
    poolP
  );
  var bestMatchArr = [];
  if (matchedPatients.length > 0) {
    bestMatchArr = await filterRecipientSet(donor, matchedPatients);
  }
  if (bestMatchArr.length > 0) {
    return bestMatchArr[0];
  } else return false;
}

async function createClosedChain(donor, poolOfDonors, poolOfPatients) {
  var poolD = poolOfDonors;
  var poolP = poolOfPatients;

  try {
    // extract donor case
    const donorCaseResults = JSON.parse(
      JSON.stringify(
        await query(`select * from cases where donorID=${donor.id}`)
      )
    );
    if (donorCaseResults.length > 0) {
      const donorCase = donorCaseResults[0];

      var bestMatch = await getDonorRecipient(donor, poolP);
      if (bestMatch) {
        // extract patient case
        const bestMatchCase = JSON.parse(
          JSON.stringify(
            await query(
              `select * from cases where patientID=${bestMatch.recipient.id}`
            )
          )
        );
        const patientCase = bestMatchCase[0];
        // add pair to chain
        closedChain.push({
          donor: donor,
          patient: bestMatch.recipient,
          donorCase: donorCase,
          patientCase: patientCase,
        });
        // remove the donor from pool
        poolD = poolD.filter((poolDonor) => {
          return poolDonor.id !== donor.id;
        });
        // remove patient from pool
        poolP = poolP.filter((poolPatient) => {
          return poolPatient.id !== bestMatch.recipient.id;
        });

        if (closedChain.length > 0) {
          if (bestMatch.recipient.id === closedChain[0].donorCase.patientID) {
            closedChains.push(closedChain);
            closedChain = [];
            return;
          }
        }

        var patientDonor = poolD.find((poolDonor) => {
          return poolDonor.id === patientCase.donorID;
        });
        if (patientDonor) {
          await createClosedChain(patientDonor, poolD, poolP);
        } else {
          console.log("something bad happened");
        }
      } else {
        // add back donors and patients to pools
        for (const item of closedChain) {
          poolD.push(item.donor);
          poolP.push(item.patient);
        }
        closedChain = [];
        return;
      }
    } else {
      for (const item of closedChain) {
        poolD.push(item.donor);
        poolP.push(item.patient);
      }
      closedChain = [];
      return;
    }
  } catch (err) {
    console.log(err);
  }
  for (const item of closedChain) {
    poolD.push(item.donor);
    poolP.push(item.patient);
  }
  closedChain = [];
}

async function createDominoChain(donor, poolOfDonors, poolOfPatients) {
  var poolD = poolOfDonors;
  var poolP = poolOfPatients;

  // if donor is not altruistic, get donor case
  var donorCase = {};
  if (donor.isAltruistic === 0) {
    // extract donor case
    const donorCaseResults = JSON.parse(
      JSON.stringify(
        await query(`select * from cases where donorID=${donor.id}`)
      )
    );
    donorCase = donorCaseResults[0];
  }

  var bestMatch = await getDonorRecipient(donor, poolP);
  if (bestMatch) {
    // extract patient case
    const bestMatchCase = JSON.parse(
      JSON.stringify(
        await query(
          `select * from cases where patientID=${bestMatch.recipient.id}`
        )
      )
    );

    const patientCase = bestMatchCase[0];
    // add pair to chain
    dominoChain.push({
      donor: donor,
      patient: bestMatch.recipient,
      donorCase: donorCase,
      patientCase: patientCase,
    });

    // if (dominoChain.length === 1) {
    //   // remove the donor from ALTRUISTIC pool
    //   altruisticDonorPool = altruisticDonorPool.filter((poolDonor) => {
    //     return poolDonor.id !== donor.id;
    //   });
    //   // remove patient from pool
    //   poolP = poolP.filter((poolPatient) => {
    //     return poolPatient.id !== dominoChain[0].patient.id;
    //   });
    // } else {

    // remove the donor from pool
    poolD = poolD.filter((poolDonor) => {
      return poolDonor.id !== donor.id;
    });
    // remove patient from pool
    poolP = poolP.filter((poolPatient) => {
      return poolPatient.id !== bestMatch.recipient.id;
    });
    // }

    // get patient Donor
    var patientDonor = poolD.find((donor) => {
      return donor.id === patientCase.donorID;
    });
    await createDominoChain(patientDonor, poolD, poolP); //continue creating the chain
  } else {
    dominoChains.push(dominoChain);
    dominoChain = [];
    return;
  }
}

function getPatientsByBloodGroup(bloodGroups, poolP) {
  return poolP.filter((patient) => {
    for (const bloodGroup of bloodGroups) {
      if (patient) {
        return patient.bloodType === bloodGroup;
      }
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