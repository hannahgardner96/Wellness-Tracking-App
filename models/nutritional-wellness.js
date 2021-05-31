"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionalWellness = void 0;
// consulted someone with experience for TS formatting
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
const nutritionalSchema = new mongoose.Schema({
    date: Date,
    listenedToBody: { type: Number, min: 0, max: 5 },
    ateVeggies: { type: Number, min: 0, max: 5 },
    drankWater: { type: Number, min: 0, max: 5 },
});
exports.NutritionalWellness = mongoose.model("NutritionalWellness", nutritionalSchema);
