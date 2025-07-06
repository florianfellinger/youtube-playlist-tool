const Playlist = require('../models/playlistModel')
const mongoose = require('mongoose')

// GET all playlists
const getAllPlaylists = async (req, res) => {
    const playlists = await Playlist.find({}).sort({position: 1})

    res.status(200).json(playlists)
}

// GET playist by ObjectId
const getPlaylistById = async (req, res) => {
    const { objectId } = req.params

    // check if mongo id is valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return res.status(404).json({error: `Id ${objectId} is not a valid Mongo ObjectId!`})
    }

    const playlist = await Playlist.findById(objectId)

    if (!playlist) {
        return res.status(404).json({error: `Playlist with id ${objectId} doesn't exist!`})
    }

    res.status(200).json(playlist)
}

// POST new playlist
const createPlaylist = async (req, res) => {

    try {
        const playlist = await Playlist.create(req.body)
        res.status(200).json(playlist)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

// POST multiple playlists
const createManyPlaylists = async (req, res) => {
    const playlistsData = req.body

    if (!Array.isArray(playlistsData)) {
        return res.status(400).json({ error: "Expected array of playlists!" })
    }

    try {
        const playlists = await Playlist.insertMany(playlistsData)
        res.status(200).json(playlists)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE all playlists
const deleteAllPlaylists = async (req, res) => {
    try {
        const playlists = await Playlist.deleteMany({})
        res.status(200).json(playlists)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// DELETE playlist by ObjectId
const deletePlaylistById = async (req, res) => {
    const { objectId } = req.params

    if (!mongoose.Types.ObjectId.isValid(objectId)) {
        return res.status(404).json({error: `Id ${objectId} is not a valid Mongo ObjectId!`})
    }

    const playlist = await Playlist.findOneAndDelete({_id: objectId})

    if (!playlist) {
        return res.status(404).json({error: `Playlist with id ${objectId} doesn't exist!`})
    }

    res.status(200).json(playlist)
}

module.exports = {
    getAllPlaylists,
    getPlaylistById,
    createPlaylist,
    createManyPlaylists,
    deleteAllPlaylists,
    deletePlaylistById
}
