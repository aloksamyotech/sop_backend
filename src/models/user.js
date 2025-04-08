import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        required: true,
        index: true,
        match: [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/, 'Please enter a valid email address']
    },
    password: {
        type: String,
        trim: true,
        required: true
    },


}, { timestamps: true },)


export const UserModel = mongoose.model("User", UserSchema);


// that is good 
