import LoginBar from "./LoginBar"
import Navbar from "./Navbar"

import '../styles/Header.css'

const Header = () => {
    return (
        <div className="Header">
            <Navbar />
            <LoginBar />
        </div>
    )
}

export default Header