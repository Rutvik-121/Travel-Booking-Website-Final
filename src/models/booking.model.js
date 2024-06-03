import mongoose from "mongoose";

// Define the Booking schema
const bookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    duration: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    destination: {
        type: String,
        required: true,
    }
}, { timestamps: true });

// Create the Booking model
export const Book = mongoose.model('Book', bookingSchema);


