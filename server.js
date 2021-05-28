"use strict";
exports.__esModule = true;
// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
// needed to include the "* as" because it was compiling eachdependency as "express_1.default" and giving a type error
var express = require("express"); // JS: const router = express.Router()
var mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
var methodOverride = require("method-override"); // JS: const methodOverride = require('method-override')
var wellness_1 = require("./controllers/wellness"); // JS: const router = express.Router(), router is in {} to specify which export it is accessing from the controller "wellness"
var session = require("express-session");
// ====== CONFIGURATION ===== //
var app = express();
var port = process.env.PORT || 3000;
// ========== //
app.use(methodOverride('_method'));
// ===== MIDDLEWARE ===== //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET || 'foo',
    resave: false,
    saveUninitialized: false
}));
// ===== CONNECT TO MONGO/EXTERNAL MIDDLEWARE ===== //
var mongoURI = process.env.MONGODBNAME || 'mongodb://localhost:27017/basiccrud';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.once('open', function () {
    console.log('connected to mongo');
});
app.use(wellness_1.router);
// ===== LISTENER ===== //
app.listen(port, function () {
    console.log("listening on port", port);
});
