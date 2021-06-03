"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resource = void 0;
const mongoose = require("mongoose"); // JS: const mongoose = require("mongoose")
const resourceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    src: { type: String, required: true },
});
exports.Resource = mongoose.model("Resource", resourceSchema);
// referenced hw from w6d1
//# sourceMappingURL=resources.js.map