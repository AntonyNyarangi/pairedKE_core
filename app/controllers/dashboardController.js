const util = require("util");
const query = util.promisify(connection.query).bind(connection);

exports.getData = async function (req, res) {
  try {
    const activeNonAltruisticDonorsCount = await query(
      `select count(*) as activeNonAltruisticDonorsCount from donors where isAltruistic=0 and isMatched=0`
    );
    const activeAltruisticDonorsCount = await query(
      `select count(*) as activeAltruisticDonorsCount from donors where isAltruistic=1 and isMatched=0`
    );
    const activePatientsCount = await query(
      `select count(*) as activePatientsCount from patients where isMatched=0`
    );
    const healthFacilityCount = await query(
      `select count(*) as healthFacilityCount from health_facilities`
    );
    const totalMatches = await query(
      `select count(*) as totalMatches from patients where isMatched=1`
    );
    const matchesByMatchingRun = await query(
      `select distinct * from (select count(directed_matches.id) as directedMatches from matching_runs join directed_matches on matching_runs.id=directed_matches.matchingRunID group by matching_runs.date) as directedMatchesCount, (select count(closed_matches.id) as closedMatches from matching_runs join closed_matches on matching_runs.id = closed_matches.matchingRunID group by matching_runs.date) as closedMatchesCount,(select count(domino_matches.id) as dominoMatches from matching_runs join domino_matches on matching_runs.id=domino_matches.matchingRunID group by matching_runs.date) as dominoMatchesCount, matching_runs group by date;`
    );
    const topReferrals = await query(
      `select health_facilities.officialName, count( distinct cases.id) as caseCount from health_facilities inner join cases on cases.healthFacilityID=health_facilities.id group by health_facilities.officialName order by caseCount desc limit 10`
    );
    const openCases = await query(
      `select count(*) as openCases from cases inner join patients on cases.patientID=patients.id inner join donors on cases.donorID=donors.id inner join health_facilities on cases.healthFacilityID=health_facilities.id where patients.isMatched=0 and donors.isMatched=0`
    );
    const closedCases = await query(
      `select count(*) as closedCases from cases inner join patients on cases.patientID=patients.id inner join donors on cases.donorID=donors.id inner join health_facilities on cases.healthFacilityID=health_facilities.id where patients.isMatched=1 and donors.isMatched=1`
    );
    const pendingCases = await query(
      `select count(*) as pendingCases from cases inner join patients on cases.patientID=patients.id inner join donors on cases.donorID=donors.id inner join health_facilities on cases.healthFacilityID=health_facilities.id where patients.isMatched=1 and donors.isMatched=0`
    );
    res.status(200).json({
      activeNonAltruisticDonorsCount:
        activeNonAltruisticDonorsCount[0].activeNonAltruisticDonorsCount,
      activeAltruisticDonorsCount:
        activeAltruisticDonorsCount[0].activeAltruisticDonorsCount,
      activePatientsCount: activePatientsCount[0].activePatientsCount,
      healthFacilityCount: healthFacilityCount[0].healthFacilityCount,
      totalMatches: totalMatches[0].totalMatches,
      matchesByMatchingRun: matchesByMatchingRun,
      topReferrals,
      openCases:openCases[0].openCases,
      closedCases:closedCases[0].closedCases,
      pendingCases:pendingCases[0].pendingCases      

    });
  } catch (err) {
    res.status(500).send(err);
  }

  // Donors.removeDonorByID(req.params.donorID, function (err, donor) {
  //   if (err) {
  //     res.send(err);
  //   }
  //   res.json(donor);
  // });
};
