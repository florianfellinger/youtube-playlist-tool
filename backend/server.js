// Access env file for environment variables
require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport') // auth
const session = require('express-session')
const cors = require('cors')

// import routes
const videosRoutes = require('./routes/videos')
const playlistsRoutes = require('./routes/playlists')
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
app.use(session({ 
    secret: 'cats', 
    resave: false, 
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,          // nur für `localhost`, in Produktion auf `true`
        sameSite: 'lax'         // wichtig für Cookie bei Cross-Origin GET/POST
    } 
}));
app.use(passport.initialize())
app.use(passport.session())
//test middleware
app.use((req, res, next) => {
  console.log("SESSION ID:", req.sessionID);
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);
  next();
});

// Routes
app.use('/api/videos', videosRoutes)
app.use('/api/playlists', playlistsRoutes)
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
