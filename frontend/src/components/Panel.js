import PlaylistInfo from "./PlaylistInfo"
import PlaylistInput from "./PlaylistInput"
import PlaylistEdit from "./PlaylistEdit"

import '../styles/Panel.css'
import PlaylistsMenu from "./PlaylistsMenu"

/**
 * display the contents of the top panel (above all videos)
 */
const Panel = () => {
    return (
        <div className="Panel">
            <PlaylistInput />
            <PlaylistInfo />
            <PlaylistsMenu />
        </div>
    )
}

export default Panel