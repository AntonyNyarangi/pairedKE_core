let Patients = function(patient) {
  this.bloodType = patient.bloodType;
  this.age = patient.age;
  this.weight = patient.weight;
  this.height = patient.height;
};
Patients.registerPatient = function registerPatient(newPatient, result) {
  connection.query(`insert into patients set ?`, newPatient, function(
    err,
    res
  ) {
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

Patients.getAllPatients = function getAllPatients(result) {
  connection.query(`select * from patients`, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("patients: ", res);
      result(null, res);
    }
  });
};

Patients.getPatientByID = function getPatientByID(patientID, result) {
  connection.query(`select * from patients where id = ?`, patientID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("patient: ", res);
      result(null, res);
    }
  });
};

Patients.updatePatientByID = function updatePatientByID(
  patient,
  patientID,
  result
) {
  connection.query(
    `update patients set ? where id = ` + patientID,
    patient,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("updated patient: ", res);
        result(null, res);
      }
    }
  );
};

Patients.removePatientByID = function removePatientByID(patientID, result) {
  connection.query(`delete from patients where id = ?`, patientID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("Patient has been deleted");
      res.message = "Patient record has been removed"
      result(null, res);
    }
  });
};

module.exports = Patients;
