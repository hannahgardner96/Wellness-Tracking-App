import * as mongoose from 'mongoose' // JS: const mongoose = require("mongoose")

const resourceSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: String,
    src: {type: String, required: true},
})

export const Resource = mongoose.model("Resource", resourceSchema)

// referenced hw from w6d1