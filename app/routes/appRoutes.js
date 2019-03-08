// const express = require("express");
// const router = express.Router();
// let patients = require("../controllers/patientsController");
let donors = require("../controllers/donorsController");

// // patient Routes
// router
//   .route("/patients")
//   .get(patients.getAllPatients)
//   .post(patients.registerPatient);

// router
//   .route("/patients/:patientID")
//   .get(patients.getPatientByID)
//   .put(patients.updatePatientByID)
//   .delete(patients.removePatientByID);

// donor routes

module.exports = function(app) {
  app
    .route("/api/donors")
    .get(donors.getAllDonors)
    .post(donors.registerDonor);

  app
    .route("/api/donors/:donorID")
    .get(donors.getDonorByID)
    .put(donors.updateDonorByID)
    .delete(donors.removeDonorByID);
};

// module.exports = router;
// };
