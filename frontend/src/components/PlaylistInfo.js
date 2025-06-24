import '../styles/PlaylistInfo.css'

import { convertIsoDurationToMMSS, convertISOToSeconds, convertSecondsToIso, convertIsoToDHHMMSS } from "../utils/videoUtils"

import { useVideoContext } from "../hooks/useVideoContext"

const PlaylistInfo = () => {
    const { totalDuration, videos } = useVideoContext()

    return (
        <div className="PlaylistInfo">
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