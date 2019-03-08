// const express = require("express");
// const router = express.Router();
// let patients = require("../controllers/patientsController");
let donors = require("../controllers/donorsController");
let patients = require("../controllers/patientsController");

module.exports = function(app) {
  // patient Routes
  app
    .route("/api/patients")
    .get(patients.getAllPatients)
    .post(patients.registerPatient);

  app
    .route("/api/patients/:patientID")
    .get(patients.getPatientByID)
    .put(patients.updatePatientByID)
    .delete(patients.removePatientByID);

  // donor routes
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
