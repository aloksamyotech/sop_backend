import mongoose, { Schema } from "mongoose";
const categorySchema = new Schema(
  {
    categoryName: {
      type: String,
      required: true,
      trim: true,
    },
    desc: {
      type: String,
      trim: true,
    },
    
    isAvailable: {
      type: Boolean,
      default:true
    },
    categoryImage: {
      type: String,
    },
    
   },
  { timestamps: true },
);


 