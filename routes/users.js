const mongoose = require('mongoose');
const plm = require("passport-local-mongoose")

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema = mongoose.Schema({
    userName:String,
    name:String,
    email:String,
    password:String,
    profileImage:String,
    contact:Number,
    boards:{
        tyoe:Array,
        default:[]
    },
});

userSchema.plugin(plm)

module.exports = mongoose.model("users",userSchema);