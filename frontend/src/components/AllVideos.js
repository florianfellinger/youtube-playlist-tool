import '../styles/AllVideos.css'

import Video from "./Video"

import { useEffect } from "react"

import { useVideoContext } from "../hooks/useVideoContext"

const AllVideos = () => {

    const { videos, fetchVideos } = useVideoContext()

    useEffect(() => {
        fetchVideos()
    }, [])

    const renderAllVideos = () => {
        return videos.map((video) => {
            return (
              <Video 
                key={video._id} 
                videoId={video.videoId}
                position={video.position}
                title={video.title}
                channelTitle={video.channelTitle}
                duration={video.duration}
                playlistId={video.playlistId}

              />
              )
            }
        )
    }

    return (
        <div className="AllVideos">
            {renderAllVideos()}
        </div>
    )
}

export default AllVideos