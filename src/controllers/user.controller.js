import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"

const { ObjectId } = mongoose.Types;

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken;
        const res = await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access tokens")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details
    const { username, email, password, phone } = req.body

    // Check if user already exists in db
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "Username or email already exist")
    }
    // save in db
    const user = await User.create({

        username: username,
        password,
        email,
        phone
    })

    // See if saved in db
    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})
const verifyLoginCredentials = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    
    // find the user
    const user = await User.findOne({ "email": email })
    if(!user){
        return res.status(200).json({ message: 'User not found', code: 401 })
    }
    
    if(user.password != password){
        return res.status(200).json({ message: 'Wrong Password', code: 401 })
    }

    return res.status(200).json({ message: 'OK', code: 200 })
})

const loginUser = asyncHandler(async (req, res) => {
    // get data
    const { email, password } = req.body
    
    const user = await User.findOne({ "email": email })
    
    // generate access and refresh token
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

    // send tokens through cookies and send the response
    const data = await User.findById(user._id).select("-password")
    
    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    res.cookie('accessToken', accessToken, { httpOnly: true, secure: true });
    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true });

    return res.status(200).render('packages', { data })
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } })
    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .render('index', { data: null })
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request")
        }

        const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        // console.log(decodedToken)
        // { _id: '664060015d3954d757acb244', iat: 1715628735, exp: 1716492735 }
        const user = await User.findById(decodedToken._id).select("-password")
        // console.log(user)
        if (!user) {
            throw new ApiError(401, "Invalid refresh token!")
        }
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token!")
        }
        const options = {
            httpOnly: true,
            secure: true
        }
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id)

        return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(new ApiResponse(200, {
                accessToken,
                refreshToken
            }, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error.message || "Error while generating access token")
    }
})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    // get old password and new password
    const { currentPassword, newPassword, confirmNewPassword } = req.body

    // get data from db and verify old password
    const user = await User.findById(req.user?._id)
    


    // set the new passowrd
    user.password = newPassword
    await user.save({ validateBeforeSave: false })
    // return confirm message
    const options = { // makes cookies secure. i.e., only server can modify them
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .render('login', { data: null })
})
const verifyCurrentpassword = asyncHandler(async (req, res) => {
    // get old password and new password
    const { currentPassword } = req.body
    console.log(req.user)
    // verify new password and confirm password
    if (currentPassword != req.user.password) {
        return res.status(200).json({ message: 'Invalid Password', code: 401 })
    }
    return res.status(200).json({ message: 'OK', code: 200 })
})

const verifyRegisterCredentials = asyncHandler(async (req, res) => {
    const { email , phone, username, password} = req.body
    
    // find the user
    const user = await User.findOne({ "email": email })
    if(user){
        return res.status(200).json({ message: 'Email is already registered', code: 401 })
    }
    await User.create({
        email,
        phone,
        username,
        password
    })

    return res.status(200).json({ message: 'OK', code: 200 })
})


export { registerUser, loginUser, logoutUser, refreshAccessToken, verifyCurrentpassword ,changeCurrentPassword, verifyLoginCredentials,verifyRegisterCredentials }