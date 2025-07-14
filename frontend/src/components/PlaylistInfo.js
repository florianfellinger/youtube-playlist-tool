import '../styles/PlaylistInfo.css'

import { convertIsoDurationToMMSS, convertISOToSeconds, convertSecondsToIso, convertIsoToDHHMMSS } from "../utils/videoUtils"

import { usePlaylistContext } from '../hooks/usePlaylistContext'

const PlaylistInfo = () => {
    const { currentPlaylist } = usePlaylistContext()

    return (
        <>
        {currentPlaylist &&
        <div className="PlaylistInfo">
            <p>Loaded Playlist: </p>
            <p>{currentPlaylist.title}</p>
            <p># Videos</p>
            <p>{currentPlaylist.totalVideos}</p>
            <p>Total Duration: </p>
            <p>{convertIsoToDHHMMSS(currentPlaylist.totalDuration)}</p>
            <p>Avg. length per video: </p>
            <p>{convertIsoDurationToMMSS(convertSecondsToIso(Math.floor(convertISOToSeconds(currentPlaylist.totalDuration) / currentPlaylist.totalVideos)))}</p>
        </div>
        }
        </>
    )
}

export default PlaylistInfo