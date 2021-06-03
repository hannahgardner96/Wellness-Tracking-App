"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
// needed to include the "* as" because it was compiling eachdependency as "express_1.default" and giving a type error
const express = require("express"); // JS: const router = express.Router()
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
const methodOverride = require("method-override"); // JS: const methodOverride = require('method-override')
const wellness_1 = require("./controllers/wellness"); // JS: const router = express.Router(), router is in {} to specify which export it is accessing from the controller "wellness"
const session = require("express-session");
const dotenv = require("dotenv"); // this imports the variable "dotenv" to reference later on
dotenv.config(); // this tells the server to search for the .env file.Heroku does not track environmental variables by default so, when we reference an env variable, it may give an error but it will still run because we gave it the necessary information in the config variables in the set up.
// ====== CONFIGURATION ===== //
const app = express();
const port = process.env.PORT; // look at the environmental variable "PORT" and set that as the variable port. Starts with "process" because that it the unit of a program on a computer
// ========== //
app.use(methodOverride('_method'));
// ===== MIDDLEWARE ===== //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false, // forces a session that has not begun to be saved to the session store. False is better for implementing login sessions
}));
// ===== CONNECT TO MONGO/EXTERNAL MIDDLEWARE ===== //
const mongoURI = process.env.MONGODBNAME;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});
app.use(wellness_1.router);
// ===== LISTENER ===== //
app.listen(port, () => {
    console.log("listening on port", port);
});
//# sourceMappingURL=server.js.map