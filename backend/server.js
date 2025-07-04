// Access env file for environment variables
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport') // auth
const session = require('express-session')
const cors = require('cors')

// import routes
const videosRoutes = require('./routes/videos')
const authRoutes = require('./routes/auth')
const youtubeRoutes = require('./routes/youtube')

// import files
require('./strategies/google') // auth

const app = express()

// CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true 
}));

// Middleware
app.use(express.json())
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }));
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/api/videos', videosRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/youtube', youtubeRoutes)

// start server and connect to database
mongoose.connect(process.env.DATABASE_URL)
    .then(() => {
        const port = process.env.PORT || 4000
        app.listen(port, () => {
            console.log(`Server connected to database and is listening on port ${port}!`)
        })
    })
    .catch((error) => {
        console.log(error)
    })
