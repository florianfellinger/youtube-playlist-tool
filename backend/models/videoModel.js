const mongoose = require('mongoose')

const Schema = mongoose.Schema

const videoSchema = new Schema({
    videoId: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    channelTitle: {
        type: String
    },
    position: {
        type: Number
    },
    duration: {
        type: String
    },
    playlistId: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Video', videoSchema)

