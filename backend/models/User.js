import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    userType: {
        type: String,
        required: function () { return !this.googleId; }
    },
    userFullName: {
        type: String,
        required: function () { return !this.googleId; },
        unique: true
    },   
    admissionId: {
        type: String,
        min: 3,
        max: 15,
    },
    employeeId: {
        type: String,
        min: 3,
        max: 15,
    },
    age: {
        type: Number
    },
    gender: {
        type: String
    },
    dob: {
        type: String
    },
    address: {
        type: String,
        default: ""
    },
    mobileNumber: {
        type: Number,
        required: function () { return !this.googleId; }
    },
    photo: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        require: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: function () { return !this.googleId; },
        min: 6
    },
    points: {
        type: Number,
        default: 0
    },
    activeTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    prevTransactions: [{
        type: mongoose.Types.ObjectId,
        ref: "BookTransaction"
    }],
    isAdmin: {
        type: Boolean,
        default: false
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
      },
    isGoogleUser: {
        type: Boolean,
        default: false
    },
      
    resetPasswordToken: String,
    resetPasswordExpires: Date,
},
    {
        timestamps: true
    });

export default mongoose.model("User", UserSchema);