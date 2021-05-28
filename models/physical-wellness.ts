// consulted someone with experience for TS formatting
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")


const physicalSchema = new mongoose.Schema({
    date: Date,
    movedBody: {type: Number, min: 0, max: 5},
    gotEnoughSleep: {type: Number, min: 0, max: 5},
    restedBody: {type: Number, min: 0, max: 5},
})

export const PhysicalWellness = mongoose.model("PhysicalWellness", physicalSchema)