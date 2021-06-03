// consulted someone with experience for TS formatting
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")

const emotionalSchema = new mongoose.Schema({
    date: Date,
    practicedMindfulness: {type: Number, min: 0, max: 5},
    practicedGratitude: {type: Number, min: 0, max: 5},
    reflectedOnGoals: {type: Number, min: 0, max: 5},

})

export const EmotionalWellness = mongoose.model("EmotionalWellness", emotionalSchema)