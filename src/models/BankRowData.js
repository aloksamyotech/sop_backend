import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  full_name: { type: String },
  ssn: { type: String },
  phone: { type: String },
});

const bankRowSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: false },
  case_id: { type: String, required: false },
  row_data: { type: String, required: false },
  cron_data: { type: String, required: false, default: null },
  created_at: { type: Number, required: true },
  updated_at: { type: Number, required: false },
  id: { type: String, required: true },
  bank_name: { type: String },
  bank_names: { type: [String] }, // Correct array type
  continuous_access_expire_at: { type: Date },
  user_info: userSchema,
  incomes: { type: String },
  expenses: { type: String },
  bank_account: { type: String },
  empty_transactions: { type: Boolean },
});

export default mongoose.model("BankRow", bankRowSchema);
