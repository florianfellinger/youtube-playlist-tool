import { useState } from 'react'

import { useUserContext } from '../hooks/useUserContext'

import '../styles/LoginBar.css'

import googleLogo from '../assets/google_logo.png'
import blankProfilePicture from '../assets/user_blank_profile_picture.png'

const LoginBar = () => {
    const { performGoogleLogin, performGoogleLogout, isAuthenticated, profilePicture } = useUserContext()

    return (
        <div className="LoginBar">
            
            {isAuthenticated ? 
            <>
            <div className='profileImage-container'>
                <img src={`${profilePicture}`} />
            </div>
            <button className='googleLogin-button' onClick={performGoogleLogout}>
                <div className='googleImage-container'>
                    <img src={`${googleLogo}`} />
                </div>
                <p>Logout</p>
            </button>
            </>
            :
            <>
            <div className='profileImage-container'>
                <img src={`${blankProfilePicture}`} />
            </div>
            <button className='googleLogin-button' onClick={performGoogleLogin}>
                <div className='googleImage-container'>
                    <img src={`${googleLogo}`} />
                </div>
                <p>Login to Google</p>
            </button>
            </>
            }

        </div>
    )
}

export default LoginBar