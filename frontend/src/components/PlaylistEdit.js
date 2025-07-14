import { useState, useEffect } from "react"

import '../styles/PlaylistEdit.css'
import '../styles/styles_InputFields.css'

import { useVideoContext } from "../hooks/useVideoContext"
import { usePlaylistContext } from "../hooks/usePlaylistContext"

const PlaylistEdit = () => {
    const { numberOfVideos } = useVideoContext()
    const { currentPlaylistId } = usePlaylistContext()
    // input states
    const [playlistIdInput, setPlaylistIdInput] = useState("")
    const [videoId, setVideoId] = useState("")
    const [position, setPosition] = useState(1)
    // corresponding error states
    const [playlistIdInputError, setPlaylistIdInputError] = useState("")
    const [videoIdInputError, setVideoIdInputError] = useState("")
    const [positionInputError, setPositionInputError] = useState("")

    console.log("PLAYLISTID: ", currentPlaylistId)
    console.log("PLAYLISTIDINOUT: ", playlistIdInput)

    useEffect(() => {
        setPlaylistIdInput(currentPlaylistId)
    }, [currentPlaylistId])

    /**
     * insert the video into the playlist, at a certain position. All values are from this component's state
     */
    const insertVideoIntoPlaylist = async () => {
        await fetch('http://localhost:4000/api/youtube', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ playlistId: playlistIdInput, videoId: videoId, position: position - 1 }),
            credentials: 'include'
        })
    }

    /**
     * handle input validation and call YouTube Data API to insert video into playlist
     */
    const handleInsertVideoIntoPlaylist = async () => {
        setPlaylistIdInputError("")
        setVideoIdInputError("")
        setPositionInputError("")
        let error = false

        if (!playlistIdInput) {
            setPlaylistIdInputError("Enter a Playlist-ID");
            error = true
        }
        if (!videoId) {
            setVideoIdInputError("Enter a Video-ID");
            error = true
        }
        if (position < 1 || position > numberOfVideos + 1) { // +1 to allow inserting video on the bottom (being the lew last element)
            setPositionInputError("Position must be between 1 and length of the playlist + 1")
            error = true
        }
        if (error) return;

        await insertVideoIntoPlaylist()
    }

    return (
        <div className="PlaylistEdit">

            <div className="inputs-container">

                <div className={playlistIdInputError ? 'input-container-error' : 'input-container'}>
                    <input
                        className='input'
                        type="text"
                        placeholder="enter Playlist-ID"
                        value={playlistIdInput}
                        onChange={(e) => setPlaylistIdInput(e.target.value)}
                    />

                    <div className='errorText'>{playlistIdInputError}</div>
                </div>

                <div className={videoIdInputError ? 'input-container-error' : 'input-container'}>
                    <input
                        className='input'
                        type="text"
                        placeholder="enter Video-ID"
                        value={videoId}
                        onChange={(e) => setVideoId(e.target.value)}
                    />

                    <div className='errorText'>{videoIdInputError}</div>
                </div>

                <div className={positionInputError ? 'input-container-error' : 'input-container'}>
                    <input
                        className='input'
                        type="number"
                        placeholder="enter Position"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                    />

                    <div className='errorText'>{positionInputError}</div>
                </div>
            
            </div>

            <div className="insert_button" onClick={handleInsertVideoIntoPlaylist}><p>Insert</p></div>
        </div>
    )
}

export default PlaylistEdit