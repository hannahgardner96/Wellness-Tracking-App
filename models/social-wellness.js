"use strict";
exports.__esModule = true;
exports.SocialWellness = void 0;
// consulted someone with experience for TS formatting
var mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
var socialSchema = new mongoose.Schema({
    date: Date,
    connectedWithSomeone: { type: Number, min: 0, max: 5 },
    sharedFeelings: { type: Number, min: 0, max: 5 },
    madeTimeForMyself: { type: Number, min: 0, max: 5 }
});
exports.SocialWellness = mongoose.model("SocialWellness", socialSchema);
