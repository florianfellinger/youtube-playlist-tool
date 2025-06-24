import '../styles/Video.css'

import { convertIsoDurationToMMSS } from "../utils/videoUtils"

const Video = (props) => {
    return (
        <div className="Video">

            <div className='left-side'>
                <div className='position'>
                    {props.position + 1}
                </div>
            </div>

            <div className='middle-side'>
                <div className='middle-top'>
                    <div className='title'>
                        {props.title}
                    </div>
                </div>
                <div className='middle-bottom'>
                    <div className='channelTitle'>
                        {props.channelTitle}
                    </div>
                    <div className='video-link'>
                        <a href={`https://www.youtube.com/watch?v=${props.videoId}&list=${props.playlistId}`}>To Video</a>
                    </div>
                </div>
            </div>

            <div className='right-side'>
                <div className='duration'>
                    {props.duration && convertIsoDurationToMMSS(props.duration)}
                </div>
            </div>

        </div>
    )
}

export default Video