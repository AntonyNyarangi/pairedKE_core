const { close } = require("inspector");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);

var donorPool;
var patientPool;
var closedChain = [];
var closedChains = [];
var dominoChain = [];

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
      console.log(donorPool.length, patientPool.length, "initial pools");

      // get all directed pairs
      var directedMatches = await directedPairExchange();
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
        "pools after directed matching"
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
      console.log(directedMatches.length, "directed matches");
      console.log(longestClosedChain.length, "longest closed chain");
      console.log(donorPool.length, patientPool.length);

      // get all domino chains
      var dominoChain = [];

      return callback({
        directedMatches: directedMatches,
        closedChain: longestClosedChain,
        dominoChain: dominoChain,
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
  // console.log(recipientBloodGroups, "blood groups")
  const matchedPatients = await getPatientsByBloodGroup(
    recipientBloodGroups,
    poolP
  );
  // console.log(matchedPatients, "matched patients")
  var bestMatchArr = [];
  if (matchedPatients.length > 0) {
    bestMatchArr = await filterRecipientSet(donor, matchedPatients);
  }
  // console.log(bestMatchArr, "best match arr")
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
            // console.log(closedChain[0].donorCase.patientID,closedChain[closedChain.length - 1].patientCase.patientID,"comparison")
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
          // console.log("impossible!");
        }
      } else {
        // add back donors and patients to pools
        for (const item of closedChain) {
          poolD.push(item.donor);
          poolP.push(item.patient);
        }
        closedChain = [];
        // console.log("exit reason = no match");
        return;
      }
    } else {
      // console.log("Donor does not belong to a pair");
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

// async function createOpenChain(donor, poolOfDonors) {
//   var pool = poolOfDonors;
//   try {
//     // extract donor case
//     const donorCaseResults = JSON.parse(
//       JSON.stringify(
//         await query(`select * from cases where donorID=${donor.id}`)
//       )
//     );
//     if (donorCaseResults.length === 0) {
//       const donorCase = donorCaseResults[0];

//       var bestMatch = await getDonorRecipient(donor);
//       if (bestMatch) {
//         // extract patient case
//         const bestMatchCase = JSON.parse(
//           JSON.stringify(
//             await query(
//               `select * from cases where patientID=${bestMatch.recipient.id}`
//             )
//           )
//         );
//         const patientCase = bestMatchCase[0];
//         // add pair to chain
//         closedChain.push({
//           donor: donor,
//           patient: bestMatch.recipient,
//           donorCase: donorCase,
//           patientCase: patientCase,
//         });
//         // remove the donor from pool
//         pool = pool.filter((poolDonor) => {
//           return poolDonor.id !== donor.id;
//         });
//         // remove patient from pool
//         patientPool = patientPool.filter((poolPatient) => {
//           return poolPatient.id !== bestMatch.recipient.id;
//         });

//         if (closedChain.length > 0) {
//           if (bestMatch.recipient.id === closedChain[0].donorCase.patientID) {
//             // console.log(closedChain[0].donorCase.patientID,closedChain[closedChain.length - 1].patientCase.patientID,"comparison")
//             console.log("loop closed");
//             closedChains.push(closedChain);
//             closedChain = [];
//             return;
//           }
//         }

//         var patientDonor = pool.find((poolDonor) => {
//           return poolDonor.id === patientCase.donorID;
//         });
//         if (patientDonor) {
//           await createClosedChain(patientDonor, pool);
//         } else {
//           console.log("impossible!");
//         }
//       } else {
//         // add back donors and patients to pools
//         for (const item of closedChain) {
//           pool.push(item.donor);
//           patientPool.push(item.patient);
//         }
//         closedChain = [];
//         console.log("exit reason = no match");
//         return;
//       }
//     } else {
//       console.log("Donor does not belong to a pair");
//       for (const item of closedChain) {
//         pool.push(item.donor);
//         patientPool.push(item.patient);
//       }
//       closedChain = [];
//       return;
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   for (const item of closedChain) {
//     pool.push(item.donor);
//     patientPool.push(item.patient);
//   }
//   closedChain = [];
// }

function getPatientsByBloodGroup(bloodGroups, poolP) {
  // console.log(patientPool,"patientpool")
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
