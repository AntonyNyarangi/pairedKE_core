let Matching = require("./matching");
let Donors = function(donor) {
  this.donorName = donor.donorName,
  this.idNumber = donor.idNumber,
  this.bloodType = donor.bloodType;
  this.age = donor.age;
  this.weight = donor.weight;
  this.height = donor.height;
  this.smoker = donor.smoker;
  this.illicitDrugUse = donor.illicitDrugUse;
  this.highBloodPressure = donor.highBloodPressure;
  this.diabetes = donor.diabetes;
  this.kidneyDiseasePKD = donor.kidneyDiseasePKD;
  this.kidneyFunction = donor.kidneyFunction;
  this.psychiatricIllness = donor.psychiatricIllness;
  this.heartDisease = donor.heartDisease;
  this.untreatedCancer = donor.untreatedCancer;
  this.urineProtein = donor.urineProtein;
  this.infectionHepatitisB = donor.infectionHepatitisB;
  this.infectionHepatitisC = donor.infectionHepatitisC;
  this.infectionHIV = donor.infectionHIV;
  this.medicalInsurance = donor.medicalInsurance;
  this.historyBloodClots = donor.historyBloodClots;
  this.isAltruistic = donor.isAltruistic;
};

Donors.registerDonor = function registerDonor(newDonor, result) {
  connection.query(`insert into donors set ?`, newDonor, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "Patient created successfully.";
      result(null, {message:res.message, id:res.insertId});
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

Donors.getMatches = async function getMatches(matchingResults) {
  Matching.ke_chain(function(res) {
    // console.log("Sorted Recipients",res);
    matchingResults(res);
  });
};

module.exports = Donors;
