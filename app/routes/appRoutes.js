let donors = require("../controllers/donorsController");
let patients = require("../controllers/patientsController");
let users = require("../controllers/usersController");

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
  // user routes
  app
    .route("/api/users")
    .get(users.getAllUsers)
    .post(users.registerUser);
  app
    .route("/api/users/:userID")
    .get(users.getUserByID)
    .put(users.updateUserByID)
    .delete(users.removeUserByID);
  app.route("/api/users/login/").post(users.login);
  app.route("/api/users/logout/:userID").post(users.logout);
};
