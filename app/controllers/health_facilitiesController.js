let HealthFacilities = require("../models/health_facilitiesModel");

exports.getAllFacilities = function(req, res) {
  HealthFacilities.getAllFacilities(function(err, facilities) {
    if (err) {
      res.send(err);
      console.log("res", err);
    }
    res.send(facilities);
  });
};

exports.registerHealthFacility = function(req, res) {
  let newFacility = new HealthFacilities(req.body);
  HealthFacilities.registerHealthFacility(newFacility, function(
    err,
    newFacility
  ) {
    if (err) {
      res.send(err);
    }
    res.json(newFacility);
  });
};

exports.getFacilityByID = function(req, res) {
  HealthFacilities.getFacilityByID(req.params.facilityID, function(err, facility) {
    if (err) {
      res.send(err);
    }
    res.json(facility);
  });
};

exports.updateFacilityByID = function(req, res) {
  HealthFacilities.updateFacilityByID(
    new HealthFacilities(req.body),
    req.params.facilityID,
    function(err, updatedFacility) {
      if (err) {
        res.send(err);
      }
      res.json(updatedFacility);
    }
  );
};

exports.removeFacilityByID = function(req, res) {
  HealthFacilities.removeFacilityByID(req.params.facilityID, function(err, message) {
    if (err) {
      res.send(err);
    }
    res.json(message);
  });
};
