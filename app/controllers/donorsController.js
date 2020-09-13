let Donors = require("../models/donorsModel");

exports.registerDonor = function(req, res) {
  let newDonor = new Donors(req.body);
  Donors.registerDonor(newDonor, function(err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.getAllDonors = function(req, res) {
  Donors.getAllDonors(function(err, donors) {
    if (err) {
      res.send(err);
      console.log("res", donors);
    }
    res.send(donors);
  });
};

exports.getDonorByID = function(req, res) {
  Donors.getDonorByID(req.params.donorID, function(err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.updateDonorByID = function(req, res) {
  Donors.updateDonorByID(new Donors(req.body), req.params.donorID, function(
    err,
    donor
  ) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.removeDonorByID = function(req, res) {
  Donors.removeDonorByID(req.params.donorID, function(err, donor) {
    if (err) {
      res.send(err);
    }
    res.json(donor);
  });
};

exports.getDonorMatchesByID = function(req, res) {
  Donors.getDonorMatches(req.params.donorID, function(err, patients) {
    if (err) {
      res.send(err);
    }
    res.json(patients);
  });
};

