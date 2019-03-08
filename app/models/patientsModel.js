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
      result(null, res.insertId);
    }
    id;
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
  connection.query(
    `select * from patients where id = ?`,
    patientID,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("patient: ", res);
        result(null, res);
      }
    }
  );
};

Patients.updatePatientByID = function updatePatientByID(
  patient,
  patientID,
  result
) {
  connection.query(
    `update patients set patient = ? where id = ?`,
    patient,
    patientID,
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
      console.log("patient has been deleted");
      result(null, res);
    }
  });
};

module.exports = Patients;
