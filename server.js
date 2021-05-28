"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// ===== DEPENDENCIES ===== //
// consulted someone with experience for TS formatting
// needed to include the "* as" because it was compiling eachdependency as "express_1.default" and giving a type error
const express = require("express"); // JS: const router = express.Router()
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
const methodOverride = require("method-override"); // JS: const methodOverride = require('method-override')
const wellness_1 = require("./controllers/wellness"); // JS: const router = express.Router(), router is in {} to specify which export it is accessing from the controller "wellness"
// ====== CONFIGURATION ===== //
const app = express();
const port = 3000;
// ========== //
app.use(methodOverride('_method'));
// ===== MIDDLEWARE ===== //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// ===== CONNECT TO MONGO/EXTERNAL MIDDLEWARE ===== //
mongoose.connect('mongodb://localhost:27017/basiccrud', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.once('open', () => {
    console.log('connected to mongo');
});
app.use(wellness_1.router);
// ===== LISTENER ===== //
app.listen(port, () => {
    console.log("listening on port", port);
});
//# sourceMappingURL=server.js.map