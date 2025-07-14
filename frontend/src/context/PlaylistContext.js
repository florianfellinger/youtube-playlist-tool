import { createContext, useReducer, useEffect, useState } from "react";
import { calculateTotalVideoDuration, convertIsoDurationToMMSS, convertISOToSeconds, convertSecondsToIso } from "../utils/videoUtils";

export const PlaylistContext = createContext()

const playlistReducer = (state, action) => {
    // state: previous state; action: operation to do and data needed for that
    switch(action.type) {
        case "SET_PLAYLISTS":
            return {
                playlists: action.payload
            }
        case "DELETE_PLAYLIST":
            return {
                playlists: state.playlists.filter((playlist) => playlist.playlistId !== action.payload.playlistId)
            }
    }
}

export const PlaylistContextProvider = ({ children }) => {
    // playlists is an object, containing a property "playlists" (an array), which contains data-objects of all playlists
    const [playlists, dispatch] = useReducer(playlistReducer, { playlists: [] })
    // the playlistId that syncPlaylist was called with (to auto fill certain input fields)
    const [currentPlaylistId, setCurrentPlaylistId] = useState("")
    // current playlist based on currentPlaylistId
    const [currentPlaylist, setCurrentPlaylist] = useState(null)

    console.log("PLAYLISTS", playlists)
    console.log("CURRENT PLAYLIST ID", currentPlaylistId)
    console.log("CURRENT PLAYLIST", currentPlaylist)

    // when currentPlaylistId changes, store it in localStorage for persistence beyond browser refreshes
    useEffect(() => {
        if (currentPlaylistId) {
            localStorage.setItem("currentPlaylistId", currentPlaylistId)
            fetchPlaylistByPlaylistId(currentPlaylistId)
        }
    }, [currentPlaylistId])

    // fetch all playlists to store them in state, such that components only call playlists state to access playlists data
    useEffect(() => {
        fetchPlaylists()
        // fetch states from local storage
        const storedId = localStorage.getItem("currentPlaylistId")
        if (storedId) {
            setCurrentPlaylistId(storedId)
        }
    }, [])

    const fetchPlaylistDetailsFromYoutubeAPI = async (apiKey, playlistId) => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&id=${playlistId}&part=snippet`, {
                method: "GET"
            })

            if (response.ok) {
                let jsonResponse = await response.json()
                return jsonResponse
            }
        } catch (error) {
            console.error("Error fetching playlist from YouTube Data API:", error)
        }
    }

    const postPlaylistToDatabase = async (playlistJSON) => {
        try {
            const response = await fetch('/api/playlists', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(playlistJSON)
            })
        } catch (error) {
            console.error("Error posting playlist to database:", error)
        }
    }

    const fetchPlaylists = async () => {
        try {
            const response = await fetch('/api/playlists', {
                method: "GET"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                dispatch({ type: "SET_PLAYLISTS", payload: jsonResponse })
            }
        } catch (error) {
            console.error("Error fetching playlists:", error)
        }
    }

    const fetchPlaylistByPlaylistId = async (playlistId) => {
        try {
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: "GET"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                console.log(jsonResponse)
                setCurrentPlaylist(jsonResponse)
            }
        } catch (error) {
            console.error("Error fetching playlist by playlistId:", error)
        }
    }

    const deletePlaylistById = async (playlistId) => {
        try {
            const response = await fetch(`/api/playlists/${playlistId}`, {
                method: "DELETE"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                dispatch({ type: "DELETE_PLAYLIST", payload: jsonResponse })
            }
        } catch (error) {
            console.error(`Error deleting playlist ${playlistId}:`, error)
        }
    }

    /**
     * retrieve videos of given playlist to calculate some metadata
     * @returns metadata object
     */
    const fetchMetadataByPlaylistId = async (playlistId) => {
        try {
            const response = await fetch(`/api/videos/${playlistId}`, {
                method: "GET"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                
                // build metadata object based on jsonResponse
                const totalVideos = jsonResponse.length
                const totalDuration = calculateTotalVideoDuration(jsonResponse)

                return {
                    totalVideos: totalVideos,
                    totalDuration: totalDuration
                }
            }

        } catch (error) {
            console.error(`An error occured while trying to fetch metadata given playlist ${playlistId}`, error.message)
        }
    } 


    const syncPlaylists = async (apiKey, playlistId) => {
        try {
            // retrieve raw playlist data from YouTube Data API
            const rawPlaylistDetailsJSON = await fetchPlaylistDetailsFromYoutubeAPI(apiKey, playlistId)
            
            // extract fields to post
            const playlistJSON = extractJSONFields(rawPlaylistDetailsJSON.items[0])

            // retrieve additional metadata to store in playlist object
            const metadata = await fetchMetadataByPlaylistId(playlistId)

            // merge both objects
            const finalPlaylistJSON = {
                ...playlistJSON,
                ...metadata
            }

            await postPlaylistToDatabase(finalPlaylistJSON)
            await fetchPlaylists()
            // when everything went through, set current playlist
            setCurrentPlaylistId(playlistId)
        } catch (error) {
            console.error(`An error occured while trying to sync with given playlist ${playlistId}`, error.message)
            alert(`An error occured while trying to sync with given playlist "${playlistId}":\n ${error.message}`)
        }
    }


    // HELPER METHODS
    /**
     * extracts only the necessary fields of a JSON to store in the database.
     * @param jsonData as in https://developers.google.com/youtube/v3/docs/playlists/list (for part=snippet)
     */
    const extractJSONFields = (jsonData) => {
        return (
            {
                playlistId: jsonData.id,
                title: jsonData.snippet.title,
                channelTitle: jsonData.snippet.channelTitle || "-"
            }
        )
    }

    return (
        // wrap whatever Components that need access to this context (here: children is <App /> => all components of the application have access to this context)
        <PlaylistContext.Provider value={{
            ...playlists,
            currentPlaylistId,
            currentPlaylist,
            dispatch,
            setCurrentPlaylistId,
            fetchPlaylistByPlaylistId,
            syncPlaylists,
            deletePlaylistById,
            fetchMetadataByPlaylistId
        }}>
            { children }
        </PlaylistContext.Provider>
    )
}