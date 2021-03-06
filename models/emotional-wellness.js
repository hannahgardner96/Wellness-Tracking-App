"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmotionalWellness = void 0;
// consulted someone with experience for TS formatting
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
const emotionalSchema = new mongoose.Schema({
    date: Date,
    practicedMindfulness: { type: Number, min: 0, max: 5 },
    practicedGratitude: { type: Number, min: 0, max: 5 },
    reflectedOnGoals: { type: Number, min: 0, max: 5 },
});
exports.EmotionalWellness = mongoose.model("EmotionalWellness", emotionalSchema);
//# sourceMappingURL=emotional-wellness.js.map