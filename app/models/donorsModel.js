let Matching = require("./matching");
let Donors = function(donor) {
  this.bloodType = donor.bloodType;
  this.age = donor.age;
  this.weight = donor.weight;
  this.height = donor.height;
  this.smoker = donor.smoker;
  this.illicitDrugUse = donor.illicitDrugUse;
  this.highBloodPressure = donor.highBloodPressure;
  this.diabetes = donor.diabetes;
  this.historyDiabetes = donor.historyDiabetes;
  this.kidneyDiseasePKD = donor.kidneyDiseasePKD;
  this.kidneyFunction = donor.kidneyFunction;
  this.psychiatricIllness = donor.psychiatricIllness;
  this.heartDisease = donor.heartDisease;
  this.untreatedCancer = donor.untreatedCancer;
  this.historyUntreatedCancer = donor.historyUntreatedCancer;
  this.urineProtein = donor.urineProtein;
  this.infectionHepatitisB = donor.infectionHepatitisB;
  this.infectionHepatitisC = donor.infectionHepatitisC;
  this.infectionHIV = donor.infectionHIV;
  this.medicalInsurance = donor.medicalInsurance;
  this.historyBloodClots = donor.historyBloodClots;
};

Donors.registerDonor = function registerDonor(newDonor, result) {
  connection.query(`insert into donors set ?`, newDonor, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "Patient created successfully. Patient ID: " + res.insertId;
      result(null, res.message);
    }
  });
};

Donors.getAllDonors = function getAllDonors(result) {
  connection.query(`select * from donors`, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("donors: ", res);
      result(null, res);
    }
  });
};

Donors.getDonorByID = function getDonorByID(donorID, result) {
  connection.query(`select * from donors where id = ?`, donorID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("donor: ", res);
      result(null, res);
    }
  });
};

Donors.updateDonorByID = function updateDonorByID(donor, donorID, result) {
  connection.query(
    `update donors set = ? where id = ` + donorID,
    donor,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("updated donor: ", res);
        result(null, res);
      }
    }
  );
};

Donors.removeDonorByID = function removeDonorByID(donorID, result) {
  connection.query(`delete from donors where id = ?`, donorID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("donor has been deleted");
      res.message = "Donor record has been removed";
      result(null, res);
    }
  });
};

Donors.getDonorMatches = async function getDonorMatches(donorID, matchedPatients) {
  Matching.bloodGroup(donorID, function(res) {
    console.log("Sorted Reipients",res);
    matchedPatients(res);
  });
};

module.exports = Donors;
