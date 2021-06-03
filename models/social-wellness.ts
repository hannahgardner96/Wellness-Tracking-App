// consulted someone with experience for TS formatting
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")


const socialSchema = new mongoose.Schema({
    date: Date,
    connectedWithSomeone: {type: Number, min: 0, max: 5},
    sharedFeelings: {type: Number, min: 0, max: 5},
    madeTimeForMyself: {type: Number, min: 0, max: 5},
})

export const SocialWellness = mongoose.model("SocialWellness", socialSchema)