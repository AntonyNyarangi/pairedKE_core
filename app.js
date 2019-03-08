var express = require('express')
var app = express()
var bodyParser = require('body-parser');

port = process.env.PORT || 4002;




let database = require("./app/models/database");

// create db connection
database.createConnection();
//run database setup
database.createTables();
app.listen(port);
console.log("API server started on: " + port);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require("./app/routes/appRoutes"); //importing route
routes(app); //register the route
