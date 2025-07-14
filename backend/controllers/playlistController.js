const Playlist = require('../models/playlistModel')
const mongoose = require('mongoose')

// GET all playlists
const getAllPlaylists = async (req, res) => {
    const playlists = await Playlist.find({}).sort({position: 1})

    res.status(200).json(playlists)
}

// GET playlist by playlistId
const getPlaylistByPlaylistId = async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findOne({playlistId: playlistId})

    if (!playlist) {
        return res.status(404).json({error: `Playlist with playlistId ${playlistId} doesn't exist!`})
    }

    res.status(200).json(playlist)
}

// GET playlist by ObjectId
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
    const { playlistId } = req.body
    const exists = await Playlist.findOne({ playlistId })

    if (exists) {
        return res.status(409).json({ error: "playlist already exists in database!"})
    }

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

// PATCH playlist by playlistId
const updatePlaylistByPlaylistId = async (req, res) => {
    console.log("BODY", req.body)
    const { playlistId, totalVideos, totalDuration } = req.body

    try {
        const updatedPlaylist = await Playlist.findOneAndUpdate(
            { playlistId },
            {
                $set: {
                    totalVideos,
                    totalDuration
                }
            },
            { new: true }
        )

        if (!updatedPlaylist) {
            return res.status(404).json({ error: "Playlist not found" })
        }

        res.status(200).json(updatedPlaylist)
    } catch (error) {
        res.status(500).json({ error: error.message })
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

// DELETE playlist by playlistId
const deletePlaylistById = async (req, res) => {
    const { playlistId } = req.params

    const playlist = await Playlist.findOneAndDelete({playlistId: playlistId})

    if (!playlist) {
        return res.status(404).json({error: `Playlist with id ${playlistId} doesn't exist!`})
    }

    res.status(200).json(playlist)
}

module.exports = {
    getAllPlaylists,
    getPlaylistByPlaylistId,
    getPlaylistById,
    createPlaylist,
    createManyPlaylists,
    updatePlaylistByPlaylistId,
    deleteAllPlaylists,
    deletePlaylistById
}
