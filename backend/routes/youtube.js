const express = require('express')
const router = express.Router()
const {
    addVideoToPlaylist
} = require('../controllers/youtubeController')

const isLoggedIn = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'User is not authenticated!' })
    }
    next()
}

router.post('/', isLoggedIn, addVideoToPlaylist)

module.exports = router