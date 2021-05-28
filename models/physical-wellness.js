"use strict";
exports.__esModule = true;
exports.PhysicalWellness = void 0;
// consulted someone with experience for TS formatting
var mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
var physicalSchema = new mongoose.Schema({
    date: Date,
    movedBody: { type: Number, min: 0, max: 5 },
    gotEnoughSleep: { type: Number, min: 0, max: 5 },
    restedBody: { type: Number, min: 0, max: 5 }
});
exports.PhysicalWellness = mongoose.model("PhysicalWellness", physicalSchema);
