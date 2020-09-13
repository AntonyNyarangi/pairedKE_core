let donors = require("../controllers/donorsController");
let patients = require("../controllers/patientsController");
let users = require("../controllers/usersController");
let health_facilities = require("../controllers/health_facilitiesController");
let cases = require("../controllers/casesController");

module.exports = function(app) {
  // health facility Routes
  app
    .route("/api/health_facilities")
    .get(health_facilities.getAllFacilities)
    .post(health_facilities.registerHealthFacility);

  app
    .route("/api/health_facilities/:facilityID")
    .get(health_facilities.getFacilityByID)
    .put(health_facilities.updateFacilityByID)
    .delete(health_facilities.removeFacilityByID);

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
  app.route("/api/donors/getMatches/:donorID").get(donors.getDonorMatchesByID);
  
  // case routes
  app
    .route("/api/cases")
    .get(cases.getAllCases)
    .post(cases.createCase);

  app
    .route("/api/cases/:caseID")
    .get(cases.getCaseByID)
    .put(cases.updateCaseByID)
    .delete(cases.removeCaseByID);

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
