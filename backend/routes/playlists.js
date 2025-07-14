const express = require('express')
const { 
    getAllPlaylists,
    getPlaylistByPlaylistId,
    getPlaylistById,
    createPlaylist,
    createManyPlaylists,
    updatePlaylistByPlaylistId,
    deleteAllPlaylists,
    deletePlaylistById
} = require('../controllers/playlistController')

const router = express.Router()

// GET all playlists
router.get('/', getAllPlaylists)

// GET playlist by playlistId
router.get('/:playlistId', getPlaylistByPlaylistId)

// GET playlist by ObjectId
router.get('/:objectId', getPlaylistById)

// POST new playlist
router.post('/', createPlaylist)

// POST multiple playlists
router.post('/bulk', createManyPlaylists)

// PATCH playlist by playlistId
router.patch('/', updatePlaylistByPlaylistId)

// DELETE all playlists
router.delete('/', deleteAllPlaylists)

// DELETE playlist by playlistId
router.delete('/:playlistId', deletePlaylistById)


module.exports = router