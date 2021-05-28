"use strict";
exports.__esModule = true;
exports.NutritionalWellness = void 0;
// consulted someone with experience for TS formatting
var mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
var nutritionalSchema = new mongoose.Schema({
    date: Date,
    listenedToBody: { type: Number, min: 0, max: 5 },
    ateVeggies: { type: Number, min: 0, max: 5 },
    drankWater: { type: Number, min: 0, max: 5 }
});
exports.NutritionalWellness = mongoose.model("NutritionalWellness", nutritionalSchema);
