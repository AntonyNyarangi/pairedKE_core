// let Patients = require("../models/patientsModel");
// let Donors = require("../models/donorsModel");
let Cases = function(newCase) {
  this.referringDoctorID = newCase.referringDoctorID;
};

Cases.createCase = function createCase(newCase, result) {
  connection.query(`insert into cases set ?`, newCase, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "Case created successfully. case ID: " + res.insertId;
      result(null, res.message);
    }
  });
};

Cases.getAllCases = function getAllCases(result) {
  connection.query(`select * from cases`, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("cases: ", res);
      result(null, res);
    }
  });
};

Cases.getCaseByID = function getCaseByID(caseID, result) {
  connection.query(`select * from cases where id = ?`, caseID, function(
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
    function(err, res) {
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

Cases.removeCaseByID = function removeCaseByID(
  caseID,
  result
) {
  connection.query(
    `delete from cases where id = ?`,
    caseID,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("Case has been deleted");
        res.message = "Case record has been removed";
        result(null, res);
      }
    }
  );
};

module.exports = Cases;
