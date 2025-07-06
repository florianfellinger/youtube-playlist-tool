import { PlaylistContext } from "../context/PlaylistContext"
import { useContext } from "react"

export const usePlaylistContext = () => {
    const context = useContext(PlaylistContext)

    if (!context) {
        throw Error("usePlaylistContext must be used inside an PlaylistContextProvider!")
    }
    
    return context
}
