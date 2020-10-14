let mysql = require("mysql");
let connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});
let database = require("./database");

module.exports = {
  createConnection: () => {
    // connect to MySQL database
    connection.connect(function (err) {
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
      isMatched boolean not null default false,
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
      isAltruistic boolean,
      isMatched boolean not null default false,
      created_at timestamp default current_timestamp
    )`;
    const createUsersTable = `create table if not exists users(
      id int primary key auto_increment,
      firstName varchar(30),
      lastName varchar(30),
      email varchar(255),
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
      created_at datetime default current_timestamp,
      FOREIGN KEY (patientID) references patients(id),
      FOREIGN KEY (donorID) references donors(id),
      FOREIGN KEY (healthFacilityID) references health_facilities(id)
    )`;
    const createMatchingRunsTable = `create table if not exists matching_runs(
      id int primary key auto_increment,
      date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    const createDirectedMatchesTable = `create table if not exists directed_matches(
      id int primary key auto_increment,
      matchingRunID int(5) NOT NULL,
      donorID int(5) NOT NULL,
      donorCaseID int(5) NOT NULL,      
      patientID int(5) NOT NULL,
      patientCaseID int(5) NOT NULL,
      FOREIGN KEY (patientID) references patients(id),
      FOREIGN KEY (donorID) references donors(id),
      FOREIGN KEY (matchingRunID) references matching_runs(id),
      FOREIGN KEY (donorCaseID) references cases(id),
      FOREIGN KEY (patientCaseID) references cases(id)
    )`;
    const createClosedMatchesTable = `create table if not exists closed_matches(
      id int primary key auto_increment,
      matchingRunID int(5) NOT NULL,
      donorID int(5) NOT NULL,
      donorCaseID int(5) NOT NULL,      
      patientID int(5) NOT NULL,
      patientCaseID int(5) NOT NULL,
      FOREIGN KEY (patientID) references patients(id),
      FOREIGN KEY (donorID) references donors(id),
      FOREIGN KEY (matchingRunID) references matching_runs(id),
      FOREIGN KEY (donorCaseID) references cases(id),
      FOREIGN KEY (patientCaseID) references cases(id)
    )`;
    const createDominoMatchesTable = `create table if not exists domino_matches(
      id int primary key auto_increment,
      matchingRunID int(5) NOT NULL,
      donorID int(5) NOT NULL,
      donorCaseID int(5),      
      patientID int(5) NOT NULL,
      patientCaseID int(5) NOT NULL,
      FOREIGN KEY (patientID) references patients(id),
      FOREIGN KEY (donorID) references donors(id),
      FOREIGN KEY (matchingRunID) references matching_runs(id),
      FOREIGN KEY (donorCaseID) references cases(id),
      FOREIGN KEY (patientCaseID) references cases(id)
    )`;

    //create patients table
    connection.query(createPatientsTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created patients table");
    });
    //create donors table
    connection.query(createDonorsTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created donors table");
    });
    //create health facilities table
    connection.query(createHealthFacilitiesTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created health_facilities table");
    });
    //create users table
    connection.query(createUsersTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created users table");
    });
    //create cases table
    connection.query(createCasesTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created cases table");
    });
    //create matching runs table
    connection.query(createMatchingRunsTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created matching_runs table");
    });
    //create match results table
    connection.query(createDirectedMatchesTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created directed_matches table");
    });
    //create match results table
    connection.query(createClosedMatchesTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created closed_matches table");
    });
    //create match results table
    connection.query(createDominoMatchesTable, function (err) {
      if (err) {
        console.log(err.message);
      }
      console.log("Created domino_matches table");
    });
  },
};
