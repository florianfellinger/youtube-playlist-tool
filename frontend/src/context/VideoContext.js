import { createContext, useEffect, useReducer, useState } from "react"

import { convertISOToSeconds, convertSecondsToIso, calculateTotalVideoDuration } from "../utils/videoUtils"

export const VideoContext = createContext()

export const videoReducer = (state, action) => { 
    // state: previous state; action: operation to do and data needed for that
    switch (action.type) {
        case "SET_VIDEOS":
            return {
                videos: action.payload
            }
        case "CREATE_VIDEO":
            return {
                videos: [action.payload, ...state.videos]
            }
        case "UPDATE_VIDEO":
            return {
                videos: state.videos.map((video) => 
                    video._id === action.payload._id ? action.payload : video
                )
            }
        case "DELETE_VIDEO":
            return {
                videos: state.videos.filter((video) => video._id !== action.payload._id)
            }
        case "RESET_VIDEOS":
            return {
                videos: []
            }
        default:
            return state
    }
}

export const VideoContextProvider = ({ children }) => {
    // states to share across all objects:
    // videos is an object, containing a property "videos" (an array), which contains data-objects of a selection of videos
    const [videos, dispatch] = useReducer(videoReducer, { videos: [] })
    // total number of videos in videos state
    const [numberOfVideos, setNumberOfVideos] = useState(0)
    // total video duration as context state in Iso format (pass it down to components instead of every component calculating it on their own)
    const [totalDuration, setTotalDuration] = useState("")

    console.log("VIDEOS", videos)

    // recalculate states when videos state changes
    useEffect(() => {
        setNumberOfVideos(videos.videos.length)
        calculateTotalDuration()
    }, [videos])

    /**
     * GET all videos from YouTube Data API
     * @param apiKey key of the YouTube Data API
     * @param playlistId id of playlist to fetch the videos from
     * @returns all videos in the given playlist as a JSON, or throws an error in case of an error
     * @author maybe move this function to services
     */
    const fetchVideosByPlaylistFromYoutubeAPI = async (apiKey, playlistId) => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&part=snippet&playlistId=${playlistId}&maxResults=${50}`, {
                method: "GET"
            })

            if (response.ok) {
                // parse response to an array containing json objects
                let jsonResponse = await response.json()
                console.log("VIDEOS RETIEVED FROM API: ", jsonResponse)

                // final variable to return
                const finalJsonResponse = JSON.parse(JSON.stringify(jsonResponse));

                // if playlist has more than 50 (=max) results, the jsonResponse has a field "nextPageToken"; then do another request to fetch the next up to 50 videos
                while (jsonResponse.nextPageToken != null) {
                    const pageToken = jsonResponse.nextPageToken
                    console.log("PAGE TOKEN", pageToken)

                    // another request to fetch videos on the next up to 50 videos
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?key=${apiKey}&part=snippet&playlistId=${playlistId}&maxResults=${50}&pageToken=${pageToken}`, {
                        method: "GET"
                    })

                    if (response.ok) {
                        // parse response to an array containing json objects
                        jsonResponse = await response.json()
                        finalJsonResponse.items.push(...jsonResponse.items)
                    }
                }

                return finalJsonResponse
            // Error handling
            } else {
                const errorData = await response.json()
                throw new Error(errorData.error?.message)
            }
        } catch (error) {
            console.error("Error fetching videos from YouTube Data API:", error)
            throw error
        }
    }

    /**
     * GET details from videos
     * @param apiKey key of the YouTube Data API
     * @returns details of each video in 'videos' state, or null in case of an error
     * @author maybe move this function to services
     */
    const fetchVideosDetailsFromYoutubeAPI = async (apiKey, videosJSON) => {
        const videoIds = videosJSON.map(video => video.videoId)

        const videoIdChunks = []
        for (let i = 0; i < videoIds.length; i += 50) {
            const chunk = videoIds.slice(i, i + 50)
            const joined = chunk.join(",")
            videoIdChunks.push(joined)
        }

        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIdChunks[0]}&part=contentDetails`, {
                method: "GET"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
            
                const finalJsonResponse = JSON.parse(JSON.stringify(jsonResponse))

                // append the remaining elements videoIds (starting from videoId #51 ...)
                for (let i = 1; i < videoIdChunks.length; i++) {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&id=${videoIdChunks[i]}&part=contentDetails`, {
                        method: "GET"
                    })

                    if (response.ok) {
                        const jsonResponse = await response.json()
                        finalJsonResponse.items.push(...jsonResponse.items)
                    }
                }

                return finalJsonResponse
            }
        } catch (error) {
            console.error("Error fetching videos from YouTube Data API:", error)
            return null
        }
    }

    /**
     * POST videos to database
     * @param rawVideosJSON as in https://developers.google.com/youtube/v3/docs/playlistItems/list?hl=de (for part=snippet)
     * @author important: this method needs to extract fields to add in extractJSONFields()!
     */
    const postVideosToDatabase = async (rawVideosJSON) => {
        // Handling of which fields to push:
        const videosJSON = extractJSONFields(rawVideosJSON.items)

        // check if payload is too large -> split payload into smaller arrays
        const videosJSONChunks = []
        if (videosJSON.length > 200) {
            for (let i = 0; i < videosJSON.length; i += 200) {
                videosJSONChunks.push(videosJSON.slice(i, i + 200))
            }
        } else {
            videosJSONChunks.push(videosJSON)
        }

        try {
            for (const videosJSONToPost of videosJSONChunks) {
                const response = await fetch('/api/videos/bulk', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(videosJSONToPost)
                })
            }
        } catch (error) {
            console.error("Error posting videos to database:", error)
        }
    } 

    /**
     * PATCH videos in database by adding certain fields
     * @param rawVideosJSON as in https://developers.google.com/youtube/v3/docs/videos/list?hl=de (for part=contentDetails)
     * @author important: this method needs to extract fields to update in extractJSONFields()!
     */
    const updateVideosInDatabase = async (rawVideosJSON) => {
        // Handling of which fields to push:
        const videosJSON = extractJSONFieldsPatchDuration(rawVideosJSON.items)

        try {
            const response = await fetch('/api/videos/bulk', {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(videosJSON)
            })
        } catch (error) {
            console.error("Error updating videos in database:", error)
        }
    }
    
    /**
     * GET all videos from database and store them in videos state
     */
    /*
    const fetchVideos = async () => {
        try {
            const response = await fetch('/api/videos', {
                method: "GET"
            })
            
            if (response.ok) {
                // parse response to an array containing json objects
                const jsonResponse = await response.json()
                dispatch({ type: "SET_VIDEOS", payload: jsonResponse })
            }
        } catch (error) {
            console.error("Error fetching videos:", error)
        }
    }
*/

    /**
     * GET all videos from database, but returning the data instead of changing the 'videos' state
     * This method is useful if an operation just needs all videos from the database to perform further operations on them.
     * @returns all videos in the database, or null in case of an error
     */
    /*
    const fetchVideosNoStateChange = async () => {
        try {
            const response = await fetch('/api/videos', {
                method: "GET"
            })
            
            if (response.ok) {
                // parse response to an array containing json objects
                const jsonResponse = await response.json()
                return jsonResponse
            }
        } catch (error) {
            console.error("Error fetching videos:", error)
            return null
        }
    }
    */

    const fetchVideosByPlaylist = async (playlistId) => {
        try {
            const response = await fetch(`/api/videos/${playlistId}`)
            if (response.ok) {
                const jsonResponse = await response.json()
                console.log("response", jsonResponse)
                dispatch({ type: "SET_VIDEOS", payload: jsonResponse })
            }
        } catch (err) {
            console.error("Error fetching videos for playlist", err);
        }
    }

    const fetchVideosByPlaylistNoStateChange = async (playlistId) => {
        try {
            const response = await fetch(`/api/videos/${playlistId}`)
            if (response.ok) {
                const jsonResponse = await response.json()
                return jsonResponse
            }
        } catch (err) {
            console.error("Error fetching videos for playlist", err);
        }
    }

    /**
     * DELETE all videos from database and clear videos state
     */
    const deleteAllVideos = async () => {
        try {
            const response = await fetch('/api/videos', {
                method: "DELETE"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
                dispatch({ type: "RESET_VIDEOS" })
            }
        } catch (error) {
            console.error("Error deleting all videos:", error)
        }
    }

    /**
     * DELETE all videos from database, but without changing the 'videos' state.
     * This method is useful if an operation just needs all videos being deleted from the database to perform further operation starting with a clean database.
     */
    const deleteAllVideosNoStateChange = async () => {
        try {
            const response = await fetch('/api/videos', {
                method: "DELETE"
            })

            if (response.ok) {
                const jsonResponse = await response.json()
            }
        } catch (error) {
            console.error("Error deleting all videos:", error)
        }
    }

    /**
     * synchronizes the content of the database with the videos of a given playlist:
     * 1) deletes all current videos in the database
     * 2) retrieve all videos from the given playlist
     * 3) post retrieved videos to database
     * 4) add further video-specific data to the database (e.g. video duration), that is not accessible over the playlist-items-fetch
     * 5) update the state of 'videos'
     * @param {*} apiKey key of the YouTube Data API
     * @param {*} playlistId id of a playlist
     * @returns object containing metadata of the fetched playlist's content
     */
    const syncVideosFromPlaylist = async (apiKey, playlistId) => {
        try {
            const rawVideosJSON = await fetchVideosByPlaylistFromYoutubeAPI(apiKey, playlistId)
            await postVideosToDatabase(rawVideosJSON)
            const videosJSON = await fetchVideosByPlaylistNoStateChange(playlistId)
            const rawVideosDetailsJSON = await fetchVideosDetailsFromYoutubeAPI(apiKey, videosJSON)
            await updateVideosInDatabase(rawVideosDetailsJSON)
            await fetchVideosByPlaylist(playlistId)
        } catch (error) {
            console.error(`An error occured while trying to sync with given playlist ${playlistId}`, error.message)
            alert(`An error occured while trying to sync with given playlist "${playlistId}":\n ${error.message}`)
        }
    }

    // HELPER METHODS
    /**
     * extracts only the necessary fields of a JSON to store in the database.
     * @param jsonData as in https://developers.google.com/youtube/v3/docs/playlistItems/list (for part=snippet)
     */
    const extractJSONFields = (jsonData) => {
        return jsonData.map(item => (
            {
                videoId: item.snippet.resourceId.videoId,
                title: item.snippet.title,
                channelTitle: item.snippet.videoOwnerChannelTitle || "-",
                position: item.snippet.position,
                playlistId: item.snippet.playlistId
            }
        ))
    }

    /**
     * extracts only the videoId and duration fields of a JSON to patch videos in the database.
     * @param jsonData as in https://developers.google.com/youtube/v3/docs/videos/list?hl=de (for part=contentDetails)
     */
    const extractJSONFieldsPatchDuration = (jsonData) => {
        return jsonData.map(item => (
            {
                videoId: item.id,
                duration: item.contentDetails.duration || "PT0M0S"
            }
        ))
    }

    /**
     * calculates the duration of all videos in the videos state and sets the state totalDuration accordingly
     */
    const calculateTotalDuration = () => {
        const total = videos.videos.reduce((sum, video) => sum + convertISOToSeconds(video.duration), 0)

        // parse the total duration back MMSS format
        const totalISO = convertSecondsToIso(total)

        setTotalDuration(totalISO)
    }

    return ( 
        // wrap whatever Components that need access to this context (here: children is <App /> => all components of the application have access to this context)
        <VideoContext.Provider value={{ 
        ...videos,
        dispatch, 
        fetchVideosByPlaylistFromYoutubeAPI,
        postVideosToDatabase,
        updateVideosInDatabase,
        fetchVideosDetailsFromYoutubeAPI,
        deleteAllVideos,
        syncVideosFromPlaylist,
        fetchVideosByPlaylist,
        numberOfVideos,
        totalDuration
        }}>
            { children }
        </VideoContext.Provider>
    )
}
