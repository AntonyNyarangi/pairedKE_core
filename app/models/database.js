let mysql = require("mysql");
let connection = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "password",
  database: "paired_ke"
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
      patientName varchar(255),
      idNumber int(10),
      bloodType enum('O', 'A', 'B', 'AB'),
      age int(3),
      weight int(3),
      height int(3),
      created_at timestamp default current_timestamp
    )`;
    //donor table definition
    const createDonorsTable = `create table if not exists donors(
      id int primary key auto_increment,
      donorName varchar(255),
      idNumber int(10),
      bloodType enum('O', 'A', 'B', 'AB'),
      age int(3),
      weight int(3),
      height int(3),
      smoker tinyint(1) default 0,
      illicitDrugUse tinyint(1) default 0,
      highBloodPressure tinyint(1) default 0,
      diabetes tinyint(1) default 0,
      kidneyDiseasePKD tinyint(1) default 0,
      kidneyFunction double, 
      psychiatricIllness tinyint(1) default 0,
      heartDisease tinyint(1) default 0,
      untreatedCancer tinyint(1) default 0,
      urineProtein int(3),
      infectionHepatitisB tinyint(1) default 0,
      infectionHepatitisC tinyint(1) default 0,
      infectionHIV tinyint(1) default 0,
      medicalInsurance tinyint(1) default 0,
      historyBloodClots tinyint(1) default 0,
      created_at timestamp default current_timestamp
    )`;
    const createUsersTable = `create table if not exists users(
      id int primary key auto_increment,
      firstName varchar(30),
      lastName varchar(30),
      email varchar(30),
      phoneNumber varchar(12),
      username varchar(30),
      healthFacilityID int(10),
      password varchar(100),
      isEnabled boolean,
      isVerified boolean,
      isAdmin boolean,
      created_at timestamp default current_timestamp,
      FOREIGN KEY (healthFacilityID) references health_facilities(id)
    )`;
    const createHealthFacilitiesTable = `create table if not exists health_facilities(
      id int primary key auto_increment,
      mflCode int(5),
      officialName varchar(255),
      kephLevel varchar(30),
      facilityType varchar(30),
      regulatoryBody varchar(30),
      county varchar(30),
      constituency varchar(30),
      subCounty varchar(30),
      ward varchar(30),
      locationLat decimal(9,6),
      locationLng decimal(9,6),
      created_at timestamp default current_timestamp
    )`;
    const createCasesTable = `create table if not exists cases(
      id int primary key auto_increment,
      healthFacilityID int(5) NOT NULL,
      doctorName varchar(255),
      caseDescription text,
      doctorEmail varchar(320),
      doctorPhoneNumber varchar(12),
      patientID int(10),
      donorID int(10),
      isActive boolean,  
      created_at timestamp default current_timestamp,
      FOREIGN KEY (patientID) references patients(id),
      FOREIGN KEY (donorID) references donors(id),
      FOREIGN KEY (healthFacilityID) references health_facilities(id)
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
