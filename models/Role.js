import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
    value: { type: String, required: true, default: "user" }
});

export default mongoose.model('Role', roleSchema);