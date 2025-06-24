require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const videosRoutes = require('./routes/videos')

const app = express()

// Middleware
app.use(express.json())

// Routes
app.use('/api/videos', videosRoutes)

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
