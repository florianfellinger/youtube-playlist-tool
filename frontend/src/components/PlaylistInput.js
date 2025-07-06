import { useState } from 'react'

import { useVideoContext } from "../hooks/useVideoContext"

import '../styles/PlaylistInput.css'
import '../styles/styles_InputFields.css'

const PlaylistInput = () => {
    const { deleteAllVideos, syncVideosFromPlaylist } = useVideoContext()
    const [playlistId, setPlaylistId] = useState("") // sample playlistId: PLuMvKcrkir3D2K99cXm1kchsdhyVqgngk
    const [playlistIdInputError, setPlaylistIdInputError] = useState("")

    /**
     * add the contents of a playlist to the database and update the view by setting the videos state in VideoContext accordingly
     */
    const loadVideosFromPlaylist = async () => {
        if (playlistId === "") {
            setPlaylistIdInputError("Enter a playlist Id")
        } else {
            await syncVideosFromPlaylist("AIzaSyD06cPOcOwE-6skqd7WSdQMhk6BaC0iwgk", playlistId)
        }
    }

    /**
     * delete all videos from database
     */
    const handleDeleteAllVideos = async () => {
        await deleteAllVideos()
    }

    /**
     * (_testing method_)
     */
    const handleTest = async () => {
        console.log("retrieving photo...")
        const response = await fetch('http://localhost:4000/api/userData/profilePicture', {
            method: "GET",
            credentials: "include"
        })

        if (response.ok) {
            const jsonResponse = await response.json()
            console.log(jsonResponse.profilePicture)
        }
    }

    return (
        <div className="PlaylistInput">

            <div className={playlistIdInputError ? 'input-container-error' : 'input-container'}>
                 <input
                    className='input'
                    type="text"
                    placeholder="enter Playlist-ID"
                    value={playlistId}
                    onChange={(e) => setPlaylistId(e.target.value)}
                />

                <div className='errorText'>{playlistIdInputError}</div>
            </div>
           
            <div className='buttons'>
                <div className="sync_button" onClick={loadVideosFromPlaylist}><p>Synchronize Videos from Playlist</p></div>
                <div className="deleteAll_button" onClick={handleDeleteAllVideos}><p>Clear all</p></div>
            </div>

            <button onClick={handleTest}>TEST</button>

        </div>
    )
}

export default PlaylistInput