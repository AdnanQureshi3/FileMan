import mongoose from "mongoose";


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


} , {timestamps:true});

const Files = mongoose.model("Files" , fileSchema);
export default Files