import mongoose from "mongoose"
import jwt from "jsonwebtoken"


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        // The index: true option in Mongoose is used to create an index on the specified field in MongoD
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        requires: [true, 'Password is Required']
    },
    refreshToken: {
        type: String
    },
    phone: {
        type: String,
        required: true,
        trim : true
    },

}, {
    timestamps: true
})


UserSchema.methods.generateAccessToken = async function () {
    return await jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

UserSchema.methods.generateRefreshToken = async function () {
    return await jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", UserSchema)