import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt বাদ, plain text
  role: { type: String, default: "admin" }
});

export default mongoose.model("User", UserSchema);
