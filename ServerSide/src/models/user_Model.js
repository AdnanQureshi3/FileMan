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
        default:"https://res.cloudinary.com/dxqntcbd9/image/upload/v1750397077/yeycpd77fsqme2ghuslb.jpg"
    },
    total_upload:{
        type:Number,
        default:0
    },
    isPremium:{
        type:Boolean,
        default:false
    },
    premiumExpiry:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Date
    },
    filesizeLimit:{
        type:Number,
        default:10
    },
    TotalSizeLimit:{
        type:Number,
        default:25
    },
    memoryLeft:{
        type:Number,
        default:25
    },
    plan:{
        type:String,
        enum:["free","premium Basic" , "premium Pro"],
        default:"free"
    },
    memoryUsed:{
        type:Number,
        default:0
    },

    documentCount: { type: Number, default: 0 },
}, {timestamps:true})

const User = mongoose.model("User", userSchema);
export default User;