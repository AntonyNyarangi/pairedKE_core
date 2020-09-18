const util = require("util");
const query = util.promisify(connection.query).bind(connection);

let HealthFacilities = function (facility) {
  this.mflCode = facility.mflCode;
  this.officialName = facility.officialName;
  this.kephLevel = facility.kephLevel;
  this.facilityType = facility.facilityType;
  this.regulatoryBody = facility.regulatoryBody;
  this.county = facility.county;
  this.constituency = facility.constituency;
  this.subCounty = facility.subCounty;
  this.ward = facility.ward;
  this.locationLat = facility.locationLat;
  this.locationLng = facility.locationLng;
};
HealthFacilities.registerHealthFacility = function registerHealthFacility(
  newFacility,
  result
) {
  connection.query(
    `insert into health_facilities set ?`,
    newFacility,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        res.message =
          "Health Facility created successfully. Facility ID: " + res.insertId;
        result(null, res.message);
      }
    }
  );
};

HealthFacilities.getAllFacilities = async function getAllFacilities(result) {
  let facilitiesData = [];
  try {
    facilitiesData = await query(
      `select health_facilities.id,health_facilities.officialName, health_facilities.kephLevel,health_facilities.county,health_facilities.subCounty, health_facilities.ward ,count( distinct cases.id) as caseCount from health_facilities inner join cases on cases.healthFacilityID=health_facilities.id group by health_facilities.officialName`
    );
    result(null, facilitiesData);
  } catch (err) {
    result(err, null);
  }
  // connection.query(`select * from health_facilities`, function(err, res) {
  //   if (err) {
  //     console.log("error: ", err);
  //     result(err, null);
  //   } else {
  //     console.log("health facilities: ", res);
  //     result(null, res);
  //   }
  // });
};

HealthFacilities.getFacilityByID = function getFacilityByID(
  facilityID,
  result
) {
  connection.query(
    `select * from health_facilities where id = ?`,
    facilityID,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("facility: ", res);
        result(null, res);
      }
    }
  );
};

HealthFacilities.updateFacilityByID = function updateFacilityByID(
  updatedFacility,
  facilityID,
  result
) {
  connection.query(
    `update health_facilities set ? where id = ` + facilityID,
    updatedFacility,
    function (err, res) {
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

HealthFacilities.removeFacilityById = function removeFacilityById(
  facilityID,
  result
) {
  connection.query(
    `delete from health_facilities where id = ?`,
    facilityID,
    function (err, res) {
      if (err) {
        console.log("error: ", err);
        result(err, null);
      } else {
        console.log("Facility has been deleted");
        res.message = "Fatient record has been removed";
        result(null, res);
      }
    }
  );
};

module.exports = HealthFacilities;
