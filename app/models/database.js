let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "PAIREDKE"
});
let database = require("./database");

module.exports = {
  createConnection: () => {
    // connect to MySQL database
    connection.connect(function(err) {
      if (err) {
        return console.error("error: " + err.message);
      }
      console.log("Connected to database");
    });
    // make connection globally accessible
    global.connection = connection;
  },
  createTables: () => {
    // patient table definition
    const createPatientsTable = `create table if not exists patients(
      id int primary key auto_increment,
      bloodType enum('O', 'A', 'B', 'AB'),
      age int(3),
      weight int(3),
      height int(3)
    )`;
    //donor table definition
    const createDonorsTable = `create table if not exists donors(
      id int primary key auto_increment,
      bloodType enum('O', 'A', 'B', 'AB'),
      age int(3),
      weight int(3),
      height int(3),
      smoker tinyint(1) default 0,
      illicitDrugUse tinyint(1) default 0,
      highBloodPressure tinyint(1) default 0,
      diabetes tinyint(1) default 0,
      historyDiabetes tinyint(1) default 0,
      kidneyDiseasePKD tinyint(1) default 0,
      kidneyFunction double, 
      psychiatricIllness tinyint(1) default 0,
      heartDisease tinyint(1) default 0,
      untreatedCancer tinyint(1) default 0,
      historyUntreatedCancer tinyint(1) default 0,
      urineProtein int(3),
      infectionHepatitisB tinyint(1) default 0,
      infectionHepatitisC tinyint(1) default 0,
      infectionHIV tinyint(1) default 0,
      medicalInsurance tinyint(1) default 0,
      historyBloodClots tinyint(1) default 0
    )`;
    const createUsersTable = `create table if not exists users(
      id int primary key auto_increment,
      firstName varchar(30),
      lastName varchar(30),
      email varchar(30),
      phoneNumber int(9),
      username varchar(30),
      password varchar(100)    
    )`;
    const createHealthFacilitiesTable = `create table if not exists health_facilities(
      id int primary key auto_increment,
      name varchar(30),
      locationLat decimal(9,6),
      locationLng decimal(9,6),
      kephLevel int(1),
      mflCode int(5)
    )`;
    const createCasesTable = `create table if not exists cases(
      id int primary key auto_increment,
      donorID int(10),
      patientID int(10),
      referringDoctorID int(10)
    )`;

    //create patients table
    connection.query(createPatientsTable, function(err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created patients table");
    });
    //create donors table
    connection.query(createDonorsTable, function(err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created donors table");
    });
    //create health facilities table
    connection.query(createHealthFacilitiesTable, function(err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created health facilities table");
    });
    //create users table
    connection.query(createUsersTable, function(err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created users table");
    });
    //create cases table
    connection.query(createCasesTable, function(err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created cases table");
    });
  }
};
