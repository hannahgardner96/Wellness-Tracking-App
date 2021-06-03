// consulted someone with experience for TS formatting
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")


const nutritionalSchema = new mongoose.Schema({
    date: Date,
    listenedToBody: {type: Number, min: 0, max: 5},
    ateVeggies: {type: Number, min: 0, max: 5},
    drankWater: {type: Number, min: 0, max: 5},
})

export const NutritionalWellness = mongoose.model("NutritionalWellness", nutritionalSchema)