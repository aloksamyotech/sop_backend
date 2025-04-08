import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  avatar: { type: String, required: false },
  name: { type: String, required: true },
  country_code: { type: String, required: true }, // fixed typo here
  contact_number: { type: String, required: true },
  email: { type: String, required: true },
  country: { type: String, required: true },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
    required: true,
  },
  lang: { type: String, enum: ["en"], default: "en", required: true },
  otp: { type: Number, default: "" },
  device_type: { type: String, required: false },
  device_id: { type: String, required: false },
  device_token: { type: String, required: false, default: "" },
  verified: { type: Number, default: 0 },
  status: { type: Number, enum: [0, 1], default: 1 }, // 1=Active 0=Inactive
  logged_in: { type: Number, enum: [0, 1], default: 0 },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: false },
});

export default mongoose.model("User", UserSchema);
