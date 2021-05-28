"use strict";
exports.__esModule = true;
exports.EmotionalWellness = void 0;
// consulted someone with experience for TS formatting
var mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
var emotionalSchema = new mongoose.Schema({
    date: Date,
    practicedMindfulness: { type: Number, min: 0, max: 5 },
    practicedGratitude: { type: Number, min: 0, max: 5 },
    reflectedOnGoals: { type: Number, min: 0, max: 5 }
});
exports.EmotionalWellness = mongoose.model("EmotionalWellness", emotionalSchema);
