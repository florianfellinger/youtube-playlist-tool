const express = require('express')
const { 
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    createManyPlaylists,
    deleteAllPlaylists,
    deletePlaylistById
} = require('../controllers/playlistController')

const router = express.Router()

// GET all playlists
router.get('/', getAllPlaylists)

// GET playlist by ObjectId
router.get('/:objectId', getPlaylistById)

// POST new playlist
router.post('/', createPlaylist)

// POST multiple playlists
router.post('/bulk', createManyPlaylists)

// DELETE all playlists
router.delete('/', deleteAllPlaylists)

// DELETE playlist by ObjectId
router.delete('/:objectId', deletePlaylistById)


module.exports = router