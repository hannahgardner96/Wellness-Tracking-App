// consulted someone with experience for TS formatting
import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")
import {EmotionalWellness} from "../models/emotional-wellness"
import {NutritionalWellness} from "../models/nutritional-wellness"
import {PhysicalWellness} from "../models/physical-wellness"
import {SocialWellness} from "../models/social-wellness"

// need one place to reference all schemas in index bc cannot .find and pass information from multiple schemas to one ejs file 

// referenced https://mongoosejs.com/docs/subdocs.html and https://dev.to/oluseyeo/how-to-create-relationships-with-mongoose-and-node-js-11c8 and https://mongoosejs.com/docs/schematypes.html for below code
const totalSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    emotionalWellness: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "EmotionalWellness"
    }],
    physicalWellness: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "PhysicalWellness"
    }],
    nutritionalWellness: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "NutritionalWellness"
    }],
    socialWellness: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: "SocialWellness"
    }]
})
            

export const TotalWellness = mongoose.model("TotalWellness", totalSchema)