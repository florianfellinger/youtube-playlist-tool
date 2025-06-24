import Panel from "../components/Panel"
import AllVideos from "../components/AllVideos"
import PlaylistInfo from "../components/PlaylistInfo"

const Home = () => {
    return (
        <div className="home">
            <Panel />
            <AllVideos />
        </div>
    )
}

export default Home