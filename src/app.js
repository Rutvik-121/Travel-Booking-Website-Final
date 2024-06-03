import express, { urlencoded } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { Book } from './models/booking.model.js'
const app = express()

// CORS_ORIGIN should be address of frontend where it is hosted
app.use(cors())

//  for parsing JSON data sent in the req.body 
//  i.e,. converting a JSON (JavaScript Object Notation) string into a JavaScript object
app.use(express.json({ limit: "16kb" }))

// parse incoming request bodies that are formatted in URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// for serving Static files
app.use(express.static("public"))

// for handling browser's cookies
app.use(cookieParser())

app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', "./views/");

app.get("/", (req, res)=>{
    res.render('index', {data: null})
})
app.get("/login", (req, res)=>{
    res.render('login', {data: null})
})
app.get("/booking", (req, res)=>{
    res.render('booking', {data: null})
})
app.get("/packages", verifyJWT, (req, res)=>{
    res.render('packages', {"data": req.user})
})

app.get("/changepassword", verifyJWT, (req, res)=>{
    res.render('changepassword', {data: req.user})
})

app.get("/register", (req, res)=>{
    res.render('register', {data: null})
})

app.get("/packagesview", (req, res)=>{
    res.render('packagesview', {data: null})
})

app.get("/booking/:name/:location/:duration/:rating/:price", verifyJWT, (req, res)=>{
    
    
    res.render('booking', {data: req.user, pkg: req.params})
})

app.post('/booked', verifyJWT, async (req, res)=>{
    const bookingData = await Book.aggregate([
        {
            $match: {
                email: req.user.email
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }])
    res.render('booked', {data: req.user, bookings: bookingData })
})

app.get('/listBooking', verifyJWT, async (req, res)=>{
    const bookingData = await Book.aggregate([
        {
            $match: {
                email: req.user.email
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        }])
    res.render('booked', {data: req.user, bookings: bookingData })
})


// Routes import

import userRouter from "./routes/user.routes.js"
import verifyJWT from './middlewares/auth.middleware.js'
import bookRoute from "./routes/booking.route.js"
// Routes declarations
app.use("/api/v1/users", userRouter)
app.use("/api/v1/booking", bookRoute)


export { app }



