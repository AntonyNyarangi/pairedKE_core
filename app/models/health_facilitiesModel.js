let HealthFacilities = function(facility) {
  this.name = facility.name;
  this.locationLat = facility.locationLat;
  this.locationLng = facility.locationLng;
  this.kephLevel = facility.kephLevel;
  this.mflCode = facility.mflCode;
};
HealthFacilities.registerHealthFacility = function registerHealthFacility(newFacility, result) {
  connection.query(`insert into health_facilities set ?`, newFacility, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log(res.insertId);
      res.message = "Health Facility created successfully. Facility ID: " + res.insertId;
      result(null, res.message);
    }
  });
};

HealthFacilities.getAllFacilities = function getAllFacilities(result) {
  connection.query(`select * from health_facilities`, function(err, res) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("health facilities: ", res);
      result(null, res);
    }
  });
};

HealthFacilities.getFacilityByID = function getFacilityByID(facilityID, result) {
  connection.query(`select * from health_facilities where id = ?`, facilityID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("facility: ", res);
      result(null, res);
    }
  });
};

HealthFacilities.updateFacilityByID = function updateFacilityByID(
  updatedFacility,
  facilityID,
  result
) {
  connection.query(
    `update health_facilities set ? where id = ` + facilityID,
    updatedFacility,
    function(err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("updated facility: ", res);
        result(null, res);
      }
    }
  );
};

HealthFacilities.removeFacilityById = function removeFacilityById(facilityID, result) {
  connection.query(`delete from health_facilities where id = ?`, facilityID, function(
    err,
    res
  ) {
    if (err) {
      console.log("error: ", err);
      result(err, null);
    } else {
      console.log("Facility has been deleted");
      res.message = "Fatient record has been removed";
      result(null, res);
    }
  });
};

module.exports = HealthFacilities;
