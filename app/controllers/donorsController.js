let Donors = require("../models/donorsModel");
const util = require("util");
const query = util.promisify(connection.query).bind(connection);
var api_key = "d1e382c249085a4f8c45f6ee99a14929-aff2d1b9-54a6e9f6";
var domain = "mg.scalum.co.ke";
var mailgun = require("mailgun-js")({ apiKey: api_key, domain: domain });

exports.registerDonor = function (req, res) {
  let newDonor = new Donors(req.body);
  Donors.registerDonor(newDonor, function (err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.getAllDonors = function (req, res) {
  Donors.getAllDonors(function (err, donors) {
    if (err) {
      res.send(err);
      console.log("res", donors);
    }
    res.send(donors);
  });
};

exports.getAltruistic = async function (req, res) {
  try {
    var altruisticDonors = await query(
      `select * from donors where isAltruistic=1`
    );
    res.send(altruisticDonors);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.getDonorByID = function (req, res) {
  Donors.getDonorByID(req.params.donorID, function (err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.updateDonorByID = function (req, res) {
  Donors.updateDonorByID(new Donors(req.body), req.params.donorID, function (
    err,
    donor
  ) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.removeDonorByID = function (req, res) {
  Donors.removeDonorByID(req.params.donorID, function (err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.getDBMatches = async function (req, res) {
  const directedMatches = await query(`select * from directed_matches where matchingRunID=${req.params.runID}`);
  const closedMatches = await query(`select * from closed_matches where matchingRunID=${req.params.runID}`);
  const dominoMatches = await query(`select * from domino_matches where matchingRunID=${req.params.runID}`);
  res.json({
    directedMatches: directedMatches,
    closedMatches: closedMatches,
    dominoMatches: dominoMatches,
  });
};
exports.getMatches = async function (req, res) {
  Donors.getMatches(async function (matches) {
    const directedMatches = matches.directedMatches;
    const closedMatches = matches.closedChain;
    const dominoMatches = matches.dominoChain;
    for (var i = 0; i < directedMatches.length; i++) {
      try {
        await query(
          `insert into directed_matches set matchingRunID=${matches.matchingRunId},donorID=${directedMatches[i].donor.id},patientID=${directedMatches[i].patient.id},donorCaseID=${directedMatches[i].donorCase.id},patientCaseID=${directedMatches[i].patientCase.id}`
        );
      } catch (err) {
        console.log(err);
      }
    }
    for (var i = 0; i < closedMatches.length; i++) {
      try {
        await query(
          `insert into closed_matches set matchingRunID=${matches.matchingRunId},donorID=${closedMatches[i].donor.id},patientID=${closedMatches[i].patient.id},donorCaseID=${closedMatches[i].donorCase.id},patientCaseID=${closedMatches[i].patientCase.id}`
        );
      } catch (err) {
        console.log(err);
      }
    }
    for (var i = 0; i < dominoMatches.length; i++) {
      try {
        await query(
          `insert into domino_matches set matchingRunID=${
            matches.matchingRunId
          },donorID=${dominoMatches[i].donor.id},patientID=${
            dominoMatches[i].patient.id
          },donorCaseID=${
            dominoMatches[i].donorCase.id
              ? dominoMatches[i].donorCase.id
              : "NULL"
          },patientCaseID=${dominoMatches[i].patientCase.id}`
        );
      } catch (err) {
        console.log(err);
      }
    }
    var data = {
      from: "antony.momanyi@gmail.com",
      to: "antony.momanyi@gmail.com",
      subject: "Matching",
      text: "Matching is complete, you may view the results on the dashboard",
    };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  });
  res.status(200).send({
    message:
      "Matching has started. You will receive an email notification when the process is complete",
  });
};
