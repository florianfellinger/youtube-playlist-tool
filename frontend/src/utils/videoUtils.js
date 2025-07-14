/**
 * converts an ISO time string to seconds
 * @param {*} duration as ISO string (e.g. "PT1M23")
 * @returns duration in seconds, as int
 */
export const convertISOToSeconds = (duration) => {
    if (duration) {
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
        const hours = parseInt(match[1]) || 0
        const minutes = parseInt(match[2]) || 0
        const seconds = parseInt(match[3]) || 0
        return hours * 3600 + minutes * 60 + seconds
    } else {
        return 0
    }
}

/**
* formats the duration attribute as retrieved as ISO standard from YouTube Data API (e.g. "PT3M48S") to common format (e.g. "3:48")
* @param duration as ISO string (e.g. "PT1M23")
* @returns string that shows duration of this video in _hours:minutes:seconds_
*/
export const convertIsoDurationToMMSS = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/

    const matches = duration.match(regex)
    if (!matches) return "00:00"

    let hours = matches[1] || "0"
    let minutes = matches[2] || "0"
    let seconds = matches[3] || "0"
        
    // handle 1-digit numbers
    // ... of minutes, only if hours is not "0"
    if (hours != "0" && minutes.length === 1) {
        minutes = "0" + minutes
    }
    // ... of seconds (always)
    if (seconds.length === 1) {
            seconds = "0" + seconds
    }
        
    return `${hours != "0" ? hours + ':' : ""}${minutes}:${seconds}`
}

export const convertSecondsToIso = (durationSeconds) => {
    const hours = Math.floor(durationSeconds / 3600)
    const minutes = Math.floor((durationSeconds - hours * 3600) / 60)
    const seconds = Math.floor(durationSeconds - (hours * 3600 + minutes * 60))
    return `PT${hours > 0 ? `${hours}H` : ""}${minutes}M${seconds}S`
}

export const convertIsoToDHHMMSS = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/

    const matches = duration.match(regex)
    if (!matches) return "00:00"

    let days = 0
    let hours = matches[1] || "0"
    let minutes = matches[2] || "0"
    let seconds = matches[3] || "0"
    
    // convert hours to days, if hours are >= 24 (= 1 day)
    if (parseInt(hours) >= 24) {
        days = Math.floor(parseInt(hours) / 24)
        hours = parseInt(hours) - (days * 24)
    }

    return `${days} Days, ${hours} Hours, ${minutes} Minutes, ${seconds} Seconds`
}

/**
* calculates the duration of all videos given as argument
* @param videos array containing videos object; each video needs to contain a field "duration" in ISO format
* @returns total duration in ISO format
*/
export const calculateTotalVideoDuration = (videos) => {
    const total = videos.reduce((sum, video) => sum + convertISOToSeconds(video.duration), 0)

    // parse the total duration back MMSS format
    const totalISO = convertSecondsToIso(total)

    return totalISO
}