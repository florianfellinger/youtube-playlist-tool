import '../styles/PlaylistsMenu.css'

import { usePlaylistContext } from '../hooks/usePlaylistContext'
import { useVideoContext } from '../hooks/useVideoContext'

/**
 * display the contents of the top panel (above all videos)
 */
const PlaylistsMenu = () => {
    const { playlists, setCurrentPlaylistId } = usePlaylistContext()
    const { fetchVideosByPlaylist } = useVideoContext()

    /**
     * calls method in VideoContext to retrieve all videos from database matching the given playlistId
     * @param playlistId id of the playlist to retrieve all videos from
     */
    const handleClick = (playlistId) => {
        fetchVideosByPlaylist(playlistId)
        setCurrentPlaylistId(playlistId)
    }

    return (
        <div className="PlaylistsMenu">
        {
            playlists.map((playlist) => (
            <div onClick={() => handleClick(playlist.playlistId)}>
                {playlist.title}
            </div>
            ))
        }
        </div>
    )
}

export default PlaylistsMenu