const express = require('express')
const { 
    getAllVideos,
    getVideoById,
    createVideo,
    createManyVideos,
    updateManyVideos,
    deleteAllVideos,
    deleteVideoById
} = require('../controllers/videoController')

const router = express.Router()

// GET all videos
router.get('/', getAllVideos)

// GET video by ObjectId
router.get('/:objectId', getVideoById)

// POST new video
router.post('/', createVideo)

// POST multiple videos
router.post('/bulk', createManyVideos)

// PATCH multiple videos
router.patch('/bulk', updateManyVideos)

// DELETE all videos
router.delete('/', deleteAllVideos)

// DELETE video by ObjectId
router.delete('/:objectId', deleteVideoById)


module.exports = router