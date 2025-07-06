// context about data of the currently authenticated user of this session

import { createContext, useEffect, useState } from "react"

export const UserContext = createContext()

export const UserContextProvider = ({ children }) => {
    // whether a current session with an authenticated user exists
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    // image url of the user's profile picture
    const [profilePicture, setProfilePicture] = useState("")

    console.log("CONTEXT", profilePicture)

    /*
    useEffect(() => {
        getProfilePicture()
    }, [])
    */

    /**
     * open Google Login Page to perform Google Login
     */
    const performGoogleLogin = () => {
        window.location.href = 'http://localhost:4000/api/auth/google'
    }

    /**
     * logout from Google Account
     */
    const performGoogleLogout = async () => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/google-logout', {
                method: 'GET',
                credentials: 'include'
            })

            if (response.ok) {
                setIsAuthenticated(false)
                setProfilePicture("")
            } else {
                console.error("Logout failed!")
            }
        } catch (error) {
            console.error("Logout error", error)
        }
    }

    /**
     * retrieve profile picture from currently logged-in Google account
     */
    /*
    const getProfilePicture = async () => {
        const response = await fetch('http://localhost:4000/api/userData/profilePicture', {
            method: "GET",
            credentials: "include"
        })

        if (response.ok) {
            const jsonResponse = await response.json()
            setProfilePicture(jsonResponse.profilePicture)
        }
    }
        */

    const fetchCurrentUser = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });

      if (res.ok) {
        const user = await res.json();
        setProfilePicture(user.profilePicture);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setProfilePicture(null);
      }
    } catch (err) {
      console.error('Error fetching user', err);
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

    return (
        <UserContext.Provider value={{
            performGoogleLogin,
            performGoogleLogout,
            isAuthenticated,
            profilePicture
        }}>
            { children }
        </UserContext.Provider>
    )
}