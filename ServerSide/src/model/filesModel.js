import { Timestamp } from "bson";
import { profile } from "console";
import mongoose from "mongoose";
import { type } from "os";

const fileSchema = mongoose.Schema({
    path:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true
    },
    isPasswordProtected: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String, // store hashed password using bcrypt
    default: null,
  },
  hasExpiry: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    default: null,
  },
    createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },


} , {timestamps:true})