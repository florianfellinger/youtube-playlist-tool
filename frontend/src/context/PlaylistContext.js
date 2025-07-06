import { createContext, useReducer, useEffect } from "react";

export const PlaylistContext = createContext()

const playlistReducer = (state, action) => {
    // state: previous state; action: operation to do and data needed for that
    switch(action.type) {
        case "SET_PLAYLISTS":
            return {
                playlists: action.payload
            }
    }
}

export const PlaylistContextProvider = ({ children }) => {
    // playlists is an object, containing a property "playlists" (an array), which contains data-objects of all playlists
    const [playlists, dispatch] = useReducer(playlistReducer, { playlists: [] })

    console.log("CONTEXT", playlists)

    // fetch all playlists to store them in state, such that components only call playlists state to access playlists data
    useEffect(() => {
        fetchPlaylists()
    }, [])

    const fetchPlaylistDetailsFromYoutubeAPI = async (apiKey, playlistId) => {
        try {
            const response = await fetch(`https://www.googleapis.com/youtube/v3/playlists?key=${apiKey}&id=${playlistId}&part=snippet`, {
                method: "GET"
            })

            if (response.ok) {
                let jsonResponse = await response.json()
                console.log("PLAYLIST:", jsonResponse)
                return jsonResponse
            }
        } catch (error) {
            console.error("Error fetching playlist from YouTube Data API:", error)
        }
    }

    const postPlaylistToDatabase = async (rawPlaylistJSON) => {
        // Handling of which fields to push:
        console.log("...posting...")
        const playlistJSON = extractJSONFields(rawPlaylistJSON.items)

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
        console.log("fetching...")
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

    const syncPlaylists = async (apiKey, playlistId) => {
        try {
            const rawPlaylistDetailsJSON = await fetchPlaylistDetailsFromYoutubeAPI(apiKey, playlistId)
            await postPlaylistToDatabase(rawPlaylistDetailsJSON)
            await fetchPlaylists()
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
        return jsonData.map(item => (
            {
                playlistId: item.id,
                title: item.snippet.title,
                channelTitle: item.snippet.channelTitle || "-"
            }
        ))
    }

    return (
        // wrap whatever Components that need access to this context (here: children is <App /> => all components of the application have access to this context)
        <PlaylistContext.Provider value={{
            ...playlists,
            dispatch,
            syncPlaylists
        }}>
            { children }
        </PlaylistContext.Provider>
    )
}