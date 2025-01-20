const mongoose=require('mongoose');

const userSchema=new mongoose.Schema(
    {
        email:{
            type:String,
            required:true,
            unique:true,
        },
        phone:{
            type:String,
            required:true,
            maxlength:10,
        },
        fullName:{
            type:String,
            required:true,
            unique:true
        },
        password:{
            type:String,
            required:true
        }, 
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
    }
);

const User=mongoose.model('User',userSchema);
module.exports=User;