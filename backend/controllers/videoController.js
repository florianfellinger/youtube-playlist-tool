const Video = require('../models/videoModel')
const mongoose = require('mongoose')

// GET all videos
const getAllVideos = async (req, res) => {
    const videos = await Video.find({}).sort({position: 1})

    res.status(200).json(videos)
}

// GET video by ObjectId
const getVideoById = async (req, res) => {
    const { objectId } = req.params

    // check if mongo id is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return res.status(404).json({error: `Id ${objectId} is not a valid Mongo ObjectId!`})
    }

    const video = await Video.findById(objectId)

    if (!video) {
        return res.status(404).json({error: `Video with id ${objectId} doesn't exist!`})
    }

    res.status(200).json(video)
}

// POST new video
const createVideo = async (req, res) => {

    try {
        const video = await Video.create(req.body)
        res.status(200).json(video)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// POST multiple videos
const createManyVideos = async (req, res) => {
    const videosData = req.body

    if (!Array.isArray(videosData)) {
        return res.status(400).json({ error: "Expected array of videos!" })
    }

    try {
        const videos = await Video.insertMany(videosData)
        res.status(200).json(videos)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// PATCH multiple videos
const updateManyVideos = async (req, res) => {
    const videosData = req.body

    if (!Array.isArray(videosData)) {
        return res.status(400).json({ error: "Expected array of videos!" })
    }

    try {
        const operations = videosData.map(video => ({
            updateOne: {
                filter: { videoId: video.videoId },
                update: { $set: { duration: video.duration } }
            }
        }))

        const videos = await Video.bulkWrite(operations)
        res.status(200).json(videos)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE all videos
const deleteAllVideos = async (req, res) => {
    try {
        const videos = await Video.deleteMany({})
        res.status(200).json(videos)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE video by ObjectId
const deleteVideoById = async (req, res) => {
    const { objectId } = req.params

    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return res.status(404).json({error: `Id ${objectId} is not a valid Mongo ObjectId!`})
    }

    const video = await Video.findOneAndDelete({_id: objectId})

    if (!video) {
        return res.status(404).json({error: `Video with id ${objectId} doesn't exist!`})
    }

    res.status(200).json(video)
}

module.exports = {
    getAllVideos,
    getVideoById,
    createVideo,
    createManyVideos,
    updateManyVideos,
    deleteAllVideos,
    deleteVideoById
}
