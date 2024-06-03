import { asyncHandler } from "../utils/asyncHandler.js"
import mongoose from "mongoose"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import { Book } from "../models/booking.model.js"
const { ObjectId } = mongoose.Types;

const book = asyncHandler(async (req, res) => {
    const { name, location, duration, rating, price, email, destination } = req.body

    const bookingStatus = await Book.create({
        name,
        location,
        duration,
        price,
        email,
        destination
    })
    
    if(!bookingStatus) return res.status(200).json(new ApiResponse(200, {code: 400}))
   
    res.status(200).json(new ApiResponse(200, {code: 200}, "Booking Successful"))
})

export { book }