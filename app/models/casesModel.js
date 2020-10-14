// let Patients = require("../models/patientsModel");

const Patients = require("./patientsModel");

// let Donors = require("../models/donorsModel");
let Cases = function (caseData) {
  (this.healthFacilityID = caseData.healthFacilityID),
    (this.doctorName = caseData.doctorName),
    (this.caseDescription = caseData.caseDescription),
    (this.doctorEmail = caseData.doctorEmail),
    (this.doctorPhoneNumber = caseData.doctorPhoneNumber),
    (this.patientID = caseData.patientID),
    (this.donorID = caseData.donorID),
    (this.isActive = true);
};

Cases.createCase = function createCase(newCase, result) {
  connection.query(`insert into cases set ?`, newCase, function (err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      res.message = "Case created successfully. case ID: " + res.insertId;
      result(null, res.message);
    }
  });
};

Cases.getAllCases = function getAllCases(params, result) {
  console.log(params.state);
  connection.query(
    `select *, cases.id as caseID, patients.isMatched as patientMatched, donors.isMatched as donorMatched from cases inner join patients on cases.patientID=patients.id inner join donors on cases.donorID=donors.id inner join health_facilities on cases.healthFacilityID=health_facilities.id ${
      Object.keys(params).length > 0
        ? `where ${
            params.state === "1"
              ? `patients.isMatched=1 AND donors.isMatched=1`
              : params.state === "2"
              ? `patients.isMatched=1 AND donors.isMatched=0`
              : params.state === "3"
              ? `patients.isMatched=0 AND donors.isMatched=0`
              : ``
          }`
        : ``
    }`,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("cases: ", res);
        result(null, res);
      }
    }
  );
};

Cases.getCaseByID = function getCaseByID(caseID, result) {
  connection.query(`select * from cases where id = ?`, caseID, function (
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("case: ", res);
      result(null, res);
    }
  });
};

Cases.updateCaseByID = function updateCaseByID(updatedCase, caseID, result) {
  connection.query(
    `update cases set ? where id = ` + caseID,
    updatedCase,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("updated case: ", res);
        result(null, res);
      }
    }
  );
};

Cases.removeCaseByID = function removeCaseByID(caseID, result) {
  connection.query(`delete from cases where id = ?`, caseID, function (
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("Case has been deleted");
      res.message = "Case record has been removed";
      result(null, res);
    }
  });
};

module.exports = Cases;
