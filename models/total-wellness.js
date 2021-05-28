"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TotalWellness = void 0;
// consulted someone with experience for TS formatting
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
// need one place to reference all schemas in index bc cannot .find and pass information from multiple schemas to one ejs file 
// referenced https://mongoosejs.com/docs/subdocs.html and https://dev.to/oluseyeo/how-to-create-relationships-with-mongoose-and-node-js-11c8 and https://mongoosejs.com/docs/schematypes.html for below code
const totalSchema = new mongoose.Schema({
    emotionalWellness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmotionalWellness"
    },
    physicalWellness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PhysicalWellness"
    },
    nutritionalWellness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "NutritionalWellness"
    },
    socialWellness: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SocialWellness"
    }
});
exports.TotalWellness = mongoose.model("TotalWellness", totalSchema);
//# sourceMappingURL=total-wellness.js.map