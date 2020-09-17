require("dotenv").config();
var express = require("express");
var app = express();
var cors = require("cors");
var bodyParser = require("body-parser");
const passport = require("passport");
const passportStrategies = require("./app/passport_strategies/localStrategy");
passportStrategies(passport);

port = process.env.PORT || 3001;

let database = require("./app/models/database");

// create db connection
database.createConnection();
//run database setup
database.createTables();
app.listen(port);
console.log("API server started on: " + port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
var routes = require("./app/routes/appRoutes"); //importing route
routes(app); //register the route
