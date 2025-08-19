import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    fullname: {
        type: String,
        default: "Anonymous User"
    },
    files: [{
        type: String,
        required: true
    }],
    total_download: {
        type: Number,
        default: 0
    },
    profile:{
        type:String,
        default:"default_profile"
    },
    total_upload:{
        type:Number,
        default:0
    },
    documentCount: { type: Number, default: 0 },
}, {timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;