import '../styles/PlaylistInfo.css'

import { convertIsoDurationToMMSS, convertISOToSeconds, convertSecondsToIso, convertIsoToDHHMMSS } from "../utils/videoUtils"

import { useVideoContext } from "../hooks/useVideoContext"
import { usePlaylistContext } from '../hooks/usePlaylistContext'

const PlaylistInfo = () => {
    const { totalDuration, videos } = useVideoContext()
    const { playlists } = usePlaylistContext()

    return (
        <div className="PlaylistInfo">
            <p>Loaded Playlist: </p>
            <p>{playlists[0] && playlists[0].title}</p>
            <p># Videos</p>
            <p>{videos.length}</p>
            <p>Total Duration: </p>
            <p>{convertIsoToDHHMMSS(totalDuration)}</p>
            <p>Avg. length per video: </p>
            <p>{convertIsoDurationToMMSS(convertSecondsToIso(Math.floor(convertISOToSeconds(totalDuration) / videos.length)))}</p>
        </div>
    )
}

export default PlaylistInfo