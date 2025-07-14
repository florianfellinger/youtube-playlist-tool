const mongoose = require('mongoose')

const Schema = mongoose.Schema

const playlistSchema = new Schema({
    playlistId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    channelTitle: {
        type: String
    },
    totalVideos: {
        type: Number
    },
    totalDuration: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Playlist', playlistSchema)

