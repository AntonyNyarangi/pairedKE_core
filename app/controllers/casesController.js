let Cases = require("../models/casesModel");

exports.getAllCases = function(req, res) {
  Cases.getAllCases(req.query,function(err, cases) {
    if (err) {
      res.send(err);
      console.log("res", err);
    }
    res.send(cases);
  });
};

exports.createCase = function(req, res) {
  let newCase = new Cases(req.body);
  Cases.createCase(newCase, function(err, newCase) {
    if (err) {
      res.send(err);
    }
    res.json(newCase);
  });
};

exports.getCaseByID = function(req, res) {
  Cases.getCaseByID(req.params.caseID, function(err, fetchedCase) {
    if (err) {
      res.send(err);
    }
    res.json(fetchedCase);
  });
};

exports.updateCaseByID = function(req, res) {
  Cases.updateCaseByID(
    new Cases(req.body),
    req.params.caseID,
    function(err, updatedCase) {
      if (err) {
        res.send(err);
      }
      res.json(updatedCase);
    }
  );
};

exports.removeCaseByID = function(req, res) {
  Cases.removeCaseByID(req.params.caseID, function(
    err,
    message
  ) {
    if (err) {
      res.send(err);
    }
    res.json(message);
  });
};
