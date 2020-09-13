let Patients = require("../models/patientsModel");

exports.registerPatient = function(req, res) {
  let newPatient = new Patients(req.body);
  Patients.registerPatient(newPatient, function(err, patient) {
    if (err) {
      res.send(err);
    }
    res.json(patient);
  });
};

exports.getAllPatients = function(req, res) {
  Patients.getAllPatients(function(err, patients) {
    if (err) {
      res.send(err);
      console.log("res", err);
    }
    res.send(patients);
  });
};

exports.getPatientByID = function(req, res) {
  Patients.getPatientByID(req.params.patientID, function(err, patient) {
    if (err) {
      res.send(err);
    }
    res.json(patient);
  });
};

exports.updatePatientByID = function(req, res) {
  Patients.updatePatientByID(
    new Patients(req.body),
    req.params.patientID,
    function(err, patient) {
      if (err) {
        res.send(err);
      }
      res.json(patient);
    }
  );
};

exports.removePatientByID = function(req, res) {
  Patients.removePatientByID(req.params.patientID, function(err, patient) {
    if (err) {
      res.send(err);
    }
    res.json(patient);
  });
};
