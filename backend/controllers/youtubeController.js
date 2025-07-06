// POST video to playlist
const addVideoToPlaylist = async (req, res) => {
    const accessToken = req.user.accessToken
    const { videoId, playlistId, position } = req.body

    console.log("VIDEO ID", videoId)
    console.log("PLAYLIST ID", playlistId)
    console.log("ACCESS TOKEN", accessToken)

    try {
        const response = await fetch('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                snippet: {
                    playlistId: playlistId,
                    resourceId: {
                        kind: 'youtube#video',
                        videoId: videoId
                    },
                    position: position
                }
            })
        })

        const jsonResponse = await response.json()

        if (!response.ok) {
            return res.status(response.status).json({ error: jsonResponse })
        }

        res.status(200).json({ success: true, jsonResponse })

    } catch (error) {
        res.status(400).json({ error: error.message })
    }
}

module.exports = {
    addVideoToPlaylist
}