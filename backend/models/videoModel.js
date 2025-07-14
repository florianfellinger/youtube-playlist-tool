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

// prevent duplicates: a duplicate is defined as another video in the same playlist at the same position
videoSchema.index({ videoId: 1, playlistId: 1, position: 1 }, { unique: true });

module.exports = mongoose.model('Video', videoSchema)

